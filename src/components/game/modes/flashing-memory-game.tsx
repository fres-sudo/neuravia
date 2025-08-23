import { useEffect, useState } from "react";
import { GameComplete } from "../game-complete";
import { useGameStore, useGameTimer } from "@/stores/game-store";

export const FlashingMemoryGame = () => {
	const { startTimer, tick, stopTimer } = useGameTimer();
	const timeRemaining = useGameStore(
		(state: { timeRemaining: any }) => state.timeRemaining
	);
	const timerActive = useGameStore(
		(state: { timerActive: any }) => state.timerActive
	);
	const gameSettings = useGameStore(
		(state: { gameSettings: any }) => state.gameSettings
	);
	const profile = useGameStore((state: { profile: any }) => state.profile);
	const completeGame = useGameStore(
		(state: { completeGame: any }) => state.completeGame
	);
	const nextGame = useGameStore((state: { nextGame: any }) => state.nextGame);

	const [phase, setPhase] = useState("memorize");
	const [sequence, setSequence] = useState<Array<{
		position: number;
		number: number;
		row: number;
		col: number;
	}>>([]);
	const [userSequence, setUserSequence] = useState<Array<{
		position: number;
		number: number;
		row: number;
		col: number;
	}>>([]);
	const [gridSize] = useState(3); // 3x3 grid

	useEffect(() => {
		if (phase === "memorize") {
			// Generate random sequence
			const positions: number[] = [];
			while (positions.length < gameSettings.itemCount) {
				const pos = Math.floor(Math.random() * 9);
				if (!positions.includes(pos)) {
					positions.push(pos);
				}
			}

			const newSequence = positions.map((pos, index) => ({
				position: pos,
				number: index + 1,
				row: Math.floor(pos / gridSize),
				col: pos % gridSize,
			}));

			setSequence(newSequence);
			setUserSequence([]);

			// Start timer with a small delay to ensure proper initialization
			setTimeout(() => {
				startTimer(gameSettings.timerDuration);
			}, 100);
		}
	}, [phase, gameSettings.itemCount, gameSettings.timerDuration, gridSize, startTimer]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		
		if (timerActive && timeRemaining > 0) {
			interval = setInterval(() => {
				tick();
			}, 1000);
		}

		// Handle phase transitions
		if (timeRemaining === 0 && phase === "memorize") {
			setPhase("playing");
			stopTimer();
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [timerActive, timeRemaining, phase, tick, stopTimer]);

	const handleCellClick = (position: number) => {
		const expectedNext = userSequence.length + 1;
		const clickedItem = sequence.find(
			(item) => item.position === position
		);

		if (clickedItem && clickedItem.number === expectedNext) {
			const newUserSequence = [...userSequence, clickedItem];
			setUserSequence(newUserSequence);

			if (newUserSequence.length === sequence.length) {
				completeGame(20);
				setPhase("complete");
				setTimeout(() => {
					nextGame();
				}, 2000);
			}
		} else {
			// Wrong click - show feedback but continue
			completeGame(5);
			setPhase("complete");
			setTimeout(() => {
				nextGame();
			}, 2000);
		}
	};

	const renderGrid = () => {
		const cells: React.JSX.Element[] = [];
		for (let i = 0; i < 9; i++) {
			const sequenceItem = sequence.find(
				(item) => item.position === i
			);
			const userClickedItem = userSequence.find(
				(item) => item.position === i
			);

			cells.push(
				<button
					key={i}
					onClick={() => phase === "playing" && handleCellClick(i)}
					className={`
            w-20 h-20 border-2 border-gray-400 rounded-lg text-2xl font-bold transition-all
            ${
							phase === "memorize" && sequenceItem
								? "bg-blue-400 text-white animate-pulse"
								: "bg-white hover:bg-gray-100"
						}
            ${
							phase === "playing" && userClickedItem
								? "bg-green-400 text-white"
								: "hover:bg-blue-100 cursor-pointer"
						}
            ${phase === "playing" ? "hover:scale-105" : ""}
          `}
					disabled={phase !== "playing"}>
					{phase === "memorize" && sequenceItem ? sequenceItem.number : ""}
					{phase === "playing" && userClickedItem ? userClickedItem.number : ""}
				</button>
			);
		}
		return cells;
	};

	return (
		<div className="relative w-full h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-4 border-purple-300 overflow-hidden">
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				{phase === "memorize" && (
					<div className="mb-4">
						<h3 className="text-2xl font-bold text-center text-gray-700">
							Remember the numbers and positions!
						</h3>
					</div>
				)}

				{phase === "playing" && (
					<div className="mb-4">
						<h3 className="text-2xl font-bold text-center text-gray-700">
							Click in order: {userSequence.length + 1} of {sequence.length}
						</h3>
					</div>
				)}

				<div className="grid grid-cols-3 gap-2">{renderGrid()}</div>
			</div>

			{phase === "complete" && <GameComplete />}
		</div>
	);
};
