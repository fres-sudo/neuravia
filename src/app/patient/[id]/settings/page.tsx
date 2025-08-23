"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Settings, Save } from "lucide-react";
import { toast } from "sonner"

type PatientSettings = {
  language: string;
  activityDifficultySensitivity: number;
  activityRandomness: number;
  maxDailyActivities: number;
  reminderTime: string;
  showHints: boolean;
};

const defaultSettings: PatientSettings = {
  language: "italiano",
  activityDifficultySensitivity: 3,
  activityRandomness: 50,
  maxDailyActivities: 5,
  reminderTime: "10:00",
  showHints: true,
};

export default function Page() {
  const router = useRouter();
  const { id: patientId } = useParams<{ id: string }>();

  const [settings, setSettings] = useState<PatientSettings>(defaultSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Query to get existing settings
  const settingsQuery = api.patientSettings.getSettings.useQuery(
    { patientId: String(patientId) },
    { 
      enabled: !!patientId,
    }
  );

  // Handle query errors
  useEffect(() => {
    if (settingsQuery.error) {
      setError(settingsQuery.error.message);
    }
  }, [settingsQuery.error]);

  // Mutation to create settings
  const createSettingsMutation = api.patientSettings.createSettings.useMutation({
    onSuccess: () => {
      settingsQuery.refetch();
    },
    onError: (err) => setError(err.message),
  });

  // Mutation to update settings
  const updateSettingsMutation = api.patientSettings.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Settings updated successfully");
      router.push("/dashboard");
      setError(null);
    },
    onError: (err) => {
      toast.error("Failed to update settings");
      setError(err.message)
    },
  });

  // Load settings when query succeeds
  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data.settings as PatientSettings);
    } else if (settingsQuery.data === null) {
      // No settings exist yet, keep default settings
      setSettings(defaultSettings);
    }
  }, [settingsQuery.data]);

  const handleChange = useCallback(
    (field: keyof PatientSettings, value: string | number | boolean) => {
      setSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!patientId) return;

      setIsSubmitting(true);
      setError(null);

      try {
        if (settingsQuery.data) {
          // Update existing settings
          await updateSettingsMutation.mutateAsync({
            patientId,
            settings,
          });
        } else {
          // Create new settings with current values
          await createSettingsMutation.mutateAsync({
            patientId,
            settings,
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to save settings. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [patientId, settings, settingsQuery.data, updateSettingsMutation, createSettingsMutation]
  );

  // Show loading state while query is in progress
  if (settingsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Patient Settings</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Patient Settings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <div>
                  <CardTitle>Patient Configuration</CardTitle>
                  <CardDescription>
                    Customize the patient's experience and activity settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Language Setting */}
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italiano">Italiano</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="español">Español</SelectItem>
                      <SelectItem value="français">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Activity Difficulty Sensitivity */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Activity Difficulty Sensitivity</Label>
                  <input
                    id="difficulty"
                    type="range"
                    min={1}
                    max={5}
                    value={settings.activityDifficultySensitivity}
                    onChange={(e) => handleChange("activityDifficultySensitivity", Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 (Low)</span>
                    <span className="font-medium">Current: {settings.activityDifficultySensitivity}</span>
                    <span>5 (High)</span>
                  </div>
                </div>

                {/* Activity Randomness */}
                <div className="space-y-2">
                  <Label htmlFor="randomness">Activity Randomness (%)</Label>
                  <input
                    id="randomness"
                    type="range"
                    min={0}
                    max={100}
                    value={settings.activityRandomness}
                    onChange={(e) => handleChange("activityRandomness", Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0% (Predictable)</span>
                    <span className="font-medium">Current: {settings.activityRandomness}%</span>
                    <span>100% (Random)</span>
                  </div>
                </div>

                {/* Max Daily Activities */}
                <div className="space-y-2">
                  <Label htmlFor="maxActivities">Maximum Daily Activities</Label>
                  <Input
                    id="maxActivities"
                    type="number"
                    min={1}
                    max={10}
                    value={settings.maxDailyActivities}
                    onChange={(e) => handleChange("maxDailyActivities", Number(e.target.value))}
                  />
                </div>

                {/* Reminder Time */}
                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Daily Reminder Time</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => handleChange("reminderTime", e.target.value)}
                  />
                </div>

                {/* Show Hints */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showHints">Show Activity Hints</Label>
                    <p className="text-sm text-muted-foreground">
                      Display helpful hints during activities
                    </p>
                  </div>
                  <Switch
                    id="showHints"
                    checked={settings.showHints}
                    onCheckedChange={(checked) => handleChange("showHints", checked)}
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => router.push("/dashboard")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Settings"}
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
