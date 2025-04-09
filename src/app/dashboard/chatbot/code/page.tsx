"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  MoreHorizontal, 
  User, 
  Code as CodeIcon,
  Image as ImageIcon,
  FileUp,
  Copy,
  Check
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatHistory from "@/app/components/ChatHistory";
import { useSearchParams } from "next/navigation";

// Sample prebuilt coding questions
const PREBUILT_QUESTIONS = [
  "Create a React component that fetches data from an API",
  "How do I implement a binary search tree in Python?",
  "Write a function to find the largest number in an array in JavaScript",
  "Explain the difference between let, const, and var in JavaScript",
  "Help me understand async/await in JavaScript",
  "How do I create a responsive grid layout with CSS Grid?"
];

export default function CodeAssistantPage() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
    language?: string;
  }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    // Automatically submit the question
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
      // Call the AI API
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: submittedText,
          context: "code"
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }
      
      // Get the AI response
      const data = await response.json();
      
      // Parse the response to identify code blocks
      let responseContent = data.content || data.text || "I'm not sure how to answer that right now.";
      
      // Add AI response
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "ai" as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      console.error('Error fetching AI response:', err);
      
      // Display a more specific error message if available
      const errorMessage = err.message && err.message !== 'Failed to get AI response' 
        ? err.message 
        : "I'm having trouble processing your request right now. Please try again later.";
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handling copy functionality
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
  
  // Updated message rendering with enhanced Markdown support
  const renderMessage = (message: any) => {
    if (message.sender === 'user') {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }
    
    // Use the existing code block rendering logic with ReactMarkdown
    return (
      <div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                
                if (!isInline && match) {
                  return (
                    <div className="my-2 overflow-x-auto">
                      <div className="bg-gray-900 rounded-t-md px-4 py-2 text-xs text-gray-200 flex justify-between items-center">
                        <span>{match[1]}</span>
                      </div>
                      <pre className="p-4 bg-gray-900 rounded-b-md text-gray-100 text-sm overflow-x-auto">
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    </div>
                  );
                }
                
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
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
        content: `File uploaded: ${files[0].name}. I'll analyze this code.`,
        sender: "ai" as const,
        timestamp: new Date()
      }]);
    }
  };
  
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat History Sidebar - 1/4 width on larger screens */}
      <div className="hidden md:block w-80 h-full">
        <ChatHistory activeChatId={chatId || undefined} chatType="code" />
      </div>
      
      {/* Main Chat Area - 3/4 width on larger screens */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <CodeIcon className="h-5 w-5 mr-2 text-green-500" />
              Code Assistant
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get help with coding, debugging, and implementation
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Chat messages - scrollable and should take available space */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center pt-12">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4">
                <CodeIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Code Assistant
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                Ask me to write code, debug issues, or explain programming concepts.
              </p>
              
              {/* Pre-built questions */}
              <div className="w-full max-w-2xl mx-auto">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
                      ? 'bg-green-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-start mb-1">
                    <div className={`rounded-full p-1 mr-2 ${
                      message.sender === 'user' 
                        ? 'bg-green-500' 
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}>
                      {message.sender === 'user' 
                        ? <User className="h-3 w-3 text-white" /> 
                        : <CodeIcon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                      }
                    </div>
                    <span className="text-xs opacity-70">
                      {message.sender === 'user' ? 'You' : 'Code Assistant'}
                    </span>
                  </div>
                  {renderMessage(message)}
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
                    <CodeIcon className="h-3 w-3 text-red-600 dark:text-red-300" />
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-400">Code Assistant</span>
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
              placeholder="Ask coding questions or paste code..."
              className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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