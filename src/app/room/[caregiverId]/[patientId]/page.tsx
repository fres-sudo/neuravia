"use client";
import React from "react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { useGameStore } from "@/stores/game-store";
import { WelcomeScreen } from "@/components/game/screens/welcome-screen";
import { GameScreen } from "@/components/game/screens/game-screen";
import { Skeleton } from "@/components/ui/skeleton";

function RoomPage() {
	const params = useParams();
	const caregiverId = params.caregiverId as string;
	const patientId = params.patientId as string;

	// Fetch patient data
	const { data: patients, isLoading: patientLoading } = api.patients.fetch.useQuery();
	const currentPatient = patients?.find(p => p.id === patientId);

	// Fetch latest boost score
	const { data: latestScore, isLoading: scoreLoading } = api.scoring.getLatestScore.useQuery(
		{ patientId },
		{ enabled: !!patientId }
	);

	const showWelcome = useGameStore((state) => state.showWelcome);
	const isPlaying = useGameStore((state) => state.isPlaying);

	// Loading state
	if (patientLoading || scoreLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-8">
				<div className="text-center space-y-6">
					<Skeleton className="h-32 w-96 mx-auto" />
					<Skeleton className="h-8 w-64 mx-auto" />
					<Skeleton className="h-8 w-48 mx-auto" />
				</div>
			</div>
		);
	}

	// Error state
	if (!currentPatient) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex flex-col items-center justify-center p-8">
				<div className="text-center space-y-6">
					<div className="text-6xl">😔</div>
					<h1 className="text-3xl font-bold text-red-600">Patient Not Found</h1>
					<p className="text-gray-600">The patient you're looking for doesn't exist.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="font-sans bg-white">
			{showWelcome && (
				<WelcomeScreen 
					patientId={patientId} 
					patient={currentPatient}
					lastBoostScore={latestScore?.newScore ?? 0}
				/>
			)}
			{isPlaying && <GameScreen />}
		</div>
	);
}

export default RoomPage;
