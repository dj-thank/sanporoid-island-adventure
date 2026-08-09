import { getTripBoard, updatePlanStatus, writeActor } from "../../../../db/store";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await writeActor(request);
    if (!actor) return Response.json({ error: "サインインが必要です" }, { status: 401 });
    const { id } = await context.params;
    const payload = (await request.json()) as { status?: string };
    await updatePlanStatus(Number(id), payload.status ?? "", actor);
    return Response.json({ board: await getTripBoard() });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "予定を更新できませんでした" },
      { status: 400 },
    );
  }
}
