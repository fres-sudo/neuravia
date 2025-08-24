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
	const session = useGameStore((state: { session: any }) => state.session); // Add session to track rounds

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
	const [timerHasStarted, setTimerHasStarted] = useState(false);
	const [gameResult, setGameResult] = useState<'correct' | 'incorrect' | null>(null);

	// Reset game state when a new round starts
	useEffect(() => {
		console.log("Resetting flashing memory game for round:", session?.currentRound);
		setPhase("memorize");
		setSequence([]);
		setUserSequence([]);
		setTimerHasStarted(false);
		setGameResult(null);
		stopTimer();
	}, [session?.currentRound, stopTimer]);

	useEffect(() => {
		if (phase === "memorize" && sequence.length === 0 && !timerHasStarted && gameSettings?.itemCount && gameSettings?.timerDuration) {
			console.log("Starting memorize phase for flashing memory with settings:", gameSettings);
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

			console.log("Generated sequence:", newSequence);
			setSequence(newSequence);
			setUserSequence([]);

			// Start timer with a small delay to ensure proper initialization
			setTimeout(() => {
				console.log("Starting timer for memorize phase");
				startTimer(gameSettings.timerDuration);
				setTimerHasStarted(true);
			}, 300);
		}
	}, [phase, gameSettings?.itemCount, gameSettings?.timerDuration, gridSize, startTimer, timerHasStarted, sequence.length]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		
		if (timerActive && timeRemaining > 0) {
			interval = setInterval(() => {
				tick();
			}, 1000);
		}

		// Handle phase transitions - only if timer was actually started and is now finished
		if (timeRemaining === 0 && phase === "memorize" && timerHasStarted && !timerActive && sequence.length > 0) {
			console.log("Transitioning from memorize to playing phase");
			setPhase("playing");
			stopTimer();
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [timerActive, timeRemaining, phase, tick, stopTimer, timerHasStarted, sequence.length]);

	const handleCellClick = (position: number) => {
		if (phase !== "playing") return;
		
		const expectedNext = userSequence.length + 1;
		const clickedItem = sequence.find(
			(item) => item.position === position
		);

		console.log(`Clicked position ${position}, expected number ${expectedNext}, clicked item:`, clickedItem);

		if (clickedItem && clickedItem.number === expectedNext) {
			const newUserSequence = [...userSequence, clickedItem];
			setUserSequence(newUserSequence);
			console.log("Correct click! New user sequence:", newUserSequence);

			if (newUserSequence.length === sequence.length) {
				console.log("Game completed successfully!");
				const rawData = {
					gameType: "flashing-memory",
					roundNumber: gameSettings.itemCount,
					correctAnswer: true,
					userSequence: newUserSequence.map(item => ({ position: item.position, number: item.number })),
					correctSequence: sequence.map(item => ({ position: item.position, number: item.number })),
					totalNumbers: sequence.length,
					timeSpent: gameSettings.timerDuration - timeRemaining,
				};
				
				completeGame(20, rawData);
				setGameResult('correct');
				setPhase("complete");
				setTimeout(() => {
					nextGame();
				}, 2000);
			}
		} else {
			console.log("Wrong click!");
			// Wrong click - end game
			const rawData = {
				gameType: "flashing-memory",
				roundNumber: gameSettings.itemCount,
				correctAnswer: false,
				userSequence: userSequence.map(item => ({ position: item.position, number: item.number })),
				correctSequence: sequence.map(item => ({ position: item.position, number: item.number })),
				clickedPosition: position,
				expectedNumber: expectedNext,
				totalNumbers: sequence.length,
				timeSpent: gameSettings.timerDuration - timeRemaining,
			};
			
			completeGame(5, rawData);
			setGameResult('incorrect');
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

			const showNumber = phase === "memorize" && sequenceItem;
			const showUserNumber = phase === "playing" && userClickedItem;

			cells.push(
				<button
					key={i}
					onClick={() => handleCellClick(i)}
					className={`
            							w-16 h-16 border-2 border-gray-400 rounded-lg text-2xl font-bold transition-all duration-300
					${showNumber 
						? "bg-blue-500 text-white shadow-lg animate-pulse scale-105" 
						: "bg-white hover:bg-gray-100"
					}
					${showUserNumber 
						? "bg-green-500 text-white shadow-lg" 
						: ""
					}
					${phase === "playing" && !userClickedItem 
						? "hover:bg-blue-50 hover:scale-105 cursor-pointer" 
						: ""
					}
					${phase !== "playing" || userClickedItem 
						? "cursor-not-allowed" 
						: ""
					}
          		`}
					disabled={phase !== "playing" || !!userClickedItem}>
					{showNumber ? sequenceItem!.number : ""}
					{showUserNumber ? userClickedItem!.number : ""}
				</button>
			);
		}
		return cells;
	};

	return (
		<div className="relative w-full h-90  bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-4 border-purple-300 overflow-hidden">
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				{!gameSettings?.itemCount || !gameSettings?.timerDuration ? (
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-700 mb-4">Loading game...</div>
						<div className="animate-spin rounded-full h-8 w-8 border-b-4 border-purple-500 mx-auto"></div>
					</div>
				) : (
					<>
						{phase === "memorize" && (
							<div className="mb-6 text-center">
								<h3 className="text-2xl font-bold text-gray-700 mb-2">
									Remember the numbers and their positions!
								</h3>
								<p className="text-lg text-gray-600">
									Numbers will appear in the grid, then disappear. 
								</p>
								<p className="text-lg text-gray-600">
									Click them back in order: 1, 2, 3, 4...
								</p>
								{timeRemaining > 0 && (
									<p className="text-sm text-purple-600 mt-2">
										Time remaining: {timeRemaining}s
									</p>
								)}
							</div>
						)}

						{phase === "playing" && (
							<div className="mb-6 text-center">
								<h3 className="text-2xl font-bold text-gray-700 mb-2">
									Click the squares in numerical order!
								</h3>
								<p className="text-lg text-purple-600">
									Next number: {userSequence.length + 1} of {sequence.length}
								</p>
							</div>
						)}

						<div className="grid grid-cols-3 gap-2">{renderGrid()}</div>
					</>
				)}
			</div>

			{phase === "complete" && (
				<GameComplete 
					message={gameResult === 'correct' ? "Perfect memory! 🧠" : "Good try! Remember the sequence! 💭"} 
					isCorrect={gameResult === 'correct'}
				/>
			)}
		</div>
	);
};
