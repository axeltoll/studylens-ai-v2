import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/firebase';
import { db } from '@/lib/firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type Stripe from 'stripe';

// Initialize Stripe with the API key
// Use type assertion since we've added the dependency to package.json
const stripe = new (require('stripe'))(process.env.STRIPE_SECRET_KEY || '') as Stripe;

export async function POST(request: Request) {
  try {
    const { priceId, mode, successUrl, cancelUrl, customerEmail, metadata } = await request.json();
    
    // Validate required fields
    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required checkout information' },
        { status: 400 }
      );
    }
    
    // Get the current user
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      return NextResponse.json(
        { error: 'User must be logged in to create a checkout session' },
        { status: 401 }
      );
    }
    
    // Prepare metadata with user ID
    const sessionMetadata = {
      userId: currentUser.uid,
      ...metadata,
    };

    // Get the site domain from environment or request
    const origin = process.env.NEXT_PUBLIC_PRODUCTION_URL || process.env.NEXT_PUBLIC_URL || '';
    
    // Ensure the URLs are absolute with the correct domain
    const absoluteSuccessUrl = successUrl.startsWith('http') 
      ? successUrl 
      : `${origin}${successUrl.startsWith('/') ? '' : '/'}${successUrl}`;
    
    const absoluteCancelUrl = cancelUrl.startsWith('http') 
      ? cancelUrl 
      : `${origin}${cancelUrl.startsWith('/') ? '' : '/'}${cancelUrl}`;

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: mode || 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: sessionMetadata,
      customer_email: customerEmail || currentUser.email,
      success_url: absoluteSuccessUrl,
      cancel_url: absoluteCancelUrl,
      subscription_data: mode === 'subscription' ? {
        trial_period_days: 3, // 3-day trial
        metadata: sessionMetadata,
      } : undefined,
    });
    
    // For demo/tracking, store a reference to the checkout session
    await setDoc(
      doc(db, 'checkoutSessions', session.id),
      {
        userId: currentUser.uid,
        email: currentUser.email,
        sessionId: session.id,
        priceId,
        mode,
        status: session.status,
        createdAt: serverTimestamp(),
      }
    );
    
    return NextResponse.json({ id: session.id, url: session.url });
    
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 