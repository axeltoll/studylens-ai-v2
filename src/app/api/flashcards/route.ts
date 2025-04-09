import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

interface Flashcard {
  term: string;
  definition: string;
  example?: string;
}

export async function POST(req: Request) {
  try {
    const { text, cardCount = 10 } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    // Use the model specified in environment variables or fallback to gpt-4-turbo
    const model = process.env.OPENAI_API_MODEL || "gpt-4-turbo";

    // Generate flashcards using AI
    const response = await streamText({
      model: openai(model),
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that creates educational flashcards.
            You will be given content and asked to create a set of ${cardCount} flashcards.
            
            For each flashcard:
            1. Identify an important term, concept, or fact from the content
            2. Provide a clear, concise definition
            3. Include a brief example or application where relevant
            
            Format your response as a valid JSON array of flashcard objects:
            [
              {
                "term": "The key term or concept",
                "definition": "A clear, concise definition",
                "example": "An example or application (optional)"
              }
            ]
            
            Respond with ONLY the JSON array without any additional text.`
        },
        {
          role: "user",
          content: `Create ${cardCount} flashcards based on this content:\n\n${text}`
        }
      ],
      temperature: 0.5,
      maxTokens: 3000,
    });

    // Return streaming response for client-side parsing
    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Error in flashcards API:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
} 