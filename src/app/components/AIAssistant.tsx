"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { 
  Send, 
  Loader2, 
  RotateCcw, 
  Copy, 
  Check, 
  FileText, 
  Brain, 
  List, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

interface AIAssistantProps {
  defaultContent?: string;
  defaultAction?: string;
  defaultSubject?: string;
}

type ActionType = "summarize" | "flashcards" | "quiz" | "answer_question" | "explain_concept" | "study_plan";

export default function AIAssistant({ 
  defaultContent = "", 
  defaultAction = "summarize",
  defaultSubject = ""
}: AIAssistantProps) {
  const [content, setContent] = useState(defaultContent);
  const [action, setAction] = useState<ActionType>(defaultAction as ActionType);
  const [subject, setSubject] = useState(defaultSubject);
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPromptPanel, setShowPromptPanel] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, input, setInput, handleSubmit, isLoading, setMessages, error } = useChat({
    api: "/api/ai-assistant",
    body: {
      content,
      action,
      subject,
      options: getOptionsForAction(action),
    },
    onResponse: () => {
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("Error in AI Assistant:", error);
      setIsSubmitting(false);
    }
  });
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  function getOptionsForAction(actionType: ActionType) {
    switch (actionType) {
      case "flashcards":
        return { numCards: 10 };
      case "quiz":
        return { numQuestions: 5, questionTypes: ["multiple_choice", "true_false"] };
      case "answer_question":
        return { question: input };
      case "explain_concept":
        return { concept: input };
      case "study_plan":
        return { duration: "1 week", studyGoal: "Master the content" };
      default:
        return {};
    }
  }
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || !content.trim()) return;
    
    setIsSubmitting(true);
    
    if (action === "answer_question" || action === "explain_concept") {
      if (!input.trim()) {
        setIsSubmitting(false);
        return;
      }
    }
    
    handleSubmit(e);
  };
  
  const resetAssistant = () => {
    setMessages([]);
    setContent("");
    setInput("");
    setAction("summarize");
    setSubject("");
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleActionChange = (newAction: ActionType) => {
    setAction(newAction);
    setShowOptions(false);
  };
  
  const getActionIcon = (actionType: ActionType) => {
    switch (actionType) {
      case "summarize":
        return <FileText className="h-4 w-4" />;
      case "flashcards":
        return <List className="h-4 w-4" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4" />;
      case "study_plan":
        return <FileText className="h-4 w-4" />;
      case "answer_question":
        return <HelpCircle className="h-4 w-4" />;
      case "explain_concept":
        return <Brain className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };
  
  const getActionLabel = (actionType: ActionType) => {
    switch (actionType) {
      case "summarize":
        return "Summarize";
      case "flashcards":
        return "Generate Flashcards";
      case "quiz":
        return "Create Quiz";
      case "study_plan":
        return "Create Study Plan";
      case "answer_question":
        return "Answer Question";
      case "explain_concept":
        return "Explain Concept";
      default:
        return "AI Assistant";
    }
  };
  
  return (
    <div className="flex flex-col h-full max-h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-100" />
            <h2 className="font-semibold text-lg">StudyLens AI Assistant</h2>
          </div>
          <button 
            onClick={resetAssistant}
            className="p-2 hover:bg-blue-500 rounded-full transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toggle prompt panel button */}
        <button
          onClick={() => setShowPromptPanel(!showPromptPanel)}
          className="flex items-center justify-center py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {showPromptPanel ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {/* Prompt panel */}
        <AnimatePresence>
          {showPromptPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-gray-200 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Content input */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your text, notes, or content here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none min-h-[100px]"
                    rows={4}
                  />
                </div>
                
                {/* Action and Subject inputs */}
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
                      Action
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowOptions(!showOptions)}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <span className="flex items-center">
                          {getActionIcon(action)}
                          <span className="ml-2">{getActionLabel(action)}</span>
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </button>
                      
                      {showOptions && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                          <ul className="py-1">
                            {["summarize", "flashcards", "quiz", "study_plan", "answer_question", "explain_concept"].map((actionOption) => (
                              <li key={actionOption}>
                                <button
                                  type="button"
                                  onClick={() => handleActionChange(actionOption as ActionType)}
                                  className={`w-full flex items-center px-4 py-2 text-sm ${
                                    action === actionOption ? "bg-blue-100 text-blue-900" : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {getActionIcon(actionOption as ActionType)}
                                  <span className="ml-2">{getActionLabel(actionOption as ActionType)}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-1/2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject (Optional)
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Biology, Mathematics, History"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600 max-w-md">
                Enter your content and choose an action to get started. I can summarize text,
                create flashcards, generate quizzes, and more to help you study effectively.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-3 max-w-[80%] shadow-sm ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div>
                        <ReactMarkdown
                          className="prose prose-sm max-w-none"
                          components={{
                            p: ({ children }) => <p className="mb-2">{children}</p>,
                            h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-md font-bold mb-1 mt-2">{children}</h3>,
                            ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => copyToClipboard(message.content)}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
                            title="Copy to clipboard"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
      
      {/* Input form */}
      <form onSubmit={handleFormSubmit} className="p-4 border-t border-gray-200 bg-white">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            <strong>Error:</strong> {error.toString()}
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              action === "answer_question"
                ? "Ask a question about the content..."
                : action === "explain_concept"
                ? "Enter a concept to explain..."
                : "Type a message..."
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading || isSubmitting}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 