"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Shield, Users, Play, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useSession } from "@/server/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const Hero = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	const handleGetStarted = () => {
		if (session?.user) {
			router.push("/dashboard");
		} else {
			router.push("/register");
		}
	};

	const stats = [
		{ icon: Users, value: "Families", label: "Supported" },
		{ icon: Brain, value: "Cognitive", label: "Care" },
		{ icon: Shield, value: "Secure", label: "Platform" },
	];

	const features = [
		"Scientifically validated cognitive games",
		"Real-time progress tracking",
		"Clinical-grade assessments",
		"Secure and private"
	];

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
			{/* Enhanced Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
			<div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
			<div className="absolute bottom-20 -right-20 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-75"></div>
			
			<div className="container mx-auto px-4 relative z-10">
				<div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
					<div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
						{/* Trust Badge */}
						<div className="flex items-center gap-3 text-blue-700 font-medium bg-blue-50 px-4 py-2 rounded-full w-fit border border-blue-100">
							<Brain className="w-5 h-5" />
							<span className="text-sm font-semibold">Advanced Cognitive Care Platform</span>
						</div>

						{/* Main Heading */}
						<div className="space-y-6">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-gray-900">
								Transform Alzheimer's Care with{" "}
								<span className="text-blue-600 relative">
									Precision Tracking
									<svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 100 6" fill="none">
										<path d="M0 3C20 1 40 1 60 3C80 5 100 5 100 3" stroke="#3B82F6" strokeWidth="2" fill="none"/>
									</svg>
								</span>
							</h1>
							
							<p className="text-xl text-gray-600 leading-relaxed max-w-xl">
								Empower caregivers with scientifically validated cognitive games that provide precise Alzheimer's progression tracking through our proprietary scoring system.
							</p>
						</div>

						{/* Feature List */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{features.map((feature, index) => (
								<div key={index} className="flex items-center gap-3 group">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
									<span className="text-gray-700 text-sm font-medium">{feature}</span>
								</div>
							))}
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Button
								size="lg"
								className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								onClick={handleGetStarted}>
								{session?.user ? "Go to Dashboard" : "Start Free Trial"}
								<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>
							<Link href="https://youtu.be/fW6RfPTXViga" about="_blank">
							<Button
								variant="outline"
								size="lg"
								className="group px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300">
								<Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
								Watch Demo
							</Button>
							</Link>
							
						</div>

						{/* Social Proof Stats */}
						<div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
							{stats.map((stat, index) => (
								<div key={index} className="text-center group cursor-pointer">
									<div className="flex justify-center mb-2">
										<stat.icon className="w-6 h-6 text-blue-600 group-hover:scale-125 transition-transform duration-300" />
									</div>
									<div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{stat.value}</div>
									<div className="text-sm text-gray-500">{stat.label}</div>
								</div>
							))}
						</div>
					</div>

					{/* Enhanced Image Section */}
					<div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
						<div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500 group">
							<Image
								src="/hero-image.png"
								width={600}
								height={500}
								alt="Elderly person using cognitive training app with caregiver support"
								className="w-full h-auto object-cover group-hover:brightness-105 transition-all duration-500"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent group-hover:from-black/5 transition-all duration-500"></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
