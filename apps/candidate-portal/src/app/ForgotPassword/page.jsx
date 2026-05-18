'use client'

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter()

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async () => {
    if (!email) return setMessage('Please enter your email.');

    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(`${baseUrl}/v1/api/Auth/forgotpassword `, {
        "email":email,
      });
      if (res.data.status) {
        setMessage('Password reset link sent to your email.');
      } else {
        setMessage(res.data.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <Box
        sx={{
          backgroundColor: '#1d1b86',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '55%', justifyContent:"space-between" }}>
          <img src="/logo.png" alt="logo" style={{ height: 50, marginRight: 12 }} />
          <Typography variant="h5" color="white" onClick={()=>router.push("/ResetPassword")}>
            Forgot Password
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 500,
          margin: 'auto',
          marginTop: 8,
          padding: 6,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Enter your email to receive the reset link
        </Typography>

        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          size='small'
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 2,bgcolor:"#1d1b86" }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
        </Button>

        {message && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
