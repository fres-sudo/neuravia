export interface ActivityResult {
  patientId: number;
  activityType: 'initial_assessment' | 'mri_upload' | 'weekly_form' | 'game_played';
  rawData: any;
  timestamp?: Date;
}

export interface BoostUpdate {
  previousScore: number;
  newScore: number;
  activityValue: number;
  weight: number;
}


export class BoostScoreService {

    async calculateMriUpload(results: any): Promise<number> {
      // Convert 4 probabilities to single score
      const probs = results.probabilities; // [healthy, mild, moderate, severe]

      // Weighted approach: healthy=100, mild=70, moderate=40, severe=10
      const classScores = [100, 70, 40, 10];
      let weightedScore = 0;

      probs.forEach((prob: number, index: number) => {
        weightedScore += prob * (classScores[index] ?? 0);
      });

      return Math.max(0, Math.min(100, weightedScore));
    }

    async calculateInitialAssessment(responses: any): Promise<number> {
        return 100;
    }

    async calculateWeeklyForm(responses: any): Promise<number> {
      const avgScore = responses.reduce((sum: number, val: number) => sum + val, 0) / responses.length;

      // Convert 1-5 scale to 0-100, with some adjustment
      return Math.max(0, Math.min(100, (avgScore - 1) * 25));
    }

    async calculateGamePlayed(gameScore: number): Promise<number> {
        return gameScore;
    }
}
