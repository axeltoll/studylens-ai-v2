"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Brain, Code, FileText, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import FeatureGuidePopup from "@/app/components/FeatureGuidePopup";

export default function ChatbotPage() {
  const router = useRouter();
  const [showFeatureGuide, setShowFeatureGuide] = useState(false);
  
  const features = [
    {
      id: "general",
      title: "General AI Assistant",
      icon: <Brain className="h-8 w-8 text-white" />,
      description: "Ask any question and get accurate answers for homework, research and studying.",
      benefits: [
        "Step-by-step explanations for any subject",
        "Clear answers to complex questions",
        "Support for math, science, and humanities"
      ],
      color: "bg-purple-600",
      href: "/dashboard/chatbot/general",
      image: "/images/general-assistant.png"
    },
    {
      id: "code",
      title: "Code Assistant",
      icon: <Code className="h-8 w-8 text-white" />,
      description: "Get help with coding assignments, debugging, and learning programming concepts.",
      benefits: [
        "Support for 20+ programming languages",
        "Code optimization and debugging",
        "Explanations of computer science concepts"
      ],
      color: "bg-green-600",
      href: "/dashboard/chatbot/code",
      image: "/images/code-assistant.png"
    },
    {
      id: "essay",
      title: "Essay Writer",
      icon: <FileText className="h-8 w-8 text-white" />,
      description: "Create well-structured essays with proper citations, outlines, and formatting.",
      benefits: [
        "Essay planning and outline generation",
        "Grammar and style improvements",
        "Citation formatting in APA, MLA, and more"
      ],
      color: "bg-red-600",
      href: "/dashboard/chatbot/essay",
      image: "/images/essay-writer.png"
    }
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Feature Guide Popup */}
      <FeatureGuidePopup 
        isOpen={showFeatureGuide}
        onClose={() => setShowFeatureGuide(false)}
      />
      
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI Study Assistants
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our specialized AI assistants are designed to help with different aspects of your studies.
            Select the one that matches your current needs.
          </p>
        </motion.div>
      </div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            variants={item}
            className="rounded-xl shadow-xl overflow-hidden flex flex-col bg-white dark:bg-gray-800 hover:shadow-2xl transition-shadow duration-300"
            style={{ boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}
          >
            <div className={`${feature.color} p-6 relative h-64 overflow-hidden`}>
              <div className="absolute bottom-0 right-0 w-full h-full opacity-20">
                <Image 
                  src={feature.image} 
                  alt={feature.title}
                  width={300}
                  height={300}
                  className="object-cover object-right-bottom"
                />
              </div>
              <div className="relative z-10">
                <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h2>
                <p className="text-white/90 text-lg mb-4">
                  {feature.description}
                </p>
              </div>
            </div>
            
            <div className="p-6 flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Features:
              </h3>
              <ul className="space-y-3 mb-8">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className={`h-5 w-5 rounded-full ${feature.color} flex-shrink-0 flex items-center justify-center mr-3 mt-0.5`}>
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href={feature.href}
                className={`w-full inline-flex items-center justify-center rounded-lg px-5 py-3 text-base font-medium text-white ${feature.color} hover:opacity-90 transition-all duration-200`}
              >
                Start Using
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Usage Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-lg"
        style={{ boxShadow: '0 0 15px rgba(0,0,0,0.05)' }}
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          <span className="font-medium">Free plan:</span> 5 prompts per 24 hours across all features
        </p>
        <button 
          onClick={() => setShowFeatureGuide(true)}
          className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
        >
          View Feature Guide
        </button>
      </motion.div>
    </div>
  );
}