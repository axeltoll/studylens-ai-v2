"use client";

import { useState, useEffect } from "react";
import { 
  Copy, 
  CheckCircle, 
  X, 
  Mail, 
  MessageSquare, 
  Twitter, 
  Facebook, 
  Linkedin 
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralLink: string;
  referralCode: string;
}

export default function ShareModal({ 
  isOpen, 
  onClose, 
  referralLink, 
  referralCode 
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Generate share URLs
  const shareText = encodeURIComponent("I'm using StudyLens AI to solve homework problems instantly. Use my referral link to get a free 7-day trial!");
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(referralLink)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${shareText}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
  const emailSubject = encodeURIComponent("Try StudyLens AI - Free 7-day Trial");
  const emailBody = encodeURIComponent(`Hey,

I've been using StudyLens AI to solve homework problems and thought you might find it useful too. 

Use my referral link to get a free 7-day trial: ${referralLink}

Enjoy!`);
  const emailShareUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;
  const smsShareUrl = `sms:?body=${encodeURIComponent(`Hey! I've been using StudyLens AI for my homework. You can get a free 7-day trial with my link: ${referralLink}`)}`;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Share Your Referral Link
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Share this link with friends. When they sign up, you'll both get a free 7-day trial of StudyLens AI Pro!
        </p>
        
        {/* Copy link section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Referral Link
          </label>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-l-lg p-3 overflow-x-auto">
              <code className="text-sm break-all text-gray-800 dark:text-gray-200">{referralLink}</code>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`${
                copied 
                  ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700' 
                  : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              } text-white p-3 rounded-r-lg transition-colors duration-200`}
            >
              {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
            </button>
          </div>
          
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Referral code: <span className="font-mono font-medium">{referralCode}</span>
          </div>
        </div>
        
        {/* Share options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Share Via
          </label>
          <div className="grid grid-cols-2 gap-3">
            <a 
              href={emailShareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
            </a>
            
            <a 
              href={smsShareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS</span>
            </a>
            
            <a 
              href={twitterShareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Twitter className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Twitter</span>
            </a>
            
            <a 
              href={facebookShareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Facebook className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
            </a>
            
            <a 
              href={linkedinShareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="col-span-2 flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Linkedin className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 