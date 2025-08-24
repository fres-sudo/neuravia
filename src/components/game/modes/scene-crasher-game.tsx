"use client";

import { useGameStore, useGameTimer } from "@/stores/game-store";
import { useEffect, useState } from "react";

export const SceneCrasherGame = () => {
	const { startTimer, tick, stopTimer } = useGameTimer();
	const timeRemaining = useGameStore((state) => state.timeRemaining);
	const timerActive = useGameStore((state) => state.timerActive);
	const gameSettings = useGameStore((state) => state.gameSettings);
	const profile = useGameStore((state) => state.profile);
	const completeGame = useGameStore((state) => state.completeGame);
	const nextGame = useGameStore((state) => state.nextGame);
	const session = useGameStore((state) => state.session); // Add session to track rounds

	const [phase, setPhase] = useState("memorize"); // "memorize" -> "hidden" -> "playing" -> "complete" -> "wrong"
	const [originalItems, setOriginalItems] = useState<
		Array<{ id: number; icon: string; x: number; y: number }>
	>([]);
	const [finalItems, setFinalItems] = useState<
		Array<{ id: number; icon: string; x: number; y: number; isNew?: boolean }>
	>([]);
	const [timerHasStarted, setTimerHasStarted] = useState(false); // Track if timer has been started

	// Get the base item icon (all items will be identical)
	const baseIcon = profile?.customAssets["scene-crasher"]?.items?.[0] || "⭐";

	// Reset game state when component mounts or when a new round starts
	useEffect(() => {
		stopTimer();
		setPhase("memorize");
		setOriginalItems([]);
		setFinalItems([]);
		setTimerHasStarted(false);
	}, [stopTimer, session?.currentRound]); // Add currentRound as dependency

	useEffect(() => {
		if (phase === "memorize") {
			// Generate N identical items in random positions
			// Ensure at least 2 items: minimum 1 original + 1 new that will be added later
			const itemCount = Math.max(2, gameSettings.itemCount);
			const items: { id: number; icon: string; x: number; y: number }[] = [];

			// Generate original items that will be shown during memorization
			// We'll show (itemCount - 1) items during memorization, then add 1 new item
			const originalItemsCount = itemCount - 1;

			for (let i = 0; i < originalItemsCount; i++) {
				items.push({
					id: i,
					icon: baseIcon,
					x: 15 + Math.random() * 70, // Random x between 15-85%
					y: 20 + Math.random() * 60, // Random y between 20-80%
				});
			}

			setOriginalItems(items);

			// Start 5-second timer for memorization
			setTimeout(() => {
				startTimer(5);
				setTimerHasStarted(true);
			}, 100);
		}
	}, [phase, startTimer, gameSettings.itemCount, baseIcon]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (timerActive && timeRemaining > 0) {
			interval = setInterval(() => {
				tick();
			}, 1000);
		}

		// Handle phase transitions - only if timer was actually started and is now finished
		if (timeRemaining === 0 && phase === "memorize" && timerHasStarted && !timerActive) {
			// Hide all items for 1 second
			setPhase("hidden");
			stopTimer();

			// After 1 second, show items with one new item added
			setTimeout(() => {
				// Add one new item at a random position (same icon as others)
				const newItem = {
					id: originalItems.length,
					icon: baseIcon,
					x: 15 + Math.random() * 70,
					y: 20 + Math.random() * 60,
					isNew: true,
				};

				const allItems = [
					...originalItems.map((item) => ({ ...item, isNew: false })),
					newItem,
				];
				
				// Set items first, then change phase to ensure items are rendered before instruction
				setFinalItems(allItems);
				
				// Small delay to ensure items are rendered before showing instruction
				setTimeout(() => {
					setPhase("playing");
				}, 50);
			}, 1000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [
		timerActive,
		timeRemaining,
		phase,
		tick,
		stopTimer,
		originalItems,
		baseIcon,
		timerHasStarted,
	]);

	const handleItemClick = (clickedItem: {
		id: number;
		icon: string;
		x: number;
		y: number;
		isNew?: boolean;
	}) => {
		const rawData = {
			gameType: "scene-crasher",
			roundNumber: gameSettings.itemCount,
			correctAnswer: clickedItem.isNew,
			clickedItem: {
				id: clickedItem.id,
				x: clickedItem.x,
				y: clickedItem.y,
				isNew: clickedItem.isNew,
			},
			originalItems: originalItems.length,
			totalItems: finalItems.length,
			timeSpent: 5 - timeRemaining, // Time spent memorizing
		};

		if (clickedItem.isNew) {
			// Correct! Player found the new item
			completeGame(15);
			setPhase("complete");
			setTimeout(() => {
				nextGame();
			}, 2000);
		} else {
			// Wrong! Player clicked an original item
			completeGame(0);
			setPhase("wrong");
			setTimeout(() => {
				nextGame();
			}, 2000);
		}
	};

	const backgroundClass =
		profile?.profession === "teacher"
			? "bg-gradient-to-br from-slate-700 to-slate-800"
			: "bg-gradient-to-br from-amber-100 to-amber-200";

	return (
		<div
			className={`relative w-full h-66 ${backgroundClass} rounded-2xl border-4 border-amber-300 overflow-hidden`}>
			{/* Memorize Phase: Show N identical items */}
			{phase === "memorize" && (
				<>
					<div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-lg font-bold">
						Memorize these positions! ({timeRemaining}s)
					</div>
					{originalItems.map((item) => (
						<div
							key={item.id}
							className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2"
							style={{
								left: `${item.x}%`,
								top: `${item.y}%`,
							}}>
							{item.icon}
						</div>
					))}
				</>
			)}

			{/* Hidden Phase: Empty screen for 1 second */}
			{phase === "hidden" && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-2xl font-bold text-gray-700">Get ready...</div>
				</div>
			)}

			{/* Playing Phase: Show N+1 items, player must click the NEW one */}
			{phase === "playing" && finalItems.length > 0 && (
				<>
					<div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
						Click the NEW item! 🎯
					</div>
					{finalItems.map((item) => (
						<button
							key={item.id}
							onClick={() => handleItemClick(item)}
							className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
							style={{
								left: `${item.x}%`,
								top: `${item.y}%`,
							}}>
							{item.icon}
						</button>
					))}
				</>
			)}

			{/* Loading state during playing phase setup */}
			{phase === "playing" && finalItems.length === 0 && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-2xl font-bold text-gray-700">Loading...</div>
				</div>
			)}

			{/* Complete Phase - Correct Answer */}
			{phase === "complete" && (
				<div className="absolute inset-0 flex items-center justify-center bg-green-400 bg-opacity-90">
					<div className="text-center text-white">
						<div className="text-6xl mb-4">🎉</div>
						<p className="text-3xl font-bold">Perfect! You found it!</p>
					</div>
				</div>
			)}

			{/* Wrong Phase - Incorrect Answer */}
			{phase === "wrong" && (
				<div className="absolute inset-0 flex items-center justify-center bg-red-400 bg-opacity-90">
					<div className="text-center text-white">
						<div className="text-4xl mb-3">❌</div>
						<p className="text-2xl font-bold">Wrong item!</p>
						<p className="text-lg mt-2">That was an original item.</p>
					</div>
				</div>
			)}
		</div>
	);
};
