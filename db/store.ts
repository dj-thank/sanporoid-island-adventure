import { env } from "cloudflare:workers";

type TripEnv = {
  DB?: D1Database;
  RECEIPTS?: R2Bucket;
  OPENCLOS_BOT_TOKEN?: string;
};

type PlanInput = {
  date?: string;
  time?: string;
  title: string;
  details?: string;
  status?: "proposed" | "adopted" | "rejected";
  source?: string;
  sortOrder?: number;
  costYen?: number;
};

type ExpenseInput = {
  title: string;
  amountYen: number;
  payer?: string;
  category?: string;
  occurredOn?: string;
  status?: "draft" | "confirmed";
  source?: string;
  receiptId?: number | null;
};

const TRIP_SLUG = "island-weekend-2026";
const DISCORD_ROUTE_RECONCILIATION = "reconcile:discord-route-choice:v2";

const currentRouteIdeas: Array<PlanInput> = [
  {
    date: "8/29–9/1",
    title: "神津島＋伊豆大島｜天上山から火山へ",
    details: "8/29に神津島へ入り、8/30に伊豆大島へ移る案。8/31は大島で過ごし、9/1に東京へ戻る。島間の同日接続、宿、復路、料金は未確認。9/2延長も予備案に残す。",
    status: "proposed",
    source: "discord",
    sortOrder: 10,
  },
  {
    date: "8/29–9/1",
    title: "神津島＋新島｜山のあと、白い海へ",
    details: "8/29に神津島へ入り、8/30に新島へ移る案。8/31は新島で過ごし、9/1に東京へ戻る。島間の同日接続、宿、復路、料金は未確認。9/2延長も予備案に残す。",
    status: "proposed",
    source: "discord",
    sortOrder: 20,
  },
  {
    date: "大島案",
    time: "8/30 18:30ごろ",
    title: "元町で島ごはんと作戦会議",
    details: "大島案を選んだ場合の夜の過ごし方。島ごはんを囲みながら翌日の動きを決める。店と時間はルート決定後に確認する。",
    status: "proposed",
    source: "discord",
    sortOrder: 30,
  },
  {
    date: "新島案",
    time: "8/31 17:00ごろ",
    title: "夕日から、まました温泉へ",
    details: "新島案を選んだ場合の夕方。予定を詰めず、景色と温泉を続けて楽しむ。天候で順番を入れ替える。",
    status: "proposed",
    source: "discord",
    sortOrder: 40,
  },
];

export function bindings() {
  return env as unknown as TripEnv;
}

export function database(): D1Database {
  const db = bindings().DB;
  if (!db) throw new Error("D1 binding DB is unavailable");
  return db;
}

export function receiptBucket(): R2Bucket {
  const bucket = bindings().RECEIPTS;
  if (!bucket) throw new Error("R2 binding RECEIPTS is unavailable");
  return bucket;
}

export async function ensureTripStore() {
  const db = database();
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS trips (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, concept TEXT NOT NULL, route_label TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'provisional', budget_min_yen INTEGER NOT NULL DEFAULT 50000, budget_max_yen INTEGER NOT NULL DEFAULT 80000, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS participants (id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id INTEGER NOT NULL, discord_user_id TEXT NOT NULL, display_name TEXT NOT NULL, FOREIGN KEY (trip_id) REFERENCES trips(id))"),
    db.prepare("CREATE TABLE IF NOT EXISTS plan_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id INTEGER NOT NULL, date TEXT NOT NULL DEFAULT '', time TEXT NOT NULL DEFAULT '', title TEXT NOT NULL, details TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'proposed', source TEXT NOT NULL DEFAULT 'site', sort_order INTEGER NOT NULL DEFAULT 100, cost_yen INTEGER NOT NULL DEFAULT 0, created_by TEXT NOT NULL DEFAULT 'OpenClos', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (trip_id) REFERENCES trips(id))"),
    db.prepare("CREATE TABLE IF NOT EXISTS receipts (id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id INTEGER NOT NULL, object_key TEXT NOT NULL UNIQUE, filename TEXT NOT NULL, content_type TEXT NOT NULL, merchant TEXT NOT NULL DEFAULT '', amount_yen INTEGER NOT NULL DEFAULT 0, raw_text TEXT NOT NULL DEFAULT '', ocr_status TEXT NOT NULL DEFAULT 'pending', uploaded_by TEXT NOT NULL DEFAULT 'OpenClos', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (trip_id) REFERENCES trips(id))"),
    db.prepare("CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id INTEGER NOT NULL, title TEXT NOT NULL, amount_yen INTEGER NOT NULL, payer TEXT NOT NULL DEFAULT '共有', category TEXT NOT NULL DEFAULT 'その他', occurred_on TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft', source TEXT NOT NULL DEFAULT 'site', receipt_id INTEGER, created_by TEXT NOT NULL DEFAULT 'OpenClos', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (trip_id) REFERENCES trips(id), FOREIGN KEY (receipt_id) REFERENCES receipts(id))"),
    db.prepare("CREATE TABLE IF NOT EXISTS activity (id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id INTEGER NOT NULL, kind TEXT NOT NULL, summary TEXT NOT NULL, actor TEXT NOT NULL, external_id TEXT UNIQUE, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (trip_id) REFERENCES trips(id))"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_trip_discord ON participants(trip_id, discord_user_id)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_plan_entries_trip_status_sort ON plan_entries(trip_id, status, sort_order)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_expenses_trip_status_created ON expenses(trip_id, status, created_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_receipts_trip_created ON receipts(trip_id, created_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_activity_trip_created ON activity(trip_id, created_at)"),
  ]);

  let trip = await db
    .prepare("SELECT * FROM trips WHERE slug = ?")
    .bind(TRIP_SLUG)
    .first<Record<string, unknown>>();

  if (!trip) {
    await db
      .prepare("INSERT INTO trips (slug, title, concept, route_label, start_date, end_date, status, budget_min_yen, budget_max_yen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(
        TRIP_SLUG,
        "俺たちの島旅",
        "友達との旅行。神津島から始めて、次の島を大島か新島から選ぶ。",
        "再調整中｜神津島＋大島 / 新島",
        "2026-08-29",
        "2026-09-01",
        "reconsidering",
        0,
        0,
      )
      .run();
    trip = await db
      .prepare("SELECT * FROM trips WHERE slug = ?")
      .bind(TRIP_SLUG)
      .first<Record<string, unknown>>();
  }

  const tripId = Number(trip?.id);
  await db.batch([
    db.prepare("INSERT INTO participants (trip_id, discord_user_id, display_name) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM participants WHERE trip_id = ? AND discord_user_id = ?)").bind(tripId, "june", "June", tripId, "june"),
    db.prepare("INSERT INTO participants (trip_id, discord_user_id, display_name) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM participants WHERE trip_id = ? AND discord_user_id = ?)").bind(tripId, "512529641026617344", "りも", tripId, "512529641026617344"),
  ]);

  await reconcileDiscordRouteChoice(db, tripId);

  for (const entry of currentRouteIdeas) {
    await db.prepare("INSERT INTO plan_entries (trip_id, date, time, title, details, status, source, sort_order, cost_yen, created_by) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM plan_entries WHERE trip_id = ? AND date = ? AND time = ? AND title = ?)").bind(
      tripId,
      entry.date ?? "",
      entry.time ?? "",
      entry.title,
      entry.details ?? "",
      entry.status ?? "proposed",
      entry.source ?? "site",
      entry.sortOrder ?? 100,
      entry.costYen ?? 0,
      "OpenClos",
      tripId,
      entry.date ?? "",
      entry.time ?? "",
      entry.title,
    ).run();
  }
  await addActivity(tripId, "seed", "神津島を共通にした2案を旅行ボードへ登録", "OpenClos", "seed:island-weekend-2026:v2");

  await db.prepare("PRAGMA optimize").run();
  return { db, tripId };
}

async function reconcileDiscordRouteChoice(db: D1Database, tripId: number) {
  const alreadyReconciled = await db
    .prepare("SELECT id FROM activity WHERE external_id = ?")
    .bind(DISCORD_ROUTE_RECONCILIATION)
    .first();
  if (alreadyReconciled) return;

  const trip = await db
    .prepare("SELECT route_label AS routeLabel FROM trips WHERE id = ?")
    .bind(tripId)
    .first<{ routeLabel: string }>();
  if (trip?.routeLabel !== "A｜大島 → 新島") return;

  await db.batch([
    db.prepare("UPDATE trips SET concept = ?, route_label = ?, status = ?, budget_min_yen = 0, budget_max_yen = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind("友達との旅行。神津島から始めて、次の島を大島か新島から選ぶ。", "再調整中｜神津島＋大島 / 新島", "reconsidering", tripId),
    db.prepare("UPDATE plan_entries SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE trip_id = ? AND status = 'adopted' AND title IN (?, ?, ?, ?)")
      .bind(tripId, "東京・竹芝 発", "大島 着", "大島 → 新島", "新島 → 東京"),
    db.prepare("UPDATE plan_entries SET date = ?, title = ?, details = ?, sort_order = 10, updated_at = CURRENT_TIMESTAMP WHERE trip_id = ? AND title = ?")
      .bind(currentRouteIdeas[0].date, currentRouteIdeas[0].title, currentRouteIdeas[0].details, tripId, "8/29 本土→神津島、8/30 神津島→伊豆大島、8/31 伊豆大島泊、9/1 伊豆大島→本土案"),
    db.prepare("UPDATE plan_entries SET date = ?, title = ?, details = ?, sort_order = 20, updated_at = CURRENT_TIMESTAMP WHERE trip_id = ? AND title = ?")
      .bind(currentRouteIdeas[1].date, currentRouteIdeas[1].title, currentRouteIdeas[1].details, tripId, "8/29 本土→神津島、8/30 神津島→新島、8/31 新島泊、9/1 新島→本土案"),
    db.prepare("UPDATE plan_entries SET date = ?, time = ?, title = ?, details = ?, sort_order = 30, updated_at = CURRENT_TIMESTAMP WHERE trip_id = ? AND title = ?")
      .bind(currentRouteIdeas[2].date, currentRouteIdeas[2].time, currentRouteIdeas[2].title, currentRouteIdeas[2].details, tripId, "8/30 18:30ごろ、大島・元町で島ごはんを食べながら作戦会議"),
    db.prepare("UPDATE plan_entries SET date = ?, time = ?, title = ?, details = ?, source = 'discord', sort_order = 40, updated_at = CURRENT_TIMESTAMP WHERE trip_id = ? AND title = ?")
      .bind(currentRouteIdeas[3].date, currentRouteIdeas[3].time, currentRouteIdeas[3].title, currentRouteIdeas[3].details, tripId, "夕日を見て、まました温泉へ"),
    db.prepare("UPDATE plan_entries SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE trip_id = ? AND title IN (?, ?)")
      .bind(tripId, "候補を『神津島+伊豆大島』または『神津島+新島』のどちらかに絞る案", "俺たちの予定は再調整中（神津島+伊豆大島 / 神津島+新島）"),
  ]);

  await addActivity(tripId, "route-reset", "Discordの訂正に合わせ、神津島を共通にした2案へ再調整", "OpenClos", DISCORD_ROUTE_RECONCILIATION);
}

export async function getTripBoard() {
  const { db, tripId } = await ensureTripStore();
  const trip = await db.prepare("SELECT id, slug, title, concept, route_label AS routeLabel, start_date AS startDate, end_date AS endDate, status, budget_min_yen AS budgetMinYen, budget_max_yen AS budgetMaxYen, updated_at AS updatedAt FROM trips WHERE id = ?").bind(tripId).first();
  const participants = (await db.prepare("SELECT id, discord_user_id AS discordUserId, display_name AS displayName FROM participants WHERE trip_id = ? ORDER BY id").bind(tripId).all()).results;
  const plans = (await db.prepare("SELECT id, date, time, title, details, status, source, sort_order AS sortOrder, cost_yen AS costYen, created_by AS createdBy, created_at AS createdAt, updated_at AS updatedAt FROM plan_entries WHERE trip_id = ? ORDER BY CASE status WHEN 'adopted' THEN 0 WHEN 'proposed' THEN 1 ELSE 2 END, sort_order, id").bind(tripId).all()).results;
  const expenses = (await db.prepare("SELECT id, title, amount_yen AS amountYen, payer, category, occurred_on AS occurredOn, status, source, receipt_id AS receiptId, created_by AS createdBy, created_at AS createdAt FROM expenses WHERE trip_id = ? ORDER BY created_at DESC, id DESC").bind(tripId).all()).results;
  const receipts = (await db.prepare("SELECT id, filename, merchant, amount_yen AS amountYen, ocr_status AS ocrStatus, uploaded_by AS uploadedBy, created_at AS createdAt FROM receipts WHERE trip_id = ? ORDER BY created_at DESC, id DESC LIMIT 12").bind(tripId).all()).results;
  const recentActivity = (await db.prepare("SELECT id, kind, summary, actor, created_at AS createdAt FROM activity WHERE trip_id = ? ORDER BY created_at DESC, id DESC LIMIT 10").bind(tripId).all()).results;

  return { trip, participants, plans, expenses, receipts, activity: recentActivity };
}

export async function insertPlanEntry(input: PlanInput, actor: string, knownTripId?: number) {
  const { db, tripId } = knownTripId
    ? { db: database(), tripId: knownTripId }
    : await ensureTripStore();
  const title = cleanText(input.title, 120);
  if (!title) throw new Error("予定のタイトルが必要です");
  const status = input.status && ["proposed", "adopted", "rejected"].includes(input.status)
    ? input.status
    : "proposed";
  const result = await db
    .prepare("INSERT INTO plan_entries (trip_id, date, time, title, details, status, source, sort_order, cost_yen, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(
      tripId,
      cleanText(input.date ?? "", 32),
      cleanText(input.time ?? "", 32),
      title,
      cleanText(input.details ?? "", 1000),
      status,
      cleanText(input.source ?? "site", 40),
      safeInteger(input.sortOrder, 100, 0, 10000),
      safeInteger(input.costYen, 0, 0, 10_000_000),
      cleanText(actor, 100),
    )
    .run();
  await db.prepare("UPDATE trips SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(tripId).run();
  await addActivity(tripId, "plan", `${status === "adopted" ? "採用" : "提案"}: ${title}`, actor);
  return Number(result.meta.last_row_id);
}

export async function updatePlanStatus(id: number, status: string, actor: string) {
  if (!["proposed", "adopted", "rejected"].includes(status)) throw new Error("不正な予定ステータスです");
  const { db, tripId } = await ensureTripStore();
  const row = await db.prepare("SELECT title FROM plan_entries WHERE id = ? AND trip_id = ?").bind(id, tripId).first<{ title: string }>();
  if (!row) throw new Error("予定が見つかりません");
  await db.prepare("UPDATE plan_entries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND trip_id = ?").bind(status, id, tripId).run();
  await db.prepare("UPDATE trips SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(tripId).run();
  await addActivity(tripId, "plan-status", `${status === "adopted" ? "採用" : status === "rejected" ? "見送り" : "再提案"}: ${row.title}`, actor);
}

export async function insertExpense(input: ExpenseInput, actor: string) {
  const { db, tripId } = await ensureTripStore();
  const title = cleanText(input.title, 120);
  const amount = safeInteger(input.amountYen, -1, 0, 10_000_000);
  if (!title || amount < 0) throw new Error("費目と0円以上の金額が必要です");
  const status = input.status === "confirmed" ? "confirmed" : "draft";
  const result = await db
    .prepare("INSERT INTO expenses (trip_id, title, amount_yen, payer, category, occurred_on, status, source, receipt_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(
      tripId,
      title,
      amount,
      cleanText(input.payer ?? "共有", 60),
      cleanText(input.category ?? "その他", 60),
      cleanText(input.occurredOn ?? "", 20),
      status,
      cleanText(input.source ?? "site", 40),
      input.receiptId ? safeInteger(input.receiptId, 0, 1, Number.MAX_SAFE_INTEGER) : null,
      cleanText(actor, 100),
    )
    .run();
  await db.prepare("UPDATE trips SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(tripId).run();
  await addActivity(tripId, "expense", `${status === "confirmed" ? "確定" : "下書き"}: ${title} ¥${amount.toLocaleString("ja-JP")}`, actor);
  return Number(result.meta.last_row_id);
}

export async function addActivity(tripId: number, kind: string, summary: string, actor: string, externalId?: string) {
  const db = database();
  const cleanExternalId = externalId ? cleanText(externalId, 160) : null;
  if (cleanExternalId) {
    await db.prepare("INSERT INTO activity (trip_id, kind, summary, actor, external_id) SELECT ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM activity WHERE external_id = ?)")
      .bind(tripId, cleanText(kind, 40), cleanText(summary, 300), cleanText(actor, 100), cleanExternalId, cleanExternalId)
      .run();
    return;
  }
  await db.prepare("INSERT INTO activity (trip_id, kind, summary, actor, external_id) VALUES (?, ?, ?, ?, NULL)")
    .bind(tripId, cleanText(kind, 40), cleanText(summary, 300), cleanText(actor, 100))
    .run();
}

export async function externalActionExists(externalId: string) {
  const { db } = await ensureTripStore();
  const row = await db.prepare("SELECT id FROM activity WHERE external_id = ?").bind(cleanText(externalId, 160)).first();
  return Boolean(row);
}

export async function writeReceiptRecord(input: {
  objectKey: string;
  filename: string;
  contentType: string;
  merchant?: string;
  amountYen?: number;
  rawText?: string;
  ocrStatus?: string;
}, actor: string) {
  const { db, tripId } = await ensureTripStore();
  const result = await db.prepare("INSERT INTO receipts (trip_id, object_key, filename, content_type, merchant, amount_yen, raw_text, ocr_status, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(
    tripId,
    cleanText(input.objectKey, 300),
    cleanText(input.filename, 180),
    cleanText(input.contentType, 100),
    cleanText(input.merchant ?? "", 120),
    safeInteger(input.amountYen, 0, 0, 10_000_000),
    cleanText(input.rawText ?? "", 5000),
    ["pending", "read", "needs-review", "confirmed"].includes(input.ocrStatus ?? "") ? input.ocrStatus! : "pending",
    cleanText(actor, 100),
  ).run();
  await addActivity(tripId, "receipt", `領収書を登録: ${cleanText(input.filename, 80)}`, actor);
  return Number(result.meta.last_row_id);
}

export async function writeActor(request: Request): Promise<string | null> {
  const auth = request.headers.get("authorization") ?? "";
  const token = bindings().OPENCLOS_BOT_TOKEN ?? "";
  if (token && auth === `Bearer ${token}`) return "OpenClos";

  const userId = request.headers.get("oai-authenticated-user-id");
  const email = request.headers.get("oai-authenticated-user-email");
  if (userId) return cleanText(email || userId, 100);

  const host = new URL(request.url).hostname;
  if (host === "localhost" || host === "127.0.0.1") return "local-preview";
  return null;
}

export async function requireBot(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const token = bindings().OPENCLOS_BOT_TOKEN ?? "";
  if (!token || auth !== `Bearer ${token}`) throw new Error("BOT_UNAUTHORIZED");
  return "OpenClos";
}

export function cleanText(value: unknown, maxLength: number) {
  // eslint-disable-next-line no-control-regex -- API input is normalized by removing ASCII control characters.
  return String(value ?? "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, maxLength);
}

export function safeInteger(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}
