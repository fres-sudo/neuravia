import Image from "next/image";

const FeaturesDetailed = () => {
	const features = [
		{
			title: "Alzheimer Score",
			description:
				"Our proprietary system tracks cognitive and behavioral status over time, providing clear insights into progression for families and clinicians through data collected from the patient's daily games.",
			image: "/alzheimer-score.png",
			reverse: false,
		},
		{
			title: "Cognitive Games",
			description:
				"Fun and scientifically validated games that connect long-term memory with short-term memory. The patient receives a link from the caregiver and starts playing daily, making therapy engaging.",
			image: "/cognitive-games.png",
			reverse: true,
		},
		{
			title: "Caregiver Support",
			description:
				"Comprehensive tools for caregivers who send the link to the patient and monitor progress, with communication features and educational resources for better care coordination.",
			image: "/caregiver-support.png",
			reverse: false,
		},
		{
			title: "AI-Enhanced MRI Analysis",
			description:
				"Caregivers can upload MRI scans to receive personalized AI-guided feedback, enriching clinical assessments with continuous real-world data collected through games.",
			image: "/mri-analysis.png",
			reverse: true,
		},
		{
			title: "Memory Journal",
			description:
				"An integrated journal encourages patients to connect short-term experiences with long-term memories, reinforcing continuity in daily life after gaming sessions.",
			image: "/memory-journal.png",
			reverse: false,
		},
		{
			title: "Wellness Education",
			description:
				"Comprehensive educational modules provided in an intuitive format to support patient learning and family understanding, integrated into the daily gaming journey.",
			image: "/wellness-education.png",
			reverse: true,
		},
	];

	return (
		<section className="py-16">
			{features.map((feature, index) => (
				<div
					key={index}
					className="py-24">
					<div className="container mx-auto px-4">
						<div
							className={`grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto ${
								feature.reverse ? "lg:grid-flow-col-dense" : ""
							}`}>
							<div
								className={`space-y-6 ${
									feature.reverse ? "lg:col-start-2" : ""
								}`}>
								<h2 className="text-3xl md:text-4xl font-bold">
									{feature.title}
								</h2>
								<p className="text-lg text-muted-foreground leading-relaxed">
									{feature.description}
								</p>
							</div>
							<div className={`${feature.reverse ? "lg:col-start-1" : ""}`}>
								<div className="rounded-2xl overflow-hidden shadow-elegant">
									<Image
										src={feature.image}
										width={500}
										height={500}
										alt={`${feature.title} interface`}
										className="w-full h-auto object-cover"
										loading="lazy"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</section>
	);
};

export default FeaturesDetailed;
