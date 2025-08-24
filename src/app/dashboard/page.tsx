"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { hasCurrentWeekDiary } from "@/lib/utils";
import { signOut, useSession } from "@/server/auth/auth-client";
import { api } from "@/trpc/react";
import { formatDate } from "date-fns";
import {
	User,
	Settings,
	Notebook,
	BarChart3,
	Images,
	Copy,
	Brain,
	Plus,
	Activity,
	TrendingUp,
	Clock,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AddPatientDialog from "../../components/add-patient-dialog";
import DeletePatientDialog from "../../components/delete-patient-dialog";
import Link from "next/link";
import { toast } from "sonner";

export default function Page() {
	const query = api.patients.fetch.useQuery();

	const { data: session } = useSession();
	const router = useRouter();

	const handleCopyLink = async (patientId: string) => {
		const url = `http${
			process.env.NODE_ENV === "development"
				? "://localhost"
				: `s://${process.env.VERCEL_URL}`
		}/room/${session?.user.id}/${patientId}`;

		try {
			await navigator.clipboard.writeText(url);
			// Optional: Add success feedback
			toast.success("Link copied to the clipboard");
			// You could also show a toast notification here
			// toast.success("Link copied to clipboard!");
		} catch (err) {
			toast.error("Failed to copy link");
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = url;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
			{/* Header with gradient background */}
			<header className="bg-gradient-to-r from-blue-400/80 to-green-400/80 text-white shadow-lg backdrop-blur-sm">
				<div className="container mx-auto px-4 py-6">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
								<Brain className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold">Boost Dashboard</h1>
								<p className="text-blue-100 text-sm">
									Welcome back, {session?.user.name}!
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Button
								onClick={() =>
									signOut({
										fetchOptions: {
											onSuccess: () => {
												router.replace("/");
											},
										},
									})
								}
								variant="outline"
								className="bg-white/10 border-white/20 text-white hover:bg-white/20">
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<div className="max-w-7xl mx-auto space-y-8">
					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm py-0 pb-6">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Total Patients
										</p>
										<p className="text-3xl font-bold text-slate-900">
											{query.data?.length || 0}
										</p>
									</div>
									<div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
										<Users className="w-6 h-6 text-slate-700" />
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Active Sessions
										</p>
										<p className="text-3xl font-bold text-slate-900">
											{query.data?.filter((p) => hasCurrentWeekDiary(p.diaries))
												.length || 0}
										</p>
									</div>
									<div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
										<Activity className="w-6 h-6 text-slate-700" />
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Member Since
										</p>
										<p className="text-lg font-semibold text-slate-700">
											{session?.user?.createdAt
												? formatDate(session?.user?.createdAt, "MMM yyyy")
												: "N/A"}
										</p>
									</div>
									<div className="w-12 h-12 bg-slate-500/10 rounded-full flex items-center justify-center">
										<Clock className="w-6 h-6 text-slate-500" />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Patients Section */}
					<Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
						<CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100/50 rounded-t-lg pt-6">
							<div className="flex justify-between items-center">
								<div>
									<CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
										<div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
											<Users className="w-5 h-5 text-slate-700" />
										</div>
										Your Patients
									</CardTitle>
									<CardDescription className="text-slate-600 mt-1">
										Manage profiles and track development progress for each
										patient
									</CardDescription>
								</div>
								<div className="flex items-center gap-2">
									<AddPatientDialog />
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-8">
							{query.isLoading ? (
								<div className="flex items-center justify-center py-12">
									<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
								</div>
							) : query.data?.length === 0 ? (
								<div className="text-center py-16">
									<div className="mx-auto w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
										<User className="h-10 w-10 text-slate-700" />
									</div>
									<h3 className="text-xl font-semibold mb-3 text-slate-800">
										No patients added yet
									</h3>
									<p className="text-muted-foreground mb-6 max-w-md mx-auto">
										Start by adding your first patient to begin tracking their
										development and progress
									</p>
									<AddPatientDialog />
								</div>
							) : query.data ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{query.data.map((patient) => (
										<Card
											key={patient.id}
											className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-md hover:scale-[1.02]">
											<CardContent className="p-6 relative">
												{/* Action buttons in top right */}
												<div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
													<Button
														size="icon"
														variant="outline"
														className="h-8 w-8 bg-white/80 hover:bg-blue-50 border-blue-200"
														onClick={() =>
															router.push(`/patient/${patient.id}/upload`)
														}>
														<Images className="h-3.5 w-3.5 text-blue-600" />
													</Button>
													<DeletePatientDialog
														patientId={patient.id}
														patientName={patient.name}
													/>
												</div>

												{/* Patient Info */}
												<div className="mb-6">
													<div className="flex items-center space-x-4 mb-4">
														<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-md">
															<User className="h-7 w-7 text-white" />
														</div>
														<div>
															<h3 className="font-bold text-lg text-slate-800">
																{patient.name}
															</h3>
															<p className="text-sm text-muted-foreground flex items-center gap-1">
																<Clock className="w-3 h-3" />
																{patient.age} year{patient.age !== 1 ? "s" : ""}{" "}
																old
															</p>
														</div>
													</div>
												</div>

												{/* Action Buttons */}
												<div className="grid grid-cols-2 gap-2 mb-3">
													<Button
														size="sm"
														className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm"
														onClick={() => handleCopyLink(patient.id)}>
														<Copy className="h-3.5 w-3.5 mr-1.5" />
														Room Link
													</Button>

													{(() => {
														const alreadyDone = hasCurrentWeekDiary(
															patient.diaries
														);

														return (
															<Link href={`/patient/${patient.id}/diary`}>
																<Button
																	size="sm"
																	className={`w-full shadow-sm ${
																		alreadyDone
																			? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
																			: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
																	}`}>
																	<Notebook className="h-3.5 w-3.5 mr-1.5" />
																	{alreadyDone ? "Diary Done" : "Fill Diary"}
																</Button>
															</Link>
														);
													})()}
												</div>

												<div className="grid grid-cols-2 gap-2">
													<Link href={`/patient/${patient.id}/settings`}>
														<Button
															size="sm"
															variant="outline"
															className="w-full border-slate-200 hover:bg-slate-50">
															<Settings className="h-3.5 w-3.5 mr-1.5" />
															Settings
														</Button>
													</Link>
													<Link href={`/patient/${patient.id}/statistics`}>
														<Button
															size="sm"
															variant="outline"
															className="w-full border-slate-200 hover:bg-slate-50">
															<TrendingUp className="h-3.5 w-3.5 mr-1.5" />
															Stats
														</Button>
													</Link>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<Activity className="w-8 h-8 text-red-500" />
									</div>
									<p className="text-muted-foreground">
										Error loading patients. Please try again later.
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
