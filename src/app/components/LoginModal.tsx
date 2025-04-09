"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { X, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { processSignupReferral } from "@/lib/utils/referrals";

interface LoginModalProps {
  isOpen?: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
  type?: "login" | "signup";
  onToggleType?: () => void;
}

export default function LoginModal({ isOpen = true, type = "signup", defaultTab = "signup", onClose, onToggleType = () => {} }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(type || defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  // Update activeTab when type prop changes
  useEffect(() => {
    setActiveTab(type || defaultTab);
  }, [type, defaultTab]);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    
    try {
      if (activeTab === "login") {
        await signIn(email, password);
        
        setSuccess("Login successful!");
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          onClose();
          router.push('/dashboard');
        }, 1000);
      } else {
        // Sign up the user
        await signUp(email, password);
        
        // After signup, the auth state should be updated with the new user
        setSuccess("Account created successfully!");
        
        // Process referral if applicable
        if (referralCode && user) {
          await processSignupReferral(referralCode, user);
        }
        
        // Redirect to dashboard after successful signup
        setTimeout(() => {
          onClose();
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    
    try {
      await signInWithGoogle();
      
      // Process referral if applicable
      if (referralCode && user) {
        await processSignupReferral(referralCode, user);
      }
      
      setSuccess("Login successful!");
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        onClose();
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error("Google authentication error:", error);
      setError(error.message || "An error occurred during Google authentication");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
          
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <Image 
                  src="/images/StudyLens-AI-Logo-V1-Square-396-349-Black.png"
                  alt="StudyLens AI Logo" 
                  width={60} 
                  height={60}
                  className="rounded-lg"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-gray-600 mt-1">
                {activeTab === "login" 
                  ? "Sign in to continue to StudyLens AI" 
                  : "Get started with your free account"}
              </p>
            </div>
            
            {/* Tabs */}
            <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
              <button
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "login"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => {
                  setActiveTab("login");
                  if (type !== "login") {
                    onToggleType();
                  }
                }}
              >
                Log In
              </button>
              <button
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "signup"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => {
                  setActiveTab("signup");
                  if (type !== "signup") {
                    onToggleType();
                  }
                }}
              >
                Sign Up
              </button>
            </div>
            
            {/* Error and Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-green-600">{success}</span>
              </div>
            )}
            
            {/* Referral note (if applicable) */}
            {activeTab === 'signup' && referralCode && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  You were referred by a friend! You'll receive a free 7-day trial to StudyLens AI Pro when you sign up.
                </p>
              </div>
            )}
            
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-4">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                <Image 
                  src="/google-logo.svg" 
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                {activeTab === "login" ? "Sign in with Google" : "Sign up with Google"}
              </button>
            </div>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit}>
              {activeTab === "signup" && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              {activeTab === "signup" && (
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}
              
              {activeTab === "login" ? (
                <div className="flex justify-end mb-6">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mt-0.5"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                    </span>
                  </label>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    {activeTab === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  activeTab === "login" ? "Sign in" : "Create account"
                )}
              </button>
              
              {activeTab === "login" ? (
                <div className="text-center mt-6 text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("signup");
                      onToggleType();
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up
                  </button>
                </div>
              ) : (
                <div className="text-center mt-6 text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      onToggleType();
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 