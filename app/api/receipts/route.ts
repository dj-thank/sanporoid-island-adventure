import {
  getTripBoard,
  receiptBucket,
  writeActor,
  writeReceiptRecord,
} from "../../../db/store";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const actor = await writeActor(request);
    if (!actor) return Response.json({ error: "サインインが必要です" }, { status: 401 });
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("画像またはPDFが必要です");
    if (!ALLOWED_TYPES.has(file.type)) throw new Error("JPEG、PNG、WebP、PDFのみ対応しています");
    if (file.size > MAX_BYTES) throw new Error("ファイルは10MB以下にしてください");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100) || "receipt";
    const objectKey = `island-weekend-2026/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    await receiptBucket().put(objectKey, file.stream(), {
      httpMetadata: { contentType: file.type },
      customMetadata: { uploadedBy: actor },
    });
    const id = await writeReceiptRecord(
      {
        objectKey,
        filename: file.name,
        contentType: file.type,
        ocrStatus: "pending",
      },
      actor,
    );
    return Response.json({ id, board: await getTripBoard() }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "領収書を保存できませんでした" },
      { status: 400 },
    );
  }
}
