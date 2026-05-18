"use client"
import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Clock } from "lucide-react"
import { BookDemoModal } from "@/components/BookDemoModal"

export function CTASection() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
     const handleOpenModal = () => {
    setIsDemoModalOpen(true)
    setIsMenuOpen(false) // Close mobile menu when opening modal
  }

  const handleCloseModal = () => {
    setIsDemoModalOpen(false)
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden py-16 px-4">
      {/* Background decorative elements matching your website */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-violet-900/50"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-violet-500/10 rounded-full blur-lg"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            {/* Left Side - Content */}
            <div className="p-8 lg:p-12 space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight font-sans">
                  Still Screening
                  <br />
                  <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    Resumes Manually?
                  </span>
                </h1>

                <p className="text-purple-100 text-lg xl:text-xl leading-relaxed font-medium">
                  Let <span className="font-bold text-pink-300">RecruitExe</span> do the heavy lifting with intelligent
                  automation that transforms your hiring process.
                </p>
              </div>

              {/* Enhanced Benefits with Icons */}
              <div className="flex flex-wrap items-center gap-4 text-pink-300 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>NO HASSLE</span>
                </div>
                <div className="w-px h-4 bg-purple-400"></div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>NO BIAS</span>
                </div>
                <div className="w-px h-4 bg-purple-400"></div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>JUST FASTER HIRING</span>
                </div>
              </div>

              {/* Enhanced CTA Button */}
              <div className="space-y-3">
                <Button
           
                onClick={handleOpenModal}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-base xl:text-lg px-8 py-4 rounded-2xl w-full lg:w-auto shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group border-0">
                  <span className="relative z-10">HIRE RECRUITEXE NOW</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
                <p className="text-center lg:text-left text-purple-200 text-sm font-medium">
                  ✨ Free consultation • No commitment required
                </p>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative p-8 lg:p-12 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                <img
                  src="/re001.png"
                  alt="RecruitExe AI Interviewer"
                  className="relative w-full h-auto rounded-2xl shadow-2xl border border-white/20"
                />
                {/* Overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Book Demo Modal */}
      <BookDemoModal isOpen={isDemoModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
