import Link from "next/link"
import { Facebook, Linkedin, Instagram, XIcon } from "lucide-react"

const socialLinks = [
  { label: "Facebook", href: "/", icon: Facebook },
  { label: "X", href: "/", icon: XIcon },
  { label: "LinkedIn", href: "/", icon: Linkedin },
  { label: "Instagram", href: "/", icon: Instagram },
]

const platformLinks = [
  { label: "ATS Features", href: "/features" },
  { label: "AI Screening", href: "/features" },
  { label: "Analytics", href: "/hr/dashboard" },
  { label: "Integrations", href: "/features" },
]

const resourceLinks = [
  { label: "Hiring Guides", href: "/blog" },
  { label: "Best Practices", href: "/blog/content/howAi" },
  { label: "Case Studies", href: "/blog" },
  { label: "Support", href: "/contact" },
]

export function Footer() {
  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white mb-4 block">
              RecruitExe
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              The future of recruitment is here. Connect top talent with leading companies through our AI-powered
              platform.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link key={label} href={href} aria-label={label} className="text-gray-400 hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {platformLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 RecruitExe. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
           
          </div>
        </div>
      </div>
    </footer>
  )
}
