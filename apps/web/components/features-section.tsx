"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Users, BarChart3, FileText, Zap, Globe, Target, MessageCircle, Linkedin, Mail } from "lucide-react"

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const SCROLL_DURATION = 8000
  const USER_INTERACTION_PAUSE = 5000 // Pause auto-scroll for 5 seconds after user interaction

  const skills = [
    {
      icon: Bot,
      title: "AI Candidate Screening",
      description: "Automatically screen and rank candidates based on your specific requirements.",
      color: "from-purple-500 to-pink-500",
      features: ["Smart Resume Parsing", "Skill Matching", "Culture Fit Analysis"],
    },
    {
      icon: Users,
      title: "Applicant Tracking System",
      description: "Streamlined ATS to manage your screening pipeline from application to shortlisting.",
      color: "from-blue-500 to-cyan-500",
      features: ["Pipeline Management", "Status Tracking", "Custom Workflows"],
    },
    {
      icon: BarChart3,
      title: "Screening Analytics",
      description: "Deep insights into your screening metrics and performance tracking.",
      color: "from-orange-500 to-red-500",
      features: ["Performance Metrics", "Time-to-Hire", "Success Rates"],
    },
    {
      icon: FileText,
      title: "Resume Intelligence",
      description: "AI-powered resume parsing and candidate matching for best fits.",
      color: "from-indigo-500 to-purple-500",
      features: ["Smart Parsing", "Skill Extraction", "Quality Scoring"],
    },
    {
      icon: Zap,
      title: "Workflow Automation",
      description: "Automate repetitive screening tasks and candidate status updates.",
      color: "from-yellow-500 to-orange-500",
      features: ["Auto-Responses", "Status Updates", "Email Sequences"],
    },
    {
      icon: Globe,
      title: "Multi-Platform Posting",
      description: "Post jobs across multiple job boards and social platforms.",
      color: "from-teal-500 to-blue-500",
      features: ["Job Board Integration", "Social Media", "One-Click Publishing"],
    },
    {
      icon: Target,
      title: "Candidate Sourcing",
      description: "Advanced search and sourcing tools to find passive candidates.",
      color: "from-pink-500 to-rose-500",
      features: ["Advanced Search", "Boolean Queries", "Talent Pools"],
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Integration",
      description: "Seamlessly communicate with candidates through WhatsApp for instant updates and engagement.",
      color: "from-green-500 to-emerald-500",
      features: ["Automated Messages", "Status Updates", "Interview Reminders"],
    },
    {
      icon: Linkedin,
      title: "LinkedIn Integration",
      description:
        "Post jobs directly from your portal with customizable templates and advanced scheduling capabilities for maximum reach.",
      color: "from-blue-600 to-indigo-600",
      features: ["Direct Job Posting", "Custom Post Templates", "Scheduled Publishing"],
    },
    {
      icon: Mail,
      title: "Email Integration",
      description: "One-click email communication system for instant candidate outreach.",
      color: "from-slate-500 to-gray-600",
      features: ["One-Click Candidate Email", "Smart Quick Responses", "Instant Communication"],
    },
  ]

  // Initial setup - ensure first feature is properly positioned
  useEffect(() => {
    const initializePosition = () => {
      if (scrollContainerRef.current && featureRefs.current[0]) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
          })
          setActiveFeature(0)
        }, 100)
      }
    }

    initializePosition()
  }, [])

  // Update the scroll-based active feature detection useEffect:
  useEffect(() => {
    if (!scrollContainerRef.current || isUserInteracting) return

    const container = scrollContainerRef.current

    const updateActiveFeature = () => {
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.top + containerRect.height / 2

      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      featureRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const elementCenter = rect.top + rect.height / 2
          const distance = Math.abs(elementCenter - containerCenter)

          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
          }
        }
      })

      // Only update if the index has actually changed
      if (closestIndex !== activeFeature) {
        setActiveFeature(closestIndex)
      }
    }

    const handleScroll = () => {
      // Throttle the scroll updates for better performance
      requestAnimationFrame(updateActiveFeature)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })

    // Initial call with a delay to ensure elements are rendered
    setTimeout(updateActiveFeature, 100)

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [activeFeature, isUserInteracting])

  // Replace the existing auto-scroll useEffect with this improved version:
  useEffect(() => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    let currentPosition = 0
    const scrollSpeed = 0.3
    let animationId: number
    let isPaused = false

    const smoothScroll = () => {
      if (!isPaused && !isUserInteracting) {
        const totalHeight = container.scrollHeight - container.clientHeight
        const maxScroll = totalHeight + 100

        currentPosition += scrollSpeed

        if (currentPosition >= maxScroll) {
          currentPosition = 0
        }

        container.scrollTop = Math.min(currentPosition, totalHeight)
      }

      animationId = requestAnimationFrame(smoothScroll)
    }

    // Pause scrolling when user hovers over the container
    const handleMouseEnter = () => {
      isPaused = true
    }

    const handleMouseLeave = () => {
      isPaused = false
    }

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    const timeoutId = setTimeout(() => {
      container.scrollHeight
      animationId = requestAnimationFrame(smoothScroll)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isUserInteracting])

  const goToFeature = (index: number) => {
    // Set user interaction state to pause auto-scroll
    setIsUserInteracting(true)

    // Clear any existing timeout
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current)
    }

    // Immediately set the active feature
    setActiveFeature(index)

    if (featureRefs.current[index] && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const targetElement = featureRefs.current[index]

      if (targetElement) {
        const containerRect = container.getBoundingClientRect()
        const targetRect = targetElement.getBoundingClientRect()
        const scrollTop = container.scrollTop
        const targetPosition =
          scrollTop + targetRect.top - containerRect.top - containerRect.height / 2 + targetRect.height / 2

        container.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth",
        })
      }
    }

    // Resume auto-scroll after user interaction pause
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false)
    }, USER_INTERACTION_PAUSE)
  }

  const smoothEasing = [0.25, 0.46, 0.45, 0.94]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -120, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            y: [0, 100, 0],
            x: [0, -50, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: smoothEasing }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Skills of{" "}
            <span className="relative inline-block">
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent"
                style={{ backgroundSize: "300% 100%" }}
              >
                RecruitExe
              </motion.span>
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-violet-400/20 blur-lg rounded-lg"
              />
            </span>
          </motion.h1>
        </motion.div>

        {/* Skills Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Scrollable Feature List */}
          <div className="relative">
            {/* Scroll Container */}
            <div
              ref={scrollContainerRef}
              className="h-[600px] overflow-y-auto scrollbar-hide space-y-4 pr-4 pt-2 pb-20"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  ref={(el) => (featureRefs.current[index] = el)}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative cursor-pointer transition-all duration-500 ${
                    activeFeature === index ? "scale-105" : "hover:scale-102"
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    goToFeature(index)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ pointerEvents: "auto" }}
                >
                  <div
                    className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500 ${
                      activeFeature === index
                        ? "bg-white/10 border-white/30 shadow-2xl"
                        : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div
                        animate={{
                          scale: activeFeature === index ? 1.1 : 1,
                          rotate: activeFeature === index ? [0, 5, -5, 0] : 0,
                        }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${skill.color} shadow-lg`}
                      >
                        {(() => {
                          const IconComponent = skill.icon
                          return <IconComponent className="w-6 h-6 text-white" />
                        })()}
                      </motion.div>

                      <div className="flex-1">
                        <h3
                          className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                            activeFeature === index ? "text-white" : "text-slate-200"
                          }`}
                        >
                          {skill.title}
                        </h3>
                        <p
                          className={`text-sm leading-relaxed transition-colors duration-300 ${
                            activeFeature === index ? "text-slate-300" : "text-slate-400"
                          }`}
                        >
                          {skill.description}
                        </p>
                      </div>

                      {/* Active Indicator */}
                      <AnimatePresence>
                        {activeFeature === index && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg"
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Progress Bar */}
                    {activeFeature === index && !isUserInteracting && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: SCROLL_DURATION / 1000, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full origin-left"
                        style={{ width: "100%" }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Add extra padding at the bottom to ensure last items are reachable */}
              <div className="h-32" />
            </div>

            {/* Scroll Indicators */}
            <div className="absolute right-0 top-0 h-full flex flex-col justify-center space-y-2 pr-2">
              {skills.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-1 h-8 rounded-full transition-all duration-300 cursor-pointer ${
                    activeFeature === index ? "bg-gradient-to-b from-purple-400 to-pink-400" : "bg-white/20"
                  }`}
                  animate={{
                    scale: activeFeature === index ? 1.2 : 1,
                    opacity: activeFeature === index ? 1 : 0.5,
                  }}
                  onClick={() => goToFeature(index)}
                />
              ))}
            </div>

            {/* Gradient Overlays for Scroll Effect */}
            <div className="absolute top-0 left-0 right-4 h-4 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-4 h-4 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none z-10" />
          </div>

          {/* Right Side - Feature Details */}
          <div className="relative sticky top-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.6, ease: smoothEasing }}
                className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl"
              >
                {/* Feature Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-r ${skills[activeFeature].color} shadow-2xl mb-6 mx-auto`}
                >
                  {(() => {
                    const IconComponent = skills[activeFeature].icon
                    return <IconComponent className="w-10 h-10 text-white" />
                  })()}
                </motion.div>

                {/* Feature Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-3xl font-bold text-white text-center mb-4"
                >
                  {skills[activeFeature].title}
                </motion.h2>

                {/* Feature Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-slate-300 text-center mb-8 text-lg leading-relaxed"
                >
                  {skills[activeFeature].description}
                </motion.p>

                {/* Feature List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-3"
                >
                  {skills[activeFeature].features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${skills[activeFeature].color}`} />
                      <span className="text-slate-200 font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-sm"
                />
                <motion.div
                  animate={{
                    rotate: [360, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 blur-sm"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Dots */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex justify-center space-x-3 mt-16"
        >
          {skills.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToFeature(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeFeature === index
                  ? "bg-gradient-to-r from-purple-400 to-pink-400 scale-125"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
