"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText,
  Brain,
  Calendar, 
  LineChart, 
  Settings,
  UserPlus,
  Puzzle,
  HelpCircle, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Home,
  MessageSquare,
  Package,
  Users,
  Code,
  PenTool,
  Lightbulb,
  Bot,
  FileQuestion,
  Library,
  History,
  Chrome,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTheme } from "@/lib/contexts/ThemeContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    color: string;
  };
  children?: {
    name: string;
    href: string;
    badge?: {
      text: string;
      color: string;
    };
  }[];
  current?: boolean;
  pro?: boolean;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const { theme } = useTheme();
  
  // Close sidebar on route change (mobile only)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close sidebar when pressing escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Define the navigation items
  const navigation: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: false,
    },
    {
      name: "AI Chatbot",
      href: "/dashboard/chatbot",
      icon: Bot,
      current: false,
      children: [
        { name: "General Assistant", href: "/dashboard/chatbot/general" },
        { name: "Code Assistant", href: "/dashboard/chatbot/code" },
        { name: "Essay Writer", href: "/dashboard/chatbot/essay" },
      ],
    },
    {
      name: "Deep Research",
      href: "/dashboard/deep-research",
      icon: BookOpen,
      current: false,
    },
    {
      name: "Quizzes & Flashcards",
      href: "/dashboard/quizzes-flashcards",
      icon: FileQuestion,
      current: false,
    },
    {
      name: "Study Library & History",
      href: "/dashboard/library",
      icon: Library,
      current: false,
      children: [
        { name: "My Library", href: "/dashboard/library" },
        { name: "Deep Research", href: "/dashboard/library/research" },
        { name: "Chatbot Conversations", href: "/dashboard/library/conversations" },
      ],
    },
    {
      name: "Referral Program",
      href: "/dashboard/referrals",
      icon: Users,
      current: false,
      pro: true,
    },
  ];

  const secondaryNavigation: NavItem[] = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
    { name: "Suggest a Feature", href: "/dashboard/suggest", icon: Lightbulb },
    { 
      name: "Chrome Extension", 
      href: "https://chrome.google.com/webstore/detail/studylens-ai-ace-tests-qu/mdfigkhdcpobdbgccoidpojfhcnbmmkd", 
      icon: Chrome, 
      current: false 
    },
  ];

  // Initialize open submenus based on current path
  useEffect(() => {
    const newOpenSubmenus: Record<string, boolean> = {};
    
    navigation.forEach(item => {
      if (item.children) {
        // Check if current path is in one of the children
        const isActive = item.children.some(child => pathname === child.href);
        // Or if parent route is exactly matched
        const isParentActive = pathname === item.href;
        newOpenSubmenus[item.name] = isActive || isParentActive;
      }
    });
    
    setOpenSubmenus(newOpenSubmenus);
  }, [pathname]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const isActiveGroup = (item: NavItem) => {
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => pathname === child.href);
    }
    return false;
  };

  // Get the appropriate logo based on theme
  const logo = theme === 'dark' 
    ? "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dac9f10fee532eb38351.png" // white logo for dark mode
    : "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1daade06ab05c3cf6a02c.png"; // dark logo for light mode

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-30 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black lg:hidden z-20"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
                <Link href="/dashboard">
                  <div className="h-16 w-auto">
                    <Image
                      src={logo}
                      alt="StudyLens AI"
                      width={240}
                      height={53}
                      className="h-16 w-auto"
                    />
                  </div>
                </Link>
              </div>
              
              <nav className="flex-1 px-4 space-y-6">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    if (item.children) {
                      const isActive = isActiveGroup(item);
                      const isOpen = openSubmenus[item.name];
                      const Icon = item.icon;
                      
                      return (
                        <div key={item.name}>
                          <div
                            className={`
                              w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors
                              ${isActive 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' 
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                              }
                            `}
                          >
                            <Link 
                              href={item.href}
                              className="flex items-center flex-grow"
                            >
                              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                              <span>{item.name}</span>
                              {item.badge && (
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${item.badge.color}`}>
                                  {item.badge.text}
                                </span>
                              )}
                            </Link>
                            <button
                              onClick={() => toggleSubmenu(item.name)}
                              className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              {openSubmenus[item.name] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-10 pr-4 space-y-1 mt-1">
                                  {item.children.map((child) => {
                                    const isChildActive = isActiveLink(child.href);
                                    
                                    return (
                                      <Link
                                        key={child.name}
                                        href={child.href}
                                        className={`
                                          flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                                          ${isChildActive 
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100' 
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                          }
                                        `}
                                      >
                                        {child.name}
                                        {child.badge && (
                                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${child.badge.color}`}>
                                            {child.badge.text}
                                          </span>
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }
                    
                    const isActive = isActiveLink(item.href);
                    const Icon = item.icon;
                    
                    return (
                      <div key={item.name}>
                        <div
                          className={`
                            w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors
                            ${isActive 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' 
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          <Link 
                            href={item.href}
                            className="flex items-center flex-grow"
                          >
                            <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${item.badge.color}`}>
                                {item.badge.text}
                              </span>
                            )}
                          </Link>
                          <button
                            onClick={() => toggleSubmenu(item.name)}
                            className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            {openSubmenus[item.name] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Secondary Navigation (Support section) */}
                <div>
                  <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Support
                  </h3>
                  <div className="mt-2 space-y-1">
                    {secondaryNavigation.map((item) => {
                      const isActive = isActiveLink(item.href);
                      const Icon = item.icon;
                      
                      return (
                        <div key={item.name}>
                          <div
                            className={`
                              w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors
                              ${isActive 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' 
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                              }
                            `}
                          >
                            <Link 
                              href={item.href}
                              className="flex items-center flex-grow"
                            >
                              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                              <span>{item.name}</span>
                            </Link>
                            <button
                              onClick={() => toggleSubmenu(item.name)}
                              className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              {openSubmenus[item.name] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </div>
            
            {/* User section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium"
                onClick={() => console.log('Upgrade to Pro')}
              >
                Upgrade to Pro
              </button>
              <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400 font-medium">Start My 3-Day Free Pro Trial</p>
              <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">$9.95/month after trial (special offer until April 20th when price increases to $14.95)</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="lg:hidden fixed inset-y-0 left-0 z-30 w-64 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
          >
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <div className="h-16 w-auto">
                    <Image
                      src={logo}
                      alt="StudyLens AI"
                      width={240}
                      height={53}
                      className="h-16 w-auto"
                    />
                  </div>
                </Link>
              </div>
              
              <nav className="flex-1 px-4 space-y-6">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    if (item.children) {
                      const isActive = isActiveGroup(item);
                      const isOpen = openSubmenus[item.name];
                      const Icon = item.icon;
                      
                      return (
                        <div key={item.name}>
                          <div
                            className={`
                              w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors
                              ${isActive 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' 
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                              }
                            `}
                          >
                            <Link 
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center flex-grow"
                            >
                              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                              <span>{item.name}</span>
                              {item.badge && (
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${item.badge.color}`}>
                                  {item.badge.text}
                                </span>
                              )}
                            </Link>
                            <button
                              onClick={() => toggleSubmenu(item.name)}
                              className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              {openSubmenus[item.name] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-10 pr-4 space-y-1 mt-1">
                                  {item.children.map((child) => {
                                    const isChildActive = isActiveLink(child.href);
                                    
                                    return (
                                      <Link
                                        key={child.name}
                                        href={child.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                          flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                                          ${isChildActive 
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100' 
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                          }
                                        `}
                                      >
                                        {child.name}
                                        {child.badge && (
                                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${child.badge.color}`}>
                                            {child.badge.text}
                                          </span>
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }
                    
                    const isActive = isActiveLink(item.href);
                    const Icon = item.icon;
                    
                    return (
                      <div key={item.name}>
                        <div
                          className={`
                            w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors
                            ${isActive 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' 
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          <Link 
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center flex-grow"
                          >
                            <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${item.badge.color}`}>
                                {item.badge.text}
                              </span>
                            )}
                          </Link>
                          <button
                            onClick={() => toggleSubmenu(item.name)}
                            className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            {openSubmenus[item.name] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Secondary Navigation (Support section) */}
                <div>
                  <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Support
                  </h3>
                  <div className="mt-2 space-y-1">
                    {secondaryNavigation.map((item) => {
                      const isActive = isActiveLink(item.href);
                      const Icon = item.icon;
                      
                      return (
                        <div key={item.name}>
                          <div
                            className={`
                              w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors
                              ${isActive 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' 
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                              }
                            `}
                          >
                            <Link 
                              href={item.href}
                              className="flex items-center flex-grow"
                            >
                              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                              <span>{item.name}</span>
                            </Link>
                            <button
                              onClick={() => toggleSubmenu(item.name)}
                              className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              {openSubmenus[item.name] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </div>
            
            {/* User section for mobile */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium"
                onClick={() => console.log('Upgrade to Pro')}
              >
                Upgrade to Pro
              </button>
              <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400 font-medium">Start My 3-Day Free Pro Trial</p>
              <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">$9.95/month after trial (special offer until April 20th when price increases to $14.95)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 