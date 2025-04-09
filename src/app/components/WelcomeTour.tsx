"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  Upload,
  Share2,
  Calendar,
  Settings,
  Sparkles,
  MessageSquare
} from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  target: string;
  placement: "top" | "bottom" | "left" | "right";
  icon: React.ReactNode;
}

interface WelcomeTourProps {
  onComplete: () => void;
  onSkip: () => void;
  isFirstLogin?: boolean;
}

export default function WelcomeTour({ onComplete, onSkip, isFirstLogin = true }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  
  const tourSteps: TourStep[] = [
    {
      title: "Welcome to InsightLens AI",
      description: "Let's take a quick tour to help you get started. We'll show you how to make the most of our features.",
      target: "body",
      placement: "bottom",
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Upload Documents",
      description: "Click here to upload PDFs, documents, or text files you want to study or analyze.",
      target: "[data-tour='upload-btn']",
      placement: "bottom",
      icon: <Upload className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "AI Assistant",
      description: "Ask questions, get summaries, or create flashcards with our AI assistant.",
      target: "[data-tour='ai-assistant']",
      placement: "right",
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Study Library",
      description: "Access all your summaries, flashcards, and quizzes in your personal library.",
      target: "[data-tour='library']",
      placement: "right",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Share Your Content",
      description: "Easily share summaries and flashcards with friends or classmates.",
      target: "[data-tour='share-btn']",
      placement: "bottom",
      icon: <Share2 className="h-6 w-6 text-pink-500" />,
    },
    {
      title: "Create Study Plans",
      description: "Organize your learning with customized study plans.",
      target: "[data-tour='study-plan']",
      placement: "bottom",
      icon: <Calendar className="h-6 w-6 text-orange-500" />,
    },
    {
      title: "Settings",
      description: "Customize your experience and manage your account settings.",
      target: "[data-tour='settings']",
      placement: "left",
      icon: <Settings className="h-6 w-6 text-gray-500" />,
    },
  ];
  
  useEffect(() => {
    // Save tour completion status to localStorage
    if (!isFirstLogin) {
      setVisible(false);
      return;
    }
    
    const tourCompleted = localStorage.getItem("welcomeTourCompleted");
    if (tourCompleted === "true") {
      setVisible(false);
    }
  }, [isFirstLogin]);
  
  useEffect(() => {
    // Scroll to target element
    const targetElement = document.querySelector(tourSteps[currentStep].target);
    if (targetElement && tourSteps[currentStep].target !== "body") {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      
      // Add highlight effect
      targetElement.classList.add("tour-highlight");
      
      return () => {
        targetElement.classList.remove("tour-highlight");
      };
    }
  }, [currentStep, tourSteps]);
  
  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  
  const handleComplete = () => {
    setVisible(false);
    localStorage.setItem("welcomeTourCompleted", "true");
    onComplete();
  };
  
  const handleSkip = () => {
    setVisible(false);
    localStorage.setItem("welcomeTourCompleted", "true");
    onSkip();
  };
  
  if (!visible) return null;
  
  // Calculate position based on target element and placement
  const getPosition = () => {
    if (tourSteps[currentStep].target === "body") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }
    
    const targetElement = document.querySelector(tourSteps[currentStep].target);
    if (!targetElement) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }
    
    const rect = targetElement.getBoundingClientRect();
    const placement = tourSteps[currentStep].placement;
    
    switch (placement) {
      case "top":
        return {
          bottom: `${window.innerHeight - rect.top + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          top: `${rect.top + rect.height / 2}px`,
          right: `${window.innerWidth - rect.left + 20}px`,
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 20}px`,
          transform: "translateY(-50%)",
        };
      default:
        return {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-auto"></div>
      
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute pointer-events-auto bg-white rounded-xl shadow-2xl p-6 max-w-md w-full z-50"
          style={getPosition()}
        >
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center mb-4">
            <div className="rounded-full p-3 bg-blue-50 mr-4">
              {tourSteps[currentStep].icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{tourSteps[currentStep].title}</h3>
          </div>
          
          <p className="text-gray-600 mb-6">{tourSteps[currentStep].description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full ${
                    index === currentStep ? "w-6 bg-blue-600" : "w-1.5 bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
              )}
              
              {currentStep < tourSteps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 51;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 4px;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  );
} 