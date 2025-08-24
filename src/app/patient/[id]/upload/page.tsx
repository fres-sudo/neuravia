"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/server/auth/auth-client";
import { api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { formatDate, labelClass } from "@/lib/utils";
import { BoostScoreService } from "@/scoring/service";
import { toast } from "sonner";

type InferenceResult = {
  predicted_label: string;
  predicted_class_idx: number;
  confidence: number;
  probabilities: number[];
  all_labels: string[];
};

// Mock configuration - set to true for deployed version
const USE_MOCK_DATA = true; // Change to true when deploying without ML server


export default function Page() {
  const router = useRouter();
  const { id: patientId } = useParams<{ id: string }>();
  const { data: session } = useSession();

  const imagesQuery = api.images.getImages.useQuery(
    { patientId: String(patientId) },
    { enabled: !!patientId }
  );

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const disabled = useMemo(
    () => files.length === 0 || isUploading || isProcessing,
    [files, isUploading, isProcessing]
  );

  const handleFilesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFiles(e.target.files ? Array.from(e.target.files) : []);
    },
    []
  );

  const uploadMutation = api.images.uploadAndProcess.useMutation();
  const uploadOnlyMutation = api.images.uploadOnly.useMutation();
  const insertScoreMutation = api.scoring.insertWithPreviousScore.useMutation();
  const boostService = new BoostScoreService();

  const handleUploadAndProcess = async () => {
    if (!patientId || files.length === 0) return;

    setIsUploading(true);
    setIsProcessing(true);

    try {
      const base64Files = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return {
            name: file.name,
            contentBase64: Buffer.from(arrayBuffer).toString("base64"),
          };
        })
      );

      let uploadResult;

      if (USE_MOCK_DATA) {
        // MOCK DATA VERSION - Upload to DB but with mock results
        uploadResult = await uploadOnlyMutation.mutateAsync({ patientId, files: base64Files });
        toast.info("Using mock AI analysis results for demonstration");
      } else {
        // REAL API VERSION - Uncomment when ML server is available
        uploadResult = await uploadMutation.mutateAsync({ patientId, files: base64Files });
      }

      // Calculate and insert scores for each processed image
      if (uploadResult && Array.isArray(uploadResult)) {
        for (const image of uploadResult) {
          if (image.results) {
            const results = image.results as InferenceResult;

            // Calculate MRI score from probabilities
            const activityValue = await boostService.calculateMriUpload(results);

            await insertScoreMutation.mutateAsync({
              patientId: patientId,
              activityType: 'mri_upload',
              activityValue: activityValue,
              metadata: {
                imageId: image.id,
                filename: image.filename,
                mriResults: results,
                uploadedAt: image.uploadedAt,
              },
            });
          }
        }
      }

      setFiles([]);
      await imagesQuery.refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to process images");
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold">MRI Scans</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Mock Data Warning */}
          {USE_MOCK_DATA && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardContent>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Demo Mode Active</p>
                    <p className="text-xs text-orange-700 mt-1">
                      This is a demonstration using simulated AI analysis results. This should connect to the real server that actually works for MRI analysis, but we were unable to deploy it here due to free account limitations. You can find the AI model in the repository we submitted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Brain MRI</CardTitle>
              <CardDescription>
                Upload and process MRI images for analysis
                {USE_MOCK_DATA && " (Demo mode - results are simulated)"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="files">Select MRI files (DICOM/NIfTI/JPEG/PNG)</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  accept=".dcm,.nii,.nii.gz,.jpg,.jpeg,.png"
                  onChange={handleFilesChange}
                />
                {files.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {files.length} file{files.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleUploadAndProcess} disabled={disabled}>
                  {isProcessing
                    ? (USE_MOCK_DATA ? "Simulating Analysis..." : "Processing...")
                    : isUploading
                    ? "Uploading..."
                    : `Upload & ${USE_MOCK_DATA ? "Simulate" : "Process"}`
                  }
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History Card */}
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload History</CardTitle>
                <CardDescription>
                  Previously uploaded MRI images and processing results
                  {USE_MOCK_DATA && " (Showing real database data only)"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagesQuery.isLoading ? (
                  <div className="py-6 text-sm text-muted-foreground">Loading...</div>
                ) : !imagesQuery.data || imagesQuery.data.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">No images uploaded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {imagesQuery.data.map((img) => {
                      const results = img.results as InferenceResult | undefined;
                      return (
                        <Card key={img.id} className="p-6 border">
                          <div className="flex gap-6">
                            {/* Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={`/uploads/${img.filename}`}
                                alt="MRI Scan"
                                className="w-32 h-32 object-cover rounded-lg border"
                                onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/placeholder.svg")}
                              />
                            </div>

                            {/* Meta + Results */}
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">{img.uploadedAt ? formatDate(img.uploadedAt) : "Unknown date"}</p>
                                {results?.predicted_label && (
                                  <Badge className={labelClass(results.predicted_label)}>
                                    {results.predicted_label.replaceAll("_", " ")}
                                  </Badge>
                                )}
                              </div>

                              {results && (
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium mb-2">
                                      Confidence: {Math.round(results.confidence * 100)}%
                                    </p>
                                    <Progress value={results.confidence * 100} className="h-2" />
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium mb-2">Probabilities by Category:</p>
                                    <div className="space-y-2">
                                      {results.all_labels.map((label, i) => (
                                        <div key={label} className="flex items-center gap-2">
                                          <span className="text-xs w-28 text-muted-foreground">{label.replaceAll("_", " ")}</span>
                                          <Progress value={(results.probabilities[i] ?? 0) * 100} className="h-1.5 flex-1" />
                                          <span className="text-xs w-12 text-right">{Math.round((results.probabilities[i] ?? 0) * 100)}%</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}