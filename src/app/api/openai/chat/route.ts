import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { OpenAI } from "openai";

// Change from Edge to Node runtime for Firebase compatibility
export const runtime = "nodejs";
// Add force-dynamic to prevent static export errors
export const dynamic = "force-dynamic";
const MAX_RETRIES = 2;

export async function POST(req: Request) {
  const body = await req.json();
  let messages;
  let systemPrompt = "You are a helpful AI assistant";
  
  // Handle different request formats
  if (body.messages) {
    // Use the messages array directly if provided
    messages = body.messages;
  } else if (body.message) {
    // Convert a single message to the messages array format
    messages = [
      { role: "user", content: body.message }
    ];
    
    // Adjust system prompt based on context if provided
    if (body.context === "code") {
      systemPrompt = "You are an expert programming assistant. Provide clear, efficient code examples with explanations. Format code blocks with ```language syntax. Focus on best practices.";
    } else if (body.context === "essay") {
      systemPrompt = "You are an expert writing assistant. Help create well-structured essays with proper grammar, compelling arguments, and clear organization. Provide guidance on thesis statements, topic sentences, and transitions.";
    } else if (body.quizMode) {
      systemPrompt = "You are an academic assistant providing educational help. Give comprehensive, accurate answers based on established academic knowledge. Include relevant facts, definitions, and explanations.";
    }
  } else {
    // If neither format is provided, return an error
    return Response.json({ error: "Invalid request format" }, { status: 400 });
  }
  
  // Use the model specified in environment variables or fallback to gpt-4-turbo
  const model = process.env.OPENAI_API_MODEL || "gpt-4-turbo";
  const apiKey = process.env.OPENAI_API_KEY || "";
  const organizationId = process.env.OPENAI_ORGANIZATION_ID || "";
  
  // Enhanced logging for debugging
  console.log("Using API Model:", model);
  console.log("API Key format:", apiKey.startsWith("sk-proj-") ? "Project API key" : "Standard API key");
  console.log("API Key length:", apiKey.length);
  console.log("Using organization ID:", organizationId ? "Yes" : "No");
  
  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
    try {
      // For single message format, use direct completion instead of streaming
      if (body.message) {
        const openaiClient = new OpenAI({
          apiKey: apiKey,
          organization: organizationId
        });
        
        const response = await openaiClient.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: body.message }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });
        
        return Response.json({ content: response.choices[0].message.content });
      }
      
      // For messages array format, use streaming
      try {
        const result = await streamText({
          model: openai(model as any),
          messages: convertToCoreMessages(messages),
          system: systemPrompt,
          temperature: 0.7,
          maxTokens: 2000
        });
        
        return result.toDataStreamResponse();
      } catch (streamError) {
        console.error("Streaming error:", streamError);
        
        // Fallback to non-streaming if streaming fails
        const openaiClient = new OpenAI({
          apiKey: apiKey,
          organization: organizationId
        });
        
        const response = await openaiClient.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m: any) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 2000
        });
        
        return Response.json({ content: response.choices[0].message.content });
      }
    } catch (error: any) {
      console.error(`OpenAI API error (attempt ${retries + 1}/${MAX_RETRIES + 1}):`, error);
      
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
