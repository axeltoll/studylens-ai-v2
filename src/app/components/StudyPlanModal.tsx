"use client";

import { useState } from "react";
import { X, Calendar, Clock, BookOpen, PlusCircle } from "lucide-react";

interface StudyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudyPlanModal({ isOpen, onClose }: StudyPlanModalProps) {
  const [planName, setPlanName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0] // Today's date in YYYY-MM-DD format
  );
  const [endDate, setEndDate] = useState<string>("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [sessions, setSessions] = useState<number>(3);
  const [dailyHours, setDailyHours] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  if (!isOpen) return null;

  // Mock list of user's documents
  const availableDocuments = [
    { id: "doc1", title: "Introduction to Neural Networks.pdf" },
    { id: "doc2", title: "Modern Physics Concepts.pdf" },
    { id: "doc3", title: "Machine Learning Fundamentals.pdf" },
    { id: "doc4", title: "Biology 101 Notes.pdf" }
  ];
  
  const handleSelectDocument = (id: string) => {
    setSelectedDocuments(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id) 
        : [...prev, id]
    );
  };
  
  const handleCreatePlan = async () => {
    if (!planName || !subject || !goal || !startDate || !endDate || selectedDocuments.length === 0) {
      // Show error
      return;
    }
    
    setIsLoading(true);
    
    try {
      // API call to create study plan
      const response = await fetch('/api/study-plans/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: planName,
          subject,
          goal,
          startDate,
          endDate,
          documents: selectedDocuments,
          sessionsPerWeek: sessions,
          hoursPerDay: dailyHours
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create study plan');
      }
      
      // Close modal on success
      onClose();
      
    } catch (error) {
      console.error('Error creating study plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Create Study Plan</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {/* Plan Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Final Exam Prep, MCAT Study Plan"
                required
              />
            </div>
            
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Biology, Machine Learning, Physics"
                required
              />
            </div>
            
            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What's your goal?
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Pass my final exam, Master the fundamentals"
                rows={2}
                required
              />
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Study Schedule */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sessions per week
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={sessions}
                    onChange={(e) => setSessions(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'session' : 'sessions'}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours per day
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md appearance-none"
                  >
                    {[0.5, 1, 1.5, 2, 2.5, 3, 4].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'hour' : 'hours'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Study Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select study materials
              </label>
              <div className="border border-gray-300 rounded-md max-h-48 overflow-y-auto p-2">
                {availableDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                    <input
                      type="checkbox"
                      id={doc.id}
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => handleSelectDocument(doc.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={doc.id} className="ml-3 text-sm text-gray-700 font-medium cursor-pointer">
                      {doc.title}
                    </label>
                  </div>
                ))}
                
                <button className="flex items-center mt-2 text-blue-600 text-sm">
                  <PlusCircle size={16} className="mr-1" />
                  Upload new document
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 rounded-md p-4 border border-blue-100">
            <h4 className="text-sm font-medium text-blue-800 mb-2">AI-powered study plan</h4>
            <p className="text-xs text-blue-700">
              InsightLens AI will analyze your selected materials and create a personalized study plan with:
            </p>
            <ul className="text-xs text-blue-700 mt-2 list-disc list-inside">
              <li>Daily study schedule tailored to your timeline</li>
              <li>Custom quizzes to test your knowledge</li>
              <li>Spaced repetition flashcards for optimal retention</li>
              <li>Progress tracking and adaptive recommendations</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end sticky bottom-0">
          <button
            className="mr-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
            onClick={handleCreatePlan}
            disabled={isLoading || !planName || !subject || !goal || !startDate || !endDate || selectedDocuments.length === 0}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Creating...</span>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              'Create Study Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 