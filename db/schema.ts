import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";

export const trips = sqliteTable(
  "trips",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    concept: text("concept").notNull(),
    routeLabel: text("route_label").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    status: text("status").notNull().default("provisional"),
    budgetMinYen: integer("budget_min_yen").notNull().default(50000),
    budgetMaxYen: integer("budget_max_yen").notNull().default(80000),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("idx_trips_slug").on(table.slug)],
);

export const participants = sqliteTable(
  "participants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tripId: integer("trip_id").notNull().references(() => trips.id),
    discordUserId: text("discord_user_id").notNull(),
    displayName: text("display_name").notNull(),
  },
  (table) => [
    uniqueIndex("idx_participants_trip_discord").on(
      table.tripId,
      table.discordUserId,
    ),
  ],
);

export const planEntries = sqliteTable(
  "plan_entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tripId: integer("trip_id").notNull().references(() => trips.id),
    date: text("date").notNull().default(""),
    time: text("time").notNull().default(""),
    title: text("title").notNull(),
    details: text("details").notNull().default(""),
    status: text("status").notNull().default("proposed"),
    source: text("source").notNull().default("site"),
    sortOrder: integer("sort_order").notNull().default(100),
    costYen: integer("cost_yen").notNull().default(0),
    createdBy: text("created_by").notNull().default("OpenClos"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_plan_entries_trip_status_sort").on(
      table.tripId,
      table.status,
      table.sortOrder,
    ),
  ],
);

export const receipts = sqliteTable(
  "receipts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tripId: integer("trip_id").notNull().references(() => trips.id),
    objectKey: text("object_key").notNull(),
    filename: text("filename").notNull(),
    contentType: text("content_type").notNull(),
    merchant: text("merchant").notNull().default(""),
    amountYen: integer("amount_yen").notNull().default(0),
    rawText: text("raw_text").notNull().default(""),
    ocrStatus: text("ocr_status").notNull().default("pending"),
    uploadedBy: text("uploaded_by").notNull().default("OpenClos"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_receipts_object_key").on(table.objectKey),
    index("idx_receipts_trip_created").on(table.tripId, table.createdAt),
  ],
);

export const expenses = sqliteTable(
  "expenses",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tripId: integer("trip_id").notNull().references(() => trips.id),
    title: text("title").notNull(),
    amountYen: integer("amount_yen").notNull(),
    payer: text("payer").notNull().default("共有"),
    category: text("category").notNull().default("その他"),
    occurredOn: text("occurred_on").notNull().default(""),
    status: text("status").notNull().default("draft"),
    source: text("source").notNull().default("site"),
    receiptId: integer("receipt_id").references(() => receipts.id),
    createdBy: text("created_by").notNull().default("OpenClos"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_expenses_trip_status_created").on(
      table.tripId,
      table.status,
      table.createdAt,
    ),
  ],
);

export const activity = sqliteTable(
  "activity",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tripId: integer("trip_id").notNull().references(() => trips.id),
    kind: text("kind").notNull(),
    summary: text("summary").notNull(),
    actor: text("actor").notNull(),
    externalId: text("external_id"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_activity_external_id").on(table.externalId),
    index("idx_activity_trip_created").on(table.tripId, table.createdAt),
  ],
);
