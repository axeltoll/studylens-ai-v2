"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

interface UsageContextType {
  promptsRemaining: number;
  totalPrompts: number;
  isProUser: boolean;
  isTrialUser: boolean;
  trialEndDate: Date | null;
  usePrompt: () => boolean;
  resetPrompts: () => void;
  startTrial: () => Date | undefined;
  trialTimeLeft: {
    days: number;
    hours: number;
    minutes: number;
  } | null;
}

const UsageContext = createContext<UsageContextType>({
  promptsRemaining: 5,
  totalPrompts: 5,
  isProUser: false,
  isTrialUser: false,
  trialEndDate: null,
  usePrompt: () => false,
  resetPrompts: () => {},
  startTrial: () => undefined,
  trialTimeLeft: null,
});

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const [promptsRemaining, setPromptsRemaining] = useState(5);
  const [totalPrompts, setTotalPrompts] = useState(5);
  const [isProUser, setIsProUser] = useState(false);
  const [isTrialUser, setIsTrialUser] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  const [lastResetDay, setLastResetDay] = useState<string>("");
  const [trialTimeLeft, setTrialTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);
  
  const { user } = useAuth();
  
  // Calculate remaining trial time
  const calculateTrialTimeLeft = () => {
    if (!trialEndDate) return null;
    
    const now = new Date();
    const diff = trialEndDate.getTime() - now.getTime();
    
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };
  
  // Update trial time left every minute
  useEffect(() => {
    if (!trialEndDate) return;
    
    const updateTrialTime = () => {
      setTrialTimeLeft(calculateTrialTimeLeft());
    };
    
    updateTrialTime();
    const interval = setInterval(updateTrialTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [trialEndDate]);
  
  // Load usage data from localStorage
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from Firestore/API
      const storedPromptsRemaining = localStorage.getItem(`${user.uid}_promptsRemaining`);
      const storedLastResetDay = localStorage.getItem(`${user.uid}_lastResetDay`);
      const storedIsProUser = localStorage.getItem(`${user.uid}_isProUser`);
      const storedIsTrialUser = localStorage.getItem(`${user.uid}_isTrialUser`);
      const storedTrialEndDate = localStorage.getItem(`${user.uid}_trialEndDate`);
      
      // Check if we need to reset prompts (new day)
      const today = new Date().toDateString();
      const userIsTrialOrPro = storedIsProUser === 'true' || storedIsTrialUser === 'true';
      
      if (storedLastResetDay !== today && !userIsTrialOrPro) {
        // Check if a week has passed for free users (weekly reset)
        const lastResetDate = storedLastResetDay ? new Date(storedLastResetDay) : null;
        const now = new Date();
        
        // If no previous reset or it's been at least 7 days, reset prompts for free users
        if (!lastResetDate || (now.getTime() - lastResetDate.getTime()) >= 7 * 24 * 60 * 60 * 1000) {
          setPromptsRemaining(5); // Reset to 5 prompts for free users
          setLastResetDay(today);
          localStorage.setItem(`${user.uid}_promptsRemaining`, '5');
          localStorage.setItem(`${user.uid}_lastResetDay`, today);
        } else if (storedPromptsRemaining) {
          setPromptsRemaining(parseInt(storedPromptsRemaining, 10));
          setLastResetDay(storedLastResetDay || today);
        }
      } else if (storedPromptsRemaining) {
        setPromptsRemaining(parseInt(storedPromptsRemaining, 10));
        setLastResetDay(storedLastResetDay || today);
      }
      
      // Set user type
      if (storedIsProUser === 'true') {
        setIsProUser(true);
        setPromptsRemaining(Infinity);
        setTotalPrompts(Infinity);
      } else if (storedIsTrialUser === 'true') {
        setIsTrialUser(true);
        setPromptsRemaining(parseInt(storedPromptsRemaining || '10', 10));
        setTotalPrompts(10);
      } else {
        // Free user
        setTotalPrompts(5);
      }
      
      // Set trial end date
      if (storedTrialEndDate) {
        const endDate = new Date(storedTrialEndDate);
        setTrialEndDate(endDate);
        setTrialTimeLeft(calculateTrialTimeLeft());
      } else if (storedIsTrialUser === 'true' && !storedTrialEndDate) {
        // For new trial users, set 3-day trial
        const threeFromNow = new Date();
        threeFromNow.setDate(threeFromNow.getDate() + 3);
        setTrialEndDate(threeFromNow);
        localStorage.setItem(`${user.uid}_trialEndDate`, threeFromNow.toISOString());
        setTrialTimeLeft(calculateTrialTimeLeft());
      }
    }
  }, [user]);
  
  // Check if trial has ended
  useEffect(() => {
    if (trialEndDate && (isProUser || isTrialUser)) {
      const now = new Date();
      if (now > trialEndDate) {
        if (isTrialUser) {
          // Trial ended, convert to free user
          setIsTrialUser(false);
          setPromptsRemaining(5);
          setTotalPrompts(5);
          localStorage.setItem(`${user?.uid || 'guest'}_isTrialUser`, 'false');
        }
        
        if (isProUser && !localStorage.getItem(`${user?.uid || 'guest'}_paidUser`)) {
          // Trial Pro ended and not a paid user
          setIsProUser(false);
          setPromptsRemaining(5);
          setTotalPrompts(5);
          localStorage.setItem(`${user?.uid || 'guest'}_isProUser`, 'false');
        }
      }
    }
  }, [trialEndDate, isProUser, isTrialUser, user]);
  
  const usePrompt = () => {
    if (isProUser) {
      return true; // Pro users have unlimited prompts
    }
    
    if (promptsRemaining <= 0) {
      return false; // No prompts left
    }
    
    const newPromptsRemaining = promptsRemaining - 1;
    setPromptsRemaining(newPromptsRemaining);
    
    if (user) {
      localStorage.setItem(`${user.uid}_promptsRemaining`, newPromptsRemaining.toString());
    }
    
    return true;
  };
  
  const resetPrompts = () => {
    const resetAmount = isProUser ? Infinity : 5;
    setPromptsRemaining(resetAmount);
    
    const today = new Date().toDateString();
    setLastResetDay(today);
    
    if (user) {
      localStorage.setItem(`${user.uid}_promptsRemaining`, resetAmount.toString());
      localStorage.setItem(`${user.uid}_lastResetDay`, today);
    }
  };
  
  // Start a 3-day trial
  const startTrial = () => {
    if (!user) return;
    
    const threeFromNow = new Date();
    threeFromNow.setDate(threeFromNow.getDate() + 3);
    
    setIsTrialUser(true);
    setTrialEndDate(threeFromNow);
    setPromptsRemaining(10);
    setTotalPrompts(10);
    
    localStorage.setItem(`${user.uid}_isTrialUser`, 'true');
    localStorage.setItem(`${user.uid}_trialEndDate`, threeFromNow.toISOString());
    localStorage.setItem(`${user.uid}_promptsRemaining`, '10');
    
    setTrialTimeLeft(calculateTrialTimeLeft());
    
    return threeFromNow;
  };
  
  return (
    <UsageContext.Provider
      value={{
        promptsRemaining,
        totalPrompts,
        isProUser,
        isTrialUser,
        trialEndDate,
        usePrompt,
        resetPrompts,
        startTrial,
        trialTimeLeft,
      }}
    >
      {children}
    </UsageContext.Provider>
  );
}

export const useUsage = () => useContext(UsageContext); 