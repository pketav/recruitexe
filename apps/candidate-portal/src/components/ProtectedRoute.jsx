'use client'

import { useAuth } from '../context/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

const publicRoutes = [
  '/login',
  '/register',
  '/ConfigSetup',
  '/ForgotPassword',
  '/CareerPage',
  '/ResetPassword',
  '/TermsAndConditions',
  '/PrivacyPolicy'
]

const ProtectedRoute = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const { setVerification } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [isLoading, setIsLoading] = useState(true)

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  useEffect(() => {
    if (isPublicRoute) {
      setIsLoading(false)
      return
    }

    if (!token) {
      router.replace('/CareerPage')
      return
    }

    const verifyToken = async () => {
      try {
        const res = await axios.post(`${baseUrl}/v1/api/Auth/verify/${token}`, {}, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (res.data.status) {
          setVerification(res.data.items)
          setIsLoading(false)
        } else {
          router.replace('/CareerPage')
        }
      } catch (error) {
        router.replace('/CareerPage')
      }
    }

    verifyToken()
  }, [token, isPublicRoute, pathname, router])

  if (isLoading) return null

  return children
}

export default ProtectedRoute
