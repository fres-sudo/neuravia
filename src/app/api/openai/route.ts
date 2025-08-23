import { NextRequest, NextResponse } from "next/server";
import { openai } from "./openai";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "gpt-4o-mini", temperature = 0 } = await request.json();

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature,
    });

    return NextResponse.json({
      response: completion.choices[0]?.message?.content,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
