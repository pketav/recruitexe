import { Header } from "@/components/header"
import { EnhancedHeroSection } from "@/components/enhanced-hero-section"
import { FeaturesSection } from "@/components/features-section"
import { BenefitsSection } from "@/components/benefits-section"
import { ComparisonSection } from "@/components/comparison-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
// import { InterviewSection } from "@/components/interview-section"

// Define metadata for the page
export const metadata = {
  title: "AI Recruitment Software & Resume Screening Tool | RecruitExe",
  description: "RecruitExe is an AI-powered recruitment software that features smart resume screening, automated applicant tracking & more. Book a free consultation today.",
  keywords: [
    "AI recruitment software",
    "resume screening tool",
    "applicant tracking system",
    "automated hiring",
    "recruitment automation",
    "HR software",
    "talent acquisition",
    "candidate screening",
  ],
  authors: [{ name: "RecruitExe" }],
  openGraph: {
    title: "AI Recruitment Software & Resume Screening Tool | RecruitExe",
    description: "RecruitExe is an AI-powered recruitment software that features smart resume screening, automated applicant tracking & more. Book a free consultation today.",
    url: "https://www.recruitexe.com/",
    type: "website",
    images: ["https://www.recruitexe.com/vector.svg"],
    siteName: "RecruitExe",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Recruitment Software & Resume Screening Tool | RecruitExe",
    description: "RecruitExe is an AI-powered recruitment software that features smart resume screening, automated applicant tracking & more. Book a free consultation today.",
    images: ["https://www.recruitexe.com/vector.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "geo.region": "IN-MP",
    "geo.placename": "Indore",
    "geo.position": "22.7196;75.8577",
    ICBM: "22.7196, 75.8577",
  },
};

// Schema Markup as a separate constant for clarity
const schemaMarkup = [
  {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "RecruitExe",
    alternateName: "RecruitExe",
    url: "https://www.recruitexe.com/",
    logo: "https://www.recruitexe.com/vector.svg",
    image: "https://www.recruitexe.com/vector.svg",
    telephone: "+91 9302075637",
    address: {
      "@type": "PostalAddress",
      streetAddress: "207-210, Diamond Trade Centre, 3-4 Diamond Colony, New Palasia",
      addressLocality: "Indore",
      postalCode: "452001",
      addressCountry: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RecruitExe",
    url: "https://www.recruitexe.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.recruitexe.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RecruitExe",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "HumanResourcesApplication",
    operatingSystem: "Web-based",
    description: "AI-powered recruitment software that features smart resume screening, automated applicant tracking, and intelligent candidate evaluation",
    url: "https://www.recruitexe.com/",
    screenshot: "https://www.recruitexe.com/vector.svg",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Free consultation available",
    },
    creator: {
      "@type": "Organization",
      name: "RecruitExe",
      url: "https://www.recruitexe.com/",
    },
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Inject Schema Markup */}
      {schemaMarkup.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Header />
      <main>
        {/* SEO H1 Tag - Hidden but present for SEO */}
        <h1 className="sr-only">Automated Resume Screening & Applicant Tracking with RecruitExe</h1>
        <EnhancedHeroSection />
        <FeaturesSection />
        {/* <InterviewSection /> */}
        <ComparisonSection />
        <BenefitsSection />
        <UseCasesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}