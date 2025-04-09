import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Add force-dynamic to prevent static export errors
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { text, question } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Generate answer using AI
    const response = await streamText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that specializes in education and explaining complex concepts.
            You will be provided with content and a question about that content.
            Your task is to answer the question based on the content provided.
            If the question cannot be answered based solely on the provided content, say so and explain why.
            Provide clear, accurate, and educational responses with step-by-step explanations when appropriate.`
        },
        {
          role: "user",
          content: `
Content:
${text}

Question:
${question}

Please provide a detailed answer to this question based on the content above.`
        }
      ],
      temperature: 0.5,
    });

    // Return streaming response
    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Error in questions API:", error);
    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 }
    );
  }
} 