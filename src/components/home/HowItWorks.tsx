import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, UserCheck, TrendingUp, Shield, Check } from "lucide-react";
import Link from "next/link";

const HowItWorks = () => {
	const steps = [
		{
			step: "01",
			icon: UserCheck,
			title: "Initial Assessment",
			description:
				"Complete a comprehensive cognitive baseline assessment through our scientifically-validated games and questionnaires.",
			duration: "10-15 minutes",
			color: "blue"
		},
		{
			step: "02", 
			icon: Clock,
			title: "Daily Engagement",
			description:
				"Play 10-15 minutes of memory-connecting games daily, designed to be enjoyable while providing therapeutic benefits.",
			duration: "Daily routine",
			color: "blue"
		},
		{
			step: "03",
			icon: TrendingUp,
			title: "Progress Tracking",
			description:
				"Your Alzheimer Score updates automatically, giving families and clinicians clear insights into cognitive changes over time.",
			duration: "Real-time updates",
			color: "blue"
		},
		{
			step: "04",
			icon: Shield,
			title: "Clinical Integration",
			description:
				"Share progress reports with healthcare providers and upload MRI scans for AI-enhanced clinical evaluations.",
			duration: "Seamless workflow",
			color: "blue"
		},
	];

	const benefits = [
		{
			title: "Promotes patient autonomy and dignity"
		},
		{
			title: "Provides clarity for families and caregivers"
		},
		{
			title: "Offers clinical-grade progression tracking"
		},
		{
			title: "Integrates seamlessly with healthcare workflows"
		},
		{
			title: "Transforms therapy into engaging daily routine"
		},
	];

	const getColorClasses = (color: string) => {
		const colors = {
			blue: {
				bg: "bg-blue-50",
				text: "text-blue-600",
				border: "border-blue-200",
				gradient: "from-blue-500 to-blue-600"
			},
			green: {
				bg: "bg-green-50", 
				text: "text-green-600",
				border: "border-green-200",
				gradient: "from-green-500 to-green-600"
			},
			purple: {
				bg: "bg-purple-50",
				text: "text-purple-600", 
				border: "border-purple-200",
				gradient: "from-purple-500 to-purple-600"
			},
			orange: {
				bg: "bg-orange-50",
				text: "text-orange-600",
				border: "border-orange-200", 
				gradient: "from-orange-500 to-orange-600"
			}
		};
		return colors[color as keyof typeof colors] || colors.blue;
	};

	return (
		<section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
			
			<div className="container mx-auto px-4 relative">
				<div className="max-w-7xl mx-auto">
					{/* Section Header */}
					<div className="text-center space-y-6 mb-20">
						<div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm border border-blue-100">
							Simple Process
						</div>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900">
							How It <span className="text-blue-600">Works</span>
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
							Four simple steps that create profound impact for patients, families, and healthcare providers. Get started in minutes, see results in days.
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-20 items-start">
						{/* Steps */}
						<div className="space-y-12">
							{steps.map((step, index) => {
								const colorClasses = getColorClasses(step.color);
								const IconComponent = step.icon;
								
								return (
									<div key={index} className="flex gap-6 group relative">
										{/* Connecting line */}
										{index < steps.length - 1 && (
											<div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-gray-300 to-gray-100"></div>
										)}
										
										{/* Step number and icon */}
										<div className="flex-shrink-0 relative">
											<div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses.gradient} flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-all duration-300 shadow-lg`}>
												{step.step}
											</div>
											<div className={`absolute -bottom-2 -right-2 w-6 h-6 ${colorClasses.bg} rounded-full border-2 ${colorClasses.border} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
												<IconComponent className={`w-3 h-3 ${colorClasses.text}`} />
											</div>
										</div>
										
										{/* Content */}
										<div className="space-y-3 pt-1 flex-1">
											<div className="flex items-center gap-3 flex-wrap">
												<h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
													{step.title}
												</h3>
												<span className={`text-xs ${colorClasses.text} ${colorClasses.bg} px-3 py-1 rounded-full font-semibold border ${colorClasses.border}`}>
													{step.duration}
												</span>
											</div>
											<p className="text-gray-600 leading-relaxed">
												{step.description}
											</p>
										</div>
									</div>
								);
							})}
						</div>

						{/* Benefits Card */}
						<div className="lg:sticky lg:top-8">
							<div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
								{/* Card background decoration */}
								<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full transform translate-x-16 -translate-y-16"></div>
								
								<div className="relative">
									<h3 className="text-2xl font-bold text-gray-900 mb-6">
										Key Benefits
									</h3>
									
									<div className="space-y-4 mb-8">
										{benefits.map((benefit, index) => (
											<div key={index} className="flex items-start gap-4 group cursor-pointer">
												<div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center group-hover:scale-110 transition-transform">
													<Check className="w-4 h-4 text-white" />
												</div>
												<span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
													{benefit.title}
												</span>
											</div>
										))}
									</div>
									
									{/* CTA Button */}
									<Link href="/register">
										<Button size="lg" className="w-full group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
											Start Your Journey Today
											<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
										</Button>
									</Link>

									{/* Trust indicators */}
									<div className="mt-6 pt-6 border-t border-gray-100">
										<div className="flex items-center justify-center gap-6 text-sm text-gray-500">
											<div className="flex items-center gap-2">
												<CheckCircle className="w-4 h-4 text-green-500" />
												<span>Secure & Private</span>
											</div>
											<div className="flex items-center gap-2">
												<CheckCircle className="w-4 h-4 text-green-500" />
												<span>Clinically Validated</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HowItWorks;
