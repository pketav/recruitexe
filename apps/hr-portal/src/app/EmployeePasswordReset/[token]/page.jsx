'use client';

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  LinearProgress,
  useTheme,
  InputAdornment,
  IconButton,
  useMediaQuery,
  Paper
} from '@mui/material';
import { Lock } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';


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
  maxWidth: '440px'
}))

export default function EmployeePasswordReset({ params }) {
  const token = params.token;
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  const getStrength = (pwd) => {
    if (pwd.length < 6) return 'Weak';
    if (passwordRegex.test(pwd)) return 'Strong';
    return 'Medium';
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'Weak': return 'error';
      case 'Medium': return 'warning';
      case 'Strong': return 'success';
      default: return 'inherit';
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

    if (!token) {
      return setError('Invalid or missing token.');
    }

    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/v1/api/auth/employee/resetPassword/${token}`, {
        password,
      });

      if (res.data.status) {
        setMessage('Password has been reset successfully.');
        setTimeout(() => router.push('/login'), 2000);
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
    <MainContainer>
    <ForgotPasswordCard
      sx={{
        width: isMobile ? '90%' : '496px',
        p: 4,
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: 3,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Typography align="center" fontSize={'30px'} color="#4E36FF" fontWeight={700} my={2}>
        <img src="/logo.png" width={28} height={28} style={{ marginRight: '10px' }} />
        Recruit.exe
      </Typography>

      <Typography fontSize={'24px'} align="center" fontWeight={600} color="#344054" mb={2}>
        Reset Password
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography fontSize={'14px'} color="#344054" sx={{ mb: 1, fontWeight: 500 }}>
          New Password
        </Typography>
        <TextField
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: '#667085' }}>
                <IconButton>
                  <Lock />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

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

      <Box sx={{ my: 3 }}>
        <Typography fontSize={'14px'} color="#344054" sx={{ mb: 1, fontWeight: 500 }}>
          Confirm Password
        </Typography>
        <TextField
          fullWidth
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: '#667085' }}>
                <IconButton>
                  <Lock />
                </IconButton>
              </InputAdornment>
            )
          }}
          error={confirmPassword.length > 0 && confirmPassword !== password}
          helperText={
            confirmPassword.length > 0 && confirmPassword !== password
              ? 'Passwords do not match.'
              : ''
          }
        />
      </Box>

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {message && (
        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}

      <Button
        onClick={handleReset}
        disabled={loading || (confirmPassword.length > 0 && confirmPassword !== password)}
        fullWidth
        variant="contained"
        size="large"
        sx={{ bgcolor: '#4E36FF', fontSize: '16px', mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
      </Button>
    </ForgotPasswordCard>
    </MainContainer>
  );
}
