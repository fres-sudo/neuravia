import { useGameStore } from "@/stores/game-store";

export const GameTitle = () => {
    return (
       <div className="bg-white w-80 mx-auto px-4 lg:px-12 text-center py-1 lg:py-3 rounded-full shadow-lg">
          <span className="font-bold text-center text-lg md:text-xl lg:text-2xl text-gray-700 capitalize">
             🎮 {useGameStore.getState().currentGame?.replace("-", " ")} 🎲
          </span>
       </div>
    );
};
