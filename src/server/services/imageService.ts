import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { images } from "../db/schema";
import { takeFirstOrThrow } from "@/lib/utils";


type InferenceResult = {
  predicted_label: string;
  predicted_class_idx: number;
  confidence: number;
  probabilities: number[];
  all_labels: string[];
};


const generateMockResult = (): InferenceResult => {
  const labels = ["Mild_Demented", "Moderate_Demented", "Non_Demented", "Very_Mild_Demented"];
  const randomIndex = Math.floor(Math.random() * labels.length);

  // Generate realistic probabilities that sum to 1
  const probabilities = Array(4).fill(0).map(() => Math.random());
  const sum = probabilities.reduce((a, b) => a + b, 0);
  const normalizedProbs = probabilities.map(p => p / sum);

  // Make the selected class have higher probability
  const currentProb = normalizedProbs[randomIndex] ?? 0;
  normalizedProbs[randomIndex] = Math.max(currentProb, 0.6 + Math.random() * 0.3);
  const newSum = normalizedProbs.reduce((a, b) => a + b, 0);
  const finalProbs = normalizedProbs.map(p => p / newSum);

  const selectedLabel = labels[randomIndex];
  const confidence = finalProbs[randomIndex];

  // Ensure we have valid values
  if (!selectedLabel || confidence === undefined) {
    throw new Error("Failed to generate mock result");
  }

  return {
    predicted_label: selectedLabel,
    predicted_class_idx: randomIndex,
    confidence: confidence,
    probabilities: finalProbs,
    all_labels: labels,
  };
};

export class ImageService {
  UPLOAD_FOLDER = path.join(process.cwd(), "public", "uploads");
  PROCESSING_SERVER_URL = "http://localhost:5000/process";

  constructor() {
    if (!fs.existsSync(this.UPLOAD_FOLDER)) {
      fs.mkdirSync(this.UPLOAD_FOLDER, { recursive: true });
    }
  }

  async uploadAndProcess(patientId: string, files: { name: string; contentBase64: string }[]): Promise<any[]> {
    const results: any[] = [];

    for (const file of files) {
      try {
        const destPath = path.join(this.UPLOAD_FOLDER, file.name);
        const buffer = Buffer.from(file.contentBase64, "base64");
        fs.writeFileSync(destPath, buffer);

        const image = await db.insert(images)
          .values({
            id: crypto.randomUUID(),
            patientId,
            filename: file.name,
            uploadedAt: new Date().toISOString(),
            results: undefined,
          })
          .returning()
          .then(takeFirstOrThrow);

        const formData = new FormData();
        formData.append("file", fs.createReadStream(destPath));

        const response = await axios.post(this.PROCESSING_SERVER_URL, formData, {
          headers: formData.getHeaders(),
          timeout: 20000,
        });

        const updated = await db.update(images)
          .set({ results: response.data })
          .where(eq(images.id, image.id))
          .returning()
          .then(takeFirstOrThrow);

        results.push(updated);
      } catch (err: any) {
        console.error("Error processing file", file.name, err.response?.data || err.message || err);
      }
    }

    return results;
  }

  async uploadOnly(patientId: string, files: { name: string; contentBase64: string }[]): Promise<any[]> {
    const results: any[] = [];

    for (const file of files) {
      try {
        const destPath = path.join(this.UPLOAD_FOLDER, file.name);
        const buffer = Buffer.from(file.contentBase64, "base64");
        fs.writeFileSync(destPath, buffer);

        const image = await db.insert(images)
          .values({
            id: crypto.randomUUID(),
            patientId,
            filename: file.name,
            uploadedAt: new Date().toISOString(),
            results: undefined,
          })
          .returning()
          .then(takeFirstOrThrow);

        const mock_data = generateMockResult();

        const updated = await db.update(images)
          .set({ results: mock_data })
          .where(eq(images.id, image.id))
          .returning()
          .then(takeFirstOrThrow);

        results.push(updated);
      } catch (err: any) {
        console.error("Error uploading file", file.name, err.message || err);
      }
    }

    return results;
  }
}
