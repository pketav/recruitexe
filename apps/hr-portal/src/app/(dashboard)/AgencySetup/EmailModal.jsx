import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import { Send, InsertDriveFile } from '@mui/icons-material';
import axios from 'axios';

const EmailForm = ({ to = '', accounts = [], onClose, fileUrl = '' }) => {
  const [formData, setFormData] = useState({
    to,
    from: accounts.length > 0 ? accounts[0].email : '',
    subject: '',
    message: ''
  });

  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      to,
      from: accounts.length > 0 ? accounts[0].email : prev.from
    }));
  }, [to, accounts]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const selectedAccount = accounts.find(acc => acc.email === formData.from);
    if (!formData.to || !selectedAccount) {
      setAlert({ show: true, message: 'Missing required fields.', severity: 'error' });
      return;
    }

    try {
      setSending(true);

      const payload = {
        to: formData.to,
        subject: formData.subject,
        message: formData.message,
        userId: selectedAccount._id,
        file: fileUrl // ✅ sending the file URL directly
      };

      const res = await axios.post(`${baseUrl}/v1/api/mail/send`, payload, {
        headers: { Authorization: token }
      });

      if (res.status === 200 && res.data.status) {
        setAlert({ show: true, message: 'Email sent successfully!', severity: 'success' });
        setFormData({ to: '', from: formData.from, subject: '', message: '' });
      } else {
        throw new Error(res.data.message || 'Unknown error');
      }
    } catch (err) {
      setAlert({ show: true, message: err.message, severity: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {alert.show && (
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Typography variant="h5" sx={{ mb: 3 }}>Compose Email</Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth required>
            <InputLabel id="from-label">From</InputLabel>
            <Select
              labelId="from-label"
              name="from"
              label="From"
              value={formData.from}
              onChange={handleChange}
            >
              {accounts.map(acc => (
                <MenuItem key={acc._id} value={acc.email}>{acc.email}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField name="to" label="To" value={formData.to} onChange={handleChange} fullWidth required />
          <TextField name="subject" label="Subject" value={formData.subject} onChange={handleChange} fullWidth required />
          <TextField
            name="message"
            label="Message"
            value={formData.message}
            onChange={handleChange}
            fullWidth
            multiline
            rows={6}
            required
          />

          {/* ✅ Show Excel icon + download link */}
          {fileUrl && (
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <InsertDriveFile color="primary" />
              <Typography variant="body2" color="textSecondary">
                Attached: <a href={fileUrl} target="_blank" rel="noopener noreferrer">Excel Report</a>
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default EmailForm;
