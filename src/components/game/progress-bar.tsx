import { useGameProgress } from "@/stores/game-store";

export const ProgressBar = () => {
    const { progress, totalSteps, score } = useGameProgress();
    return (
       <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 2xl:mx-20 flex items-center gap-4 bg-white rounded-full px-6 py-2 shadow-lg border-4 border-gray-200">
          {/* Score Circle */}
          <div className="flex flex-col items-center flex-shrink-0">
             <div className="bg-green-400 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                {score}
             </div>
             <span className="text-xs font-semibold text-gray-700">SCORE</span>
          </div>

          {/* Progress Bar - Now takes up remaining space */}
          <div className="relative flex-1 h-3 bg-gray-200 rounded-full overflow-hidden min-w-0">
             <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress * 100}%` }}
             />
             <div
                className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-500"
                style={{ left: `${Math.max(0, progress * 100 - 2)}%` }}>
                <div className="text-yellow-500 text-base">⭐</div>
             </div>
          </div>

          {/* Total Steps Circle */}
          <div className="flex flex-col items-center flex-shrink-0">
             <div className="bg-blue-400 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                {totalSteps}
             </div>
             <span className="text-xs font-semibold text-gray-700">
                TOT STEPS
             </span>
          </div>
       </div>
    );
};