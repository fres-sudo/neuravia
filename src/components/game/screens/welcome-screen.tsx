"use client";

import { useGameStore } from "@/stores/game-store";
import { useState } from "react";
import { ProfileSetupModal } from "../modals/profile-setup-modal";

interface WelcomeScreenProps {
	patientId?: string;
}

export const WelcomeScreen = ({ patientId }: WelcomeScreenProps) => {
	const showWelcome = useGameStore((state) => state.showWelcome);
	const [showProfile, setShowProfile] = useState(false);

	if (!showWelcome) return null;

	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-8">
				<h1 className="text-8xl font-bold text-gray-700 mb-16 text-center tracking-wide">
					Welcome
				</h1>

				<div className="flex gap-12 w-full max-w-4xl">
					<button
						onClick={() => setShowProfile(true)}
						className="flex-1 bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white text-4xl font-bold py-12 px-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-green-300">
						PLAY
					</button>

					<button
						onClick={() => alert("Calendar feature coming soon")}
						className="flex-1 bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-4xl font-bold py-12 px-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-orange-300">
						CALENDAR
					</button>
				</div>
			</div>

			{showProfile && (
				<ProfileSetupModal 
					onClose={() => setShowProfile(false)} 
					patientId={patientId}
				/>
			)}
		</>
	);
};
