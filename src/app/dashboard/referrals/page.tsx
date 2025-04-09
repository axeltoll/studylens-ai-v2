"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createReferralLink, generateReferralCode, getReferralStats } from "@/lib/utils/referrals";
import DashboardHeader from "@/app/components/DashboardHeader";
import Sidebar from "@/app/components/Sidebar";
import ShareModal from "@/app/components/ShareModal";
import { Copy, CheckCircle, Users, DollarSign, Clock, Award, Share2 } from "lucide-react";

export default function ReferralsPage() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralLink, setReferralLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    successfulReferrals: 0,
    earnings: 0,
  });

  useEffect(() => {
    if (user) {
      const code = generateReferralCode(user.uid);
      setReferralCode(code);
      setReferralLink(createReferralLink(code));
      
      // Fetch referral stats
      const fetchStats = async () => {
        const stats = await getReferralStats(user.uid);
        setReferralStats(stats);
      };
      
      fetchStats();
    }
  }, [user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openShareModal = () => {
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Referral Program
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Invite your friends to StudyLens AI and earn rewards!
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-4">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Referrals</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{referralStats.totalReferrals}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mr-4">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Successful</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{referralStats.successfulReferrals}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 mr-4">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{referralStats.pendingReferrals}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200 mr-4">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">${referralStats.earnings.toFixed(2)}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Link Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Referral Link</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Share this link with your friends. When they sign up and subscribe, you'll both receive rewards!
              </p>
              
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
              
              <div className="mt-4 flex justify-center">
                <button
                  onClick={openShareModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share with Friends
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Share Your Link</h3>
                    <p className="text-gray-600 dark:text-gray-300">Send your unique referral link to friends who could benefit from StudyLens AI.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">They Sign Up</h3>
                    <p className="text-gray-600 dark:text-gray-300">When your friends use your link to sign up, they'll get a free 7-day trial to StudyLens AI Pro.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Earn Rewards</h3>
                    <p className="text-gray-600 dark:text-gray-300">For each friend who subscribes after their trial, you'll receive $9.95 (equivalent to one month free).</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mr-4">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Unlimited Referrals</h3>
                    <p className="text-gray-600 dark:text-gray-300">There's no limit to how many friends you can refer. The more you share, the more you earn!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={shareModalOpen}
        onClose={closeShareModal}
        referralLink={referralLink}
        referralCode={referralCode}
      />
    </div>
  );
} 