"use client";

import { useState, useEffect, useRef } from "react";
import { BellIcon, X } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  link?: string;
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Fetch notifications
    // This would come from an API in a real app
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "PDF Processing Complete",
        description: "Your document 'Introduction to Neural Networks.pdf' has been processed successfully.",
        time: "Just now",
        read: false,
        type: "success",
        link: "/dashboard/library"
      },
      {
        id: "2",
        title: "Flashcards Created",
        description: "20 flashcards have been generated from your Biology 101 document.",
        time: "2 hours ago",
        read: false,
        type: "info",
        link: "/dashboard/library"
      },
      {
        id: "3",
        title: "Study Reminder",
        description: "Your scheduled study session for 'Modern Physics' is starting in 30 minutes.",
        time: "30 minutes ago",
        read: true,
        type: "warning"
      },
      {
        id: "4",
        title: "Welcome to InsightLens AI",
        description: "Get started by uploading your first document or creating a study plan.",
        time: "2 days ago",
        read: true,
        type: "info",
        link: "/dashboard/getting-started"
      }
    ];
    
    setNotifications(mockNotifications);
    
    // Check if there are any unread notifications
    setHasUnread(mockNotifications.some(notification => !notification.read));
  }, []);
  
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
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
    setHasUnread(false);
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    
    // Check if there are still unread notifications
    setHasUnread(notifications.some(notification => !notification.read && notification.id !== id));
  };
  
  const getTypeStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600";
      case "warning":
        return "bg-yellow-100 text-yellow-600";
      case "error":
        return "bg-red-100 text-red-600";
      case "info":
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button 
        className="text-gray-500 hover:text-gray-700 focus:outline-none relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {hasUnread && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {hasUnread && (
              <button 
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex">
                      <div className={`p-2 rounded-full mr-3 ${getTypeStyles(notification.type)}`}>
                        {notification.type === "success" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {notification.type === "warning" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        {notification.type === "error" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        {notification.type === "info" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        {!notification.read && (
                          <button 
                            className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
                            onClick={() => markAsRead(notification.id)}
                            aria-label="Mark as read"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{notification.description}</p>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          {notification.link && (
                            <Link 
                              href={notification.link}
                              className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                              onClick={() => markAsRead(notification.id)}
                            >
                              View
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-200 bg-gray-50 text-center">
            <Link href="/dashboard/notifications" className="text-xs text-blue-600 hover:text-blue-800">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 