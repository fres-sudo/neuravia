import {
	sqliteTable,
	text,
	integer,
	foreignKey,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at", {
		mode: "timestamp",
	}),
	refreshTokenExpiresAt: integer("refresh_token_expires_at", {
		mode: "timestamp",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }),
	updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ---------------------------------------------

// Caregiver settings table (1:1 with caregivers)
export const caregiverSettings = sqliteTable(
	"caregiver_settings",
	{
		caregiverId: text("caregiver_id").primaryKey(),
		settings: text("settings", { mode: "json" }), // JSON column
		updatedAt: text("updated_at").default(sql`(datetime('now'))`),
	},
	(table) => [
		foreignKey({
			columns: [table.caregiverId],
			foreignColumns: [user.id],
			name: "caregiver_settings_caregiver_id_fk",
		}).onDelete("cascade"),
	]
);

// Patients table
export const patients = sqliteTable(
	"patients",
	{
		id: text("id").primaryKey(), // UUID as text
		caregiverId: text("caregiver_id").notNull(),
		name: text("name").notNull(),
		age: integer("age").notNull(),
		job: text("job", { mode: "json" }), // JSON column for job object
		initialInfo: text("initial_info", { mode: "json" }), // JSON column
		lastActiveAt: text("last_active_at"),
		createdAt: text("created_at").default(sql`(datetime('now'))`),
		updatedAt: text("updated_at").default(sql`(datetime('now'))`),
		emojis: text("emojis"), // Comma-separated emojis
	},
	(table) => [
		foreignKey({
			columns: [table.caregiverId],
			foreignColumns: [user.id],
			name: "patients_caregiver_id_fk",
		}).onDelete("cascade"),
	]
);

// Patient settings table (1:1 with patients)
export const patientSettings = sqliteTable(
	"patient_settings",
	{
		patientId: text("patient_id").primaryKey(),
		settings: text("settings", { mode: "json" }),
		updatedAt: text("updated_at").default(sql`(datetime('now'))`),
	},
	(table) => [
		foreignKey({
			columns: [table.patientId],
			foreignColumns: [patients.id],
			name: "patient_settings_patient_id_fk",
		}).onDelete("cascade"),
	]
);

// Activity templates table
export const activityTemplates = sqliteTable("activity_templates", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	configSchema: text("config_schema", { mode: "json" }),
	softSkillWeights: text("soft_skill_weights", { mode: "json" }),
});

export const levelDefinitions = sqliteTable(
	"level_definitions",
	{
		id: text("id").primaryKey(),
		activityTemplateId: integer("activity_template_id").notNull(),
		level: integer("level").notNull(),
		difficulty: text("difficulty").notNull(),
		description: text("description").notNull(),
		content: text("content", { mode: "json" }),
	},
	(table) => [
		foreignKey({
			columns: [table.activityTemplateId],
			foreignColumns: [activityTemplates.id],
			name: "level_definitions_activity_template_id_fk",
		}).onDelete("cascade"),
	]
);

// Activity instances table
export const activityInstances = sqliteTable(
	"activity_instances",
	{
		id: text("id").primaryKey(),
		patientId: text("patient_id").notNull(),
		activityTemplateId: integer("activity_template_id").notNull(),
		levelPlayedId: integer("level_played_id").notNull(),
		startedAt: text("started_at"),
		completedAt: text("completed_at"),
		status: text("status", {
			enum: ["not_started", "in_progress", "completed", "failed"],
		}).default("not_started"),
		rawInteractionData: text("raw_interaction_data"),
		performanceSummary: text("performance_summary", { mode: "json" }),
		softSkillScores: text("soft_skill_scores", { mode: "json" }),
	},
	(table) => [
		foreignKey({
			columns: [table.patientId],
			foreignColumns: [patients.id],
			name: "activity_instances_patient_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.activityTemplateId],
			foreignColumns: [activityTemplates.id],
			name: "activity_instances_activity_template_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.levelPlayedId],
			foreignColumns: [levelDefinitions.id],
			name: "activity_instances_level_played_id_fk",
		}).onDelete("cascade"),
	]
);

// Diaries table
export const diaries = sqliteTable(
	"diaries",
	{
		id: text("id").primaryKey(), // UUID as text
		patientId: text("patient_id").notNull(),
		createdAt: text("created_at").default(sql`(datetime('now'))`),
		weekStart: text("week_start").notNull(), // Date as text (ISO format)
		responses: text("responses", { mode: "json" }).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.patientId],
			foreignColumns: [patients.id],
			name: "diaries_patient_id_fk",
		}).onDelete("cascade"),
	]
);

// Images table
export const images = sqliteTable(
	"images",
	{
		id: text("id").primaryKey(), // UUID as text
		patientId: text("patient_id").notNull(),
		filename: text("filename").notNull(),
		uploadedAt: text("uploaded_at").default(sql`(datetime('now'))`),
		results: text("results", { mode: "json" }), // JSON column for results
	},
	(table) => [
		foreignKey({
			columns: [table.patientId],
			foreignColumns: [patients.id],
			name: "images_patient_id_fk",
		}).onDelete("cascade"),
	]
)

export const boostScores = sqliteTable(
    "boost_scores",
    {
        id: text("id").primaryKey(), // UUID as text
        patientId: text("patient_id").notNull(),
        timestamp: text("timestamp").default(sql`(datetime('now'))`),
        activityType: text("activity_type").notNull(), // 'initial_assessment', 'mri_upload', 'weekly_form', 'game_played'
        previousScore: integer("previous_score"),
        newScore: integer("new_score").notNull(),
        activityValue: integer("activity_value").notNull(), // Raw score from the activity
        weight: integer("weight").notNull(), // Weight applied (0.1 to 1.0)
        metadata: text("metadata", { mode: "json" }), // Additional info as JSON
    },
    (table) => [
        foreignKey({
            columns: [table.patientId],
            foreignColumns: [patients.id],
            name: "boost_scores_patient_id_fk",
        }).onDelete("cascade"),
    ]
)

// Relations
export const caregiversRelations = relations(user, ({ one, many }) => ({
	settings: one(caregiverSettings, {
		fields: [user.id],
		references: [caregiverSettings.caregiverId],
	}),
	patients: many(patients),
}));

export const caregiverSettingsRelations = relations(
	caregiverSettings,
	({ one }) => ({
		caregiver: one(user, {
			fields: [caregiverSettings.caregiverId],
			references: [user.id],
		}),
	})
);

export const patientsRelations = relations(patients, ({ one, many }) => ({
	caregiver: one(user, {
		fields: [patients.caregiverId],
		references: [user.id],
	}),
	settings: one(patientSettings, {
		fields: [patients.id],
		references: [patientSettings.patientId],
	}),
	activityInstances: many(activityInstances),
	diaries: many(diaries),
}));

export const patientSettingsRelations = relations(
	patientSettings,
	({ one }) => ({
		patient: one(patients, {
			fields: [patientSettings.patientId],
			references: [patients.id],
		}),
	})
);

export const activityTemplatesRelations = relations(
	activityTemplates,
	({ one, many }) => ({
		levelDefinition: one(levelDefinitions, {
			fields: [activityTemplates.id],
			references: [levelDefinitions.activityTemplateId],
		}),
		activityInstances: many(activityInstances),
	})
);

export const levelDefinitionsRelations = relations(
	levelDefinitions,
	({ one, many }) => ({
		activityTemplate: one(activityTemplates, {
			fields: [levelDefinitions.activityTemplateId],
			references: [activityTemplates.id],
		}),
		activityInstances: many(activityInstances),
	})
);

export const activityInstancesRelations = relations(
	activityInstances,
	({ one }) => ({
		patient: one(patients, {
			fields: [activityInstances.patientId],
			references: [patients.id],
		}),
		activityTemplate: one(activityTemplates, {
			fields: [activityInstances.activityTemplateId],
			references: [activityTemplates.id],
		}),
		levelPlayed: one(levelDefinitions, {
			fields: [activityInstances.levelPlayedId],
			references: [levelDefinitions.id],
		}),
	})
);

export const diariesRelations = relations(diaries, ({ one }) => ({
	patient: one(patients, {
		fields: [diaries.patientId],
		references: [patients.id],
	}),
}));

export const imagesRelations = relations(images, ({ one }) => ({
	patient: one(patients, {
		fields: [images.patientId],
		references: [patients.id],
	}),
}));

// Type exports for TypeScript
export type Caregiver = typeof user.$inferSelect;
export type NewCaregiver = typeof user.$inferInsert;

export type CaregiverSetting = typeof caregiverSettings.$inferSelect;
export type NewCaregiverSetting = typeof caregiverSettings.$inferInsert;

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;

export type PatientSetting = typeof patientSettings.$inferSelect;
export type NewPatientSetting = typeof patientSettings.$inferInsert;

export type ActivityTemplate = typeof activityTemplates.$inferSelect;
export type NewActivityTemplate = typeof activityTemplates.$inferInsert;

export type LevelDefinition = typeof levelDefinitions.$inferSelect;
export type NewLevelDefinition = typeof levelDefinitions.$inferInsert;

export type ActivityInstance = typeof activityInstances.$inferSelect;
export type NewActivityInstance = typeof activityInstances.$inferInsert;

export type Diary = typeof diaries.$inferSelect;
export type NewDiary = typeof diaries.$inferInsert;
