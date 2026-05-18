"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, CheckCircle, Users, Zap } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="relative z-10 container mx-auto px-4 py-12 lg:py-16">
        {/* Animated Background with Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-15 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Pricing Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-md">
            <Bot className="w-4 h-4 mr-2" />
            Your Virtual Hiring Expert
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Hire <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Recruitexe</span> as Your AI Recruiter
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Get a dedicated, 24/7 AI-powered recruiter at a fraction of the cost of a human employee.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Enterprise Plan */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Enterprise Plan</h2>
            </div>
            <div className="space-y-2 mb-6">
              <p className="text-3xl font-bold text-white">
                ₹25,000<span className="text-base font-medium">/month</span>
              </p>
              <p className="text-lg text-cyan-200">or</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                ₹2,40,000<span className="text-base font-medium">/year (20% OFF)</span>
              </p>
              <p className="text-sm text-gray-300">
                Ideal for teams with high-volume hiring needs.
              </p>
            </div>
            <Button
              size="lg"
              className="group relative bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-3 text-base font-semibold rounded-lg shadow-md hover:shadow-purple-500/25 transition-all duration-300 w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              <span className="relative">Hire Now</span>
            </Button>
            <div className="mt-6 space-y-2">
              <h3 className="text-base font-medium text-white">What’s Included:</h3>
              {[
                "Unlimited Job Postings",
                "Unlimited Resume Collection",
                "Centralized Dashboard for Collaboration",
                "Advanced Filters & Shortlisting",
                "Dedicated Account Manager",
                "Priority Support",
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Resume Screening Credits */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">AI Screening Credits</h2>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Flexible, pay-as-you-go credits for AI resume screening.
            </p>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-gray-200">Recharge Amount</div>
                <div className="font-medium text-gray-200">Cost per Screening</div>
                <div className="text-white">₹5,000</div>
                <div className="text-white">₹30</div>
                <div className="text-white">₹10,000</div>
                <div className="text-white">₹25</div>
                <div className="text-white">₹15,000+</div>
                <div className="text-white">₹20</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-200">Credits never expire</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-200">Real-time usage tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-200">No hidden fees</span>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className="group relative bg-gradient-to-r from-cyan-600 to-purple-500 hover:from-cyan-700 hover:to-purple-600 text-white px-6 py-3 text-base font-semibold rounded-lg shadow-md hover:shadow-cyan-500/25 transition-all duration-300 w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              <span className="relative">Recharge Credits</span>
            </Button>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .animate-blob { animation: blob 8s infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }

        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}