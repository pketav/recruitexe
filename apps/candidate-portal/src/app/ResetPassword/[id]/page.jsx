'use client';

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function ResetPassword() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
    const pathname = window.location.pathname;
    const token = pathname.split('/').pop(); 
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  const getStrength = (pwd) => {
    if (pwd.length < 6) return 'Weak';
    if (passwordRegex.test(pwd)) return 'Strong';
    return 'Medium';
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'Weak':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Strong':
        return 'success';
      default:
        return 'inherit';
    }
  };

  const handleReset = async () => {
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      return setError('Please fill all fields.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (!passwordRegex.test(password)) {
      return setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
    }

    setLoading(true);

    try {
        const res = await axios.post(`${baseUrl}/v1/api/Auth/resetPassword/${token}`, {
            password,
          });          
      if (res.data.status) {
        setMessage('Password has been reset successfully.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(res.data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setStrength(getStrength(password));
  }, [password]);

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
        <Box sx={{ display: 'flex', alignItems: 'center', width: '55%', justifyContent: "space-between" }}>
          <img src="/logo.png" alt="logo" style={{ height: 50, marginRight: 12 }} />
          <Typography variant="h5" color="white">
            Reset Password
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
          Set your new password
        </Typography>

        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
          margin="normal"
        />

        {password && (
          <>
            <LinearProgress
              variant="determinate"
              value={strength === 'Weak' ? 30 : strength === 'Medium' ? 60 : 100}
              color={getStrengthColor(strength)}
              sx={{ mt: 1, height: 8, borderRadius: 1 }}
            />
            <Typography variant="caption" color={getStrengthColor(strength)} sx={{ mt: 1, display: 'block' }}>
              Strength: {strength}
            </Typography>
          </>
        )}

        <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        size="small"
        margin="normal"
        error={confirmPassword.length > 0 && confirmPassword !== password}
        helperText={
            confirmPassword.length > 0 && confirmPassword !== password
            ? 'Passwords do not match.'
            : ''
        }
        />


        {message && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            {message}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleReset}
          disabled={loading || confirmPassword.length > 0 && confirmPassword !== password}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
        </Button>
      </Box>
    </Box>
  );
}
