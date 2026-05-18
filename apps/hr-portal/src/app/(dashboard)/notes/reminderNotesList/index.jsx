'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Avatar,
  Chip,
  Divider,
  ListItemAvatar,
  Tabs,
  Tab,
  Badge
} from '@mui/material'
import {
  Edit as EditIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Share as ShareIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  ScheduleSend as ScheduleSendIcon,
  History as HistoryIcon
} from '@mui/icons-material'

import AddNoteButton from '../addNoteButton'
import { CiCircleCheck } from "react-icons/ci";
import dayjs from 'dayjs'

// Base URL for API
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// API functions for notes
const api = {
  getNotes: async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/remindersNotesByTokenId`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      })
      if (!response.ok) throw new Error('Failed to fetch notes')
      const data = await response.json()
      return data?.status ? data.items : []
    } catch (error) {
      console.error('Error fetching notes:', error)
      return []
    }
  },

  deleteNote: async notesId => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify({ notesId })
      })
      if (!response.ok) throw new Error('Failed to delete note')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  },

  shareNotes: async (notesId, sharedWith) => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/shareNotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify({
          notesId,
          sharedWith
        })
      });
      if (!response.ok) throw new Error('Failed to share note');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sharing note:', error);
      throw error;
    }
  },

  getAllEmployees: async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/employe/getAllEmploye`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      return data?.status ? data.items : [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  getNotesSharedEmployees: async (notesId) => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/getNotesSharedEmployees?notesId=${notesId}`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      });
      if (!response.ok) throw new Error('Failed to fetch shared employees');
      const data = await response.json();
      return data?.status ? data.items : [];
    } catch (error) {
      console.error('Error fetching shared employees:', error);
      return [];
    }
  }
}

// Helper function to strip HTML for display in note cards
const stripHTML = html => {
  if (!html || typeof document === 'undefined') return ''
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
}

// Helper function to extract images from HTML content
const extractImages = htmlContent => {
  if (!htmlContent || typeof document === 'undefined') return []

  const images = []
  const div = document.createElement('div')
  div.innerHTML = htmlContent

  const imgElements = div.querySelectorAll('img')
  imgElements.forEach(img => {
    images.push(img.src)
  })

  return images
}

// Helper function to check if reminder is outdated
const isReminderOutdated = (note) => {
  if (!note.reminderAt) return false

  try {
    const reminderDateTime = dayjs(note.reminderAt)
    const now = dayjs()

    const isOutdated = reminderDateTime.isBefore(now)
    console.log(`Note "${note.title}": reminderAt=${note.reminderAt}, isOutdated=${isOutdated}`) // Debug log

    return isOutdated
  } catch (error) {
    console.error('Error parsing reminder date:', error)
    return false
  }
}

// Helper function to check if reminder is upcoming
const isReminderUpcoming = (note) => {
  if (!note.reminderAt) return false

  try {
    const reminderDateTime = dayjs(note.reminderAt)
    const now = dayjs()

    const isUpcoming = reminderDateTime.isAfter(now)
    console.log(`Note "${note.title}": reminderAt=${note.reminderAt}, isUpcoming=${isUpcoming}`) // Debug log

    return isUpcoming
  } catch (error) {
    console.error('Error parsing reminder date:', error)
    return false
  }
}

// Helper function to format reminder date time
const formatReminderDateTime = (note) => {
  if (!note.reminderAt) return ''

  try {
    const reminderDateTime = dayjs(note.reminderAt)
    return reminderDateTime.format('MMM DD, h:mm A')
  } catch (error) {
    console.error('Error formatting reminder date:', error)
    return ''
  }
}

const ReminderNotesList = ({}) => {
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [activeTab, setActiveTab] = useState(0) // 0: All, 1: Outdated, 2: Upcoming
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // Delete confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [pageHeight, setPageHeight] = useState(0)

  // Share functionality state
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState([]) // Array of employees to be added
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)
  const [isSharingNote, setIsSharingNote] = useState(false)
  const [noteToShare, setNoteToShare] = useState(null)
  const [sharedEmployees, setSharedEmployees] = useState([]) // Already shared employees
  const [isLoadingSharedEmployees, setIsLoadingSharedEmployees] = useState(false)
  const [showEmployeeList, setShowEmployeeList] = useState(false) // Show/hide employee search list

  useEffect(() => {
    // Get initial height
    setPageHeight(window.innerHeight)

    // Add event listener for resize
    const handleResize = () => {
      setPageHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Load notes from API
  useEffect(() => {
    fetchNotes()
  }, [])

  // Fetch notes function (for reuse)
  const fetchNotes = async () => {
    setIsLoading(true)
    try {
      const notesData = await api.getNotes()
      console.log('Fetched notes:', notesData) // Debug log
      console.log('Notes with reminderAt:', notesData.filter(note => note.reminderAt)) // Debug log
      setNotes(notesData)
    } catch (error) {
      console.error('Error fetching notes:', error)
      setNotes([])
      showSnackbar('Failed to load notes', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch employees function
  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const employeesData = await api.getAllEmployees();
      setEmployees(employeesData);
      setFilteredEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showSnackbar('Failed to load employees', 'error');
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // Fetch shared employees function
  const fetchSharedEmployees = async (notesId) => {
    setIsLoadingSharedEmployees(true);
    try {
      const sharedData = await api.getNotesSharedEmployees(notesId);
      setSharedEmployees(sharedData);
      return sharedData; // Return the data for use in other functions
    } catch (error) {
      console.error('Error fetching shared employees:', error);
      showSnackbar('Failed to load shared employees', 'error');
      return [];
    } finally {
      setIsLoadingSharedEmployees(false);
    }
  };

  // Handle employee search
  const handleEmployeeSearch = (searchTerm) => {
    setEmployeeSearchTerm(searchTerm);
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee => {
        const isAlreadyShared = sharedEmployees.some(shared => shared.employeUniqueId === employee.employeUniqueId);
        const isAlreadySelected = selectedEmployees.some(selected => selected.employeeId === employee._id);

        return !isAlreadyShared && !isAlreadySelected && (
          employee.employeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.workEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employeUniqueId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredEmployees(filtered);
    }
  };

  // Handle employee selection from search
  const handleEmployeeSelect = (employee) => {
    const newEmployee = {
      employeeId: employee._id,
      employeName: employee.employeName,
      employeUniqueId: employee.employeUniqueId,
      employeePhoto: employee.employeePhoto,
      workEmail: employee.workEmail,
      access: 'view'
    };

    setSelectedEmployees(prev => [...prev, newEmployee]);
    setEmployeeSearchTerm('');
    setShowEmployeeList(false);

    // Remove from filtered list
    setFilteredEmployees(prev => prev.filter(emp => emp._id !== employee._id));
  };

  // Handle access level change for selected employees
  const handleAccessChange = (employeeId, access) => {
    setSelectedEmployees(prev =>
      prev.map(emp =>
        emp.employeeId === employeeId ? { ...emp, access } : emp
      )
    );
  };

  // Handle access level change for shared employees
  const handleSharedAccessChange = (employeeUniqueId, access) => {
    setSharedEmployees(prev =>
      prev.map(emp =>
        emp.employeUniqueId === employeeUniqueId ? { ...emp, access, modified: true } : emp
      )
    );
  };

  // Remove selected employee
  const handleRemoveSelectedEmployee = (employeeId) => {
    setSelectedEmployees(prev => prev.filter(emp => emp.employeeId !== employeeId));
  };

  // Remove shared employee
  const handleRemoveSharedEmployee = (employeeUniqueId) => {
    setSharedEmployees(prev => prev.filter(emp => emp.employeUniqueId !== employeeUniqueId));
  };

  // Handle share note
  const handleShareNote = async () => {
    setIsSharingNote(true);
    try {
      // Combine all employees that should have access (existing shared + newly selected)
      // This represents the final state of who should have access to the note
      const allSharedEmployees = [
        // Include existing shared employees (some may have modified access levels)
        ...sharedEmployees.map(emp => ({
          employeeId: emp.employeeId || emp._id,
          access: emp.access
        })),
        // Include newly selected employees
        ...selectedEmployees.map(emp => ({
          employeeId: emp.employeeId,
          access: emp.access
        }))
      ];

      const response = await api.shareNotes(noteToShare._id, allSharedEmployees);
      if (response.status) {
        const totalCount = allSharedEmployees.length;

        let message = `Note sharing updated successfully!`;
        if (selectedEmployees.length > 0) {
          message += ` Added ${selectedEmployees.length} new employee(s).`;
        }
        if (sharedEmployees.some(emp => emp.modified)) {
          message += ` Updated access levels.`;
        }

        showSnackbar(message);
        handleCloseShareDialog();
      } else {
        showSnackbar(response.message || 'Failed to update note sharing', 'error');
      }
    } catch (error) {
      console.error('Error updating note sharing:', error);
      showSnackbar('Failed to update note sharing', 'error');
    } finally {
      setIsSharingNote(false);
    }
  };

  // Handle open share dialog
  const handleOpenShareDialog = (note) => {
    setNoteToShare(note);
    setShareDialogOpen(true);
    setShowEmployeeList(false);
    fetchEmployees();

    // Fetch shared employees and store original count
    const loadSharedEmployees = async () => {
      const sharedData = await fetchSharedEmployees(note._id);
      setNoteToShare(prev => ({ ...prev, originalSharedCount: sharedData.length }));
    };
    loadSharedEmployees();
  };

  // Handle close share dialog
  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
    setNoteToShare(null);
    setSelectedEmployees([]);
    setSharedEmployees([]);
    setEmployeeSearchTerm('');
    setFilteredEmployees([]);
    setEmployees([]);
    setShowEmployeeList(false);
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Filter notes based on search term and active tab
  const getFilteredNotes = () => {
    let filteredBySearch = notes.filter(
      note =>
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stripHTML(note.content || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )

    // Filter by reminder status based on active tab
    switch (activeTab) {
      case 0: // All reminders
        return filteredBySearch.filter(note => note.reminderAt)
      case 1: // Outdated reminders
        return filteredBySearch.filter(note => isReminderOutdated(note))
      case 2: // Upcoming reminders
        return filteredBySearch.filter(note => isReminderUpcoming(note))
      default:
        return filteredBySearch
    }
  }

  const filteredNotes = getFilteredNotes()

  // Get counts for tabs
  const allRemindersCount = notes.filter(note => note.reminderAt).length
  const outdatedRemindersCount = notes.filter(note => isReminderOutdated(note)).length
  const upcomingRemindersCount = notes.filter(note => isReminderUpcoming(note)).length

  // Debug logging
  console.log('Tab counts:', {
    all: allRemindersCount,
    outdated: outdatedRemindersCount,
    upcoming: upcomingRemindersCount,
    total: notes.length,
    activeTab
  })

  // Handle new note added
  const handleNoteAdded = async () => {
    await fetchNotes()
    showSnackbar('Note added successfully')
  }

  // Handle note edited
  const handleNoteEdited = async () => {
    await fetchNotes()
    setIsEditingNote(false)
    setSelectedNote(null)
    showSnackbar('Note updated successfully')
  }

  // Handle note deleted
  const handleNoteDeleted = async noteId => {
    // Update local state without refetching
    setNotes(notes.filter(note => note._id !== noteId))
    setIsEditingNote(false)
    setSelectedNote(null)
    showSnackbar('Note deleted successfully')
  }

  // Open delete confirmation dialog
  const openDeleteConfirmation = (noteId, event) => {
    if (event) {
      event.stopPropagation()
    }
    setNoteToDelete(noteId)
    setDeleteConfirmOpen(true)
  }

  // Handle deleting a note
  const handleDeleteNote = async () => {
    if (!noteToDelete) return

    setIsLoading(true)
    try {
      // Delete note through API
      const response = await api.deleteNote(noteToDelete)

      if (response.status) {
        // Update local state after successful deletion
        setNotes(notes.filter(note => note._id !== noteToDelete))
        showSnackbar('Note deleted successfully')
      } else {
        showSnackbar(response.message || 'Failed to delete note', 'error')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      showSnackbar('Failed to delete note', 'error')
    } finally {
      setIsLoading(false)
      setNoteToDelete(null)
      setDeleteConfirmOpen(false)
    }
  }

  // Start editing a note
  const startEditing = note => {
    setSelectedNote(note)
    setIsEditingNote(true)
  }

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    } catch (error) {
      return ''
    }
  }

  // Render note card images
  const renderNoteCardImages = content => {
    if (!content) return null

    const images = extractImages(content)
    if (images.length === 0) return null

    return (
      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {images.slice(0, 3).map((img, idx) => (
          <Box
            key={idx}
            component='img'
            src={img}
            alt={`Note image ${idx + 1}`}
            sx={{
              width: 48,
              height: 48,
              objectFit: 'cover',
              borderRadius: 1,
              cursor: 'pointer'
            }}
            onClick={e => {
              e.stopPropagation()
            }}
          />
        ))}
        {images.length > 3 && (
          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.1)',
              borderRadius: 1,
              cursor: 'pointer'
            }}
          >
            <Typography variant='caption'>+{images.length - 3}</Typography>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', width: '100%'}}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 200,
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',

        }}
      >
        {/* Search Bar */}



        {/* Reminder Tabs */}
        <Box sx={{ px: 2, mt: 2 ,display:'flex',alignItems:'center', width:'100%' }}>

          <Tabs style={{width:'100%', border:'none'}}
            value={activeTab}
            onChange={handleTabChange}
            orientation="vertical"
            sx={{
              '& .MuiTab-root': {
                alignItems: 'flex-start',
                textAlign: 'left',
                minHeight: 40,
                width:'100%',
                px: 1,
                py: 0.5,
                fontSize: '13px',
                textTransform: 'none',
                fontWeight: 500,
                color: '#666',
                '&.Mui-selected': {
                  color: '#1976d2',
                  backgroundColor: 'transparent',
                  borderRadius: 1
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >

            <Tab
             style={{display:'flex',alignItems:'center'}}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{display:'flex',alignItems:'center',marginRight:'17px'}}> <ScheduleIcon fontSize="small" /> All Reminders</span>
                  <Badge
                    badgeContent={allRemindersCount}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '10px',
                        height: '16px',
                        minWidth: '16px'
                      }
                    }}
                  />
                </Box>
              }
            />
            <Tab
             style={{display:'flex',alignItems:'center'}}

              icon={<HistoryIcon fontSize="small" />}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{marginRight:'17px'}}>Outdated</span>
                  <Badge
                    badgeContent={outdatedRemindersCount}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '10px',
                        height: '16px',
                        minWidth: '16px'
                      }
                    }}
                  />
                </Box>
              }
            />
            <Tab
                         style={{display:'flex',alignItems:'center'}}

              icon={<ScheduleSendIcon fontSize="small" />}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{marginRight:'17px'}}>Upcoming</span>
                  <Badge
                    badgeContent={upcomingRemindersCount}
                    color="success"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '10px',
                        height: '16px',
                        minWidth: '16px',

                      }
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Notes List */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 2 }} style={{height: pageHeight - 200}}>
          {isLoading && notes.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredNotes.length > 0 ? (
            <List sx={{ p: 0 }}>
              {filteredNotes.map((note, index) => (
                <ListItem
                  key={note._id}
                  onClick={() => startEditing(note)}
                  sx={{
                    cursor: 'pointer',
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#f8f9fa'
                    },
                    borderBottom: index < filteredNotes.length - 1 ? '1px solid #f5f5f5' : 'none'
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: note.bgColor || '#FFD580',
                      mr: 2,
                      flexShrink: 0
                    }}
                  />
                  <ListItemText
                    primary={
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 500,
                          color: '#333',
                          fontSize: '14px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {note.title || 'Untitled'}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant='caption'
                        sx={{
                          color: isReminderOutdated(note) ? '#d32f2f' : '#1976d2',
                          fontSize: '11px',
                          fontWeight: 500
                        }}
                      >
                        {formatReminderDateTime(note)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                {activeTab === 0 && 'No notes with reminders found'}
                {activeTab === 1 && 'No outdated reminders'}
                {activeTab === 2 && 'No upcoming reminders'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            top: '-81px',
            position: 'relative',
            width: 'fit-content',
            marginLeft: 'auto'
          }}>
          <TextField
          style={{ border: '1px solid black', borderRadius: '10px', width: '290px' }}
            placeholder='Search'
            variant='outlined'
            size='small'
            fullWidth
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f5f5f5',
                '& fieldset': {
                  border: 'none'
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' sx={{ color: '#666' }} />
                </InputAdornment>
              )
            }}
          />
        </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant='h4' fontWeight='bold'>
                {activeTab === 0 && 'All Reminder Notes'}
                {activeTab === 1 && 'Outdated Reminders'}
                {activeTab === 2 && 'Upcoming Reminders'}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                {filteredNotes.length} notes found
              </Typography>
            </Box>
          </Box>

          {/* Notes grid */}
          {isLoading && notes.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredNotes.length > 0 ? (
            <Grid container spacing={3}>
              {filteredNotes.map(note => (
                <Grid item xs={12} sm={6} md={4} key={note._id}>
                  <Card
                    sx={{
                      bgcolor: note.bgColor || '#FFD580',
                      borderRadius: 2,
                      height: 150,
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      border: isReminderOutdated(note) ? '2px solid #d32f2f' : 'none',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => startEditing(note)}
                  >
                    <CardContent sx={{ flexGrow: 1, padding: '10px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant='h6' fontWeight='medium' sx={{ flexGrow: 1 }}>
                          {note.title}
                        </Typography>
                        <Chip
                          label={isReminderOutdated(note) ? 'Outdated' : 'Upcoming'}
                          size="small"
                          color={isReminderOutdated(note) ? 'error' : 'success'}
                          sx={{ fontSize: '10px', height: '20px' }}
                        />
                      </Box>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1
                        }}
                      >
                        {stripHTML(note.content || '')}
                      </Typography>

                      {/* Reminder Date/Time Display */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <ScheduleIcon
                          fontSize="small"
                          sx={{
                            color: isReminderOutdated(note) ? '#d32f2f' : '#1976d2',
                            fontSize: '14px'
                          }}
                        />
                        <Typography
                          variant='caption'
                          sx={{
                            color: isReminderOutdated(note) ? '#d32f2f' : '#1976d2',
                            fontWeight: 500,
                            fontSize: '11px'
                          }}
                        >
                          {formatReminderDateTime(note)}
                        </Typography>
                      </Box>

                      {/* Render images from note content */}
                      {renderNoteCardImages(note.content)}
                    </CardContent>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        pb: 2
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <Typography variant='caption' color='text.secondary'>
                        {formatDate(note.createdAt)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* Share button */}
                        <IconButton
                          size='small'
                          sx={{
                            bgcolor: 'rgba(0, 0, 0, 0.05)',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.1)'
                            }
                          }}
                          onClick={e => {
                            e.stopPropagation()
                            handleOpenShareDialog(note)
                          }}
                          title="Share note"
                        >
                          <ShareIcon fontSize='small' />
                        </IconButton>
                        {/* Delete button */}
                        <IconButton
                          size='small'
                          sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}
                          onClick={e => openDeleteConfirmation(note._id, e)}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                        {/* Edit button */}
                        <IconButton
                          size='small'
                          sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}
                          onClick={e => {
                            e.stopPropagation()
                            startEditing(note)
                          }}
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant='body1' color='text.secondary'>
                {activeTab === 0 && 'No notes with reminders found. Create a note with a reminder to see it here.'}
                {activeTab === 1 && 'No outdated reminders found.'}
                {activeTab === 2 && 'No upcoming reminders found.'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Enhanced AddNoteButton component */}
      <AddNoteButton
        onNoteAdded={handleNoteAdded}
        onNoteEdited={handleNoteEdited}
        onNoteDeleted={handleNoteDeleted}
        buttonPosition={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1000
          }}
          buttonStyle={{
            borderRadius: '50%',
            width: 64,
            height: 64,
            minWidth: 'auto',
            boxShadow: 3
          }}
        type='notes'
        note={selectedNote}
        isEditing={isEditingNote}
        onCloseEdit={() => {
          setIsEditingNote(false)
          setSelectedNote(null)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>
            Do you really want to delete this note? You won't be able to get it back.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteNote} color='error' variant='contained'>
            {isLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Google Sheets-like Share Note Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Share "{noteToShare?.title || 'Untitled Note'}"
          </Typography>
          <IconButton onClick={handleCloseShareDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Add People Section */}
          <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add people, groups, and calendar events"
              value={employeeSearchTerm}
              onChange={(e) => {
                setEmployeeSearchTerm(e.target.value);
                handleEmployeeSearch(e.target.value);
                setShowEmployeeList(e.target.value.length > 0);
              }}
              onFocus={() => {
                if (employeeSearchTerm.length > 0) {
                  setShowEmployeeList(true);
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: '#f8f9fa',
                  '& fieldset': {
                    border: '1px solid #e0e0e0'
                  },
                  '&:hover fieldset': {
                    border: '1px solid #1976d2'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonAddIcon fontSize="small" sx={{ color: '#666' }} />
                  </InputAdornment>
                )
              }}
            />

            {/* Employee Search Results */}
            {showEmployeeList && (
              <Box sx={{
                mt: 1,
                maxHeight: 200,
                overflowY: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                bgcolor: 'white',
                boxShadow: 1
              }}>
                {isLoadingEmployees ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <Box
                      key={employee._id}
                      onClick={() => handleEmployeeSelect(employee)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f5f5f5' },
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <Avatar
                        src={employee.employeePhoto}
                        sx={{ width: 32, height: 32, mr: 2 }}
                      >
                        {employee.employeName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {employee.employeName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.workEmail || employee.employeUniqueId}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No employees found
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* People with access */}
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#5f6368' }}>
              People with access
            </Typography>

            {/* Already Shared Employees */}
            {isLoadingSharedEmployees ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                {sharedEmployees.map((employee) => (
                  <Box
                    key={employee.employeUniqueId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: '1px solid #f0f0f0',
                      bgcolor: employee.modified ? '#fff3cd' : 'transparent', // Highlight if modified
                      borderRadius: employee.modified ? 1 : 0,
                      px: employee.modified ? 1 : 0,
                      mx: employee.modified ? -1 : 0
                    }}
                  >
                    <Avatar
                      src={employee.employeePhoto}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    >
                      {employee.employeName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {employee.employeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {employee.workEmail || employee.employeUniqueId}
                      </Typography>
                      {employee.modified && (
                        <Chip
                          label="Modified"
                          size="small"
                          color="warning"
                          variant="outlined"
                          sx={{ ml: 1, height: 20, fontSize: '10px' }}
                        />
                      )}
                    </Box>
                    <TextField
                      select
                      size="small"
                      value={employee.access}
                      onChange={(e) => handleSharedAccessChange(employee.employeUniqueId, e.target.value)}
                      sx={{
                        minWidth: 100,
                        mr: 1,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: employee.modified ? '#fff' : 'transparent'
                        }
                      }}
                    >
                      <MenuItem value="view">Viewer</MenuItem>
                      <MenuItem value="edit">Editor</MenuItem>
                    </TextField>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveSharedEmployee(employee.employeUniqueId)}
                      sx={{
                        color: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#ffebee'
                        }
                      }}
                      title="Remove access"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {/* Selected Employees (to be added) */}
                {selectedEmployees.map((employee) => (
                  <Box
                    key={employee.employeeId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: '1px solid #f0f0f0',
                      bgcolor: '#f8f9fa'
                    }}
                  >
                    <Avatar
                      src={employee.employeePhoto}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    >
                      {employee.employeName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {employee.employeName}
                        <span style={{fontSize: '8px',
    background: '#00800029',
    color: 'green',
    borderRadius: '10px',
    display: 'flex',
    width: 'fit-content',
    padding: '2px 6px',
    alignItems: 'center'}}>
                    <CiCircleCheck   /> Selected

                        </span>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {employee.workEmail || employee.employeUniqueId}
                      </Typography>
                    </Box>

                    <TextField
                      select
                      size="small"
                      value={employee.access}
                      onChange={(e) => handleAccessChange(employee.employeeId, e.target.value)}
                      sx={{ minWidth: 100, mr: 1 }}
                    >
                      <MenuItem value="view">Viewer</MenuItem>
                      <MenuItem value="edit">Editor</MenuItem>
                    </TextField>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveSelectedEmployee(employee.employeeId)}
                      sx={{ color: '#666' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {sharedEmployees.length === 0 && selectedEmployees.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      No one has access to this note yet.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Use the search box above to add people and share this note.
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{
          p: 3,
          borderTop: '1px solid #e0e0e0',
          justifyContent: 'space-between'
        }}>
          <Button onClick={handleCloseShareDialog}>
            Cancel
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Summary of changes */}
            {(selectedEmployees.length > 0 || sharedEmployees.some(emp => emp.modified) ||
              (sharedEmployees.length !== (noteToShare?.originalSharedCount || 0))) && (
              <Typography variant="caption" color="text.secondary">
                {selectedEmployees.length > 0 && `+${selectedEmployees.length} new`}
                {selectedEmployees.length > 0 && sharedEmployees.some(emp => emp.modified) && ', '}
                {sharedEmployees.some(emp => emp.modified) && 'access updated'}
              </Typography>
            )}
            <Button
              onClick={handleShareNote}
              variant="contained"
              disabled={
                isSharingNote ||
                (selectedEmployees.length === 0 &&
                 !sharedEmployees.some(emp => emp.modified) &&
                 sharedEmployees.length === (noteToShare?.originalSharedCount || 0))
              }
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {isSharingNote ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ReminderNotesList
