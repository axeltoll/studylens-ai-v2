import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const { prompt } = await request.json();
  
  // Use the model specified in environment variables or fallback to default
  const replicateModel = process.env.REPLICATE_MODEL || 
    "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478";

  // Validate that the model has the correct format for Replicate
  if (!replicateModel.match(/^[^/]+\/[^/:]+(?::[^/]+)?$/)) {
    throw new Error(
      "Invalid Replicate model format. It should be 'owner/model:version'"
    );
  }

  try {
    const output = await replicate.run(
      replicateModel as `${string}/${string}:${string}`,
      {
        input: {
          prompt: prompt,
          image_dimensions: "512x512",
          num_outputs: 1,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: "DPMSolverMultistep",
        },
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error) {
    console.error("Error from Replicate API:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
