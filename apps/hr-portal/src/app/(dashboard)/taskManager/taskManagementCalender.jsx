'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Grid, IconButton, Tooltip, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskList from './taskComponents/TasksList';
import AddTaskDialog from './taskComponents/AddTaskDialog';

const TaskManagementCalender = () => {
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchTasks();
    }
  }, [currentMonth, currentYear]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${baseUrl}/v1/api/task/getAllTaskListByCalendar?month=${currentMonth + 1}&year=${currentYear}`, {
        headers: {
          token: token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      
      if (data.status && data.items && data.items.tasks) {
        setTaskData(data.items.tasks);
      } else {
        setTaskData([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTaskData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTaskAdded = () => {
    fetchTasks();
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendar = () => {
    const days = daysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= days; i++) {
      calendar.push(i);
    }
    
    return calendar;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getTasksForDay = (day) => {
    if (!day) return [];
    
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split('T')[0];
    
    return taskData.filter(task => {
      const taskDate = new Date(task.dueDate);
      const taskDateString = taskDate.toISOString().split('T')[0];
      return taskDateString === dateString;
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <IconButton onClick={handlePrevMonth}>
            {'<'}
          </IconButton>
          <Typography variant="h6">
            {monthNames[currentMonth]} {currentYear}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            {'>'}
          </IconButton>
        </Box>
        <Tooltip title="Add Task">
          <IconButton 
            color="primary" 
            onClick={handleOpenModal}
            sx={{ 
              backgroundColor: 'primary.main', 
              color: 'white',
              '&:hover': { 
                backgroundColor: 'primary.dark' 
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={1}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Grid item xs={12/7} key={`header-${index}`}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 1, 
                fontWeight: 'bold',
                bgcolor: 'primary.light',
                color: 'white',
                borderRadius: '4px 4px 0 0'
              }}>
                {day}
              </Box>
            </Grid>
          ))}
          
          {generateCalendar().map((day, index) => {
            const tasks = getTasksForDay(day);
            const isToday = day === new Date().getDate() && 
                          currentMonth === new Date().getMonth() && 
                          currentYear === new Date().getFullYear();
            
            return (
              <Grid item xs={12/7} key={`day-${index}`}>
                {day ? (
                  <Card sx={{ 
                    height: '120px', 
                    position: 'relative',
                    borderColor: isToday ? 'primary.main' : 'grey.300',
                    borderWidth: isToday ? 2 : 1,
                    borderStyle: 'solid',
                    overflow: 'auto'
                  }}>
                    <Box sx={{ 
                      p: 1, 
                      position: 'sticky',
                      top: 0,
                      bgcolor: isToday ? 'primary.light' : 'grey.100',
                      color: isToday ? 'white' : 'inherit',
                      borderBottom: '1px solid',
                      borderColor: 'grey.300',
                      zIndex: 1
                    }}>
                      {day}
                    </Box>
                    <Box sx={{ p: 1 }}>
                      {tasks.length > 0 ? (
                        tasks.map((task, i) => (
                          <Box 
                            key={i} 
                            sx={{ 
                              p: 0.5,
                              mb: 0.5,
                              bgcolor: 'primary.50',
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {task.task}
                          </Box>
                        ))
                      ) : null}
                    </Box>
                  </Card>
                ) : (
                  <Box sx={{ height: '120px', bgcolor: 'grey.100', opacity: 0.5 }} />
                )}
              </Grid>
            );
          })}
        </Grid>
      )}

      {isModalOpen && (
        <AddTaskDialog
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          onTaskAdded={handleTaskAdded}
          self={true}
        />
      )}
    </Box>
  );
};

export default TaskManagementCalender;
