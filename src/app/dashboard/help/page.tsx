"use client";

import { useState } from "react";
import { HelpCircle, Mail, MessageSquare, Search, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function HelpSupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");
  
  // FAQ categories
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "account", name: "Account & Billing" },
    { id: "features", name: "Features & Usage" },
    { id: "technical", name: "Technical Support" },
    { id: "privacy", name: "Privacy & Security" }
  ];
  
  // Sample FAQs
  const faqs: FAQ[] = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login page and click on 'Forgot Password'. Enter your email address and we'll send you instructions to reset your password.",
      category: "account"
    },
    {
      question: "How many questions can I ask with a free account?",
      answer: "Free accounts have access to 5 AI prompts per week. This limit resets every week, allowing you to continue using the basic features of our platform.",
      category: "account"
    },
    {
      question: "What is the difference between Pro and Free accounts?",
      answer: "Pro accounts offer unlimited AI prompts, access to all advanced features including deep research, priority support, and integration with more learning platforms. Free accounts are limited to 5 prompts per week and basic features.",
      category: "account"
    },
    {
      question: "How accurate are the AI answers?",
      answer: "Our AI technology delivers 98% accuracy on homework questions across all major subjects. We continuously improve our models based on user feedback and academic standards to ensure high-quality responses.",
      category: "features"
    },
    {
      question: "Can I use this for college-level courses?",
      answer: "Yes, StudyLens AI supports all academic levels from K-12 to advanced university courses. Our AI is trained on a comprehensive dataset that includes college and graduate-level materials.",
      category: "features"
    },
    {
      question: "How do I upload files for the AI to analyze?",
      answer: "In any AI chat interface, you can click the paperclip icon to upload files. We support various formats including PDF, DOCX, images, and plain text. The AI will then analyze the content and provide appropriate responses based on the uploaded material.",
      category: "features"
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All user data is encrypted both in transit and at rest. We do not sell or share your personal information with third parties. For more details, please review our Privacy Policy.",
      category: "privacy"
    },
    {
      question: "The website is not loading properly. What should I do?",
      answer: "First, try clearing your browser cache and cookies. If the issue persists, try using a different browser or device. If you're still experiencing problems, please contact our support team with details about your device, browser, and specific issues.",
      category: "technical"
    }
  ];
  
  // Filter FAQs based on search term and category
  const filteredFaqs = faqs.filter(faq => 
    (category === "all" || faq.category === category) &&
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
     faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Toggle FAQ expansion
  const toggleFaq = (question: string) => {
    if (expandedFaq === question) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(question);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <HelpCircle className="mr-2 h-6 w-6 text-blue-500" />
          Help & Support
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find answers to your questions or get in touch with our support team
        </p>
      </div>
      
      {/* Search and Category Filter */}
      <div className="mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div 
                key={faq.question} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.question)}
                  className="w-full flex justify-between items-center p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  {expandedFaq === faq.question ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {expandedFaq === faq.question && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No results found for "{searchTerm}". Try a different search term or category.
            </p>
          </div>
        )}
      </div>
      
      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 h-12 w-12 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Email Support
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Get help with account issues, billing questions, or technical problems.
          </p>
          <div className="flex items-center space-x-2">
            <Link
              href="mailto:support@studylens.ai"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              support@studylens.ai
            </Link>
            <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="bg-purple-100 dark:bg-purple-900/30 h-12 w-12 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Live Chat Support
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Chat with our support agents in real-time for immediate assistance.
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-colors">
            Start Live Chat
          </button>
        </div>
      </div>
      
      {/* Knowledge Base Link */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Explore our Knowledge Base
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Browse detailed articles, tutorials, and guides on all features of StudyLens AI.
        </p>
        <Link
          href="/knowledge-base"
          className="inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Visit Knowledge Base
          <ChevronDown className="ml-2 h-5 w-5 rotate-270" />
        </Link>
      </div>
    </div>
  );
} 