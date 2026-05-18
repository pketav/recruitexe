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
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send, AttachFile, Close } from '@mui/icons-material';
import axios from 'axios';

const EmailForm = ({ to = '', accounts = [], onClose }) => {
  const [formData, setFormData] = useState({
    to,
    from: accounts.length > 0 ? accounts[0].email : '',
    subject: '',
    message: '',
    file: [] // allow only one file
  });

  const [uploading, setUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  // Authentication and API configuration
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Update form data when accounts or to prop changes
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

  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, file: [file] }));
    setFileInputKey(Date.now()); // Reset file input for new file selection
  };

  //  Remove attached file from form
  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: [] }));
  };

  /**
   * Upload file to server and return the file URL
   * Used for email attachments
   */
  const uploadFile = async file => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    setUploading(true);

    try {
      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        }
      });

      return res.data.url;
    } catch (err) {
      console.error('File upload failed:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle form submission and email sending
   * Validates form data, uploads files if any, and sends email
   */
  const handleSubmit = async e => {
    e.preventDefault();

    // Validate required fields
    const selectedAccount = accounts.find(acc => acc.email === formData.from);
    if (!formData.to || !selectedAccount) {
      setAlert({ show: true, message: 'Missing required fields.', severity: 'error' });
      return;
    }

    try {
      setSending(true);

      // Upload file if attached
      let fileUrl = '';
      if (formData.file.length > 0) {
        fileUrl = await uploadFile(formData.file[0]);
        if (!fileUrl) throw new Error('File upload failed');
      }

      // Prepare email payload
      const payload = {
        to: formData.to,
        subject: formData.subject,
        message: formData.message,
        userId: selectedAccount._id,
        file: fileUrl
      };

      // Send email through API
      const res = await axios.post(`${baseUrl}/v1/api/mail/send`, payload, {
        headers: { Authorization: token }
      });

      if (res.status === 200 && res.data.status) {
        setAlert({ show: true, message: 'Email sent successfully!', severity: 'success' });
        // Reset form after successful send
        setFormData({
          to: '',
          from: formData.from,
          subject: '',
          message: '',
          file: []
        });
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

      <Typography variant="h5" sx={{ mb: 3 }}>
        Compose Email
      </Typography>

      {/* Email composition form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* From field - Gmail account selection */}
          <FormControl fullWidth>
            <InputLabel id="from-label">From</InputLabel>
            <Select
              labelId="from-label"
              name="from"
              label="From"
              value={formData.from}
              onChange={handleChange}
              required
            >
              {accounts.map(acc => (
                <MenuItem key={acc._id} value={acc.email}>
                  {acc.email}
                </MenuItem>
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

          {formData.file.length > 0 && (
            <Chip
              label={formData.file[0].name}
              onDelete={removeFile}
              deleteIcon={<Close />}
              variant="outlined"
              sx={{ mb: 1 }}
            />
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<AttachFile />}
              disabled={formData.file.length >= 1}
            >
              Attach File
              <input
                type="file"
                hidden
                key={fileInputKey}
                onChange={handleFileUpload}
                accept="*"
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={sending || uploading}
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
