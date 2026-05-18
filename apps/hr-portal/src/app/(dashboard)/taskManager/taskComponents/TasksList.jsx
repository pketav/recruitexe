import { Button, Card, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Grid, Menu, MenuItem, Radio, RadioGroup, TextareaAutosize, TextField, Tooltip, Typography } from '@mui/material';
import { Box, display, fontSize } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { CiEdit } from 'react-icons/ci';
import { IoIosArrowDown } from 'react-icons/io';
import { MdAdd, MdAddTask, MdDelete } from 'react-icons/md';
import { PiRepeatOnce } from 'react-icons/pi';
import { format, parseISO, isValid, differenceInDays } from 'date-fns'
import { BiSend } from 'react-icons/bi';
import AddTaskDialog from './AddTaskDialog';
import EditTaskDialog from './EditTaskDialog';


const TasksList = ({ tasks, type, employeeId  }) => {
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [selectedTaskData, setSelectedTaskData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [self, setSelf] = useState(false)
  const [allTasks, setAllTasks] = useState([])
  const [employeeIdFromToken, setEmployeeIdFromToken] = useState(null)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [localTasks, setLocalTasks] = useState({});
  const [menuAnchors, setMenuAnchors] = useState({})
  const [replyStates, setReplyStates] = useState({})
  const [comments, setComments] = useState({})
  const [error, setError] = useState(null)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    // Get initial height
    setPageHeight(window.innerHeight);

    // Add event listener for resize
    const handleResize = () => {
      setPageHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteDialog(true);
  };

  const handleEditClick = (taskId, taskText, taskTitle, dueDate) => {
    // Find the complete task data for the task being edited
    const taskData = allTasks.find(task => task._id === taskId);

    if (taskData) {
      setTaskToEdit(taskData);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };

  // Add a function to handle task updates
  const handleTaskUpdated = () => {
    fetchTasksByStatus(type);
  };

  const handleOpenModal = (taskData = null) => {
    setSelectedTaskData(taskData)
    setIsModalOpen(true)
  }

  const filterTasks = (tasks) => {
    const allTasks = Object.values(tasks).flat();

    return allTasks.filter(task => {
      if (statusFilter === 'all') return true;
      return task.status === statusFilter;
    });
  };

  const filteredTasks = filterTasks(tasks);

  // Modified filter change handler
  const handleFilterChange = event => {
    setStatusFilter(event.target.value);
  };

  const handleEditSubmit = async (taskId) => {
    if (!editedTaskText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/v1/api/task/selfTaskUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage?.getItem('authToken')
        },
        body: JSON.stringify({
          taskId: taskId,
          task: editedTaskText.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Update local state with the edited task
      setEditingTaskId(null);

      // Trigger a refresh of the tasks list

    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysDifference = startDate => {
    const parsedStartDate = parseDateString(startDate)
    if (!parsedStartDate || !isValid(parsedStartDate)) return 0
    const currentDate = new Date()
    const days = differenceInDays(currentDate, parsedStartDate)
    return Math.abs(days)
  }

  const handleEditCancel = () => {
    setEditingTaskId(null);
    setEditedTaskText('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTaskData(null)
    setSelf(null)
    setRepeat(null)
  }

  const handleTaskAdded = () => {
    fetchTasksByStatus(type)
  }

  const handleClick = (taskId, event) => {
    setMenuAnchors(prev => ({
      ...prev,
      [taskId]: event.currentTarget
    }))
  }

  const handleClose = taskId => {
    setMenuAnchors(prev => ({
      ...prev,
      [taskId]: null
    }))
  }

  const toggleReply = taskId => {
    setReplyStates(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }))
  }

  const handleCommentChange = (taskId, value) => {
    setComments(prev => ({
      ...prev,
      [taskId]: value
    }))
  }

  const formatDate = date => {
    if (!date) return ''
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return ''
    return format(dateObj, 'yyyy-MM-dd')
  }

  const parseDateString = dateString => {
    if (!dateString) return null
    const cleanedDate = dateString.replace(/\s*(AM|PM)/i, '').trim()
    const parsedDate = parseISO(cleanedDate)
    if (isValid(parsedDate)) return parsedDate
    const fallbackDate = new Date(dateString)
    return isValid(fallbackDate) ? fallbackDate : null
  }

  const fetchTasksByStatus = async (status, setTasksFunction) => {
    const idToUse = employeeId || employeeIdFromToken;

    setLoading(true)
    try {
      let url;
      if (type === 'selfTask') {
        url = `${baseUrl}/v1/api/task/taskBy?employeeId=${idToUse}&status=${status}&taskStatus=${statusFilter}`;
      } else {
        url = `${baseUrl}/v1/api/task/getTaskByParticularId?employeeId=${idToUse}&taskStatus=${statusFilter}&status=${type}`;
      }
      const response = await fetch(url, {
        headers: { 'Authorization': localStorage?.getItem('authToken') }
      })

      if (!response.ok) throw new Error(`Failed to fetch ${status} tasks`)

      const data = await response.json()
      if (data.status && data.items) {
        // Set the allTasks state with the items from the response
        const tasksData = data.items;
        setAllTasks(tasksData); // Add this line to set the tasks
        // Update assigned employees list if this is assigned tasks
      }
    } catch (err) {
      console.error(`Error fetching ${status} tasks:`, err)
      setError(`Failed to fetch ${status} tasks`)
    } finally {
      setLoading(false)
    }
  }

  // Add this useEffect to TasksList component
  // First, update the token decoding useEffect to handle fetching tasks after getting employeeId
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const token = localStorage?.getItem('accessToken')
        const tokenDecodablePart = token?.split('.')[1]
        const decoded = JSON.parse(atob(tokenDecodablePart))
        const employeeId = decoded?.Id
        if (employeeId) {
          setEmployeeIdFromToken(employeeId)
        }
      } catch (err) {
        console.error('Error decoding token:', err)
        // setError('Error authenticating user')
      }
    }

    fetchEmployeeId();
  }, []);

  // Add a new useEffect that will fetch tasks whenever employeeIdFromToken is set
  // or when the status filter changes
  useEffect(() => {
    // Only proceed if we have an employeeId (either from props or token)
    fetchTasksByStatus(type)
  }, [employeeIdFromToken, statusFilter, type]);

  const handleAddTaskOpenModal = (taskData = null) => {
    setIsModalOpen(true)
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/task/replyOnTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage?.getItem('authToken')
        },
        body: JSON.stringify({
          taskId: taskId,
          status: newStatus
        })
      });

      if (!response.ok) throw new Error('Failed to update status');

      fetchTasksByStatus(type)
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddSelfTaskOpenModal = () => {
    setSelf(true)
    setIsModalOpen(true)
  }

  const handleSubmitComment = async taskId => {
    if (!comments[taskId]?.trim()) return;

    try {
      const response = await fetch(`${baseUrl}/v1/api/task/replyOnTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage?.getItem('authToken')
        },
        body: JSON.stringify({
          taskId: taskId,
          content: comments[taskId]
        })
      });

      if (!response.ok) throw new Error('Failed to submit comment');

      setComments(prev => ({
        ...prev,
        [taskId]: ''
      }));

      // Send message with specific task type
      fetchTasksByStatus(type)
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleAddRepeatTaskOpenModal = (taskData = null) => {
    setRepeat(true)
    setSelectedTaskData(taskData)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    setLoading(true) // Show loading state
    try {
      const response = await fetch(`${baseUrl}/v1/api/task/selfTaskDelete?taskId=${taskToDelete}`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage?.getItem('authToken')
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      // Reset task ID
      fetchTasksByStatus(type)
    } catch (error) {
      // Optionally show error message to user
      setError('Failed to delete task. Please try again.')
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
      setTaskToDelete(null)
    }
  }

  return (
    <>
      {type === "selfTask" && (
        <Card style={{ padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} sx={{backgroundColor: 'primary.main',}}>
          <Typography style={{textAlign:'center',fontWeight:'800', color:'white'}}>
            {type === "selfTask" ? "Self Task" : "Assigned Task" }
          </Typography>
          <MdAdd
            onClick={type === "selfTask" ? handleAddSelfTaskOpenModal : handleAddTaskOpenModal}
            style={{ fontWeight: '900', cursor: 'pointer',color:'white' }}
          />
        </Card>
      )}

      <RadioGroup style={{ padding: '0px 5px' }} onChange={handleFilterChange} value={statusFilter} row>
        <FormControlLabel
          sx={{ '.MuiFormControlLabel-label': { fontSize: '12px' } }}
          value='pending'
          control={<Radio color='warning' />}
          label='Pending'
        />
        <FormControlLabel
          sx={{ '.MuiFormControlLabel-label': { fontSize: '12px' } }}
          value='completed'
          control={<Radio color='warning' />}
          label='Completed'
        />
        <FormControlLabel
          sx={{ '.MuiFormControlLabel-label': { fontSize: '12px' } }}
          value='all'
          control={<Radio color='warning' />}
          label='All Task'
        />
      </RadioGroup>

      <Box style={type === "selfTask" ? {height: pageHeight-190, overflowY: 'scroll'} : {}}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {allTasks.length === 0 ? (
            <Grid item xs={12}>
              <Typography>No tasks available.</Typography>
            </Grid>
          ) : null}

          {loading ? (
            <Grid item xs={12}>
              <Box style={{ display: 'flex',
                justifyContent: 'center',
                position: 'fixed',
                left: '0',
                right: '0',
                top: '50%'}}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : null}

          {/* Fixed map function with proper keys */}
          {Array.isArray(allTasks) && allTasks.map((task, index) => (
            <Grid
              item
              sm={12}
              md={type === "selfTask" ? 12 : 4}
              lg={type === "selfTask" ? 12 : 4}
              key={task._id || `task-${index}`} // Add unique key here
            >
              <Card
                sx={{ mb: 2, p: 2 }}
                style={{
                  background: '#ff800000',
                  position:'relative',
                  border: task.status === 'pending' ? '1px solid #ff8000' :
                         task.status === 'approved' ? '1px solid green' :
                         task.status === 'completed' ? '1px solid #05BA65' :
                         task.status === 'WIP' ? '1px solid #00e3ff' :
                         task.status === 'processing' ? '1px solid #ff00c3' :
                         '1px solid red',
                  boxShadow: task.status === 'pending' ? '0px 2px 0px #ff8000' :
                            task.status === 'approved' ? '0px 2px 0px green' :
                            task.status === 'completed' ? '0px 2px 0px #05BA65' :
                            task.status === 'WIP' ? '0px 2px 0px #00e3ff' :
                            task.status === 'processing' ? '0px 2px 0px #ff00c3' :
                            '0px 2px 0px red'
                }}
              >
                {(type === 'selfTask' || type === 'assignedTask') && (
                  <>
                    <CiEdit
                      onClick={() => handleEditClick(task._id, task.task, task.title, task.dueDate)}
                      style={{
                        position: 'absolute',
                        top: '9px',
                        cursor:'pointer',
                        right: '32px',
                        fontSize: '17px',
                        color: task.status === 'pending' ? '#ff8000' :
                         task.status === 'approved' ? 'green' :
                         task.status === 'completed' ? '#05BA65' :
                         task.status === 'WIP' ? '#00e3ff' :
                         task.status === 'processing' ? '#ff00c3' :
                         'red',
                      }}
                    />
                    <MdDelete
                      className="cursor-pointer hover:text-red-600 transition-colors"
                      style={{
                        position: 'absolute',
                        top: '9px',
                        cursor:'pointer',
                        right: '7px',
                        fontSize: '17px',
                        color: task.status === 'pending' ? '#ff8000' :
                         task.status === 'approved' ? 'green' :
                         task.status === 'completed' ? '#05BA65' :
                         task.status === 'WIP' ? '#00e3ff' :
                         task.status === 'processing' ? '#ff00c3' :
                         'red',
                      }}
                      onClick={() => handleDeleteClick(task._id)}
                    />
                  </>
                )}

                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle1' style={{paddingRight:'17px'}}>
                    {editingTaskId === task._id ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextareaAutosize
                          style={{
                            padding: '8px',
                            fontWeight: '400',
                            borderRadius: '10px',
                            border: task.status === 'pending' ? '1px solid #ff8000' :
                                   task.status === 'approved' ? '1px solid green' :
                                   task.status === 'completed' ? '1px solid #05BA65' :
                                   task.status === 'WIP' ? '1px solid #00e3ff' :
                                   task.status === 'processing' ? '1px solid #ff00c3' :
                                   '1px solid red',
                          }}
                          size="small"
                          fullWidth
                          value={editedTaskText}
                          onChange={(e) => setEditedTaskText(e.target.value)}
                          disabled={loading}
                        />
                        <Button
                          size="small"
                          onClick={() => handleEditSubmit(task._id)}
                          disabled={loading || !editedTaskText.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          onClick={handleEditCancel}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <div style={{ whiteSpace: 'pre-line' }}>
                        {task.title}
                      </div>
                    )}
                  </Typography>

                  <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      onClick={e => handleClick(task._id, e)}
                      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', display: 'none' }}
                    >
                      <Typography style={{ fontSize: '11px' }}>{task.status}</Typography>
                      <IoIosArrowDown style={{ marginTop: '7px' }} />
                    </Box>

                    <Menu
                      anchorEl={menuAnchors[task._id]}
                      open={Boolean(menuAnchors[task._id])}
                      onClose={() => handleClose(task._id)}
                    >
                      <MenuItem onClick={() => handleStatusChange(task._id, 'pending')}>Pending</MenuItem>
                      <MenuItem onClick={() => handleStatusChange(task._id, 'completed')}>Completed</MenuItem>
                    </Menu>
                  </Box>
                </Box>

                <Box style={{fontSize:'14px', whiteSpace: 'pre-line'}}>
                  <span style={{fontSize:'10px'}}>Tasks List</span>
                  <br />
                  {task.task}
                </Box>

                <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', flexWrap: 'wrap' }}>
                  {type === 'assignedTask' ? (
                    <Typography variant='body2' style={{ fontSize: '9px', marginRight: '7px' }}>
                      Assigned To:{' '}
                      <span style={{ textTransform: 'capitalize', color: '#00bc00' }}>
                        {task.employeeDetail?.employeName || 'N/A'}
                      </span>
                    </Typography>
                  ) : (
                    <Typography variant='body2' style={{ fontSize: '9px', marginRight: '7px' }}>
                      Assign By:{' '}
                      <span style={{ textTransform: 'capitalize', color: '#00bc00' }}>
                        {task.assignDetail?.employeName || 'N/A'}
                      </span>
                    </Typography>
                  )}
                  <Typography variant='body2' style={{ fontSize: '9px', marginRight: '7px' }}>
                    Due Date: {formatDate(parseDateString(task.dueDate))}
                  </Typography>
                  <Typography variant='body2' style={{ fontSize: '9px', marginRight: '7px' }}>
                    {getDaysDifference(task.startDate)} days ago
                  </Typography>
                  <Typography variant='body2' style={{ fontSize: '9px', marginRight: '7px' }}>
                    Created: {formatDate(parseDateString(task.startDate))}
                  </Typography>
                </Box>

                <Box style={{display:'flex', alignItems: 'center', marginTop:'10px', flexWrap:'wrap'}}>
                  <Box style={{display:'flex'}}>
                    <Button
                      variant={task.status === 'pending' ? 'contained' : 'outlined'}
                      style={{fontSize:'10px', padding:'3px'}}
                      onClick={() => handleStatusChange(task._id, 'pending')}
                    >
                      Pending
                    </Button>
                    <Button
                      variant={task.status === 'completed' ? 'contained' : 'outlined'}
                      style={{fontSize:'10px', padding:'3px', marginLeft:'7px',marginRight:'7px'}}
                      onClick={() => handleStatusChange(task._id, 'completed')}
                    >
                      Completed
                    </Button>
                  </Box>

                  <Tooltip title="Re-Assign" arrow placement="bottom">
                    <Button
                      onClick={() => handleOpenModal({
                        _id: task._id,
                        task: task.task,
                        dueDate: task.dueDate || task.startDate
                      })}
                      style={{ marginRight: '2px', color: 'blue', cursor: 'pointer', padding:'0', minWidth:'30px' }}
                    >
                      <MdAddTask />
                    </Button>
                  </Tooltip>

                  <Tooltip title="Repeat Task" arrow placement="bottom">
                    <Button
                      onClick={() => handleAddRepeatTaskOpenModal({
                        _id: task._id,
                        employeeId: task?.employeeDetail?._id,
                        task: task.task,
                        dueDate: task.dueDate || task.startDate
                      })}
                      style={{ marginRight: '10px', color: 'blue', cursor: 'pointer', padding:'0', minWidth:'15px' }}
                    >
                      <PiRepeatOnce style={{color:'#ff00fc'}} />
                    </Button>
                  </Tooltip>

                  <Box
                    onClick={() => toggleReply(task._id)}
                    style={{
                      display: 'flex',
                      fontSize: '10px',
                      cursor: 'pointer',
                      alignItems: 'center',
                      display:'none'
                    }}
                  >
                    <Typography style={{ fontSize: '10px', position:'relative' }}>
                      <span style={{zIndex:'1',position:'relative'}}>Reply</span>
                      {task.remark && task.remark.length > 0 && (
                        <Typography style={{
                          fontSize: '8px',
                          position: 'absolute',
                          height: '15px',
                          width: '15px',
                          background: '#007fbe',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          top: '-7px',
                          borderRadius: '50%',
                          color: 'wheat',
                          left: '35px',
                          zIndex: '0',
                        }}>
                          {task.remark.length}
                        </Typography>
                      )}
                    </Typography>
                    <IoIosArrowDown
                      style={{
                        marginLeft: '4px',
                        transform: replyStates[task._id] ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s'
                      }}
                    />
                  </Box>
                </Box>

                <Collapse in={replyStates[task._id]}>
                  <Box>
                    {task.remark && task.remark.length > 0 && (
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <Box style={{ margin: 0, padding: '0 0 0 5px' }}>
                          {task.remark.map(remarkItem => {
                            const formatRemarkTime = timeStr => {
                              try {
                                const cleanTimeStr = timeStr.replace('T', ' ')
                                const [datePart, timePart] = cleanTimeStr.split(' ')
                                const [year, month, day] = datePart.split('-')
                                let [hours, minutes] = timePart.split(':')
                                const isPM = timePart.includes('PM')
                                hours = parseInt(hours)
                                if (isPM && hours !== 12) hours += 12
                                if (!isPM && hours === 12) hours = 0
                                const date = new Date(year, month - 1, day, hours, parseInt(minutes))
                                return date.toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })
                              } catch (error) {
                                console.error('Error parsing date:', error)
                                return timeStr
                              }
                            }

                            // Add key to each remark item
                            return (
                              <Box
                                data-aos="zoom-in-right"
                                data-aos-duration='3000'
                                key={remarkItem.remarkId || `remark-${task._id}-${Math.random()}`} // Fixed key here
                                style={{
                                  fontSize: '12px',
                                  marginBottom: '4px',
                                  position: 'relative',
                                  width: '50%',
                                  marginLeft: remarkItem?.remarkUser?.type === 'otherReply' ? '0' : 'auto',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {remarkItem?.remarkUser?.type !== 'otherReply' && (
                                  <>
                                    <Card
                                      style={{
                                        padding: '10px',
                                        borderRadius: remarkItem?.remarkUser?.type === '0' ? '10px 10px 10px 0px' : '10px 10px 10px 0px'
                                      }}
                                    >
                                      <Typography variant='body2' sx={{ fontSize: '12px' }}>
                                        {remarkItem.content}
                                      </Typography>
                                      <Typography
                                        variant='caption'
                                        sx={{
                                          fontSize: '9px',
                                          color: 'text.secondary',
                                          display: 'block'
                                        }}
                                      >
                                        <span style={{ color: '#00cbff' }}>{formatRemarkTime(remarkItem.time)}</span> By{' '}
                                        {remarkItem?.remarkUser?.employeName}
                                      </Typography>
                                    </Card>
                                    <img
                                      style={{
                                        left: 0,
                                        top: '8px',
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '5px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        backgroundColor: '#666'
                                      }}
                                      src={`${remarkItem?.remarkUser?.employeePhoto}` || 'https://stageapi.fincooper.in/uploads/file_1731650917428.nikit.webp'}
                                      alt={`${remarkItem?.remarkUser?.employeName || 'User'}`} // Added alt text
                                    />
                                  </>
                                )}

                                {remarkItem?.remarkUser?.type === 'otherReply' && (
                                  <>
                                    <img
                                      style={{
                                        left: 0,
                                        top: '8px',
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '5px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        backgroundColor: '#666'
                                      }}
                                      src={`${remarkItem?.remarkUser?.employeePhoto}` || 'https://stageapi.fincooper.in/uploads/file_1731650917428.nikit.webp'}
                                      alt={`${remarkItem?.remarkUser?.employeName || 'User'}`} // Added alt text
                                    />
                                    <Card
                                      style={{
                                        padding: '10px',
                                        borderRadius: remarkItem?.remarkUser?.type === '0' ? '10px 10px 10px 0px' : '10px 10px 10px 0px'
                                      }}
                                    >
                                      <Typography variant='body2' sx={{ fontSize: '12px' }}>
                                        {remarkItem.content}
                                      </Typography>
                                      <Typography
                                        variant='caption'
                                        sx={{
                                          fontSize: '9px',
                                          color: 'text.secondary',
                                          display: 'block'
                                        }}
                                      >
                                        <span style={{ color: '#00cbff' }}>{formatRemarkTime(remarkItem.time)}</span> By{' '}
                                        {remarkItem?.remarkUser?.employeName}
                                      </Typography>
                                    </Card>
                                  </>
                                )}
                              </Box>
                            )
                          })}
                        </Box>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mt: 1, display: 'flex', gap: 1, position: 'relative' }}>
                    <TextField
                      size='small'
                      fullWidth
                      placeholder='Type your reply...'
                      value={comments[task._id] || ''}
                      onChange={e => handleCommentChange(task._id, e.target.value)}
                    />
                    <Button
                      style={{ position: 'absolute', right: 0, top: '3px' }}
                      size='small'
                      onClick={() => handleSubmitComment(task._id)}
                      disabled={!comments[task._id]?.trim()}
                      sx={{ minWidth: '80px', alignSelf: 'flex-end' }}
                    >
                      <BiSend style={{ fontSize: '20px' }} />
                    </Button>
                  </Box>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this task? This action cannot be undone. All associated comments and chat
            history will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} variant='outlined'>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant='contained' color='error' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Task Dialog */}
      <AddTaskDialog
        isModalOpen={isModalOpen}
        handleCloseModal={() => {
          handleCloseModal();
        }}
        onTaskAdded={handleTaskAdded}
        initialTaskData={selectedTaskData}
        self={self}
        repeat={repeat}
        edit={selectedTaskData?.edit} // Add this prop to pass the edit flag
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        isModalOpen={isEditModalOpen}
        handleCloseModal={handleCloseEditModal}
        onTaskUpdated={handleTaskUpdated}
        taskData={taskToEdit}
      />
    </>
  )
}

export default TasksList
