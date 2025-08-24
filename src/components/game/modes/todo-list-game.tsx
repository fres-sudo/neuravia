import { useGameStore, useGameTimer } from "@/stores/game-store";
import { useEffect, useState } from "react";
import { GameComplete } from "../game-complete";
import { useMemo } from "react";

export const TodoListGame = () => {
	const { startTimer, tick, stopTimer } = useGameTimer();
	const timeRemaining = useGameStore((state) => state.timeRemaining);
	const timerActive = useGameStore((state) => state.timerActive);
	const gameSettings = useGameStore((state) => state.gameSettings);
	const profile = useGameStore((state) => state.profile);
	const completeGame = useGameStore((state) => state.completeGame);
	const nextGame = useGameStore((state) => state.nextGame);
	const session = useGameStore((state) => state.session); // Add session to track rounds
	const gameplayStarted = useGameStore((state) => state.gameplayStarted);

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
	const [timerHasStarted, setTimerHasStarted] = useState(false); // Track if timer has been started
	const [gameResult, setGameResult] = useState<'correct' | 'incorrect' | null>(null); // Track game result
	const [gameCompleted, setGameCompleted] = useState(false); // Track if game is completed

	// Comprehensive task pools for variety
	const taskPools = useMemo(() => ({
		teacher: [
			"📚 Prepare lessons", "✏️ Grade papers", "🍎 Eat lunch", "📐 Setup classroom",
			"👥 Staff meeting", "📊 Update gradebook", "📞 Call parents", "🖨️ Make copies",
			"📝 Write lesson plans", "🎨 Prepare materials", "💻 Check emails", "📋 Take attendance",
			"🧪 Setup lab experiment", "📖 Read student essays", "🎭 Rehearse play", "🏃 Playground duty",
			"📚 Order supplies", "🎯 Plan activities", "📱 Update website", "🗂️ File paperwork"
		],
		office: [
			"☕ Morning coffee", "📧 Check emails", "📝 Write report", "📞 Team meeting",
			"💼 Client presentation", "📊 Review budget", "🖥️ Update database", "📋 Schedule appointments",
			"💻 Code review", "📈 Analyze data", "🍕 Lunch break", "📱 Return calls",
			"📂 Organize files", "✅ Project checklist", "🎯 Set priorities", "💡 Brainstorm ideas",
			"📊 Create charts", "🔍 Research competitors", "📝 Draft proposal", "🤝 Network event"
		],
		home: [
			"🛏️ Make bed", "🧽 Wash dishes", "🛒 Grocery shopping", "🧺 Do laundry",
			"🍳 Cook dinner", "🧹 Vacuum floors", "🚿 Take shower", "📺 Watch TV",
			"🌱 Water plants", "🚗 Car maintenance", "📞 Call family", "🎮 Play games",
			"📚 Read book", "🧘 Exercise", "🛁 Clean bathroom", "🗑️ Take out trash",
			"🐕 Walk dog", "💊 Take vitamins", "📱 Pay bills", "🎵 Listen music"
		],
		health: [
			"💊 Take medication", "🏃 Morning jog", "🥗 Healthy breakfast", "💧 Drink water",
			"🧘 Meditation", "🏋️ Gym workout", "😴 Get sleep", "🥬 Eat vegetables",
			"🚶 Take walk", "📱 Track calories", "🧴 Take vitamins", "🦷 Brush teeth",
			"🍎 Eat fruit", "🧘‍♀️ Yoga session", "📊 Check weight", "🚭 Avoid smoking",
			"☀️ Get sunlight", "🤝 Social time", "📖 Read wellness", "🛀 Relaxing bath"
		]
	}), []);

	// Generate tasks with variety based on profession and round
	const tasks = useMemo(() => {
		const currentRound = session?.currentRound || 1;

		// Determine which pool to use based on profession, with some variety
		let selectedPool: string[];
		if (profile?.profession === "teacher") {
			// Mix teacher tasks with occasional home/health tasks for variety
			if (currentRound % 4 === 0) selectedPool = taskPools.home;
			else if (currentRound % 5 === 0) selectedPool = taskPools.health;
			else selectedPool = taskPools.teacher;
		} else {
			// Mix office tasks with occasional home/health tasks for variety
			if (currentRound % 4 === 0) selectedPool = taskPools.home;
			else if (currentRound % 5 === 0) selectedPool = taskPools.health;
			else selectedPool = taskPools.office;
		}

		// Create a seed based on current round for consistent randomization within the same round
		const seed = currentRound * 1337; // Simple seed generation
		const seededRandom = (index: number) => {
			const x = Math.sin(seed + index) * 10000;
			return x - Math.floor(x);
		};

		// Shuffle the pool using seeded random to ensure consistency within the same round
		const shuffledPool = [...selectedPool].sort((a, b) => seededRandom(selectedPool.indexOf(a)) - seededRandom(selectedPool.indexOf(b)));

		// Take the required number of items
		return shuffledPool.slice(0, gameSettings.itemCount);
	}, [profile?.profession, gameSettings.itemCount, session?.currentRound, taskPools]);

	// Reset game state when a new round starts
	useEffect(() => {
		console.log("Resetting to-do list game for round:", session?.currentRound);
		setPhase("memorize");
		setOriginalTasks([]);
		setShuffledTasks([]);
		setUserOrder([]);
		setTimerHasStarted(false);
		setGameResult(null);
		setGameCompleted(false);
		stopTimer();
	}, [session?.currentRound, stopTimer]);

	useEffect(() => {
		if (phase === "memorize" && tasks.length > 0 && !timerHasStarted && !gameCompleted && gameplayStarted) {
			console.log("Starting memorize phase with tasks:", tasks);
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
				setTimerHasStarted(true);
				console.log("Timer started for memorize phase");
			}, 100);
		}
	}, [phase, gameSettings.timerDuration, tasks, startTimer, timerHasStarted, gameCompleted, gameplayStarted]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (timerActive && timeRemaining > 0) {
			interval = setInterval(() => {
				tick();
			}, 1000);
		}

		// Handle phase transitions - only if timer was actually started and is now finished
		if (timeRemaining === 0 && phase === "memorize" && originalTasks.length > 0 && timerHasStarted && !timerActive) {
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
	}, [timerActive, timeRemaining, phase, tick, stopTimer, originalTasks, timerHasStarted]);

	const handleTaskClick = (task: {
		id: number;
		text: string;
		order: number;
	}) => {
		if (userOrder.find((t) => t.id === task.id)) return; // Already selected

		const newOrder = [...userOrder, task];
		setUserOrder(newOrder);

		if (newOrder.length === originalTasks.length) {
			// Check if order is correct - user should select tasks in the original order (1,2,3,4...)
			// originalTasks is sorted by order (1,2,3,4), so we check if user selected in that same sequence
			const isCorrect = newOrder.every((selectedTask, selectionIndex) => {
				// The task that should be selected at this position (0->order:1, 1->order:2, etc.)
				const expectedOrder = selectionIndex + 1;
				// Check if the selected task has the expected order number
				return selectedTask.order === expectedOrder;
			});

			console.log("User selection order:", newOrder.map(t => ({ text: t.text, order: t.order })));
			console.log("Expected order:", originalTasks.map(t => ({ text: t.text, order: t.order })));
			console.log("Is correct:", isCorrect);

			const rawData = {
				gameType: "todo-list",
				roundNumber: gameSettings.itemCount,
				correctAnswer: isCorrect,
				userOrder: newOrder.map(t => ({ id: t.id, order: t.order })),
				correctOrder: originalTasks.map(t => ({ id: t.id, order: t.order })),
				totalTasks: originalTasks.length,
				timeSpent: gameSettings.timerDuration - timeRemaining,
			};

			completeGame(isCorrect ? 15 : 8, rawData);
			setGameResult(isCorrect ? 'correct' : 'incorrect');
			setGameCompleted(true);
			setPhase("complete");
			setTimeout(() => {
				nextGame();
			}, 2000);
		}
	};

	return (
		<div className="relative w-full h-90  bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl border-4 border-yellow-300 overflow-hidden">
			{/* Waiting for gameplay to start */}
			{!gameplayStarted && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center text-gray-700">
						<div className="text-4xl mb-4">⏳</div>
						<div className="text-2xl font-bold">Waiting for instructions to complete...</div>
					</div>
				</div>
			)}

			{phase === "memorize" && gameplayStarted && (
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

			{phase === "playing" && gameplayStarted && (
				<div className="absolute inset-4 flex flex-col justify-center">
					<h3 className="text-2xl font-bold text-center mb-4 text-gray-700">
						Put them back in order: {userOrder.length}/{originalTasks.length}
					</h3>
					<div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
						{shuffledTasks.map((task) => {
							const isSelected = userOrder.find((t) => t.id === task.id);
							const orderIndex = userOrder.findIndex((t) => t.id === task.id);

							// Check if this selection is correct - the selected task should have the right order number
							// for the position it was selected in
							const isSelectionCorrect = isSelected ? (task.order === orderIndex + 1) : false;

							return (
								<button
									key={task.id}
									onClick={() => handleTaskClick(task)}
									disabled={!!isSelected}
									className={`p-3 rounded-xl transition-all ${
										isSelected
											? `${isSelectionCorrect ? "bg-green-200" : "bg-red-200"} opacity-70 cursor-not-allowed`
											: "bg-white hover:bg-blue-100 cursor-pointer shadow-md hover:shadow-lg"
									}`}>
									<div className="flex items-center">
										{isSelected && (
											<span className={`${isSelectionCorrect ? "bg-green-500" : "bg-red-500"} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3`}>
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

			{phase === "complete" && gameplayStarted && (
				<GameComplete
					message={gameResult === 'correct' ? "Perfect! Right order! 🎯" : "Good try! Wrong order 📝"}
					isCorrect={gameResult === 'correct'}
				/>
			)}
		</div>
	);
};