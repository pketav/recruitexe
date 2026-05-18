"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Building2 } from "lucide-react"
import { BookDemoModal } from "@/components/BookDemoModal"
import { appRoutes } from "@/lib/routes"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  const handleRedirect = () => {
    window.location.href = appRoutes.hrLogin
  }

  const handleOpenModal = () => {
    setIsDemoModalOpen(true)
    setIsMenuOpen(false) // Close mobile menu when opening modal
  }

  const handleCloseModal = () => {
    setIsDemoModalOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-2xl font-bold text-white">
              <img src="/vector.svg" alt="RecruitExe logo" className="w-8 h-8 mr-2" />
              <div className="text-xl sm:text-2xl font-bold transition-all duration-300 group-hover:scale-105">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent hover:from-purple-300 hover:via-pink-400 hover:to-purple-500 transition-all duration-300">
                  Recruit
                </span>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-500 transition-all duration-300">
                  Exe
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-purple-300 transition-colors duration-200 font-medium relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-300 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              {/* <Link href="/features" className="text-white hover:text-purple-300 transition-colors">
                Features
              </Link> */}
              <Link href="/interview" className="text-white hover:text-purple-300 transition-colors">
               Interview module
               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-300 transition-all duration-200 group-hover:w-full"></span>
              </Link> 
              <Link href="/blog" className="text-white hover:text-purple-300 transition-colors">
               Blogs
               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-300 transition-all duration-200 group-hover:w-full"></span>
              </Link> 
              <Link href="/contact" className="text-white hover:text-purple-300 transition-colors duration-200 font-medium relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-300 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button onClick={handleRedirect} variant="ghost" className="text-white hover:text-purple-300">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button onClick={handleOpenModal} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Building2 className="w-4 h-4 mr-2" />
                Book a Demo
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-white/10 z-30">
              <nav className="flex flex-col space-y-4 p-4">
                <Link href="/" className="text-white hover:text-purple-300 transition-colors">
                  Home
                </Link>
                <Link href="/features" className="text-white hover:text-purple-300 transition-colors">
                  Features
                </Link>
                <Link href="/contact" className="text-white hover:text-purple-300 transition-colors">
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                  <Button onClick={handleRedirect} variant="ghost" className="text-white hover:text-purple-300 justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button onClick={handleOpenModal} className="bg-purple-600 hover:bg-purple-700 text-white justify-start">
                    <Building2 className="w-4 h-4 mr-2" />
                    Book a Demo
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Book a Demo Modal - Moved outside header for proper positioning */}
      <BookDemoModal isOpen={isDemoModalOpen} onClose={handleCloseModal} />
    </>
  )
}
