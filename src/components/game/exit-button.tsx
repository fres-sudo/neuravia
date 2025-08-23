import { useGameSession } from "@/stores/game-store";

export const ExitButton = () => {
	const { endSession } = useGameSession();

	return (
		<button
			onClick={endSession}
			className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white rounded-2xl p-4 shadow-lg transition-colors"
			aria-label="Torna alla schermata iniziale">
			<svg
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="3">
				<path d="M18 6L6 18M6 6l12 12" />
			</svg>
		</button>
	);
};
