import { Button } from "@/components/ui/button"
import { ArrowRight, Users, TrendingUp, Clock, IndianRupee, Target, Award } from "lucide-react"
import { appRoutes } from "@/lib/routes"

export function HeroSection() {
  const handleRedirect = () => {
    window.location.href = appRoutes.hrLogin
  }
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Stop Email Chaos, Start{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Screening
            </span>{" "}
            Excellence
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Transform your candidate screening process with intelligent resume analysis, automated filtering, and
            data-driven insights. Built for HR teams who need efficient candidate evaluation and shortlisting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button onClick={handleRedirect} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
            onClick={handleRedirect}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg border-0"
            >
              Schedule Demo
              <Users className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Enhanced Stats Grid - Single Row */}
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12 mt-16">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">60%</div>
              <div className="text-gray-400">Faster Screening</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">85%</div>
              <div className="text-gray-400">Quality Improvement</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">70%</div>
              <div className="text-gray-400">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mx-auto mb-4">
                <IndianRupee className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">45%</div>
              <div className="text-gray-400">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">92%</div>
              <div className="text-gray-400">Screening Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
