import { useGameStore, useGameTimer } from "@/stores/game-store";
import { useEffect, useState, type SetStateAction } from "react";
import { GameComplete } from "../game-complete";

export const HawkEyeGame = () => {
	const { startTimer, tick, stopTimer } = useGameTimer();
	const timeRemaining = useGameStore((state) => state.timeRemaining);
	const timerActive = useGameStore((state) => state.timerActive);
	const gameSettings = useGameStore((state) => state.gameSettings);
	const profile = useGameStore((state) => state.profile);
	const completeGame = useGameStore((state) => state.completeGame);
	const nextGame = useGameStore((state) => state.nextGame);

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

	const birdEmojis =
		profile?.customAssets["hawk-eye"]?.items?.slice(
			0,
			gameSettings.itemCount
		) || ["🦅", "🐦", "🦜", "🕊️"].slice(0, gameSettings.itemCount);

	useEffect(() => {
		// Reset game state when component mounts or phase changes to memorize
		if (phase === "memorize") {
			const initialBirds = birdEmojis.map((emoji, index) => ({
				id: index,
				emoji,
				x: 20 + (index % 2) * 50,
				y: 25 + Math.floor(index / 2) * 50,
				isTarget: index === 0,
			}));
			setBirds(initialBirds);
			setTargetIndex(0);
			setSelectedBird(null);

			// Start timer with a small delay to ensure proper initialization
			setTimeout(() => {
				startTimer(gameSettings.timerDuration);
			}, 100);
		}
	}, [phase, gameSettings.timerDuration, birdEmojis, startTimer]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (timerActive && timeRemaining > 0) {
			interval = setInterval(() => {
				tick();
			}, 1000);
		}

		// Handle phase transitions
		if (timeRemaining === 0 && phase === "memorize") {
			setPhase("moving");
			stopTimer();
			startMoving();
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [timerActive, timeRemaining, phase, tick, stopTimer]);

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

	const handleBirdClick = (birdId: SetStateAction<number | null>) => {
		setSelectedBird(birdId);
		const isCorrect = birdId === targetIndex;
		completeGame(isCorrect ? 15 : 5);
		setPhase("complete");
		setTimeout(() => {
			nextGame();
		}, 2000);
	};

	return (
		<div className="relative w-full h-96 bg-gradient-to-br from-sky-200 to-cyan-200 rounded-2xl border-4 border-sky-300 overflow-hidden">
			{phase === "memorize" && (
				<div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold animate-bounce">
					Watch the highlighted bird! 👁️
				</div>
			)}

			{birds.map((bird) => (
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

			{phase === "moving" && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="bg-black bg-opacity-50 text-white px-8 py-4 rounded-2xl text-2xl font-bold">
						Keep watching! 👀
					</div>
				</div>
			)}

			{phase === "guessing" && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="bg-blue-500 text-white px-8 py-4 rounded-2xl text-2xl font-bold">
						Click the bird you were watching!
					</div>
				</div>
			)}

			{phase === "complete" && (
				<GameComplete
					message={
						selectedBird === targetIndex ? "Perfect! 🎯" : "Good try! 👍"
					}
				/>
			)}
		</div>
	);
};
