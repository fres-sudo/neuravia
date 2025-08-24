"use client";

import { useGameStore } from "@/stores/game-store";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { 
	Brain, 
	TrendingUp, 
	User, 
	Play, 
	Calendar,
	Target,
	Clock,
	Star,
	Sparkles,
	Gamepad2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
	patientId?: string;
	patient?: any;
	lastBoostScore?: number;
}

// Function to determine difficulty based on boost score
const getDifficultyFromScore = (score: number): "mild" | "moderate" | "severe" => {
	if (score >= 70) return "mild";
	if (score >= 40) return "moderate";
	return "severe";
};

// Function to get profession from patient data
const getProfessionFromPatient = (patient: any): string => {
	if (!patient?.job) return "general";
	
	if (patient.job.type === "other") {
		return patient.job.customLabel?.toLowerCase() || "general";
	}
	return patient.job.type;
};

export const WelcomeScreen = ({ patientId, patient, lastBoostScore = 0 }: WelcomeScreenProps) => {
	const { startSession } = useGameStore();
	const [isStarting, setIsStarting] = useState(false);
	const [showCalendar, setShowCalendar] = useState(false);
	const [showSessionTypeModal, setShowSessionTypeModal] = useState(false);

	// Determine game settings based on patient data and boost score
	const difficulty = getDifficultyFromScore(lastBoostScore);
	const profession = getProfessionFromPatient(patient);

	// Get profession-specific assets
	const getProfessionAssets = () => {
		const baseAssets = {
			"scene-crasher": {
				background: profession === "teacher" ? "blackboard" : "office",
				items: profession === "teacher" 
					? ["📚", "✏️", "🍎", "📐", "🎨", "🎵"]
					: ["📱", "🔑", "☕", "📎", "💼", "🖥️"],
			},
			"hawk-eye": {
				background: "sky",
				items: ["🦅", "🐦", "🦜", "🕊️", "🦢", "🦆"],
			},
			"todo-list": {
				background: "paper",
				items: ["✓", "📝", "⏰", "📌", "📋", "🎯"],
			},
			"flashing-memory": {
				background: "grid",
				items: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
			},
		};

		return baseAssets;
	};

	const handleStartGame = () => {
		if (!patientId || isStarting) return;
		setShowSessionTypeModal(true);
	};

	const handleSessionTypeSelect = async (sessionType: "short" | "long") => {
		if (!patientId) return;
		
		setIsStarting(true);
		setShowSessionTypeModal(false);
		
		try {
			const profile = {
				profession,
				difficultyLevel: difficulty,
				customAssets: getProfessionAssets(),
			};

			startSession(sessionType, profile, patientId);
			const sessionsCount = sessionType === "short" ? 3 : 10;
			toast.success(`${sessionType === "short" ? "Short" : "Long"} session started! Playing 4 games ${sessionsCount} times 🎮`);
		} catch (error) {
			toast.error("Failed to start game session");
			console.error(error);
		} finally {
			setIsStarting(false);
		}
	};

	const difficultyInfo = {
		mild: {
			label: "Mild",
			description: "More time, more items",
			color: "bg-green-500",
			textColor: "text-green-700",
			bgColor: "bg-green-50",
		},
		moderate: {
			label: "Moderate", 
			description: "Standard difficulty",
			color: "bg-yellow-500",
			textColor: "text-yellow-700",
			bgColor: "bg-yellow-50",
		},
		severe: {
			label: "Severe",
			description: "More time, fewer items", 
			color: "bg-orange-500",
			textColor: "text-orange-700",
			bgColor: "bg-orange-50",
		},
	};

	const currentDifficulty = difficultyInfo[difficulty];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center">

			{/* Main content */}
			<div className="container mx-auto px-6 py-10">
				<div className="max-w-4xl mx-auto">
					{/* Welcome header */}
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-700 mb-4">
							Welcome back, {patient?.name?.split(' ')[0] || 'Friend'}!
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Ready for some brain training? Let's keep your mind sharp and active!
						</p>
					</div>

					{/* Main action buttons */}
					<div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto mt-12">
						{/* Start Game Button */}
						<Card 
							className={`bg-gradient-to-br from-green-400 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
								isStarting ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
							}`}
							onClick={handleStartGame}
						>
							<CardContent className="p-8 text-center">
								<div className="text-white font-bold text-4xl">
									{isStarting ? (
										<div className="flex items-center justify-center space-x-3">
											<div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white"></div>
											<span>Starting...</span>
										</div>
									) : (
										"START"
									)}
								</div>
							</CardContent>
						</Card>
					</div>


				</div>
			</div>

			{/* Session Type Selection Modal */}
			{showSessionTypeModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl">
						<div className="text-center mb-6">
							<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<Clock className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Session Length</h3>
							<p className="text-gray-600">Select how long you want to play today</p>
						</div>
						
						<div className="space-y-4">
							{/* Short Session Option */}
							<button
								onClick={() => handleSessionTypeSelect("short")}
								disabled={isStarting}
								className="w-full p-6 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<div className="text-center">
									<div className="text-3xl mb-2">⚡</div>
									<div className="font-bold text-xl">Short Session</div>
									<div className="text-green-100 text-sm">4 games × 3 rounds</div>
									<div className="text-green-100 text-xs mt-1">~2 minutes</div>
								</div>
							</button>

							{/* Long Session Option */}
							<button
								onClick={() => handleSessionTypeSelect("long")}
								disabled={isStarting}
								className="w-full p-6 bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<div className="text-center">
									<div className="text-3xl mb-2">🚀</div>
									<div className="font-bold text-xl">Long Session</div>
									<div className="text-blue-100 text-sm">4 games × 10 rounds</div>
									<div className="text-blue-100 text-xs mt-1">~10 minutes</div>
								</div>
							</button>
						</div>

						{/* Cancel Button */}
						<button
							onClick={() => setShowSessionTypeModal(false)}
							disabled={isStarting}
							className="w-full mt-4 p-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						
						{isStarting && (
							<div className="mt-4 flex items-center justify-center space-x-2 text-gray-600">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
								<span>Starting session...</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Calendar modal placeholder */}
			{showCalendar && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-2xl mx-4">
						<h2 className="text-2xl font-bold mb-4">Progress History</h2>
						<p className="text-gray-600 mb-6">
							This feature is coming soon! You'll be able to view your training history, 
							progress charts, and performance analytics.
						</p>
						<Button onClick={() => setShowCalendar(false)}>
							Close
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
