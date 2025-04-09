"use client";

import { useUsage } from "@/lib/contexts/UsageContext";
import { MessageSquare, Info, Clock } from "lucide-react";
import { useState } from "react";

export default function UsageIndicator() {
  const { 
    promptsRemaining, totalPrompts, isProUser, isTrialUser, 
    trialEndDate, trialTimeLeft 
  } = useUsage();
  const [showDetails, setShowDetails] = useState(false);
  
  // Handle infinity symbol for Pro users
  const infinitySymbol = "∞";
  
  // Get formatted display for remaining time
  const getFormattedTimeLeft = () => {
    if (!trialTimeLeft) return "0 days";
    
    if (trialTimeLeft.days > 0) {
      return `${trialTimeLeft.days} day${trialTimeLeft.days !== 1 ? 's' : ''}`;
    }
    
    if (trialTimeLeft.hours > 0) {
      return `${trialTimeLeft.hours} hour${trialTimeLeft.hours !== 1 ? 's' : ''}`;
    }
    
    return `${trialTimeLeft.minutes} minute${trialTimeLeft.minutes !== 1 ? 's' : ''}`;
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-1 py-1.5 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-gray-800 dark:text-white">
          {isProUser ? infinitySymbol : promptsRemaining}/{isProUser ? infinitySymbol : totalPrompts}
        </span>
      </button>
      
      {showDetails && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
          <div className="flex items-start mb-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Usage Information</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {isProUser 
                  ? "Pro account" 
                  : isTrialUser 
                    ? "Trial account" 
                    : "Free account"}
              </p>
            </div>
          </div>
          
          {isProUser ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Unlimited AI prompts available
              </div>
            </div>
          ) : isTrialUser ? (
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Trial Period</span>
                  <span className="font-medium text-gray-900 dark:text-white">{getFormattedTimeLeft()} left</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ 
                      width: `${trialTimeLeft 
                        ? Math.min(100, ((trialTimeLeft.days * 24 + trialTimeLeft.hours) / (3 * 24)) * 100) 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Trial Prompts</span>
                  <span className="font-medium text-gray-900 dark:text-white">{promptsRemaining}/{totalPrompts}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${promptsRemaining === 0 ? 'bg-gray-500' : 'bg-blue-600'}`}
                    style={{ width: `${(promptsRemaining / totalPrompts) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <button
                className="mt-2 w-full text-center text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg py-1.5 hover:opacity-90 transition-opacity"
              >
                Upgrade to Pro
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Weekly Prompts</span>
                  <span className="font-medium text-gray-900 dark:text-white">{promptsRemaining}/{totalPrompts}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${promptsRemaining === 0 ? 'bg-gray-500' : 'bg-blue-600'}`}
                    style={{ width: `${(promptsRemaining / totalPrompts) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Prompts reset every week
              </div>
              
              <div className="flex items-center mt-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-xs">Get 10 prompts with a free trial</span>
              </div>
              
              <button
                className="mt-2 w-full text-center text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg py-1.5 hover:opacity-90 transition-opacity"
              >
                Start Free Trial
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 