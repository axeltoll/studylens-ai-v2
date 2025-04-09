"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";

interface QuizModeToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function QuizModeToggle({ isEnabled, onToggle }: QuizModeToggleProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        className="inline-flex p-1.5 rounded text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="What is Quiz Mode?"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg p-3 text-xs border border-gray-200 dark:border-gray-700 z-10">
          <p className="font-medium mb-1 text-gray-900 dark:text-white">
            Think before responding & include academic sources
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Quiz Mode helps you learn by encouraging critical thinking. The AI will pause 
            before revealing answers and provide academic sources when available.
          </p>
          <div className="absolute -bottom-2 left-3 w-4 h-4 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 transform rotate-45"></div>
        </div>
      )}
      
      <label className="inline-flex items-center cursor-pointer">
        <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Quiz Mode
        </span>
        <div className="relative">
          <input 
            type="checkbox" 
            className="sr-only" 
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <div className={`w-10 h-5 rounded-full transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
          <div 
            className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isEnabled ? 'transform translate-x-5' : ''}`}
          ></div>
        </div>
      </label>
    </div>
  );
} 