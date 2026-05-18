'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import {Snackbar,Alert} from '@mui/material'
import {Box, Tabs, Tab, TextField, } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import axios from 'axios'
import { useAuth } from '../context/AuthContext';

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  },
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(4),
    maxBlockSize: 300,
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})
import Register from './Register'
const LoginV2 = ({ mode }) => {
  const [tab, setTab] = useState(0)
  const [emailOrPhone, setEmailOrPhone] = useState('email')
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const { login } = useAuth();
  const { settings } = useSettings()
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const [loginRegister, setLoginRegister] = useState("register")
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const [anchorEl, setAnchorEl] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const [creds,setCreds] = useState({
    email:"",
    password:""
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
 
  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${baseUrl}/v1/api/Auth/login`, creds, {
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
      login(res.data.items.token); 
     }
     else{
      setSnackbar({
        open: true,
        message: res.data.message,
        severity: 'error'
      })
      setTimeout(() => {
        setSnackbar({ ...snackbar, open: false })
      }, 5000)
     }
    } catch (error) {
      console.error("error",error)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleLinkedIn = () => {
    window.location.href = `${baseUrl}/api/auth/linkedin`;
  };

  const handleGoogle = () => {
    window.location.href = `${baseUrl}/api/googleAuth/google`;
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);  
    }
  }, [searchParams, login, router]);

  return (
    <Box className='min-h-screen w-full flex flex-col bg-[#f4f5f7]'>
      {/* Top Navigation Bar */}
      <Box
        sx={{
          backgroundColor: '#1d1b86',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMdDown ? '16px' : '24px',
          flexWrap: 'wrap',
          gap: isMdDown ? 1 : 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMdDown ? 1 : 3 }}>
          <img src='/logo.png' alt='company logo' style={{ height: '50px', width: '50px', marginRight:"10px" }} />

          <Tabs
            value={tab}
            onChange={(e, val) => {
              setTab(val)
              if (val === 0) setLoginRegister('login')
              if (val === 1) router.push('/CareerPage')
            }}
            textColor='inherit'
            TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
            sx={{
              '& .MuiTab-root': { minWidth: isMdDown ? 80 : 140, fontSize: isMdDown ? 12 : 14 }
            }}
          >
            <Tab label='Access Account' sx={{ color: 'white' }} />
            <Tab label='Careers' sx={{ color: 'white' }} />
          </Tabs>
        </Box>

        <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isMdDown ? 1 : 2,
          marginTop: isMdDown ? 1 : 0
        }}
      >
  {isMdDown ? (
    <>
      <IconButton
        edge='end'
        color='inherit'
        onClick={() => setDrawerOpen(true)}
        aria-label='menu'
      >
        <MenuIcon style={{ color: 'white' }} />
      </IconButton>

      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 200, padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Button
            variant='outlined'
            onClick={() => {
              setLoginRegister('login')
              setTab(0)
              setDrawerOpen(false)
            }}
          >
            Login
          </Button>
          <Button
            variant='contained'
            sx={{ backgroundColor: '#1d1b86', color: 'white' }}
            onClick={() => {
              setLoginRegister('register')
              setTab(0)
              setDrawerOpen(false)
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Drawer>
    </>
  ) : (
    <>
      <Button
        variant='outlined'
        sx={{ color: 'white', borderColor: 'white', minWidth: 70 }}
        onClick={() => {
          setLoginRegister('login')
          setTab(0)
        }}
      >
        Login
      </Button>
      <Button
        variant='contained'
        sx={{ backgroundColor: 'white', color: '#1d1b86', minWidth: 90 }}
        onClick={() => {
          setLoginRegister('register')
          setTab(0)
        }}
      >
        Sign Up
      </Button>
    </>
  )}
</Box>

      </Box>

      {/* Content Area */}
      <Box
        className='flex-grow flex items-center justify-center p-4'
        sx={{
          padding: isMdDown ? 2 : 4,
          flexDirection: isMdDown ? 'column' : 'row',
          gap: isMdDown ? 3 : 0
        }}
      >
        {tab === 0 &&
          (loginRegister === 'login' ? (
            <Box
              className='bg-white shadow-xl rounded-xl w-full max-w-md p-8'
              sx={{
                width: isMdDown ? '90%' : '100%',
                maxWidth: 450,
                padding: isMdDown ? 3 : 8,
              }}
            >
              <Box sx={{width:"100%", display:"flex", justifyContent:"center"}}>
              <Typography variant={isMdDown ? 'h6' : 'h5'} fontWeight={600} gutterBottom sx={{ color: '#6B7280' }}>
                LOGIN
              </Typography>
              </Box>


              {/* Toggle Between Email and Mobile */}
              <Box className='flex gap-6 justify-center my-3' sx={{ color: 'blue', flexWrap: 'wrap', gap: 2 }}>
                <FormControlLabel
                  control={<Checkbox checked={emailOrPhone === 'email'} onChange={() => setEmailOrPhone('email')} />}
                  label='Email ID'
                />
                <FormControlLabel
                  disabled
                  control={<Checkbox checked={emailOrPhone === 'mobile'} onChange={() => setEmailOrPhone('mobile')} />}
                  label='Mobile Number'
                />
              </Box>

              <Box className='flex flex-col gap-4'>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='Email'
                  placeholder='you@company.com'
                  value={creds.email}
                  onChange={e => setCreds(prev => ({ ...prev, email: e.target.value }))}
                  size={isMdDown ? 'small' : 'medium'}
                />
                <CustomTextField
                  fullWidth
                  label='Password'
                  placeholder='••••••••'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => setCreds(prev => ({ ...prev, password: e.target.value }))}
                  size={isMdDown ? 'small' : 'medium'}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  <FormControlLabel control={<Checkbox />} label='Remember me' />
                  <Typography
                    variant="body2"
                    color="primary.main"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => router.push('/ForgotPassword')}
                  >
                    Forgot password?
                  </Typography>

                </Box>

                <Button onClick={handleSubmit} variant='contained' fullWidth size={isMdDown ? 'medium' : 'large'}>
                  Login
                </Button>

                {/* <Typography
                align='center'
                variant='body2'
                color='text.secondary'
                gutterBottom
                sx={{ color: '#6B7280', mb: 1}}
              >
                Or Sign In with
              </Typography>

                <Box className='flex gap-3 mb-4'>
                <Button variant='outlined' onClick={handleGoogle} sx={{width:"200px"}} size='small'>
                <IconButton sx={{ bgcolor: '#DB4437', color: 'white', '&:hover': { bgcolor: '#c1351d' }, mr:2 }}>
                  <GoogleIcon fontSize='small'/> 
                </IconButton>  Google
                </Button>
                <Button variant='outlined' onClick={handleLinkedIn} sx={{width:"200px"}} size='small'>
                <IconButton sx={{ bgcolor: '#0077B5', color: 'white', '&:hover': { bgcolor: '#005f99' }, mr:2 }}>
                  <LinkedInIcon />
                </IconButton> LinkedIn
                </Button>
              </Box> */}

              </Box>
            </Box>
          ) : (
            <Register />
          ))}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
export default LoginV2
