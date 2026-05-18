'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  Stack,
  TextareaAutosize,
  Card,
  CircularProgress
} from '@mui/material';
import { MdOutlineCheckCircle } from 'react-icons/md';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { BsFillCalendarDateFill } from "react-icons/bs";

const AddTaskDialog = ({ isModalOpen, handleCloseModal, onTaskAdded, initialTaskData, self, repeat, assignToPerticulerId, employeeName }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [tasks, setTasks] = useState([{ title: '', task: '', dueDate: getCurrentLocalDateTime() }]);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employeeIdFromToken, setEmployeeIdFromToken] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [taskNumbers, setTaskNumbers] = useState({});
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Helper function to get current local datetime in ISO format
  function getCurrentLocalDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const handleTaskTitleChange = (value) => {
    setTaskTitle(value);
  };

  const handleTitleChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].title = value;
    setTasks(newTasks);
  };

  // Parse the date string when needed
  const parseDateString = dateStr => {
    if (!dateStr) return new Date();

    // Handle the format: 2024-12-12T11:07:49 AM
    const [datePart, timePart] = dateStr.split('T');
    if (!datePart || !timePart) return new Date();

    const [timeWithSeconds, period] = timePart.split(' ');
    const [hours, minutes, seconds] = timeWithSeconds.split(':');
    const [year, month, day] = datePart.split('-');

    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour, parseInt(minutes), parseInt(seconds));
  };

  const formatDateTime = dateTimeStr => {
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

  useEffect(() => {
    if (initialTaskData) {
      const parsedDate = parseDateString(initialTaskData.dueDate);
      setTasks([
        {
          task: initialTaskData.task,
          id: initialTaskData.employeeId,
          dueDate: parsedDate.toISOString().slice(0, 16)
        }
      ]);
      if (initialTaskData.employeeId) {
        setId(initialTaskData.employeeId);
      }
    } else {
      setTasks([{ task: '', dueDate: getCurrentLocalDateTime() }]);
    }
  }, [initialTaskData]);

  const fetchEmployees = async (searchName = '') => {
    try {
      setLoading(true);

      // Build the API URL with search parameter if provided
      const url = searchName
        ? `${baseUrl}/v1/api/Auth/getAllEmployee?limit=10&employeName=${encodeURIComponent(searchName)}`
        : `${baseUrl}/v1/api/Auth/getAllEmployee?limit=10`;

      const response = await fetch(url, {
        headers: { 'Authorization': localStorage?.getItem('authToken')}
      });

      if (!response.ok) throw new Error('Failed to fetch employees');

      const data = await response.json();

      // Check if data.items.employees exists and is an array
      if (data.status && data.items && data.items.employees && Array.isArray(data.items.employees)) {
        if (searchName) {
          setFilteredEmployees(data.items.employees);
        } else {
          setEmployees(data.items.employees);
          setFilteredEmployees(data.items.employees);
        }
      } else {
        // Handle empty or invalid response
        if (searchName) {
          setFilteredEmployees([]);
        } else {
          setEmployees([]);
          setFilteredEmployees([]);
        }
      }
    } catch (error) {
      setError('Error fetching employees: ' + error.message);
      console.error('Error fetching employees:', error);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const getEmployeeIdFromToken = () => {
    try {
      const token = localStorage?.getItem('authToken');

      if (token) {
        const tokenDecodablePart = token.split('.')[1];
        const decoded = JSON.parse(atob(tokenDecodablePart));
        setEmployeeIdFromToken(decoded.Id);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const addNewTask = async () => {
    if (tasks.some(task => !task.task)) return;

    try {
      setLoading(true);
      if (repeat) {
        const formattedTasks = tasks.map(task => ({
          task: task.task,
          dueDate: formatDateTime(task.dueDate)
        }));

        const taskPayload = {
          assignBy: employeeIdFromToken,
          employeeId: selectedEmployees.length > 0
            ? selectedEmployees.map(emp => emp._id)
            : [employeeIdFromToken],
          tasks: formattedTasks,
          title: taskTitle || '',
        };

        const response = await fetch(`${baseUrl}/v1/api/task/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage?.getItem('authToken')
          },
          body: JSON.stringify(taskPayload)
        });

        if (!response.ok) throw new Error('Failed to add repeated task');

        const data = await response.json();
        if (data.status) {
          onTaskAdded && onTaskAdded();
          handleClose();
        }
      } else if (initialTaskData) {
        const reassignPayload = {
          id: initialTaskData._id,
          assignBy: employeeIdFromToken,
          employeeId: selectedEmployees.length > 0 ? selectedEmployees.map(emp => emp._id) : [employeeIdFromToken],
          dueDate: formatDateTime(tasks[0]?.dueDate || getCurrentLocalDateTime())
        };

        const response = await fetch(`${baseUrl}/v1/api/task/reassign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage?.getItem('authToken')
          },
          body: JSON.stringify(reassignPayload)
        });

        if (!response.ok) throw new Error('Failed to reassign task');

        const data = await response.json();
        if (data.status) {
          onTaskAdded && onTaskAdded();
          handleClose();
        }
      } else {
        const formattedTasks = tasks.map(task => ({
          title: task.title,
          task: task.task,
          dueDate: formatDateTime(task.dueDate)
        }));

        const taskPayload = {
          assignBy: employeeIdFromToken,
          employeeId: assignToPerticulerId
            ? [assignToPerticulerId]
            : selectedEmployees.length > 0
              ? selectedEmployees.map(emp => emp._id)
              : [employeeIdFromToken],
          tasks: formattedTasks,
          title: taskTitle || '',
        };

        const response = await fetch(`${baseUrl}/v1/api/task/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage?.getItem('authToken')
          },
          body: JSON.stringify(taskPayload)
        });

        if (!response.ok) throw new Error('Failed to add task');

        const data = await response.json();
        if (data.status) {
          onTaskAdded && onTaskAdded();
          handleClose();
        }
      }
    } catch (error) {
      setError('Error adding task: ' + error.message);
      console.error('Error adding task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = event => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (query.trim() === '') {
      setFilteredEmployees([]);
      return;
    }

    setSearchLoading(true);

    // Set new timeout to delay API call for better user experience
    const timeout = setTimeout(() => {
      fetchEmployees(query);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleEmployeeSelect = employee => {
    setSelectedEmployees(prevSelected => {
      // Check if employee is already selected
      const isAlreadySelected = prevSelected.some(emp => emp._id === employee._id);

      // If already selected, remove it; otherwise, add it
      return isAlreadySelected
        ? prevSelected.filter(emp => emp._id !== employee._id)
        : [...prevSelected, employee];
    });
  };

  const handleTaskChange = (index, value) => {
    const lines = value.split("\n");
    const numberedLines = lines.map((line, i) => {
      const stripped = line.replace(/^\d+\.\s*/, "");
      return stripped ? `${i + 1}. ${stripped}` : "";
    }).filter(Boolean);

    const newTasks = [...tasks];
    newTasks[index].task = numberedLines.join("\n");
    setTasks(newTasks);

    // Track number of lines for this task
    const newTaskNumbers = {...taskNumbers};
    newTaskNumbers[index] = numberedLines.length;
    setTaskNumbers(newTaskNumbers);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentTask = tasks[index].task;
      const lines = currentTask.split("\n");
      const currentNumber = (taskNumbers[index] || lines.length) + 1;

      const newTasks = [...tasks];
      newTasks[index].task = currentTask + `\n${currentNumber}. `;
      setTasks(newTasks);

      const newTaskNumbers = {...taskNumbers};
      newTaskNumbers[index] = currentNumber;
      setTaskNumbers(newTaskNumbers);
    }
  };

  const handleDateChange = (index, value) => {
    const newTasks = [...tasks];
    // Keep the original format for display in the input
    newTasks[index].dueDate = value;
    setTasks(newTasks);
  };

  const addTaskField = () => {
    if (!initialTaskData) {
      setTasks([...tasks, { task: '', dueDate: getCurrentLocalDateTime() }]);
    }
  };

  const removeTaskField = index => {
    if (!initialTaskData && tasks.length > 1) {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
    }
  };

  const resetForm = () => {
    setSearchQuery('');
    if (!initialTaskData) {
      setTasks([{ task: '', dueDate: getCurrentLocalDateTime() }]);
    }
    setTaskTitle('');
    setSelectedEmployees([]);
    setFilteredEmployees([]);
    setError(null);

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
  };

  const handleClose = () => {
    resetForm();
    handleCloseModal();
  };

  const handleSubmit = () => {
    addNewTask();
  };

  useEffect(() => {
    if (isModalOpen) {
      getEmployeeIdFromToken();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      resetForm();
    }
  }, [isModalOpen]);

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth
    >
      <DialogTitle>
        {repeat
          ? 'Repeat Task'
          : initialTaskData
            ? `Reassign Task${employeeName ? ` to ${employeeName}` : ''}`
            : `Add New Task${employeeName ? ` to ${employeeName}` : ''}`
        }
      </DialogTitle>
      <DialogContent>
        {error && (
          <Typography color='error' sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {!self && !repeat && !assignToPerticulerId && (
          <TextField
            autoFocus
            margin='dense'
            label='Search Employees'
            fullWidth
            variant='standard'
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
            disabled={loading}
            helperText="Type to search for employees"
          />
        )}
        {!self && !repeat && !assignToPerticulerId && (
          <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 2 }}>
            {searchLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : searchQuery.trim() !== '' ? (
              filteredEmployees.length > 0 ? (
                filteredEmployees.map(employee => (
                  <Card
                    key={employee._id}
                    sx={{
                      mb: 1,
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      bgcolor: selectedEmployees.some(emp => emp._id === employee._id) ? 'rgba(0, 188, 0, 0.1)' : 'inherit',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    {selectedEmployees.some(emp => emp._id === employee._id) && (
                      <MdOutlineCheckCircle
                        style={{
                          color: '#038a037a',
                          fontSize: '20px',
                          marginRight: '8px'
                        }}
                      />
                    )}
                    <Typography sx={{ textTransform: 'capitalize' }}>{employee.employeName}</Typography>
                  </Card>
                ))
              ) : (
                <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  {searchQuery.length > 0 ? 'No employees found' : 'Type to search for employees'}
                </Typography>
              )
            ) : null}
          </Box>
        )}
        {selectedEmployees.length > 0 && !repeat && (
          <Typography sx={{ mb: 2, color: 'text.secondary' }}>
            Selected Employees:{' '}
            <span style={{ color: '#00bc00', textTransform: 'capitalize' }}>
              {selectedEmployees.map(emp => emp.employeName).join(', ')}
            </span>
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {repeat || initialTaskData ? (
            <Stack spacing={2} sx={{ mb: 3, width: '100%' }}>
              <Typography variant='body1' color='text.secondary'>
                Task: {initialTaskData?.task}
              </Typography>
              <TextField
                label='Due Date and Time'
                type='datetime-local'
                value={tasks[0]?.dueDate || getCurrentLocalDateTime()}
                onChange={e => handleDateChange(0, e.target.value)}
                fullWidth
                size='small'
                InputLabelProps={{
                  shrink: true
                }}
                disabled={loading}
              />
            </Stack>
          ) : (
            <>
              {tasks.map((task, index) => (
                <Stack key={index} spacing={2} sx={{ mb: 3, width: '100%' }}>
                  {!repeat && !initialTaskData && index === 0 && (
                    <TextField
                      id="task-title-input"
                      label="Task Title"
                      size='small'
                      variant="outlined"
                      value={taskTitle}
                      onChange={e => handleTaskTitleChange(e.target.value)}
                      fullWidth
                      disabled={loading}
                      sx={{ mb: 2 }}
                    />
                  )}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextareaAutosize
                      style={{
                        width: '100%',
                        borderRadius: '3px',
                        height: '50px',
                        padding: '10px',
                        border: '1px solid #ccc'
                      }}
                      placeholder='You can enter multiple line here'
                      value={task.task}
                      onChange={e => handleTaskChange(index, e.target.value)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      disabled={loading}
                    />

                    {tasks.length > 1 && (
                      <IconButton onClick={() => removeTaskField(index)} color='error' disabled={loading}>
                        <DeleteIcon />
                      </IconButton>
                    )}

                    <Box sx={{ position: 'relative', width: '147px', display: 'inline-block' }}>
                      <input
                        id={`date-input-${index}`}
                        style={{
                          width: '100%',
                          cursor: 'pointer',
                          position: 'absolute',
                          zIndex: '1',
                          height: '50px',
                          borderRadius: '5px',
                          left: '0',
                          right: '0',
                        }}
                        type='datetime-local'
                        value={task.dueDate}
                        onChange={e => handleDateChange(index, e.target.value)}
                      />
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        p: 1,
                        borderRadius: 1
                      }}>
                        <Typography sx={{ flex: 1, fontSize: '8px' }}>{task.dueDate}</Typography>
                        <BsFillCalendarDateFill style={{ marginLeft: '8px' }}/>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              ))}
              <Box sx={{ display: 'flex', alignItems: 'center', display:'none' }}>
                <Button
                  onClick={addTaskField}
                  variant='outlined'
                  sx={{
                    p: 0,
                    borderRadius: '50%',
                    minWidth: '35px',
                    height: '35px',
                    ml: '6px'
                  }}
                  disabled={loading}
                >
                  <AddIcon />
                </Button>
                <Typography sx={{ fontSize: '10px', ml: '5px' }}>Add New Task</Typography>
              </Box>
            </>
          )}
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
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {repeat ? 'Repeat Task' : initialTaskData ? 'Reassign Task' : 'Add Tasks'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskDialog;
