import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // Index of the correct answer (0-based)
  explanation: string;
}

export async function POST(req: Request) {
  try {
    const { text, questionCount = 5 } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    // Use the model specified in environment variables or fallback to gpt-4-turbo
    const model = process.env.OPENAI_API_MODEL || "gpt-4-turbo";

    // Generate quiz using AI
    const response = await streamText({
      model: openai(model),
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that creates educational quizzes.
            You will be given content and asked to create a multiple-choice quiz with ${questionCount} questions.
            
            For each question:
            1. Create a clear, specific question based on the content
            2. Provide 4 answer options (A, B, C, D)
            3. Indicate which option is correct (as a 0-based index where 0=A, 1=B, etc.)
            4. Include a brief explanation of why the answer is correct
            
            Format your response as a valid JSON array of quiz question objects:
            [
              {
                "question": "Question text?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": 0, // Index of correct answer (0-based)
                "explanation": "Explanation of why the answer is correct"
              }
            ]
            
            Respond with ONLY the JSON array without any additional text.`
        },
        {
          role: "user",
          content: `Create a ${questionCount}-question multiple-choice quiz based on this content:\n\n${text}`
        }
      ],
      temperature: 0.5,
      maxTokens: 3000,
    });

    // Return streaming response for client-side parsing
    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Error in quiz API:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
} 