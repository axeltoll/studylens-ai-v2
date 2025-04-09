"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface AnnualUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function AnnualUpsellModal({ 
  isOpen, 
  onClose, 
  onUpgrade 
}: AnnualUpsellModalProps) {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 42,
    seconds: 40
  });
  
  // Update countdown timer
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen]);
  
  // Format time with leading zeros
  const formatTime = (value: number) => value.toString().padStart(2, '0');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="relative bg-gradient-to-b from-blue-500 to-blue-700 rounded-2xl shadow-xl max-w-md w-full text-white overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Timer banner */}
        <div className="bg-blue-600/80 backdrop-blur-sm p-3 flex items-center justify-center space-x-2">
          <svg className="h-5 w-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none" />
            <path d="M12 6v6l4 2" strokeWidth="2" stroke="currentColor" fill="none" />
          </svg>
          <span className="text-sm font-medium">
            Offer ends in {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </span>
        </div>
        
        {/* Content */}
        <div className="p-6 pt-4">
          <h2 className="text-2xl font-bold mb-2">Upgrade to Annual Plan</h2>
          <p className="text-white/90 text-sm mb-5">
            Get unlimited AI answers and premium features to ace your studies
          </p>
          
          {/* Pricing */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-5">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">$59.99</span>
                <span className="text-sm line-through ml-2 opacity-70">$120.00</span>
              </div>
              <div className="bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                Save 50%
              </div>
            </div>
            <p className="text-sm text-white/80">
              Billed annually (that's just $5/month)
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-4 mb-5">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Unlimited AI Answers</h3>
                <p className="text-sm text-white/80">Get instant help with any question, anytime</p>
              </div>
            </div>
            
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Access all features</h3>
                <p className="text-sm text-white/80">Chrome extension, mobile app and more</p>
              </div>
            </div>
            
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Accurate Step-by-Step Solutions</h3>
                <p className="text-sm text-white/80">Get detailed explanations for complex problems, including graphs and images</p>
              </div>
            </div>
          </div>
          
          {/* Buttons */}
          <button
            onClick={onUpgrade}
            className="w-full py-3.5 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition-colors mb-4"
          >
            Upgrade Now & Save 50%
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-white/90 hover:text-white py-2"
          >
            No thanks, I'll lose this exclusive offer
          </button>
        </div>
      </div>
    </div>
  );
} 