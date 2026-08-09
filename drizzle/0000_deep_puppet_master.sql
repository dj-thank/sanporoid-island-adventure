CREATE TABLE `activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trip_id` integer NOT NULL,
	`kind` text NOT NULL,
	`summary` text NOT NULL,
	`actor` text NOT NULL,
	`external_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_activity_external_id` ON `activity` (`external_id`);--> statement-breakpoint
CREATE INDEX `idx_activity_trip_created` ON `activity` (`trip_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trip_id` integer NOT NULL,
	`title` text NOT NULL,
	`amount_yen` integer NOT NULL,
	`payer` text DEFAULT '共有' NOT NULL,
	`category` text DEFAULT 'その他' NOT NULL,
	`occurred_on` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`source` text DEFAULT 'site' NOT NULL,
	`receipt_id` integer,
	`created_by` text DEFAULT 'OpenClos' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receipt_id`) REFERENCES `receipts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_expenses_trip_status_created` ON `expenses` (`trip_id`,`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `participants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trip_id` integer NOT NULL,
	`discord_user_id` text NOT NULL,
	`display_name` text NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_participants_trip_discord` ON `participants` (`trip_id`,`discord_user_id`);--> statement-breakpoint
CREATE TABLE `plan_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trip_id` integer NOT NULL,
	`date` text DEFAULT '' NOT NULL,
	`time` text DEFAULT '' NOT NULL,
	`title` text NOT NULL,
	`details` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'proposed' NOT NULL,
	`source` text DEFAULT 'site' NOT NULL,
	`sort_order` integer DEFAULT 100 NOT NULL,
	`cost_yen` integer DEFAULT 0 NOT NULL,
	`created_by` text DEFAULT 'OpenClos' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_plan_entries_trip_status_sort` ON `plan_entries` (`trip_id`,`status`,`sort_order`);--> statement-breakpoint
CREATE TABLE `receipts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trip_id` integer NOT NULL,
	`object_key` text NOT NULL,
	`filename` text NOT NULL,
	`content_type` text NOT NULL,
	`merchant` text DEFAULT '' NOT NULL,
	`amount_yen` integer DEFAULT 0 NOT NULL,
	`raw_text` text DEFAULT '' NOT NULL,
	`ocr_status` text DEFAULT 'pending' NOT NULL,
	`uploaded_by` text DEFAULT 'OpenClos' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_receipts_object_key` ON `receipts` (`object_key`);--> statement-breakpoint
CREATE INDEX `idx_receipts_trip_created` ON `receipts` (`trip_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `trips` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`concept` text NOT NULL,
	`route_label` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text DEFAULT 'provisional' NOT NULL,
	`budget_min_yen` integer DEFAULT 50000 NOT NULL,
	`budget_max_yen` integer DEFAULT 80000 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_trips_slug` ON `trips` (`slug`);