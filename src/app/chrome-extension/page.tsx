"use client";

import { useState, useEffect, forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ChevronRight, Star, ExternalLink, ChevronDown, Brain, Sparkles, Code, Play, Zap, Camera, Clock, Check, Shield, Timer, LucideIcon } from "lucide-react";
import LoginModal from "@/app/components/LoginModal";
import { useRouter } from 'next/navigation';

// Replace the Globe component with a forward ref component
const Globe = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
  return (
    <svg
      ref={ref}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
});

Globe.displayName = 'Globe';

export default function ChromeExtensionPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"login" | "signup">("signup");
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  
  // Define updated platform logos for the slider
  const platformLogos = [
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e3202dd309346e7.png", // Canvas
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f45fd30e320270369d6b15.png", // Blackboard (higher quality)
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e3202da2f9346e6.png", // Google Classroom
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e3202d9ae9346e8.png", // Sakai
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f45fe20e3202a3999d6b17.png", // Moodle (higher quality)
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1ef10fee3a68b384d7.png", // D2L
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f45ffcf10fee6d44b478fc.png", // Schoology (higher quality)
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f4603ce06ab0a3c3f7bffa.png"  // ClassMarker (higher quality)
  ];

  // Handle scroll event to change header opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check login status
  useEffect(() => {
    // This is a placeholder - you would use your auth context or API to check login status
    const checkLoginStatus = () => {
      // For demo purposes, we'll use localStorage, but you should use your auth system
      const token = localStorage.getItem('auth_token');
      setIsLoggedIn(!!token);
    };
    
    checkLoginStatus();
  }, []);

  const testimonials = [
    {
      name: "Tobias Morris",
      location: "US",
      review: "best extension for students💯",
      date: "Sept 3, 2024",
      avatar: "/testimonials/avatar1.jpg",
      rating: 5,
      university: "Arizona State University"
    },
    {
      name: "Dylan Paul",
      location: "US",
      review: "I never have time to study and StudyLens AI comes in clutch every single time",
      date: "Aug 15, 2024",
      avatar: "/testimonials/avatar2.jpg",
      rating: 5,
      university: "University of California, San Diego"
    },
    {
      name: "Aila Singh",
      location: "US",
      review: "absolute lifesaver 💯",
      date: "Jul 19, 2024",
      avatar: "/testimonials/avatar3.jpg",
      rating: 5,
      university: "Pennsylvania State University"
    },
    {
      name: "Roman Stewart",
      location: "US",
      review: "great on macro graphs",
      date: "Jun 14, 2024",
      avatar: "/testimonials/avatar4.jpg",
      rating: 4,
      university: "University of Michigan"
    },
    {
      name: "Aubrie Miranda",
      location: "US",
      review: "Reliable compared to the other tools I used for assignments",
      date: "Jun 14, 2024",
      avatar: "/testimonials/avatar5.jpg",
      rating: 5,
      university: "Ohio State University"
    },
    {
      name: "Leah Duran",
      location: "US",
      review: "This AI chrome extension is fantastic for when I get stuck!",
      date: "Jun 14, 2024",
      avatar: "/testimonials/avatar6.jpg",
      rating: 5,
      university: "University of Texas"
    },
    {
      name: "Rebecca Collins",
      location: "US",
      review: "This has helped me a lot for exams!!",
      date: "Jan 12, 2024",
      avatar: "/testimonials/avatar7.jpg",
      rating: 5,
      university: "University of California"
    },
    {
      name: "Sean Lane",
      location: "US",
      review: "Helps me with every exam!",
      date: "Feb 20, 2024",
      avatar: "/testimonials/avatar8.jpg",
      rating: 5,
      university: "Pennsylvania State University"
    },
    {
      name: "James Regan",
      location: "US",
      review: "The absolute best!",
      date: "Feb 3, 2024",
      avatar: "/testimonials/avatar9.jpg",
      rating: 5,
      university: "Arizona State University"
    }
  ];

  const faqs = [
    {
      question: "How does the StudyLens AI chrome extension work?",
      answer: "Our AI Chrome extension integrates directly into your learning platforms, providing instant answers to any question by simply clicking a button. It can also screenshot questions, analyze text selections, and engage in AI-powered chat for personalized learning."
    },
    {
      question: "Will my school find out that I'm using the extension?",
      answer: "StudyLens AI is designed with privacy in mind. Our software uses camouflage mode to remain completely undetectable and doesn't leave digital fingerprints, providing complete security."
    },
    {
      question: "Is the AI-powered chat feature available on any website?",
      answer: "Yes, our AI chat feature works on any website. You can use it to clarify doubts, ask follow-up questions, or get additional information on any subject while browsing."
    },
    {
      question: "Can I upload files from class to make the AI more accurate?",
      answer: "Absolutely! You can upload your notes, slides, or textbooks, and our AI will reference these materials to provide more specific and tailored responses to your questions."
    },
    {
      question: "Does StudyLens AI work on any subject?",
      answer: "Yes, StudyLens AI works on all subjects and academic levels. Whether you need help with math, science, humanities, or any other subject, our AI is trained to provide expert assistance from beginner to advanced levels."
    },
    {
      question: "Can I ask follow-up questions within the extension?",
      answer: "Yes, you can have personalized conversations with our AI to clarify any doubts about your material. The extension allows for seamless follow-up questions to ensure you fully understand the concepts."
    }
  ];

  const learningPlatforms = [
    {
      name: "D2L",
      image: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1ef10fee3a68b384d7.png"
    },
    {
      name: "Moodle",
      image: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1ef10fee459fb384d6.png"
    },
    {
      name: "Blackboard",
      image: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e320221e99346e5.png"
    },
    {
      name: "Canvas",
      image: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e3202dd309346e7.png"
    },
    {
      name: "Schoology",
      image: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e4f87ea7505d4e709.png"
    }
  ];

  const handleGetStarted = () => {
    setModalType("signup");
    setShowModal(true);
  };

  const handleDashboardClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      setModalType("login");
      setShowModal(true);
    }
  };

  return (
    <main className="bg-white text-gray-900">
      {showModal && (
        <LoginModal 
          type={modalType}
          onClose={() => setShowModal(false)}
          onToggleType={() => setModalType(modalType === "login" ? "signup" : "login")}
        />
      )}
      
      {/* Header */}
      <header className="py-4 sticky top-0 z-50 bg-transparent">
        <div className="container mx-auto px-4">
          <div className={`flex justify-between items-center bg-white ${scrolled ? 'bg-opacity-70' : 'bg-opacity-100'} rounded-xl py-3 px-6 shadow-lg shadow-gray-200/50`} style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
            <div className="flex items-center">
              <Link href="/" className="mr-8">
                <Image 
                  src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1daade06ab05c3cf6a02c.png" 
                  alt="StudyLens AI" 
                  width={304} 
                  height={67}
                  className="h-14 w-auto"
                  priority
                  unoptimized
                />
              </Link>
              <div className="h-10 w-px bg-gray-200 mx-4 hidden md:block"></div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <nav className="hidden md:flex items-center space-x-16">
                <Link href="/#features" className="text-gray-700 hover:text-gray-900 transition-colors text-base">Features</Link>
                <Link href="/#pricing" className="text-gray-700 hover:text-gray-900 transition-colors text-base">Pricing</Link>
                <Link href="/#faq" className="text-gray-700 hover:text-gray-900 transition-colors text-base">FAQ</Link>
                <Link href="/chrome-extension" className="text-blue-600 font-medium text-base">Chrome Extension</Link>
              </nav>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-px bg-gray-200 mx-6 hidden md:block"></div>
              <button 
                onClick={handleDashboardClick}
                className={`hidden md:block px-10 py-2 border-3 border-transparent rounded-full relative mr-4 ${
                  scrolled ? 'bg-opacity-70' : 'bg-opacity-100'
                }`}
                style={{ 
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #2563eb, #9333ea) border-box',
                  borderWidth: '3px'
                }}
              >
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium text-base">
                  Dashboard
                </span>
              </button>
              <button 
                onClick={handleGetStarted}
                className="px-10 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-colors text-base"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 pl-0 md:pl-4">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Image 
                  src="/chrome-icon.png" 
                  alt="Chrome Extension" 
                  width={32} 
                  height={32}
                />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The #1 AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Chrome Extension</span>
              </h1>
              <p className="text-lg text-gray-700 mb-6 max-w-3xl pr-4">
                Solve complex homework questions on any website with the click of a button.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-10 py-3 rounded-full hover:shadow-lg transition-all flex items-center justify-center"
                >
                  Try For Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            
              {/* Stats */}
              <div className="flex items-center space-x-8 mb-8">
                <div>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">250K+</div>
                  <div className="text-sm text-gray-600">active users</div>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">20M+</div>
                  <div className="text-sm text-gray-600">questions solved</div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 relative pr-0 md:pr-4">
              <Image 
                src="/chrome-extension-hero.png" 
                alt="StudyLens AI Chrome Extension" 
                width={637} 
                height={455}
                className="rounded-lg shadow-2xl ml-auto mr-3"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Learning Platforms Section */}
      <div className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-8">
            Plugs Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Your Learning Platform</span>
          </h2>
          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            An AI chrome extension that supports 50+ learning platforms to help improve your study efficiency without breaking focus.
          </p>
          
          <div className="relative w-full overflow-hidden">
            <style jsx global>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .scroll-container {
                animation: scroll 25s linear infinite;
                width: max-content;
                display: flex;
                align-items: center;
              }
              .logo-item {
                height: 50px;
                margin: 0 30px;
                display: flex;
                align-items: center;
              }
              .logo-item img {
                height: 100%;
                width: auto !important;
                max-width: none !important;
                object-fit: contain;
              }
            `}</style>
            <div className="scroll-container py-6">
              {platformLogos.map((logo, index) => (
                <div key={index} className="logo-item">
                  <Image 
                    src={logo} 
                    alt={`Learning Platform ${index + 1}`} 
                    width={180} 
                    height={50}
                    style={{ height: index === 7 ? "32px" : "50px", width: "auto" }}
                    unoptimized
                  />
                </div>
              ))}
              {platformLogos.map((logo, index) => (
                <div key={`duplicate-${index}`} className="logo-item">
                  <Image 
                    src={logo} 
                    alt={`Learning Platform ${index + 1}`} 
                    width={180} 
                    height={50}
                    style={{ height: index === 7 ? "32px" : "50px", width: "auto" }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto mt-16">
            {learningPlatforms.map((platform, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-white p-6 rounded-xl shadow-lg mb-4 w-full flex items-center justify-center h-24" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
                  <Image 
                    src={platform.image}
                    alt={`${platform.name} Logo`}
                    width={120}
                    height={50}
                    style={{ height: "50px", width: "auto" }}
                    unoptimized
                  />
                </div>
                <span className="text-center font-medium">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Productivity Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Boost Your Productivity with AI Assistance
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
            The plugin helps you get accurate answers and explanations faster, so you have more free time.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
              <div className="mb-4">
                <ArrowRight className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Learn Directly In-Platform</h3>
              <p className="text-gray-700">
                Our button will appear next to all supported questions. Simply click it and the correct answer will be chosen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
              <div className="mb-4">
                <Camera className="h-10 w-10 p-2 bg-purple-100 text-purple-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Screenshot Any Question</h3>
              <p className="text-gray-700">
                Take a screenshot and we'll analyze the visual to give a direct solution.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
              <div className="mb-4">
                <Sparkles className="h-10 w-10 p-2 bg-yellow-100 text-yellow-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Going with Text Selection</h3>
              <p className="text-gray-700">
                Highlight any question for a textual response and explanation backed by reliable sources.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Students Love Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Students Love Our AI Chrome Extension
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="mb-4">
                <Shield className="h-10 w-10 p-2 bg-blue-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Impossible to Get Caught</h3>
              <p className="text-white/90">
                Camouflage mode ensures the extension remains completely undetectable, providing complete security.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="mb-4">
                <Zap className="h-10 w-10 p-2 bg-blue-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Uploading</h3>
              <p className="text-white/90">
                AI will reference your uploaded notes, slides, or textbooks to give you specific responses.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="mb-4">
                <Brain className="h-10 w-10 p-2 bg-blue-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Converse with the AI</h3>
              <p className="text-white/90">
                Have personalized conversations to clarify any doubts you have about your material.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Advanced Features */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            The most advanced features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
              <div className="mb-4">
                <Shield className="h-10 w-10 p-2 bg-green-100 text-green-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Don't Get Caught</h3>
              <p className="text-gray-700">
                Our software prevents websites from detecting our AI-powered quiz extension.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
              <div className="mb-4">
                <Zap className="h-10 w-10 p-2 bg-yellow-100 text-yellow-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get step by step explanations</h3>
              <p className="text-gray-700">
                Reinforce your learning with detailed guidance for each question.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
              <div className="mb-4">
                <Globe className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">15+ Languages Supported</h3>
              <p className="text-gray-700">
                Automatically detect languages, and get answers on the fly.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
              <div className="mb-4">
                <CheckCircle className="h-10 w-10 p-2 bg-green-100 text-green-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Auto Selects</h3>
              <p className="text-gray-700">
                All answers are backed by reliable internet sources.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
              <div className="mb-4">
                <Brain className="h-10 w-10 p-2 bg-purple-100 text-purple-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Ask follow-up questions</h3>
              <p className="text-gray-700">
                Get clarity on any topic with our interactive AI assistant.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
              <div className="mb-4">
                <Code className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Any Subject, Any Level</h3>
              <p className="text-gray-700">
                Get expert help, from beginner to advanced, tailored to your courses.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Steps to Get Started */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">
            3 simple steps to get started
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit the Chrome Web Store</h3>
              <p className="text-gray-600">Search for "StudyLens AI".</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add to chrome</h3>
              <p className="text-gray-600">Press the "Add to Chrome" button, confirm and install.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start solving</h3>
              <p className="text-gray-600">Solve anything with the click of a button.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            See what our students say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
                <div className="flex items-center mb-4">
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    width={48} 
                    height={48}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <span className="mr-1">{testimonial.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-3">{testimonial.review}</p>
                
                <div className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{testimonial.date}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center items-center gap-8 mt-12">
            <div className="text-center px-4 py-2 bg-white rounded-xl shadow-lg" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
              <div className="font-bold">BASED ON</div>
              <div className="flex items-center mt-2">
                <div className="mr-4">
                  <div className="text-sm text-gray-500">trustpilot</div>
                  <div className="font-bold">4.8/5</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">google reviews</div>
                  <div className="font-bold">4.9/5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto shadow-lg rounded-xl overflow-hidden" style={{ boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}>
            {faqs.map((faq, index) => (
              <FaqItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-2xl shadow-xl" style={{ boxShadow: '0 0 30px 0 rgba(0,0,0,0.15)' }}>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <div className="text-xl mb-2">250K+ students trust us</div>
            <h2 className="text-3xl font-bold mb-6">
              Ready to fast-track your homework?
            </h2>
            <p className="text-xl mb-8">
              Save hours on homework and never worry about exams ever again.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Image 
                  src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dac9f10fee532eb38351.png" 
                  alt="StudyLens AI" 
                  width={45} 
                  height={45} 
                  className="mr-2" 
                />
                <div>
                  <div className="font-bold text-xl">StudyLens AI</div>
                  <div className="text-sm text-gray-400">Instant, Expert Homework Help.</div>
                </div>
              </div>
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={handleGetStarted}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                >
                  Get Started Free
                </button>
              </div>
              <div className="flex gap-4">
                <Image src="/images/chrome-store-badge.png" alt="Chrome Web Store" width={120} height={40} />
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><Link href="/#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</Link></li>
                <li><Link href="/#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help-center" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/acceptable-use" className="text-gray-400 hover:text-white transition-colors">Acceptable Use</Link></li>
                <li><Link href="/academic-honesty" className="text-gray-400 hover:text-white transition-colors">Academic Honesty</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            <p>Copyright © {new Date().getFullYear()}, StudyLens AI</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-lg"
      >
        {question}
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
} 