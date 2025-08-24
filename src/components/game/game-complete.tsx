interface GameCompleteProps {
	message?: string;
	isCorrect?: boolean;
}

export const GameComplete = ({ message = "Great job!", isCorrect = true }: GameCompleteProps) => (
	<div className={`absolute inset-0 flex items-center justify-center ${isCorrect ? 'bg-green-400' : 'bg-red-400'} bg-opacity-90 z-20`}>
		<div className="text-center text-white">
			<div className="text-6xl mb-4">{isCorrect ? '🎉' : '❌'}</div>
			<p className="text-3xl font-bold">{message}</p>
		</div>
	</div>
);
