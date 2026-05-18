"use client"
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Send, Clock, CheckCircle, MessageSquare, Phone } from "lucide-react"
import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { Header } from "@/components/header"
import axios, { AxiosError } from "axios"; 
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import Link from "next/link"
import Head from "next/head"
import { getAbsoluteUrl, getApiBaseUrl } from "@/lib/routes"

// Define types for the enterprise form data
interface EnterpriseFormData {
  fullName: string
  companyName: string
  email: string
  phoneNumber: string
  businessType: string
  otherBusinessType: string
  address: string
}

// Define types for errors
interface EnterpriseErrors {
  fullName?: string
  companyName?: string
  email?: string
  phoneNumber?: string
  businessType?: string
  otherBusinessType?: string
  address?: string
}

// Define alert state
interface AlertState {
  type: "success" | "error" | null
  message: string | null
}

interface ApiErrorResponse {
  message?: string
}

// Business types for dropdown
const businessTypes = ["Healthcare", "Legal", "Finance", "Education", "Government", "Logistics", "E-commerce", "Other"]
const contactUrl = getAbsoluteUrl("/contact")
const homeUrl = getAbsoluteUrl("/")
const logoUrl = getAbsoluteUrl("/vector.svg")

export default function ContactPage() {
  const [isClient, setIsClient] = useState(false)
  const [enterpriseFormData, setEnterpriseFormData] = useState<EnterpriseFormData>({
    fullName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    businessType: "",
    otherBusinessType: "",
    address: "",
  })
  const [enterpriseErrors, setEnterpriseErrors] = useState<EnterpriseErrors>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [alert, setAlert] = useState<AlertState>({ type: null, message: null })
  const router = useRouter()
  const baseUrl = getApiBaseUrl()
  const contactEndpoint = process.env.NEXT_PUBLIC_CONTACT_API_URL || (baseUrl ? `${baseUrl}/api/contact/consultation` : "")

  // Refs for focusing on error fields
  const fieldRefs = {
    fullName: useRef<HTMLInputElement>(null),
    companyName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phoneNumber: useRef<HTMLInputElement>(null),
    businessType: useRef<HTMLSelectElement>(null),
    otherBusinessType: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle input change
  const handleEnterpriseInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEnterpriseFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setEnterpriseErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  // Validate enterprise form
  const validateEnterpriseForm = () => {
    const newErrors: EnterpriseErrors = {}
    if (!enterpriseFormData.fullName) {
      newErrors.fullName = "Please enter your full name"
    }
    if (!enterpriseFormData.companyName) {
      newErrors.companyName = "Please enter your company name"
    }
    if (!enterpriseFormData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enterpriseFormData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!enterpriseFormData.phoneNumber || !/^[0-9]{10}$/.test(enterpriseFormData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number"
    }
    if (!enterpriseFormData.businessType) {
      newErrors.businessType = "Please select industry/sector"
    }
    if (enterpriseFormData.businessType === "Other" && !enterpriseFormData.otherBusinessType) {
      newErrors.otherBusinessType = "Please specify other industry/sector"
    }
    if (!enterpriseFormData.address) {
      newErrors.address = "Please enter your full address"
    }
    
    setEnterpriseErrors(newErrors)
    
    // Focus on first error field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0] as keyof typeof fieldRefs
      if (fieldRefs[firstErrorField]?.current) {
        fieldRefs[firstErrorField].current?.focus()
        fieldRefs[firstErrorField].current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
    
    return Object.keys(newErrors).length === 0
  }

  // Handle enterprise form submission
  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEnterpriseForm()) return
    setLoading(true)
    setAlert({ type: null, message: null })

    try {
      const payload = {
        fullName: enterpriseFormData.fullName,
        companyName: enterpriseFormData.companyName,
        email: enterpriseFormData.email,
        phoneNumber: enterpriseFormData.phoneNumber,
        businessType:
          enterpriseFormData.businessType === "Other"
            ? enterpriseFormData.otherBusinessType
            : enterpriseFormData.businessType,
        address: enterpriseFormData.address,
      }

      if (!contactEndpoint) {
        throw new Error("Contact API is not configured.")
      }

      const response = await axios.post(contactEndpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.data && response.data.success === true) {
        setAlert({
          type: "success",
          message: "Consultation request submitted successfully!",
        })
        toast.success("Consultation request submitted successfully! Our team will contact you shortly.", {
          position: "top-right",
          duration: 5000,
          style: {
            background: "linear-gradient(to right, rgba(22, 163, 74, 0.9), rgba(5, 150, 105, 0.9))",
            border: "1px solid rgba(74, 222, 128, 0.5)",
            color: "#fff",
            backdropFilter: "blur(4px)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          },
          icon: <CheckCircle className="w-5 h-5 text-green-300" />,
        })

         setEnterpriseFormData({
            fullName: "",
            companyName: "",
            email: "",
            phoneNumber: "",
            businessType: "",
            otherBusinessType: "",
            address: "",
          })
        // Reset form after successful submission
        setTimeout(() => {
         
          setAlert({ type: null, message: null })
        }, 3000)
      } else {
        throw new Error("API response indicated failure")
      }
    } catch (error) {

  const axiosError = error as AxiosError;
  let errorMessage = "An error occurred while submitting the consultation request.";
  const data = axiosError.response?.data;
  if (data && typeof data === "object" && "message" in data) {
    const apiError = data as ApiErrorResponse
    if (typeof apiError.message === "string") {
      errorMessage = apiError.message
    }
  }
  setAlert({
    type: "error",
    message: errorMessage,
  })
  toast.error(errorMessage, {
    position: "top-right",
    duration: 5000,
    style: {
      background: "linear-gradient(to right, rgba(220, 38, 38, 0.9), rgba(159, 18, 57, 0.9))",
      border: "1px solid rgba(248, 113, 113, 0.5)",
      color: "#fff",
      backdropFilter: "blur(4px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
    icon: <MessageSquare className="w-5 h-5 text-red-300" />,
  })
    } finally {
      setLoading(false)
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900 text-white">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  return (
    <>
     {/* SEO Meta Tags */}
      <Head>
        <title>Contact RecruitExe | Get Now the AI-Powered Recruitment Solutions</title>
        <meta name="description" content="Need help with recruitment automation or AI-driven hiring tools? RecruitExe helps to streamline your hiring process with intelligent recruitment software." />
        <link rel="canonical" href={contactUrl} />
        <meta property="og:title" content="Contact RecruitExe | Get Now the AI-Powered Recruitment Solutions" />
        <meta property="og:description" content="Need help with recruitment automation or AI-driven hiring tools? RecruitExe helps to streamline your hiring process with intelligent recruitment software." />
        <meta property="og:url" content={contactUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={logoUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact RecruitExe | Get Now the AI-Powered Recruitment Solutions" />
        <meta name="twitter:description" content="Need help with recruitment automation or AI-driven hiring tools? RecruitExe helps to streamline your hiring process with intelligent recruitment software." />
        <meta name="twitter:image" content={logoUrl} />
        <meta name="robots" content="index, follow" />
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900 text-white relative overflow-hidden">

       {/* Schema.org structured data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["Organization", "LocalBusiness"],
                  "name": "RecruitExe",
                  "alternateName": "RecruitExe",
                  "url": homeUrl,
                  "logo": logoUrl,
                  "image": logoUrl,
                  "telephone": "+91 9302075637",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "207-210, Diamond Trade Centre, 3-4 Diamond Colony, New Palasia",
                    "addressLocality": "Indore",
                    "postalCode": "452001",
                    "addressCountry": "IN"
                  },
                  "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday"
                    ],
                    "opens": "00:00",
                    "closes": "23:59"
                  }
                },
                {
                  "@type": "WebSite",
                  "name": "RecruitExe",
                  "url": homeUrl,
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${getAbsoluteUrl("/search")}?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": homeUrl
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Contact",
                      "item": contactUrl
                    }
                  ]
                }
              ]
            })
          }}
        />


      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: "8px",
            padding: "12px",
            fontSize: "14px",
          },
        
         
        }}
      />
      
      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

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
        }}
      ></div>

      <section className="min-h-screen py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mx-auto rounded-full mb-6"></div>
            {/* <p className="text-md text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Ready to transform your business with a custom AI agent? We'd love to discuss your needs!
            </p> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/7 transition-all duration-500 shadow-2xl hover:shadow-3xl h-full">
                <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 pt-2 pb-1 text-center rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-cyan-400/20"></div>
                  <div className="relative z-10">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center">
                      <Send className="w-5 h-5 mr-2" />
                      Request Consultation
                    </h2>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Display Alert Message */}
                  {alert.type && (
                    <div
                      className={`p-4 mb-4 rounded-lg ${
                        alert.type === "success"
                          ? "bg-green-500/20 border-green-500/50 text-green-200"
                          : "bg-red-500/20 border-red-500/50 text-red-200"
                      } border`}
                    >
                      {alert.message}
                    </div>
                  )}

                  <form onSubmit={handleEnterpriseSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-white font-medium flex items-center text-sm">
                          Full Name <span className="text-pink-400 ml-1">*</span>
                        </Label>
                        <Input
                          ref={fieldRefs.fullName}
                          id="fullName"
                          name="fullName"
                          value={enterpriseFormData.fullName}
                          onChange={handleEnterpriseInputChange}
                          placeholder="Enter your full name"
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 rounded-lg h-10 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300 hover:bg-white/15"
                        />
                        {enterpriseErrors.fullName && (
                          <p className="text-pink-400 text-xs">{enterpriseErrors.fullName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-white font-medium flex items-center text-sm">
                          Company Name <span className="text-pink-400 ml-1">*</span>
                        </Label>
                        <Input
                          ref={fieldRefs.companyName}
                          id="companyName"
                          name="companyName"
                          value={enterpriseFormData.companyName}
                          onChange={handleEnterpriseInputChange}
                          placeholder="Enter your company name"
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 rounded-lg h-10 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300 hover:bg-white/15"
                        />
                        {enterpriseErrors.companyName && (
                          <p className="text-pink-400 text-xs">{enterpriseErrors.companyName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white font-medium flex items-center text-sm">
                          Email Address <span className="text-pink-400 ml-1">*</span>
                        </Label>
                        <Input
                          ref={fieldRefs.email}
                          id="email"
                          name="email"
                          type="email"
                          value={enterpriseFormData.email}
                          onChange={handleEnterpriseInputChange}
                          placeholder="your.email@company.com"
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 rounded-lg h-10 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300 hover:bg-white/15"
                        />
                        {enterpriseErrors.email && <p className="text-pink-400 text-xs">{enterpriseErrors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-white font-medium flex items-center text-sm">
                          Phone Number <span className="text-pink-400 ml-1">*</span>
                        </Label>
                        <Input
                          ref={fieldRefs.phoneNumber}
                          id="phoneNumber"
                          name="phoneNumber"
                          value={enterpriseFormData.phoneNumber}
                          onChange={handleEnterpriseInputChange}
                          placeholder="Enter 10-digit phone number"
                          required
                          maxLength={10}
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 rounded-lg h-10 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300 hover:bg-white/15"
                        />
                        {enterpriseErrors.phoneNumber && (
                          <p className="text-pink-400 text-xs">{enterpriseErrors.phoneNumber}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-white font-medium flex items-center text-sm">
                        Industry / Sector <span className="text-pink-400 ml-1">*</span>
                      </Label>
                      <select
                        ref={fieldRefs.businessType}
                        id="businessType"
                        name="businessType"
                        value={enterpriseFormData.businessType}
                        onChange={handleEnterpriseInputChange}
                        className="bg-white/10 border border-white/20 text-white rounded-lg h-10 w-full px-3 focus:border-cyan-400 focus:ring-cyan-400/50 focus:outline-none transition-all duration-300 hover:bg-white/15"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      >
                        <option value="" disabled style={{ backgroundColor: "#1f2937", color: "#fff" }}>
                          Select industry/sector
                        </option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type} style={{ backgroundColor: "#1f2937", color: "#fff" }}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {enterpriseErrors.businessType && (
                        <p className="text-pink-400 text-xs">{enterpriseErrors.businessType}</p>
                      )}
                    </div>

                    {enterpriseFormData.businessType === "Other" && (
                      <div className="space-y-2">
                        <Label htmlFor="otherBusinessType" className="text-white font-medium flex items-center text-sm">
                          Other Industry <span className="text-pink-400 ml-1">*</span>
                        </Label>
                        <Input
                          ref={fieldRefs.otherBusinessType}
                          id="otherBusinessType"
                          name="otherBusinessType"
                          value={enterpriseFormData.otherBusinessType}
                          onChange={handleEnterpriseInputChange}
                          placeholder="Specify other industry"
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 rounded-lg h-10 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300 hover:bg-white/15"
                        />
                        {enterpriseErrors.otherBusinessType && (
                          <p className="text-pink-400 text-xs">{enterpriseErrors.otherBusinessType}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white font-medium flex items-center text-sm">
                        Full Address <span className="text-pink-400 ml-1">*</span>
                      </Label>
                      <Input
                        ref={fieldRefs.address}
                        id="address"
                        name="address"
                        value={enterpriseFormData.address}
                        onChange={handleEnterpriseInputChange}
                        placeholder="Enter your full address"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 rounded-lg h-10 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300 hover:bg-white/15"
                      />
                      {enterpriseErrors.address && <p className="text-pink-400 text-xs">{enterpriseErrors.address}</p>}
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-500 hover:via-violet-500 hover:to-purple-500 text-white py-3 rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold relative overflow-hidden group"
                        disabled={loading}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-pink-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex items-center justify-center">
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting Request...
                            </>
                          ) : (
                            <>
                              Submit Request
                              <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </div>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-24">
                {/* <div className="text-center lg:text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Get in Touch</h3>
                  <p className="text-purple-200 text-sm">We're here to help you succeed</p>
                </div> */}

                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl group">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#4E36FF] to-[#FF6B6B] rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Email Us</h4>
                    <Link href='mailto: recruitexe@fincoopers.in' className="hover:pointer">
                    <p className="text-cyan-400 font-semibold text-sm hover:text-[#FF6B6B] transition-all duration-200 mb-2">
                       recruitexe@fincoopers.in
                    </p>
                    </Link>
                    <p className="text-gray-300 text-xs">Quick response guaranteed</p>
                  </CardContent>
                </Card>

                {/* <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl group">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#4E36FF] to-[#FF6B6B] rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Call Us</h4>
                    <Link href='tel:+91 9302075637' className="hover:pointer">
                    <p className="text-cyan-400 font-semibold text-sm mb-2">+91 9302075637</p>
                    </Link>
                    <p className="text-gray-300 text-xs">Available 9 AM - 6 PM EST</p>
                  </CardContent>
                </Card> */}

                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl group">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#4E36FF] to-[#FF6B6B] rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Response Time</h4>
                    <p className="text-cyan-400 font-semibold text-sm mb-2">Within 24 hours</p>
                    <p className="text-gray-300 text-xs">Lightning fast support</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
