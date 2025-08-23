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

export interface ScoreInsertData {
  patientId: string;
  activityType: 'initial_assessment' | 'mri_upload' | 'weekly_form' | 'game_played';
  activityValue: number;
  previousScore?: number;
  weight?: number;
  metadata?: any;
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
        return 80;
    }

    async calculateWeeklyForm(responses: any): Promise<number> {
      const avgScore = responses.reduce((sum: number, val: number) => sum + val, 0) / responses.length;

      // Convert 1-5 scale to 0-100, with some adjustment
      return Math.max(0, Math.min(100, (avgScore - 1) * 25));
    }

    async calculateGamePlayed(gameScore: number): Promise<number> {
        return gameScore;
    }

    // Calculate new score based on previous score and activity boost
    calculateNewScore(previousScore: number, activityValue: number, weight: number): number {
        // Boost algorithm: newScore = previousScore + (activityValue - previousScore) * weight
        const boost = (activityValue - previousScore) * weight;
        const newScore = previousScore + boost;
        
        // Ensure score stays within 0-100 range
        return Math.max(0, Math.min(100, newScore));
    }

    // Get default weight for each activity type
    getDefaultWeight(activityType: 'initial_assessment' | 'mri_upload' | 'weekly_form' | 'game_played'): number {
        switch (activityType) {
            case 'initial_assessment':
                return 1.0; // Full weight for initial assessment
            case 'mri_upload':
                return 0.8; // High weight for MRI analysis
            case 'weekly_form':
                return 0.6; // Medium weight for weekly forms
            case 'game_played':
                return 0.4; // Lower weight for games
            default:
                return 0.5;
        }
    }

    // Helper method to prepare score data for insertion
    prepareScoreData(data: ScoreInsertData): {
        patientId: string;
        activityType: 'initial_assessment' | 'mri_upload' | 'weekly_form' | 'game_played';
        previousScore: number;
        newScore: number;
        activityValue: number;
        weight: number;
        metadata?: any;
    } {
        const weight = data.weight ?? this.getDefaultWeight(data.activityType);
        const previousScore = data.previousScore ?? 0;
        const newScore = this.calculateNewScore(previousScore, data.activityValue, weight);

        return {
            patientId: data.patientId,
            activityType: data.activityType,
            previousScore,
            newScore,
            activityValue: data.activityValue,
            weight,
            metadata: data.metadata,
        };
    }
}
