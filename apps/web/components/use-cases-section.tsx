"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Rocket, Building2, Building, Users, Target, Landmark } from "lucide-react"

export function UseCasesSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    // Auto-highlight cards with longer interval
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % audiences.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const audiences = [
    {
      icon: Rocket,
      title: "Startups & Scale-ups",
      desc: "Fast hiring for growing teams",
      features: ["Quick scaling", "Efficient processes"],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Building2,
      title: "Medium Size Companies",
      desc: "Optimize recruitment costs",
      features: ["Multi-department", "Standardization"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Building,
      title: "Enterprise Organizations",
      desc: "Scalable compliance solutions",
      features: ["High-volume", "Global reach"],
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Users,
      title: "HR Teams & Managers",
      desc: "Streamline operations",
      features: ["Multi-openings", "Metrics tracking"],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Target,
      title: "Recruitment Agencies",
      desc: "Multiple client management",
      features: ["Fast matching", "Client analytics"],
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Landmark,
      title: "BFSI",
      desc: "Secure industry based talent",
      features: ["Compliance hiring", "Risk assessment"],
      color: "from-amber-500 to-yellow-500",
    },
  ]

  return (
    <div className=" bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Professional Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
            Who Is{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              RecruitExe
            </span>{" "}
            For?
          </h1>
        </motion.div>

        {/* Single Line Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => setActiveTab(index)}
              className="cursor-pointer group"
            >
              {/* Professional Card Design */}
              <motion.div
                animate={{
                  scale: activeTab === index ? 1.02 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`relative p-4 rounded-2xl transition-all duration-300 backdrop-blur-sm h-full ${
                  activeTab === index
                    ? "bg-white/10 border border-purple-400/30 shadow-xl shadow-purple-500/10"
                    : "bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20"
                }`}
              >
                {/* Subtle active glow */}
                {activeTab === index && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${audience.color} opacity-5 rounded-2xl`} />
                )}

                {/* Card Header */}
                <div className="flex flex-col items-center text-center mb-3 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-3 ${
                      activeTab === index
                        ? `bg-gradient-to-r ${audience.color} shadow-lg`
                        : "bg-white/10 group-hover:bg-white/15"
                    }`}
                  >
                    <audience.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">{audience.title}</h3>
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeTab === index ? `bg-gradient-to-r ${audience.color}` : "bg-white/30"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-xs mb-3 leading-relaxed relative z-10 text-center">{audience.desc}</p>

                {/* Features */}
                <div className="space-y-1 relative z-10">
                  {audience.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-center space-x-2">
                      <div
                        className={`w-1 h-1 rounded-full transition-all duration-300 ${
                          activeTab === index ? `bg-gradient-to-r ${audience.color}` : "bg-white/40"
                        }`}
                      />
                      <span className="text-slate-300 text-xs text-center">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Professional active indicator */}
                {activeTab === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-2 right-2"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${audience.color} shadow-lg`} />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Clean scroll indicators */}
        <div className="flex justify-center space-x-2">
          {audiences.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeTab === index
                  ? `bg-gradient-to-r ${audiences[activeTab].color} shadow-sm`
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
