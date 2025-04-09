"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { CreditCard, Bell, Shield, User, Loader2 } from "lucide-react";

interface Subscription {
  plan: string;
  status: string;
  trialEnd?: Date;
}

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [activeTab, setActiveTab] = useState("billing");
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      
      try {
        const subscriptionDoc = await getDoc(doc(db, "subscriptions", user.uid));
        
        if (subscriptionDoc.exists()) {
          const data = subscriptionDoc.data();
          setSubscription({
            plan: data.plan,
            status: data.status,
            trialEnd: data.trialEnd?.toDate() || undefined,
          });
        } else {
          // No subscription found, set to free plan
          setSubscription({
            plan: "free",
            status: "active",
          });
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoadingSubscription(false);
      }
    };
    
    fetchSubscription();
  }, [user]);
  
  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  const isTrialActive = () => {
    if (!subscription?.trialEnd) return false;
    return new Date() < new Date(subscription.trialEnd);
  };
  
  const getDaysRemaining = () => {
    if (!subscription?.trialEnd) return 0;
    const now = new Date();
    const trial = new Date(subscription.trialEnd);
    const diffTime = trial.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("billing")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "billing"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Billing & Subscription
              </div>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "notifications"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </div>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "security"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </div>
            </button>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            {activeTab === "billing" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Billing & Subscription
                </h2>
                
                {loadingSubscription ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Current Plan
                          </h3>
                          <p className="text-gray-600">
                            {subscription?.plan === "pro" ? "Pro Plan" : "Free Plan"}
                          </p>
                        </div>
                        <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {subscription?.status === "trialing"
                            ? "Trial"
                            : subscription?.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </div>
                      </div>
                      
                      {subscription?.plan === "pro" && (
                        <>
                          {isTrialActive() ? (
                            <div className="text-gray-700 mb-4">
                              <span className="font-medium">Trial period:</span> {getDaysRemaining()} days remaining
                              <div className="text-sm text-gray-500 mt-1">
                                Your trial ends on {formatDate(subscription?.trialEnd)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-700 mb-4">
                              <span className="font-medium">Billing period:</span> Monthly
                              <div className="text-sm text-gray-500 mt-1">
                                Your next payment of $9.95 will be on the 1st of next month
                              </div>
                            </div>
                          )}
                          
                          <div className="flex space-x-4">
                            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                              Manage Payment Methods
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              Cancel Subscription
                            </button>
                          </div>
                        </>
                      )}
                      
                      {subscription?.plan === "free" && (
                        <>
                          <div className="text-gray-700 mb-4">
                            Upgrade to Pro to unlock all features and remove limitations.
                          </div>
                          
                          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            Upgrade to Pro
                          </button>
                        </>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Billing History
                      </h3>
                      
                      <div className="border-t border-gray-200">
                        <div className="py-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">Pro Plan - Monthly</p>
                            <p className="text-sm text-gray-500">May 1, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">$9.95</p>
                            <p className="text-sm text-green-600">Paid</p>
                          </div>
                        </div>
                        <div className="py-4 flex justify-between items-center border-t border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Pro Plan - Monthly</p>
                            <p className="text-sm text-gray-500">April 1, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">$9.95</p>
                            <p className="text-sm text-green-600">Paid</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Profile Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      defaultValue={user?.displayName || ""}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      defaultValue={user?.email || ""}
                      disabled
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Your email address cannot be changed
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      defaultValue="America/New_York"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Notification Preferences
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive email updates about your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Usage Summaries</h3>
                      <p className="text-sm text-gray-500">Get weekly summaries of your app usage</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Product Updates</h3>
                      <p className="text-sm text-gray-500">Learn about new features and improvements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Marketing Communications</h3>
                      <p className="text-sm text-gray-500">Receive promotions and special offers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "security" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Security Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="current-password"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="new-password"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirm-password"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Account Deletion</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Permanently delete your account and all associated data.
                    </p>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 