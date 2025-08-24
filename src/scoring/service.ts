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

    async calculateInitialAssessment(initialInfo: any): Promise<number> {
      // Calculate base score from diagnosis and stage
      let baseScore = this.calculateBaseScore(initialInfo.diagnosis, initialInfo.stage);

      // If notes are provided, use LLM to adjust the score
      if (initialInfo.notes && initialInfo.notes.trim().length > 0) {
        const adjustedScore = await this.adjustScoreWithLLM(baseScore, initialInfo.notes, initialInfo.diagnosis, initialInfo.stage);
        return Math.max(1, Math.min(100, adjustedScore));
      }
      return baseScore;
    }

    async calculateWeeklyForm(responses: any): Promise<number> {
      const avgScore = responses.reduce((sum: number, val: number) => sum + val, 0) / responses.length;

      // Convert 1-5 scale to 0-100, with some adjustment
      return Math.max(0, Math.min(100, (avgScore - 1) * 25));
    }

    async calculateGamePlayed(sessionData: any): Promise<number> {
        // Calculate score based on comprehensive session data
        const { totalScore, averageScore, gamesCompleted, rawData } = sessionData;
        
        // Base score from average performance
        let baseScore = averageScore;
        
        // Bonus for completing all games
        if (gamesCompleted.length >= 4) {
            baseScore += 10;
        }
        
        // Bonus for consistency (low variance in scores)
        const scores = Object.values(rawData).map((gameData: any) => {
            if (Array.isArray(gameData.rounds)) {
                return gameData.rounds.reduce((sum: number, round: any) => sum + round.score, 0) / gameData.rounds.length;
            }
            return 0;
        }).filter(score => score > 0);
        
        if (scores.length > 1) {
            const variance = scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length;
            const consistencyBonus = Math.max(0, 15 - variance);
            baseScore += consistencyBonus;
        }
        
        // Penalty for slow performance
        const sessionDuration = sessionData.sessionDuration || 0;
        const timePenalty = Math.max(0, (sessionDuration - 300000) / 60000); // Penalty after 5 minutes
        baseScore = Math.max(0, baseScore - timePenalty);
        
        // Ensure score is within 0-100 range
        return Math.max(0, Math.min(100, baseScore));
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

    private calculateBaseScore(diagnosis: string, stage: string): number {
      // Base scores for diagnosis
      const diagnosisScores = {
        'None': 85,        // No Alzheimer's - high score
        'Suspected': 65,   // Suspected - medium-high score
        'Confirmed': 45    // Confirmed - lower base score
      };

      // Stage modifiers (only apply if diagnosis is Suspected or Confirmed)
      const stageModifiers = {
        'Mild': 0,         // No additional penalty
        'Moderate': -15,   // Reduce score by 15
        'Severe': -30      // Reduce score by 30
      };

      let score = diagnosisScores[diagnosis as keyof typeof diagnosisScores] || 50;

      // Apply stage modifier only if there's a diagnosis
      if (diagnosis !== 'None' && stage) {
        const modifier = stageModifiers[stage as keyof typeof stageModifiers] || 0;
        score += modifier;
      }

      return Math.max(1, Math.min(100, score));
    }

    private async adjustScoreWithLLM(baseScore: number, notes: string, diagnosis: string, stage: string): Promise<number> {
        console.log('Adjusting score with LLM, baseScore:', baseScore, 'notes:', notes);
        const prompt = `You are a medical AI assistant helping to assess Alzheimer's disease severity for initial patient scoring.
    
    CONTEXT:
    - Current base score: ${baseScore}/100 (where 100 = healthy, 1 = severe Alzheimer's)
    - Diagnosis: ${diagnosis}
    - Stage: ${stage || 'Not specified'}
    - Caregiver notes: "${notes}"
    
    TASK:
    Based ONLY on the additional information in the caregiver notes, suggest a small adjustment to the base score (-10 to +10 points maximum).
    
    GUIDELINES:
    - Focus on functional abilities, behavioral changes, and cognitive symptoms mentioned
    - Positive indicators (good memory, independence, stable mood) = small increase (+1 to +5)
    - Concerning symptoms (confusion, agitation, dependency) = small decrease (-1 to -10)  
    - If notes are neutral or don't add clinical insight = no change (0)
    - Be conservative with adjustments
    
    RESPONSE FORMAT:
    Return only a single integer between -10 and +10 representing the adjustment to add to the base score.
    Examples: -5, 0, +3
    
    Adjustment:`;

        try {
          const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              model: 'gpt-4o-mini',
              temperature: 0.1
            }),
          });

          if (!response.ok) {
            console.error('LLM adjustment failed, using base score');
            return baseScore;
          }

          const data = await response.json();
          const adjustment = parseInt(data.response.trim());

          // Validate adjustment is within bounds
          if (isNaN(adjustment) || adjustment < -10 || adjustment > 10) {
            console.warn('Invalid LLM adjustment, using base score');
            return baseScore;
          }

          return baseScore + adjustment;

        } catch (error) {
          console.error('Error calling LLM for score adjustment:', error);
          return baseScore; // Fallback to base score if LLM fails
        }
    }
}
