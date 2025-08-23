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
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

type InferenceResult = {
  predicted_label: string;
  predicted_class_idx: number;
  confidence: number;
  probabilities: number[];
  all_labels: string[];
};

function labelClass(label?: string) {
  switch (label) {
    case "Non_Demented":
      return "bg-emerald-500 text-white";
    case "Very_Mild_Demented":
      return "bg-yellow-500 text-white";
    case "Mild_Demented":
      return "bg-orange-500 text-white";
    case "Moderate_Demented":
      return "bg-red-500 text-white";
    default:
      return "bg-muted text-foreground";
  }
}

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
  const disabled = useMemo(() => files.length === 0 || isUploading || isProcessing, [files, isUploading, isProcessing]);

  const handleFilesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files ? Array.from(e.target.files) : [];
      setFiles(list);
    },
    []
  );

  const handleUploadAndProcess = useCallback(async () => {
    if (!patientId || files.length === 0) return;
    try {
      setIsUploading(true);
      setIsProcessing(true);

      const form = new FormData();
      files.forEach((f) => form.append("files", f, f.name));

      const res = await fetch(`${API_BASE_URL}/api/images/${patientId}/upload`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Upload failed with status ${res.status}`);
      }

      setFiles([]);
      await imagesQuery.refetch();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  }, [patientId, files, imagesQuery]);

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
          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Brain MRI</CardTitle>
              <CardDescription>Upload and process MRI images for analysis</CardDescription>
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
                  {isProcessing ? "Processing..." : isUploading ? "Uploading..." : "Upload & Process"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History Card */}
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload History</CardTitle>
                <CardDescription>Previously uploaded MRI images and processing results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagesQuery.isLoading ? (
                  <div className="py-6 text-sm text-muted-foreground">Loading...</div>
                ) : !imagesQuery.data || imagesQuery.data.length === 0 ? (
                  <p className="text-muted-foreground">No images uploaded yet.</p>
                ) : (
                  <div className="space-y-6">
                    {imagesQuery.data.map((img) => {
                      const results = img.results as unknown as InferenceResult | undefined;
                      return (
                        <Card key={img.id} className="p-6 border">
                          <div className="flex gap-6">
                            {/* Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={`${API_BASE_URL}/uploads/${img.filename}`}
                                alt="MRI Scan"
                                className="w-32 h-32 object-cover rounded-lg border"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                            </div>

                            {/* Meta + Results */}
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(img.uploadedAt as unknown as string)}
                                </p>
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
                                          <span className="text-xs w-28 text-muted-foreground">
                                            {label.replaceAll("_", " ")}
                                          </span>
                                          <Progress
                                            value={(results.probabilities[i] ?? 0) * 100}
                                            className="h-1.5 flex-1"
                                          />
                                          <span className="text-xs w-12 text-right">
                                            {Math.round((results.probabilities[i] ?? 0) * 100)}%
                                          </span>
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
