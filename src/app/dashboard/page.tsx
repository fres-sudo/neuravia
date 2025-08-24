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
import { User, Brain, Activity, Clock, Users, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import AddPatientDialog from "../../components/add-patient-dialog";
import PatientCard from "../../components/patient-card";
import { useState } from "react";
import { InformationsCard } from "@/components/informations-card";

export default function Page() {
	const query = api.patients.fetch.useQuery();

	const [showInfo, setShowInfo] = useState(false);

	const { data: session } = useSession();
	const router = useRouter();

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
						<Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm ">
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
					<Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm py-0 pb-6">
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
										<PatientCard
											key={patient.id}
											patient={patient}
										/>
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

					{/**Readme Section */}
					<InformationsCard />
				</div>
			</main>
		</div>
	);
}
