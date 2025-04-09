"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, Clock, Check, ChevronRight, Copy, Share, Twitter, 
  Facebook, Linkedin, MessageCircle, Award, Brain, BookOpen, FileQuestion, Library, History, Users, Chrome, Sparkles
} from "lucide-react";
import TrialCheckoutModal from "../components/TrialCheckoutModal";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Dashboard() {
  const [showTrialModal, setShowTrialModal] = useState(false);
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Calculate time until April 20, 2025
  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadline = new Date("April 20, 2025 23:59:59").getTime();
      const now = new Date().getTime();
      const difference = deadline - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleCopyReferralLink = () => {
    const baseUrl = window.location.origin;
    const referralCode = user?.uid?.substring(0, 8) || "STDLNS";
    navigator.clipboard.writeText(`${baseUrl}/signup?ref=${referralCode}`);
    // Could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {showTrialModal && (
        <TrialCheckoutModal onClose={() => setShowTrialModal(false)} />
      )}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 dark:text-white">Welcome to StudyLens AI</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">Your personal AI study assistant that helps you learn faster and ace your exams.</p>
        </div>
        
        {/* Top 3 Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Chrome Extension Card */}
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-blue-600">
              <Image 
                src="/images/chrome-extension-feature.jpg" 
                alt="Chrome Extension" 
                fill 
                className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                    <Chrome className="h-6 w-6 text-white" />
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600/70 backdrop-blur-sm text-white border border-blue-400/30">
                    The OG
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">Chrome Extension</h3>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Image 
                      src="/images/chrome-logo.svg" 
                      alt="Chrome Logo" 
                      width={20} 
                      height={20} 
                    />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Screenshot any question and get instant answers on any quiz, homework, or test.
                </p>
              </div>
              <Link 
                href="https://chrome.google.com/webstore/detail/studylens-ai-ace-tests-qu/mdfigkhdcpobdbgccoidpojfhcnbmmkd"
                target="_blank"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                <Chrome className="h-4 w-4 mr-2" />
                Install Extension
              </Link>
            </div>
          </motion.div>
          
          {/* AI Chatbot Card */}
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48 bg-gradient-to-r from-purple-600 to-blue-600">
              <Image 
                src="/images/ai-chatbots-feature.jpg" 
                alt="AI Chatbots" 
                fill 
                className="object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/70 backdrop-blur-sm text-white border border-purple-400/30">
                    New
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">AI Study Chatbots</h3>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask questions and get instant answers to any subject with specialized AI tutors.
                </p>
              </div>
              <Link 
                href="/dashboard/chatbot" 
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                <Brain className="h-4 w-4 mr-2" />
                Try Now
              </Link>
            </div>
          </motion.div>
          
          {/* StudyLens AI App Card */}
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-teal-500">
              <Image 
                src="/images/mobile-app-feature.jpg" 
                alt="Mobile App" 
                fill 
                className="object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                    <Image 
                      src="/apple-icon.svg" 
                      alt="iOS Icon" 
                      width={30} 
                      height={30} 
                      className="drop-shadow-md"
                    />
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600/70 backdrop-blur-sm text-white border border-blue-400/30">
                    iOS app
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">StudyLens AI App</h3>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Image 
                      src="/apple-icon.svg" 
                      alt="iOS Icon" 
                      width={20} 
                      height={20} 
                    />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Take a picture and get clear, step-by-step solutions instantly on your phone.
                </p>
              </div>
              <Link 
                href="https://apps.apple.com/app/studylens-ai/id1234567890"
                target="_blank"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 text-white rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                <Image 
                  src="/apple-icon.svg" 
                  alt="iOS Icon" 
                  width={16} 
                  height={16} 
                  className="mr-2"
                />
                Get App
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Two Column Layout for Free Trial and Ambassador Program */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 3-Day Free Offer Box - Left Column */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg overflow-hidden text-white p-6">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Offer valid until April 20th, 2025</span>
            </div>
            
            {/* Countdown Timer */}
            <div className="flex gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-2 w-14 text-center">
                <div className="text-xl font-bold">{timeLeft.days}</div>
                <div className="text-xs">Days</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 w-14 text-center">
                <div className="text-xl font-bold">{timeLeft.hours}</div>
                <div className="text-xs">Hours</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 w-14 text-center">
                <div className="text-xl font-bold">{timeLeft.minutes}</div>
                <div className="text-xs">Minutes</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 w-14 text-center">
                <div className="text-xl font-bold">{timeLeft.seconds}</div>
                <div className="text-xs">Seconds</div>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="font-bold text-2xl">3 days FREE</div>
              <div className="ml-2 px-2 py-1 bg-white/20 rounded-md text-xs font-medium">
                StudyLens AI pro
              </div>
            </div>
            <p className="text-sm mb-6">Complete access to all premium features</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <Check className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Unlimited AI Answers</h4>
                  <p className="text-sm opacity-80">Get instant help with any question, anytime</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Check className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Access all features</h4>
                  <p className="text-sm opacity-80">Chrome extension, mobile app and more</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Check className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Accurate Step-by-Step Solutions</h4>
                  <p className="text-sm opacity-80">Get detailed explanations for complex problems</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowTrialModal(true)}
              className="w-full py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors mb-3"
            >
              Get Started
            </button>
            
            <p className="text-xs opacity-80 text-center">
              Cancel anytime • Satisfaction Guarantee • Renews at $9.95/mo
            </p>
          </div>
          
          {/* Right Column - Ambassador Program and Custom Curriculum */}
          <div className="space-y-8">
            {/* Ambassador Program Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Ambassador Program</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Invite friends and earn rewards! Get <span className="font-bold">+1 free week</span> for every friend you invite who signs up.
              </p>
              
              <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between mb-6">
                <span className="text-sm text-gray-600 truncate mr-2">
                  https://studylens.ai/signup?ref=MLAXD934
                </span>
                <button 
                  onClick={handleCopyReferralLink}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </button>
              </div>
              
              <div className="flex gap-3 mb-6">
                <button className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors inline-flex items-center justify-center">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </button>
                <button className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors inline-flex items-center justify-center">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </button>
                <button className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors inline-flex items-center justify-center">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>You've invited 0 friends</p>
                <p>You've earned 0 free weeks</p>
              </div>
            </div>
            
            {/* Custom Curriculum Card - PRO Feature */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 relative">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1">
                PRO
              </div>
              
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Custom Curriculum</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Add your subjects and weekly curriculum to get personalized study assistance tailored to your courses.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-1">Subjects Added</h4>
                  <p className="text-2xl font-bold text-purple-600">0</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-1">Progress</h4>
                  <p className="text-2xl font-bold text-purple-600">0%</p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowTrialModal(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-colors"
              >
                Add Subjects
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}