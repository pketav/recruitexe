"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Brain, Users, MessageSquare, BarChart3, FileText, Zap, ArrowRight, CheckCircle, Shield, Target, Scale } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Candidate Screening",
    description: "Automatically screen and rank candidates based on your specific requirements and company culture fit, optimized for BFSI roles.",
    benefits: [
      "Automated resume parsing and analysis",
      "Precise skill and experience matching",
      "Bias reduction algorithms for fair evaluation",
      "Data-driven insights for informed decisions",
      "Faster shortlisting and reduced time-to-screen",
    ],
    screenshot: "/ai-sreening.png",
  },
  {
    icon: Users,
    title: "Applicant Tracking System",
    description: "Streamlined ATS to manage your screening pipeline from application to shortlisting, with compliance for BFSI regulations.",
    benefits: [
      "Centralized candidate database",
      "Screening pipeline stage management",
      "Automated status updates",
      "Shortlist organization",
    ],
    screenshot: "/Frame 2 2.png",
  },
  {
    icon: MessageSquare,
    title: "Team Collaboration",
    description: "Built-in communication tools for screening teams to collaborate and share feedback seamlessly across BFSI departments.",
    benefits: ["Real-time feedback sharing", "Screening scorecards", "Team decision tracking", "Comment threads"],
    screenshot: "/re0012.png",
  },
  {
    icon: BarChart3,
    title: "Screening Analytics",
    description: "Deep insights into your screening metrics, time-to-shortlist, and funnel performance, tailored for BFSI hiring KPIs.",
    benefits: ["Time-to-shortlist tracking", "Source effectiveness", "Cost-per-screen analysis", "Custom reporting"],
    screenshot: "/topbanner.png",
  },
  {
    icon: FileText,
    title: "Resume Intelligence",
    description: "AI-powered resume parsing and candidate matching to identify the best fits quickly for BFSI-specific roles.",
    benefits: ["Automatic data extraction", "Skills identification", "Experience matching", "Duplicate detection"],
    screenshot: "/topbanner.png",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate repetitive screening tasks, email sequences, and candidate status updates to scale BFSI hiring efficiently.",
    benefits: ["Email automation", "Status change triggers", "Task assignments", "Reminder notifications"],
    screenshot: "/topbanner.png",
  },
]

const comparisons = [
  {
    feature: "AI-Powered Screening",
    recruitExe: "✅ Advanced AI with NLP and bias reduction",
    traditional: "❌ Manual keyword-based filtering",
    competitors: "⚠️ Basic AI with limited customization",
  },
  {
    feature: "BFSI Compliance",
    recruitExe: "✅ Built-in regulatory alignment",
    traditional: "❌ Manual compliance checks",
    competitors: "⚠️ Partial automation",
  },
  {
    feature: "Scalability",
    recruitExe: "✅ Scales for startups to enterprises",
    traditional: "❌ Limited to small-scale hiring",
    competitors: "✅ Scalable but less BFSI-focused",
  },
  {
    feature: "Analytics & Insights",
    recruitExe: "✅ Real-time KPIs and custom reports",
    traditional: "❌ Basic or no analytics",
    competitors: "⚠️ Generic analytics",
  },
]

const uniquePoints = [
  {
    icon: Shield,
    title: "Compliance-First",
    description: "Built-in regulatory alignment for BFSI hiring standards."
  },
  {
    icon: Target,
    title: "Precision Matching",
    description: "AI-driven candidate screening tailored for BFSI roles."
  },
  {
    icon: Scale,
    title: "Scalable Workflows",
    description: "From startups to enterprises, adapt to any hiring volume."
  }
]

export default function FeaturesDemoPage() {
  const [expandedFeatures, setExpandedFeatures] = useState<number[]>([])

  const handleRedirect = () => {
    window.location.href = "/contact"
  }

  const toggleFeature = (index: number) => {
    setExpandedFeatures(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{paddingTop: "60px"}}>
      <Header />

      {/* Hero Section - Compact */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
        Discover{" "}
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          RecruitExe
        </span>
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-200">
        AI-powered recruitment platform designed to streamline candidate screening for BFSI organizations. 
        Advanced AI, compliance-ready workflows, and deep analytics to find top talent faster.
      </p>

      {/* CTA Button */}
      <div className="mb-16 animate-fade-in-up delay-400">
        <Button
          onClick={handleRedirect}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Get Started
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
    </div>

    {/* Hero Image */}
    <div className="relative max-w-5xl mx-auto animate-fade-in-up delay-600">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:shadow-purple-500/20 transition-all duration-500">
        <Image
          src="/topbanner.png"
          alt="RecruitExe Dashboard"
          width={1000}
          height={600}
          className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
          priority
        />
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Decorative elements around image */}
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
    </div>

    {/* Feature highlights */}
    <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-400 animate-fade-in-up delay-800">
      <div className="flex items-center gap-2 hover:text-purple-400 transition-colors duration-300">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <span>AI-Powered Screening</span>
      </div>
      <div className="flex items-center gap-2 hover:text-pink-400 transition-colors duration-300">
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
        <span>BFSI Compliance Ready</span>
      </div>
      <div className="flex items-center gap-2 hover:text-purple-400 transition-colors duration-300">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-600"></div>
        <span>Advanced Analytics</span>
      </div>
    </div>
  </div>

  <style jsx>{`
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

    .animate-fade-in-up {
      animation: fade-in-up 0.8s ease-out forwards;
    }

    .delay-200 {
      animation-delay: 0.2s;
    }

    .delay-400 {
      animation-delay: 0.4s;
    }

    .delay-600 {
      animation-delay: 0.6s;
    }

    .delay-800 {
      animation-delay: 0.8s;
    }
  `}</style>
</section>

      {/* Key Features - Optimized Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Comprehensive recruitment tools designed specifically for BFSI organizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg mr-3">
                      <feature.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  </div>
                  
                  {feature.screenshot && (
                    <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={feature.screenshot}
                        alt={`${feature.title} Screenshot`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        {benefit}
                      </div>
                    ))}
                    {/* {feature.benefits.length > 3 && (
                      <div className="text-purple-400 text-sm">
                        +{feature.benefits.length - 3} more features
                      </div>
                    )} */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section - Compact Table */}
      <section className="py-16 bg-gradient-to-r from-slate-800/30 to-purple-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose RecruitExe</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              See how RecruitExe compares to traditional recruitment tools and competitors
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="p-3 font-semibold text-white text-sm">Feature</th>
                    <th className="p-3 font-semibold text-white text-sm">RecruitExe</th>
                    <th className="p-3 font-semibold text-white text-sm">Traditional Tools</th>
                    <th className="p-3 font-semibold text-white text-sm">Competitors</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((comparison, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-3 font-medium text-sm">{comparison.feature}</td>
                      <td className="p-3 text-sm">{comparison.recruitExe}</td>
                      <td className="p-3 text-sm">{comparison.traditional}</td>
                      <td className="p-3 text-sm">{comparison.competitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Selling Points - Horizontal Layout */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">What Sets Us Apart</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {uniquePoints.map((point, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mx-auto mb-4">
                  <point.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{point.title}</h3>
                <p className="text-gray-300 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Hiring?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading BFSI organizations using RecruitExe to streamline their recruitment process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleRedirect}
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={handleRedirect}
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  )
}