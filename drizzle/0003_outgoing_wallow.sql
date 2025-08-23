PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activity_instances` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`activity_template_id` integer NOT NULL,
	`level_played_id` integer NOT NULL,
	`started_at` text,
	`completed_at` text,
	`status` text DEFAULT 'not_started',
	`raw_interaction_data` text,
	`performance_summary` text,
	`soft_skill_scores` text,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`activity_template_id`) REFERENCES `activity_templates`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`level_played_id`) REFERENCES `level_definitions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_activity_instances`("id", "patient_id", "activity_template_id", "level_played_id", "started_at", "completed_at", "status", "raw_interaction_data", "performance_summary", "soft_skill_scores") SELECT "id", "patient_id", "activity_template_id", "level_played_id", "started_at", "completed_at", "status", "raw_interaction_data", "performance_summary", "soft_skill_scores" FROM `activity_instances`;--> statement-breakpoint
DROP TABLE `activity_instances`;--> statement-breakpoint
ALTER TABLE `__new_activity_instances` RENAME TO `activity_instances`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_activity_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`config_schema` text,
	`soft_skill_weights` text
);
--> statement-breakpoint
INSERT INTO `__new_activity_templates`("id", "name", "config_schema", "soft_skill_weights") SELECT "id", "name", "config_schema", "soft_skill_weights" FROM `activity_templates`;--> statement-breakpoint
DROP TABLE `activity_templates`;--> statement-breakpoint
ALTER TABLE `__new_activity_templates` RENAME TO `activity_templates`;--> statement-breakpoint
CREATE TABLE `__new_caregiver_settings` (
	`caregiver_id` text PRIMARY KEY NOT NULL,
	`settings` text,
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`caregiver_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_caregiver_settings`("caregiver_id", "settings", "updated_at") SELECT "caregiver_id", "settings", "updated_at" FROM `caregiver_settings`;--> statement-breakpoint
DROP TABLE `caregiver_settings`;--> statement-breakpoint
ALTER TABLE `__new_caregiver_settings` RENAME TO `caregiver_settings`;--> statement-breakpoint
CREATE TABLE `__new_level_definitions` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_template_id` integer NOT NULL,
	`level` integer NOT NULL,
	`difficulty` text NOT NULL,
	`description` text NOT NULL,
	`content` text,
	FOREIGN KEY (`activity_template_id`) REFERENCES `activity_templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_level_definitions`("id", "activity_template_id", "level", "difficulty", "description", "content") SELECT "id", "activity_template_id", "level", "difficulty", "description", "content" FROM `level_definitions`;--> statement-breakpoint
DROP TABLE `level_definitions`;--> statement-breakpoint
ALTER TABLE `__new_level_definitions` RENAME TO `level_definitions`;--> statement-breakpoint
CREATE TABLE `__new_patients` (
	`id` text PRIMARY KEY NOT NULL,
	`caregiver_id` text NOT NULL,
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