"use client";

import { useState, useEffect, useRef } from "react";
import { 
  User, 
  Settings, 
  HelpCircle, 
  BookOpen, 
  LogOut, 
  Bell,
  CreditCard,
  Heart,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect will be handled by the AuthContext
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Default avatar if user has no profile picture
  const avatarUrl = user?.photoURL || "/avatar-placeholder.png";
  const userEmail = user?.email || "user@example.com";
  const displayName = user?.displayName || userEmail.split("@")[0];
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button 
        className="flex items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200">
          <Image 
            src={avatarUrl} 
            alt="User avatar" 
            width={32} 
            height={32}
            className="h-full w-full object-cover"
          />
        </div>
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 overflow-hidden">
          {/* User info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                <Image 
                  src={avatarUrl} 
                  alt="User avatar" 
                  width={40} 
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{displayName}</h3>
                <p className="text-xs text-gray-500 truncate max-w-[180px]">{userEmail}</p>
              </div>
            </div>
          </div>
          
          {/* Menu items */}
          <div className="py-1">
            <Link 
              href="/dashboard/profile" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 mr-3 text-gray-500" />
              <span>Your Profile</span>
            </Link>
            
            <Link 
              href="/dashboard/settings" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 mr-3 text-gray-500" />
              <span>Settings</span>
            </Link>
            
            <Link 
              href="/dashboard/billing" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="h-4 w-4 mr-3 text-gray-500" />
              <span>Billing</span>
            </Link>
            
            <hr className="my-1 border-gray-200" />
            
            <Link 
              href="/dashboard/integrations" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Bell className="h-4 w-4 mr-3 text-gray-500" />
              <span>Integrations</span>
            </Link>
            
            <Link 
              href="/dashboard/referrals" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <UserPlus className="h-4 w-4 mr-3 text-gray-500" />
              <span>Refer a Friend</span>
              <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">New</span>
            </Link>
            
            <hr className="my-1 border-gray-200" />
            
            <Link 
              href="/help" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="h-4 w-4 mr-3 text-gray-500" />
              <span>Help Center</span>
            </Link>
            
            <Link 
              href="/documentation" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BookOpen className="h-4 w-4 mr-3 text-gray-500" />
              <span>Documentation</span>
            </Link>
            
            <Link 
              href="/feedback" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="h-4 w-4 mr-3 text-gray-500" />
              <span>Give Feedback</span>
            </Link>
            
            <hr className="my-1 border-gray-200" />
            
            <button 
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 