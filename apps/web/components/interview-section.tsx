"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, CheckCircle, FileText, Clock, Users, BarChart3, Shield, Zap, ArrowRight, Star } from "lucide-react"

export function InterviewSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const interviewFeatures = [
    {
      icon: Brain,
      title: "AI Interview Assistant",
      description: "Leverage intelligent question sets tailored to job profiles, capturing real-time voice and text responses with advanced NLP processing.",
      color: "from-purple-500 to-pink-500",
      delay: 0.1,
      stats: "95% accuracy",
      benefits: ["Smart question generation", "Real-time analysis", "Multi-language support"]
    },
    {
      icon: CheckCircle,
      title: "Automated Candidate Scoring",
      description: "Automatically score and rank candidates based on relevance and accuracy, cutting screening time by 80% with ML algorithms.",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2,
      stats: "80% time saved",
      benefits: ["Instant scoring", "Bias reduction", "Standardized evaluation"]
    },
    {
      icon: FileText,
      title: "Candidate Verification",
      description: "Real-time verifications and fraud checks ensure trust and reduce hiring risks with instant background verification reports.",
      color: "from-green-500 to-emerald-500",
      delay: 0.3,
      stats: "99.9% accuracy",
      benefits: ["Identity verification", "Document validation", "Reference checks"]
    },
    {
      icon: Clock,
      title: "Solve Hiring Roadblocks",
      description: "Eliminate time-consuming scheduling, inconsistent evaluations, and poor feedback tracking with comprehensive AI automation.",
      color: "from-orange-500 to-red-500",
      delay: 0.4,
      stats: "24/7 availability",
      benefits: ["Auto scheduling", "Consistent evaluation", "Real-time feedback"]
    },
  ]

  const additionalFeatures = [
    {
      icon: Users,
      title: "Multi-Interviewer Support",
      description: "Coordinate panel interviews with multiple stakeholders seamlessly",
      color: "from-teal-500 to-blue-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive hiring metrics and performance insights",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with GDPR and SOC2 compliance",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Integration Ready",
      description: "Seamless integration with existing ATS and HR systems",
      color: "from-yellow-500 to-orange-500"
    }
  ]

  const processSteps = [
    {
      step: "01",
      title: "Setup Interview",
      description: "Configure job-specific questions and evaluation criteria"
    },
    {
      step: "02",
      title: "Candidate Interaction",
      description: "AI conducts structured interviews with real-time analysis"
    },
    {
      step: "03",
      title: "Automated Scoring",
      description: "Generate comprehensive candidate reports and rankings"
    },
    {
      step: "04",
      title: "Decision Support",
      description: "Receive actionable insights for hiring decisions"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0], scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
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
            animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: "easeInOut" }}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white font-medium">AI-Powered Interview Solutions</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
          >
            Transform Interviews with{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              RecruitExe
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8"
          >
            Streamline your interview process with AI-powered automation, real-time verification, and instant candidate insights. 
            Reduce hiring time by 80% while improving candidate quality.
          </motion.p>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
              Watch Demo
            </button>
          </motion.div> */}
        </div>

        {/* Main Features Grid */}
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
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20, scale: isVisible ? 1 : 0.9 }}
                transition={{ duration: 0.6, delay: feature.delay + 0.3, ease: "easeOut" }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative"
              >
                <motion.div
                  animate={{ y: hoveredCard === index ? -5 : 0, scale: hoveredCard === index ? 1.02 : 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative bg-white/8 backdrop-blur-xl rounded-2xl border border-white/15 p-6 overflow-hidden cursor-pointer hover:border-white/25 transition-all duration-300 h-full"
                >
                  <motion.div
                    animate={{ opacity: hoveredCard === index ? 0.2 : 0, scale: hoveredCard === index ? 1.05 : 1 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute -inset-1 bg-gradient-to-r ${feature.color} blur-lg rounded-2xl`}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
                        transition={{ duration: 0.3 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} shadow-lg`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Performance</span>
                        <div className="text-sm font-bold text-white">{feature.stats}</div>
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
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
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
            <h2 className="text-3xl font-black text-white mb-4">How It Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our streamlined process ensures efficient and effective candidate evaluation in just four simple steps.
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
                    <span className="text-white font-bold text-lg">{step.step}</span>
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
            <h2 className="text-3xl font-black text-white mb-4">Advanced Capabilities</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Comprehensive features designed to enhance every aspect of your interview process.
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
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
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
    </div>
  )
}