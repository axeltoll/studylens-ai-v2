"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ChevronRight, Star, ExternalLink, ChevronDown, Brain, Sparkles, Code, Play, Zap, Camera, Clock, Check, Shield, Timer } from "lucide-react";
import LoginModal from "@/app/components/LoginModal";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/lib/hooks/useAuth";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"login" | "signup">("signup");
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Calculate time until April 20, 2025
  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadline = new Date("April 20, 2025 23:59:59").getTime();
      const now = new Date().getTime();
      const difference = deadline - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
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
  
  const platformLogos = [
    { 
      name: "Canvas", 
      url: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e3202dd309346e7.png",
      small: false 
    },
    { 
      name: "Blackboard", 
      url: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f45fd30e320270369d6b15.png",
      small: false 
    },
    { 
      name: "Google Classroom",
      url: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e3202da2f9346e6.png",
      small: false 
    },
    { 
      name: "Sakai", 
      url: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e3202d9ae9346e8.png",
      small: false 
    },
    { 
      name: "Moodle", 
      url: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f45fe20e3202a3999d6b17.png",
      small: false 
    },
    { 
      name: "D2L", 
      url: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1ef10fee3a68b384d7.png",
      small: false 
    },
    { 
      name: "Schoology", 
      url: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f45ffcf10fee6d44b478fc.png",
      small: false 
    },
    { 
      name: "ClassMarker", 
      url: "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f4603ce06ab0a3c3f7bffa.png",
      small: true 
    }
  ];

  // Updated logos without duplicates and higher quality images
  const updatedPlatformLogos = [
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e3202dd309346e7.png", // Canvas
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f45fd30e320270369d6b15.png", // Blackboard (higher quality)
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e3202da2f9346e6.png", // Google Classroom
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e3202d9ae9346e8.png", // Sakai
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f45fe20e3202a3999d6b17.png", // Moodle (higher quality)
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1ef10fee3a68b384d7.png", // D2L
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f45ffcf10fee6d44b478fc.png", // Schoology (higher quality)
    "https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f4603ce06ab0a3c3f7bffa.png"  // ClassMarker (higher quality)
  ];

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
      review: "This extension is fantastic for studying",
      date: "Jun 14, 2024",
      avatar: "/testimonials/avatar6.jpg",
      rating: 5,
      university: "University of Texas"
    }
  ];

  const faqs = [
    {
      question: "With a subscription, will I have access to the suite of StudyLens AI products?",
      answer: "Yes, your subscription gives you unlimited access to all StudyLens AI products including our Chrome extension, mobile app, and web dashboard. Use them all to maximize your academic success."
    },
    {
      question: "Will my school be able to detect that I'm using this software?",
      answer: "StudyLens AI is designed with privacy in mind. Our software doesn't leave digital fingerprints and uses advanced technology to prevent detection by university monitoring systems."
    },
    {
      question: "What makes our AI tools stand out from our competitors?",
      answer: "We use state-of-the-art AI models specifically trained on academic content. Our tools provide not just answers but detailed explanations to help you understand the material, with 98% accuracy and support for 15+ languages."
    },
    {
      question: "Can I get a refund if I don't like it?",
      answer: "Yes! We offer a satisfaction guarantee. If you're not completely satisfied with our service, contact us within 7 days of purchase for a full refund."
    },
    {
      question: "Is my chat and personal information about me kept safe?",
      answer: "Absolutely. We employ enterprise-grade encryption and strict privacy policies. Your personal information and academic data are never shared with third parties."
    },
    {
      question: "Can the tools walk me through my homework questions?",
      answer: "Yes, our AI provides step-by-step solutions with detailed explanations for all subjects. Whether it's math, science, history, or programming, you'll receive comprehensive guidance."
    }
  ];

  const handleGetStarted = () => {
    setModalType("signup");
    setShowModal(true);
  };

  const handleDashboardClick = () => {
    if (user) {
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
          <div className={`flex justify-between items-center bg-white ${scrolled ? 'bg-opacity-70' : 'bg-opacity-100'} rounded-2xl py-3 px-6 shadow-lg shadow-gray-200/50`} style={{ backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 relative">
                  <Image
                    src="/images/StudyLens-AI-Logo-V1-Square-396-349-White.png"
                    alt="StudyLens AI Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                </div>
                <span className="font-bold text-lg hidden md:inline text-white">StudyLens AI</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="#features" className="text-gray-700 hover:text-blue-600 font-medium">Features</Link>
                <Link href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</Link>
                <Link href="#faq" className="text-gray-700 hover:text-blue-600 font-medium">FAQ</Link>
                <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 font-medium">Chrome Extension</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleDashboardClick}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Instant, Expert AI Homework Helper
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Get instant, accurate answers and step-by-step explanations for all your homework questions. Our AI technology works with all major learning platforms.
          </p>
          
          {/* USP Features List */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex flex-col gap-3">
              <FeatureCheck text="Get instant step-by-step solutions for any subject" />
              <FeatureCheck text="Undetectable by university monitoring systems" />
              <FeatureCheck text="Works with all major learning platforms and question types" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl"
            >
              Start with Free Plan
            </button>
            <a 
              href="https://chrome.google.com/webstore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-white border-2 border-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-xl hover:bg-gray-50"
            >
              Get Chrome Extension
            </a>
          </div>
          
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Satisfaction guaranteed</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>24/7 customer support</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg max-w-5xl mx-auto">
              <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden mb-8">
                <Image
                  src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dd1e0e320290459346e9.png"
                  alt="StudyLens AI Homework Helper Interface"
                  width={1200}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">98%</div>
                  <div className="text-sm text-gray-600">Accurate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">30M</div>
                  <div className="text-sm text-gray-600">Questions Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">4.8</div>
                  <div className="text-sm text-gray-600">Rated by students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Logo animation */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-12">Works with All Major Learning Platforms</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {platformLogos.map((logo, index) => (
              <div key={index} className={`flex items-center justify-center ${logo.small ? 'w-20 h-20' : 'w-28 h-28'}`}>
                <Image 
                  src={logo.url} 
                  alt={logo.name} 
                  width={logo.small ? 80 : 112}
                  height={logo.small ? 80 : 112}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Chrome Extension Feature */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
                Chrome Extension
              </div>
              <h2 className="text-3xl font-bold mb-6">One-click answers — without switching tabs</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl mb-2">Get answers from wherever you are, and just ask with one click.</h3>
                  <p className="text-gray-600">Accurate problem solving and guided reasoning</p>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Fully guided explanations and step-by-step reasoning to explain any subject.</h3>
                  <p className="text-gray-600">Add context from your study materials</p>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Upload guidebooks or lecture PDFs before a test and get tailored-specific answers.</h3>
                  <p className="text-gray-600">Follow up with your personal AI</p>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Open the AI chat on any website and ask any question you have for deepened understanding!</h3>
                </div>
              </div>
              <Link href="#" className="inline-flex items-center mt-8 text-blue-600 font-medium hover:text-blue-700">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-gray-100 rounded-2xl p-6 relative">
              <div className="aspect-[3/2] bg-white rounded-xl overflow-hidden shadow-md">
                <Image
                  src="https://placehold.co/800x600/e2e8f0/1e3a8a/png?text=Chrome+Extension+Preview"
                  alt="Chrome Extension Preview"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg">
                <p className="text-sm font-medium">Chrome Extension Available in the Chrome Extension Store</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mobile App Feature */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <Image
                  src="https://placehold.co/600x800/ffffff/1e3a8a/png?text=StudyLens+AI+Mobile+App"
                  alt="StudyLens AI Mobile App"
                  width={600}
                  height={800}
                  className="w-full rounded-xl"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Scan & Solve All Subjects</h2>
              <p className="text-lg text-gray-600 mb-6">Simply take a picture and get an answer instantly.</p>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="ml-2 text-gray-600">4.8 • on the App Store</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-6">20,000,000+</div>
              <p className="text-gray-600 mb-6">questions answered</p>
              <Link href="#" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Study Chat Feature */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <Brain className="h-10 w-10 text-blue-600 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Study Chat for all your curricular needs</h3>
              <p className="text-gray-700 mb-6">
                The #1 voted AI homework helper for students at any academic level. Breaks down math and complex subjects better than any chatbot.
              </p>
              <Link href="#" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                Explore Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8">
              <Sparkles className="h-10 w-10 text-purple-600 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Perfect Essays in a Click</h3>
              <p className="text-gray-700 mb-6">
                Activate the AI Homework Helper's Essay Mode to generate essays in seconds. Create A+ essays instantly, with expert touch, smart suggestions, and perfect readability.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-2xl p-8">
              <Code className="h-10 w-10 text-green-600 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Write, Run, Debug—All in One</h3>
              <p className="text-gray-700 mb-6">
                Use the AI Homework Helper's Code Generator to create, run, and debug code. Instantly generate code, run it, and improve it with comments and logs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Tools Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">The last AI tools you'll ever need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Don't Get Caught</h3>
              <p className="text-gray-600">
                Our software prevents websites from detecting our AI-powered quiz extension for private academic assistance.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Play className="h-12 w-12 text-blue-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Get step by step explanations</h3>
              <p className="text-gray-600">
                Reinforce your learning with detailed, step-by-step guidance for each question to build true understanding.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Reliable Answer Accuracy</h3>
              <p className="text-gray-600">
                Backed by the latest generation of AI and custom trained models to bring near perfect answers to your questions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20" id="testimonials">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center">Trusted by Thousands of students worldwide</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                      <Image
                        src={testimonial.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.review}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{testimonial.university}</span>
                  <span>{testimonial.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-white" id="pricing">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center">Choose the Perfect Plan for You</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Forever Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="text-sm text-gray-500 mb-2">No Credit Card Required</div>
              <h3 className="text-2xl font-bold mb-4">Free Forever</h3>
              <div className="text-lg text-gray-600 mb-6">Basic access</div>
              <p className="mb-8 text-gray-600">Perfect for occasional help with homework</p>
              <div className="text-3xl font-bold mb-8">$0 <span className="text-lg font-normal text-gray-500">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-600">Limited questions per day</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <CheckCircle className="h-5 w-5 text-gray-300 mr-3 mt-0.5" />
                  <span>Deep research (Pro only)</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <CheckCircle className="h-5 w-5 text-gray-300 mr-3 mt-0.5" />
                  <span>Custom curriculum knowledge (Pro only)</span>
                </li>
              </ul>
              <button 
                onClick={handleGetStarted}
                className="w-full py-3 px-4 bg-white border-2 border-gray-200 text-blue-600 font-semibold rounded-xl hover:bg-gray-50"
              >
                Sign Up Free
              </button>
              <div className="text-sm text-center text-gray-500 mt-4">No credit card required</div>
            </div>

            {/* 3 Day Free Trial */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                Offer valid until April 20th, 2025
              </div>
              <div className="text-sm opacity-80 mb-2">3 days FREE</div>
              <h3 className="text-2xl font-bold mb-4">Unlimited access</h3>
              <p className="mb-8 text-blue-100">
                Lock in your special price of $9.95/month before it increases to $14.95/month after April 20, 2025
              </p>
              <div className="text-3xl font-bold mb-8">
                <span className="line-through text-blue-200 text-xl mr-2">$14.95</span>
                $9.95 <span className="text-lg font-normal opacity-80">/month</span>
              </div>
              
              {/* Countdown Timer moved below price box */}
              <div className="grid grid-cols-4 gap-2 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs">Days</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                  <div className="text-2xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs">Hours</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                  <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs">Minutes</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                  <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs">Seconds</div>
                </div>
              </div>
              
              <button
                onClick={handleGetStarted}
                className="w-full py-3 px-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50"
              >
                Get Started Free
              </button>
              <div className="text-sm text-center mt-4 text-blue-100">
                Cancel anytime | Renews at $9.95/month
              </div>
              
              <div className="flex justify-between mt-6 pt-6 border-t border-white/20">
                <Image src="https://placehold.co/40x25/ffffff/ffffff/png?text=Visa" alt="Visa" width={40} height={25} className="h-6 w-auto" />
                <Image src="https://placehold.co/40x25/ffffff/ffffff/png?text=MC" alt="Mastercard" width={40} height={25} className="h-6 w-auto" />
                <Image src="https://placehold.co/40x25/ffffff/ffffff/png?text=Amex" alt="American Express" width={40} height={25} className="h-6 w-auto" />
                <Image src="https://placehold.co/40x25/ffffff/ffffff/png?text=Disc" alt="Discover" width={40} height={25} className="h-6 w-auto" />
                <Image src="https://placehold.co/40x25/ffffff/ffffff/png?text=PayPal" alt="PayPal" width={40} height={25} className="h-6 w-auto" />
                <Image src="https://placehold.co/40x25/ffffff/ffffff/png?text=ApplePay" alt="Apple Pay" width={40} height={25} className="h-6 w-auto" />
                <Image src="https://placehold.co/40x25/ffffff/ffffff/png?text=GPay" alt="Google Pay" width={40} height={25} className="h-6 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20" id="faq">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to fast-track your homework?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Save hours on homework and never worry about exams ever again.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl"
          >
            Get Started Free
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-white text-xl font-bold mb-6">StudyLens AI</h2>
              <p className="mb-6 text-gray-400">Instant, Expert Homework Help.</p>
              <div className="space-y-3">
                <button 
                  onClick={handleGetStarted}
                  className="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Get Started - It's Free
                </button>
                <div className="flex space-x-4">
                  <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white">
                    Chrome Web Store
                  </a>
                  <a href="#" className="text-sm text-gray-400 hover:text-white">
                    App Store
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</Link></li>
                <li><Link href="#faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Sign Up</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Acceptable Use</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Academic Honesty</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            Copyright © {new Date().getFullYear()}, StudyLens AI
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCheck({ text }: { text: string }) {
  return (
    <div className="flex items-center">
      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-lg px-6" >
        {question}
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3 px-6 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}
