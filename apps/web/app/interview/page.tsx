"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/components/header"
// import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Brain,
  CheckCircle,
  FileText,
  Clock,
  Users,
  BarChart,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { appRoutes } from "@/lib/routes";

interface InterviewFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay: number;
  stats: string;
  benefits: string[];
}

interface AdditionalFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export default function InterviewPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRedirect = () => {
    window.location.href = appRoutes.hrLogin;
  };

  const interviewFeatures: InterviewFeature[] = [
    {
      icon: Brain,
      title: "AI Interview Assistant",
      description:
        "Leverage intelligent question sets tailored to job profiles, capturing real-time voice and text responses with advanced NLP processing.",
      color: "from-purple-500 to-pink-500",
      delay: 0.1,
      stats: "80% accuracy",
      benefits: [
        "Smart question generation",
        "Real-time analysis",
        "Multi-language support",
      ],
    },
    {
      icon: CheckCircle,
      title: "Automated Candidate Scoring",
      description:
        "Automatically score and rank candidates based on relevance and accuracy, cutting screening time by 80% with ML algorithms.",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2,
      stats: "80% time saved",
      benefits: ["Instant scoring", "Bias reduction", "Standardized evaluation"],
    },
    {
      icon: FileText,
      title: "Candidate Verification",
      description:
        "Real-time verifications and fraud checks ensure trust and reduce hiring risks with instant background verification reports.",
      color: "from-green-500 to-emerald-600",
      delay: 0.3,
      stats: "99.9% accuracy",
      benefits: ["Identity verification", "Document validation", "Reference checks"],
    },
    {
      icon: Clock,
      title: "Solve Hiring Roadblocks",
      description:
        "Eliminate time-consuming scheduling, inconsistent evaluations, and poor feedback tracking with comprehensive AI automation.",
      color: "from-orange-500 to-red-500",
      delay: 0.4,
      stats: "24/7 availability",
      benefits: ["Auto scheduling", "Consistent evaluation", "Real-time feedback"],
    },
  ];

  const additionalFeatures: AdditionalFeature[] = [
    {
      icon: Users,
      title: "Multi-Interviewer Support",
      description: "Coordinate panel interviews with multiple stakeholders seamlessly",
      color: "from-teal-500 to-blue-500",
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Comprehensive hiring metrics and performance insights",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with GDPR and SOC2 compliance",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Integration Ready",
      description: "Seamless integration with existing ATS and HR systems",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const processSteps: ProcessStep[] = [
    {
      step: "01",
      title: "Setup Interview",
      description: "Configure job-specific questions and evaluation criteria",
    },
    {
      step: "02",
      title: "Candidate Interaction",
      description: "AI conducts structured interviews with real-time analysis",
    },
    {
      step: "03",
      title: "Automated Scoring",
      description: "Generate comprehensive candidate reports and rankings",
    },
    {
      step: "04",
      title: "Decision Support",
      description: "Receive actionable insights for hiring decisions",
    },
  ];

  return (
    <>
      <Head>
        <title>Smart Interview Scheduling & Evaluation Tool | RecruitExe</title>
        <meta name="description" content="Automate interview scheduling and candidate evaluation with RecruitExe. Reduce delays, boost hiring efficiency, and simplify your recruitment process." />
        <link rel="canonical" href="https://www.recruitexe.com/interview" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Smart Interview Scheduling & Evaluation Tool | RecruitExe" />
        <meta property="og:description" content="Automate interview scheduling and candidate evaluation with RecruitExe. Reduce delays, boost hiring efficiency, and simplify your recruitment process." />
        <meta property="og:url" content="https://www.recruitexe.com/interview" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.recruitexe.com/vector.svg" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Smart Interview Scheduling & Evaluation Tool | RecruitExe" />
        <meta name="twitter:description" content="Automate interview scheduling and candidate evaluation with RecruitExe. Reduce delays, boost hiring efficiency, and simplify your recruitment process." />
        <meta name="twitter:image" content="https://www.recruitexe.com/vector.svg" />
        
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["Organization", "LocalBusiness"],
                  "name": "RecruitExe",
                  "alternateName": "RecruitExe",
                  "url": "https://www.recruitexe.com/",
                  "logo": "https://www.recruitexe.com/vector.svg",
                  "image": "https://www.recruitexe.com/vector.svg",
                  "telephone": "+91 9302075637",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "207-210, Diamond Trade Centre, 3-4 Diamond Colony, New Palasia",
                    "addressLocality": "Indore",
                    "postalCode": "452001",
                    "addressCountry": "IN"
                  },
                  "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday"
                    ],
                    "opens": "00:00",
                    "closes": "23:59"
                  }
                },
                {
                  "@type": "WebSite",
                  "name": "RecruitExe",
                  "url": "https://www.recruitexe.com",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.recruitexe.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://www.recruitexe.com/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Interview Module",
                      "item": "https://www.recruitexe.com/interview"
                    }
                  ]
                }
              ]
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <Header />

        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white font-medium">
                  AI-Powered Interview Solutions
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6"
              >
                AI-Powered Interview Scheduling & Evaluation for Faster Hiring with{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  RecruitExe
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8"
              >
                Streamline your interview process with AI-powered automation,
                real-time verification, and instant candidate insights. Reduce
                hiring time by 80% while improving candidate quality.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  onClick={handleRedirect}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 80, 0],
                y: [0, -60, 0],
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-20 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -60, 0],
                y: [0, 80, 0],
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 w-96 h-96 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"
            />
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              />
            ))}
          </div>

          <div className="relative z-10 container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="mb-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interviewFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{
                      opacity: isVisible ? 1 : 0,
                      y: isVisible ? 0 : 20,
                      scale: isVisible ? 1 : 0.9,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: feature.delay + 0.3,
                      ease: "easeOut",
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group relative"
                  >
                    <motion.div
                      animate={{
                        y: hoveredCard === index ? -5 : 0,
                        scale: hoveredCard === index ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="relative bg-white/8 backdrop-blur-xl rounded-2xl border border-white/15 p-6 overflow-hidden cursor-pointer hover:border-white/25 transition-all duration-300 h-full"
                    >
                      <motion.div
                        animate={{
                          opacity: hoveredCard === index ? 0.2 : 0,
                          scale: hoveredCard === index ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className={`absolute -inset-1 bg-gradient-to-r ${feature.color} blur-lg rounded-2xl`}
                      />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <motion.div
                            animate={{
                              scale: hoveredCard === index ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} shadow-lg`}
                          >
                            <feature.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <div className="text-right">
                            <span className="text-xs text-gray-400 uppercase tracking-wide">
                              Performance
                            </span>
                            <div className="text-sm font-bold text-white">
                              {feature.stats}
                            </div>
                          </div>
                        </div>
                        <h3 className="text-lg font-black text-white mb-3 group-hover:text-cyan-200 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors duration-300 mb-4">
                          {feature.description}
                        </p>
                        <div className="space-y-2">
                          {feature.benefits.map((benefit, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs text-gray-400"
                            >
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Process Steps */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-white mb-4">
                  How It Works
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Our streamlined process ensures efficient and effective candidate
                  evaluation in just four simple steps.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                    className="relative text-center"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">
                          {step.step}
                        </span>
                      </div>
                      <h3 className="text-white font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-300 text-sm">{step.description}</p>
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Additional Features */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-white mb-4">
                  Advanced Capabilities
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Comprehensive features designed to enhance every aspect of your
                  interview process.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {additionalFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                    >
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-bold mb-2 group-hover:text-cyan-200 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm group-hover:text-gray-100 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* <Footer /> */}
      </div>
    </>
  );
}
