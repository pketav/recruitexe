'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

const PortalInfo = () => {
  const params = useParams()
  const organizationId = params?.CareerPage
  const [portalData, setPortalData] = useState(null)

  useEffect(() => {
    const fetchPortalInfo = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/v1/api/PortalsetUp/getAllPortals?organizationId=${organizationId}`
        )
        const portal = res.data.items

        if (portal?.organizationId?.name) {
          setPortalData(portal)
          document.title = portal.organizationId.name
        }
      } catch (err) {
        console.error('Error fetching portal info:', err)
        document.title = 'Recruitexe - Career'
        
      }
    }

    if (organizationId) fetchPortalInfo()
  }, [organizationId])

  if (!portalData) return null

  return null // Optional: hide if you just want to set title
}

export default PortalInfo
