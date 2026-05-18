import React, { useState, useEffect } from 'react'
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
  MenuItem,
  Menu,
  Fab,
  Slide,
  Zoom,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  ListItemAvatar
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import AddNoteButton from '../addNoteButton'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { SlOptionsVertical } from 'react-icons/sl'
import { CiCircleCheck } from 'react-icons/ci'

// Base URL for API
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// API functions for boards, subboards, and notes
const boardsApi = {
  getBoards: async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/getAllBoardsByTokenId`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      })
      if (!response.ok) throw new Error('Failed to fetch boards')
      const data = await response.json()
      return data?.status ? data.items : []
    } catch (error) {
      console.error('Error fetching boards:', error)
      return []
    }
  },
  deleteBoard: async boardId => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/boardDelete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify({ boardId })
      })
      if (!response.ok) throw new Error('Failed to delete board')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting board:', error)
      throw error
    }
  },

  addBoard: async title => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/boardAdd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify({ title })
      })
      if (!response.ok) throw new Error('Failed to add board')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error adding board:', error)
      throw error
    }
  },

  // New API function for updating board title
  updateBoardTitle: async (boardId, title) => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/update/boardTitle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify({ boardId, title })
      })
      if (!response.ok) throw new Error('Failed to update board title')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating board title:', error)
      throw error
    }
  },

  // New API function for updating subboard title
  updateSubBoardTitle: async (subBoardId, title) => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/update/subBoardTitle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify({ subBoardId, title })
      })
      if (!response.ok) throw new Error('Failed to update subboard title')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating subboard title:', error)
      throw error
    }
  },

  getSubboards: async boardId => {
    try {
      console.log('Fetching subboards for boardId:', boardId)
      const response = await fetch(`${baseUrl}/v1/api/notes/getAllSubBoard?boardId=${boardId}`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      })
      if (!response.ok) throw new Error('Failed to fetch subboards')
      const data = await response.json()
      console.log('Subboards API response:', data)
      return data?.status ? data.items : []
    } catch (error) {
      console.error('Error fetching subboards:', error)
      return []
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
  },

  getSubboardNotes: async subboardId => {
    try {
      console.log('Fetching notes for subboardId:', subboardId)
      const response = await fetch(
        `${baseUrl}/v1/api/notes/getAllBoardNotesBysubBoardId?subBoardId=${subboardId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': localStorage.getItem('authToken')
          }
        }
      )
      if (!response.ok) throw new Error('Failed to fetch subboard notes')
      const data = await response.json()
      console.log('Subboard notes API response:', data)
      return data?.status ? data.items : []
    } catch (error) {
      console.error('Error fetching subboard notes:', error)
      return []
    }
  },

  shareBoard: async (boardId, sharedWith) => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/shareBoard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify({
          boardId,
          sharedWith
        })
      })
      if (!response.ok) throw new Error('Failed to share board')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error sharing board:', error)
      throw error
    }
  },

  getAllEmployees: async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/employe/getAllEmploye`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      })
      if (!response.ok) throw new Error('Failed to fetch employees')
      const data = await response.json()
      return data?.status ? data.items : []
    } catch (error) {
      console.error('Error fetching employees:', error)
      return []
    }
  },

  getBoardSharedEmployees: async boardId => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/getBoardSharedEmployees?boardId=${boardId}`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      })
      if (!response.ok) throw new Error('Failed to fetch shared employees')
      const data = await response.json()
      return data?.status ? data.items : []
    } catch (error) {
      console.error('Error fetching shared employees:', error)
      return []
    }
  }
}

const NotesBoards = () => {
  const [boards, setBoards] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [isFullWidthView, setIsFullWidthView] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // Add board dialog
  const [addBoardOpen, setAddBoardOpen] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [isAddingBoard, setIsAddingBoard] = useState(false)

  // Subboard management
  const [subboards, setSubboards] = useState([])
  const [newSubboardTitle, setNewSubboardTitle] = useState('')
  const [isAddingSubboard, setIsAddingSubboard] = useState(false)
  const [addSubboardOpen, setAddSubboardOpen] = useState(false)

  // Notes management within subboards - organized by subboard ID
  const [subboardNotes, setSubboardNotes] = useState({}) // {subboardId: [notes]}
  const [selectedNote, setSelectedNote] = useState(null)
  const [showNoteDialog, setShowNoteDialog] = useState(false) // Show/hide note dialog
  const [editingSubboardId, setEditingSubboardId] = useState(null)

  // Animation state
  const [animateBoard, setAnimateBoard] = useState(false)

  // Menu state
  const [hoveredCard, setHoveredCard] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [menuBoardId, setMenuBoardId] = useState(null)
  const [pageHeight, setPageHeight] = useState(0)

  // Share functionality state
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState([]) // Array of {employeeId, access}
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)
  const [isSharingBoard, setIsSharingBoard] = useState(false)
  const [boardToShare, setBoardToShare] = useState(null)
  const [sharedEmployees, setSharedEmployees] = useState([]) // Already shared employees
  const [isLoadingSharedEmployees, setIsLoadingSharedEmployees] = useState(false)
  const [showEmployeeList, setShowEmployeeList] = useState(false) // Show/hide employee search list

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [boardToDelete, setBoardToDelete] = useState(null)
  const [isDeletingBoard, setIsDeletingBoard] = useState(false)

  // Title editing states
  const [editingBoardId, setEditingBoardId] = useState(null)
  const [editingSubboardTitleId, setEditingSubboardTitleId] = useState(null)
  const [editBoardTitle, setEditBoardTitle] = useState('')
  const [editSubboardTitle, setEditSubboardTitle] = useState('')
  const [isUpdatingBoardTitle, setIsUpdatingBoardTitle] = useState(false)
  const [isUpdatingSubboardTitle, setIsUpdatingSubboardTitle] = useState(false)
  const [hoveredBoardTitle, setHoveredBoardTitle] = useState(null)
  const [hoveredSubboardTitle, setHoveredSubboardTitle] = useState(null)

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
  const isMenuOpen = Boolean(anchorEl)

  // Handle board title editing
  const handleEditBoardTitle = (board) => {
    setEditingBoardId(board._id)
    setEditBoardTitle(board.title)
  }

  const handleSaveBoardTitle = async () => {
    if (!editBoardTitle.trim()) {
      showSnackbar('Board title cannot be empty', 'error')
      return
    }

    setIsUpdatingBoardTitle(true)
    try {
      const response = await boardsApi.updateBoardTitle(editingBoardId, editBoardTitle.trim())
      if (response.status) {
        // Update local state
        setBoards(boards.map(board =>
          board._id === editingBoardId
            ? { ...board, title: editBoardTitle.trim() }
            : board
        ))

        // Update selected board if it's the one being edited
        if (selectedBoard && selectedBoard._id === editingBoardId) {
          setSelectedBoard({ ...selectedBoard, title: editBoardTitle.trim() })
        }

        setEditingBoardId(null)
        setEditBoardTitle('')
        showSnackbar('Board title updated successfully')
      } else {
        showSnackbar(response.message || 'Failed to update board title', 'error')
      }
    } catch (error) {
      console.error('Error updating board title:', error)
      showSnackbar('Failed to update board title', 'error')
    } finally {
      setIsUpdatingBoardTitle(false)
    }
  }

  const handleCancelBoardTitleEdit = () => {
    setEditingBoardId(null)
    setEditBoardTitle('')
  }

  // Handle subboard title editing
  const handleEditSubboardTitle = (subboard) => {
    setEditingSubboardTitleId(subboard._id)
    setEditSubboardTitle(subboard.title)
  }

  const handleSaveSubboardTitle = async () => {
    if (!editSubboardTitle.trim()) {
      showSnackbar('Subboard title cannot be empty', 'error')
      return
    }

    setIsUpdatingSubboardTitle(true)
    try {
      const response = await boardsApi.updateSubBoardTitle(editingSubboardTitleId, editSubboardTitle.trim())
      if (response.status) {
        // Update local state
        setSubboards(subboards.map(subboard =>
          subboard._id === editingSubboardTitleId
            ? { ...subboard, title: editSubboardTitle.trim() }
            : subboard
        ))

        setEditingSubboardTitleId(null)
        setEditSubboardTitle('')
        showSnackbar('Subboard title updated successfully')
      } else {
        showSnackbar(response.message || 'Failed to update subboard title', 'error')
      }
    } catch (error) {
      console.error('Error updating subboard title:', error)
      showSnackbar('Failed to update subboard title', 'error')
    } finally {
      setIsUpdatingSubboardTitle(false)
    }
  }

  const handleCancelSubboardTitleEdit = () => {
    setEditingSubboardTitleId(null)
    setEditSubboardTitle('')
  }

  // Fetch employees function
  const fetchEmployees = async () => {
    setIsLoadingEmployees(true)
    try {
      const employeesData = await boardsApi.getAllEmployees()
      setEmployees(employeesData)
      setFilteredEmployees(employeesData)
    } catch (error) {
      console.error('Error fetching employees:', error)
      showSnackbar('Failed to load employees', 'error')
    } finally {
      setIsLoadingEmployees(false)
    }
  }
  // Handle deleting a board
  const handleDeleteBoard = async () => {
    if (!boardToDelete) return

    setIsDeletingBoard(true)
    try {
      const response = await boardsApi.deleteBoard(boardToDelete._id)

      if (response.status) {
        // Remove board from local state
        setBoards(boards.filter(board => board._id !== boardToDelete._id))
        setDeleteConfirmOpen(false)
        setBoardToDelete(null)
        showSnackbar('Board and all its content deleted successfully')
      } else {
        showSnackbar(response.message || 'Failed to delete board', 'error')
      }
    } catch (error) {
      console.error('Error deleting board:', error)
      showSnackbar('Failed to delete board', 'error')
    } finally {
      setIsDeletingBoard(false)
    }
  }
  // Fetch shared employees function
  const fetchSharedEmployees = async boardId => {
    setIsLoadingSharedEmployees(true)
    try {
      const sharedData = await boardsApi.getBoardSharedEmployees(boardId)
      setSharedEmployees(sharedData)
      return sharedData // Return the data for use in other functions
    } catch (error) {
      console.error('Error fetching shared employees:', error)
      showSnackbar('Failed to load shared employees', 'error')
      return []
    } finally {
      setIsLoadingSharedEmployees(false)
    }
  }

  // Handle employee search
  const handleEmployeeSearch = searchTerm => {
    setEmployeeSearchTerm(searchTerm)
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees)
    } else {
      const filtered = employees.filter(employee => {
        const isAlreadyShared = sharedEmployees.some(shared => shared.employeUniqueId === employee.employeUniqueId)
        const isAlreadySelected = selectedEmployees.some(selected => selected.employeeId === employee._id)

        return (
          !isAlreadyShared &&
          !isAlreadySelected &&
          (employee.employeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.workEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.employeUniqueId?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      })
      setFilteredEmployees(filtered)
    }
  }

  // Handle employee selection from search
  const handleEmployeeSelect = employee => {
    const newEmployee = {
      employeeId: employee._id,
      employeName: employee.employeName,
      employeUniqueId: employee.employeUniqueId,
      employeePhoto: employee.employeePhoto,
      workEmail: employee.workEmail,
      access: 'view'
    }

    setSelectedEmployees(prev => [...prev, newEmployee])
    setEmployeeSearchTerm('')
    setShowEmployeeList(false)

    // Remove from filtered list
    setFilteredEmployees(prev => prev.filter(emp => emp._id !== employee._id))
  }

  // Handle access level change for selected employees
  const handleAccessChange = (employeeId, access) => {
    setSelectedEmployees(prev => prev.map(emp => (emp.employeeId === employeeId ? { ...emp, access } : emp)))
  }

  // Handle access level change for shared employees
  const handleSharedAccessChange = (employeeUniqueId, access) => {
    setSharedEmployees(prev =>
      prev.map(emp => (emp.employeUniqueId === employeeUniqueId ? { ...emp, access, modified: true } : emp))
    )
  }

  // Remove selected employee
  const handleRemoveSelectedEmployee = employeeId => {
    setSelectedEmployees(prev => prev.filter(emp => emp.employeeId !== employeeId))
  }

  // Remove shared employee
  const handleRemoveSharedEmployee = employeeUniqueId => {
    setSharedEmployees(prev => prev.filter(emp => emp.employeUniqueId !== employeeUniqueId))
  }

  // Handle share board
  const handleShareBoard = async () => {
    setIsSharingBoard(true)
    try {
      // Combine all employees that should have access (existing shared + newly selected)
      // This represents the final state of who should have access to the board
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
      ]

      const response = await boardsApi.shareBoard(boardToShare._id, allSharedEmployees)
      if (response.status) {
        const totalCount = allSharedEmployees.length
        const removedCount = (await boardsApi.getBoardSharedEmployees(boardToShare._id)).length - sharedEmployees.length

        let message = `Board sharing updated successfully!`
        if (selectedEmployees.length > 0) {
          message += ` Added ${selectedEmployees.length} new employee(s).`
        }
        if (removedCount > 0) {
          message += ` Removed ${removedCount} employee(s).`
        }
        if (sharedEmployees.some(emp => emp.modified)) {
          message += ` Updated access levels.`
        }

        showSnackbar(message)
        handleCloseShareDialog()
      } else {
        showSnackbar(response.message || 'Failed to update board sharing', 'error')
      }
    } catch (error) {
      console.error('Error updating board sharing:', error)
      showSnackbar('Failed to update board sharing', 'error')
    } finally {
      setIsSharingBoard(false)
    }
  }

  // Handle open share dialog
  const handleOpenShareDialog = board => {
    setBoardToShare(board)
    setShareDialogOpen(true)
    setShowEmployeeList(false)
    fetchEmployees()

    // Fetch shared employees and store original count
    const loadSharedEmployees = async () => {
      const sharedData = await fetchSharedEmployees(board._id)
      setBoardToShare(prev => ({ ...prev, originalSharedCount: sharedData.length }))
    }
    loadSharedEmployees()
  }

  // Handle close share dialog
  const handleCloseShareDialog = () => {
    setShareDialogOpen(false)
    setBoardToShare(null)
    setSelectedEmployees([])
    setSharedEmployees([])
    setEmployeeSearchTerm('')
    setFilteredEmployees([])
    setEmployees([])
    setShowEmployeeList(false)
  }

  // Handle menu actions
  const handleMenuAction = (action, boardId, event) => {
    // Stop event propagation to prevent board card click
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    const board = boards.find(b => b._id === boardId)

    switch (action) {
      case 'open':
        setAnchorEl(null)
        setMenuBoardId(null)
        handleBoardClick(board)
        break
      case 'share':
        setAnchorEl(null)
        setMenuBoardId(null)
        handleOpenShareDialog(board)
        break
      // In the 'delete' case of handleMenuAction switch statement:
      case 'delete':
        setAnchorEl(null)
        setMenuBoardId(null)
        setBoardToDelete(board)
        setDeleteConfirmOpen(true)
        break
      case 'delete':
        setAnchorEl(null)
        setMenuBoardId(null)
        // Add delete functionality here
        console.log('Delete board:', boardId)
        break
      default:
        break
    }
  }

  const handleMenuOpen = (event, boardId) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setMenuBoardId(boardId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuBoardId(null)
  }

  // Load boards from API
  useEffect(() => {
    fetchBoards()
  }, [])

  // Initialize subboards when a board is selected
  useEffect(() => {
    if (selectedBoard && selectedBoard._id) {
      fetchSubboards(selectedBoard._id)
    }
  }, [selectedBoard])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
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

  // Fetch subboards and their notes
  const fetchSubboards = async boardId => {
    setIsLoading(true)
    try {
      const subboardsData = await boardsApi.getSubboards(boardId)
      console.log('Fetched subboards:', subboardsData)
      setSubboards(subboardsData)

      // Fetch notes for each subboard
      const notesData = {}
      for (const subboard of subboardsData) {
        try {
          const notes = await boardsApi.getSubboardNotes(subboard._id)
          notesData[subboard._id] = notes || []
        } catch (error) {
          console.error(`Error fetching notes for subboard ${subboard._id}:`, error)
          notesData[subboard._id] = []
        }
      }

      console.log('Fetched notes data:', notesData)
      setSubboardNotes(notesData)
    } catch (error) {
      console.error('Error fetching subboards:', error)
      setSubboards([])
      setSubboardNotes({})
      showSnackbar('Failed to load subboards', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch boards function
  const fetchBoards = async () => {
    setIsLoading(true)
    try {
      const boardsData = await boardsApi.getBoards()
      setBoards(boardsData)
    } catch (error) {
      console.error('Error fetching boards:', error)
      setBoards([])
      showSnackbar('Failed to load boards', 'error')
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

  // Filter boards based on search term
  const filteredBoards = boards.filter(board => board.title?.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle add board
  const handleAddBoard = async () => {
    if (!newBoardTitle.trim()) {
      showSnackbar('Please enter a board title', 'error')
      return
    }

    setIsAddingBoard(true)
    try {
      const response = await boardsApi.addBoard(newBoardTitle.trim())
      if (response.status) {
        await fetchBoards()
        setAddBoardOpen(false)
        setNewBoardTitle('')
        showSnackbar('Board created successfully')
      } else {
        showSnackbar(response.message || 'Failed to create board', 'error')
      }
    } catch (error) {
      console.error('Error creating board:', error)
      showSnackbar('Failed to create board', 'error')
    } finally {
      setIsAddingBoard(false)
    }
  }

  // Handle board click with animation
  const handleBoardClick = board => {
    setAnimateBoard(true)
    setTimeout(() => {
      setSelectedBoard(board)
      setIsFullWidthView(true)
    }, 150)
  }

  // Handle back from full width view
  const handleBackFromFullWidth = () => {
    setIsFullWidthView(false)
    setAnimateBoard(false)
    setAddSubboardOpen(false) // Close popup
    fetchBoards()
    setTimeout(() => {
      setSelectedBoard(null)
      setSubboards([])
      setSubboardNotes({})
      setNewSubboardTitle('')
    }, 300)
  }

  // Handle add subboard (popup creation)
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
      const response = await boardsApi.addSubboard(newSubboardTitle.trim(), selectedBoard._id)
      if (response.status) {
        await fetchSubboards(selectedBoard._id) // Refresh subboards list
        setNewSubboardTitle('')
        setAddSubboardOpen(false) // Close the popup
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
  const handleNoteAdded = async (newNote, subboardId) => {
    console.log('Note added:', newNote, 'to subboard:', subboardId)

    // Refresh notes for this specific subboard
    try {
      const notes = await boardsApi.getSubboardNotes(subboardId)
      setSubboardNotes(prev => ({
        ...prev,
        [subboardId]: notes || []
      }))
      showSnackbar('Note added successfully')
    } catch (error) {
      console.error('Error refreshing subboard notes:', error)
      showSnackbar('Note added but failed to refresh list', 'warning')
    }
  }

  const handleNoteEdited = async editedNote => {
    console.log('Note edited:', editedNote)

    // Find which subboard this note belongs to and refresh
    const noteSubboardId = editingSubboardId || editedNote.subboardId
    if (noteSubboardId) {
      try {
        const notes = await boardsApi.getSubboardNotes(noteSubboardId)
        setSubboardNotes(prev => ({
          ...prev,
          [noteSubboardId]: notes || []
        }))
      } catch (error) {
        console.error('Error refreshing subboard notes:', error)
      }
    }

    setShowNoteDialog(false)
    setSelectedNote(null)
    setEditingSubboardId(null)
    showSnackbar('Note updated successfully')
  }

  const handleNoteDeleted = async noteId => {
    console.log('Note deleted:', noteId)

    // Refresh notes for the current subboard
    if (editingSubboardId) {
      try {
        const notes = await boardsApi.getSubboardNotes(editingSubboardId)
        setSubboardNotes(prev => ({
          ...prev,
          [editingSubboardId]: notes || []
        }))
      } catch (error) {
        console.error('Error refreshing subboard notes:', error)
      }
    }

    setShowNoteDialog(false)
    setSelectedNote(null)
    setEditingSubboardId(null)
    showSnackbar('Note deleted successfully')
  }

  // Handle note click for editing
  const handleNoteClick = (note, subboardId) => {
    console.log('Note clicked for editing:', note, 'subboardId:', subboardId)
    setSelectedNote(note) // Set existing note for editing
    setShowNoteDialog(true)
    setEditingSubboardId(subboardId)
    console.log('Dialog state after note click:', {
      showNoteDialog: true,
      selectedNote: note,
      editingSubboardId: subboardId
    })
  }

  // Handle new note creation for subboard
  const handleCreateNewNote = subboardId => {
    console.log('Creating new note for subboard:', subboardId)
    setSelectedNote(null) // No existing note = creating new
    setShowNoteDialog(true)
    setEditingSubboardId(subboardId)
    console.log('Dialog state after create new:', {
      showNoteDialog: true,
      selectedNote: null,
      editingSubboardId: subboardId
    })
  }

  // Generate random colors for boards and subboards
  const boardColors = ['#FFE4B5', '#B0C4DE', '#87CEEB', '#F0E68C', '#DDA0DD', '#98FB98', '#F5DEB3', '#D3D3D3']

  const getBoardColor = index => {
    return boardColors[index % boardColors.length]
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

  // Strip HTML for display
  const stripHTML = html => {
    if (!html) return ''
    const temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ''
  }

  // Full width board view with subboards grid
  if (isFullWidthView && selectedBoard) {
    return (
      <Slide direction='up' in={isFullWidthView} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: '0',
            left: 0,
            right: 0,
            width: '100%',
            height: '100%',
            bgcolor: '#083358',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Top Header */}
          <Box
            sx={{
              height: 60,
              bgcolor: 'rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              zIndex: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={handleBackFromFullWidth} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
              {/* Editable Board Title in Header */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                onMouseEnter={() => setHoveredBoardTitle(selectedBoard._id)}
                onMouseLeave={() => setHoveredBoardTitle(null)}
              >
                {editingBoardId === selectedBoard._id ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      value={editBoardTitle}
                      onChange={(e) => setEditBoardTitle(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveBoardTitle()
                        } else if (e.key === 'Escape') {
                          handleCancelBoardTitleEdit()
                        }
                      }}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.3)'
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.5)'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'white'
                          }
                        }
                      }}
                      autoFocus
                    />
                    <IconButton
                      onClick={handleSaveBoardTitle}
                      disabled={isUpdatingBoardTitle}
                      sx={{ color: 'white' }}
                      size="small"
                    >
                      {isUpdatingBoardTitle ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                    </IconButton>
                    <IconButton
                      onClick={handleCancelBoardTitleEdit}
                      sx={{ color: 'white' }}
                      size="small"
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Typography variant='h6' sx={{ color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                      {selectedBoard.title}
                    </Typography>
                    {hoveredBoardTitle === selectedBoard._id && (
                      <IconButton
                        onClick={() => handleEditBoardTitle(selectedBoard)}
                        size="small"
                        sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ position: 'relative' }}>
                <IconButton onClick={() => setAddSubboardOpen(!addSubboardOpen)} sx={{ color: 'white' }}>
                  <IoIosAddCircleOutline />
                </IconButton>

                {/* Custom Inline Popup */}
                {addSubboardOpen && (
                  <Zoom in={addSubboardOpen}>
                    <Box
                      className='subboard-popup'
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
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              overflowY: 'auto'
            }}
          >
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
                            {/* Subboard Header with Editable Title */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  flexGrow: 1,
                                  mb: 2
                                }}
                                onMouseEnter={() => setHoveredSubboardTitle(subboard._id)}
                                onMouseLeave={() => setHoveredSubboardTitle(null)}
                              >
                                {editingSubboardTitleId === subboard._id ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
                                    <TextField
                                      value={editSubboardTitle}
                                      onChange={(e) => setEditSubboardTitle(e.target.value)}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSaveSubboardTitle()
                                        } else if (e.key === 'Escape') {
                                          handleCancelSubboardTitleEdit()
                                        }
                                      }}
                                      size="small"
                                      fullWidth
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          backgroundColor: 'rgba(255,255,255,0.8)',
                                          fontSize: '1.25rem',
                                          fontWeight: 'bold'
                                        }
                                      }}
                                      autoFocus
                                    />
                                    <IconButton
                                      onClick={handleSaveSubboardTitle}
                                      disabled={isUpdatingSubboardTitle}
                                      size="small"
                                      sx={{
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                                      }}
                                    >
                                      {isUpdatingSubboardTitle ? (
                                        <CircularProgress size={16} />
                                      ) : (
                                        <SaveIcon fontSize="small" />
                                      )}
                                    </IconButton>
                                    <IconButton
                                      onClick={handleCancelSubboardTitleEdit}
                                      size="small"
                                      sx={{
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                                      }}
                                    >
                                      <CancelIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                ) : (
                                  <>
                                    <Typography
                                      variant='h6'
                                      fontWeight='bold'
                                      sx={{ color: '#333', cursor: 'pointer', flexGrow: 1 }}
                                    >
                                      {subboard.title}
                                    </Typography>
                                    {hoveredSubboardTitle === subboard._id && (
                                      <IconButton
                                        onClick={() => handleEditSubboardTitle(subboard)}
                                        size="small"
                                        sx={{
                                          color: '#666',
                                          '&:hover': {
                                            color: '#333',
                                            bgcolor: 'rgba(0,0,0,0.1)'
                                          }
                                        }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                  </>
                                )}
                              </Box>

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
                                      <Typography variant='caption'>{formatDate(note.createdAt)}</Typography>
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
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '300px',
                        textAlign: 'center'
                      }}
                    >
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

          {/* AddNoteButton for adding/editing notes */}
          {showNoteDialog && editingSubboardId && (
            <AddNoteButton
              onNoteAdded={note => handleNoteAdded(note, editingSubboardId)}
              onNoteEdited={handleNoteEdited}
              onNoteDeleted={handleNoteDeleted}
              note={selectedNote}
              isEditing={selectedNote !== null}
              type='board'
              boardId={selectedBoard._id}
              subBoardId={editingSubboardId}
              forceOpen={true}
              onCloseEdit={() => {
                setShowNoteDialog(false)
                setSelectedNote(null)
                setEditingSubboardId(null)
              }}
            />
          )}
        </Box>
      </Slide>
    )
  }

  // Main view with sidebar and boards grid
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* Sidebar */}

      <Box
        sx={{
          width: 200,

          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >

        {/* All Boards Header */}
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
            All Boards
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size='small' sx={{ color: '#666' }}>
              <StarBorderIcon fontSize='small' />
            </IconButton>
            <IconButton size='small' sx={{ color: '#666' }}>
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Box>
        </Box>
        {/* Boards List */}

        <Box sx={{ flexGrow: 1, overflow: 'auto' }} style={{ height: pageHeight - 230, overflow: 'scroll' }}>
          {isLoading && boards.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredBoards.length > 0 ? (
            <List sx={{ p: 0 }}>
              {filteredBoards.map((board, index) => (
                <ListItem
                  key={board._id}
                  onClick={() => handleBoardClick(board)}
                  sx={{
                    cursor: 'pointer',
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#f8f9fa'
                    },
                    borderBottom: index < filteredBoards.length - 1 ? '1px solid #f5f5f5' : 'none'
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: getBoardColor(index),
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
                        {board.title || 'Untitled Board'}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                No boards found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            top: '-80px',
            position: 'relative',
            width: 'fit-content',
            marginLeft: 'auto'
          }}
        >
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
        <Box sx={{ maxWidth: 1200, mx: 'auto', marginTop:"-44px" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 4 }}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant='contained'
                startIcon={<AddIcon />}
                onClick={() => setAddBoardOpen(true)}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4
                  }
                }}
              >
                Add Board
              </Button>
            </Box>
          </Box>

          {/* Boards Grid */}
          <Box style={{ height: pageHeight - 230, overflow: 'scroll' }}>
            {/* Search Bar */}


            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredBoards.length > 0 ? (
              <Grid container spacing={3}>
                {filteredBoards.map((board, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={board._id || board.id}
                    style={{ marginBottom: '50px', marginTop: '15px' }}
                  >
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
                        onMouseEnter={() => setHoveredCard(board._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => handleBoardClick(board)}
                      >
                        {hoveredCard === board._id && (
                          <IconButton
                            onClick={e => {
                              e.stopPropagation()
                              setAnchorEl(e.currentTarget)
                              setMenuBoardId(board._id)
                            }}
                            style={{
                              position: 'absolute',
                              zIndex: '9',
                              fontSize: '10px',
                              background: '#f9e0b1',
                              top: '0px',
                              right: '0',
                              filter: 'drop-shadow(0px 2px 6px black)'
                            }}
                          >
                            <SlOptionsVertical />
                          </IconButton>
                        )}

                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && menuBoardId === board._id}
                          onClose={() => {
                            setAnchorEl(null)
                            setMenuBoardId(null)
                          }}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                          <MenuItem onClick={e => handleMenuAction('open', board._id, e)}>Open</MenuItem>
                          <MenuItem onClick={e => handleMenuAction('delete', board._id, e)}>Delete</MenuItem>
                          <MenuItem onClick={e => handleMenuAction('share', board._id, e)}>Share</MenuItem>
                        </Menu>

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

                        {/* Editable Board Title */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            px: 1,
                            pb: 1,
                            mt: 'auto'
                          }}
                          onMouseEnter={(e) => {
                            e.stopPropagation()
                            setHoveredBoardTitle(board._id)
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation()
                            setHoveredBoardTitle(null)
                          }}
                        >
                          {editingBoardId === board._id ? (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                width: '100%',
                                justifyContent: 'center'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <TextField
                                value={editBoardTitle}
                                onChange={(e) => setEditBoardTitle(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveBoardTitle()
                                  } else if (e.key === 'Escape') {
                                    handleCancelBoardTitleEdit()
                                  }
                                }}
                                size="small"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    fontSize: '17px',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    '& input': {
                                      textAlign: 'center'
                                    }
                                  }
                                }}
                                autoFocus
                              />
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSaveBoardTitle()
                                }}
                                disabled={isUpdatingBoardTitle}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(255,255,255,0.8)',
                                  '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                                }}
                              >
                                {isUpdatingBoardTitle ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <SaveIcon fontSize="small" />
                                )}
                              </IconButton>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCancelBoardTitleEdit()
                                }}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(255,255,255,0.8)',
                                  '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                                }}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <>
                              <Typography
                                variant='h6'
                                fontWeight='medium'
                                color='text.primary'
                                sx={{
                                  textAlign: 'center',
                                  fontSize: '17px',
                                  textTransform: 'capitalize',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                {board.title}
                              </Typography>
                              {hoveredBoardTitle === board._id && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditBoardTitle(board)
                                  }}
                                  size="small"
                                  sx={{
                                    color: '#666',
                                    bgcolor: 'rgba(255,255,255,0.7)',
                                    '&:hover': {
                                      color: '#333',
                                      bgcolor: 'rgba(255,255,255,0.9)'
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              )}
                            </>
                          )}
                        </Box>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', my: 8 }}>
                {/* <Typography variant='h6' color='text.secondary' gutterBottom>
                No boards found
              </Typography> */}
                <Typography variant='body2' color='text.secondary'>
                  You haven't created any boards yet. Click "Add Board" to begin.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {/* Add Board FAB */}
      {/* <Fab
        color='primary'
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1000
        }}
        onClick={() => setAddBoardOpen(true)}
      >
        <AddIcon />
      </Fab> */}
      {/* Add Board Dialog */}
      <Dialog open={addBoardOpen} onClose={() => setAddBoardOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Create New Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Board Title'
            type='text'
            fullWidth
            variant='outlined'
            value={newBoardTitle}
            onChange={e => setNewBoardTitle(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleAddBoard()
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddBoardOpen(false)}>Cancel</Button>
          <Button onClick={handleAddBoard} variant='contained' disabled={isAddingBoard || !newBoardTitle.trim()}>
            {isAddingBoard ? <CircularProgress size={24} /> : 'Create Board'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Google Sheets-like Share Board Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        maxWidth='sm'
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Share "{boardToShare?.title}"
          </Typography>
          <IconButton onClick={handleCloseShareDialog} size='small'>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Add People Section */}
          <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
            <TextField
              fullWidth
              size='small'
              placeholder='Add people, groups, and calendar events'
              value={employeeSearchTerm}
              onChange={e => {
                setEmployeeSearchTerm(e.target.value)
                handleEmployeeSearch(e.target.value)
                setShowEmployeeList(e.target.value.length > 0)
              }}
              onFocus={() => {
                if (employeeSearchTerm.length > 0) {
                  setShowEmployeeList(true)
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
                  <InputAdornment position='start'>
                    <PersonAddIcon fontSize='small' sx={{ color: '#666' }} />
                  </InputAdornment>
                )
              }}
            />

            {/* Employee Search Results */}
            {showEmployeeList && (
              <Box
                sx={{
                  mt: 1,
                  maxHeight: 200,
                  overflowY: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  bgcolor: 'white',
                  boxShadow: 1
                }}
              >
                {isLoadingEmployees ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
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
                      <Avatar src={employee.employeePhoto} sx={{ width: 32, height: 32, mr: 2 }}>
                        {employee.employeName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant='body2' sx={{ fontWeight: 500 }}>
                          {employee.employeName}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {employee.workEmail || employee.employeUniqueId}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant='body2' color='text.secondary'>
                      No employees found
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* People with access */}
          <Box sx={{ p: 3 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 2, color: '#5f6368' }}>
              People with access
            </Typography>

            {/* Already Shared Employees */}
            {isLoadingSharedEmployees ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                {sharedEmployees.map(employee => (
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
                    <Avatar src={employee.employeePhoto} sx={{ width: 40, height: 40, mr: 2 }}>
                      {employee.employeName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant='body2' sx={{ fontWeight: 500 }}>
                        {employee.employeName}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {employee.workEmail || employee.employeUniqueId}
                      </Typography>
                      {employee.modified && (
                        <Chip
                          label='Modified'
                          size='small'
                          color='warning'
                          variant='outlined'
                          sx={{ ml: 1, height: 20, fontSize: '10px' }}
                        />
                      )}
                    </Box>
                    <TextField
                      select
                      size='small'
                      value={employee.access}
                      onChange={e => handleSharedAccessChange(employee.employeUniqueId, e.target.value)}
                      sx={{
                        minWidth: 100,
                        mr: 1,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: employee.modified ? '#fff' : 'transparent'
                        }
                      }}
                    >
                      <MenuItem value='view'>Viewer</MenuItem>
                      <MenuItem value='edit'>Editor</MenuItem>
                    </TextField>
                    <IconButton
                      size='small'
                      onClick={() => handleRemoveSharedEmployee(employee.employeUniqueId)}
                      sx={{
                        color: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#ffebee'
                        }
                      }}
                      title='Remove access'
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Box>
                ))}

                {/* Selected Employees (to be added) */}
                {selectedEmployees.map(employee => (
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
                    <Avatar src={employee.employeePhoto} sx={{ width: 40, height: 40, mr: 2 }}>
                      {employee.employeName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant='body2' sx={{ fontWeight: 500 }}>
                        {employee.employeName}
                        <span
                          style={{
                            fontSize: '8px',
                            background: '#00800029',
                            color: 'green',
                            borderRadius: '10px',
                            display: 'flex',
                            width: 'fit-content',
                            padding: '2px 6px',
                            alignItems: 'center'
                          }}
                        >
                          <CiCircleCheck /> Selected
                        </span>
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {employee.workEmail || employee.employeUniqueId}
                      </Typography>
                    </Box>

                    <TextField
                      select
                      size='small'
                      value={employee.access}
                      onChange={e => handleAccessChange(employee.employeeId, e.target.value)}
                      sx={{ minWidth: 100, mr: 1 }}
                    >
                      <MenuItem value='view'>Viewer</MenuItem>
                      <MenuItem value='edit'>Editor</MenuItem>
                    </TextField>
                    <IconButton
                      size='small'
                      onClick={() => handleRemoveSelectedEmployee(employee.employeeId)}
                      sx={{ color: '#666' }}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Box>
                ))}

                {sharedEmployees.length === 0 && selectedEmployees.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                      No one has access to this board yet.
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Use the search box above to add people and share this board.
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            borderTop: '1px solid #e0e0e0',
            justifyContent: 'space-between'
          }}
        >
          <Button onClick={handleCloseShareDialog}>Cancel</Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Summary of changes */}
            {(selectedEmployees.length > 0 ||
              sharedEmployees.some(emp => emp.modified) ||
              sharedEmployees.length !== (boardToShare?.originalSharedCount || 0)) && (
              <Typography variant='caption' color='text.secondary'>
                {selectedEmployees.length > 0 && `+${selectedEmployees.length} new`}
                {selectedEmployees.length > 0 && sharedEmployees.some(emp => emp.modified) && ', '}
                {sharedEmployees.some(emp => emp.modified) && 'access updated'}
              </Typography>
            )}
            <Button
              onClick={handleShareBoard}
              variant='contained'
              disabled={
                isSharingBoard ||
                (selectedEmployees.length === 0 &&
                  !sharedEmployees.some(emp => emp.modified) &&
                  sharedEmployees.length === (boardToShare?.originalSharedCount || 0))
              }
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {isSharingBoard ? <CircularProgress size={20} color='inherit' /> : 'Save Changes'}
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
      {/* Delete Board Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ color: '#d32f2f' }}>Delete Board</DialogTitle>
        <DialogContent>
          <Typography variant='body1' sx={{ mb: 2 }}>
            Are you sure you want to delete "<strong>{boardToDelete?.title}</strong>"?
          </Typography>
          <Alert severity='warning' sx={{ mb: 2 }}>
            <Typography variant='body2'>
              <strong>This action cannot be undone.</strong> All subboards and notes within this board will be
              permanently deleted.
            </Typography>
          </Alert>
          <Typography variant='body2' color='text.secondary'>
            This will delete:
          </Typography>
          <Box component='ul' sx={{ mt: 1, pl: 2 }}>
            <li>The board "{boardToDelete?.title}"</li>
            <li>All subboards within this board</li>
            <li>All notes in all subboards</li>
            <li>All shared access permissions</li>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={isDeletingBoard}>
            Cancel
          </Button>
          <Button onClick={handleDeleteBoard} color='error' variant='contained' disabled={isDeletingBoard}>
            {isDeletingBoard ? <CircularProgress size={24} /> : 'Delete Board'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default NotesBoards
