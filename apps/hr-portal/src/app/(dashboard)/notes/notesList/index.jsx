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
  ListItemAvatar
} from '@mui/material'
import {
  Edit as EditIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Share as ShareIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import AddNoteButton from '../addNoteButton'
import { FaCheck } from "react-icons/fa6";
import { CiCircleCheck } from "react-icons/ci";

// Base URL for API
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// API functions for notes
const api = {
  getNotes: async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/getAllNotesByTokenId`, {
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

const NotesList = ({}) => {
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditingNote, setIsEditingNote] = useState(false)
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

  // Filter notes based on search term
  const filteredNotes = notes.filter(
    note =>
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHTML(note.content || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  )

  // Handle new note added
  const handleNoteAdded = async () => {
    await fetchNotes()
    showSnackbar('Note added successfully')
  }
  const handleNoteClosed =  async () => {
    await fetchNotes()
    // showSnackbar('Note added successfully')
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


  function hexToRGBA(hex, alpha = 0.8) {
  let r = 255, g = 213, b = 128; // default fallback
  if (hex && /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    const colorInt = parseInt(c.join(''), 16);
    r = (colorInt >> 16) & 255;
    g = (colorInt >> 8) & 255;
    b = colorInt & 255;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


  return (
    <Box sx={{ display: 'flex', width: '100%'}}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 200,

          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Search Bar */}


        {/* All Notes Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            mt: 5,
            py: 1.5,
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontWeight: 600,
              fontSize: '16px',
              color: '#333'
            }}
          >
            All Notes
          </Typography>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size='small' sx={{ color: '#666' }}>
              <StarBorderIcon fontSize='small' />
            </IconButton>
            <IconButton size='small' sx={{ color: '#666' }}>
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Box> */}
        </Box>

        {/* Notes List */}

        <Box sx={{ flexGrow: 1, overflow: 'auto',  }} style={{ height: pageHeight - 340 }}>

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
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                No notes found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 4,top: '-40px',
    position: 'relative',paddingTop:'15px'}}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>

<Box sx={{ display: 'flex',
    justifyContent: 'flex-end',
    top: '-40px',
    position: 'relative',width:'fit-content', marginLeft:'auto'}}>
          <TextField style={{border:'1px solid black', borderRadius:'10px', width:'290px'}}
            placeholder='Search Notes...'
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
          {/* Notes grid */}
          <Box style={{height: pageHeight - 230,overflow:'scroll'}}>
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
                      height: 230,
                      display: 'flex',
                      position:'relative',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      border:`1px solid ${note.bgColor}`,
                      // boxShadow:`1px 1px 1px ${note.bgColor}`,
                      marginTop:'2px',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => startEditing(note)}
                  >
                    <CardContent sx={{ flexGrow: 1, padding: '25px' }}>
                      <Typography variant='h6' style={{color:'rgb(17 24 39)', fontWeight:'600',fontWeight: '600',
    fontSize: '16px',
    textTransform: 'capitalize'}} fontWeight='medium' mb={1}>
                        {note.title}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {stripHTML(note.content || '')}
                      </Typography>

                      {/* Render images from note content */}
                      {renderNoteCardImages(note.content)}
                    </CardContent>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        padding:'25px',
                        bgcolor: note.bgColor || '#FFD580',
                            position: 'absolute',
    bottom: '0',
    width: '100%',

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
                No notes found. Create your first note by clicking the add button.
              </Typography>
            </Box>
          )}
          </Box>
        </Box>
      </Box>

      {/* Enhanced AddNoteButton component */}
      <AddNoteButton
        onNoteAdded={handleNoteAdded}
        noteClosed={handleNoteClosed}
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
            Do you really want to delete this note? You won’t be able to get it back.
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

export default NotesList
