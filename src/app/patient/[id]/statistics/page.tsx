"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Brain, 
  FileText, 
  Gamepad2, 
  Upload, 
  TrendingUp, 
  Calendar,
  Activity,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";

// Activity type icons mapping
const activityIcons = {
  initial_assessment: Brain,
  mri_upload: Upload,
  weekly_form: FileText,
  game_played: Gamepad2,
};

// Activity type labels
const activityLabels = {
  initial_assessment: "Initial Assessment",
  mri_upload: "MRI Upload",
  weekly_form: "Weekly Form",
  game_played: "Game Played",
};

// Activity type colors
const activityColors = {
  initial_assessment: "bg-blue-100 text-blue-800",
  mri_upload: "bg-purple-100 text-purple-800",
  weekly_form: "bg-green-100 text-green-800",
  game_played: "bg-orange-100 text-orange-800",
};

export default function StatisticsPage() {
  const router = useRouter();
  const { id: patientId } = useParams<{ id: string }>();

  // Fetch patient data
  const { data: patient, isLoading: patientLoading } = api.patients.fetch.useQuery();
  const currentPatient = patient?.find(p => p.id === patientId);

  // Fetch boost scores for this patient
  const { data: boostScores, isLoading: scoresLoading } = api.scoring.fetchByPatient.useQuery(
    { patientId: patientId!, limit: 20 },
    { enabled: !!patientId }
  );

  // Fetch score history for plotting
  const { data: scoreHistory } = api.scoring.getScoreHistory.useQuery(
    { patientId: patientId! },
    { enabled: !!patientId }
  );

  if (patientLoading || scoresLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!currentPatient) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Patient not found</h1>
          <p className="text-gray-600 mt-2">The patient you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalActivities = boostScores?.length || 0;
  const latestScore = boostScores?.[0]?.newScore || 0;
  const scoreChange = boostScores && boostScores.length > 1 && boostScores[0] && boostScores[1]
    ? boostScores[0].newScore - boostScores[1].newScore 
    : 0;

  // Prepare data for the score trend chart
  const chartData = scoreHistory?.map(score => ({
    date: new Date(score.timestamp || new Date()),
    score: score.newScore,
    activityType: score.activityType,
  })).reverse() || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Statistics for {currentPatient.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Track progress and activity history
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          Patient ID: {patientId}
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestScore.toFixed(1)}</div>
            <p className={`text-xs ${scoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {scoreChange >= 0 ? '+' : ''}{scoreChange.toFixed(1)} from last activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground">
              Activities recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {boostScores && boostScores.length > 0 && boostScores[boostScores.length - 1]?.timestamp
                ? format(new Date(boostScores[boostScores.length - 1]!.timestamp!), 'MMM dd')
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Initial assessment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {boostScores && boostScores.length > 0 && boostScores[0]?.timestamp
                ? format(new Date(boostScores[0].timestamp), 'MMM dd')
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {boostScores && boostScores.length > 0 && boostScores[0]?.activityType
                ? activityLabels[boostScores[0].activityType as keyof typeof activityLabels]
                : 'No activities'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Score Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Boost Score Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-1 p-4 bg-gray-50 rounded-lg">
              {chartData.map((point, index) => {
                const height = (point.score / 100) * 100; // Convert to percentage
                const IconComponent = activityIcons[point.activityType as keyof typeof activityIcons];
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${height}%` }}
                      title={`${point.score.toFixed(1)} - ${format(point.date, 'MMM dd')}`}
                    />
                    <div className="mt-2 text-xs text-gray-600">
                      {format(point.date, 'MM/dd')}
                    </div>
                    <IconComponent className="h-3 w-3 text-gray-400 mt-1" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No score data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {boostScores && boostScores.length > 0 ? (
            <div className="space-y-4">
              {boostScores.map((score, index) => {
                const IconComponent = activityIcons[score.activityType as keyof typeof activityIcons];
                const colorClass = activityColors[score.activityType as keyof typeof activityColors];
                
                return (
                  <div key={score.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {activityLabels[score.activityType as keyof typeof activityLabels]}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {score.timestamp ? format(new Date(score.timestamp), 'MMM dd, yyyy HH:mm') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {score.newScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Weight: {score.weight}
                      </div>
                      {score.previousScore !== null && (
                        <div className={`text-xs ${score.newScore >= score.previousScore ? 'text-green-600' : 'text-red-600'}`}>
                          {score.newScore >= score.previousScore ? '+' : ''}
                          {(score.newScore - score.previousScore).toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No activities recorded yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}