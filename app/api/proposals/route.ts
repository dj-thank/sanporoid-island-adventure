import { getTripBoard, insertPlanEntry, writeActor } from "../../../db/store";

export async function POST(request: Request) {
  try {
    const actor = await writeActor(request);
    if (!actor) return Response.json({ error: "サインインが必要です" }, { status: 401 });
    const payload = (await request.json()) as {
      title?: string;
      date?: string;
      time?: string;
      details?: string;
      status?: "proposed" | "adopted";
      costYen?: number;
    };
    const id = await insertPlanEntry(
      {
        title: payload.title ?? "",
        date: payload.date,
        time: payload.time,
        details: payload.details,
        status: payload.status ?? "proposed",
        costYen: payload.costYen,
        source: actor === "OpenClos" ? "discord" : "site",
      },
      actor,
    );
    return Response.json({ id, board: await getTripBoard() }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "提案を追加できませんでした" },
      { status: 400 },
    );
  }
}
