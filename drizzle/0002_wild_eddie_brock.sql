DROP TABLE `caregivers`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_caregiver_settings` (
	`caregiver_id` integer PRIMARY KEY NOT NULL,
	`settings` text,
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`caregiver_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_caregiver_settings`("caregiver_id", "settings", "updated_at") SELECT "caregiver_id", "settings", "updated_at" FROM `caregiver_settings`;--> statement-breakpoint
DROP TABLE `caregiver_settings`;--> statement-breakpoint
ALTER TABLE `__new_caregiver_settings` RENAME TO `caregiver_settings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_patients` (
	`id` text PRIMARY KEY NOT NULL,
	`caregiver_id` integer NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`personality_description` text,
	`job` text,
	`initial_info` text,
	`last_active_at` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`caregiver_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_patients`("id", "caregiver_id", "name", "age", "personality_description", "job", "initial_info", "last_active_at", "created_at", "updated_at") SELECT "id", "caregiver_id", "name", "age", "personality_description", "job", "initial_info", "last_active_at", "created_at", "updated_at" FROM `patients`;--> statement-breakpoint
DROP TABLE `patients`;--> statement-breakpoint
ALTER TABLE `__new_patients` RENAME TO `patients`;