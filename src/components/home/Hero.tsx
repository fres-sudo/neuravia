import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Heart } from "lucide-react";
import Image from "next/image";

const Hero = () => {
	return (
		<section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden">
			<div className="container mx-auto px-4 py-20">
				<div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
					<div className="space-y-8">
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-primary font-medium">
								<Brain className="w-5 h-5" />
								<span>Advanced Cognitive Care</span>
							</div>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
								Transform Alzheimer's Care with{" "}
								<span className="bg-gradient-hero bg-clip-text text-transparent">
									Precision Tracking
								</span>
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
								The caregiver sends a simple link to the patient who starts
								playing with scientifically validated games. From these we
								obtain precise evaluations through the Alzheimer Score to track
								cognitive evolution over time.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							<Button
								variant={"hero"}
								className="group">
								Start Free Assessment
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Button>
							<Button variant="outline">Watch Demo</Button>
						</div>

						<div className="flex items-center gap-8 pt-4">
							<div className="flex items-center gap-2">
								<Heart className="w-5 h-5 text-accent fill-accent" />
								<span className="text-sm text-foreground">
									Trusted by 10,000+ families
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-accent rounded-full"></div>
								<span className="text-sm text-foreground">
									FDA-compliant design
								</span>
							</div>
						</div>
					</div>

					<div className="relative">
						<div className="relative rounded-2xl overflow-hidden shadow-large">
							<Image
								src="/alzheimer-score.png"
								width={500}
								height={500}
								alt="Elderly person using cognitive training app with caregiver support"
								className="w-full h-auto object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
						</div>
						<div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-primary rounded-full blur-3xl opacity-20"></div>
						<div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-hero rounded-full blur-3xl opacity-15"></div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
