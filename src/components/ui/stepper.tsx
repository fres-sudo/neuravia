// ./src/components/ui/stepper.tsx
import { Check } from "lucide-react";
import clsx from "clsx";

interface Step {
	label: string;
	icon: React.ReactNode;
}

interface StepperProps {
	steps: Step[];
	currentStep: number; // deve andare da 1 a steps.length
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
	return (
		<div className="flex items-center justify-between gap-2 px-4 py-6 relative">
			{steps.map((step, index) => {
				const stepIndex = index + 1; // Adatta da 0-based a 1-based
				const isCompleted = stepIndex < currentStep;
				const isActive = stepIndex === currentStep;
				const isUpcoming = stepIndex > currentStep;
				const isLast = stepIndex === steps.length;

				return (
					<div
						key={index}
						className="flex flex-col items-center flex-1 relative">
						{/* Punto */}
						<div
							className={clsx(
								"w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all border-2",
								{
									"bg-blue-600 text-white border-blue-600": isCompleted,
									"bg-white text-blue-600 border-blue-600": isActive,
									"bg-gray-300 text-gray-500 border-gray-300": isUpcoming,
								}
							)}>
							{isCompleted ? <Check className="w-5 h-5" /> : step.icon}
						</div>

						{/* Etichetta */}
						<span
							className={clsx(
								"text-sm mt-2 text-center font-medium transition-all",
								{
									"text-blue-600": isCompleted || isActive,
									"text-gray-400": isUpcoming,
								}
							)}>
							{step.label}
						</span>

						{/* Linea */}
						{!isLast && (
							<div
								className={clsx("absolute top-5 h-1 z-0 transition-all", {
									"bg-blue-600": isCompleted,
									"bg-gray-300": !isCompleted,
								})}
								style={{
									left: "50%",
									right: "-50%",
									transform: "translateY(-50%)",
								}}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
};
