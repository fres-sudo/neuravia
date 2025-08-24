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
import { useRouter } from "next/navigation"; // Add this import

export const GameScreen = () => {
	const isPlaying = useGameStore((state) => state.isPlaying);
	const currentGame = useGameStore((state) => state.currentGame);
	const session = useGameStore((state) => state.session);
	const patientId = useGameStore((state) => state.patientId);
	const { saveSessionScore } = useGameScoring();
	
	const router = useRouter(); // Add router hook
	const [isSessionComplete, setIsSessionComplete] = useState(false);

	// Handle session completion
	useEffect(() => {
		if (session && session.currentRound > session.totalRounds && !isSessionComplete) {
			setIsSessionComplete(true);
			
			// Session is complete, save the score
			const sessionData = {
				totalScore: session.score,
				averageScore: session.score / Math.max(session.gamesCompleted.length, 1),
				sessionDuration: Date.now() - session.startTime.getTime(),
				gamesCompleted: session.gamesCompleted,
				rawData: session.rawData,
				sessionMode: session.mode,
			};

			if (patientId) {
				saveSessionScore(patientId, sessionData)
					.then(() => {
						// Get caregiver ID from URL path: /room/caregiverId/patientId
						const pathParts = window.location.pathname.split('/');
						const roomIndex = pathParts.indexOf('room');
						
						if (roomIndex !== -1 && roomIndex + 1 < pathParts.length) {
							const caregiverId = pathParts[roomIndex + 1];
							// Redirect back to the room welcome screen
							router.push(`/room/${caregiverId}/${patientId}`);
						} else {
							// Fallback redirect if we can't determine caregiver ID
							console.warn('Could not determine caregiver ID from URL');
							router.push('/dashboard'); // or wherever you want to redirect as fallback
						}
					})
					.catch((error) => {
						console.error('Failed to save session, but redirecting anyway:', error);
						// Still redirect even if save failed
						const pathParts = window.location.pathname.split('/');
						const roomIndex = pathParts.indexOf('room');
						
						if (roomIndex !== -1 && roomIndex + 1 < pathParts.length) {
							const caregiverId = pathParts[roomIndex + 1];
							router.push(`/room/${caregiverId}/${patientId}`);
						} else {
							router.push('/dashboard');
						}
					});
			}
		}
	}, [session, patientId, saveSessionScore, router, isSessionComplete]);

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
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
					<p className="text-sm text-gray-500 mt-2">Saving your progress...</p>
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