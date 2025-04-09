"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import AIAssistant from "@/app/components/AIAssistant";
import { FileText, Brain, BookOpen, HelpCircle, Clock, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function AssistantPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateContent, setTemplateContent] = useState("");
  const [templateAction, setTemplateAction] = useState("summarize");
  const [templateSubject, setTemplateSubject] = useState("");
  
  const handleTemplateSelect = (
    template: string, 
    content: string, 
    action: string = "summarize",
    subject: string = ""
  ) => {
    setSelectedTemplate(template);
    setTemplateContent(content);
    setTemplateAction(action);
    setTemplateSubject(subject);
  };
  
  const templates = [
    {
      id: "essay",
      title: "Essay Writing",
      description: "Get help with structuring, outlining, or revising an essay",
      icon: <FileText className="h-5 w-5" />,
      content: "I need to write a 5-paragraph essay about the impact of technology on society.",
      action: "explain_concept",
    },
    {
      id: "summarize",
      title: "Text Summarization",
      description: "Quickly summarize articles, chapters, or lengthy content",
      icon: <BookOpen className="h-5 w-5" />,
      content: "Paste any text here that you'd like to summarize.",
      action: "summarize",
    },
    {
      id: "concept",
      title: "Concept Explanation",
      description: "Break down complex topics in simpler terms",
      icon: <Brain className="h-5 w-5" />,
      content: "I'm having trouble understanding the concept of photosynthesis.",
      action: "explain_concept",
      subject: "Biology",
    },
    {
      id: "studyplan",
      title: "Study Plan",
      description: "Create personalized study schedules and strategies",
      icon: <Clock className="h-5 w-5" />,
      content: "I need to prepare for my chemistry final exam in 2 weeks.",
      action: "study_plan",
      subject: "Chemistry",
    },
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
        <p className="text-gray-600">
          Get help with studying, writing, problem-solving, and more.
        </p>
      </div>
      
      <Tabs defaultValue="assistant" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="assistant" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Brain className="h-4 w-4 mr-2" />
            Assistant
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Clock className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assistant" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIAssistant 
                defaultContent={templateContent}
                defaultAction={templateAction}
                defaultSubject={templateSubject}
              />
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="bg-blue-100 p-1 rounded-full mr-3 flex-shrink-0">
                      <HelpCircle className="h-4 w-4 text-blue-600" />
                    </span>
                    <span className="text-sm text-gray-600">Be specific with your questions for better results</span>
                  </li>
                  <li className="flex">
                    <span className="bg-blue-100 p-1 rounded-full mr-3 flex-shrink-0">
                      <HelpCircle className="h-4 w-4 text-blue-600" />
                    </span>
                    <span className="text-sm text-gray-600">Choose the right action for your needs</span>
                  </li>
                  <li className="flex">
                    <span className="bg-blue-100 p-1 rounded-full mr-3 flex-shrink-0">
                      <HelpCircle className="h-4 w-4 text-blue-600" />
                    </span>
                    <span className="text-sm text-gray-600">Provide subject information for more relevant responses</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Upload a Document</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Quickly analyze PDFs, Word documents, or images with text.
                </p>
                <button className="flex items-center justify-center w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg py-3 px-4 transition-colors">
                  <Upload className="h-5 w-5 mr-2" />
                  <span>Upload File</span>
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Questions Asked</span>
                      <span className="text-sm font-medium text-gray-900">24/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "24%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Documents Analyzed</span>
                      <span className="text-sm font-medium text-gray-900">3/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {templates.map((template) => (
              <motion.div 
                key={template.id}
                variants={item}
                className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all cursor-pointer ${
                  selectedTemplate === template.id
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleTemplateSelect(
                  template.id,
                  template.content,
                  template.action,
                  template.subject
                )}
              >
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  {template.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </motion.div>
            ))}
            
            <motion.div 
              variants={item}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <div className="bg-white rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Template</h3>
              <p className="text-sm text-gray-600">Design a custom template for frequent tasks</p>
            </motion.div>
          </motion.div>
          
          {selectedTemplate && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
                <h3 className="font-medium mb-2">Selected Template: {templates.find(t => t.id === selectedTemplate)?.title}</h3>
                <p className="text-sm text-blue-100 mb-4">Click "Use Template" to start with this pre-configured assistant.</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const element = document.querySelector('[data-state="inactive"][value="assistant"]') as HTMLButtonElement;
                      if (element) element.click();
                    }}
                    className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Conversations</h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">
                  <option>All Categories</option>
                  <option>Summaries</option>
                  <option>Questions</option>
                  <option>Study Plans</option>
                </select>
                <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>All time</option>
                </select>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="py-4 hover:bg-gray-50 rounded-md transition-colors p-2 cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-1.5 rounded-md mr-3">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">Biology - Photosynthesis Explanation</span>
                    </div>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate ml-9">
                    "I need help understanding the process of photosynthesis and how it works..."
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-center">
              <nav className="flex items-center">
                <button className="px-2 py-1 border border-gray-300 rounded-l-md text-sm">Previous</button>
                <span className="px-4 py-1 border-t border-b border-gray-300 text-sm">Page 1 of 3</span>
                <button className="px-2 py-1 border border-gray-300 rounded-r-md text-sm bg-blue-600 text-white">Next</button>
              </nav>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 