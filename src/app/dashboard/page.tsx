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
} from "lucide-react";
import { useRouter } from "next/navigation";
import AddPatientDialog from "../../components/add-patient-dialog";
import DeletePatientDialog from "../../components/delete-patient-dialog";
import { ModeToggle } from "@/components/mode-toggle";
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
		<div className="min-h-screen bg-background">
			<header className="border-b">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<div className="flex items-center gap-2">
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
							variant="outline">
							Logout
						</Button>
						<ModeToggle />
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto space-y-8">
					{/* User Info Card */}
					<Card>
						<CardHeader>
							<CardTitle>
								Welcome back, {session?.user.name || session?.user?.email}!
							</CardTitle>
							<CardDescription>
								Manage your family profiles and track your assistance journey
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<h3 className="font-semibold text-sm text-muted-foreground">
										Email
									</h3>
									<p className="text-lg">{session?.user?.email}</p>
								</div>
								<div>
									<h3 className="font-semibold text-sm text-muted-foreground">
										Member Since
									</h3>
									<p className="text-lg">
										{session?.user?.createdAt
											? formatDate(session?.user?.createdAt, "yyyy-MM-dd")
											: "N/A"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Patients Section */}
					<Card>
						<CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4 pb-6">
							<div className="flex flex-col">
								<CardTitle>Your Patients</CardTitle>
								<CardDescription>
									Manage profiles and track development for each patient
								</CardDescription>
							</div>
							<AddPatientDialog />
						</CardHeader>
						<CardContent>
							{query.isLoading ? (
								<div className="flex items-center justify-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
								</div>
							) : query.data?.length === 0 ? (
								<div className="text-center py-8">
									<div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
										<User className="h-6 w-6 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										No patients added yet
									</h3>
									<p className="text-muted-foreground mb-4">
										Start by adding your first patient to begin tracking their
										development
									</p>
									<AddPatientDialog />
								</div>
							) : query.data ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{query.data.map((patient) => (
										<Card
											key={patient.id}
											className="relative group hover:shadow-md transition-shadow">
											<CardContent className="p-6">
												<Button
													size="icon"
													variant="outline"
													className="absolute top-4 right-4"
													onClick={() =>
														router.push(`/patient/${patient.id}/upload`)
													}>
													<Images className="h-4 w-4" />
												</Button>
												<DeletePatientDialog patientId={patient.id} patientName={patient.name} />
												<div className="flex items-center space-x-4 mb-4">
													<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
														<User className="h-6 w-6 text-primary" />
													</div>
													<div>
														<h3 className="font-semibold text-lg">
															{patient.name}
														</h3>
														<p className="text-sm text-muted-foreground">
															{patient.age} year{patient.age !== 1 ? "s" : ""}{" "}
															old
														</p>
													</div>
												</div>

												<div className="flex space-x-2">
													<Link
														href={`http${
															process.env.NODE_ENV === "development"
																? "://localhost:3000"
																: `s://${process.env.VERCEL_URL}`
														}/room/${session?.user.id}/${patient.id}`}>
														<Button
															size="sm"
															variant="default"
															className="flex-1"
															onClick={() => handleCopyLink(patient.id)}>
															<Copy className="h-4 w-4 mr-1" />
															Room Link
														</Button>
													</Link>
													<Link href={`/patient/${patient.id}/settings`}>
														<Button
															size="sm"
															variant="outline">
															<Settings className="h-4 w-4" />
														</Button>
													</Link>
													{(() => {
														const alreadyDone = hasCurrentWeekDiary(
															patient.diaries
														);

														return (
															<Link href={`/patient/${patient.id}/diary`}>
																<Button
																	size="sm"
																	disabled={alreadyDone}
																	className={`flex-1 ${
																		alreadyDone
																			? "bg-green-500 hover:bg-green-600 text-white"
																			: "bg-orange-500 hover:bg-orange-600 text-white"
																	}`}>
																	<Notebook className="h-4 w-4 mr-1" />
																	{alreadyDone ? "Diary done" : "Fill diary"}
																</Button>
															</Link>
														);
													})()}
													<Link href={`/patient/${patient.id}/statistics`}>
														<Button
															size="sm"
															variant="outline">
															<BarChart3 className="h-4 w-4" />
														</Button>
													</Link>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								<div>Error, try again later</div>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
