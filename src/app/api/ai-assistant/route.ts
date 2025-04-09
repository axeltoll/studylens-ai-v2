import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { OpenAI } from "openai";

// Change from Edge to Node runtime for Firebase compatibility
export const runtime = "nodejs";
// Add force-dynamic to prevent static export errors
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { content, action, subject } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    // Configure different prompts based on the action
    let systemPrompt = "";
    
    switch (action) {
      case "summarize":
        systemPrompt = `You are an expert summarizer who can distill complex information into clear, concise summaries.
        Your task is to create a comprehensive summary of the provided content that captures all the key points and main ideas.
        Focus on the most important information and eliminate unnecessary details.
        Structure your summary with clear sections and bullet points where appropriate.
        Use simple language and avoid jargon unless necessary.`;
        break;

      case "flashcards":
        systemPrompt = `You are an educational expert specialized in creating effective flashcards for studying.
        Your task is to extract key concepts, terms, definitions, and facts from the provided content and transform them into flashcards.
        Each flashcard should have a clear front (question/term) and back (answer/definition).
        Format each flashcard as:
        
        FRONT: [question or term]
        BACK: [answer or definition]
        
        Create 10-15 flashcards that cover the most important information. Focus on concepts that are most likely to appear on exams or that are foundational to understanding the subject.`;
        break;

      case "quiz":
        systemPrompt = `You are an expert educator who specializes in creating effective quiz questions to test understanding.
        Your task is to create a comprehensive quiz based on the provided content.
        Include a mix of multiple-choice questions, true/false questions, and short answer questions.
        For multiple-choice questions, provide 4 options with one correct answer.
        Format each question clearly and provide the correct answer after each question.
        Create 5-10 questions that test understanding of the key concepts rather than just memorization of facts.`;
        break;

      case "answer_question":
        systemPrompt = `You are a knowledgeable tutor who specializes in providing clear, accurate answers to student questions.
        Your task is to directly answer the student's question based on your understanding of the subject.
        Provide a comprehensive explanation that is easy to understand.
        Include examples, analogies, or step-by-step instructions where appropriate.
        If the question is ambiguous or lacks context, make reasonable assumptions and state them in your answer.`;
        break;

      case "explain_concept":
        systemPrompt = `You are an expert educator who specializes in explaining complex concepts in simple terms.
        Your task is to provide a clear, comprehensive explanation of the concept mentioned in the content.
        Break down complex ideas into simpler components.
        Use analogies, examples, and visual descriptions to aid understanding.
        Structure your explanation logically, starting with foundational elements before moving to more complex aspects.
        Highlight practical applications or real-world relevance where appropriate.`;
        break;

      case "study_plan":
        systemPrompt = `You are an expert learning strategist who creates effective study plans.
        Your task is to create a comprehensive study plan based on the content provided.
        Design a structured schedule with specific goals, activities, and time allocations.
        Include a variety of study methods (active recall, spaced repetition, practice problems, etc.).
        Provide recommendations for resources and study materials.
        Include strategies for managing time, maintaining focus, and preventing burnout.
        Tailor the plan to accommodate different learning styles.`;
        break;

      default:
        systemPrompt = `You are a helpful AI assistant specialized in education and learning.
        Your task is to provide accurate, helpful information in response to the user's query.
        Be clear, concise, and thorough in your response.`;
    }

    const userMessage = subject 
      ? `${action === 'answer_question' ? 'Please answer the following question' : 'Please ' + action} about ${subject}:\n\n${content}`
      : `${content}`;

    // Use the model specified in environment variables or fallback to gpt-4o
    const model = process.env.OPENAI_API_MODEL || "gpt-4o";
    const apiKey = process.env.OPENAI_API_KEY || "";
    const organizationId = process.env.OPENAI_ORGANIZATION_ID || "";
    
    // Enhanced logging for debugging
    console.log("AI Assistant using model:", model);
    console.log("API Key format:", apiKey.startsWith("sk-proj-") ? "Project API key" : "Standard API key");
    console.log("API Key length:", apiKey.length);
    console.log("Using organization ID:", organizationId ? "Yes" : "No");
    
    try {
      // First attempt with streaming
      try {
        const result = await streamText({
          model: openai(model as any),
          messages: [
            {
              role: "user",
              content: userMessage,
            }
          ],
          system: systemPrompt,
          temperature: 0.2,
        });
        
        return result.toDataStreamResponse();
      } catch (streamError) {
        console.error("AI assistant streaming error:", streamError);
        
        // Fallback to direct API call
        const openaiClient = new OpenAI({
          apiKey: apiKey,
          organization: organizationId
        });
        
        const response = await openaiClient.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.2,
          max_tokens: 2000
        });
        
        return NextResponse.json({ content: response.choices[0].message.content });
      }
    } catch (error: any) {
      console.error("OpenAI API error in AI assistant:", error);
      
      if (error.status === 429) {
        return NextResponse.json(
          { error: "The AI service is currently experiencing high demand. Please try again in a moment." }, 
          { status: 503 }
        );
      } else if (error.status === 401 || error.status === 403) {
        return NextResponse.json(
          { error: "Authentication error with the AI service. Please check API keys and permissions." }, 
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { error: "The AI service is temporarily unavailable. Please try again later." }, 
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error processing AI assistant request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}