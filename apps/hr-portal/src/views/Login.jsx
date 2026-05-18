'use client'
import { useState, useEffect } from 'react'
import { styled, useTheme, keyframes } from '@mui/material/styles'
import axios from 'axios'
import useMediaQuery from '@mui/material/useMediaQuery'
import Image from 'next/image'

import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  Grid
} from '@mui/material'
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Lock, 
  ArrowForward,
  Schedule,
  Bolt,
  AccessTime,
  AccountCircle
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import React from 'react'

// Import required hooks and context
import { useSettings } from '@core/hooks/useSettings'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useAuth } from '../context/AuthContext'

// Stats data - rotating cards
const stats = [
  { value: "24/7", label: "Always Active", icon: AccessTime },
  { value: "10x", label: "Faster Hiring", icon: Bolt },
  { value: "24/7", label: "Operation", subtitle: "Always working for you", icon: Schedule },
]

// Enhanced keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.2; }
`

const slideInFromLeft = keyframes`
  0% { transform: translateX(-100px) translateY(20px); opacity: 0; }
  100% { transform: translateX(0) translateY(0); opacity: 1; }
`

const slideInFromRight = keyframes`
  0% { transform: translateX(100px) translateY(-20px); opacity: 0; }
  100% { transform: translateX(0) translateY(0); opacity: 1; }
`

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const scaleIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
  50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.4); }
`

// Styled components with enhanced animations
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #9333ea, #7c3aed, #3730a3)',
  display: 'flex',
  position: 'relative',
  overflow: 'hidden'
}))

const LeftSection = styled(Box)(({ theme }) => ({
  width: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  position: 'relative',
  [theme.breakpoints.down('lg')]: {
    display: 'none'
  }
}))

const RightSection = styled(Box)(({ theme }) => ({
  width: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.down('lg')]: {
    width: '100%'
  }
}))

const CircularMockup = styled(Box)(({ theme }) => ({
  width: '400px',
  height: '400px',
  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(79, 70, 229, 0.2))',
  borderRadius: '50%',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  animation: `${breathe} 4s ease-in-out infinite, ${glow} 3s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    background: 'linear-gradient(45deg, #a855f7, #ec4899, #22d3ee, #a855f7)',
    borderRadius: '50%',
    zIndex: -1,
    animation: `${rotate} 8s linear infinite`,
    opacity: 0.7
  }
}))

const InnerCircle = styled(Box)(({ theme }) => ({
  width: '320px',
  height: '320px',
  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(67, 56, 202, 0.3))',
  borderRadius: '50%',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  animation: `${scaleIn} 1.5s ease-out 0.5s both`
}))

const ProfileCircle = styled(Box)(({ theme }) => ({
  width: '300px',
  height: '300px',
  backgroundColor: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
  }
}))

const StatsCard = styled(Box)(({ theme }) => ({
  background: 'rgba(147, 51, 234, 0.3)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  padding: '16px 20px',
  border: '1px solid rgba(168, 85, 247, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  minWidth: '160px',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${slideInFromLeft} 1s ease-out`,
  position: 'absolute',
  left: '5vw', // Use viewport units for responsive positioning
  top: '15vh', // Use viewport units for consistent vertical positioning
  zIndex: 2,
  '&:hover': {
    transform: 'translateY(-8px) scale(1.05)',
    boxShadow: '0 20px 60px rgba(168, 85, 247, 0.3)',
    background: 'rgba(168, 85, 247, 0.4)',
    '& .stat-icon': {
      transform: 'scale(1.2) rotate(10deg)',
      color: '#ffffff !important'
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover::before': {
    left: '100%'
  },
  [theme.breakpoints.down('xl')]: {
    left: '3vw',
    top: '10vh',
    minWidth: '140px',
    padding: '12px 16px'
  }
}))

const EmployeeCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  padding: '16px 20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, Ga0, 0, 0.1)',
  minWidth: '200px',
  position: 'absolute',
  right: '5vw', // Use viewport units for responsive positioning
  bottom: '15vh', // Use viewport units for consistent vertical positioning
  zIndex: 2,
  animation: `${slideInFromRight} 1s ease-out 0.3s both`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: '0 15px 45px rgba(0, 0, 0, 0.15)',
    '& .employee-avatar': {
      transform: 'scale(1.1) rotate(5deg)',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
    },
    '& .status-dot': {
      transform: 'scale(1.2)',
      boxShadow: '0 0 10px #10b981'
    }
  },
  [theme.breakpoints.down('xl')]: {
    right: '3vw',
    bottom: '10vh',
    minWidth: '180px',
    padding: '12px 16px'
  }
}))

const LoginCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(88, 28, 135, 0.4)',
  backdropFilter: 'blur(40px)',
  borderRadius: '24px',
  padding: theme.spacing(5),
  border: '1px solid rgba(168, 85, 247, 0.2)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  width: '100%',
  maxWidth: '400px'
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '48px',
    backgroundColor: 'rgba(91, 33, 182, 0.3)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    '& fieldset': {
      borderColor: 'rgba(168, 85, 247, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(168, 85, 247, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#a855f7',
      boxShadow: '0 0 0 1px #a855f7',
    },
    '& input': {
      color: '#ffffff',
      '&::placeholder': {
        color: '#d8b4fe',
        opacity: 1,
      },
      // Override browser autofill styles
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px rgba(91, 33, 182, 0.3) inset', // Match the background color
        backgroundColor: 'rgba(91, 33, 182, 0.3) !important', // Ensure background consistency
        WebkitTextFillColor: '#ffffff', // Keep text color consistent
        transition: 'background-color 5000s ease-in-out 0s', // Prevent background color transition
      },
      '&:-webkit-autofill:hover': {
        WebkitBoxShadow: '0 0 0 1000px rgba(91, 33, 182, 0.3) inset',
        backgroundColor: 'rgba(91, 33, 182, 0.3) !important',
      },
      '&:-webkit-autofill:focus': {
        WebkitBoxShadow: '0 0 0 1000px rgba(91, 33, 182, 0.3) inset',
        backgroundColor: 'rgba(91, 33, 182, 0.3) !important',
      },
      '&:-webkit-autofill:active': {
        WebkitBoxShadow: '0 0 0 1000px rgba(91, 33, 182, 0.3) inset',
        backgroundColor: 'rgba(91, 33, 182, 0.3) !important',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: '#d8b4fe',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  height: '48px',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #a855f7, #ec4899)',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 8px 25px -5px rgba(168, 85, 247, 0.4)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(90deg, #9333ea, #db2777)',
    boxShadow: '0 12px 35px -5px rgba(168, 85, 247, 0.6)',
    transform: 'scale(1.02)'
  }
}))

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  animation: `${pulse} 4s ease-in-out infinite`,
  pointerEvents: 'none'
}))

const LoginV2 = ({ mode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [currentStatIndex, setCurrentStatIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  
  const [creds, setCreds] = useState({
    userName: "",
    password: "",
    rememberMe: false,
    employeeRole: ""
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Rotate stats every 3 seconds with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prevIndex) => (prevIndex + 1) % stats.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async () => {
    if (creds.userName === 'demo' && creds.password === 'demo123') {
      setSnackbar({
        open: true,
        message: 'Demo login enabled',
        severity: 'success'
      })

      login('demo-local-preview-token', {
        empID: 'DEMO001',
        name: 'Demo Admin',
        role: ['admin'],
        roleId: 'demo-admin-role',
        photo: '',
        userType: 'admin',
        permission: [],
        Hirefor: []
      })

      return
    }

    try {
      const res = await axios.post(`${baseUrl}/v1/api/Auth/employeelogin`, creds, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if(res.data.status){
        setSnackbar({
          open: true,
          message:'Logged In Successfully',
          severity: 'success'
        })
        setTimeout(() => {
          setSnackbar({ ...snackbar, open: false })
        }, 5000)
        
        let userData = {
          empID: res.data.items.employeId,
          name: res.data.items.userName,
          role: res.data.items.roleName,
          roleId: res.data.items.roleId,
          photo: res.data.items.employeePhoto,
          userType: res.data.items.userType,
          permission: res.data.items.permission,
          Hirefor:res.data.items.Hirefor
        }
        login(res.data.items.token, userData)
      }
      else{  
        setSnackbar({
          open: true,
          message: creds.userName==="" && creds.password==="" ? "Username and Password is required" : creds.userName==="" && creds.password ? "Username is required" : creds.userName && creds.password==="" ? "Password is Required" : "Invalid User",
          severity: 'error'
        })
        setTimeout(() => {
          setSnackbar({ ...snackbar, open: false })
        }, 5000)
      }
    } catch (error) {
      console.error("error", error)
      setSnackbar({
        open: true,
        message: 'An error occurred. Please try again.',
        severity: 'error'
      })
      setTimeout(() => {
        setSnackbar({ ...snackbar, open: false })
      }, 5000)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  return (
    <>
      <MainContainer>
        {/* Left Section - Enhanced Animated Content */}
        <LeftSection>
          {/* Enhanced background decorative elements with animations */}
          <AnimatedBackground
            sx={{
              top: '80px',
              left: '80px',
              width: '456px',
              height: '456px',
              background: 'rgba(168, 85, 247, 0.1)',
              filter: 'blur(60px)',
              animationDelay: '0s'
            }}
          />
          <AnimatedBackground
            sx={{
              bottom: '80px',
              right: '80px',
              width: '292px',
              height: '292px',
              background: 'rgba(129, 140, 248, 0.1)',
              filter: 'blur(40px)',
              animationDelay: '2s'
            }}
          />
          
          {/* Additional floating orbs */}
          <AnimatedBackground
            sx={{
              top: '50%',
              left: '20%',
              width: '150px',
              height: '150px',
              background: 'rgba(236, 72, 153, 0.08)',
              filter: 'blur(30px)',
              animationDelay: '1s',
              animation: `${float} 8s ease-in-out infinite, ${pulse} 6s ease-in-out infinite`
            }}
          />

          {/* Animated Stats Card */}
          <StatsCard
            sx={{
              opacity: isVisible ? 1 : 0
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {React.createElement(stats[currentStatIndex].icon, { 
                className: 'stat-icon',
                sx: { 
                  color: '#ffffff', 
                  fontSize: '24px',
                  transition: 'all 0.3s ease',
                  animation: `${rotate} 3s ease-in-out infinite`
                } 
              })}
            </Box>
            <Typography 
              sx={{ 
                color: '#ffffff', 
                fontWeight: 'bold', 
                fontSize: '28px', 
                lineHeight: 1,
                background: 'linear-gradient(45deg, #ffffff, #f0abfc)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {stats[currentStatIndex].value}
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: 500 }}>
              {stats[currentStatIndex].label}
            </Typography>
            {stats[currentStatIndex].subtitle && (
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', mt: 0.5 }}>
                {stats[currentStatIndex].subtitle}
              </Typography>
            )}
          </StatsCard>

          {/* Enhanced Employee Card */}
          <EmployeeCard
            sx={{
              opacity: isVisible ? 1 : 0
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                className="employee-avatar"
                sx={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: '-2px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #22d3ee, #3b82f6, #8b5cf6)',
                    zIndex: -1,
                    animation: `${rotate} 4s linear infinite`
                  }
                }}
              >
                <AccountCircle sx={{ color: '#ffffff', fontSize: '24px' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#1f2937', fontWeight: 600, fontSize: '16px', lineHeight: 1.2 }}>
                  Name
                </Typography>
                <Typography 
                  sx={{ 
                    background: 'linear-gradient(45deg, #a855f7, #ec4899)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '14px', 
                    lineHeight: 1.2,
                    fontWeight: 600
                  }}
                >
                  RecruitExe
                </Typography>
                <Typography sx={{ color: '#9ca3af', fontSize: '12px' }}>
                  Employee Id: RE001
                </Typography>
              </Box>
              <Box
                className="status-dot"
                sx={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  animation: `${pulse} 2s ease-in-out infinite`
                }}
              />
            </Box>
          </EmployeeCard>

          {/* Enhanced Main Circular Mockup */}
          <CircularMockup>
            <InnerCircle>
              <ProfileCircle>
                <Box
                  sx={{
                    width: '280px',
                    height: '280px',
                    background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                      animation: `${shimmer} 3s ease-in-out infinite`,
                      zIndex: 1
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: '260px',
                      height: '260px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      position: 'relative',
                      zIndex: 0,
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Image
                      src='/images/re001.png'
                      alt="RecruitExe"
                      width={260}
                      height={260}
                      style={{ 
                        borderRadius: '50%',
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </Box>
                </Box>
              </ProfileCircle>
            </InnerCircle>
          </CircularMockup>
        </LeftSection>

        {/* Right Section - Login Form */}
        <RightSection>
          <LoginCard elevation={0}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold', 
                  mb: 1,
                  fontSize: '32px'
                }}
              >
                Welcome to
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  background: 'linear-gradient(90deg, #d8b4fe, #f9a8d4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: '32px',
                  mb: 2
                }}
              >
                RecruitExe
              </Typography>
              <Typography 
                sx={{ 
                  color: '#e9d5ff', 
                  fontSize: '14px' 
                }}
              >
                Sign in to your account
              </Typography>
            </Box>

            {/* Login Form */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Username Field */}
              <Box>
                <Typography 
                  sx={{ 
                    color: '#e9d5ff', 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    mb: 1 
                  }}
                >
                  Username
                </Typography>
                <StyledTextField
                  fullWidth
                  placeholder="Enter your username"
                  value={creds.userName}
                  onChange={(e) => setCreds((prev) => ({
                    ...prev,
                    userName: e.target.value
                  }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#d8b4fe !important' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box>
                <Typography 
                  sx={{ 
                    color: '#e9d5ff', 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    mb: 1 
                  }}
                >
                  Password
                </Typography>
                <StyledTextField
                  fullWidth
                  placeholder="Enter your password"
                  type={isPasswordShown ? 'text' : 'password'}
                  value={creds.password}
                  onChange={(e) => setCreds((prev) => ({
                    ...prev,
                    password: e.target.value
                  }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#d8b4fe !important' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                          edge="end"
                          sx={{ color: '#d8b4fe !important' }}
                        >
                          {isPasswordShown ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              {/* Remember me + Forgot Password */}
              <Grid container alignItems='center' justifyContent='space-between' sx={{ my: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={creds.rememberMe}
                      onChange={(e) =>
                        setCreds((prev) => ({
                          ...prev,
                          rememberMe: e.target.checked,
                        }))
                      }
                      sx={{
                        color: '#d8b4fe !important',
                        '&.Mui-checked': {
                          color: '#a855f7',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: '#e9d5ff', fontSize: '14px' }}>
                      Remember me
                    </Typography>
                  }
                  sx={{ ml: -1 }}
                />
                <Typography
                  sx={{
                    color: '#22d3ee',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#67e8f9'
                    }
                  }}
                  onClick={() => router.push('/ForgotPassword')}
                >
                  Forgot Password?
                </Typography>
              </Grid>

              {/* Sign In Button */}
              <GradientButton
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                endIcon={<ArrowForward sx={{color: 'white'}} />}
                sx={{ mt: 1 }}
              >
                Sign In
              </GradientButton>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography sx={{ color: '#e9d5ff', fontSize: '14px' }}>
                Don't have an account?{' '}
                <Typography
                  component="span"
                  sx={{
                    color: '#22d3ee',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#67e8f9'
                    }
                  }}
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/contact`, '_blank')}
                >
                  Contact Sales
                </Typography>
              </Typography>
            </Box>
          </LoginCard>
        </RightSection>
      </MainContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar}  
          variant="filled" 
          severity={snackbar.severity}
          sx={{
            borderRadius: '12px',
            '&.MuiAlert-filledSuccess': {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            },
            '&.MuiAlert-filledError': {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default LoginV2
