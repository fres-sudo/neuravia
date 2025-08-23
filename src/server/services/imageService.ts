import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { images } from "../db/schema";
import { takeFirstOrThrow } from "@/lib/utils";

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
}
