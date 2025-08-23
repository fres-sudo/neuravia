"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { WelcomeScreen } from "@/components/game/screens/welcome-screen";
import { GameScreen } from "@/components/game/screens/game-screen";

function RoomPage() {
	const params = useParams();
	const caregiverId = params.caregiverId as string;
	const patientId = params.patientId as string;

	const showWelcome = useGameStore((state) => state.showWelcome);
	const isPlaying = useGameStore((state) => state.isPlaying);

	return (
		<div className="font-sans bg-white">
			{showWelcome && <WelcomeScreen patientId={patientId} />}
			{isPlaying && <GameScreen />}
		</div>
	);
}

export default RoomPage;
