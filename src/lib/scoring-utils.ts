import { BoostScoreService } from "@/scoring/service";

const boostService = new BoostScoreService();

/**
 * Utility function to insert a score for any activity
 * This can be used throughout the application when activities are completed
 */
export async function insertActivityScore(
	patientId: string,
	activityType:
		| "initial_assessment"
		| "mri_upload"
		| "weekly_form"
		| "game_played",
	activityValue: number,
	previousScore?: number,
	metadata?: any
) {
	const scoreData = boostService.prepareScoreData({
		patientId,
		activityType,
		activityValue,
		previousScore,
		metadata,
	});

	// This would typically be called via tRPC mutation
	// For now, we return the prepared data
	return scoreData;
}

/**
 * Calculate MRI upload score from probabilities
 */
export async function calculateMriScore(
	probabilities: number[]
): Promise<number> {
	return await boostService.calculateMriUpload({ probabilities });
}

/**
 * Calculate weekly form score from responses
 */
export async function calculateWeeklyFormScore(
	responses: number[]
): Promise<number> {
	return await boostService.calculateWeeklyForm(responses);
}

/**
 * Calculate game score (pass-through for now)
 */
export async function calculateGameScore(gameScore: number): Promise<number> {
	return await boostService.calculateGamePlayed(gameScore);
}

/**
 * Get the default weight for an activity type
 */
export function getActivityWeight(
	activityType:
		| "initial_assessment"
		| "mri_upload"
		| "weekly_form"
		| "game_played"
): number {
	return boostService.getDefaultWeight(activityType);
}

/**
 * Calculate new score from previous score and activity value
 */
export function calculateNewScore(
	previousScore: number,
	activityValue: number,
	weight: number
): number {
	return boostService.calculateNewScore(previousScore, activityValue, weight);
}
