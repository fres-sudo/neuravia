import { useGameStore, useGameTimer } from "@/stores/game-store";
import { useEffect, useState } from "react";
import { GameComplete } from "../game-complete";

export const TodoListGame = () => {
	const { startTimer, tick, stopTimer } = useGameTimer();
	const timeRemaining = useGameStore((state) => state.timeRemaining);
	const timerActive = useGameStore((state) => state.timerActive);
	const gameSettings = useGameStore((state) => state.gameSettings);
	const profile = useGameStore((state) => state.profile);
	const completeGame = useGameStore((state) => state.completeGame);
	const nextGame = useGameStore((state) => state.nextGame);

	const [phase, setPhase] = useState("memorize");
	const [originalTasks, setOriginalTasks] = useState<
		Array<{ id: number; text: string; order: number }>
	>([]);
	const [shuffledTasks, setShuffledTasks] = useState<
		Array<{ id: number; text: string; order: number }>
	>([]);
	const [userOrder, setUserOrder] = useState<
		Array<{ id: number; text: string; order: number }>
	>([]);

	const tasks =
		profile?.profession === "teacher"
			? [
					"📚 Prepare lessons",
					"✏️ Grade papers",
					"🍎 Eat lunch",
					"📐 Setup classroom",
			  ].slice(0, gameSettings.itemCount)
			: [
					"☕ Morning coffee",
					"📧 Check emails",
					"📝 Write report",
					"📞 Team meeting",
			  ].slice(0, gameSettings.itemCount);

	useEffect(() => {
		if (phase === "memorize") {
			const tasksWithId = tasks.map((task, index) => ({
				id: index,
				text: task,
				order: index + 1,
			}));
			setOriginalTasks(tasksWithId);
			setUserOrder([]);

			// Start timer with a small delay to ensure proper initialization
			setTimeout(() => {
				startTimer(gameSettings.timerDuration);
			}, 100);
		}
	}, [phase, gameSettings.timerDuration, tasks, startTimer]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		
		if (timerActive && timeRemaining > 0) {
			interval = setInterval(() => {
				tick();
			}, 1000);
		}

		// Handle phase transitions
		if (timeRemaining === 0 && phase === "memorize") {
			// Mescola i task
			const shuffled = [...originalTasks].sort(() => Math.random() - 0.5);
			setShuffledTasks(shuffled);
			setPhase("playing");
			stopTimer();
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [timerActive, timeRemaining, phase, tick, stopTimer, originalTasks]);

	const handleTaskClick = (task: {
		id: number;
		text: string;
		order: number;
	}) => {
		if (userOrder.find((t) => t.id === task.id)) return; // Already selected

		const newOrder = [...userOrder, task];
		setUserOrder(newOrder);

		if (newOrder.length === originalTasks.length) {
			// Check if order is correct
			const isCorrect = newOrder.every(
				(task, index) => task.order === index + 1
			);
			completeGame(isCorrect ? 15 : 8);
			setPhase("complete");
			setTimeout(() => {
				nextGame();
			}, 2000);
		}
	};

	return (
		<div className="relative w-full h-96 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl border-4 border-yellow-300 overflow-hidden">
			{phase === "memorize" && (
				<div className="absolute inset-4 flex flex-col justify-center">
					<h3 className="text-2xl font-bold text-center mb-6 text-gray-700">
						Remember this order:
					</h3>
					<div className="space-y-4">
						{originalTasks.map((task, index) => (
							<div
								key={task.id}
								className="bg-white p-4 rounded-xl shadow-md flex items-center">
								<span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
									{index + 1}
								</span>
								<span className="text-lg font-semibold">{task.text}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{phase === "playing" && (
				<div className="absolute inset-4 flex flex-col justify-center">
					<h3 className="text-2xl font-bold text-center mb-4 text-gray-700">
						Put them back in order: {userOrder.length}/{originalTasks.length}
					</h3>
					<div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
						{shuffledTasks.map((task) => {
							const isSelected = userOrder.find((t) => t.id === task.id);
							const orderIndex = userOrder.findIndex((t) => t.id === task.id);

							return (
								<button
									key={task.id}
									onClick={() => handleTaskClick(task)}
									disabled={!!isSelected}
									className={`p-3 rounded-xl transition-all ${
										isSelected
											? "bg-green-200 opacity-50 cursor-not-allowed"
											: "bg-white hover:bg-blue-100 cursor-pointer shadow-md hover:shadow-lg"
									}`}>
									<div className="flex items-center">
										{isSelected && (
											<span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
												{orderIndex + 1}
											</span>
										)}
										<span className="text-lg font-semibold">{task.text}</span>
									</div>
								</button>
							);
						})}
					</div>
				</div>
			)}

			{phase === "complete" && <GameComplete />}
		</div>
	);
};
