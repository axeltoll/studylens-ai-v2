"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Check } from "lucide-react";
import AnnualUpsellModal from "./AnnualUpsellModal";
import { useUsage } from "@/lib/contexts/UsageContext";

interface TrialCheckoutModalProps {
  onClose: () => void;
}

export default function TrialCheckoutModal({ onClose }: TrialCheckoutModalProps) {
  const [email, setEmail] = useState("");
  const [useAnotherEmail, setUseAnotherEmail] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [country, setCountry] = useState("United States");
  const [state, setState] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [taxId, setTaxId] = useState("");
  const [showAnnualUpsell, setShowAnnualUpsell] = useState(false);
  
  const { startTrial } = useUsage();

  const handleStartTrial = () => {
    // Start the trial
    const trialEndDate = startTrial();
    
    // Show the annual upsell modal after starting the trial
    setShowAnnualUpsell(true);
  };
  
  const handleUpgradeToAnnual = () => {
    // Handle annual upgrade logic here
    console.log("Upgrading to annual plan");
    setShowAnnualUpsell(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row my-8 max-h-[calc(100vh-4rem)] overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
            
            <div className="w-full md:w-3/5 p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  StudyLens AI (Free Trial)
                </h2>
              </div>
              
              {/* Email Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                
                {!useAnotherEmail ? (
                  <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2 mb-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <input 
                          type="radio" 
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                          checked 
                          readOnly 
                        />
                      </div>
                      <div className="text-sm">
                        <span>axel@funnel-profits.com</span>
                        <div className="flex items-center">
                          <Image 
                            src="/images/payment/mastercard.png" 
                            alt="Mastercard" 
                            width={24} 
                            height={16} 
                            className="mr-1"
                          />
                          <span className="text-xs text-gray-500">•••• 3159</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className="text-gray-400 hover:text-gray-500">
                        <Info className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>
                )}
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <input 
                      type="radio" 
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                      checked={useAnotherEmail}
                      onChange={() => setUseAnotherEmail(true)}
                    />
                  </div>
                  <span className="text-sm text-gray-600">Use another email</span>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div 
                  className={`border rounded-lg p-3 text-center cursor-pointer flex flex-col items-center justify-center ${
                    paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="h-8 w-8 flex items-center justify-center mb-1">
                    <Image src="/images/payment/card-icon.svg" alt="Card" width={24} height={24} />
                  </div>
                  <span className="text-sm">Card</span>
                </div>
                
                <div 
                  className={`border rounded-lg p-3 text-center cursor-pointer flex flex-col items-center justify-center ${
                    paymentMethod === "cash" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <div className="h-8 w-8 flex items-center justify-center mb-1">
                    <Image src="/images/payment/cash-app-pay.svg" alt="Cash App Pay" width={24} height={24} />
                  </div>
                  <span className="text-sm">Cash App Pay</span>
                </div>
              </div>
              
              {/* Card Info */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 1234 1234 1234"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex space-x-1">
                        <Image 
                          src="/images/payment/visa.png" 
                          alt="Visa" 
                          width={24} 
                          height={16} 
                        />
                        <Image 
                          src="/images/payment/mastercard.png" 
                          alt="Mastercard" 
                          width={24} 
                          height={16} 
                        />
                        <Image 
                          src="/images/payment/amex.png" 
                          alt="Amex" 
                          width={24} 
                          height={16} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Security code
                      </label>
                      <input
                        type="text"
                        value={securityCode}
                        onChange={(e) => setSecurityCode(e.target.value)}
                        placeholder="CVC"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    By providing your card information, you allow Lemon Squeezy LLC to charge your card for future payments in accordance with their terms.
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing address
                    </label>
                    
                    <div className="space-y-3">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        {/* Add more countries as needed */}
                      </select>
                      
                      <input
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="Address line 1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>Select a state...</option>
                        <option>California</option>
                        <option>New York</option>
                        {/* Add more states as needed */}
                      </select>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="ZIP"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Add Tax ID number
                    </label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm">$0.00</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Every month</span>
                      <span className="text-sm">$9.95</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>3 day trial</span>
                      <span>FREE</span>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                    onClick={handleStartTrial}
                  >
                    Start trial
                  </button>
                </div>
              )}
            </div>
            
            {/* Right Side Info Panel */}
            <div className="hidden md:block w-2/5 bg-blue-50 p-8 rounded-r-2xl">
              <div className="flex flex-col items-center mb-6 text-center">
                <Image 
                  src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dac1e06ab0c18df6a034.png" 
                  alt="StudyLens AI" 
                  width={140} 
                  height={48} 
                  className="mb-3" 
                />
                <p className="text-sm text-blue-600 font-semibold">
                  Join 250k+ Students improving their education
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Chrome extension</span>
                </div>
                
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Mobile app</span>
                </div>
                
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">AI Chat + Study tools</span>
                </div>
              </div>
              
              <div className="relative mt-16">
                <Image 
                  src="/images/dashboard-mascot.png" 
                  alt="StudyLens AI Assistant" 
                  width={180} 
                  height={180} 
                  className="absolute bottom-0 right-0" 
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex items-center mb-2">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-xs text-gray-600">Satisfaction guaranteed</span>
                </div>
                
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-xs text-gray-600">Cancel anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Annual Upsell Modal */}
      <AnnualUpsellModal 
        isOpen={showAnnualUpsell} 
        onClose={() => {
          setShowAnnualUpsell(false);
          onClose();
        }} 
        onUpgrade={handleUpgradeToAnnual} 
      />
    </>
  );
} 