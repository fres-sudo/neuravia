import z from "zod";

export const createPatientSchema = z.object({
	name: z.string(),
	age: z.number(),
	gender: z.enum(["male", "female", "other"]).optional(),
	educationLevel: z.string().optional(),
	job: z
		.object({
			type: z.enum([
				"engineer",
				"teacher",
				"doctor",
				"artist",
				"lawyer",
				"other",
			]),
			customLabel: z.string().optional(),
		})
		.optional(),
	initialInfo: z
		.object({
			diagnosis: z.enum(["none", "suspected", "confirmed"]).optional(),
			stage: z.enum(["mild", "moderate", "severe"]).optional(),
			otherConditions: z.array(z.string()).optional(),
			medications: z.array(z.string()).optional(),
			cognitiveAndFunctional: z
				.object({
					memoryShortTerm: z.number().int().min(1).max(5),
					orientation: z.number().int().min(1).max(5),
					language: z.number().int().min(1).max(5),
					dailyActivities: z.number().int().min(1).max(5),
					moodBehavior: z.number().int().min(1).max(5),
				})
				.optional(),
			biggestPassion: z
				.object({
					type: z.enum(["soccer", "mountain", "gardening", "music", "other"]),
					customLabel: z.string().optional(),
				})
				.optional(),
			notes: z.string().optional(),
		})
		.optional(),
});
