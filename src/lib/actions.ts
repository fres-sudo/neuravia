"use server";

import { openai } from "@/lib/openai";

export async function generateAIResponse(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return {
      success: true,
      response: completion.choices[0]?.message?.content,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      success: false,
      error: "Failed to generate response",
    };
  }
}
