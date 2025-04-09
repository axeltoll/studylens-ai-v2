import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { text, url } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    // Use the model specified in environment variables or fallback to gpt-4-turbo
    const model = process.env.OPENAI_API_MODEL || "gpt-4-turbo";

    // Construct the prompt
    const prompt = `
      Please provide a concise summary of the following content. 
      Focus on the key points, main arguments, and important facts.
      Organize the summary in a clear structure with a brief introduction, 
      main points, and conclusion.
      
      ${url ? `Source URL: ${url}\n\n` : ''}
      
      Content:
      ${text}
    `;

    // Call OpenAI to generate the summary
    const response = await streamText({
      model: openai(model),
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that specializes in summarizing content accurately and concisely."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Error in summarize API:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
} 