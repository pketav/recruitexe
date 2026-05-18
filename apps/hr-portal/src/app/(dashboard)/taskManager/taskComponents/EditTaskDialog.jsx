'use client';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  TextareaAutosize
} from '@mui/material';
import { useEffect, useState } from 'react';
import { BsFillCalendarDateFill } from "react-icons/bs";

const EditTaskDialog = ({ isModalOpen, handleCloseModal, onTaskUpdated, taskData }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskContent, setTaskContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskNumber, setTaskNumber] = useState(1);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Initialize form data when modal opens or task data changes
  useEffect(() => {
    if (taskData) {
      setTaskTitle(taskData.title || '');
      setTaskContent(taskData.task || '');
      setDueDate(taskData.dueDate || getCurrentLocalDateTime());



      // Count the number of lines to set the next task number
      if (taskData.task) {
        const lines = taskData.task.split('\n');
        const numberedLines = lines.filter(line => /^\d+\.\s/.test(line));
        setTaskNumber(numberedLines.length + 1);
      } else {
        setTaskNumber(1);
      }

      // Format the date for the datetime-local input
      if (taskData.dueDate) {
        try {
          const date = new Date(taskData.dueDate);
          if (!isNaN(date.getTime())) {
            setDueDate(date.toISOString().slice(0, 16));
          } else {
            setDueDate(getCurrentLocalDateTime());
          }
        } catch (error) {
          console.error('Error parsing date:', error);
          setDueDate(getCurrentLocalDateTime());
        }
      } else {
        setDueDate(getCurrentLocalDateTime());
      }
    }
  }, [taskData, isModalOpen]);

  // Helper function to get current local datetime in ISO format
  function getCurrentLocalDateTime() {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }

  // Format date for API submission
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';

    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Return in the desired format: 2024-12-12T11:07:49 AM
    return `${year}-${month}-${day}T${String(hours12).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  };

  // Handle task content changes with auto-numbering
  const handleTaskChange = (value) => {
    const lines = value.split("\n");
    const numberedLines = lines.map((line, i) => {
      // Remove existing numbering if present
      const stripped = line.replace(/^\d+\.\s*/, "");
      return stripped ? `${i + 1}. ${stripped}` : "";
    }).filter(Boolean);

    setTaskContent(numberedLines.join("\n"));
    setTaskNumber(numberedLines.length + 1);
  };

  // Handle Enter key to add a new numbered line
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTaskContent = taskContent + `\n${taskNumber}. `;
      setTaskContent(newTaskContent);
      setTaskNumber(taskNumber + 1);
    }
  };

  const handleSubmit = async () => {
    if (!taskContent.trim()) {
      setError('Task content cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/v1/api/task/selfTaskUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage?.getItem('authToken')
        },
        body: JSON.stringify({
          taskId: taskData._id,
          task: taskContent.trim(),
          title: taskTitle || '',
          dueDate: formatDateTime(dueDate)
        })
      });

      if (!response.ok) throw new Error('Failed to update task');

      const data = await response.json();
      if (data.status) {
        onTaskUpdated && onTaskUpdated();
        handleClose();
      } else {
        throw new Error(data.message || 'Failed to update task');
      }
    } catch (error) {
      setError('Error updating task: ' + error.message);
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    handleCloseModal();
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
    >
      <DialogTitle>Edit Task  {dueDate}</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color='error' sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <TextField
            id="task-title-input"
            label="Task Title"
            size='small'
            variant="outlined"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            fullWidth
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>Task Content</Typography>
          <TextareaAutosize
            style={{
              width: '100%',
              borderRadius: '3px',
              minHeight: '80px',
              padding: '10px',
              border: '1px solid #ccc',
              marginBottom: '20px'
            }}
            value={taskContent}
            onChange={(e) => handleTaskChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            disabled={loading}
            placeholder='You can Enter multiple line here'
          />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>Due Date</Typography>
          <Box sx={{ display: 'flex', position: 'relative', width: '250px' }}>
            <input
              style={{
                width: '100%',
                cursor: 'pointer',
                position: 'absolute',
                zIndex: 1,
                height: '45px',
                borderRadius: '5px',
                opacity: 0
              }}
              type='datetime-local'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
            />
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '4px',
              width: '100%'
            }}>
              <Typography sx={{ flex: 1 }}>
                {new Date(dueDate).toLocaleString()}
              </Typography>
              <BsFillCalendarDateFill style={{ marginLeft: '8px' }} />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          color='primary'
          disabled={loading || !taskContent.trim()}
        >
          Update Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskDialog;
