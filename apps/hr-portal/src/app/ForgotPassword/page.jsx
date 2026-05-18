'use client'

import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  Alert,
  Snackbar
} from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import { useApi } from "@core/hooks/useApi"
import MailOutlineIcon from '@mui/icons-material/MailOutline'

// Styled components
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #9333ea, #7c3aed, #3730a3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden'
}))

const ForgotPasswordCard = styled(Paper)(({ theme }) => ({
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
  },
  '&.Mui-disabled': {
    background: 'linear-gradient(90deg, #a855f7, #ec4899)',
    opacity: 0.6,
    color: 'white'
  }
}))

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [isLoading, setIsLoading] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const { callApi } = useApi()

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address.', severity: 'error' })
      setEmail("")
      return
    }

    try {
      setIsLoading(true)
      const res = await axios.post(`${baseUrl}/v1/api/auth/employee/forgotPassword`, {
        email: email
      })

      if (res.data.status) {
        setSnackbar({
          open: true,
          message: 'Password reset link sent. Please check your email.',
          severity: 'success'
        })
      } else {
        setSnackbar({
          open: true,
          message: res.data.message,
          severity: 'error'
        })
      }
    } catch (err) {
      console.error("Forgot password error:", err.response?.data || err.message)
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Something went wrong. Please try again.',
        severity: 'error'
      })
    } finally {
      setIsLoading(false)
      setEmail('')
    }
  }

  return (
    <MainContainer>
      <ForgotPasswordCard elevation={0}>
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
            Reset your password
          </Typography>
        </Box>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Email Field */}
            <Box>
              <Typography 
                sx={{ 
                  color: '#e9d5ff', 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  mb: 1 
                }}
              >
                Email
              </Typography>
              <StyledTextField
                fullWidth
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (snackbar.open) {
                    setSnackbar({ ...snackbar, open: false })
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon sx={{ color: '#d8b4fe !important' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Send Reset Link Button */}
            <GradientButton
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              startIcon={isLoading && <CircularProgress size={20} sx={{ color: 'white' }} />}
              sx={{ mt: 1 }}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </GradientButton>
          </Box>
        </form>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography sx={{ color: '#e9d5ff', fontSize: '14px' }}>
            Back to{' '}
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
              onClick={() => window.location.href = '/login'}
            >
              Sign In
            </Typography>
          </Typography>
        </Box>
      </ForgotPasswordCard>
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
    </MainContainer>
  )
}