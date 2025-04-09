import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
const MAX_RETRIES = 2;

export async function POST(req: Request) {
  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
    try {
      const { query, files } = await req.json();
      
      if (!query && (!files || files.length === 0)) {
        return NextResponse.json(
          { error: "Query or files are required" },
          { status: 400 }
        );
      }

      // The API key should be in environment variables
      const apiKey = process.env.PERPLEXITY_API_KEY;
      
      if (!apiKey) {
        console.error("Perplexity API key is not configured");
        return NextResponse.json(
          { error: "Perplexity API key is not configured" },
          { status: 500 }
        );
      }

      // Construct prompt based on query and files
      let prompt = query || "";
      if (files && files.length > 0) {
        prompt += "\n\nAdditional context from documents:\n";
        files.forEach((file: any) => {
          prompt += `\n${file.name}: ${file.content}\n`;
        });
      }

      // Call Perplexity API
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "sonar-medium-online",
          messages: [
            { 
              role: "system", 
              content: "You are a research assistant that provides comprehensive information with academic citations. Your answers should be thorough, well-structured, and backed by credible sources. Include references to recent research papers, academic journals, and authoritative publications whenever possible."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          options: {
            stream: true
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Perplexity API error:", response.status, errorData);
        throw new Error(`Perplexity API responded with status: ${response.status}`);
      }

      // Return the streaming response
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    } catch (error: any) {
      console.error(`Perplexity API error (attempt ${retries + 1}/${MAX_RETRIES + 1}):`, error);
      
      // If we've reached max retries, return error response
      if (retries === MAX_RETRIES) {
        // Provide more helpful error messages based on error type
        if (error.message?.includes('429')) {
          return NextResponse.json(
            { error: "The AI service is currently experiencing high demand. Please try again in a moment." },
            { status: 503 }
          );
        } else if (error.message?.includes('401') || error.message?.includes('403')) {
          return NextResponse.json(
            { error: "Authentication error with the AI service. Please contact support." },
            { status: 500 }
          );
        } else {
          return NextResponse.json(
            { error: "The AI service is temporarily unavailable. Please try again later." },
            { status: 500 }
          );
        }
      }
      
      // Exponential backoff before retry
      const delay = Math.pow(2, retries) * 500; // 500ms, 1000ms, 2000ms
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
  
  // This should never be reached due to the return in the final retry, but TypeScript might expect it
  return NextResponse.json(
    { error: "Unable to generate a response at this time." },
    { status: 500 }
  );
} 