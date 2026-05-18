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
  Slide,
  Zoom
} from '@mui/material'
import {
  Edit as EditIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import AddNoteButton from '../addNoteButton'
import { IoIosAddCircleOutline } from "react-icons/io";

// Base URL for API
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// API functions for notes and boards
const api = {
  getSharedData: async (type) => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/getSharedDataByType?type=${type}`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      })
      if (!response.ok) throw new Error('Failed to fetch data')
      const data = await response.json()
      return data?.status ? data.items : { sharedNotes: [], sharedBoards: [] }
    } catch (error) {
      console.error('Error fetching data:', error)
      return { sharedNotes: [], sharedBoards: [] }
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

  addSubboard: async (title, boardId) => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/subBoardAdd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify({ title, boardId })
      })
      if (!response.ok) throw new Error('Failed to add subboard')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error adding subboard:', error)
      throw error
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

const CombinedNotesAndBoard = ({ type = 'all' }) => {
  const [notes, setNotes] = useState([])
  const [boards, setBoards] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // Board management states
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [isFullWidthView, setIsFullWidthView] = useState(false)
  const [subboards, setSubboards] = useState([])
  const [subboardNotes, setSubboardNotes] = useState({})
  const [editingSubboardId, setEditingSubboardId] = useState(null)
  const [animateBoard, setAnimateBoard] = useState(false)

  // Subboard creation
  const [addSubboardOpen, setAddSubboardOpen] = useState(false)
  const [newSubboardTitle, setNewSubboardTitle] = useState('')
  const [isAddingSubboard, setIsAddingSubboard] = useState(false)

  // Delete confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState(null)

  // Load data from API
  useEffect(() => {
    fetchData()
  }, [type])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addSubboardOpen && !event.target.closest('.subboard-popup')) {
        setAddSubboardOpen(false)
        setNewSubboardTitle('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [addSubboardOpen])

  // Fetch data function
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await api.getSharedData(type)

      // Set notes and boards based on type
      if (type === 'notes') {
        setNotes(data.sharedNotes || [])
        setBoards([])
      } else if (type === 'board') {
        setNotes([])
        setBoards(data.sharedBoards || [])
      } else { // type === 'all'
        setNotes(data.sharedNotes || [])
        setBoards(data.sharedBoards || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setNotes([])
      setBoards([])
      showSnackbar('Failed to load data', 'error')
    } finally {
      setIsLoading(false)
    }
  }

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

  // Filter boards based on search term
  const filteredBoards = boards.filter(board =>
    board.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle new note added
  const handleNoteAdded = async () => {
    await fetchData()
    showSnackbar('Note added successfully')
  }

  // Handle note edited
  const handleNoteEdited = async () => {
    await fetchData()
    setIsEditingNote(false)
    setSelectedNote(null)
    showSnackbar('Note updated successfully')
  }

  // Handle note deleted
  const handleNoteDeleted = async noteId => {
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
      const response = await api.deleteNote(noteToDelete)

      if (response.status) {
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

  // Handle board click with animation
  const handleBoardClick = (board) => {
    setAnimateBoard(true)
    setTimeout(() => {
      setSelectedBoard(board)
      setSubboards(board.subBoards || [])

      // Initialize notes for each subboard
      const notesData = {}
      if (board.subBoards) {
        board.subBoards.forEach(subboard => {
          notesData[subboard._id] = subboard.notes || []
        })
      }
      setSubboardNotes(notesData)

      setIsFullWidthView(true)
    }, 150)
  }

  // Handle back from full width view
  const handleBackFromFullWidth = () => {
    setIsFullWidthView(false)
    setAnimateBoard(false)
    setAddSubboardOpen(false)
    setTimeout(() => {
      setSelectedBoard(null)
      setSubboards([])
      setSubboardNotes({})
      setNewSubboardTitle('')
    }, 300)
  }

  // Handle add subboard
  const handleAddSubboard = async () => {
    if (!newSubboardTitle.trim()) {
      showSnackbar('Please enter a subboard title', 'error')
      return
    }

    if (!selectedBoard || !selectedBoard._id) {
      showSnackbar('No board selected', 'error')
      return
    }

    setIsAddingSubboard(true)
    try {
      const response = await api.addSubboard(newSubboardTitle.trim(), selectedBoard._id)
      if (response.status) {
        // Refresh board data
        await fetchData()
        // Re-select the board to update subboards
        const updatedBoards = await api.getSharedData(type)
        const updatedBoard = updatedBoards.sharedBoards?.find(b => b._id === selectedBoard._id)
        if (updatedBoard) {
          setSelectedBoard(updatedBoard)
          setSubboards(updatedBoard.subBoards || [])

          const notesData = {}
          if (updatedBoard.subBoards) {
            updatedBoard.subBoards.forEach(subboard => {
              notesData[subboard._id] = subboard.notes || []
            })
          }
          setSubboardNotes(notesData)
        }

        setNewSubboardTitle('')
        setAddSubboardOpen(false)
        showSnackbar('Subboard created successfully')
      } else {
        showSnackbar(response.message || 'Failed to create subboard', 'error')
      }
    } catch (error) {
      console.error('Error creating subboard:', error)
      showSnackbar('Failed to create subboard', 'error')
    } finally {
      setIsAddingSubboard(false)
    }
  }

  // Handle note management for specific subboard
  const handleSubboardNoteAdded = (newNote, subboardId) => {
    const noteWithSubboard = {
      ...newNote,
      id: `${subboardId}_${Date.now()}`,
      subboardId
    }

    setSubboardNotes(prev => ({
      ...prev,
      [subboardId]: [noteWithSubboard, ...(prev[subboardId] || [])]
    }))

    showSnackbar('Note added successfully')
  }

  const handleSubboardNoteEdited = (editedNote) => {
    const subboardId = editedNote.subboardId
    setSubboardNotes(prev => ({
      ...prev,
      [subboardId]: prev[subboardId]?.map(note =>
        note.id === editedNote.id ? editedNote : note
      ) || []
    }))
    setIsEditingNote(false)
    setSelectedNote(null)
    setEditingSubboardId(null)
    showSnackbar('Note updated successfully')
  }

  const handleSubboardNoteDeleted = (noteId) => {
    let targetSubboardId = null
    Object.keys(subboardNotes).forEach(subboardId => {
      if (subboardNotes[subboardId]?.find(note => note.id === noteId)) {
        targetSubboardId = subboardId
      }
    })

    if (targetSubboardId) {
      setSubboardNotes(prev => ({
        ...prev,
        [targetSubboardId]: prev[targetSubboardId].filter(note => note.id !== noteId)
      }))
    }

    setIsEditingNote(false)
    setSelectedNote(null)
    setEditingSubboardId(null)
    showSnackbar('Note deleted successfully')
  }

  // Handle note click for editing in subboards
  const handleSubboardNoteClick = (note, subboardId) => {
    setSelectedNote({ ...note, subboardId })
    setIsEditingNote(true)
    setEditingSubboardId(subboardId)
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

  // Generate random colors for boards
  const boardColors = [
    '#FFE4B5', '#B0C4DE', '#87CEEB', '#F0E68C',
    '#DDA0DD', '#98FB98', '#F5DEB3', '#D3D3D3'
  ]

  const getBoardColor = (index) => {
    return boardColors[index % boardColors.length]
  }

  // Full width board view
  if (isFullWidthView && selectedBoard) {
    return (
      <Slide direction="up" in={isFullWidthView} mountOnEnter unmountOnExit>
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: '#1e3a8a',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Header */}
          <Box sx={{
            height: 60,
            bgcolor: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            zIndex: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handleBackFromFullWidth}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant='h6' sx={{ color: 'white', fontWeight: 'bold' }}>
                {selectedBoard.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  onClick={() => setAddSubboardOpen(!addSubboardOpen)}
                  sx={{ color: 'white' }}
                >
                  <IoIosAddCircleOutline />
                </IconButton>

                {/* Custom Inline Popup */}
                {addSubboardOpen && (
                  <Zoom in={addSubboardOpen}>
                    <Box
                      className="subboard-popup"
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        mt: 1,
                        width: 350,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 4,
                        p: 3,
                        zIndex: 10
                      }}
                    >
                      <Typography variant='h6' sx={{ mb: 1, color: '#333' }}>
                        Create New Subboard
                      </Typography>
                      <Typography variant='body2' color='textSecondary' sx={{ mb: 2 }}>
                        Create a new subboard in "{selectedBoard?.title}"
                      </Typography>
                      <TextField
                        autoFocus
                        fullWidth
                        size='small'
                        label='Subboard Title'
                        variant='outlined'
                        value={newSubboardTitle}
                        onChange={e => setNewSubboardTitle(e.target.value)}
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            handleAddSubboard()
                          }
                        }}
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          size='small'
                          onClick={() => {
                            setAddSubboardOpen(false)
                            setNewSubboardTitle('')
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size='small'
                          variant='contained'
                          onClick={handleAddSubboard}
                          disabled={isAddingSubboard || !newSubboardTitle.trim()}
                        >
                          {isAddingSubboard ? <CircularProgress size={16} /> : 'Create'}
                        </Button>
                      </Box>
                    </Box>
                  </Zoom>
                )}
              </Box>
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box sx={{
            flexGrow: 1,
            p: 3,
            overflowY: 'auto'
          }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
                <CircularProgress sx={{ color: 'white' }} />
              </Box>
            ) : (
              <>
                {/* Subboards Grid */}
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    {subboards.map((subboard, index) => (
                      <Grid item xs={12} sm={6} md={2} key={subboard._id}>
                        <Card
                          sx={{
                            bgcolor: getBoardColor(index),
                            minHeight: 400,
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                            {/* Subboard Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant='h6' fontWeight='bold' sx={{ mb: 2, color: '#333' }}>
                                {subboard.title}
                              </Typography>

                              <IconButton
                                onClick={() => handleCreateNewNote(subboard._id)}
                                sx={{
                                  '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.2)'
                                  }
                                }}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>

                            {/* Notes in this subboard */}
                            <Box sx={{ flexGrow: 1, mb: 2 }}>
                              {subboardNotes[subboard._id]?.length > 0 ? (
                                subboardNotes[subboard._id].map(note => (
                                  <Card
                                    key={note._id}
                                    sx={{
                                      mb: 1,
                                      bgcolor: note.bgColor || '#6366F1',
                                      cursor: 'pointer',
                                      '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: 2
                                      }
                                    }}
                                    onClick={() => handleNoteClick(note, subboard._id)}
                                  >
                                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                      <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                        {note.title || 'Untitled Note'}
                                      </Typography>
                                      <Typography
                                        variant='caption'
                                        sx={{
                                          display: 'block',
                                          mt: 0.5,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        {stripHTML(note.content) || 'No content'}
                                      </Typography>
                                      <Typography variant='caption'>
                                        {formatDate(note.createdAt)}
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                ))
                              ) : (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 200,
                                    textAlign: 'center'
                                  }}
                                >
                                  <Typography variant='body2' sx={{ color: '#666', fontStyle: 'italic' }}>
                                    No notes yet. Click + to add your first note.
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Empty state */}
                  {subboards.length === 0 && (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '300px',
                      textAlign: 'center'
                    }}>
                      <Typography variant='h6' sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        No subboards found
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                        Create your first subboard by clicking the + icon above
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>

          {/* AddNoteButton for editing notes in subboards */}
          {isEditingNote && editingSubboardId && (
            <AddNoteButton
              onNoteAdded={(note) => handleSubboardNoteAdded(note, editingSubboardId)}
              onNoteEdited={handleSubboardNoteEdited}
              onNoteDeleted={handleSubboardNoteDeleted}
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
              note={selectedNote}
              isEditing={true}
              type="board"
              subBoardId={editingSubboardId}
              onCloseEdit={() => {
                setIsEditingNote(false)
                setSelectedNote(null)
                setEditingSubboardId(null)
              }}
            />
          )}
        </Box>
      </Slide>
    )
  }

  // Main view
  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', }}>
      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 4, }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {/* Header with search */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant='h4' fontWeight='bold'>
              {type === 'notes' ? 'Shared Notes' : type === 'board' ? 'Shared Boards' : 'Shared Content'}
            </Typography>
            {/* <TextField
              placeholder='Search...'
              variant='outlined'
              size='small'
              sx={{ maxWidth: 300 }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' />
                  </InputAdornment>
                )
              }}
            /> */}
          </Box>

          {/* Loading state */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Boards Grid */}
              {(type === 'board' || type === 'all') && filteredBoards.length > 0 && (
                <>
                  {type === 'all' && (
                    <Typography variant='h5' fontWeight='bold' sx={{ mb: 3 }}>
                      Boards
                    </Typography>
                  )}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {filteredBoards.map((board, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={board._id}>
                        <Zoom in={!animateBoard} timeout={200}>
                    <Card
                      sx={{
                        bgcolor: getBoardColor(index),
                        position: 'relative',
                        height: 200,
                        display: 'flex',
                        overflow: 'visible',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: 6
                        }
                      }}
                      // onMouseEnter={() => setHoveredCard(board._id)}
                      // onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => handleBoardClick(board)}
                    >
                      {/* {hoveredCard === board._id && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setAnchorEl(e.currentTarget);
                            setMenuBoardId(board._id);
                          }}
                          style={{
                            position: 'absolute',
                            zIndex: '9',
                            fontSize: '10px',
                            background: '#f9e0b1',
                            top: '-12px',
                            right: '-6px',
                            filter: 'drop-shadow(0px 2px 6px black)'
                          }}
                        >
                          <SlOptionsVertical />
                        </IconButton>
                      )} */}

                      {/* <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && menuBoardId === board._id}
                        onClose={() => {
                          setAnchorEl(null);
                          setMenuBoardId(null);
                        }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem onClick={(e) => handleMenuAction('open', board._id, e)}>Open</MenuItem>
                        <MenuItem onClick={(e) => handleMenuAction('delete', board._id, e)}>Delete</MenuItem>
                        <MenuItem onClick={(e) => handleMenuAction('share', board._id, e)}>Share</MenuItem>
                      </Menu> */}

                      <CardContent sx={{ flexGrow: 1, p: 2 }} style={{ paddingBottom: 0 }}>
                        <Grid container spacing={5} style={{ height: '100%' }}>
                          {board.subBoards?.map((subBoard, index) => (
                            <Grid item sm={4} key={subBoard._id}>
                              <Card
                                sx={{ bgcolor: getBoardColor(index) }}
                                style={{ height: '100%', filter: 'contrast(0.7)' }}
                              >
                                <Box style={{ display: 'flex', flexDirection: 'column', padding: '5px' }}>
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      fontSize: '10px',
                                      textAlign: 'center',
                                      color: 'black',
                                      textTransform: 'capitalize',
                                      fontWeight: '500',
                                      marginTop: '-2px',
                                      marginBottom: '4px'
                                    }}
                                  >
                                    {subBoard.title}
                                  </Typography>
                                  {subBoard.notes?.map(note => (
                                    <Card
                                      key={note._id}
                                      style={{
                                        height: '28px',
                                        width: '100%',
                                        marginTop: '3px',
                                        background: note.bgColor || '#FF9C00',
                                        padding: '7px'
                                      }}
                                    >
                                      <Typography
                                        style={{ height: '3px', width: '85%', background: 'rgb(0 0 0 / 30%)' }}
                                      />
                                      <Typography
                                        style={{
                                          height: '3px',
                                          width: '50%',
                                          marginTop: '5px',
                                          background: 'rgb(0 0 0 / 30%)'
                                        }}
                                      />
                                    </Card>
                                  ))}
                                </Box>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>

                      <Typography
                        variant='h6'
                        fontWeight='medium'
                        color='text.primary'
                        style={{
                          textAlign: 'center',
                          marginBottom: '-36px',
                          fontSize: '17px',
                          textTransform: 'capitalize',
                          fontWeight: '600',
                          lineHeight:'11px'
                        }}
                      >
                        {board.title}
                        <br/>
                        <span style={{fontSize:'10px'}}>By-
                        {board.sharedBy?.employeName}

                        </span>
                      </Typography>
                    </Card>
                  </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              {/* Notes Grid */}

              {(type === 'notes' || type === 'all') && filteredNotes.length > 0 && (
                <>
                  {type === 'all' && (
                    <Typography variant='h5' fontWeight='bold' sx={{ mb: 3 }}>
                      Notes
                    </Typography>
                  )}
                  <Grid container spacing={3}>

                    {filteredNotes.map(note => (
                      <Grid item xs={12} sm={6} md={4} key={note._id}>
                        <Card
                          sx={{
                            bgcolor: note.bgColor || '#FFD580',
                            borderRadius: 2,
                            height: 180,
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 3
                            }
                          }}
                          onClick={() => startEditing(note)}
                        >
                          <CardContent sx={{ flexGrow: 1, padding: '12px' }}>
                            <Typography variant='h6' fontWeight='medium' style={{textAlign:'left'}} mb={1}>
                              {note.title}
                            </Typography>
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textAlign:'left'
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
                              pb: 1
                            }}
                            onClick={e => e.stopPropagation()}
                          >
                            <Typography variant='caption' color='text.secondary'>
                              By {note.sharedBy?.employeName || 'Unknown'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
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
                </>
              )}

              {/* Empty state */}
              {filteredNotes.length === 0 && filteredBoards.length === 0 && !isLoading && (
                <Box sx={{ textAlign: 'center', my: 8 }}>
                  {/* <Typography variant='h6' color='text.secondary' gutterBottom>
                    No shared content found
                  </Typography> */}
                  <Typography variant='body2' color='text.secondary'>
                    {'No shared content available.'}
                  </Typography>
                </Box>
              )}
            </>
          )}


        </Box>
      </Box>

      {/* AddNoteButton for regular notes */}
      {(type === 'notes' || type === 'all') && (
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
      )}

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

export default CombinedNotesAndBoard
