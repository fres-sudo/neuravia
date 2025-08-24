import { Info, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const InformationsCard = () => {
	const [isOpen, setIsOpen] = useState(true);

	const toggleAccordion = () => {
		setIsOpen(!isOpen);
	};

	return (
		<Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm py-0 pb-6">
			<CardHeader
				className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100/50 rounded-t-lg pt-6 cursor-pointer relative"
				onClick={toggleAccordion}>
				<CardTitle className="text-2xl text-slate-800 flex items-center gap-3 pr-12">
					<div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
						<Info className="w-5 h-5 text-slate-700" />
					</div>
					Information
				</CardTitle>
				<CardDescription>
					This section provides information about the various games available in
					the application.
				</CardDescription>

				{/* Arrow button in top right corner */}
				<button
					className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
					onClick={(e) => {
						e.stopPropagation();
						toggleAccordion();
					}}>
					<ChevronDown
						className={`w-5 h-5 text-slate-700 transition-transform duration-300 ${
							isOpen ? "rotate-180" : "rotate-0"
						}`}
					/>
				</button>
			</CardHeader>

			{/* Animated collapsible content */}
			<div
				className={`transition-all duration-300 ease-in-out overflow-hidden ${
					isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
				}`}>
				<CardContent className="p-8">
					<section className="mb-8">
						<h3 className="text-xl font-semibold mb-4">
							Scene Crasher (delayed-recognition span)
						</h3>

						<div className="mb-4">
							<span className="font-bold">Description</span> - The Scene Crasher
							game is designed to strengthen working memory for visual scenes,
							focusing on the ability to retain and update spatial information
							under interruption. Participants are presented with a visual
							configuration of items that briefly appears and then reappears
							with one additional element. The task is to detect the change by
							comparing the two scenes. To ensure reliance on memory rather than
							residual visual impressions, a brief masking screen is inserted
							between presentations. Task difficulty adapts by manipulating
							visual salience, exposure time, spatial extent, item type, and the
							number of elements to track. This paradigm trains
							delayed-recognition span and supports real-world abilities such as
							resuming a visual search after distraction or detecting salient
							changes in dynamic environments.
						</div>

						<div className="mb-4">
							<span className="font-bold">Scientific validation</span> - The
							game was conceived by Dr. Henry Mahncke, CEO of Posit Science; PhD
							in Neuroscience (UC San Francisco). As a neuroscientist and
							technologist informed by brain plasticity research, Dr. Mahncke
							developed this exercise to enhance visual processing and
							facilitate the rapid identification of new, salient information.
						</div>

						<div className="mb-4">
							<span className="font-bold">Personalization</span> - The items
							presented within the task are emoji personalized according to the
							user's initial profiling, situating the individual in a familiar
							and memory-laden context. This design aims to provide a
							comfortable and engaging environment while simultaneously
							stimulating short-term memory processes through interactive and
							appealing exercises.
						</div>
					</section>

					<section className="mb-8">
						<h3 className="text-xl font-semibold mb-4">
							Hawk Eye (visual search & tracking)
						</h3>

						<div className="mb-4">
							<span className="font-bold">Description</span> - The Hawk Eye game
							is designed to train visual precision, i.e., the ability to
							rapidly detect and discriminate subtle visual details under time
							constraints. Participants are briefly exposed to pairs of stimuli
							in the peripheral field and are required to identify targets among
							distractors. Task difficulty adapts dynamically by manipulating
							time available to take decision on the correct option and the
							complexity of the configuration. This paradigm operationalizes
							real-world demands such as recognizing individuals in crowded
							settings or recalling object features in complex environments, and
							is embedded within the application as a core exercise for
							enhancing visuospatial discrimination.
						</div>

						<div className="mb-4">
							<span className="font-bold">Scientific validation</span> - The
							game has been conceived by Dr. Peter Delahunt, Director of R&D at
							Posit Science; PhD in Cognition & Perception (UC Santa Barbara).
							His expertise lies in visual neuroscience and cognitive training,
							focusing on perceptual learning and the design of adaptive
							brain-training paradigms.
						</div>

						<div className="mb-4">
							<span className="font-bold">Personalisation</span> - Task stimuli
							are personalized from the user's profile to evoke familiarity,
							creating a comfortable context while actively engaging short-term
							memory.
						</div>
					</section>

					<section className="mb-8">
						<h3 className="text-xl font-semibold mb-4">
							To-Do List (working memory span)
						</h3>

						<div className="mb-4">
							<span className="font-bold">Description</span> - The To-Do List
							game directly targets working memory, i.e., the capacity to
							temporarily hold and manipulate information over short intervals.
							In this task, participants learn a sequence of instructions and
							must retain them long enough to execute each step in the correct
							order. As performance improves, the length and complexity of the
							instruction sets increase, placing progressively greater demands
							on working memory systems in the forebrain that integrate sensory
							inputs with prior knowledge. This paradigm trains the short-term
							retention and sequencing of auditory-verbal information,
							supporting everyday functions such as remembering grocery lists or
							multi-step directives.
						</div>

						<div className="mb-4">
							<span className="font-bold">Scientific validation</span> - The
							game was developed by Dr. Xiaoqin Wang (Director, Laboratory of
							Auditory Neurophysiology, Johns Hopkins University; PhD in
							Biomedical Engineering, Johns Hopkins University) and Dr.
							Srikantan Nagarajan (Professor in Residence, UCSF School of
							Medicine; PhD in Biomedical Engineering, Case Western Reserve
							University). Both are recognized experts in auditory neuroscience
							and speech processing, and designed this exercise to strengthen
							working memory and improve accurate reception of rapid spoken
							language.
						</div>

						<div className="mb-4">
							<span className="font-bold">Personalization</span> - Task content
							is customized according to the user's initial profile, ensuring
							stimuli are embedded in a familiar context. This approach creates
							a supportive environment while simultaneously challenging
							short-term memory through engaging and interactive tasks.
						</div>
					</section>

					<section className="mb-8">
						<h3 className="text-xl font-semibold mb-4">
							Flashing Memory (sequential visuospatial recall)
						</h3>

						<div className="mb-4">
							<span className="font-bold">Description</span> - The Flashing
							Memory game is designed to train short-term visuospatial memory
							and sequential recall. In this task, a series of numbers briefly
							appears within a grid before disappearing. Participants must
							subsequently reconstruct the sequence by selecting the grid cells
							in ascending numerical order. Difficulty adapts by modulating the
							length of the sequence, the size of the grid, and the exposure
							time. This paradigm challenges the capacity to encode, maintain,
							and retrieve ordered information under temporal constraints,
							reinforcing cognitive functions relevant to everyday scenarios
							such as recalling phone numbers, stepwise instructions, or spatial
							routes.
						</div>

						<div className="mb-4">
							<span className="font-bold">Scientific validation</span> - The
							paradigm builds on a long tradition of experimental research on
							working memory, tracing back to delayed-response and
							delayed-recognition tasks in non-human primates. These tasks
							demonstrated the critical role of the prefrontal cortex in
							maintaining sequential information across short delays. Subsequent
							neuropsychological adaptations, including digit span and
							visuospatial span tests, established their validity for assessing
							working memory capacity in humans. Flashing Memory integrates
							these principles into an adaptive and interactive format, making
							use of controlled exposure, masking, and ordered recall to probe
							and strengthen sequential visuospatial processing.
						</div>

						<div className="mb-4">
							<span className="font-bold">Personalization</span> - Stimuli are
							adapted to the user's skills according to the BOOST score.
						</div>
					</section>

					<div className="border-t pt-6 space-y-4 text-sm leading-relaxed">
						<p>
							Games are implemented with severity-specific parameters;
							differences consist of (i) the time available to complete each
							trial/session and (ii) the number of items per trial. More
							detailed parameterisations will be provided in a later section.
						</p>

						<p>
							Games are not standalone; they follow one another seamlessly
							within a single session, separated only by the instruction
							screens. A session always includes all four games; outcome weights
							are homogeneous across games. A persistent "Help" affordance
							allows re-viewing the tutorial if needed. Scenes and objects are
							personalised to the user's profession/life context by an AI
							assistant during profiling. <em>Example:</em> profession =
							teacher; <em>Scene Crasher</em> uses a blackboard background
							instead of parquet flooring; items are chalks instead of keys. At
							any moment, the user can end the session and return to the Welcome
							screen via a bottom-right red button with a white cross.
						</p>
					</div>
				</CardContent>
			</div>
		</Card>
	);
};
