import {
	useGameSession,
	type DifficultyLevel,
	type GameMode,
	type PlayerProfile,
} from "@/stores/game-store";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";

interface ProfileSetupModalProps {
	onClose: () => void;
	patientId?: string;
}

export const ProfileSetupModal = ({ onClose, patientId }: ProfileSetupModalProps) => {
	const { startSession } = useGameSession();
	const [step, setStep] = useState(1); // Start directly at difficulty selection
	const [profession, setProfession] = useState("");
	const [difficulty, setDifficulty] = useState<DifficultyLevel>("mild");
	const [gameMode, setGameMode] = useState<GameMode>("short");

	// Fetch patient data
	const { data: patients, isLoading } = api.patients.fetch.useQuery();
	const currentPatient = patients?.find(p => p.id === patientId);

	const difficulties = [
		{
			value: "mild",
			label: "Mild",
			description: "More time, more items",
			color: "bg-green-400",
		},
		{
			value: "moderate",
			label: "Moderate",
			description: "Standard difficulty",
			color: "bg-yellow-400",
		},
		{
			value: "severe",
			label: "Severe",
			description: "More time, fewer items",
			color: "bg-orange-400",
		},
	];

	const handleStart = () => {
		const customAssets = {
			"scene-crasher": {
				background: profession === "teacher" ? "blackboard" : "office",
				items:
					profession === "teacher"
						? ["📚", "✏️", "🍎", "📐"]
						: ["📱", "🔑", "☕", "📎"],
			},
			"hawk-eye": {
				background: "sky",
				items: ["🦅", "🐦", "🦜", "🕊️"],
			},
			"todo-list": {
				background: "paper",
				items: ["✓", "📝", "⏰", "📌"],
			},
			"flashing-memory": {
				background: "grid",
				items: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
			},
		};

		const profile: PlayerProfile = {
			profession,
			difficultyLevel: difficulty,
			customAssets,
		};

		startSession(gameMode, profile);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-3xl p-8 max-w-2xl mx-4 shadow-2xl">
				{/* Show difficulty step */}
				{step === 1 && (
					<div className="text-center">
						<h3 className="text-3xl font-bold text-gray-700 mb-6">
							Difficulty Level
						</h3>
						<div className="space-y-4">
							{difficulties.map((diff) => (
								<button
									key={diff.value}
									onClick={() => {
										setDifficulty(diff.value as DifficultyLevel);
										setStep(2);
									}}
									className={`w-full p-6 ${diff.color} hover:opacity-80 text-white rounded-2xl transition-opacity`}>
									<div className="font-bold text-xl">{diff.label}</div>
									<div className="text-sm opacity-90">{diff.description}</div>
								</button>
							))}
						</div>
					</div>
				)}

				{step === 2 && (
					<div className="text-center">
						<h3 className="text-3xl font-bold text-gray-700 mb-6">
							Game Length
						</h3>
						<div className="space-y-4">
							<button
								onClick={() => {
									setGameMode("short");
									handleStart();
								}}
								className="w-full p-6 bg-blue-400 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl transition-colors">
								SHORT GAME
								<div className="text-sm opacity-90">4 rounds</div>
							</button>
							<button
								onClick={() => {
									setGameMode("long");
									handleStart();
								}}
								className="w-full p-6 bg-indigo-400 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xl transition-colors">
								LONG GAME
								<div className="text-sm opacity-90">16 rounds</div>
							</button>
						</div>
						<button
							onClick={() => setStep(1)}
							className="mt-6 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 rounded-xl">
							← Back
						</button>
					</div>
				)}

				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	);
};
