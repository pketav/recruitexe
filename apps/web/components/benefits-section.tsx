"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Clock, 
  Target, 
  Shield, 
  Users, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Globe
} from "lucide-react"
import { appRoutes } from "@/lib/routes"

export function BenefitsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const benefits = [
    {
      icon: Clock,
      title: "Save Time & Resources",
      description: "Automate screening tasks and reduce manual effort by 70%. Streamline your entire recruitment pipeline with intelligent automation.",
      color: "from-purple-500 to-pink-500",
      delay: 0.1,
      stats: "70% faster",
      highlights: ["Automated screening", "Instant responses", "Bulk processing", "Smart scheduling"]
    },
    {
      icon: Target,
      title: "Improve Screening Quality",
      description: "AI screening delivers 10x faster results than human screening while maintaining superior accuracy and consistency.",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2,
      stats: "10x faster",
      highlights: ["AI-powered analysis", "Consistent evaluation", "Quality assurance", "Predictive insights"]
    },
    {
      icon: Shield,
      title: "Reduce Bias",
      description: "Objective AI evaluation minimizes human bias in screening, ensuring fair and equitable candidate assessment.",
      color: "from-green-500 to-emerald-500",
      delay: 0.3,
      stats: "98% objective",
      highlights: ["Bias elimination", "Fair evaluation", "Standardized criteria", "Inclusive hiring"]
    },
    {
      icon: Users,
      title: "Enhanced Candidate Experience",
      description: "Faster responses and transparent communication for all applicants, improving your employer brand.",
      color: "from-orange-500 to-red-500",
      delay: 0.4,
      stats: "24/7 support",
      highlights: ["Instant feedback", "Clear communication", "Mobile-friendly", "Real-time updates"]
    },
    {
      icon: DollarSign,
      title: "Significant Cost Savings",
      description: "AI employee is equal to 10 human resources, dramatically reducing recruitment costs and overhead.",
      color: "from-yellow-500 to-orange-500",
      delay: 0.5,
      stats: "90% cost cut",
      highlights: ["Reduced HR costs", "Lower overhead", "Efficient resource use", "ROI optimization"]
    },
    {
      icon: Zap,
      title: "24/7 Availability",
      description: "Round-the-clock screening and candidate management without breaks, ensuring continuous productivity.",
      color: "from-teal-500 to-blue-500",
      delay: 0.6,
      stats: "Always on",
      highlights: ["Continuous operation", "Global accessibility", "No downtime", "Instant processing"]
    },
    {
      icon: TrendingUp,
      title: "Scalable Solutions",
      description: "Handle any volume of applications with consistent quality and speed, from startups to enterprise.",
      color: "from-violet-500 to-purple-500",
      delay: 0.7,
      stats: "Unlimited scale",
      highlights: ["Volume handling", "Consistent quality", "Growth ready", "Enterprise grade"]
    },
    {
      icon: Award,
      title: "Data-Driven Insights",
      description: "Comprehensive analytics and reporting to optimize your hiring strategies and improve decision-making.",
      color: "from-pink-500 to-rose-500",
      delay: 0.8,
      stats: "Smart analytics",
      highlights: ["Performance metrics", "Hiring insights", "Trend analysis", "ROI tracking"]
    }
  ]

  const handleRedirect = () => {
    window.location.href = appRoutes.hrLogin
  }

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Enhanced Background Elements */}
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
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
         
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-6">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              RecruitExe
            </span>
          </h2>
          
          <p className="text-lg md:text-1xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
            Transform your recruitment process with AI-powered screening that delivers 
            exceptional results and measurable impact on your hiring success.
          </p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: "70%", label: "Time Saved", icon: Clock },
              { number: "98%", label: "Accuracy Rate", icon: Target },
              { number: "90%", label: "Cost Reduction", icon: DollarSign },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-lg text-gray-300">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 30,
                scale: isVisible ? 1 : 0.9,
              }}
              transition={{
                duration: 0.6,
                delay: benefit.delay + 0.3,
                ease: "easeOut",
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative"
            >
              <motion.div
                animate={{
                  y: hoveredCard === index ? -8 : 0,
                  scale: hoveredCard === index ? 1.02 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-white/8 backdrop-blur-xl rounded-2xl border border-white/15 p-6 overflow-hidden cursor-pointer hover:border-white/25 transition-all duration-300 h-full"
              >
                {/* Animated Background Glow */}
                <motion.div
                  animate={{
                    opacity: hoveredCard === index ? 0.2 : 0,
                    scale: hoveredCard === index ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  className={`absolute -inset-1 bg-gradient-to-r ${benefit.color} blur-lg rounded-2xl`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      animate={{
                        scale: hoveredCard === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${benefit.color} shadow-lg`}
                    >
                      <benefit.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 uppercase tracking-wide">
                        Impact
                      </span>
                      <div className="text-sm font-bold text-white">
                        {benefit.stats}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white mb-3 group-hover:text-cyan-200 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors duration-300 mb-4">
                    {benefit.description}
                  </p>

                  <div className="space-y-2">
                    {benefit.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-gray-400"
                      >
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        
      </div>
    </section>
  )
}
