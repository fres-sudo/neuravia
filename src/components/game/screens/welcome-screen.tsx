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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

// Function to get emojis from patient data
const getPatientEmojis = (patient: any): string[] => {
	if (!patient?.emojis) return ["🧠", "🎯", "⭐"];
	
	try {
		return JSON.parse(patient.emojis);
	} catch {
		return ["🧠", "🎯", "⭐"];
	}
};

export const WelcomeScreen = ({ patientId, patient, lastBoostScore = 0 }: WelcomeScreenProps) => {
	const { startSession } = useGameStore();
	const [isStarting, setIsStarting] = useState(false);
	const [showCalendar, setShowCalendar] = useState(false);

	// Determine game settings based on patient data and boost score
	const difficulty = getDifficultyFromScore(lastBoostScore);
	const profession = getProfessionFromPatient(patient);
	const patientEmojis = getPatientEmojis(patient);

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

	const handleStartGame = async () => {
		if (!patientId) return;
		
		setIsStarting(true);
		
		try {
			const profile = {
				profession,
				difficultyLevel: difficulty,
				customAssets: getProfessionAssets(),
			};

			startSession("short", profile, patientId);
			toast.success("Game session started! 🎮");
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">

			{/* Main content */}
			<div className="container mx-auto px-6 py-10">
				<div className="max-w-4xl mx-auto">
					{/* Welcome header */}
					<div className="text-center mb-4">
						<div className="flex justify-center mb-4">
							{patientEmojis.map((emoji, index) => (
								<div
									key={index}
									className="text-3xl mx-1 animate-bounce"
									style={{ animationDelay: `${index * 0.2}s` }}
								>
									{emoji}
								</div>
							))}
						</div>
						<h1 className="text-3xl font-bold text-gray-700 mb-2">
							Welcome back, {patient?.name?.split(' ')[0] || 'Friend'}!
						</h1>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Ready for some brain training? Let's keep your mind sharp and active!
						</p>
					</div>

					{/* Game stats and info */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
						<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
							<CardContent className="p-1">
								<div className="flex items-center space-x-3 justify-center">
									<div className="p-2 bg-blue-100 rounded-full">
										<Target className="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-800">Current Level</h3>
										<p className="text-sm text-gray-600">{currentDifficulty.label}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
							<CardContent className="p-1">
								<div className="flex items-center space-x-3 justify-center">
									<div className="p-2 bg-green-100 rounded-full">
										<Brain className="h-5 w-5 text-green-600" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-800">Boost Score</h3>
										<p className="text-sm text-gray-600">{lastBoostScore.toFixed(0)}/100</p>
									</div>
								</div>
								<Progress value={lastBoostScore} className="mt-3" />
							</CardContent>
						</Card>

						<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
							<CardContent className="p-1">
								<div className="flex items-center space-x-3 justify-center">
									<div className="p-2 bg-purple-100 rounded-full">
										<Clock className="h-5 w-5 text-purple-600" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-800">Session Length</h3>
										<p className="text-sm text-gray-600">4 games (~15 min)</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Main action buttons */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						{/* Start Game Button */}
						<Card className="bg-gradient-to-br from-green-400 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
							<CardContent className="p-4 text-center">
								<div className="mb-2">
									<Gamepad2 className="h-10 w-10 text-white mx-auto mb-2" />
									<h2 className="text-3xl font-bold text-white mb-2">Start Training</h2>
									<p className="text-green-100 text-lg">
										Begin your cognitive training session
									</p>
								</div>
								
								<div className="mb-4 p-4 bg-white/20 rounded-lg">
									<h3 className="text-white font-semibold mb-2">Today's Settings</h3>
									<div className="text-green-100 text-sm space-y-1">
										<div className="flex justify-between">
											<span>Difficulty:</span>
											<span className="font-semibold">{currentDifficulty.label}</span>
										</div>
										<div className="flex justify-between">
											<span>Games:</span>
											<span className="font-semibold">4 different challenges</span>
										</div>
										<div className="flex justify-between">
											<span>Focus:</span>
											<span className="font-semibold capitalize">{profession}</span>
										</div>
									</div>
								</div>

								<Button
									onClick={handleStartGame}
									disabled={isStarting}
									className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-4 text-lg rounded-xl transition-all duration-300"
								>
									{isStarting ? (
										<div className="flex items-center space-x-2">
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
											<span>Starting...</span>
										</div>
									) : (
										<div className="flex items-center space-x-2">
											<Play className="h-4 w-4" />
											<span>Start Training</span>
										</div>
									)}
								</Button>
							</CardContent>
						</Card>

						{/* Calendar Button */}
						<Card className="bg-gradient-to-br from-orange-400 to-orange-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
							<CardContent className="p-4 text-center">
								<div className="mb-2">
									<Calendar className="h-10 w-10 text-white mx-auto mb-2" />
									<h2 className="text-3xl font-bold text-white mb-2">Training Schedule</h2>
									<p className="text-orange-100 text-lg">
										Keep track of your sessions!
									</p>
								</div>
								
								<div className="mb-4 p-4 bg-white/20 rounded-lg">
									<h3 className="text-white font-semibold mb-2">Recent Activity</h3>
									<div className="text-orange-100 text-sm space-y-1">
										<div className="flex justify-between">
											<span>Next Session:</span>
											<span className="font-semibold">-</span>
										</div>
										<div className="flex justify-between">
											<span>Activities to be done:</span>
											<span className="font-semibold">-</span>
										</div>
										<div className="flex justify-between">
											<span>Streak:</span>
											<span className="font-semibold">-</span>
										</div>
									</div>
								</div>

								<Button
									onClick={() => setShowCalendar(true)}
									className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-4 text-lg rounded-xl transition-all duration-300"
								>
									<div className="flex items-center space-x-2">
										<Star className="h-4 w-4" />
										<span>View Schedule</span>
									</div>
								</Button>
							</CardContent>
						</Card>
					</div>


				</div>
			</div>

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
