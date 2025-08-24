import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { signOut, useSession } from "@/server/auth/auth-client";
import DeletePatientDialog from "@/components/delete-patient-dialog";
import { hasCurrentWeekDiary } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	User,
	Settings,
	Notebook,
	Images,
	Copy,
	Brain,
	Activity,
	TrendingUp,
	Clock,
	Users,
} from "lucide-react";
import { api } from "@/trpc/react";
import {skipToken} from "@tanstack/query-core";
import {toast} from "sonner";

const PatientCard = ({ patient }) => {

    const { data: session } = useSession();
    const router = useRouter();
    const latestScoreQuery = api.scoring.getLatestScore.useQuery(
        patient.id ? { patientId: patient.id } : skipToken
      );

  const latestScore = latestScoreQuery.data?.newScore ?? null;
  const isLoading = latestScoreQuery.isLoading;

  const handleCopyLink = async (patientId: string) => {
		const url = `http${
			process.env.NODE_ENV === "development"
				? "://localhost:3000"
				: `s://neuravia-gamma.vercel.app`
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
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-md hover:scale-[1.02]">
      <CardContent className="p-6 relative">
        {/* Action buttons in top right */}
        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-white/80 hover:bg-blue-50 border-blue-200"
            onClick={() => router.push(`/patient/${patient.id}/upload`)}>
            <Images className="h-3.5 w-3.5 text-blue-600" />
          </Button>
          <DeletePatientDialog
            patientId={patient.id}
            patientName={patient.name}
          />
        </div>

        {/* Patient Info with BOOST Score */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-md">
              <User className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800">
                  {patient.name}
                </h3>
                {/* BOOST Score Badge */}
                <div className="flex items-center">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 rounded-full px-3 py-1 h-8 w-16"></div>
                  ) : latestScore !== null ? (
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full shadow-lg border-2 border-white">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-bold text-lg">
                          {latestScore.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs opacity-90 text-center -mt-1">
                        BOOST
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-2 rounded-full shadow-lg border-2 border-white">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3" />
                        <span className="font-semibold text-sm">N/A</span>
                      </div>
                      <div className="text-xs opacity-90 text-center -mt-1">
                        BOOST
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {patient.age} year{patient.age !== 1 ? "s" : ""} old
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
            const alreadyDone = hasCurrentWeekDiary(patient.diaries);
            return (
              <Link href={`/patient/${patient.id}/diary`}>
                <Button
                  size="sm"
                  className={`w-full shadow-sm ${
                    alreadyDone
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      : "bg-gradient-to-r from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white"
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
  );
};

export default PatientCard;