"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stepper } from "@/components/ui/stepper";
import { Brain, User, Pen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPatientSchema } from "@/server/db/zod";
import { generateEmojisFromJob } from "@/lib/generateEmojis";
import {
	Dialog,
	DialogFooter,
	DialogHeader,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { api } from "@/trpc/react";
import {BoostScoreService} from "@/scoring/service";

type Step = 1 | 2 | 3;

type CreatePatientForm = z.infer<typeof createPatientSchema>;

const JOB_OPTIONS = [
	{ value: "engineer", label: "Engineer" },
	{ value: "teacher", label: "Teacher" },
	{ value: "doctor", label: "Doctor" },
	{ value: "artist", label: "Artist" },
	{ value: "lawyer", label: "Lawyer" },
	{ value: "other", label: "Other" },
] as const;

const PASSION_OPTIONS = [
	{ value: "soccer", label: "Soccer" },
	{ value: "mountain", label: "Mountain" },
	{ value: "gardening", label: "Gardening" },
	{ value: "music", label: "Music" },
	{ value: "other", label: "Other" },
] as const;

const boostService = new BoostScoreService();

const AddPatientDialog = () => {
	const [step, setStep] = useState<Step>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [open, setOpen] = useState(false);

	const router = useRouter();

	const createPatientMutation = api.patients.create.useMutation();
	const insertScoreMutation = api.scoring.insert.useMutation();
	const utils = api.useUtils();

	const form = useForm<CreatePatientForm>({
		resolver: zodResolver(createPatientSchema),
		defaultValues: {
			name: "",
			age: undefined,
			gender: undefined,
			educationLevel: "",
			job: undefined,
			initialInfo: {
				diagnosis: undefined,
				stage: undefined,
				otherConditions: [],
				medications: [],
				cognitiveAndFunctional: {
					memoryShortTerm: undefined,
					orientation: undefined,
					language: undefined,
					dailyActivities: undefined,
					moodBehavior: undefined,
				},
				biggestPassion: undefined,
				notes: "",
			},
			emojis: "",
		},
		mode: "onChange",
	});

	const {
		control,
		handleSubmit,
		trigger,
		watch,
		formState: { errors },
	} = form;

	const watchedJob = watch("job");
	const watchedBiggestPassion = watch("initialInfo.biggestPassion");

	// Step-specific validation
	const validateStep = async (stepNumber: Step): Promise<boolean> => {
		let fieldsToValidate: (keyof CreatePatientForm)[] = [];

		switch (stepNumber) {
			case 1:
				fieldsToValidate = ["name", "age"];
				break;
			case 2:
				// No required fields in step 2 based on schema
				return true;
			case 3:
				// Validate cognitive fields and passion if they exist
				const result = await trigger([
					"initialInfo.cognitiveAndFunctional.memoryShortTerm",
					"initialInfo.cognitiveAndFunctional.orientation",
					"initialInfo.cognitiveAndFunctional.language",
					"initialInfo.cognitiveAndFunctional.dailyActivities",
					"initialInfo.cognitiveAndFunctional.moodBehavior",
				]);
				return result;
		}

		const result = await trigger(fieldsToValidate);
		return result;
	};

	const next = async (): Promise<boolean> => {
		const isValid = await validateStep(step);
		if (isValid && step < 3) {
			setStep((s) => (s + 1) as Step);
		}
		return isValid;
	};

	const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

	const onSubmit = async (data: CreatePatientForm) => {
		setIsSubmitting(true);
		try {
			// Transform the data to match API expectations
			const transformedData = {
				...data,
				// Convert comma-separated strings to arrays if they exist
				initialInfo: data.initialInfo
					? {
							...data.initialInfo,
							otherConditions: data.initialInfo.otherConditions || [],
							medications: data.initialInfo.medications || [],
					  }
					: undefined,
			};

			// Generate emojis based on job
			let emojis: string[] = [];
			if (transformedData.job) {
			  try {
				  // pass type if not "other", else pass customLabel
				if (transformedData.job.type !== "other") {
					emojis = await generateEmojisFromJob(transformedData.job.type);
				} else {
					emojis = await generateEmojisFromJob(transformedData.job.customLabel || "");
				}
			  } catch (e) {
				console.error("Emoji generation failed:", e);
				emojis = []; // fallback se fallisce
			  }
			}

			// Calculate initial score
			const activityValue = await boostService.calculateInitialAssessment(transformedData.initialInfo);
			
			const payload = {
			  ...transformedData,
			  emojis: JSON.stringify(emojis),
			};

			// Create the patient first
			const createdPatient = await createPatientMutation.mutateAsync(payload);
			
			// Prepare and insert the initial score
			const scoreData = boostService.prepareScoreData({
				patientId: createdPatient.id,
				activityType: 'initial_assessment',
				activityValue: activityValue,
				previousScore: 0,
				metadata: {
					assessmentData: transformedData.initialInfo,
				},
			});

			await insertScoreMutation.mutateAsync(scoreData);

			await utils.patients.fetch.invalidate();
			setOpen(false);
			toast.success(`✅ Patient Successfully Added!\n\n${transformedData.name} has been added to your dashboard. Share the room link with family members so they can join and start playing.`, {
				duration: 5000,
				style: {
					fontSize: '16px',
					padding: '20px',
					minWidth: '400px',
					maxWidth: '500px'
				}
			});
			router.push("/dashboard");
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFormSubmit = async () => {
		const isStepValid = await validateStep(step);
		if (isStepValid && step === 3) {
			handleSubmit(onSubmit)();
		}
	};

	// Helper function to parse comma-separated strings
	const parseCommaSeparated = (value: string): string[] => {
		return value
			.split(",")
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="h-4 w-4" />
					Add Patient
				</Button>
			</DialogTrigger>

			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent className="max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Step {step}</DialogTitle>
						<DialogDescription>
							Add patient profile information
						</DialogDescription>
					</DialogHeader>
					<Stepper
						currentStep={step}
						steps={[
							{ label: "Basic Info", icon: <User className="w-5 h-5" /> },
							{
								label: "Clinical Info",
								icon: <Brain className="w-5 h-5" />,
							},
							{
								label: "Assessment Scores",
								icon: <Pen className="w-5 h-5" />,
							},
						]}
					/>
					<div className="space-y-6 max-h-[60vh] overflow-y-auto px-1">
						{step === 1 && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label>Name *</Label>
									<Controller
										name="name"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												placeholder="Enter patient name"
											/>
										)}
									/>
									{errors.name && (
										<p className="text-sm text-red-600">
											{errors.name.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label>Age *</Label>
									<Controller
										name="age"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												type="number"
												placeholder="Enter age"
												value={field.value || ''}
												onChange={(e) => {
													const value = e.target.value;
													field.onChange(value === '' ? undefined : Number(value));
												}}
											/>
										)}
									/>
									{errors.age && (
										<p className="text-sm text-red-600">{errors.age.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label>Gender</Label>
									<Controller
										name="gender"
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a gender" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="male">Male</SelectItem>
													<SelectItem value="female">Female</SelectItem>
													<SelectItem value="other">Other</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								<div className="space-y-2">
									<Label>Education Level</Label>
									<Controller
										name="educationLevel"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												placeholder="e.g. elementary school, high school"
											/>
										)}
									/>
								</div>

								<div className="space-y-2">
									<Label>Job</Label>
									<Controller
										name="job.type"
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a gender" />
												</SelectTrigger>
												<SelectContent>
													{JOB_OPTIONS.map((option) => (
														<SelectItem
															key={option.value}
															value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
									{watchedJob?.type === "other" && (
										<Controller
											name="job.customLabel"
											control={control}
											render={({ field }) => (
												<Input
													{...field}
													placeholder="Enter job manually (max 3 words)"
												/>
											)}
										/>
									)}
								</div>
							</div>
						)}

						{step === 2 && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label>Diagnosis</Label>
									<Controller
										name="initialInfo.diagnosis"
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a gender" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="none">None</SelectItem>
													<SelectItem value="suspected">Suspected</SelectItem>
													<SelectItem value="confirmed">Confirmed</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								<div className="space-y-2">
									<Label>Stage</Label>
									<Controller
										name="initialInfo.stage"
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a gender" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="mild">Mild</SelectItem>
													<SelectItem value="moderate">Moderate</SelectItem>
													<SelectItem value="severe">Severe</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								<div className="space-y-2">
									<Label>Other Conditions (comma separated)</Label>
									<Controller
										name="initialInfo.otherConditions"
										control={control}
										render={({ field }) => (
											<Input
												value={field.value ? field.value.join(", ") : ""}
												onChange={(e) =>
													field.onChange(parseCommaSeparated(e.target.value))
												}
												placeholder="e.g. diabetes, hypertension"
											/>
										)}
									/>
								</div>

								<div className="space-y-2">
									<Label>Medications (comma separated)</Label>
									<Controller
										name="initialInfo.medications"
										control={control}
										render={({ field }) => (
											<Input
												value={field.value ? field.value.join(", ") : ""}
												onChange={(e) =>
													field.onChange(parseCommaSeparated(e.target.value))
												}
												placeholder="e.g. donepezil, memantine"
											/>
										)}
									/>
								</div>
							</div>
						)}

						{step === 3 && (
							<div className="space-y-4">
								{/* Instructions for scoring */}
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
									<h4 className="font-semibold text-blue-900 mb-2">Assessment Scoring Guide</h4>
									<p className="text-sm text-blue-800 mb-2">
										Please rate each cognitive area using the following scale:
									</p>
									<div className="text-xs text-blue-700 space-y-1">
										<div><strong>5:</strong> Excellent - No difficulties, performs independently</div>
										<div><strong>4:</strong> Good - Minor difficulties, mostly independent</div>
										<div><strong>3:</strong> Average - Moderate difficulties, needs some assistance</div>
										<div><strong>2:</strong> Poor - Significant difficulties, needs frequent help</div>
										<div><strong>1:</strong> Very Poor - Severe difficulties, needs constant assistance</div>
									</div>
								</div>

								<div className="space-y-2">
									<Label>Memory Short-Term (1-5)</Label>
									<Controller
										name="initialInfo.cognitiveAndFunctional.memoryShortTerm"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												type="number"
												min={1}
												max={5}
												value={field.value || ''}
												onChange={(e) => {
													const value = e.target.value;
													field.onChange(value === '' ? undefined : Number(value));
												}}
											/>
										)}
									/>
									{errors.initialInfo?.cognitiveAndFunctional
										?.memoryShortTerm && (
										<p className="text-sm text-red-600">
											{
												errors.initialInfo.cognitiveAndFunctional
													.memoryShortTerm.message
											}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label>Orientation (1-5)</Label>
									<Controller
										name="initialInfo.cognitiveAndFunctional.orientation"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												type="number"
												min={1}
												max={5}
												value={field.value || ''}
												onChange={(e) => {
													const value = e.target.value;
													field.onChange(value === '' ? undefined : Number(value));
												}}
											/>
										)}
									/>
									{errors.initialInfo?.cognitiveAndFunctional?.orientation && (
										<p className="text-sm text-red-600">
											{
												errors.initialInfo.cognitiveAndFunctional.orientation
													.message
											}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label>Language (1-5)</Label>
									<Controller
										name="initialInfo.cognitiveAndFunctional.language"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												type="number"
												min={1}
												max={5}
												value={field.value || ''}
												onChange={(e) => {
													const value = e.target.value;
													field.onChange(value === '' ? undefined : Number(value));
												}}
											/>
										)}
									/>
									{errors.initialInfo?.cognitiveAndFunctional?.language && (
										<p className="text-sm text-red-600">
											{
												errors.initialInfo.cognitiveAndFunctional.language
													.message
											}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label>Daily Activities (1-5)</Label>
									<Controller
										name="initialInfo.cognitiveAndFunctional.dailyActivities"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												type="number"
												min={1}
												max={5}
												value={field.value || ''}
												onChange={(e) => {
													const value = e.target.value;
													field.onChange(value === '' ? undefined : Number(value));
												}}
											/>
										)}
									/>
									{errors.initialInfo?.cognitiveAndFunctional
										?.dailyActivities && (
										<p className="text-sm text-red-600">
											{
												errors.initialInfo.cognitiveAndFunctional
													.dailyActivities.message
											}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label>Mood & Behavior (1-5)</Label>
									<Controller
										name="initialInfo.cognitiveAndFunctional.moodBehavior"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												type="number"
												min={1}
												max={5}
												value={field.value || ''}
												onChange={(e) => {
													const value = e.target.value;
													field.onChange(value === '' ? undefined : Number(value));
												}}
											/>
										)}
									/>
									{errors.initialInfo?.cognitiveAndFunctional?.moodBehavior && (
										<p className="text-sm text-red-600">
											{
												errors.initialInfo.cognitiveAndFunctional.moodBehavior
													.message
											}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label>Biggest Passion</Label>
									<Controller
										name="initialInfo.biggestPassion.type"
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a gender" />
												</SelectTrigger>
												<SelectContent>
													{PASSION_OPTIONS.map((option) => (
														<SelectItem
															key={option.value}
															value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
									{watchedBiggestPassion?.type === "other" && (
										<Controller
											name="initialInfo.biggestPassion.customLabel"
											control={control}
											render={({ field }) => (
												<Input
													{...field}
													placeholder="Enter custom passion (max 3 words)"
												/>
											)}
										/>
									)}
								</div>

								<div className="space-y-2">
									<Label>Notes</Label>
									<Controller
										name="initialInfo.notes"
										control={control}
										render={({ field }) => (
											<Textarea
												{...field}
												placeholder="Describe its behaviour in terms of Alzheimer"
												rows={3}
											/>
										)}
									/>
								</div>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={step === 1}
							onClick={back}>
							Back
						</Button>
						{step < 3 ? (
							<Button
								type="button"
								onClick={next}>
								Next
							</Button>
						) : (
							<Button
								type="button"
								onClick={handleFormSubmit}
								disabled={isSubmitting}>
								{isSubmitting ? "Submitting..." : "Submit"}
							</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};

export default AddPatientDialog;
