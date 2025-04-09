import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe.js script and initialize with your publishable key
export const getStripe = async () => {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripePublishableKey) {
    console.error('Missing Stripe publishable key. Make sure it is set in your environment variables.');
    throw new Error('Missing Stripe publishable key. Make sure it is set in your environment variables.');
  }
  
  try {
    const stripe = await loadStripe(stripePublishableKey);
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }
    return stripe;
  } catch (error) {
    console.error('Failed to load Stripe.js:', error);
    throw error;
  }
};

// Types for Stripe checkout session
export interface CreateCheckoutSessionData {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

// Create a checkout session and redirect to Stripe Checkout
export const createCheckoutSession = async (data: CreateCheckoutSessionData) => {
  try {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const session = await response.json();
    
    if (!session.id || !session.url) {
      throw new Error('Invalid checkout session response');
    }
    
    // For server-side redirect
    if (session.url) {
      window.location.href = session.url;
      return session;
    }
    
    // For client-side redirect
    const stripe = await getStripe();
    
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error('Stripe redirect error:', error);
      throw new Error(error.message || 'Failed to redirect to checkout');
    }
    
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}; 