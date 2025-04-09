"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Extract the main content and modals by checking if children is an array
  const mainContent = Array.isArray(children) ? children[0] : children;
  const modals = Array.isArray(children) ? children.slice(1) : null;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Mobile sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar />
        </div>
        
        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <Sidebar />
        </div>
        
        {/* Main content */}
        <div className="lg:pl-72">
          <DashboardHeader />
          
          <main className="py-6 px-4 sm:px-6 lg:px-8">
            {mainContent}
          </main>
        </div>
        
        {/* Modal content - will be positioned over the main content */}
        {modals}
      </div>
    </ThemeProvider>
  );
}