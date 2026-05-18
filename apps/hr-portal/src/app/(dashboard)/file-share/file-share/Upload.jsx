'use client';

import { useState, useRef } from 'react';
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function UploadComponent({ currentPath, onUploadComplete }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const fileInputRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = localStorage.getItem('accessToken');

  const handleOpen = () => {
    setOpen(true);
    setFiles([]);
    setUploadProgress({});
    setUploadStatus({});
  };

  const handleClose = () => {
    if (!uploading) {
      setOpen(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

    // Reset file input to allow selecting the same file again
    fileInputRef.current.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));

    // Also remove from progress and status
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });

    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[index];
      return newStatus;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (uploadStatus[i] === 'success') {
        successCount++;
        continue; // Skip already uploaded files
      }

      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', currentPath);

      try {
        await axios.post(`${baseUrl}/v1/api/fileShare/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: token
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({
              ...prev,
              [i]: percentCompleted
            }));
          }
        });

        setUploadStatus(prev => ({
          ...prev,
          [i]: 'success'
        }));

        successCount++;
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        setUploadStatus(prev => ({
          ...prev,
          [i]: 'error'
        }));
      }
    }

    setUploading(false);

    if (successCount === files.length) {
      // All files uploaded successfully
      setTimeout(() => {
        setOpen(false);
        if (onUploadComplete) {
          onUploadComplete();
        }
      }, 1000);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const allUploaded = files.length > 0 && files.every((_, i) => uploadStatus[i] === 'success');

  return (
    <>
      <Button
        variant="contained"
        startIcon={<UploadIcon />}
        onClick={handleOpen}
        size="small"
        sx={{ borderRadius: 1 }}
      >
        Upload
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6">Upload Files</Typography>
          <Typography variant="body2" color="text.secondary">
            {currentPath ? `to /${currentPath}` : 'to Root'}
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={uploading}
            size="small"
            sx={{ ml: 'auto' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 2 }}>
          {/* Drag and drop area */}
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 1,
              p: 3,
              mb: 2,
              textAlign: 'center',
              backgroundColor: '#f8f8f8',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: 'primary.main',
              },
            }}
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
            />
            <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Drag and drop files here or click to browse
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload multiple files at once
            </Typography>
          </Box>

          {/* Files list */}
          {files.length > 0 && (
            <Paper variant="outlined" sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
              <List disablePadding>
                {files.map((file, index) => (
                  <ListItem
                    key={`${file.name}-${index}`}
                    secondaryAction={
                      !uploading && uploadStatus[index] !== 'success' && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                    sx={{
                      py: 1,
                      borderBottom: index < files.length - 1 ? '1px solid #eee' : 'none'
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {uploadStatus[index] === 'success' ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : uploadStatus[index] === 'error' ? (
                        <ErrorIcon color="error" fontSize="small" />
                      ) : (
                        <FileIcon fontSize="small" color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" noWrap title={file.name}>
                          {file.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.size)}
                        </Typography>
                      }
                    />
                    <Box sx={{ width: '30%', ml: 2 }}>
                      {(uploading || uploadStatus[index]) && (
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress[index] || 0}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: uploadStatus[index] === 'error' ? '#ffcdd2' : undefined,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: uploadStatus[index] === 'error' ? '#f44336' : undefined,
                            }
                          }}
                        />
                      )}
                      <Typography variant="caption" color="text.secondary" align="right" sx={{ display: 'block', mt: 0.5 }}>
                        {uploadStatus[index] === 'success' ? 'Completed' : uploadStatus[index] === 'error' ? 'Failed' : `${uploadProgress[index] || 0}%`}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Success message */}
          {allUploaded && (
            <Alert severity="success" sx={{ mt: 2 }}>
              All files have been uploaded successfully!
            </Alert>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {files.length > 0 && (
              <Chip
                label={`${files.length} file${files.length !== 1 ? 's' : ''} selected`}
                variant="outlined"
                size="small"
                sx={{ mr: 2 }}
              />
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              onClick={handleClose}
              disabled={uploading}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={uploadFiles}
              variant="contained"
              disabled={files.length === 0 || uploading || allUploaded}
              startIcon={<UploadIcon />}
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
