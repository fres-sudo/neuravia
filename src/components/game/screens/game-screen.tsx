// In game-screen.tsx, update the session completion effect:

import { useGameStore, type GameType } from "@/stores/game-store";
import { SceneCrasherGame } from "../modes/scene-crasher-game";
import { GameTimer } from "../game-timer";
import { ExitButton } from "../exit-button";
import { InstructionModal } from "../modals/instruction-modal";
import { ProgressBar } from "../progress-bar";
import { GameTitle } from "../game-title";
import { FlashingMemoryGame } from "../modes/flashing-memory-game";
import { TodoListGame } from "../modes/todo-list-game";
import { HawkEyeGame } from "../modes/hawk-eye-game";
import { useGameScoring } from "@/hooks/use-game-scoring";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {BoostScoreService} from "@/scoring/service";
import {api} from "@/trpc/react";
import {skipToken} from "@tanstack/query-core"; // Add this import
import { toast } from "sonner";

const boostService = new BoostScoreService();

export const GameScreen = () => {
	const isPlaying = useGameStore((state) => state.isPlaying);
	const currentGame = useGameStore((state) => state.currentGame);
	const session = useGameStore((state) => state.session);
	const patientId = useGameStore((state) => state.patientId);
	const { saveSessionScore } = useGameScoring();
	const insertScoreMutation = api.scoring.insert.useMutation();

	const router = useRouter(); // Add router hook
	const [isSessionComplete, setIsSessionComplete] = useState(false);

	const latestScoreQuery = api.scoring.getLatestScore.useQuery(
	  patientId ? { patientId } : skipToken
	);

	// Handle session completion
	useEffect(() => {
	  if (!session || isSessionComplete) return;
	  if (session.currentRound <= session.totalRounds - 1) return;
	  if (latestScoreQuery.isLoading) return;

	  const handleSessionComplete = async () => {
		setIsSessionComplete(true);

		try {
		  toast.success(`Session completed! Score: ${session.score}`);

		  // prepare sessionData
		  const sessionData = {
			totalScore: session.score,
			averageScore: session.score / Math.max(session.gamesCompleted.length, 1),
			sessionDuration: Date.now() - session.startTime.getTime(),
			gamesCompleted: session.gamesCompleted,
			rawData: session.rawData,
			sessionMode: session.mode,
		  };
		  console.log('Saving sessionData', sessionData);

		  if (!latestScoreQuery.data || latestScoreQuery.isLoading) return;

		  const previousScore = latestScoreQuery.data?.newScore ?? 0;

		  // prepare boost score
		  const scoreData = boostService.prepareScoreData({
			patientId: patientId!,
			activityType: 'game_played',
			activityValue: session.score,
			previousScore: previousScore,
			metadata: {},
		  });

		  await insertScoreMutation.mutateAsync(scoreData);
		  console.log('Score saved successfully');

		  if (patientId) {
			// await saveSessionScore(patientId, sessionData);

			// safely parse caregiverId
			const pathParts = window.location.pathname.split('/');
			const roomIndex = pathParts.indexOf('room');
			const caregiverId =
			  roomIndex !== -1 && roomIndex + 1 < pathParts.length
				? pathParts[roomIndex + 1]
				: null;

			if (caregiverId) {
			  router.push(`/room/${caregiverId}/${patientId}/`);
			} else {
			  router.push('/dashboard');
			}
		  }
		} catch (err) {
		  console.error('Error saving session', err);
		  router.push('/dashboard');
		}
	  };

	  handleSessionComplete();
	}, [latestScoreQuery.data, latestScoreQuery.isLoading, session, patientId, saveSessionScore, insertScoreMutation, router, isSessionComplete]);

	if (!isPlaying) return null;

	// Show completion message while redirecting
	if (isSessionComplete) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
				<div className="text-center p-8 bg-white rounded-2xl shadow-lg">
					<h2 className="text-3xl font-bold text-gray-700 mb-4">
						Great Job! 🎉
					</h2>
					<p className="text-lg text-gray-600 mb-4">
						Session completed successfully!
					</p>
					<p className="text-sm text-gray-500 mt-2">If you want to play again, reload the page!</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 space-y-6 pt-10">
			<ProgressBar />
			<GameTitle />

			<div className="flex-1 px-8 py-4 flex items-center justify-center">
				<div className="w-full max-w-4xl">
					{currentGame === "scene-crasher" && <SceneCrasherGame />}
					{currentGame === "flashing-memory" && <FlashingMemoryGame />}
					{currentGame === "hawk-eye" && <HawkEyeGame />}
					{currentGame === "todo-list" && <TodoListGame />}
				</div>
			</div>

			<GameTimer />
			<ExitButton />
			<InstructionModal />
		</div>
	);
};