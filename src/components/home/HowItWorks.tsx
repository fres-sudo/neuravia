import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const HowItWorks = () => {
	const steps = [
		{
			step: "01",
			title: "Initial Assessment",
			description:
				"Complete a comprehensive cognitive baseline assessment through our scientifically-validated games and questionnaires.",
		},
		{
			step: "02",
			title: "Daily Engagement",
			description:
				"Play 10-15 minutes of memory-connecting games daily, designed to be enjoyable while providing therapeutic benefits.",
		},
		{
			step: "03",
			title: "Progress Tracking",
			description:
				"Your Alzheimer Score updates automatically, giving families and clinicians clear insights into cognitive changes over time.",
		},
		{
			step: "04",
			title: "Clinical Integration",
			description:
				"Share progress reports with healthcare providers and upload MRI scans for AI-enhanced clinical evaluations.",
		},
	];

	const benefits = [
		"Promotes patient autonomy and dignity",
		"Provides clarity for families and caregivers",
		"Offers clinical-grade progression tracking",
		"Integrates seamlessly with healthcare workflows",
		"Transforms therapy into engaging daily routine",
	];

	return (
		<section className="py-24 bg-gradient-subtle">
			<div className="container mx-auto px-4">
				<div className="max-w-7xl mx-auto">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Simple steps that create profound impact for patients, families,
							and healthcare providers.
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<div className="space-y-8">
							{steps.map((step, index) => (
								<div
									key={index}
									className="flex gap-6 group">
									<div className="flex-shrink-0">
										<div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
											{step.step}
										</div>
									</div>
									<div className="space-y-2 pt-1">
										<h3 className="text-xl font-semibold">{step.title}</h3>
										<p className="text-muted-foreground leading-relaxed">
											{step.description}
										</p>
									</div>
								</div>
							))}
						</div>

						<div className="bg-card rounded-2xl p-8 shadow-medium">
							<h3 className="text-2xl font-bold mb-6">Key Benefits</h3>
							<div className="space-y-4 mb-8">
								{benefits.map((benefit, index) => (
									<div
										key={index}
										className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
										<span className="text-foreground">{benefit}</span>
									</div>
								))}
							</div>
							<Button
								size="lg"
								className="w-full group">
								Start Your Journey Today
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HowItWorks;
