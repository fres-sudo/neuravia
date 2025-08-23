import { useGameTimer } from "./../../stores/game-store";

export const GameTimer = () => {
	const { timeRemaining, timerActive } = useGameTimer();

	// if (!timerActive && timeRemaining === 0) return null;

	return (
		<div className="w-64 mx-auto bg-sky-400 text-white text-7xl font-bold rounded-2xl px-6 py-4 min-w-[100px] text-center shadow-lg">
			{timeRemaining}
		</div>
	);
};
