import {
	Brain,
	GamepadIcon,
	Users,
	Upload,
	BookOpen,
	BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
	const features = [
		{
			icon: BarChart3,
			title: "Alzheimer Score",
			description:
				"Track cognitive and behavioral status over time with our proprietary scoring system that provides clear progression insights for families and clinicians.",
			color: "text-primary",
		},
		{
			icon: GamepadIcon,
			title: "Cognitive Games",
			description:
				"Scientifically-designed memory games that connect long-term to short-term memory, making therapy engaging while slowing disease progression.",
			color: "text-accent",
		},
		{
			icon: Users,
			title: "Caregiver Support",
			description:
				"Comprehensive tools for caregivers including progress tracking, communication features, and educational resources for better care coordination.",
			color: "text-primary",
		},
		{
			icon: Upload,
			title: "AI-Powered MRI Analysis",
			description:
				"Upload MRI scans to receive AI-driven, personalized feedback that enriches clinical evaluations with continuous real-world data.",
			color: "text-accent",
		},
		{
			icon: BookOpen,
			title: "Memory Journal",
			description:
				"Built-in journaling encourages patients to connect short-term experiences with long-term memories, reinforcing continuity in daily life.",
			color: "text-primary",
		},
		{
			icon: Brain,
			title: "Wellness Education",
			description:
				"Comprehensive educational modules delivered in an intuitive format to support patient learning and family understanding.",
			color: "text-accent",
		},
	];

	return (
		<section className="py-24 bg-background">
			<div className="container mx-auto px-4">
				<div className="text-center space-y-4 mb-16">
					<h2 className="text-3xl md:text-4xl font-bold">
						Comprehensive Care in One Platform
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Every feature is designed with both patients and caregivers in mind,
						promoting independence while providing clinical-grade insights.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<Card
								key={index}
								className="p-8 hover:shadow-medium transition-all duration-300 group border-0 shadow-soft">
								<div className="space-y-4">
									<div
										className={`w-12 h-12 rounded-lg bg-gradient-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
										<Icon className={`w-6 h-6 ${feature.color}`} />
									</div>
									<h3 className="text-xl font-semibold">{feature.title}</h3>
									<p className="text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</div>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default Features;
