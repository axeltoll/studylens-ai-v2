import { NextRequest, NextResponse } from "next/server";
import { auth, storage } from "@/lib/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Configure for larger file uploads
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 10; // 10 seconds

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required." },
        { status: 401 }
      );
    }
    
    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }
    
    // Check file type (only accept PDFs)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }
    
    // Convert file to ArrayBuffer and then to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Generate a unique file name
    const filename = `${Date.now()}-${file.name}`;
    const userId = "user_id"; // This should be extracted from the auth token
    
    // Create a reference to the file location in Firebase Storage
    const fileRef = ref(storage, `documents/${userId}/${filename}`);
    
    // Upload the file
    await uploadBytes(fileRef, uint8Array, {
      contentType: file.type,
    });
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    
    // Return success response with the file URL
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename,
        downloadURL,
        contentType: file.type,
        size: file.size,
      }
    });
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
} 