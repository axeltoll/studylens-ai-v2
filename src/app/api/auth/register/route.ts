import { NextRequest, NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { createContact, createOpportunity, triggerWorkflow } from "@/lib/highLevel/highLevelClient";

// Configure these with your actual HighLevel IDs
const PIPELINE_ID = process.env.HIGHLEVEL_PIPELINE_ID || "";
const STAGE_ID = process.env.HIGHLEVEL_STAGE_ID || "";
const WORKFLOW_ID = process.env.HIGHLEVEL_WORKFLOW_ID || "";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, plan = "free" } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      plan,
      role: "user",
    });

    // Create contact in HighLevel
    const contact = {
      email,
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
      name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
      tags: ["InsightLens AI", "Website Signup", plan],
      source: "Website",
    };

    const highLevelContact = await createContact(contact);

    // Create opportunity in HighLevel if pipeline and stage are configured
    if (PIPELINE_ID && STAGE_ID) {
      const opportunity = {
        name: `${firstName || ""} ${lastName || ""} - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
        pipelineId: PIPELINE_ID,
        stageId: STAGE_ID,
        status: "open" as const,
        email,
        phone: phone || undefined,
        source: "Website",
        tags: ["InsightLens AI", plan],
      };

      await createOpportunity(opportunity);
    }

    // Trigger workflow in HighLevel if workflow ID is configured
    if (WORKFLOW_ID) {
      const workflow = {
        workflowId: WORKFLOW_ID,
        email,
        phone: phone || undefined,
        contactId: highLevelContact.id,
      };

      await triggerWorkflow(workflow);
    }

    return NextResponse.json({ 
      success: true, 
      uid: user.uid,
    });
    
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Handle Firebase Auth errors
    if (error.code === "auth/email-already-in-use") {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 }
      );
    } else if (error.code === "auth/invalid-email") {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    } else if (error.code === "auth/weak-password") {
      return NextResponse.json(
        { error: "Password is too weak" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
} 