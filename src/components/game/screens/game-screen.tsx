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

export const GameScreen = () => {
	const isPlaying = useGameStore((state) => state.isPlaying);
	const currentGame = useGameStore((state) => state.currentGame);

	if (!isPlaying) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 space-y-6 pt-10">
			<ProgressBar />

			{/* Game Title - positioned between progress bar and main content */}
			<GameTitle />

			{/* Main content area - accounting for fixed progress bar */}
			<div className=" pt-32 pb-8 px-8 flex items-center justify-center">
				<div className="w-full max-w-4xl">
					{currentGame === "scene-crasher" && <SceneCrasherGame />}
					{currentGame === "flashing-memory" && <FlashingMemoryGame />}
					{currentGame === "hawk-eye" && <HawkEyeGame />}
					{currentGame === "todo-list" && <TodoListGame />}
					{/* Altri giochi verranno implementati qui */}
					{false && (
						<div className="text-center p-16 bg-white rounded-2xl shadow-lg">
							<h2 className="text-3xl font-bold text-gray-700 mb-4 capitalize">
								{currentGame?.replace("-", " ")} Coming Soon
							</h2>
							<button
								onClick={() => useGameStore.getState().nextGame()}
								className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl">
								Skip to Next Game
							</button>
						</div>
					)}
				</div>
			</div>

			<GameTimer />
			<ExitButton />
			<InstructionModal />
		</div>
	);
};
