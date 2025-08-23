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
import { Plus, User, Settings, Notebook, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Page() {
	const query = api.patitents.getPatients.useQuery();

	const { data: session } = useSession();
	const router = useRouter();

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
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
							<div>
								<CardTitle>Your Patients</CardTitle>
								<CardDescription>
									Manage profiles and track development for each patient
								</CardDescription>
							</div>
							<Button
								onClick={() => router.push("/add-patient")}
								className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								Add Patient
							</Button>
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
									<Button onClick={() => router.push("/add-patient")}>
										<Plus className="h-4 w-4 mr-2" />
										Add Your First Patient
									</Button>
								</div>
							) : query.data ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{query.data.map((patient) => (
										<Card
											key={patient.id}
											className="relative group hover:shadow-md transition-shadow">
											<CardContent className="p-6">
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
													<Button
														size="sm"
														variant="default"
														className="flex-1"
														onClick={() =>
															router.push(`/patient/${patient.id}`)
														}>
														<User className="h-4 w-4 mr-1" />
														Enter
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															router.push(`/patient/${patient.id}/settings`)
														}>
														<Settings className="h-4 w-4" />
													</Button>
													{(() => {
														const alreadyDone = hasCurrentWeekDiary(
															patient.diaries
														);

														return (
															<Button
																size="sm"
																onClick={() =>
																	router.push(`/patient/${patient.id}/diary`)
																}
																disabled={alreadyDone}
																className={`flex-1 ${
																	alreadyDone
																		? "bg-green-500 hover:bg-green-600 text-white"
																		: "bg-orange-500 hover:bg-orange-600 text-white"
																}`}>
																<Notebook className="h-4 w-4 mr-1" />
																{alreadyDone ? "Diary done" : "Fill diary"}
															</Button>
														);
													})()}
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															router.push(`/patient/${patient.id}/statistics`)
														}>
														<BarChart3 className="h-4 w-4" />
													</Button>
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
