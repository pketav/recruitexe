"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, CheckCircle } from "lucide-react"

interface BookDemoForm {
  fullName: string
  workEmail: string
  phoneNumber?: string
  companyName: string
  jobTitle: string
  industryType: string
  OtherIndustry?: string
  numberOfEmployees: string
  demoTimeSlot: string
  howHeard: string
  consent: boolean
}

interface BookDemoModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ApiResponse {
  status: boolean
  subCode: number
  message: string
  error: string
  items: string
}

const INDUSTRY_TYPES = ["Healthcare", "Legal", "Finance", "Education", "Government", "Logistics", "E-commerce", "Other"]
const EMPLOYEE_RANGES = [
  { value: "1-10", label: "1–10" },
  { value: "11-50", label: "11–50" },
  { value: "51-200", label: "51–200" },
  { value: "201-500", label: "201–500" },
  { value: "500+", label: "500+" }
]
const HOW_HEARD_OPTIONS = ["LinkedIn", "Email", "HR Conclave", "Google/Search", "Referred", "Other"]

export function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<BookDemoForm>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      workEmail: "",
      phoneNumber: "",
      companyName: "",
      jobTitle: "",
      industryType: "",
      OtherIndustry: "",
      numberOfEmployees: "",
      demoTimeSlot: "",
      howHeard: "",
      consent: false,
    },
  })
  
  const watchedValues = watch()
  const selectedIndustry = watch("industryType")
  // const selectedDateTime = watch("demoTimeSlot")
  
  const [isLoading, setIsLoading] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  // Enhanced date/time utilities
  // const getMinDateTime = useCallback(() => {
  //   const now = new Date()
  //   // Add 1 hour buffer to current time
  //   now.setHours(now.getHours() + 1)
  //   return now.toISOString().slice(0, 16)
  // }, [])

  // const validateDateTime = useCallback((dateTimeString: string) => {
  //   if (!dateTimeString) return "Demo time slot is required"
    
  //   const selectedDate = new Date(dateTimeString)
  //   const now = new Date()
    
  //   // Check if selected date/time is in the past
  //   if (selectedDate <= now) {
  //     return "Please select a future date and time"
  //   }
    
  //   // Check if selected time is at least 1 hour from now
  //   const oneHourFromNow = new Date()
  //   oneHourFromNow.setHours(oneHourFromNow.getHours() + 1)
    
  //   if (selectedDate < oneHourFromNow) {
  //     return "Please select a time at least 1 hour from now"
  //   }
    
  //   // Check if selected time is within business hours (9 AM - 6 PM)
  //   const selectedHour = selectedDate.getHours()
  //   if (selectedHour < 9 || selectedHour >= 18) {
  //     return "Please select a time between 9:00 AM and 6:00 PM"
  //   }
    
  //   // Check if selected day is a weekday (Monday-Friday)
  //   const selectedDay = selectedDate.getDay()
  //   if (selectedDay === 0 || selectedDay === 6) {
  //     return "Please select a weekday (Monday-Friday)"
  //   }
    
  //   return true
  // }, [])

  // Optimized form validation
  const isFormValid = useMemo(() => {
    const hasRequiredFields = watchedValues.fullName && 
                             watchedValues.workEmail && 
                             watchedValues.companyName && 
                             watchedValues.jobTitle && 
                             watchedValues.industryType && 
                             watchedValues.numberOfEmployees && 
                             // watchedValues.demoTimeSlot && 
                             watchedValues.howHeard && 
                             watchedValues.consent

    const hasOtherIndustry = selectedIndustry !== "Other" || watchedValues.OtherIndustry

    const hasNoErrors = !Object.keys(errors).length

    // const isDateTimeValid = selectedDateTime && validateDateTime(selectedDateTime) === true

    return hasRequiredFields && hasOtherIndustry && hasNoErrors // && isDateTimeValid
  }, [watchedValues, selectedIndustry, errors /*, selectedDateTime, validateDateTime*/])

  // Auto-close thank you screen after 3 seconds
  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        setShowThankYou(false)
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showThankYou, onClose])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset()
      setShowThankYou(false)
    }
  }, [isOpen, reset])

  const handleThankYouClose = useCallback(() => {
    setShowThankYou(false)
    onClose()
  }, [onClose])

  const handleModalClose = useCallback(() => {
    if (!isLoading) {
      onClose()
    }
  }, [isLoading, onClose])

  const onSubmit = async (data: BookDemoForm) => {
    setIsLoading(true)
    
    try {
      // // Validate date/time one more time before submission
      // const dateTimeValidation = validateDateTime(data.demoTimeSlot)
      // if (dateTimeValidation !== true) {
      //   toast.error(dateTimeValidation, {
      //     position: "top-right",
      //     autoClose: 3000,
      //   })
      //   setIsLoading(false)
      //   return
      // }

      // Transform the data to match the API payload structure
      const payload = {
        fullName: data.fullName.trim(),
        workEmail: data.workEmail.trim().toLowerCase(),
        phoneNumber: data.phoneNumber?.trim() || "",
        companyName: data.companyName.trim(),
        jobTitle: data.jobTitle.trim(),
        industryType: data.industryType,
        numberOfEmployees: data.numberOfEmployees,
        // preferredDemoTimeSlot: new Date(data.demoTimeSlot).toISOString(),
        howDidYouHearAboutUs: data.howHeard,
        consent: data.consent,
        // Only include OtherIndustry if industryType is "Other"
        ...(data.industryType === "Other" && { OtherIndustry: data.OtherIndustry?.trim() })
      }

      const response = await axios.post(
        "https://api.recruitexe.com/v1/api/demo/createBookDemo", 
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjY2ODUwZjdkMzc0NDI1ZTkzNzExNDE4MCIsInJvbGVOYW1lIjpbImFkbWluIl0sInJvbGVJZCI6IjY4MmQ3MjA1MjBmZTVmMzg4Y2I0MDFhNCIsIm9yZ2FuaXphdGlvbklkIjoiNjgzMDc4YWFmZjZhNmJlNTg1ZWI4YWVmIiwiaWF0IjoxNzUwOTM5OTczfQ.D7tq_G5h1VNQF0VtkZ_x1fVozLvDDHt6FDV5ZZ3GCgg'
          },
          timeout: 30000 // 30 second timeout
        }
      )
      
      const apiResponse: ApiResponse = response.data
      
      if (apiResponse.status === true) {
        reset()
        setShowThankYou(true)
      } else {
        toast.error(apiResponse.message || "Failed to book demo. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        })
      }
      
    } catch (error) {
      console.error("API Error:", error)
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          toast.error("Request timeout. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          })
        } else if (error.response?.data && typeof error.response.data === 'object') {
          const apiResponse: ApiResponse = error.response.data
          
          if ('status' in apiResponse && 'message' in apiResponse) {
            toast.error(apiResponse.message || "Failed to book demo. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            })
          } else {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               "Failed to book demo. Please try again."
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            })
          }
        } else {
          toast.error("Network error. Please check your connection and try again.", {
            position: "top-right",
            autoClose: 3000,
          })
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg" 
      onClick={handleModalClose}
    >
      {/* Thank You Screen */}
      {showThankYou ? (
        <div 
          className="bg-slate-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl w-full max-w-md relative animate-in fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Thank You!</h2>
            <button 
              onClick={handleThankYouClose}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Demo Booked Successfully!</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Thank you for your interest in RecruitExe. We'll contact you soon to schedule your personalized demo.
              </p>
            </div>
            
            <div className="text-xs text-gray-400">
              This popup will close automatically in 3 seconds
            </div>
          </div>
        </div>
      ) : (
        /* Main Form */
        <div 
          className="bg-slate-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Book a Demo</h2>
            <button 
              onClick={handleModalClose} 
              disabled={isLoading}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="text-white text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    {...register("fullName", { 
                      required: "Full name is required",
                      minLength: { value: 2, message: "Full name must be at least 2 characters" },
                      pattern: { value: /^[a-zA-Z\s'-]+$/, message: "Full name can only contain letters, spaces, hyphens, and apostrophes" }
                    })}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter your full name"
                    maxLength={50}
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Work Email */}
                <div>
                  <Label htmlFor="workEmail" className="text-white text-sm font-medium">
                    Work Email *
                  </Label>
                  <Input
                    id="workEmail"
                    type="email"
                    {...register("workEmail", {
                      required: "Work email is required",
                      pattern: { 
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                        message: "Please enter a valid email address" 
                      },
                    })}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter your work email"
                    maxLength={100}
                  />
                  {errors.workEmail && (
                    <p className="text-red-400 text-xs mt-1">{errors.workEmail.message}</p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <Label htmlFor="companyName" className="text-white text-sm font-medium">
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    {...register("companyName", { 
                      required: "Company name is required",
                      minLength: { value: 2, message: "Company name must be at least 2 characters" }
                    })}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter your company name"
                    maxLength={100}
                  />
                  {errors.companyName && (
                    <p className="text-red-400 text-xs mt-1">{errors.companyName.message}</p>
                  )}
                </div>

                {/* Job Title */}
                <div>
                  <Label htmlFor="jobTitle" className="text-white text-sm font-medium">
                    Job Title / Role *
                  </Label>
                  <Input
                    id="jobTitle"
                    {...register("jobTitle", { 
                      required: "Job title is required",
                      minLength: { value: 2, message: "Job title must be at least 2 characters" }
                    })}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter your job title"
                    maxLength={100}
                  />
                  {errors.jobTitle && (
                    <p className="text-red-400 text-xs mt-1">{errors.jobTitle.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phoneNumber" className="text-white text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    maxLength={10}
                    {...register("phoneNumber", {
                      pattern: { 
                        value: /^[0-9]{10}$/, 
                        message: "Phone number must be exactly 10 digits" 
                      }
                    })}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter 10-digit phone number"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                    }}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-400 text-xs mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                {/* Industry Type */}
                <div>
                  <Label htmlFor="industryType" className="text-white text-sm font-medium">
                    Industry Type *
                  </Label>
                  <Controller
                    name="industryType"
                    control={control}
                    rules={{ required: "Industry type is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white border-white/20 z-[10000]">
                          {INDUSTRY_TYPES.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.industryType && (
                    <p className="text-red-400 text-xs mt-1">{errors.industryType.message}</p>
                  )}
                </div>

                {/* Other Industry Field - Conditionally Rendered */}
                {selectedIndustry === "Other" && (
                  <div>
                    <Label htmlFor="OtherIndustry" className="text-white text-sm font-medium">
                      Please specify your industry *
                    </Label>
                    <Input
                      id="OtherIndustry"
                      {...register("OtherIndustry", { 
                        required: selectedIndustry === "Other" ? "Please specify your industry" : false,
                        minLength: { value: 2, message: "Industry must be at least 2 characters" }
                      })}
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                      placeholder="Enter your industry"
                      maxLength={50}
                    />
                    {errors.OtherIndustry && (
                      <p className="text-red-400 text-xs mt-1">{errors.OtherIndustry.message}</p>
                    )}
                  </div>
                )}

                {/* Number of Employees */}
                <div>
                  <Label htmlFor="numberOfEmployees" className="text-white text-sm font-medium">
                    Number of Employees *
                  </Label>
                  <Controller
                    name="numberOfEmployees"
                    control={control}
                    rules={{ required: "Number of employees is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white border-white/20 z-[10000]">
                          {EMPLOYEE_RANGES.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.numberOfEmployees && (
                    <p className="text-red-400 text-xs mt-1">{errors.numberOfEmployees.message}</p>
                  )}
                </div>

                {/* How Did You Hear About Us? */}
                <div>
                  <Label htmlFor="howHeard" className="text-white text-sm font-medium">
                    How Did You Hear About Us? *
                  </Label>
                  <Controller
                    name="howHeard"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white border-white/20 z-[10000]">
                          {HOW_HEARD_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.howHeard && (
                    <p className="text-red-400 text-xs mt-1">{errors.howHeard.message}</p>
                  )}
                </div>
              </div>

              {/* Preferred Demo Time Slot - Full Width */}
              {/* <div>
                <Label htmlFor="demoTimeSlot" className="text-white text-sm font-medium">
                  Preferred Demo Time Slot *
                </Label>
                <Input
                  id="demoTimeSlot"
                  type="datetime-local"
                  {...register("demoTimeSlot", { 
                    required: "Demo time slot is required",
                    validate: validateDateTime
                  })}
                  min={getMinDateTime()}
                  className="mt-1 bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400"
                />
                {errors.demoTimeSlot && (
                  <p className="text-red-400 text-xs mt-1">{errors.demoTimeSlot.message}</p>
                )}
                <p className="text-gray-400 text-xs mt-1">
                  Available: Weekdays 9:00 AM - 6:00 PM (at least 1 hour from now)
                </p>
              </div> */}

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <input
                  id="consent"
                  type="checkbox"
                  {...register("consent", { required: "You must agree to be contacted" })}
                  className="w-4 h-4 mt-0.5 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                />
                <div className="flex-1">
                  <Label htmlFor="consent" className="text-gray-300 text-sm leading-relaxed cursor-pointer">
                    I agree to be contacted by RecruitExe for demo and updates
                  </Label>
                  {errors.consent && (
                    <p className="text-red-400 text-xs mt-1">{errors.consent.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className={`w-full font-medium py-3 rounded-lg transition-all duration-200 shadow-lg ${
                    isFormValid && !isLoading
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-xl cursor-pointer"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Booking Demo...
                    </>
                  ) : (
                    "Book Demo"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  )
}