"use client";

import { useState } from "react";
import { X, Copy, Mail, Facebook, Twitter, Share2, MessageCircle } from "lucide-react";

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: {
    id: string;
    title: string;
    type: string;
  };
}

export default function ShareDocumentModal({ isOpen, onClose, document }: ShareDocumentModalProps) {
  const [copied, setCopied] = useState(false);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [email, setEmail] = useState("");
  
  if (!isOpen) return null;
  
  const documentTitle = document?.title || "Document";
  const documentType = document?.type || "resource";
  
  // The share URL would be something like yourdomain.com/shared/document-id
  const shareUrl = document?.id 
    ? `${window.location.origin}/shared/${document.id}`
    : window.location.href;
  
  const shareSubject = `Check out this ${documentType} on InsightLens AI: ${documentTitle}`;
  const shareBody = `I wanted to share this ${documentType} with you from InsightLens AI.\n\n${documentTitle}\n\n${shareUrl}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleEmailShare = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(shareBody)}`;
  };
  
  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareSubject)}`, '_blank');
  };
  
  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareSubject + '\n\n' + shareUrl)}`, '_blank');
  };
  
  const handleTelegramShare = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareSubject)}`, '_blank');
  };
  
  const handleSMSShare = () => {
    window.location.href = `sms:?body=${encodeURIComponent(shareSubject + '\n\n' + shareUrl)}`;
  };
  
  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to your referral program API
    console.log(`Submitted referral for: ${email}`);
    // Show success message or close modal
    setShowReferralForm(false);
    setEmail("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Share {documentTitle}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Share link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share link
            </label>
            <div className="flex">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md text-gray-700 bg-gray-50"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-200 focus:outline-none"
              >
                {copied ? (
                  <span className="text-green-600 text-sm font-medium">Copied!</span>
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>
          
          {/* Social sharing options */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Share via
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleEmailShare}
                className="flex flex-col items-center justify-center p-3 border rounded-md hover:bg-gray-50"
              >
                <Mail className="h-6 w-6 text-gray-600 mb-1" />
                <span className="text-xs text-gray-700">Email</span>
              </button>
              
              <button
                onClick={handleFacebookShare}
                className="flex flex-col items-center justify-center p-3 border rounded-md hover:bg-gray-50"
              >
                <Facebook className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-xs text-gray-700">Facebook</span>
              </button>
              
              <button
                onClick={handleTwitterShare}
                className="flex flex-col items-center justify-center p-3 border rounded-md hover:bg-gray-50"
              >
                <Twitter className="h-6 w-6 text-blue-400 mb-1" />
                <span className="text-xs text-gray-700">Twitter</span>
              </button>
              
              <button
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center justify-center p-3 border rounded-md hover:bg-gray-50"
              >
                <MessageCircle className="h-6 w-6 text-green-500 mb-1" />
                <span className="text-xs text-gray-700">WhatsApp</span>
              </button>
              
              <button
                onClick={handleTelegramShare}
                className="flex flex-col items-center justify-center p-3 border rounded-md hover:bg-gray-50"
              >
                <Share2 className="h-6 w-6 text-blue-500 mb-1" />
                <span className="text-xs text-gray-700">Telegram</span>
              </button>
              
              <button
                onClick={handleSMSShare}
                className="flex flex-col items-center justify-center p-3 border rounded-md hover:bg-gray-50"
              >
                <MessageCircle className="h-6 w-6 text-gray-600 mb-1" />
                <span className="text-xs text-gray-700">SMS</span>
              </button>
            </div>
          </div>
          
          {/* Referral Program Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white mb-3">
            <h4 className="font-bold text-lg mb-1">Earn cash for inviting others!</h4>
            <p className="text-sm mb-3">Sign up for our referral program and earn cash when your friends & family join InsightLens AI.</p>
            <button 
              onClick={() => setShowReferralForm(!showReferralForm)}
              className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50"
            >
              Learn More
            </button>
          </div>
          
          {/* Referral Form (toggled) */}
          {showReferralForm && (
            <form onSubmit={handleReferralSubmit} className="border rounded-lg p-4 mb-3">
              <h4 className="font-medium text-gray-900 mb-2">Join Our Referral Program</h4>
              <p className="text-sm text-gray-600 mb-3">
                Share your unique referral link and earn up to $10 for each friend who signs up.
                Payments are made via PayPal once you reach $50 in referrals.
              </p>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your friend's email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="friend@example.com"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Send Invitation
              </button>
            </form>
          )}
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-lg">
          <button
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 