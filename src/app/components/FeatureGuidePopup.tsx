"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronRight, ChevronLeft, 
  Lightbulb, FileQuestion, Code, 
  FileText, Download, Upload, 
  Settings, Clock, ThumbsUp 
} from "lucide-react";

interface FeatureGuidePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeatureGuidePopup({ isOpen, onClose }: FeatureGuidePopupProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Reset step when popup opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const slides = [
    {
      title: "Getting Started",
      description: "Choose the right assistant for your task. Each is tailored for specific types of questions and assignments.",
      image: "/feature-guide/chatbot-intro.png",
      tips: [
        "Use General AI for most questions and homework help",
        "Code Assistant specializes in programming tasks",
        "Essay Writer helps with planning and writing papers"
      ],
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />
    },
    {
      title: "Ask Your Question",
      description: "Type your question clearly or upload relevant files for context. Be specific to get the best answers.",
      image: "/feature-guide/chatbot-question.png",
      tips: [
        "Include all relevant information in your question",
        "Use proper formatting for math equations",
        "Upload images or PDFs for complex problems"
      ],
      icon: <FileQuestion className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Customize Your Results",
      description: "Use the settings panel to adjust the detail level, format, and style of responses.",
      image: "/feature-guide/chatbot-settings.png",
      tips: [
        "Set detail level based on your needs",
        "Choose formats like bullet points or paragraphs",
        "Adjust tone for academic or conversational style"
      ],
      icon: <Settings className="h-6 w-6 text-purple-500" />
    },
    {
      title: "Save & Export",
      description: "Download answers, save to your library, or continue the conversation with follow-up questions.",
      image: "/feature-guide/chatbot-export.png",
      tips: [
        "Download responses as PDF, Word, or markdown",
        "Save important answers to your Study Library",
        "Continue the conversation with follow-up questions"
      ],
      icon: <Download className="h-6 w-6 text-green-500" />
    }
  ];
  
  const currentSlide = slides[step - 1];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">AI Chatbot Feature Guide</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-0 flex flex-col md:flex-row">
              {/* Image section */}
              <div className="md:w-1/2 bg-gray-100 dark:bg-gray-700 relative flex items-center justify-center p-4">
                <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                  {currentSlide.icon}
                </div>
                
                {/* Placeholder for actual images */}
                <div className="aspect-video w-full bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Screenshot: {currentSlide.title}
                  </p>
                </div>
              </div>
              
              {/* Text content */}
              <div className="md:w-1/2 p-6 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {step}. {currentSlide.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {currentSlide.description}
                  </p>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tips:
                  </h4>
                  <ul className="space-y-2 mb-8">
                    {currentSlide.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <ThumbsUp className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Progress indicators */}
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-1">
                      {Array.from({ length: totalSteps }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 rounded-full ${i + 1 <= step ? 'bg-blue-600 w-8' : 'bg-gray-300 dark:bg-gray-600 w-4'}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {step} of {totalSteps}
                    </div>
                  </div>
                  
                  {/* Navigation buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      disabled={step === 1}
                      className={`px-4 py-2 rounded-lg flex items-center text-sm ${
                        step === 1
                          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back
                    </button>
                    
                    <button
                      onClick={nextStep}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center text-sm hover:from-blue-700 hover:to-purple-700"
                    >
                      {step === totalSteps ? 'Finish' : 'Next'}
                      {step !== totalSteps && <ChevronRight className="h-4 w-4 ml-1" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 