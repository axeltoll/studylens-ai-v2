"use client";

import { useState } from "react";
import { Lightbulb, Send, Check, AlertCircle } from "lucide-react";

export default function SuggestFeaturePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const categories = [
    { id: "general", name: "General Improvement" },
    { id: "ai", name: "AI Capabilities" },
    { id: "ui", name: "User Interface" },
    { id: "mobile", name: "Mobile Experience" },
    { id: "integration", name: "Integration with Other Tools" },
    { id: "other", name: "Other" }
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    
    setError(null);
    setSubmitting(true);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would send the data to your backend
      // const response = await fetch('/api/feature-suggestions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title,
      //     description,
      //     category,
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit feature suggestion');
      // }
      
      setSubmitted(true);
      setTitle("");
      setDescription("");
      setCategory("general");
    } catch (err) {
      console.error('Error submitting feature suggestion:', err);
      setError("There was an error submitting your suggestion. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Lightbulb className="mr-2 h-6 w-6 text-yellow-500" />
          Suggest a Feature
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Have an idea that would make StudyLens AI better? We'd love to hear it!
        </p>
      </div>
      
      {submitted ? (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center">
          <div className="h-12 w-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You for Your Suggestion!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We've received your feature suggestion and will review it soon. We appreciate your input in making StudyLens AI better for everyone.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Suggest Another Feature
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <div className="mb-6">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Feature Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a short, descriptive title for your feature idea"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="category" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Category
            </label>
            <select 
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe your feature idea in detail. What problem would it solve? How would it work?"
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-70 flex items-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Suggestion
                </>
              )}
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          How We Review Suggestions
        </h2>
        <div className="space-y-4">
          <div className="flex">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-4 flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 font-medium">1</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Review</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our product team reviews all suggestions within 1-2 weeks.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-4 flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 font-medium">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Prioritize</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We prioritize features based on user demand and technical feasibility.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-4 flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 font-medium">3</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Implement</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Selected features are added to our development roadmap for future releases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 