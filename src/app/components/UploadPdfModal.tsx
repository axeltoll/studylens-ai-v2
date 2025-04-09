"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";

interface UploadPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GenerationType = "summary" | "flashcards" | "quiz" | "questions";

export default function UploadPdfModal({ isOpen, onClose }: UploadPdfModalProps) {
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>("summary");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      setError("Please select a PDF file");
      return;
    }
    
    setError("");
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(formatFileSize(selectedFile.size));
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }
    
    setIsUploading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('generationType', generationType);
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload file");
      }
      
      const data = await response.json();
      console.log("Upload successful:", data);
      
      // Close modal and maybe show a success message or redirect
      onClose();
      
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.message || "An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Upload PDF</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5">
          {/* File Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
              file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            
            {file ? (
              <div className="text-center">
                <div className="mb-2 text-sm font-medium text-gray-900">{fileName}</div>
                <div className="text-xs text-gray-500">{fileSize}</div>
                <button 
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setFileName("");
                    setFileSize("");
                  }}
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-700 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF (up to 10MB)</p>
              </>
            )}
          </div>
          
          {error && (
            <div className="mt-3 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          {/* Generation Options */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to generate?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`py-2 px-3 border rounded-md text-sm ${
                  generationType === 'summary' 
                    ? 'bg-blue-100 border-blue-600 text-blue-800' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => setGenerationType('summary')}
              >
                Summary
              </button>
              <button
                className={`py-2 px-3 border rounded-md text-sm ${
                  generationType === 'flashcards' 
                    ? 'bg-blue-100 border-blue-600 text-blue-800' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => setGenerationType('flashcards')}
              >
                Flashcards
              </button>
              <button
                className={`py-2 px-3 border rounded-md text-sm ${
                  generationType === 'quiz' 
                    ? 'bg-blue-100 border-blue-600 text-blue-800' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => setGenerationType('quiz')}
              >
                Quiz
              </button>
              <button
                className={`py-2 px-3 border rounded-md text-sm ${
                  generationType === 'questions' 
                    ? 'bg-blue-100 border-blue-600 text-blue-800' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => setGenerationType('questions')}
              >
                Study Questions
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-lg">
          <button
            className="mr-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload & Process'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 