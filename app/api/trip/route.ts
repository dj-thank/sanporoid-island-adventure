import { getTripBoard } from "../../../db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await getTripBoard(), {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "旅行データを読めませんでした" },
      { status: 500 },
    );
  }
}
