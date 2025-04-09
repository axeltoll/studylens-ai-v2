"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, Moon, Sun, MessageSquarePlus, BookPlus } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { useTheme } from "@/lib/contexts/ThemeContext";
import UsageIndicator from "./UsageIndicator";

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Handle scroll event to change header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Search for:", searchQuery);
  };

  return (
    <header className={`bg-white dark:bg-gray-900 border-b ${isScrolled ? 'border-gray-200 dark:border-gray-700 shadow-sm' : 'border-transparent'} sticky top-0 z-40 transition-all duration-200`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden -m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Toggle sidebar</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>

            {/* Logo for mobile */}
            <div className="lg:hidden ml-2">
              <Link href="/dashboard">
                <Image
                  src="/images/StudyLens-AI-Logo-V1-Horizontal-396-349-White.png"
                  alt="StudyLens AI Logo"
                  width={140}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
          </div>

          {/* Center - Search bar (hidden on mobile) */}
          <div className="hidden md:block flex-1 max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search documents, flashcards, notes..."
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search button (visible on mobile) */}
            <button 
              type="button" 
              className="md:hidden rounded-full bg-gray-100 dark:bg-gray-800 p-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {/* New Chat Button */}
            <Link 
              href="/dashboard/chatbot/general"
              className="hidden sm:flex items-center space-x-1.5 py-1.5 px-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>New Chat</span>
            </Link>
            
            {/* Create Flashcards Button */}
            <Link 
              href="/dashboard/flashcards/create"
              className="hidden sm:flex items-center space-x-1.5 py-1.5 px-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              <BookPlus className="h-4 w-4" />
              <span>Create Flashcards</span>
            </Link>
            
            {/* Usage Indicator */}
            <UsageIndicator />
            
            {/* Theme toggle */}
            <button 
              type="button" 
              onClick={toggleTheme}
              className="rounded-full bg-gray-100 dark:bg-gray-800 p-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {/* Notifications dropdown */}
            <NotificationsDropdown />
            
            {/* Profile dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on mobile menu state */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 py-3">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="search"
                name="mobile-search"
                id="mobile-search"
                placeholder="Search..."
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            {/* Mobile action buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Link 
                href="/dashboard/chatbot/general" 
                className="flex items-center justify-center py-2 px-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageSquarePlus className="h-4 w-4 mr-1.5" />
                New Chat
              </Link>
              
              <Link 
                href="/dashboard/flashcards/create" 
                className="flex items-center justify-center py-2 px-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookPlus className="h-4 w-4 mr-1.5" />
                Create Flashcards
              </Link>
            </div>
            
            {/* Mobile navigation links */}
            <Link 
              href="/dashboard" 
              className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/library" 
              className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Library
            </Link>
            <Link 
              href="/dashboard/flashcards" 
              className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Flashcards
            </Link>
            <Link 
              href="/dashboard/quizzes" 
              className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Quizzes
            </Link>
            <Link 
              href="/dashboard/study-plans" 
              className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Study Plans
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 