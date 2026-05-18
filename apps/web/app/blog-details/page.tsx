"use client"

import Image from "next/image"
import { Calendar, User, MessageCircle, Heart, Share2, Bookmark, Cloud, BarChart3, Shield, Settings, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

const content = {
  article: {
    date: "March 15, 2024",
    author: "John Doe",
    title: "Introducing RecruitExe: Revolutionizing Recruitment with AI",
    intro: "RecruitExe is an advanced AI-powered recruitment platform designed to transform traditional hiring into a streamlined, automated, and intelligent process. Say goodbye to manual resume screening, scattered candidate data, and endless follow-ups—RecruitExe automates every stage of recruitment, from job posting and resume parsing to AI-driven candidate screening and smart applicant tracking.",
    integrations: "With deep integrations across WhatsApp, LinkedIn, and email, you can engage with candidates directly and efficiently. Real-time dashboards provide actionable insights to help you make fast, accurate, and unbiased decisions, while built-in workflow automation reduces HR overhead and shortens time-to-hire by over 70%.",
    targetAudience: "Whether you're a fast-growing startup, a mid-sized business, a large enterprise, or a recruitment agency, RecruitExe scales effortlessly to meet your needs. Its 24/7 intelligent engine ensures you're always ahead in sourcing, screening, and selecting the best talent—faster, smarter, and with up to 90% cost reduction.",
    quote: "RecruitExe transforms hiring into a seamless, intelligent process, empowering businesses to find top talent with unmatched efficiency.",
    whyChooseTitle: "Why Choose RecruitExe?",
    whyChooseText1: "Experience recruitment without friction—modern, efficient, and built for results. RecruitExe's AI-driven approach eliminates biases, streamlines workflows, and delivers measurable outcomes. From automated candidate sourcing to intelligent analytics, every feature is designed to optimize your hiring process.",
    whyChooseText2: "Join the future of recruitment with RecruitExe. Discover how our platform can save you time, reduce costs, and help you build the perfect team. Start today and experience hiring redefined.",
    badges: ["Recruitment", "AI Technology", "Hiring"],
  },
  relatedPosts: {
    title: "You Might Also Like",
    post1: {
      title: "How AI is Transforming Hiring",
      date: "March 10, 2024",
      description: "Discover how AI tools like RecruitExe are reshaping recruitment...",
      link: "",
    },
    post2: {
      title: "Streamlining Recruitment with Automation",
      date: "March 8, 2024",
      description: "Learn how automation can reduce hiring time and costs...",
      link: "",
    },
  },
  sidebar: {
    about: {
      title: "About Us",
      description: "RecruitExe is dedicated to revolutionizing recruitment with AI-powered solutions. Our platform streamlines hiring, reduces costs, and helps businesses find top talent efficiently.",
    },
    popularPosts: {
      title: "Popular Posts",
      posts: [
        { title: "AI-Powered Recruitment Tools", date: "March 12, 2024", link: "/blog/ai-powered-recruitment-tools" },
        { title: "Reducing Hiring Costs", date: "March 10, 2024", link: "/blog/reducing-hiring-costs" },
        { title: "Streamlined Candidate Screening", date: "March 8, 2024", link: "/blog/streamlined-candidate-screening" },
      ],
    },
    categories: {
      title: "Categories",
      items: [
        { name: "Recruitment", count: 12, link: "/category/recruitment" },
        { name: "AI Technology", count: 8, link: "/category/ai-technology" },
        { name: "Hiring", count: 15, link: "/category/hiring" },
        { name: "HR Solutions", count: 6, link: "/category/hr-solutions" },
        { name: "Automation", count: 9, link: "/category/automation" },
      ],
    },
    tags: {
      title: "Tags",
      items: [
        { name: "recruitment", link: "/tag/recruitment" },
        { name: "AI", link: "/tag/ai" },
        { name: "hiring", link: "/tag/hiring" },
        { name: "automation", link: "/tag/automation" },
        { name: "HR", link: "/tag/hr" },
        { name: "talent", link: "/tag/talent" },
        { name: "efficiency", link: "/tag/efficiency" },
      ],
    },
  },
}

export default function BlogPost() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900 relative overflow-hidden">
        <Header />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-500/25 to-purple-400/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-bl from-purple-300/20 to-violet-700/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
            animation: "gridMove 20s linear infinite",
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <article className="bg-white/10 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-white/20">
                <div className="relative h-64 md:h-80">
                  <Image
                    src="/placeholder.svg?height=400&width=800"
                    alt="Team meeting in modern office"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 text-sm text-purple-200 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>{content.article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>{content.article.author}</span>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in-up">
                    {content.article.title}
                  </h1>

                  <div className="prose prose-lg max-w-none text-purple-100">
                    <p className="leading-relaxed mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                      {content.article.intro}
                    </p>

                    <p className="leading-relaxed mb-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                      {content.article.integrations}
                    </p>

                    <div className="grid grid-cols-2 gap-4 my-8">
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=300&width=400"
                          alt="RecruitExe dashboard"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent rounded-lg"></div>
                      </div>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=300&width=400"
                          alt="RecruitExe candidate screening"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent rounded-lg"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="relative h-48">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent rounded-lg">
                          <Image
                            src="/placeholder.svg?height=300&width=400"
                            alt="RecruitExe workflow automation"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=300&width=400"
                          alt="RecruitExe workflow automation"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent rounded-lg"></div>
                      </div>
                    </div>

                    <p className="leading-relaxed mb-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                      {content.article.targetAudience}
                    </p>

                    <blockquote className="border-l-4 border-cyan-400 pl-6 py-4 my-8 bg-white/10 backdrop-blur-sm rounded-r-lg animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                      <p className="text-white italic text-lg">
                        {content.article.quote}
                      </p>
                    </blockquote>

                    <h2 className="text-2xl font-bold text-white mb-4 mt-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                      {content.article.whyChooseTitle}
                    </h2>

                    <p className="leading-relaxed mb-6 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
                      {content.article.whyChooseText1}
                    </p>

                    <p className="leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                      {content.article.whyChooseText2}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      {content.article.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-600/80 text-white hover:bg-purple-600/90">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                        <Heart className="w-4 h-4 mr-1 text-cyan-400" />
                        24
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                        <Share2 className="w-4 h-4 mr-1 text-cyan-400" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </article>

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: "1s" }}>
                  {content.relatedPosts.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in-up" style={{ animationDelay: "1.1s" }}>
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="AI recruitment tools"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-2">{content.relatedPosts.post1.title}</h3>
                      <p className="text-sm text-purple-200 mb-2">{content.relatedPosts.post1.date}</p>
                      <p className="text-sm text-purple-200 mb-4">{content.relatedPosts.post1.description}</p>
                      <Link href={content.relatedPosts.post1.link} className="text-sm text-purple-300 underline hover:text-purple-100 transition">
                        Learn More
                      </Link>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="Efficient hiring strategies"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-2">{content.relatedPosts.post2.title}</h3>
                      <p className="text-sm text-purple-200 mb-2">{content.relatedPosts.post2.date}</p>
                      <p className="text-sm text-purple-200 mb-4">{content.relatedPosts.post2.description}</p>
                      <Link href={content.relatedPosts.post2.link} className="text-sm text-purple-300 underline hover:text-purple-100 transition">
                        Learn More
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in-up" style={{ animationDelay: "1.3s" }}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-white mb-4">{content.sidebar.about.title}</h3>
                    <p className="text-sm text-purple-200 mb-4">{content.sidebar.about.description}</p>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in-up" style={{ animationDelay: "1.4s" }}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-white mb-4">{content.sidebar.popularPosts.title}</h3>
                    <div className="space-y-4">
                      {content.sidebar.popularPosts.posts.map((post, index) => (
                        <Link key={index} href={post.link} className="block hover:opacity-90 transition">
                          <div className="flex gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image src="/placeholder.svg?height=64&width=64" alt="Popular post" fill className="object-cover rounded" />
                              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent rounded"></div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white mb-1 hover:text-cyan-400">{post.title}</h4>
                              <p className="text-xs text-purple-200 hover:text-cyan-400">{post.date}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in-up" style={{ animationDelay: "1.5s" }}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-white mb-4">{content.sidebar.categories.title}</h3>
                    <div className="space-y-2">
                      {content.sidebar.categories.items.map((category, index) => (
                        <Link key={index} href={category.link} className="flex justify-between text-sm text-purple-200 hover:text-cyan-400 transition">
                          <span>{category.name}</span>
                          <span className="text-cyan-400">({category.count})</span>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in-up" style={{ animationDelay: "1.6s" }}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-white mb-4">{content.sidebar.tags.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.sidebar.tags.items.map((tag, index) => (
                        <Link key={index} href={tag.link}>
                          <Badge variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20">{tag.name}</Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  )
}