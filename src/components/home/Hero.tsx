"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Heart } from "lucide-react";
import Image from "next/image";
import { useSession } from "@/server/auth/auth-client";
import { useRouter } from "next/navigation";

const Hero = () => {
	const { data: session } = useSession();
	const router = useRouter();

	const handleGetStarted = () => {
		if (session?.user) {
			router.push("/dashboard");
		} else {
			router.push("/register");
		}
	};

	return (
		<section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden pt-16">
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
								className="group"
								onClick={handleGetStarted}>
								{session?.user ? "Go to Dashboard" : "Get Started Now"}
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Button>
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
