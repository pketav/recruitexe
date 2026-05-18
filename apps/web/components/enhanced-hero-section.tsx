"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Zap, Clock, Users, BarChart3, Target, Shield } from "lucide-react"

export function EnhancedHeroSection() {
  const [currentStat, setCurrentStat] = useState(0)

  const stats = [
    { value: "99.9%", label: "Uptime Guarantee", icon: Shield },
    { value: "10x", label: "Faster Hiring", icon: Zap },
    { value: "24/7", label: "Always Active", icon: Clock },
  ]

  const features = [
    { icon: Zap, title: "Automated Job Posted", description: "Streamlined job distribution" },
    { icon: Target, title: "AI Resume Screening", description: "Intelligent candidate matching" },
    { icon: BarChart3, title: "Analytics & Insights", description: "Data-driven hiring decisions" },
    { icon: Users, title: "Smart Candidate Matching", description: "Perfect fit every time" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className=" bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900 relative overflow-hidden " style={{paddingTop: "40px"}} >
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs with enhanced animations */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-500/25 to-purple-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-bl from-purple-300/20 to-violet-700/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Medium floating elements */}
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-purple-500/25 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-l from-amber-400/20 to-violet-600/25 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Small accent dots */}
        <div
          className="absolute top-1/3 left-1/6 w-16 h-16 bg-purple-300/40 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/6 w-20 h-20 bg-violet-400/35 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>

        {/* Geometric shapes with rotation */}
        <div
          className="absolute top-20 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-500/25 to-transparent rotate-45 blur-sm animate-pulse"
          style={{
            animationDelay: "1.5s",
            animation: "pulse 3s ease-in-out infinite, spin 20s linear infinite",
          }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-tl from-violet-400/20 to-transparent rotate-12 blur-sm animate-pulse"
          style={{
            animationDelay: "3.5s",
            animation: "pulse 4s ease-in-out infinite, spin 25s linear infinite reverse",
          }}
        ></div>

        {/* Additional floating particles */}
        <div
          className="absolute top-1/6 right-1/3 w-8 h-8 bg-cyan-400/30 rounded-full blur-sm animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/6 left-1/3 w-6 h-6 bg-emerald-400/40 rounded-full blur-sm animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/6 w-10 h-10 bg-amber-400/25 rounded-full blur-sm animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Animated lines/streaks */}
        <div
          className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
          style={{
            animation: "slideRight 8s ease-in-out infinite",
            animationDelay: "1s",
          }}
        ></div>
        <div
          className="absolute bottom-1/4 right-0 w-full h-px bg-gradient-to-l from-transparent via-violet-400/30 to-transparent"
          style={{
            animation: "slideLeft 10s ease-in-out infinite",
            animationDelay: "3s",
          }}
        ></div>
      </div>

      {/* Enhanced Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
          animation: "gridMove 20s linear infinite",
        }}
      ></div>

      {/* Gradient mesh overlay with animation */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-transparent to-violet-900/40"
        style={{ animation: "gradientShift 15s ease-in-out infinite" }}
      ></div>
      <div
        className="absolute inset-0 bg-gradient-to-tl from-purple-800/40 via-transparent to-violet-700/30"
        style={{ animation: "gradientShift 18s ease-in-out infinite reverse" }}
      ></div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header - Only Enterprise AI Solution badge */}
        <div className="flex items-center justify-start mb-12">
          <div className="bg-purple-600/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-purple-400/50 hover:bg-purple-600/90 transition-all duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">Enterprise AI Solution</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Meet{" "}
                <span className="relative inline-block">
                  <span
                    className="bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent animate-gradient-flow"
                    style={{
                      backgroundSize: "300% 100%",
                      animation: "gradientFlow 4s ease-in-out infinite, textPulse 2s ease-in-out infinite",
                    }}
                  >
                    RecruitExe
                  </span>
                  <span className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-pink-400/20 via-cyan-400/20 to-violet-400/20 blur-lg animate-pulse"></span>
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></span>
                </span>
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-white/90 animate-fade-in-up">
                Your AI-Powered <span className="text-cyan-400 animate-pulse">Recruitment Partner</span>
              </h2>
            </div>

            {/* Description */}
            <p
              className="text-lg text-purple-100 leading-relaxed max-w-lg animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              Transform your hiring process with intelligent automation. RecruitExe streamlines recruitment from job
              posting to candidate selection, working around the clock to find your perfect hires.
            </p>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group animate-fade-in-up hover:scale-105 hover:shadow-xl"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-12">
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                      <p className="text-purple-200 text-xs">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
          </div>

          {/* Right Content */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative">
              {/* Professional Woman Image */}
              <div className="w-80 h-80 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-cyan-400/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-full border border-white/20 overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500">
                  <img
                    src="/re001.png"
                    alt="Professional RecruitExe Representative"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Floating Employee Card */}
              <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-xl hover:scale-110 transition-all duration-300 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center animate-spin-slow">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">Name</p>
                    <p className="text-purple-600 font-medium text-xs">RecruitExe</p>
                    <p className="text-purple-600 font-medium text-xs">Employee Id: RE001</p>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Floating Stats */}
              <div
                className="absolute -top-6 -left-6 bg-gradient-to-br from-purple-600/90 to-violet-600/90 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/50 shadow-xl hover:scale-110 transition-all duration-300 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {React.createElement(stats[currentStat].icon, {
                      className: "w-6 h-6 text-white animate-bounce",
                    })}
                  </div>
                  <div className="text-2xl font-bold text-white animate-pulse">{stats[currentStat].value}</div>
                  <div className="text-purple-200 text-xs">{stats[currentStat].label}</div>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div
                className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30 hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: "1.3s" }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-300 animate-spin-slow" />
                  <span className="text-white font-semibold text-sm">24/7 Operation</span>
                </div>
                <p className="text-purple-200 text-xs">Always working for you</p>
              </div>

              <div
                className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30 hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: "1.4s" }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-cyan-300 animate-pulse" />
                  <span className="text-white font-semibold text-sm">Zero Training</span>
                </div>
                <p className="text-cyan-200 text-xs">Ready to use instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideRight {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        @keyframes slideLeft {
          0%, 100% { transform: translateX(100%); }
          50% { transform: translateX(-100%); }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        
        @keyframes gradientShift {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes letter-bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-10px) scale(1.1);
          }
          60% {
            transform: translateY(-5px) scale(1.05);
          }
        }
        
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 30px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite, text-glow 2s ease-in-out infinite;
          background-size: 200% 200%;
        }
        
        .animate-letter-bounce {
          animation: letter-bounce 2s ease-in-out infinite;
        }

        @keyframes gradientFlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes textPulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.2);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
            opacity: 0;
          }
        }

        .animate-gradient-flow {
          animation: gradientFlow 4s ease-in-out infinite;
        }

        .animate-shine {
          animation: shine 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}
