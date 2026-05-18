"use client"

import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"

interface ComparisonRow {
  aspect: string
  traditional: string
  recruitexe: string
}

const comparisonData: ComparisonRow[] = [
  {
    aspect: "Candidate Screening",
    traditional: "Manual review, prone to bias",
    recruitexe: "AI-powered objective matching",
  },
  {
    aspect: "Time Investment",
    traditional: "Hours sorting emails",
    recruitexe: "60% time savings with automation",
  },
  {
    aspect: "Application Tracking",
    traditional: "Spreadsheets and folders",
    recruitexe: "Centralized ATS with full visibility",
  },
  {
    aspect: "Team Collaboration",
    traditional: "Forwarded emails, missed comms",
    recruitexe: "Real-time collaboration & feedback",
  },
  {
    aspect: "Analytics & Reporting",
    traditional: "Manual data collection",
    recruitexe: "Automated metrics & dashboards",
  },
  {
    aspect: "Candidate Experience",
    traditional: "Delayed responses, inconsistent",
    recruitexe: "Automated updates, transparent process",
  },
]

export function ComparisonSection() {
  const [visibleAspects, setVisibleAspects] = useState<boolean[]>(new Array(comparisonData.length).fill(false))
  const [visibleComparisons, setVisibleComparisons] = useState<boolean[]>(new Array(comparisonData.length).fill(false))
  const [currentRowIndex, setCurrentRowIndex] = useState(-1)
  const [currentStage, setCurrentStage] = useState<"aspect" | "comparison">("aspect")
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Start the animation sequence after a brief delay
    const startDelay = setTimeout(() => {
      setIsPlaying(true)
    }, 1000)

    return () => clearTimeout(startDelay)
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentRowIndex((prevIndex) => {
        if (currentStage === "aspect") {
          const nextIndex = prevIndex + 1

          if (nextIndex < comparisonData.length) {
            // Show aspect column first
            setVisibleAspects((prev) => {
              const newVisible = [...prev]
              newVisible[nextIndex] = true
              return newVisible
            })
            setCurrentStage("comparison")
            return nextIndex
          } else {
            // Animation complete, restart after a pause
            setTimeout(() => {
              setVisibleAspects(new Array(comparisonData.length).fill(false))
              setVisibleComparisons(new Array(comparisonData.length).fill(false))
              setCurrentRowIndex(-1)
              setCurrentStage("aspect")
            }, 3000)
            setIsPlaying(false)
            setTimeout(() => setIsPlaying(true), 3000)
            return -1
          }
        } else {
          // Show comparison columns
          setVisibleComparisons((prev) => {
            const newVisible = [...prev]
            newVisible[prevIndex] = true
            return newVisible
          })

          setCurrentStage("aspect")
          return prevIndex
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isPlaying, currentStage])

  return (
    <div className="bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900 overflow-hidden relative">
      {/* Complex Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-400/30 to-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-tr from-violet-500/25 to-purple-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-bl from-purple-300/20 to-violet-700/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Medium floating elements */}
        <div
          className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-400/15 to-purple-500/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-gradient-to-l from-amber-400/15 to-violet-600/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Small accent dots */}
        <div
          className="absolute top-1/2 left-1/6 w-16 h-16 bg-purple-300/30 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-2/3 w-20 h-20 bg-violet-400/25 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>

        {/* Geometric shapes */}
        <div
          className="absolute top-20 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rotate-45 blur-sm animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/4 w-28 h-28 bg-gradient-to-tl from-violet-400/15 to-transparent rotate-12 blur-sm animate-pulse"
          style={{ animationDelay: "3.5s" }}
        ></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-transparent to-violet-900/30"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-purple-800/30 via-transparent to-violet-700/20"></div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-4 relative z-10 min-h-fit">
        {/* Left Half - Comparison Table */}
        <div className="flex flexLeast-1 flex-col relative">
          {/* Subtle left side accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-transparent rounded-xl"></div>

          <div className="flex-1 flex flex-col relative z-10">
            {/* Header Section */}
            <div className="text-center mb-4">
              <h1 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                Traditional Email vs RecruitExe Platform
              </h1>
              <p className="text-sm text-purple-100 font-medium">Transform your screening process</p>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="bg-purple-700/80 backdrop-blur-sm rounded-lg p-2 border border-purple-500/50 shadow-lg">
                <h2 className="text-xs font-bold text-white text-center">Screening Aspect</h2>
              </div>
              <div className="bg-amber-600/80 backdrop-blur-sm rounded-lg p-2 border border-amber-500/50 shadow-lg">
                <h2 className="text-xs font-bold text-amber-100 text-center">Traditional Process</h2>
              </div>
              <div className="bg-emerald-600/80 backdrop-blur-sm rounded-lg p-2 border border-emerald-500/50 shadow-lg">
                <h2 className="text-xs font-bold text-emerald-100 text-center">RecruitExe Platform</h2>
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="space-y-2">
              {comparisonData.map((row, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 transition-all duration-1200 ease-out transform">
                  {/* Aspect Column */}
                  <div
                    className={`bg-purple-600/70 backdrop-blur-sm rounded-lg p-2 border border-purple-400/60 flex items-center justify-center shadow-md transition-all duration-1200 ease-out transform ${
                      visibleAspects[index] ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                    }`}
                  >
                    <h3 className="text-xs font-semibold text-white text-center leading-tight">{row.aspect}</h3>
                  </div>

                  {/* Traditional Process Column */}
                  <div
                    className={`bg-red-800/60 backdrop-blur-sm rounded-lg p-2 border border-red-600/60 flex items-center space-x-1 shadow-md transition-all duration-1200 ease-out transform ${
                      visibleComparisons[index]
                        ? "opacity-100 translate-x-0 scale-100"
                        : "opacity-0 translate-x-4 scale-95"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm">
                        <X className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <p className="text-red-100 text-xs font-medium leading-tight">{row.traditional}</p>
                  </div>

                  {/* RecruitExe Platform Column */}
                  <div
                    className={`bg-emerald-800/60 backdrop-blur-sm rounded-lg p-2 border border-emerald-600/60 flex items-center space-x-1 shadow-md transition-all duration-1200 ease-out transform ${
                      visibleComparisons[index]
                        ? "opacity-100 translate-x-0 scale-100"
                        : "opacity-0 translate-x-4 scale-95"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <p className="text-emerald-100 text-xs font-medium leading-tight">{row.recruitexe}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-2 space-x-1">
              {comparisonData.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-600 ${
                    visibleComparisons[index]
                      ? "bg-white shadow-sm"
                      : visibleAspects[index]
                        ? "bg-white/60"
                        : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Call to Action */}
          </div>
        </div>

        {/* Right Half - Image Section */}
        <div className="flex-1 relative">
          {/* Right side accent gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-violet-800/20 to-transparent rounded-xl"></div>

          {/* Floating decorative elements specific to right side */}
          <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-emerald-400/30 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute bottom-8 left-8 w-12 h-12 bg-gradient-to-br from-amber-400/25 to-violet-600/20 rounded-full blur-lg animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-8 h-8 bg-purple-300/40 rounded-full blur-md animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          <div className="w-full h-full bg-gradient-to-br from-white/10 to-purple-500/20 backdrop-blur-lg rounded-xl border border-white/30 flex items-center justify-center relative overflow-hidden shadow-2xl">
            {/* Complex glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-violet-600/10"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-emerald-400/5 via-transparent to-amber-400/5"></div>

            {/* Inner glow effect */}
            <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-white/5 to-transparent border border-white/10"></div>

            {/* Placeholder for your image */}
            {/* <div className="text-center p-6 relative z-10 w-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400/30 to-violet-600/30 rounded-full mb-4 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 text-base drop-shadow-sm">Your Graphical Image</h3>
              <p className="text-purple-100 text-xs opacity-80 text-center">
                Replace this placeholder with your custom image or graphic
              </p>
            </div> */}
            <img src="/cc.png" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  )
}
