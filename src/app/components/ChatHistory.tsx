"use client";

import { useState, useEffect } from "react";
import { Bot, User, Trash2, Clock, Search } from "lucide-react";
import Link from "next/link";

// Define the chat history item type
interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  date: Date;
  chatType: "general" | "code" | "essay";
}

interface ChatHistoryProps {
  activeChatId?: string;
  chatType: "general" | "code" | "essay";
}

export default function ChatHistory({ activeChatId, chatType }: ChatHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  
  // Load chat history on mount - in a real app, this would come from an API or local storage
  useEffect(() => {
    // Mock data for demonstration purposes
    const mockHistory = [
      {
        id: "chat1",
        title: "Biology Quiz Questions",
        preview: "Give me a quiz for my Senior Year Biology Exam",
        date: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        chatType: "general" as const,
      },
      {
        id: "chat2",
        title: "React Component Help",
        preview: "Help me create a React component that uses hooks",
        date: new Date(Date.now() - 86400000 * 1), // 1 day ago
        chatType: "code" as const,
      },
      {
        id: "chat3",
        title: "Essay on Climate Change",
        preview: "Write an essay outline about climate change impact",
        date: new Date(Date.now() - 86400000 * 2), // 2 days ago
        chatType: "essay" as const,
      },
      {
        id: "chat4",
        title: "Calculus Problem",
        preview: "How do I solve this calculus problem with derivatives?",
        date: new Date(Date.now() - 86400000 * 3), // 3 days ago
        chatType: "general" as const,
      },
    ];
    
    // Filter based on current chat type
    setHistory(mockHistory.filter(item => item.chatType === chatType));
  }, [chatType]);
  
  // Format the date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Filter history based on search term
  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Chat History
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredHistory.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredHistory.map((item) => (
              <Link 
                key={item.id}
                href={`/dashboard/chatbot/${chatType}?chat=${item.id}`}
                className={`block p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  item.id === activeChatId ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-[80%]">
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(item.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {item.preview}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? "No matching chats found" : "No chat history yet"}
            </p>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          className="flex items-center justify-center w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
          onClick={() => {
            // Clear history functionality would go here
            setHistory([]);
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </button>
      </div>
    </div>
  );
} 