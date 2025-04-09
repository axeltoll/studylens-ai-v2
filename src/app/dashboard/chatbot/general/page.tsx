"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  MoreHorizontal, 
  User, 
  Bot,
  Image as ImageIcon,
  Lightbulb,
  FileUp,
  Copy,
  Check
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import QuizModeToggle from "@/app/components/QuizModeToggle";
import ChatHistory from "@/app/components/ChatHistory";
import { useSearchParams } from "next/navigation";

// Sample prebuilt questions for the user to try
const PREBUILT_QUESTIONS = [
  "Give me a quiz for my Senior Year Biology Exam",
  "Explain the theory of relativity in simple terms",
  "Help me prepare for my History test on World War II",
  "Give me a step-by-step solution to this calculus problem: Find the derivative of f(x) = x^3 + 5x^2 - 2x + 7",
  "Write a thesis statement for an essay about climate change",
  "Create study notes on photosynthesis with key points"
];

export default function GeneralChatbotPage() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
    isPlaceholder?: boolean;
  }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quizModeEnabled, setQuizModeEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, "none" | "formatted" | "plain">>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chat');
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle prebuilt question click
  const handlePrebuiltQuestionClick = (question: string) => {
    setInput(question);
    // Optional: automatically submit the question
    handleSubmit(question);
  };
  
  // Handle form submission
  const handleSubmit = async (questionText?: string) => {
    const submittedText = questionText || input;
    
    if (!submittedText.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: submittedText,
      sender: "user" as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
    
    try {
      // Add AI "thinking" placeholder message immediately
      const placeholderId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: placeholderId,
        content: "Thinking...",
        sender: "ai" as const,
        isPlaceholder: true,
        timestamp: new Date()
      }]);
      
      // Call the AI API with timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      // Call the AI API
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: submittedText,
          quizMode: quizModeEnabled
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }
      
      // Get the AI response
      const data = await response.json();
      
      // Format response based on quiz mode
      let responseContent = data.content || data.text || "I'm not sure how to answer that right now.";
      
      if (quizModeEnabled) {
        responseContent = `Based on academic sources:\n\n${responseContent}\n\nRemember to think critically about this answer and verify it with your own research.`;
      }
      
      // Replace placeholder with actual AI response
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId ? {
          id: placeholderId,
          content: responseContent,
          sender: "ai" as const,
          timestamp: new Date()
        } : msg
      ));
    } catch (err: any) {
      console.error('Error fetching AI response:', err);
      
      // Display a more specific error message if available
      let errorMessage = "I'm having trouble processing your request right now. Please try again later.";
      
      if (err.name === "AbortError") {
        errorMessage = "The request took too long to complete. This could be due to high server load or connection issues.";
      } else if (err.message && err.message !== 'Failed to get AI response') {
        errorMessage = err.message;
      }
      
      // Remove placeholder message and set error
      setMessages(prev => prev.filter(msg => !msg.isPlaceholder));
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Process the file (in a real app, this would upload and process the file)
      console.log("File selected:", files[0].name);
      // Reset the input
      e.target.value = "";
      
      // Notify the user
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: `File uploaded: ${files[0].name}. This feature is currently in development.`,
        sender: "ai" as const,
        timestamp: new Date()
      }]);
    }
  };
  
  // New function for handling copy
  const handleCopy = (messageId: string, content: string, withFormatting: boolean) => {
    if (withFormatting) {
      navigator.clipboard.writeText(content);
      setCopiedStates(prev => ({ ...prev, [messageId]: "formatted" }));
    } else {
      // Strip markdown for plain text
      const plainText = content
        .replace(/#{1,6}\s?/g, '') // Remove headings
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '') // Remove italic
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)') // Convert links
        .replace(/```[\s\S]*?```/g, (match) => {
          // Extract code without the backticks and language
          return match.replace(/```(?:\w+)?\n([\s\S]*?)```/g, '$1');
        })
        .replace(/`([^`]+)`/g, '$1') // Remove inline code
        .replace(/- /g, '• ') // Convert list items
        .replace(/\n{2,}/g, '\n\n'); // Normalize line breaks
      
      navigator.clipboard.writeText(plainText);
      setCopiedStates(prev => ({ ...prev, [messageId]: "plain" }));
    }
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [messageId]: "none" }));
    }, 2000);
  };
  
  // Updated message rendering
  const renderMessageContent = (message: any) => {
    if (message.sender === 'user') {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }
    
    return (
      <div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
        
        {/* Copy buttons */}
        <div className="flex mt-3 space-x-2 justify-end">
          <button
            onClick={() => handleCopy(message.id, message.content, true)}
            className="flex items-center text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {copiedStates[message.id] === "formatted" ? (
              <><Check className="h-3 w-3 mr-1" /> Copied</>
            ) : (
              <><Copy className="h-3 w-3 mr-1" /> Copy with Formatting</>
            )}
          </button>
          <button
            onClick={() => handleCopy(message.id, message.content, false)}
            className="flex items-center text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {copiedStates[message.id] === "plain" ? (
              <><Check className="h-3 w-3 mr-1" /> Copied</>
            ) : (
              <><Copy className="h-3 w-3 mr-1" /> Copy without Formatting</>
            )}
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat History Sidebar - 1/4 width on larger screens */}
      <div className="hidden md:block w-80 h-full">
        <ChatHistory activeChatId={chatId || undefined} chatType="general" />
      </div>
      
      {/* Main Chat Area - 3/4 width on larger screens */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Bot className="h-5 w-5 mr-2 text-purple-500" />
              General Assistant
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask me anything about your homework or studies
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <QuizModeToggle 
              isEnabled={quizModeEnabled} 
              onToggle={() => setQuizModeEnabled(!quizModeEnabled)} 
            />
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Chat messages - scrollable and should take available space */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center pt-12">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
                <Bot className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                How can I help with your homework?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                Ask me anything about your assignments, I can help solve problems, explain concepts, and more.
              </p>
              
              {/* Pre-built questions */}
              <div className="w-full max-w-2xl mx-auto">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                  Try asking one of these questions:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PREBUILT_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      className="text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
                      onClick={() => handlePrebuiltQuestionClick(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-start mb-1">
                    <div className={`rounded-full p-1 mr-2 ${
                      message.sender === 'user' 
                        ? 'bg-purple-500' 
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}>
                      {message.sender === 'user' 
                        ? <User className="h-3 w-3 text-white" /> 
                        : <Bot className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                      }
                    </div>
                    <span className="text-xs opacity-70">
                      {message.sender === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                  </div>
                  {renderMessageContent(message)}
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-start">
              <div className="bg-red-100 dark:bg-red-900/20 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                <div className="flex items-start mb-1">
                  <div className="rounded-full p-1 mr-2 bg-red-300 dark:bg-red-800">
                    <Bot className="h-3 w-3 text-red-600 dark:text-red-300" />
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-400">AI Assistant</span>
                </div>
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input - fixed at the bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 absolute bottom-0 left-0 right-0 ml-80">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex gap-2">
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <button
              type="button"
              onClick={handleFileUpload}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 