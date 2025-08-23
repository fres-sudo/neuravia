import { z } from "zod";

const EmojiListSchema = z.array(z.string().min(1));

export async function generateEmojisFromJob(jobName: string): Promise<string[]> {
  const prompt = `
Generate exactly 5 relevant emojis that represent the job: "${jobName}".
Respond ONLY with a JSON array of emojis. Example: ["💻","🖥️","👨‍💻","👩‍💻","🧑‍💻"]
`;

  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        prompt,
        model: "gpt-4o-mini",
        temperature: 0
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to call OpenAI API");
    }

    const data = await response.json();
    const rawOutput = data.response ?? "[]";

    let parsed: string[];
    try {
      parsed = JSON.parse(rawOutput);
    } catch (e) {
      throw new Error(`Invalid JSON from LLM: ${rawOutput}`);
    }

    return EmojiListSchema.parse(parsed);
  } catch (error) {
    console.error("Error generating emojis:", error);
    throw error;
  }
}