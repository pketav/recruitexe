'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

const TitleSetter = () => {
  const [title, setTitle] = useState('HRMS - Fincoopers Tech')

  useEffect(() => {
    const fetchPortalTitle = async () => {
      try {
        const token = localStorage.getItem('authToken') 
        const res = await axios.get(`${baseUrl}/v1/api/org/getOrganizations`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        })

        const portal = res.data.items[0]
        if (portal?.name) {
          setTitle(`${portal.name} - HRMS`)
          document.title = `${portal.name} - HRMS`
        }
      } catch (err) {
        console.error('Failed to fetch portal title:', err)
      }
    }

    fetchPortalTitle()
  }, [])
  if (!title) return null
  return null
}

export default TitleSetter
