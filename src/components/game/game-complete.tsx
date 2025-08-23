export const GameComplete = ({ message = "Great job!" }) => (
	<div className="absolute inset-0 flex items-center justify-center bg-green-400 bg-opacity-90 z-20">
		<div className="text-center text-white">
			<div className="text-6xl mb-4">🎉</div>
			<p className="text-3xl font-bold">{message}</p>
		</div>
	</div>
);
