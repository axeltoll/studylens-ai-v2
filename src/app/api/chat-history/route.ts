import { NextRequest, NextResponse } from "next/server";
import { saveChat, getUserChats } from "@/lib/firebase/firebaseUtils";

// Add force-dynamic to prevent static export errors
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, chatData } = await req.json();
    
    if (!userId || !chatData) {
      return NextResponse.json(
        { error: "User ID and chat data are required" },
        { status: 400 }
      );
    }

    // Save chat to Firebase
    const chatRef = await saveChat(userId, chatData);
    
    return NextResponse.json(
      { 
        success: true, 
        chatId: chatRef.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving chat history:", error);
    return NextResponse.json(
      { error: "Failed to save chat history" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const limitParam = searchParams.get('limit');
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const limit = limitParam ? parseInt(limitParam) : 20;
    
    // Get user's chat history
    const chats = await getUserChats(userId, limit);
    
    return NextResponse.json(
      { 
        success: true, 
        chats 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
} 