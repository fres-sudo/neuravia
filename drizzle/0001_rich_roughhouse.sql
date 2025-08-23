CREATE TABLE `activity_instances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
CREATE TABLE `activity_templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`config_schema` text,
	`soft_skill_weights` text
);
--> statement-breakpoint
CREATE TABLE `caregiver_settings` (
	`caregiver_id` integer PRIMARY KEY NOT NULL,
	`settings` text,
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`caregiver_id`) REFERENCES `caregivers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `caregivers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text,
	`password_hash` text,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`provider` text,
	`provider_id` text,
	`country` text,
	`city` text,
	`phone_number` text,
	`birth_year` integer,
	`last_login_at` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `caregivers_email_unique` ON `caregivers` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `caregivers_provider_id_unique` ON `caregivers` (`provider_id`);--> statement-breakpoint
CREATE TABLE `diaries` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`week_start` text NOT NULL,
	`responses` text NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `level_definitions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`activity_template_id` integer NOT NULL,
	`level` integer NOT NULL,
	`difficulty` text NOT NULL,
	`description` text NOT NULL,
	`content` text,
	FOREIGN KEY (`activity_template_id`) REFERENCES `activity_templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `patient_settings` (
	`patient_id` text PRIMARY KEY NOT NULL,
	`settings` text,
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `patients` (
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
	FOREIGN KEY (`caregiver_id`) REFERENCES `caregivers`(`id`) ON UPDATE no action ON DELETE cascade
);
