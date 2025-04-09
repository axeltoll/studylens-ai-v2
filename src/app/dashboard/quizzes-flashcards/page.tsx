"use client";

import { useState, useRef } from "react";
import { 
  PlusCircle, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Copy,
  Plus,
  FileUp,
  Tag,
  Clock,
  X,
  Sparkles,
  FileQuestion,
  Brain
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUsage } from "@/lib/hooks/useUsage";
import Image from "next/image";
import TrialCheckoutModal from "@/app/components/TrialCheckoutModal";

export default function QuizzesFlashcardsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "quizzes" | "flashcards">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const { isProUser } = useUsage();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sample data
  const quizzesAndFlashcards = [
    {
      id: "q1",
      type: "quiz",
      title: "Biology Midterm Prep",
      subject: "Biology",
      cardCount: 25,
      lastUpdated: "2 days ago",
      score: 85,
    },
    {
      id: "f1",
      type: "flashcard",
      title: "Anatomy Terms",
      subject: "Biology",
      cardCount: 48,
      lastUpdated: "1 week ago",
      score: 72,
    },
    {
      id: "q2",
      type: "quiz",
      title: "Calculus 101 Review",
      subject: "Mathematics",
      cardCount: 30,
      lastUpdated: "3 days ago",
      score: 92,
    },
    {
      id: "f2",
      type: "flashcard",
      title: "Chemistry Formulas",
      subject: "Chemistry",
      cardCount: 36,
      lastUpdated: "5 days ago",
      score: 65,
    },
    {
      id: "q3",
      type: "quiz",
      title: "World History Facts",
      subject: "History",
      cardCount: 40,
      lastUpdated: "1 day ago",
      score: 78,
    },
    {
      id: "f3",
      type: "flashcard",
      title: "Spanish Vocabulary",
      subject: "Languages",
      cardCount: 100,
      lastUpdated: "2 weeks ago",
      score: 60,
    },
  ];
  
  // Get all unique subjects
  const allSubjects = [...new Set(quizzesAndFlashcards.map(item => item.subject))];
  
  // Filter items based on active tab, search term, and selected subjects
  const filteredItems = quizzesAndFlashcards.filter(item => {
    // Filter by type
    if (activeTab === "quizzes" && item.type !== "quiz") return false;
    if (activeTab === "flashcards" && item.type !== "flashcard") return false;
    
    // Filter by search term
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Filter by selected subjects
    if (selectedSubjects.length > 0 && !selectedSubjects.includes(item.subject)) return false;
    
    return true;
  });
  
  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };
  
  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Process the file (in a real app, this would upload and process the file)
      console.log("File selected:", file.name);
      // Reset the input
      e.target.value = "";
    }
  };
  
  // Fix Set<string> iteration using Array.from
  const selectedSubjectArray = Array.from(selectedSubjects);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileQuestion className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
            Quizzes & Flashcards
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create, study, and master any subject with AI-powered quizzes and flashcards
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            Create New
          </button>
          
          <button 
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={handleUploadFile}
          >
            <FileUp className="h-4 w-4" />
            Upload
          </button>
        </div>
      </div>
      
      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Study Material</h2>
                <button onClick={() => setShowCreateModal(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Choose the type of study material you want to create
              </p>
              
              <div className="space-y-4">
                <button
                  className="w-full flex items-start p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={() => setShowCreateModal(false)}
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                    <FileQuestion className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white">New Quiz</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Create a quiz with multiple-choice, true/false, or short answer questions
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button
                  className="w-full flex items-start p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={() => setShowCreateModal(false)}
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white">New Flashcard Set</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Create flashcards with terms and definitions for quick studying
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button
                  className="w-full flex items-start p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={() => setShowCreateModal(false)}
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                    <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white">AI-Generated Content</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Let AI create study material from your notes, textbook, or syllabus
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search quizzes and flashcards..."
            className="w-full px-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <button 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 flex items-center gap-2"
              onClick={() => {
                // Toggle filter dropdown
              }}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            
            {/* Filter dropdown would go here */}
          </div>
          
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button 
              className={`px-4 py-2 ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'quizzes' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}
              onClick={() => setActiveTab('quizzes')}
            >
              Quizzes
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'flashcards' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}
              onClick={() => setActiveTab('flashcards')}
            >
              Flashcards
            </button>
          </div>
        </div>
      </div>
      
      {/* Selected filters display */}
      {selectedSubjects.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Filters:</span>
          <div className="flex flex-wrap gap-2">
            {selectedSubjectArray.map(subject => (
              <span
                key={subject}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {subject}
                <button onClick={() => toggleSubject(subject)}>
                  <X className="ml-1 h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              onClick={() => setSelectedSubjects([])}
              className="text-xs text-blue-600 dark:text-blue-400 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
      
      {/* Items grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className={`h-2 ${item.type === 'quiz' ? 'bg-blue-500' : 'bg-green-500'}`} />
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === 'quiz' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {item.type === 'quiz' ? 'Quiz' : 'Flashcards'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    {item.subject}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {item.cardCount} {item.type === 'quiz' ? 'questions' : 'cards'}
                  </div>
                </div>
                
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{item.score}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        item.score >= 80 ? 'bg-green-500' : item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Updated {item.lastUpdated}
                  </div>
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    Study
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No items found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your filters or create new study materials to get started.
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            onClick={() => setShowTrialModal(true)}
          >
            Upgrade to Pro
          </button>
        </div>
      )}
      
      {/* Pro User Upgrade Banner (shown only for non-pro users) */}
      {!isProUser && filteredItems.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-xl font-bold mb-2">Unlock Advanced Features</h3>
              <p className="text-blue-100 mb-4">
                Upgrade to Pro for unlimited quizzes, flashcards, and advanced analytics to track your progress.
              </p>
              <Link
                href="/dashboard/pro"
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Upgrade to Pro
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="hidden md:block">
              <Image 
                src="/images/pro-banner-illustration.png" 
                alt="Pro features illustration" 
                width={200} 
                height={140}
                className="w-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Trial Checkout Modal */}
      {showTrialModal && (
        <TrialCheckoutModal onClose={() => setShowTrialModal(false)} />
      )}
    </div>
  );
} 