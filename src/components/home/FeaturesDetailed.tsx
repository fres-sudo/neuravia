import Image from "next/image";

const FeaturesDetailed = () => {
	const features = [
		{
			title: "Alzheimer Score",
			description:
				"Il nostro sistema proprietario traccia lo stato cognitivo e comportamentale nel tempo, fornendo insight chiari sulla progressione per famiglie e clinici attraverso dati raccolti dai giochi quotidiani del paziente.",
			image: "/alzheimer-score.png",
			reverse: false,
		},
		{
			title: "Giochi Cognitivi",
			description:
				"Giochi divertenti e scientificamente validati che connettono la memoria a lungo termine con quella a breve termine. Il paziente riceve un link dal caregiver e inizia a giocare quotidianamente, rendendo la terapia coinvolgente.",
			image: "/mri-analysis.png",
			reverse: true,
		},
		{
			title: "Supporto Caregiver",
			description:
				"Strumenti completi per i caregiver che inviano il link al paziente e monitorano i progressi, con funzionalità di comunicazione e risorse educative per un migliore coordinamento delle cure.",
			image: "/caregiver-support.png",
			reverse: false,
		},
		{
			title: "Analisi MRI Potenziata da AI",
			description:
				"I caregiver possono caricare scansioni MRI per ricevere feedback personalizzato guidato dall'AI, arricchendo le valutazioni cliniche con dati continui del mondo reale raccolti attraverso i giochi.",
			image: "/mri-analysis.png",
			reverse: true,
		},
		{
			title: "Diario della Memoria",
			description:
				"Un diario integrato incoraggia i pazienti a connettere le esperienze a breve termine con le memorie a lungo termine, rafforzando la continuità nella vita quotidiana dopo le sessioni di gioco.",
			image: "/memory-journal.png",
			reverse: false,
		},
		{
			title: "Educazione al Benessere",
			description:
				"Moduli educativi completi forniti in un formato intuitivo per supportare l'apprendimento del paziente e la comprensione della famiglia, integrati nel percorso di gioco quotidiano.",
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
