import { useGameStore, useGameTimer } from "@/stores/game-store";
import { useEffect, useState } from "react";
import { GameComplete } from "../game-complete";
import { useMemo } from "react";

export const HawkEyeGame = () => {
	const { startTimer, tick, stopTimer } = useGameTimer();
	const timeRemaining = useGameStore((state) => state.timeRemaining);
	const timerActive = useGameStore((state) => state.timerActive);
	const gameSettings = useGameStore((state) => state.gameSettings);
	const profile = useGameStore((state) => state.profile);
	const completeGame = useGameStore((state) => state.completeGame);
	const nextGame = useGameStore((state) => state.nextGame);
	const session = useGameStore((state) => state.session); // Add session to track rounds
	const [memorizeArmed, setMemorizeArmed] = useState(false);
	const gameplayStarted = useGameStore((state) => state.gameplayStarted);

	const [phase, setPhase] = useState("memorize");
	const [targetIndex, setTargetIndex] = useState(0);
	interface Bird {
		id: number;
		emoji: string;
		x: number;
		y: number;
		isTarget: boolean;
	}

	const [birds, setBirds] = useState<Bird[]>([]);
	const [selectedBird, setSelectedBird] = useState<number | null>(null);

	const birdEmojis = useMemo(() => {
		if (profile?.customAssets["hawk-eye"]?.items) {
			return profile.customAssets["hawk-eye"].items.slice(
				0,
				gameSettings.itemCount
			);
		}
		return ["🦅", "🐦", "🦜", "🕊️"].slice(0, gameSettings.itemCount);
	}, [profile?.customAssets, gameSettings.itemCount]);

	// Reset game state when a new round starts
	useEffect(() => {
		setPhase("memorize");
		setTargetIndex(0);
		setBirds([]);
		setSelectedBird(null);
		setMemorizeArmed(false);
		stopTimer();
	}, [session?.currentRound, stopTimer]);

	useEffect(() => {
		if (phase === "memorize" && timeRemaining > 0 && !memorizeArmed) {
			setMemorizeArmed(true);
		}
	}, [phase, timeRemaining, memorizeArmed]);

	useEffect(() => {
		// Reset game state when component mounts or phase changes to memorize

		if (phase === "memorize" && gameplayStarted) {
			const randomIndex = Math.floor(Math.random() * birdEmojis.length);
			const initialBirds = birdEmojis.map((emoji, index) => ({
				id: index,
				emoji,
				x: 20 + (index % 2) * 50,
				y: 25 + Math.floor(index / 2) * 50,
				isTarget: index === randomIndex,
			}));
			setBirds(initialBirds);
			setTargetIndex(randomIndex);
			setSelectedBird(null);

			// Start timer with a small delay to ensure proper initialization
			setTimeout(() => {
				startTimer(gameSettings.timerDuration);
			}, 100);
		}
	}, [
		phase,
		gameSettings.timerDuration,
		birdEmojis,
		startTimer,
		gameplayStarted,
	]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (timerActive && timeRemaining > 0) {
			interval = setInterval(() => {
				tick();
			}, 1000);
		}

		// Handle phase transitions
		if (phase === "memorize" && memorizeArmed && timeRemaining === 0) {
			setPhase("moving");
			stopTimer();
			startMoving();
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [timerActive, timeRemaining, phase, memorizeArmed, tick, stopTimer]);

	const startMoving = () => {
		let moveCount = 0;
		const maxMoves = 8;

		const moveInterval = setInterval(() => {
			setBirds((prevBirds) =>
				prevBirds.map((bird) => ({
					...bird,
					x: Math.max(10, Math.min(90, bird.x + (Math.random() - 0.5) * 30)),
					y: Math.max(15, Math.min(85, bird.y + (Math.random() - 0.5) * 30)),
				}))
			);

			moveCount++;
			if (moveCount >= maxMoves) {
				clearInterval(moveInterval);
				setPhase("guessing");
			}
		}, 800);
	};

	const handleBirdClick = (birdId: number) => {
		setSelectedBird(birdId);
		const isCorrect = birdId === targetIndex;

		const rawData = {
			gameType: "hawk-eye",
			roundNumber: gameSettings.itemCount,
			correctAnswer: isCorrect,
			selectedBirdId: birdId,
			targetBirdId: targetIndex,
			totalBirds: birds.length,
			movesCount: 8, // Fixed number of moves
			timeSpent: gameSettings.timerDuration - timeRemaining,
		};

		completeGame(isCorrect ? 15 : 5, rawData);
		setPhase("complete");
		setTimeout(() => {
			nextGame();
		}, 2000);
	};

	return (
		<div className="relative w-full h-90  bg-gradient-to-br from-sky-200 to-cyan-200 rounded-2xl border-4 border-sky-300 overflow-hidden">
			{/* Waiting for gameplay to start */}
			{!gameplayStarted && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center text-gray-700">
						<div className="text-4xl mb-4">⏳</div>
						<div className="text-2xl font-bold">
							Waiting for instructions to complete...
						</div>
					</div>
				</div>
			)}

			{phase === "memorize" && gameplayStarted && (
				<div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold animate-bounce z-10">
					Watch the highlighted bird! 👁️
				</div>
			)}

			{gameplayStarted &&
				birds.map((bird) => (
					<div
						key={bird.id}
						className={`absolute text-4xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-800 ${
							bird.isTarget && phase === "memorize"
								? "animate-pulse ring-4 ring-red-400 rounded-full p-2 bg-red-100"
								: ""
						} ${phase === "guessing" ? "cursor-pointer hover:scale-110" : ""}`}
						style={{
							left: `${bird.x}%`,
							top: `${bird.y}%`,
						}}
						onClick={() => phase === "guessing" && handleBirdClick(bird.id)}>
						{bird.emoji}
					</div>
				))}

			{phase === "moving" && gameplayStarted && (
				<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
					<div className="bg-black bg-opacity-50 text-white px-6 py-3 rounded-xl text-xl font-bold shadow-lg">
						Keep watching! 👀
					</div>
				</div>
			)}

			{phase === "guessing" && gameplayStarted && (
				<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
					<div className="bg-blue-500 text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg">
						Click the bird you were watching!
					</div>
				</div>
			)}

			{phase === "complete" && gameplayStarted && (
				<GameComplete
					isCorrect={selectedBird === targetIndex}
					message={
						selectedBird === targetIndex
							? "Perfect! 🎯"
							: "Good try👍 But it was not that one."
					}
				/>
			)}
		</div>
	);
};
