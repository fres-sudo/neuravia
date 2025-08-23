import { useGameStore } from "@/stores/game-store";

export const GameTitle = () => {
	return (
		<div className="bg-white w-80 mx-auto px-6 lg:px-16 text-center py-2 lg:py-8 rounded-full shadow-lg">
			<span className="font-bold text-center text-xl md:text-2xl lg:text-3xl text-gray-700 capitalize">
				🎮 {useGameStore.getState().currentGame?.replace("-", " ")} 🎲
			</span>
		</div>
	);
};
