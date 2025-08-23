import Image from "next/image";
import Link from "next/link";
import { Brain, Users, BarChart3, Stethoscope, BookOpen, Heart } from "lucide-react";

const FeaturesDetailed = () => {
	const features = [
		{
			title: "Alzheimer Score",
			subtitle: "Proprietary AI-Driven Assessment",
			description:
				"Our proprietary system tracks cognitive and behavioral status over time, providing clear insights into progression for families and clinicians through data collected from the patient's daily games.",
			image: "/alzheimer-score.png",
			icon: BarChart3,
			color: "blue",
			reverse: false,
		},
		{
			title: "Cognitive Games",
			subtitle: "Scientifically Validated Exercises",
			description:
				"Fun and scientifically validated games that connect long-term memory with short-term memory. The patient receives a link from the caregiver and starts playing daily, making therapy engaging.",
			image: "/cognitive-games.png",
			icon: Brain,
			color: "green",
			reverse: true,
		},
		{
			title: "Caregiver Support",
			subtitle: "Comprehensive Care Coordination",
			description:
				"Comprehensive tools for caregivers who send the link to the patient and monitor progress, with communication features and educational resources for better care coordination.",
			image: "/caregiver-support.png",
			icon: Users,
			color: "blue",
			reverse: false,
		},
		{
			title: "AI-Enhanced MRI Analysis",
			subtitle: "Advanced Medical Imaging",
			description:
				"Caregivers can upload MRI scans to receive personalized AI-guided feedback, enriching clinical assessments with continuous real-world data collected through games.",
			image: "/mri-analysis.png",
			icon: Stethoscope,
			color: "green",
			reverse: true,
		},
		{
			title: "Memory Journal",
			subtitle: "Personal Memory Preservation",
			description:
				"An integrated journal encourages patients to connect short-term experiences with long-term memories, reinforcing continuity in daily life after gaming sessions.",
			image: "/memory-journal.png",
			icon: BookOpen,
			color: "blue",
			reverse: false,
		},
		{
			title: "Wellness Education",
			subtitle: "Holistic Health Approach",
			description:
				"Comprehensive educational modules provided in an intuitive format to support patient learning and family understanding, integrated into the daily gaming journey.",
			image: "/wellness-education.png",
			icon: Heart,
			color: "green",
			reverse: true,
		},
	];

	const getColorClasses = (color: string) => {
		const colors = {
			blue: {
				bg: "bg-blue-50",
				icon: "text-blue-600",
				accent: "border-blue-200",
				button: "bg-blue-600 hover:bg-blue-700"
			},
			green: {
				bg: "bg-green-50",
				icon: "text-green-600",
				accent: "border-green-200",
				button: "bg-green-600 hover:bg-green-700"
			}
		};
		return colors[color as keyof typeof colors] || colors.blue;
	};

	return (
		<section className="py-24 bg-gradient-to-b from-white to-gray-50">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="text-center max-w-4xl mx-auto mb-20">
					<div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm mb-6 border border-blue-100">
						Platform Features
					</div>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
						Everything you need for comprehensive 
						<span className="text-blue-600"> cognitive care</span>
					</h2>
					<p className="text-xl text-gray-600 leading-relaxed">
						Our platform combines cutting-edge technology with clinical expertise to deliver personalized care solutions.
					</p>
				</div>

				{/* Features Grid */}
				{features.map((feature, index) => {
					const colorClasses = getColorClasses(feature.color);
					const IconComponent = feature.icon;
					
					return (
						<div key={index} className="mb-32 last:mb-0">
							<div className="max-w-7xl mx-auto">
								<div className={`grid lg:grid-cols-2 gap-16 items-center ${
									feature.reverse ? "lg:grid-flow-col-dense" : ""
								}`}>
									{/* Content */}
									<div className={`space-y-8 ${
										feature.reverse ? "lg:col-start-2" : ""
									}`}>
										{/* Icon Badge */}
										<div className={`inline-flex items-center gap-3 ${colorClasses.bg} px-4 py-3 rounded-2xl border ${colorClasses.accent}`}>
											<IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
											<span className={`font-semibold text-sm ${colorClasses.icon}`}>
												{feature.subtitle}
											</span>
										</div>

										{/* Title and Description */}
										<div className="space-y-4">
											<h3 className="text-3xl md:text-4xl font-bold text-gray-900">
												{feature.title}
											</h3>
											<p className="text-lg text-gray-600 leading-relaxed">
												{feature.description}
											</p>
										</div>

										{/* Benefits List */}
										<div className="space-y-3">
											{[
												"Easy to use interface",
												"Real-time data insights", 
												"Clinical-grade assessments"
											].map((benefit, i) => (
												<div key={i} className="flex items-center gap-3">
													<div className={`w-2 h-2 rounded-full ${colorClasses.icon.replace('text-', 'bg-')}`}></div>
													<span className="text-gray-700 font-medium">{benefit}</span>
												</div>
											))}
										</div>

										{/* CTA Button */}
										<Link href="/register">
											<button className={`inline-flex items-center gap-2 px-6 py-3 ${colorClasses.button} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}>
												Learn More
												<IconComponent className="w-4 h-4" />
											</button>
										</Link>
									</div>

									{/* Image */}
									<div className={`relative ${feature.reverse ? "lg:col-start-1" : ""}`}>
										<div className="relative group">
											{/* Background decoration */}
											<div className={`absolute inset-0 ${colorClasses.bg} rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500`}></div>
											
											{/* Main image container */}
											<div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-gray-100">
												<Image
													src={feature.image}
													width={600}
													height={400}
													alt={`${feature.title} interface`}
													className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
													loading="lazy"
												/>
												
												{/* Overlay gradient */}
												<div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent group-hover:from-transparent transition-all duration-500"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default FeaturesDetailed;
