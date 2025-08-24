import { useCallback } from "react";
import { api } from "@/trpc/react";
import { BoostScoreService } from "@/scoring/service";
import { toast } from "sonner";

export const useGameScoring = () => {
  const insertScoreMutation = api.scoring.insertWithPreviousScore.useMutation();

  const saveSessionScore = useCallback(async (
    patientId: string,
    sessionData: {
      totalScore: number;
      averageScore: number;
      sessionDuration: number;
      gamesCompleted: string[];
      rawData: any;
      sessionMode: string;
    }
  ) => {
    try {
      const boostService = new BoostScoreService();
      
      // Calculate game score from comprehensive session data
      const activityValue = await boostService.calculateGamePlayed(sessionData);
      
      // Insert the score
      await insertScoreMutation.mutateAsync({
        patientId,
        activityType: 'game_played',
        activityValue,
        metadata: {
          sessionData,
          timestamp: new Date().toISOString(),
        },
      });

      toast.success(`Session completed! Score: ${activityValue.toFixed(1)}`);
      return activityValue;
    } catch (error) {
      console.error("Failed to save session score:", error);
      toast.error("Failed to save session score");
      throw error;
    }
  }, [insertScoreMutation]);

  return {
    saveSessionScore,
    isSaving: insertScoreMutation.isPending,
  };
};
