"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserLibraryItems } from "@/lib/firebase/firebaseUtils";
import { Loader2, Search, Filter, ChevronRight, Plus } from "lucide-react";
import TrialCheckoutModal from "@/app/components/TrialCheckoutModal";
import { useUsage } from "@/lib/hooks/useUsage";

interface LibraryItem {
  id: string;
  type: string;
  title: string;
  description: string;
  tags: string[];
  timestamp: any;
  cardCount?: number;
  questionCount?: number;
}

export default function Library() {
  const { user, loading: authLoading } = useAuth();
  const { isProUser, isTrialUser } = useUsage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch library items
  useEffect(() => {
    const fetchLibraryItems = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const libraryItems = await getUserLibraryItems(user.uid);
        setItems(libraryItems as LibraryItem[]);
        
        // Extract all unique tags
        const tags = libraryItems.flatMap((item: any) => item.tags || []);
        setAllTags([...new Set(tags)]);
      } catch (error) {
        console.error("Error fetching library items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLibraryItems();
    }
  }, [user]);

  // Show trial modal if needed
  useEffect(() => {
    if (user && !authLoading && !isProUser && !isTrialUser) {
      setShowTrialModal(true);
    }
  }, [user, authLoading, isProUser, isTrialUser]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Filter items based on activeTab, searchTerm, and selectedTags
  const filteredItems = items.filter(item => {
    // Filter by type
    if (activeTab !== "all" && item.type !== activeTab) return false;
    
    // Filter by search term
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Filter by selected tags
    if (selectedTags.length > 0 && !item.tags?.some(tag => selectedTags.includes(tag))) return false;
    
    return true;
  });

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not loading and user is not authenticated, this will render briefly before redirect
  if (!user) {
    return null;
  }

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown date";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Library</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === "all"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Items
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === "summary"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setActiveTab("summary")}
              >
                Summaries
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === "flashcard"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setActiveTab("flashcard")}
              >
                Flashcards
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                  activeTab === "quiz"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setActiveTab("quiz")}
              >
                Quizzes
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search library..."
                  className="w-full px-4 py-2 pl-10 border rounded-lg text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative">
                  <button className="border rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter by Tag</span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${selectedTags.length > 0 ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {/* Tag filter dropdown would go here */}
                </div>
                
                <button 
                  className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => router.push('/dashboard/quizzes-flashcards')}
                >
                  <Plus className="h-5 w-5" />
                  Create New
                </button>
              </div>
            </div>

            {/* Tag filters */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`text-xs px-3 py-1 rounded-full ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No items found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedTags.length > 0 || searchTerm
                    ? "Try adjusting your filters or search criteria"
                    : "Start creating study materials or save them from chats"}
                </p>
                <button 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => router.push('/dashboard/quizzes-flashcards')}
                >
                  Create New Study Material
                </button>
              </div>
            ) : (
              /* Items Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <div key={item.id} className="border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{formatDate(item.timestamp)}</p>
                      
                      {/* Type specific details */}
                      {item.type === "flashcard" && item.cardCount && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.cardCount} cards</p>
                      )}
                      
                      {item.type === "quiz" && item.questionCount && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.questionCount} questions</p>
                      )}
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {item.tags?.map(tag => (
                          <span 
                            key={tag} 
                            className={`text-xs px-2 py-1 rounded-full ${
                              item.type === "summary" 
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                                : item.type === "flashcard"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-750 px-5 py-3 flex justify-between items-center border-t dark:border-gray-700">
                      <button 
                        className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300"
                        onClick={() => {
                          if (item.type === "quiz") {
                            router.push(`/dashboard/quizzes-flashcards/quiz/${item.id}`);
                          } else if (item.type === "flashcard") {
                            router.push(`/dashboard/quizzes-flashcards/flashcard/${item.id}`);
                          } else {
                            router.push(`/dashboard/library/${item.id}`);
                          }
                        }}
                      >
                        {item.type === "quiz" ? "Take Quiz" : 
                         item.type === "flashcard" ? "Review Cards" : "View Summary"}
                      </button>
                      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Trial Modal */}
      {showTrialModal && (
        <TrialCheckoutModal onClose={() => setShowTrialModal(false)} />
      )}
    </div>
  );
} 