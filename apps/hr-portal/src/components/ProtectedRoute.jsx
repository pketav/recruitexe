'use client'

import { useAuth } from '../context/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

const publicRoutes = ['/login', '/register', '/ForgotPassword', '/EmployeePasswordReset',"/AI-Interview","/candidateDocumentUpload", "/CandidateVerification"]

const ProtectedRoute = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
  const router = useRouter()
  const pathname = usePathname()

  const [isLoading, setIsLoading] = useState(true)

  const isPublicRoute = (pathname) =>
    publicRoutes.includes(pathname) || pathname.startsWith('/EmployeePasswordReset/')

  useEffect(() => {
    if (isPublicRoute(pathname)) {
      setIsLoading(false)
      return
    }

    if (!token) {
      router.replace('/login')
      return
    }

    setIsLoading(false)
  }, [token, pathname, router])

  if (isLoading) return null

  return children
}

export default ProtectedRoute
