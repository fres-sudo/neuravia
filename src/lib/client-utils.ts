// Client-side utility to call OpenAI API

export async function callOpenAI(prompt: string) {
  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to call OpenAI API");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}
