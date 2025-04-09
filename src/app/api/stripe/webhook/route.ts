import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type Stripe from 'stripe';

// Initialize Stripe with the API key from environment variables
const stripe = new (require('stripe'))(process.env.STRIPE_SECRET_KEY || '') as Stripe;

// Note: In a production environment, you would verify the Stripe signature
// and parse the event correctly

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing Stripe webhook secret');
      return NextResponse.json({ error: 'Missing Stripe webhook secret' }, { status: 500 });
    }
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature || '',
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid payload';
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Handler functions for different event types
async function handleSubscriptionCreated(subscription: any) {
  // Extract customer ID and metadata to get Firebase user ID
  const customerId = subscription.customer;
  const userId = subscription.metadata?.userId || customerId;
  
  if (!userId) {
    console.error('No user ID found in subscription metadata');
    return;
  }
  
  try {
    // Update subscription in Firestore
    await updateDoc(doc(db, 'subscriptions', userId), {
      status: subscription.status,
      stripeSubscriptionId: subscription.id,
      stripePlan: subscription.items.data[0].plan.id,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      updatedAt: serverTimestamp()
    });
    
    // Update user record
    await updateDoc(doc(db, 'users', userId), {
      plan: 'pro',
      updatedAt: serverTimestamp()
    });
    
    console.log(`Subscription created for user ${userId}`);
  } catch (error) {
    console.error('Error updating subscription in Firestore:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  // Extract customer ID and metadata to get Firebase user ID
  const customerId = subscription.customer;
  const userId = subscription.metadata?.userId || customerId;
  
  if (!userId) {
    console.error('No user ID found in subscription metadata');
    return;
  }
  
  try {
    // Update subscription in Firestore
    await updateDoc(doc(db, 'subscriptions', userId), {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: serverTimestamp()
    });
    
    // If subscription is canceled or past due, update user plan
    if (subscription.status === 'canceled' || subscription.status === 'past_due') {
      await updateDoc(doc(db, 'users', userId), {
        plan: 'free',
        updatedAt: serverTimestamp()
      });
    }
    
    console.log(`Subscription updated for user ${userId}`);
  } catch (error) {
    console.error('Error updating subscription in Firestore:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  // Extract customer ID and metadata to get Firebase user ID
  const customerId = subscription.customer;
  const userId = subscription.metadata?.userId || customerId;
  
  if (!userId) {
    console.error('No user ID found in subscription metadata');
    return;
  }
  
  try {
    // Update subscription in Firestore
    await updateDoc(doc(db, 'subscriptions', userId), {
      status: 'canceled',
      canceledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update user record to free plan
    await updateDoc(doc(db, 'users', userId), {
      plan: 'free',
      updatedAt: serverTimestamp()
    });
    
    console.log(`Subscription deleted for user ${userId}`);
  } catch (error) {
    console.error('Error updating subscription in Firestore:', error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  // Extract customer ID
  const customerId = invoice.customer;
  
  // In production, you'd query Stripe to get subscriptions or user metadata
  // For now, we'll assume we have the user ID in the invoice metadata
  const userId = invoice.metadata?.userId || customerId;
  
  if (!userId) {
    console.error('No user ID found in invoice metadata');
    return;
  }
  
  try {
    // Update subscription payment status
    await updateDoc(doc(db, 'subscriptions', userId), {
      lastPaymentStatus: 'succeeded',
      lastPaymentDate: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log(`Payment succeeded for user ${userId}`);
  } catch (error) {
    console.error('Error updating payment status in Firestore:', error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  // Extract customer ID
  const customerId = invoice.customer;
  
  // In production, you'd query Stripe to get subscriptions or user metadata
  const userId = invoice.metadata?.userId || customerId;
  
  if (!userId) {
    console.error('No user ID found in invoice metadata');
    return;
  }
  
  try {
    // Update subscription payment status
    await updateDoc(doc(db, 'subscriptions', userId), {
      lastPaymentStatus: 'failed',
      lastPaymentError: invoice.payment_intent?.last_payment_error?.message || 'Payment failed',
      updatedAt: serverTimestamp()
    });
    
    console.log(`Payment failed for user ${userId}`);
  } catch (error) {
    console.error('Error updating payment status in Firestore:', error);
    throw error;
  }
} 