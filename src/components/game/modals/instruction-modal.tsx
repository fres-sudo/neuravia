import { useGameStore } from "@/stores/game-store";
import { useState } from "react";

export const InstructionModal = () => {
	const currentGame = useGameStore((state) => state.currentGame);
	const showInstructions = useGameStore((state) => state.showInstructions);
	const hideInstructions = useGameStore((state) => state.hideInstructions);
	const [step, setStep] = useState(0);

	if (!showInstructions || !currentGame) return null;

	const instructions = {
		"scene-crasher": [
			{
				title: "Look at the items carefully",
				description: "Remember where each item is placed on the screen",
				image: "🔍 👀",
			},
			{
				title: "Items will disappear",
				description: "After the timer, all items will be hidden",
				image: "⏰ → ❓❓❓",
			},
			{
				title: "Put them back!",
				description: "Click to place items back in their original positions",
				image: "👆 ✨",
			},
		],
		"hawk-eye": [
			{
				title: "Watch the target",
				description: "Follow the highlighted bird as it moves around",
				image: "👁️ 🦅",
			},
			{
				title: "Keep tracking",
				description: "Don't lose sight of your target bird",
				image: "🦅 ↗️ ↖️ ↘️",
			},
			{
				title: "Click the correct one",
				description: "When they stop, click the bird you were watching",
				image: "👆 🎯",
			},
		],
		"todo-list": [
			{
				title: "Read the list",
				description: "Look at the tasks in the correct order",
				image: "📝 1️⃣2️⃣3️⃣",
			},
			{
				title: "Remember the order",
				description: "Tasks will be shuffled - put them back in order",
				image: "🔀 ❓",
			},
			{
				title: "Arrange correctly",
				description: "Drag tasks back into the right sequence",
				image: "👆 ✅",
			},
		],
		"flashing-memory": [
			{
				title: "Watch the numbers",
				description: "Numbers will appear briefly on the grid",
				image: "1️⃣ 2️⃣ 3️⃣ 4️⃣",
			},
			{
				title: "Remember positions",
				description: "Remember where each number appeared",
				image: "🧠 💭",
			},
			{
				title: "Click in order",
				description: "Click the positions in numerical order (1, 2, 3...)",
				image: "👆 1️⃣→2️⃣→3️⃣",
			},
		],
	};

	const gameInstructions = instructions[currentGame];
	const currentInstruction = gameInstructions[step];

	return (
		<div className="fixed inset-0 bg-slate-200 bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-3xl p-8 max-w-2xl mx-4 shadow-2xl">
				<div className="text-center mb-8">
					<h3 className="text-3xl font-bold text-gray-700 mb-4 capitalize">
						{currentGame.replace("-", " ")} - Step {step + 1}
					</h3>
					<h4 className="text-2xl font-semibold text-blue-600 mb-4">
						{currentInstruction?.title}
					</h4>
					<p className="text-lg text-gray-600 mb-6">
						{currentInstruction?.description}
					</p>
					<div className="text-6xl mb-6">{currentInstruction?.image}</div>
				</div>

				<div className="flex justify-between items-center">
					<button
						onClick={() => setStep(Math.max(0, step - 1))}
						disabled={step === 0}
						className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-700 font-bold py-3 px-6 rounded-2xl transition-colors">
						Previous
					</button>

					<div className="flex gap-2">
						{gameInstructions.map((_, index) => (
							<div
								key={index}
								className={`w-3 h-3 rounded-full ${
									index === step ? "bg-blue-500" : "bg-gray-300"
								}`}
							/>
						))}
					</div>

					{step < gameInstructions.length - 1 ? (
						<button
							onClick={() => setStep(step + 1)}
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl transition-colors">
							Next
						</button>
					) : (
						<button
							onClick={() => {
								hideInstructions();
								setStep(0);
							}}
							className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl transition-colors">
							Start Game!
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
