import { anthropic } from "@ai-sdk/anthropic";
import { convertToCoreMessages, streamText } from "ai";

// Change from Edge to Node runtime for Firebase compatibility
export const runtime = "nodejs";
// Add force-dynamic to prevent static export errors
export const dynamic = "force-dynamic";
const MAX_RETRIES = 2;

export async function POST(req: Request) {
  const { messages, systemPrompt } = await req.json();
  // Use the model specified in environment variables or fallback to claude-3-sonnet
  const model = process.env.ANTHROPIC_MODEL || "claude-3-sonnet-20240229";
  const apiKey = process.env.ANTHROPIC_API_KEY || "";
  
  // Enhanced logging for debugging
  console.log("Using Anthropic Model:", model);
  console.log("Anthropic API Key format:", apiKey.startsWith("sk-ant-") ? "Standard API key" : "Unknown format");
  console.log("API Key length:", apiKey.length);
  
  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
    try {
      const result = await streamText({
        model: anthropic(model as any),
        messages: convertToCoreMessages(messages),
        system: systemPrompt || "You are a helpful AI assistant",
        temperature: 0.7,
        maxTokens: 2000,
      });

      return result.toDataStreamResponse();
    } catch (error: any) {
      console.error(`Anthropic API error (attempt ${retries + 1}/${MAX_RETRIES + 1}):`, error);
      
      // If we've reached max retries, return error response
      if (retries === MAX_RETRIES) {
        // Provide more helpful error messages based on error type
        if (error.status === 429) {
          return Response.json({ 
            error: "The AI service is currently experiencing high demand. Please try again in a moment." 
          }, { status: 503 });
        } else if (error.status === 401 || error.status === 403) {
          return Response.json({ 
            error: "Authentication error with the AI service. Please check API keys and permissions." 
          }, { status: 500 });
        } else {
          return Response.json({ 
            error: "The AI service is temporarily unavailable. Please try again later." 
          }, { status: 500 });
        }
      }
      
      // Exponential backoff before retry
      const delay = Math.pow(2, retries) * 500; // 500ms, 1000ms, 2000ms
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
  
  // This should never be reached due to the return in the final retry, but TypeScript might expect it
  return Response.json({ 
    error: "Unable to generate a response at this time." 
  }, { status: 500 });
}
