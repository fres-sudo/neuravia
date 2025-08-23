"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BookOpen, AlertTriangle } from "lucide-react";

type DiaryResponses = {
	memory: number;
	orientation: number;
	communication: number;
	dailyActivities: number;
	moodBehavior: number;
	sleep: number;
	social: number;
	notes?: string;
};

export default function Page() {
	const router = useRouter();
	const { id: patientId } = useParams<{ id: string }>();

	const [responses, setResponses] = useState<DiaryResponses>({
		memory: 3,
		orientation: 3,
		communication: 3,
		dailyActivities: 3,
		moodBehavior: 3,
		sleep: 3,
		social: 3,
		notes: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const diaryMutation = api.diary.createDiary.useMutation({
		onSuccess: () => router.push("/dashboard"),
		onError: (err) => setError(err.message),
	});

	const handleChange = useCallback(
		(field: keyof DiaryResponses, value: string | number) => {
			setResponses((prev) => ({
				...prev,
				[field]: typeof value === "string" ? value : Number(value),
			}));
		},
		[]
	);

	const today = new Date();
	const weekStart = new Date(today);
	weekStart.setDate(today.getDate() - today.getDay() + 1);
	const weekStartStr = weekStart.toISOString().split("T")[0];

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!patientId) return;

			setIsSubmitting(true);
			setError(null);

			try {
				await diaryMutation.mutateAsync({
					patientId,
					weekStart: weekStartStr!,
					responses,
				});
			} catch (err) {
				console.error(err);
				setError("Failed to submit diary. Please try again.");
			} finally {
				setIsSubmitting(false);
			}
		},
		[patientId, responses, weekStartStr, diaryMutation]
	);

	const fields: { key: keyof DiaryResponses; label: string }[] = [
		{ key: "memory", label: "Memory" },
		{ key: "orientation", label: "Orientation" },
		{ key: "communication", label: "Communication" },
		{ key: "dailyActivities", label: "Daily Activities" },
		{ key: "moodBehavior", label: "Mood & Behavior" },
		{ key: "sleep", label: "Sleep Quality" },
		{ key: "social", label: "Social Interaction" },
	];

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b">
				<div className="container mx-auto px-4 py-4 flex items-center gap-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push("/dashboard")}>
						<ArrowLeft className="h-4 w-4" /> Back
					</Button>
					<h1 className="text-2xl font-bold">Weekly Patient Diary</h1>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					<Card>
						<CardHeader>
							<div className="flex flex-col gap-2">
								<CardTitle>Complete weekly patient assessment</CardTitle>
								<div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
									<AlertTriangle className="w-5 h-5" />
									<span className="text-sm font-medium">
										Be careful: once submitted and processed, you won’t be able
										to update this diary for a while.
									</span>
								</div>
								<div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
									<BookOpen className="w-4 h-4" />
									Week starting:{" "}
									<span className="font-medium">{weekStartStr}</span>
								</div>
							</div>
						</CardHeader>

						<CardContent className="space-y-6">
							<form
								onSubmit={handleSubmit}
								className="space-y-6">
								{fields.map((field) => (
									<div
										key={field.key}
										className="space-y-4">
										<Label>{field.label}</Label>
										<input
											type="range"
											min={1}
											max={5}
											value={responses[field.key]}
											onChange={(e) =>
												handleChange(field.key, Number(e.target.value))
											}
											className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
										/>
										<div className="flex justify-between text-sm text-muted-foreground">
											<span>1 (Very Poor)</span>
											<span className="font-medium">
												Current: {responses[field.key]}
											</span>
											<span>5 (Excellent)</span>
										</div>
									</div>
								))}

								<div className="space-y-4">
									<Label htmlFor="notes">Additional Notes</Label>
									<Textarea
										id="notes"
										value={responses.notes}
										onChange={(e) => handleChange("notes", e.target.value)}
										rows={4}
										placeholder="Write any observations or important details..."
									/>
								</div>

								{error && <p className="text-sm text-red-600">{error}</p>}

								<div className="flex justify-between">
									<Button
										variant="outline"
										type="button"
										onClick={() => router.push("/dashboard")}>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={isSubmitting}>
										{isSubmitting ? "Saving..." : "Save Diary"}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
