"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
  Container,
  Grid,
  Snackbar,
  Paper,
  AppBar,
  Toolbar,
} from "@mui/material"
import { Visibility, VisibilityOff, CloudUpload, Close, OpenInNew } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import axios from "axios"
import { useAuth } from '../context/AuthContext';


// Main container with clean background
const MainContainer = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
  display: "flex",
  flexDirection: "column",
})

// Navigation bar
const NavBar = styled(AppBar)({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
})

// Content area
const ContentArea = styled(Box)({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
})

// Clean form card matching login style
const FormCard = styled(Card)({
  maxWidth: 480,
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e0e0e0",
})

// Form header
const FormHeader = styled(Box)({
  textAlign: "center",
  padding: "32px 32px 24px 32px",
})

// Clean text field
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#667eea",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#667eea",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666666",
    "&.Mui-focused": {
      color: "#667eea",
    },
  },
}))

// Upload area matching the clean style
const UploadArea = styled(Paper)({
  border: "2px dashed #e0e0e0",
  borderRadius: 8,
  padding: "24px",
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: "#fafafa",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "#667eea",
    backgroundColor: "#f8f9ff",
  },
})

// File preview
const FilePreview = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#f8f9ff",
  padding: "12px 16px",
  borderRadius: 8,
  marginBottom: "12px",
  border: "1px solid #e8eaff",
})

// Primary button
const PrimaryButton = styled(Button)({
  background: "linear-gradient(135deg,rgba(89, 120, 255, 0.4) 0%, #6a4190 100%)",
  borderRadius: 8,
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  color: "#fff",

  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
    color: "#fff"
  },
  "&:disabled": {
    background: "#cccccc",
    boxShadow: "none",
  },
})

// Social button
const SocialButton = styled(Button)({
  borderRadius: 8,
  padding: "10px 16px",
  textTransform: "none",
  border: "1px solid #e0e0e0",
  backgroundColor: "#ffffff",
  color: "#333333",
  "&:hover": {
    backgroundColor: "#f8f9ff",
    borderColor: "#667eea",
  },
})

// Logo component
const Logo = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
})

export default function Register() {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeUrl, setResumeUrl] = useState(null)
  const [privacyCheck, setPrivacyCheck] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth();
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    resume: "",
    mobileNumber: "",
  })

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setResumeFile(file)
    setFormData((prev) => ({ ...prev, resume: URL.createObjectURL(file) }))

    try {
      const uploadData = new FormData()
      uploadData.append("file", file)

      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, uploadData)

      if (res.data.success) {
        showSnackbar("Resume uploaded successfully!", "success")
        setResumeUrl(res.data.url)
        setFormData((prev) => ({ ...prev, resume: res.data.url }))
      } else {
        showSnackbar(res.data.message || "Upload failed.")
      }
    } catch (error) {
      console.error("Upload error:", error)
      showSnackbar("An error occurred while uploading the file.")
    }
  }

  const handleRemoveResume = () => {
    setResumeFile(null)
    setResumeUrl(null)
    setFormData((prev) => ({ ...prev, resume: "" }))
  }

  const handleLogin = async (email, password) => {
    try {
      const payload = { email, password }
      const res = await axios.post(`${baseUrl}/v1/api/Auth/login`, payload, {
        headers: { "Content-Type": "application/json" },
      })
      if (res.data.status) {
        login(res.data.items.token); 
        router.replace("/Careers")

      }
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/
    const mobileNumberRegex = /^[6-9]\d{9}$/

    // Validation
    if (!formData.email || !emailRegex.test(formData.email)) {
      showSnackbar("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (!formData.mobileNumber || !mobileNumberRegex.test(formData.mobileNumber)) {
      showSnackbar("Please enter a valid 10-digit mobile number starting with 6-9")
      setIsLoading(false)
      return
    }

    if (!formData.userName) {
      showSnackbar("Please enter username")
      setIsLoading(false)
      return
    }

    if (!formData.password || !passwordRegex.test(formData.password)) {
      showSnackbar(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      )
      setIsLoading(false)
      return
    }

    if (!formData.resume) {
      showSnackbar("We couldn't locate your PDF file. Please ensure it's uploaded correctly.")
      setIsLoading(false)
      return
    }

    if (!privacyCheck) {
      showSnackbar("Please check the Privacy Policy & Terms")
      setIsLoading(false)
      return
    }

    if (formData.password !== confirmPassword) {
      showSnackbar("Password and Confirm Password do not match.")
      setIsLoading(false)
      return
    }

    try {
      const res = await axios.post(`${baseUrl}/v1/api/Auth/register`, formData, {
        headers: { "Content-Type": "application/json" },
      })

      if (res.data.success) {
        showSnackbar("Registration successful!", "success")

        localStorage.setItem(
          "pendingLogin",
          JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        )

        setFormData({
          email: "",
          userName: "",
          password: "",
          resume: "",
          mobileNumber: "",
        })


        setTimeout(() => {
          const creds = JSON.parse(localStorage.getItem("pendingLogin"))
          if (creds) {
            handleLogin(creds.email, creds.password)
            localStorage.removeItem("pendingLogin")
          }
        }, 100)
      } else {
        showSnackbar(res.data.message)
      }
    } catch (error) {
      console.error("Registration error:", error)
      showSnackbar("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    if (provider === "google") {
      window.location.href = `${baseUrl}/api/googleAuth/google`
    } else if (provider === "linkedin") {
      window.location.href = `${baseUrl}/api/auth/linkedin`
    }
  }

  return (
    <MainContainer>
      {/* Navigation Bar */}
      {/* <NavBar position="static" elevation={0}>
        <Toolbar>
          <Logo sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" sx={{ color: "white", fontSize: "18px" }}>
                🚀
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
              YourApp
            </Typography>
          </Logo>
          <Button color="inherit" sx={{ mr: 2 }}>
            Login
          </Button>
          <Button color="inherit">Careers</Button>
        </Toolbar>
      </NavBar> */}

      {/* Content Area */}
      <ContentArea>
        <Container maxWidth="sm">
          <FormCard elevation={0}>
            {/* Header */}
            <FormHeader>
              <Typography variant="h4" fontWeight="bold" color="#333333" gutterBottom>
                SIGN UP
              </Typography>
              <Typography variant="body2" color="#666666">
                Create your account to get started
              </Typography>
            </FormHeader>

            {/* Form Content */}
            <CardContent sx={{ px: 4, pb: 4 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Email Address *"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      variant="outlined"
                      placeholder="you@company.com"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Mobile Number *"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      required
                      variant="outlined"
                      placeholder="Enter your mobile number"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Full Name *"
                      type="text"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      required
                      variant="outlined"
                      placeholder="Enter your full name"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Password *"
                      type={isPasswordShown ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      variant="outlined"
                      placeholder="Enter your password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setIsPasswordShown(!isPasswordShown)} edge="end">
                              {isPasswordShown ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Confirm Password *"
                      type={isConfirmPasswordShown ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      variant="outlined"
                      placeholder="Confirm your password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)} edge="end">
                              {isConfirmPasswordShown ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" color="#666666" gutterBottom sx={{ mb: 1 }}>
                      Upload Resume
                    </Typography>
                    {resumeFile ? (
                      <Box>
                        <FilePreview>
                          <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 500, color: "#333333" }}>
                            {resumeFile.name}
                          </Typography>
                          <Box>
                            {resumeUrl && (
                              <IconButton size="small" onClick={() => window.open(resumeUrl)}>
                                <OpenInNew fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton size="small" onClick={handleRemoveResume}>
                              <Close fontSize="small" />
                            </IconButton>
                          </Box>
                        </FilePreview>
                        <Button variant="outlined" component="label" size="small" sx={{ borderRadius: 1 }}>
                          Change File
                          <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                        </Button>
                      </Box>
                    ) : (
                      <UploadArea component="label" elevation={0}>
                        <CloudUpload sx={{ fontSize: 40, color: "#667eea", mb: 1 }} />
                        <Typography variant="caption" color="#999999">
                          PDF, DOC, DOCX files only
                        </Typography>


                        <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                      </UploadArea>
                    )}
                  </Grid>

                  <Grid item xs={12} sx={{mt:2}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={privacyCheck}
                          onChange={(e) => setPrivacyCheck(e.target.checked)}
                          sx={{
                            color: "#667eea",
                            "&.Mui-checked": {
                              color: "#667eea",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" color="#666666">
                          I agree to the{" "}
                          <Link href="/privacy" style={{ color: "#667eea", textDecoration: "none" }}>
                            privacy policy & terms
                          </Link>
                        </Typography>
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <PrimaryButton type="submit" fullWidth size="large" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Sign Up"}
                    </PrimaryButton>
                  </Grid>

                  {/* <Grid item xs={12}>
                    <Divider sx={{ my: 1 }}>
                      <Typography variant="body2" color="#999999">
                        Or Sign Up with
                      </Typography>
                    </Divider>
                  </Grid> */}

                  {/* <Grid item xs={6}>
                    <SocialButton
                      fullWidth
                      variant="outlined"
                      onClick={() => handleSocialLogin("google")}
                      startIcon={
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#db4437",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                          }}
                        >
                          G
                        </Box>
                      }
                    >
                      Google
                    </SocialButton>
                  </Grid>

                  <Grid item xs={6}>
                    <SocialButton
                      fullWidth
                      variant="outlined"
                      onClick={() => handleSocialLogin("linkedin")}
                      startIcon={
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "2px",
                            background: "#0077b5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                          }}
                        >
                          in
                        </Box>
                      }
                    >
                      LinkedIn
                    </SocialButton>
                  </Grid> */}

                  <Grid item xs={12}>
                    <Typography variant="body2" align="center" color="#666666" sx={{ mt: 2 }}>
                      Already have an account?{" "}
                      <Link href="/login" style={{ color: "#667eea", textDecoration: "none", fontWeight: 500 }}>
                        Sign in here
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </FormCard>
        </Container>
      </ContentArea>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainContainer>
  )
}
