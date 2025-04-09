"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import StripeCheckout from "./StripeCheckout";

export default function PricingSection() {
  const [showCheckout, setShowCheckout] = useState(false);
  
  const openCheckout = () => setShowCheckout(true);
  const closeCheckout = () => setShowCheckout(false);
  
  const handleCheckoutComplete = () => {
    setShowCheckout(false);
    // Additional actions after successful checkout can be added here
  };
  
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a 3-day free trial. No hidden fees, cancel anytime.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600">Get started with basic tools</p>
            </div>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
              <p className="text-gray-600">Forever free</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">3 AI summaries per month</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Basic flashcard creation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">5 PDF uploads per month</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Community support</span>
              </li>
            </ul>
            
            <button
              className="w-full py-3 px-4 rounded-lg text-blue-600 font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => window.location.href = "/signup"}
            >
              Sign Up Free
            </button>
          </div>
          
          {/* Pro Plan */}
          <div className="border-2 border-blue-600 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              RECOMMENDED
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600">Everything you need to succeed</p>
            </div>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-1">$9.95</div>
              <p className="text-gray-600">per month, billed monthly</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Unlimited AI summaries</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Advanced flashcard creation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Unlimited PDF uploads</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Chrome extension</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Essay writing assistance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Priority email support</span>
              </li>
            </ul>
            
            <button
              className="w-full py-3 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={openCheckout}
            >
              Start 3-Day Free Trial
            </button>
            
            <p className="mt-4 text-center text-sm text-gray-500">
              No credit card required for signup
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Need a custom plan for your school or organization?
          </h3>
          <a
            href="/contact"
            className="text-blue-600 font-medium hover:underline"
          >
            Contact us for enterprise pricing →
          </a>
        </div>
      </div>
      
      {showCheckout && (
        <StripeCheckout 
          onClose={closeCheckout} 
          onComplete={handleCheckoutComplete} 
        />
      )}
    </section>
  );
} 