import {
  addActivity,
  database,
  ensureTripStore,
  externalActionExists,
  getTripBoard,
  inferTripRouteChoice,
  insertExpense,
  insertPlanEntry,
  receiptBucket,
  requireBot,
  selectTripRoute,
  type TripRouteChoice,
  updatePlanStatus,
  writeReceiptRecord,
} from "../../../../db/store";

type AgentAction =
  | { type: "trip.route.select"; route: TripRouteChoice }
  | {
      type: "proposal.add";
      title: string;
      date?: string;
      time?: string;
      details?: string;
      costYen?: number;
      adopt?: boolean;
    }
  | { type: "proposal.status"; id: number; status: "proposed" | "adopted" | "rejected" }
  | {
      type: "expense.add";
      title: string;
      amountYen: number;
      payer?: string;
      category?: string;
      occurredOn?: string;
      confirmed?: boolean;
      receiptId?: number;
    }
  | {
      type: "receipt.fromDiscord";
      attachmentUrl: string;
      filename?: string;
      merchant?: string;
      amountYen?: number;
      rawText?: string;
      confirmed?: boolean;
    };

function requestedRoute(actions: AgentAction[]) {
  let route: TripRouteChoice | null = null;
  for (const action of actions) {
    if (action.type === "trip.route.select") route = action.route;
    if (action.type === "proposal.add" && action.adopt) {
      route = inferTripRouteChoice(action.title, action.details) ?? route;
    }
  }
  return route;
}

function routeReceipt(
  board: Awaited<ReturnType<typeof getTripBoard>>,
  key: string,
  actionCount: number,
  expectedRoute: TripRouteChoice | null,
) {
  const expectedLabel = expectedRoute === "kozushima-niijima"
    ? "決定｜神津島 → 新島"
    : expectedRoute === "kozushima-oshima"
      ? "決定｜神津島 → 伊豆大島"
      : null;
  const routeVerified = expectedLabel === null || (
    board.trip?.status === "planning" && board.trip?.routeLabel === expectedLabel
  );
  return {
    idempotencyKey: key,
    actionCount,
    routeLabel: board.trip?.routeLabel,
    tripStatus: board.trip?.status,
    routeVerified,
    updatedAt: board.trip?.updatedAt,
  };
}

export async function POST(request: Request) {
  try {
    const actor = await requireBot(request);
    const payload = (await request.json()) as {
      idempotencyKey?: string;
      summary?: string;
      actions?: AgentAction[];
    };
    const key = String(payload.idempotencyKey ?? "").trim().slice(0, 160);
    if (!key) throw new Error("idempotencyKey is required");
    const actions = Array.isArray(payload.actions) ? payload.actions.slice(0, 10) : [];
    if (!actions.length) throw new Error("actions are required");
    const expectedRoute = requestedRoute(actions);
    if (await externalActionExists(key)) {
      const board = await getTripBoard();
      const receipt = routeReceipt(board, key, actions.length, expectedRoute);
      return Response.json({ ok: receipt.routeVerified, duplicate: true, receipt, board }, {
        status: receipt.routeVerified ? 200 : 409,
      });
    }

    for (const action of actions) {
      if (action.type === "trip.route.select") {
        await selectTripRoute(action.route, actor);
      } else if (action.type === "proposal.add") {
        await insertPlanEntry(
          {
            title: action.title,
            date: action.date,
            time: action.time,
            details: action.details,
            costYen: action.costYen,
            status: action.adopt ? "adopted" : "proposed",
            source: "discord",
          },
          actor,
        );
      } else if (action.type === "proposal.status") {
        await updatePlanStatus(action.id, action.status, actor);
      } else if (action.type === "expense.add") {
        await insertExpense(
          {
            title: action.title,
            amountYen: action.amountYen,
            payer: action.payer,
            category: action.category,
            occurredOn: action.occurredOn,
            status: action.confirmed ? "confirmed" : "draft",
            source: "discord",
            receiptId: action.receiptId,
          },
          actor,
        );
      } else if (action.type === "receipt.fromDiscord") {
        const source = new URL(action.attachmentUrl);
        if (!["cdn.discordapp.com", "media.discordapp.net"].includes(source.hostname)) {
          throw new Error("Discord CDN attachments only");
        }
        const response = await fetch(source, { redirect: "error" });
        if (!response.ok || !response.body) throw new Error("領収書画像を取得できませんでした");
        const type = response.headers.get("content-type")?.split(";")[0] ?? "application/octet-stream";
        if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(type)) {
          throw new Error("未対応の領収書形式です");
        }
        const length = Number(response.headers.get("content-length") ?? "0");
        if (length > 10 * 1024 * 1024) throw new Error("領収書は10MB以下にしてください");
        const filename = (action.filename || source.pathname.split("/").pop() || "discord-receipt").slice(0, 180);
        const objectKey = `island-weekend-2026/${Date.now()}-${crypto.randomUUID()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
        await receiptBucket().put(objectKey, response.body, {
          httpMetadata: { contentType: type },
          customMetadata: { uploadedBy: actor, source: "discord" },
        });
        const receiptId = await writeReceiptRecord(
          {
            objectKey,
            filename,
            contentType: type,
            merchant: action.merchant,
            amountYen: action.amountYen,
            rawText: action.rawText,
            ocrStatus: action.confirmed ? "confirmed" : "needs-review",
          },
          actor,
        );
        if (Number(action.amountYen) > 0) {
          await insertExpense(
            {
              title: action.merchant || "領収書からの費用",
              amountYen: Number(action.amountYen),
              status: action.confirmed ? "confirmed" : "draft",
              source: "receipt-ocr",
              receiptId,
            },
            actor,
          );
        }
      }
    }

    const { tripId } = await ensureTripStore();
    await addActivity(
      tripId,
      "agent-update",
      String(payload.summary || `${actions.length}件を更新`).slice(0, 300),
      actor,
      key,
    );
    await database().prepare("UPDATE trips SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(tripId).run();
    const board = await getTripBoard();
    const receipt = routeReceipt(board, key, actions.length, expectedRoute);
    return Response.json({ ok: receipt.routeVerified, duplicate: false, receipt, board }, {
      status: receipt.routeVerified ? 200 : 409,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新できませんでした";
    return Response.json(
      { error: message },
      { status: message === "BOT_UNAUTHORIZED" ? 401 : 400 },
    );
  }
}
