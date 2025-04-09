"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Upload, 
  FileText, 
  Paperclip, 
  Send, 
  Bot, 
  Mic, 
  Link as LinkIcon, 
  BookOpen, 
  X, 
  ChevronRight,
  Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUsage } from "@/lib/hooks/useUsage";
import TrialCheckoutModal from "@/app/components/TrialCheckoutModal";

export default function DeepResearchPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; size: string; content?: string }[]>([]);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const { isProUser, isTrialUser } = useUsage();
  
  // Add a local usePrompt function since it's not in the hook
  const usePrompt = () => {
    // Simple implementation: allow if user is pro or trial
    return isProUser || isTrialUser;
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const researchContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // If user is not pro or trial, show trial modal when component mounts
    if (!isProUser && !isTrialUser) {
      setShowTrialModal(true);
    }
  }, [isProUser, isTrialUser]);
  
  // This would be connected to the Deepgram API in a real implementation
  const startRecording = () => {
    setIsRecording(true);
    // In a real app, this would start recording audio
    setTimeout(() => {
      setIsRecording(false);
      setTranscription("This is a sample transcription of audio that would be processed through Deepgram's API to convert speech to text accurately. The actual implementation would use the Web Audio API with Deepgram's real-time transcription capabilities.");
    }, 3000);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    // In a real app, this would stop recording and process the audio
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleAudioUploadClick = () => {
    audioInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => {
        return {
          name: file.name,
          type: file.type.split('/')[1].toUpperCase(),
          size: formatFileSize(file.size)
        };
      });
      
      // Read file contents for text files
      Array.from(files).forEach((file, index) => {
        if (file.type.includes('text') || file.type.includes('pdf') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            setUploadedFiles(prevFiles => {
              const updatedFiles = [...prevFiles];
              if (updatedFiles[index]) {
                updatedFiles[index] = { ...updatedFiles[index], content };
              }
              return updatedFiles;
            });
          };
          reader.readAsText(file);
        }
      });
      
      setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    } else {
      return `${(kb / 1024).toFixed(1)} MB`;
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };
  
  // Call the Perplexity API
  const handleSearch = async () => {
    if (!query.trim() && !transcription && uploadedFiles.length === 0) return;
    
    // Check if user has enough prompts
    if (!usePrompt()) {
      setShowTrialModal(true);
      return;
    }
    
    setIsLoading(true);
    setSearchResults([]);
    
    try {
      // Save search to history in Firebase
      // Code to save to Firebase would go here
      
      // Prepare payload
      const searchQuery = query || transcription || "";
      
      // Call Perplexity API with streaming response
      const response = await fetch('/api/perplexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          files: uploadedFiles.filter(file => file.content)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get research results');
      }
      
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Unable to read response');
      
      const decoder = new TextDecoder();
      let result = '';
      
      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        result += chunk;
        
        // Update UI with streaming results
        try {
          // Format the current accumulated result
          const formattedResult = {
            title: "Research on " + searchQuery,
            content: result,
            sources: [],
          };
          
          setSearchResults([formattedResult]);
          
          // Auto-scroll to bottom as new content arrives
          if (researchContainerRef.current) {
            researchContainerRef.current.scrollTop = researchContainerRef.current.scrollHeight;
          }
        } catch (err) {
          console.error('Error parsing stream chunk:', err);
        }
      }
    } catch (error) {
      console.error('Error during research:', error);
      setSearchResults([{
        title: "Error Occurred",
        content: "We encountered an error while researching. Please try again later.",
        sources: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
          AI Deep Topic Research
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Conduct comprehensive research using AI to analyze documents, transcribe audio, and generate in-depth reports with citations
        </p>
      </div>
      
      {/* Main Research Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Research Input</h2>
            
            {/* Text Query Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Research Query
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your research question or topic..."
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* File Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Documents for Analysis
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <button
                  onClick={handleUploadClick}
                  className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3"
                  disabled={isLoading}
                >
                  <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </button>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Drag and drop your files here or click to browse
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supports PDF, DOCX, TXT (Max 25MB per file)
                </p>
              </div>
              
              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Uploaded Files ({uploadedFiles.length})
                  </p>
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md mr-3">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{file.type} • {file.size}</p>
                        </div>
                      </div>
                      <button 
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => removeFile(index)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Voice Input Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice Input
              </label>
              <div className="flex items-center gap-4">
                <button
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    isRecording 
                      ? "bg-red-500 text-white" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                >
                  <Mic className="h-5 w-5" />
                  <span>{isRecording ? "Stop Recording" : "Start Recording"}</span>
                </button>
                
                <div className="relative">
                  <input
                    type="file"
                    ref={audioInputRef}
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg flex items-center gap-2"
                    onClick={handleAudioUploadClick}
                    disabled={isLoading}
                  >
                    <Paperclip className="h-5 w-5" />
                    <span>Upload Audio</span>
                  </button>
                </div>
              </div>
              
              {/* Transcription Result */}
              {transcription && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transcription:
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {transcription}
                  </p>
                  <div className="mt-2 flex justify-end">
                    <button 
                      className="text-blue-600 text-sm font-medium hover:text-blue-800"
                      onClick={() => setTranscription(null)}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Research Results */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 overflow-y-auto" 
            style={{ maxHeight: "800px" }}
            ref={researchContainerRef}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Research Results
            </h2>
            
            {isLoading && !searchResults && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Researching in-depth information...</p>
              </div>
            )}
            
            {!isLoading && !searchResults && (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Start Your Research
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Enter a research question, upload documents, or provide audio input to generate comprehensive research with academic citations.
                </p>
              </div>
            )}
            
            {searchResults && searchResults.map((result, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {result.title}
                </h3>
                <div className="prose prose-blue dark:prose-invert max-w-none mb-4">
                  <div dangerouslySetInnerHTML={{ 
                    __html: result.content
                      .replace(/\n\n/g, '<br><br>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                </div>
                
                {result.sources && result.sources.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      Sources & Citations
                    </h4>
                    <ul className="space-y-2">
                      {result.sources.map((source: any, sourceIndex: number) => (
                        <li key={sourceIndex} className="flex items-start">
                          <div className="flex-shrink-0 p-1 bg-blue-100 dark:bg-blue-900 rounded-md mr-3">
                            <LinkIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {source.name} ({source.year})
                            </p>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              {source.url}
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Research History & Recommendations */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Research
            </h2>
            
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">Climate Change Impact on Ecosystems</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">2 days ago</p>
              </button>
              
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">Neural Networks Applications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">1 week ago</p>
              </button>
              
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">Sustainable Energy Solutions</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">2 weeks ago</p>
              </button>
            </div>
            
            <div className="mt-4">
              <Link 
                href="/dashboard/library"
                className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
              >
                View all research
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recommended Topics
            </h2>
            
            <div className="space-y-3">
              <button 
                className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setQuery("Artificial Intelligence Ethics and Regulations")}
              >
                <p className="font-medium text-gray-900 dark:text-white">AI Ethics & Regulations</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current debates and frameworks</p>
              </button>
              
              <button 
                className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setQuery("Quantum Computing Applications in Cryptography")}
              >
                <p className="font-medium text-gray-900 dark:text-white">Quantum Computing & Cryptography</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Security implications and advances</p>
              </button>
              
              <button 
                className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setQuery("Renewable Energy Storage Technologies")}
              >
                <p className="font-medium text-gray-900 dark:text-white">Energy Storage Technologies</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Batteries, hydrogen, and alternatives</p>
              </button>
            </div>
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