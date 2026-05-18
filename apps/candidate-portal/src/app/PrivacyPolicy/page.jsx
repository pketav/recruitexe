'use client'

import React, { useEffect, useState } from 'react'
import { Box, Typography, Container, Divider, useTheme, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const StyledContainer = styled(Container)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(109, 17, 188, 0.05) 100%)`,
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(8),
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(5),
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-4px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
  },
}))

const StyledBackButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  transition: 'transform 0.3s ease, background 0.3s ease',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    transform: 'scale(1.1)',
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  marginBottom: theme.spacing(2.5),
  position: 'relative',
  paddingLeft: theme.spacing(1.5),
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '4px',
    height: '50%',
    background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '2px',
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: 0,
    width: '60px',
    height: '3px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: 'width 0.4s ease-in-out',
  },
  '&:hover:after': {
    width: '100px',
  },
}))

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(5, 0),
  background: `linear-gradient(90deg, transparent, ${theme.palette.grey[300]}, transparent)`,
  height: '1px',
}))

const BulletPoint = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.95rem',
  lineHeight: 1.7,
  position: 'relative',
  paddingLeft: theme.spacing(2.5),
  marginBottom: theme.spacing(0.5),
  '&:before': {
    content: '"•"',
    position: 'absolute',
    left: 0,
    color: theme.palette.primary.main,
    fontSize: '1rem',
  },
}))

export default function PrivacyPolicy() {
  const theme = useTheme()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [portalData, setPortalData] = useState([])
  const router = useRouter()

  const getPortalInfo = async () => {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await axios.get(`${baseUrl}/v1/api/PortalsetUp/getAllPortals`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      })
      setPortalData(res.data.items || [])
    } catch (error) {
      console.error('Error fetching portal data:', error)
      setPortalData([])
    }
  }

  useEffect(() => {
    getPortalInfo()
  }, [])

  // Process the PrivacyPolicy content
  const privacyContent = portalData[0]?.privacyPolicy || ''
  const sections = privacyContent.split('\n\n').filter(section => section.trim() !== '')

  const formattedSections = sections.map((section, index) => {
    const lines = section.split('\n').filter(line => line.trim() !== '')
    if (index === 0) {
      return { title: null, content: lines[0] }
    }
    const title = lines[0]
    const content = lines.slice(1)
    return { title, content }
  })

  // const handleBack = () => {
  //   router.push('/CareerPage')
  // }

  return (
    <StyledContainer maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        {/* <StyledBackButton onClick={handleBack} aria-label="Back to Careers" sx={{}}>
          <ArrowBackIcon />
        </StyledBackButton> */}
        <Typography
          variant="h1"
          fontWeight={500}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
          }}
        >
          <i>Privacy Policy</i>
        </Typography>
      </Box>

      <StyledDivider />

      {formattedSections.length > 0 ? (
        formattedSections.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            {section.title ? (
              <SectionTitle>{section.title}</SectionTitle>
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.7, fontSize: '0.95rem', mb: 2 }}
              >
                {section.content}
              </Typography>
            )}
            {section.content && Array.isArray(section.content) && (
              section.content.map((point, idx) => (
                <BulletPoint key={idx}>{point}</BulletPoint>
              ))
            )}
          </Box>
        ))
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.7, fontSize: '0.95rem' }}
        >
          Loading Privacy Policy...
        </Typography>
      )}
    </StyledContainer>
  )
}