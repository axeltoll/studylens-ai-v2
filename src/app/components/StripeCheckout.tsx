"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, X, CreditCard, Clock, Shield } from "lucide-react";

interface StripeCheckoutProps {
  onClose: () => void;
  onComplete: () => void;
}

export default function StripeCheckout({ onClose, onComplete }: StripeCheckoutProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  
  const formatCardNumber = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // Limit to 16 digits
    const limited = digits.slice(0, 16);
    
    // Add spaces every 4 digits
    const formatted = limited.replace(/(\d{4})(?=\d)/g, "$1 ");
    
    return formatted;
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // Limit to 4 digits
    const limited = digits.slice(0, 4);
    
    // Add slash after first 2 digits
    if (limited.length > 2) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }
    
    return limited;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid card number");
      return;
    }
    
    if (!cardHolder) {
      setError("Please enter the cardholder name");
      return;
    }
    
    if (!expiryDate || expiryDate.length < 5) {
      setError("Please enter a valid expiry date");
      return;
    }
    
    if (!cvc || cvc.length < 3) {
      setError("Please enter a valid CVC");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Instead of directly sending card details (which is not PCI compliant),
      // Use Stripe's recommended approach with checkout sessions
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1PADJKEHcWq5dLm1dMQjqvdZ', // Use your actual Stripe price ID
          mode: 'subscription',
          successUrl: `${window.location.origin}/dashboard?checkout=success`,
          cancelUrl: `${window.location.origin}/dashboard?checkout=canceled`,
          metadata: {
            plan: 'pro'
          }
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred with the payment');
      }
      
      // If successful, redirect to Stripe's checkout page
      if (data.url) {
        window.location.href = data.url;
      } else {
        // On success but no URL (unlikely with checkout sessions)
        onComplete();
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
        
        <div className="grid md:grid-cols-5">
          {/* Left side: Checkout form */}
          <div className="md:col-span-3 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Start your 3-day free trial
              </h2>
              <p className="text-gray-600">
                Enter your payment details to get started. You won't be charged until your trial ends.
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <div className="flex space-x-2">
                    <Image src="/assets/visa.svg" alt="Visa" width={24} height={16} />
                    <Image src="/assets/mastercard.svg" alt="Mastercard" width={24} height={16} />
                    <Image src="/assets/amex.svg" alt="American Express" width={24} height={16} />
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  id="cardHolder"
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="John Doe"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="expiryDate"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="cvc"
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : "Start Free Trial"}
              </button>
              
              <p className="mt-4 text-center text-sm text-gray-500">
                By starting your trial, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </form>
          </div>
          
          {/* Right side: Plan details */}
          <div className="md:col-span-2 bg-gray-50 p-8 border-l border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pro Plan
            </h3>
            
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900">$9.95</div>
              <div className="text-gray-600">per month after trial</div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">3-day free trial</span>
              </div>
              <p className="text-sm text-gray-600 ml-7">
                Cancel anytime before the trial ends and you won't be charged.
              </p>
            </div>
            
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-3">
                What's included:
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Unlimited AI requests</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Advanced essay assistance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Unlimited flashcards</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Chrome extension</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Priority support</span>
                </li>
              </ul>
            </div>
            
            <div className="text-sm text-gray-600 flex items-center">
              <Shield className="h-4 w-4 text-gray-400 mr-2" />
              <span>Secure payment processing via Stripe</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 