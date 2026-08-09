import { getTripBoard, insertExpense, writeActor } from "../../../db/store";

export async function POST(request: Request) {
  try {
    const actor = await writeActor(request);
    if (!actor) return Response.json({ error: "サインインが必要です" }, { status: 401 });
    const payload = (await request.json()) as {
      title?: string;
      amountYen?: number;
      payer?: string;
      category?: string;
      occurredOn?: string;
      status?: "draft" | "confirmed";
    };
    const id = await insertExpense(
      {
        title: payload.title ?? "",
        amountYen: Number(payload.amountYen),
        payer: payload.payer,
        category: payload.category,
        occurredOn: payload.occurredOn,
        status: payload.status ?? "draft",
        source: actor === "OpenClos" ? "discord" : "site",
      },
      actor,
    );
    return Response.json({ id, board: await getTripBoard() }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "費用を追加できませんでした" },
      { status: 400 },
    );
  }
}
