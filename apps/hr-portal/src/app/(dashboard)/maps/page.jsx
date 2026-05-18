// Updated MapsPage.jsx with enhanced UI
'use client'

import React from 'react'
import './maps.css'
import { Card, CardContent, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import SvgIcon from '@mui/material/SvgIcon'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion' // You'll need to install this package

// Dynamic import for the GoogleMapContainer to avoid SSR issues
const GoogleMapContainer = dynamic(
  () => import('./components/GoogleMapContainer'),
  {
    ssr: false,
    loading: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px', 
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Box sx={{ display: 'flex' }}>
          {[0, 1, 2].map((idx) => (
            <Box
              key={idx}
              component={motion.div}
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                mx: 0.5
              }}
              animate={{
                y: [0, -16, 0],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: idx * 0.2
              }}
            />
          ))}
        </Box>
        <Typography variant="subtitle1" color="text.secondary">Loading Map...</Typography>
      </div>
    )
  }
)

const MapsPage = () => {
  const [value, setValue] = React.useState('1')
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography 
          variant='h4' 
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 600,
            color: isDarkMode ? '#fff' : '#111827'
          }}
        >
          <Box
            component={motion.div}
            whileHover={{ 
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 }
            }}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
              borderRadius: '50%',
              p: 1.2,
              bgcolor: theme.palette.primary.main,
              color: '#fff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}
          >
            <SvgIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3"/>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
              </svg>
            </SvgIcon>
          </Box>
          Location Tracking System
        </Typography>

        <Alert 
          severity='info' 
          variant="filled"
          component={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          sx={{ 
            mb: { xs: 2, md: 0 },
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            maxWidth: { sm: '100%', md: '500px' }
          }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>Real-Time Tracking Active</AlertTitle>
          <Typography variant='body2'>
            Track employee movements in real-time and view their location history with comprehensive analytics.
          </Typography>
        </Alert>
      </Box>

      <Card 
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        elevation={isDarkMode ? 5 : 2}
        sx={{ 
          borderRadius: '16px',
          overflow: 'hidden',
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(0, 0, 0, 0.06)'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TabContext value={value}>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
              px: 2,
              pt: 1
            }}>
              <TabList 
                onChange={handleChange} 
                aria-label='maps tabs'
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{
                  sx: {
                    height: 3,
                    borderRadius: '3px'
                  }
                }}
                sx={{
                  '& .MuiTab-root': {
                    minHeight: '56px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                  },
                  '& .Mui-selected': {
                    color: theme.palette.primary.main,
                    fontWeight: 600
                  }
                }}
              >
                <Tab
                  label='Map View'
                  value='1'
                  icon={
                    <SvgIcon fontSize="small">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </SvgIcon>
                  }
                  iconPosition='start'
                />
                <Tab
                  label='Analytics'
                  value='2'
                  icon={
                    <SvgIcon fontSize="small">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 21H4.6c-.2 0-.3 0-.5-.1a1.2 1.2 0 0 1-.4-1.7l6.8-9.2c.2-.3.5-.4.8-.4.3 0 .6.1.8.3L15 13l3.9-5.2c.2-.3.5-.4.8-.4.3 0 .6.1.8.4l3.9 5.2c.1.2.2.4.2.6a1 1 0 0 1-1 1H21Z"/>
                        <path d="M21.2 11.7c-.2.3-.5.5-.9.5s-.7-.2-.9-.5L17 7.8l-7.6 10.3c-.2.3-.5.4-.8.4-.3 0-.6-.1-.8-.4L1.3 9.9A1 1 0 0 1 1.1 9c0-.2 0-.4.2-.5.2-.3.5-.4.8-.4.3 0 .6.1.8.4l5.7 7.7 7.6-10.3c.2-.3.5-.4.8-.4.3 0 .6.1.8.4l3.4 4.6c.1.2.2.4.2.6 0 .2-.1.4-.2.6Z"/>
                      </svg>
                    </SvgIcon>
                  }
                  iconPosition='start'
                />
                <Tab
                  label='Settings'
                  value='3'
                  icon={
                    <SvgIcon fontSize="small">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </SvgIcon>
                  }
                  iconPosition='start'
                />
                <Tab
                  label='Reports'
                  value='4'
                  icon={
                    <SvgIcon fontSize="small">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <path d="M14 2v6h6"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <line x1="10" y1="9" x2="8" y2="9"/>
                      </svg>
                    </SvgIcon>
                  }
                  iconPosition='start'
                />
              </TabList>
            </Box>
            <TabPanel 
              value='1' 
              sx={{ 
                p: 0, 
                height: 'calc(100vh - 220px)',
                minHeight: '600px'
              }}
            >
              <GoogleMapContainer />
            </TabPanel>
            <TabPanel value='2'>
              <Box 
                sx={{ 
                  height: '600px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <SvgIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    mb: 2
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                </SvgIcon>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                  }}
                >
                  Analytics View Coming Soon
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    maxWidth: '400px',
                    textAlign: 'center'
                  }}
                >
                  Our team is working on comprehensive analytics and reporting features that will be available in the next update.
                </Typography>
              </Box>
            </TabPanel>
            <TabPanel value='3'>
              <Box 
                sx={{ 
                  height: '600px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <SvgIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    mb: 2
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </SvgIcon>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                  }}
                >
                  Settings Coming Soon
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    maxWidth: '400px',
                    textAlign: 'center'
                  }}
                >
                  Advanced configuration options will be available in the upcoming release.
                </Typography>
              </Box>
            </TabPanel>
            <TabPanel value='4'>
              <Box 
                sx={{ 
                  height: '600px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <SvgIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    mb: 2
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 2v6h6"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <line x1="10" y1="9" x2="8" y2="9"/>
                  </svg>
                </SvgIcon>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                  }}
                >
                  Reports Coming Soon
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    maxWidth: '400px',
                    textAlign: 'center'
                  }}
                >
                  Detailed reporting features will be available in the next update.
                </Typography>
              </Box>
            </TabPanel>
          </TabContext>
        </CardContent>
      </Card>
    </Box>
  )
}

export default MapsPage
