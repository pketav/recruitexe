'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Button,
  TextField,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  Backdrop,
  Fade,
  Divider,
  Tooltip,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputAdornment,
  Menu,
  Popover
} from '@mui/material'
import {
  Add as AddIcon,
  Image as ImageIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatSize as FormatSizeIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  ZoomIn as ZoomInIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatColorText as FormatColorTextIcon,
  FormatColorFill as FormatColorFillIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Edit as EditIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  AccessTime as AccessTimeIcon,
  Share as ShareIcon,
  Palette as PaletteIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
  FormatAlignJustify as FormatAlignJustifyIcon,
  TableChart as TableChartIcon,
  Clear as ClearIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material'
import { FaImage } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { CiCircleCheck } from 'react-icons/ci'

// Base URL for API
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Available colors for notes (expanded with recently used)
const colorOptions = [
  '#FFD580', // amber
  '#FFAB91', // orange
  '#D1C4E9', // purple
  '#B2EBF2', // cyan
  '#E6EE9C', // lime
  '#F8BBD9', // pink
  '#C5E1A5', // light green
  '#FFCCBC', // peach
  '#B39DDB', // light purple
  '#81C784', // green
  '#FFB74D', // orange
  '#F06292', // pink
  '#64B5F6', // blue
  '#AED581', // light green
  '#FFD54F', // yellow
  '#FF8A65', // coral
  '#9575CD', // purple
  '#4DB6AC', // teal
  '#DCE775', // lime
  '#FFF176', // yellow
  '#ffffff' // white
]
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colorOptions.length);
  return colorOptions[randomIndex];
};
// Recently used colors (this would typically come from localStorage or user preferences)
const recentlyUsedColors = ['#FFD580', '#FFAB91', '#D1C4E9', '#B2EBF2']

// Text color options
const textColorOptions = [
  '#000000', // black
  '#FF0000', // red
  '#0000FF', // blue
  '#008000', // green
  '#800080', // purple
  '#FFA500' // orange
]

// Font family options
const fontFamilies = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans MS' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
  { value: 'Lucida Console, monospace', label: 'Lucida Console' }
]

// Table Size Selector Component
const TableSizeSelector = ({ anchorEl, open, onClose, onSelectSize }) => {
  const [hoveredSize, setHoveredSize] = useState({ rows: 0, cols: 0 })
  const maxRows = 10
  const maxCols = 10

  const handleCellHover = (row, col) => {
    setHoveredSize({ rows: row + 1, cols: col + 1 })
  }

  const handleCellClick = (row, col) => {
    onSelectSize(row + 1, col + 1)
    onClose()
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      PaperProps={{
        sx: {
          p: 2,
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <Box>
        <Typography variant='caption' sx={{ mb: 1, display: 'block', textAlign: 'center', fontWeight: 500 }}>
          {hoveredSize.rows > 0 && hoveredSize.cols > 0
            ? `${hoveredSize.rows} x ${hoveredSize.cols} Table`
            : 'Select table size'}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
            gridTemplateRows: `repeat(${maxRows}, 1fr)`,
            gap: 1,
            maxWidth: 200
          }}
        >
          {Array.from({ length: maxRows }, (_, row) =>
            Array.from({ length: maxCols }, (_, col) => (
              <Box
                key={`${row}-${col}`}
                onMouseEnter={() => handleCellHover(row, col)}
                onClick={() => handleCellClick(row, col)}
                sx={{
                  width: 16,
                  height: 16,
                  border: '1px solid #ddd',
                  backgroundColor: row < hoveredSize.rows && col < hoveredSize.cols ? '#1976d2' : '#f5f5f5',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s ease',
                  '&:hover': {
                    backgroundColor: '#1976d2'
                  }
                }}
              />
            ))
          )}
        </Box>

        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Button size='small' onClick={onClose} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Popover>
  )
}

// Reminder Options Popup Component
const ReminderOptionsPopup = ({ anchorEl, open, onClose, onClearReminder, onResetReminder }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
          minWidth: 150
        }
      }}
    >
      <Box sx={{ py: 1 }}>
        <MenuItem
          onClick={() => {
            onResetReminder()
            onClose()
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <ScheduleIcon fontSize='small' sx={{ color: '#1976d2' }} />
          <Typography variant='body2'>Reset Reminder</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            onClearReminder()
            onClose()
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            '&:hover': {
              backgroundColor: '#ffebee'
            }
          }}
        >
          <ClearIcon fontSize='small' sx={{ color: '#d32f2f' }} />
          <Typography variant='body2' sx={{ color: '#d32f2f' }}>
            Clear Reminder
          </Typography>
        </MenuItem>
      </Box>
    </Popover>
  )
}

// API functions for notes
const api = {
  addNote: async noteData => {
    try {
      console.log('API addNote called with:', noteData)

      const response = await fetch(`${baseUrl}/v1/api/notes/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify(noteData)
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API response data:', data)
      return data
    } catch (error) {
      console.error('Error adding note:', error)
      throw error
    }
  },

  updateNote: async (notesId, title, content, bgColor, reminderDate = null, reminderTime = null) => {
    try {
      const updateData = {
        notesId,
        title,
        content,
        bgColor
      }

      // Only include reminder fields if they have values
      if (reminderDate && reminderTime) {
        updateData.reminderDate = reminderDate
        updateData.reminderTime = reminderTime
      } else {
        // Explicitly set to null when clearing
        updateData.reminderDate = null
        updateData.reminderTime = null
      }

      const response = await fetch(`${baseUrl}/v1/api/notes/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify(updateData)
      })
      if (!response.ok) throw new Error('Failed to update note')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
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
      })
      if (!response.ok) throw new Error('Failed to share note')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error sharing note:', error)
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

  getNotesSharedEmployees: async notesId => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/notes/getNotesSharedEmployees?notesId=${notesId}`, {
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
  },

  uploadImage: async imageFile => {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch(`${baseUrl}/v1/formData/ImageUpload`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        },
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload image')
      const data = await response.json()

      return {
        status: data.status,
        items: {
          image: data.items ? data.items.image : data.image
        },
        message: data.message || 'Image uploaded successfully'
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }
}

// Helper function to check if user has edit access
const hasEditAccess = (note, currentUserId) => {
  // If no sharedWith array, user is the owner with full access
  if (!note.sharedWith || note.sharedWith.length === 0) {
    return true
  }

  // Check if there's any edit access in sharedWith
  const hasEditInShared = note.sharedWith.some(share => share.access === 'edit')
  return hasEditInShared
}

// Helper function to get shared by info
const getSharedByInfo = note => {
  return note.sharedBy || null
}

// Custom date time validation function
const validateDateTime = selectedDateTime => {
  if (!selectedDateTime) return true

  const now = dayjs()
  const selected = dayjs(selectedDateTime)

  // If selected date is in the past, invalid
  if (selected.isBefore(now, 'day')) {
    return false
  }

  // If selected date is today, check if time is in the future
  if (selected.isSame(now, 'day')) {
    return selected.isAfter(now)
  }

  // If selected date is in the future, valid
  return true
}

/**
 * Enhanced AddNoteButton component with sharing, reminders, font families, alignment, and tables
 */
const AddNoteButton = ({
  onNoteAdded,
  onNoteEdited,
  onNoteDeleted,
  buttonStyle,
  buttonPosition,
  note = null,
  isEditing = false,
  onCloseEdit,
  noteClosed = () => {},
  boardId = null,
  subBoardId = null,
  type = 'notes',
  forceOpen = false,
  currentUserId = null
}) => {
  // State variables
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedColor, setSelectedColor] = useState(() => getRandomColor())
  const [showTextColors, setShowTextColors] = useState(false)
  const [showFontSizes, setShowFontSizes] = useState(false)
  const [showFontFamilies, setShowFontFamilies] = useState(false)
  const [images, setImages] = useState([])
  const [pageHeight, setPageHeight] = useState(0)
  const [editorFocused, setEditorFocused] = useState(false)
  const [toolbarExpanded, setToolbarExpanded] = useState(false)

  // Table context menu state
  const [tableContextMenu, setTableContextMenu] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)
  const [selectedCell, setSelectedCell] = useState(null)

  // Table size selector state
  const [tableSelectorAnchor, setTableSelectorAnchor] = useState(null)
  const [tableSelectorOpen, setTableSelectorOpen] = useState(false)

  // Enhanced reminder state with better validation
  const [reminderDateTime, setReminderDateTime] = useState(null)
  const [reminderPickerOpen, setReminderPickerOpen] = useState(false)
  const [reminderError, setReminderError] = useState('')
  const [reminderCleared, setReminderCleared] = useState(false) // Track if user manually cleared reminder
  const [reminderConfirmed, setReminderConfirmed] = useState(false) // Track if user confirmed the reminder

  // New state for reminder options popup
  const [reminderOptionsAnchor, setReminderOptionsAnchor] = useState(null)
  const [reminderOptionsOpen, setReminderOptionsOpen] = useState(false)
  const [tempReminderDateTime, setTempReminderDateTime] = useState(null)

  // Auto-save state
  const [lastSaved, setLastSaved] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const autoSaveIntervalRef = useRef(null)

  // New state for color picker
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorPickerMode, setColorPickerMode] = useState('Colors')

  // Enhanced share functionality state
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)
  const [isSharingNote, setIsSharingNote] = useState(false)
  const [sharedEmployees, setSharedEmployees] = useState([])
  const [isLoadingSharedEmployees, setIsLoadingSharedEmployees] = useState(false)
  const [showEmployeeList, setShowEmployeeList] = useState(false)

  // Check access permissions
  const canEdit = note ? hasEditAccess(note, currentUserId) : true
  const sharedByInfo = note ? getSharedByInfo(note) : null

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // Image preview state
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  // Delete confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Refs
  const editorRef = useRef(null)
  const toolbarRef = useRef(null)
  const reminderButtonRef = useRef(null)

  // Font size options
  const fontSizes = [
    { value: '1', label: 'Small' },
    { value: '3', label: 'Normal' },
    { value: '5', label: 'Large' },
    { value: '7', label: 'Huge' }
  ]

  // Check if reminder is set (and not manually cleared)
  const hasReminder =
    !reminderCleared && (reminderDateTime || note?.reminderAt || (note?.reminderDate && note?.reminderTime))

  // Initialize form when a note is provided for editing
  useEffect(() => {
    if (isEditing && note && typeof window !== 'undefined') {
      setTitle(note.title || '')
      setContent(note.content || '')
      setSelectedColor(note.bgColor || '#FFD580')
      setReminderCleared(false) // Reset cleared flag when loading note
      setReminderConfirmed(false) // Reset confirmed flag

      // Initialize reminder if exists
      if (note.reminderDate && note.reminderTime) {
        const reminderDateTimeString = `${note.reminderDate} ${note.reminderTime}`
        setReminderDateTime(dayjs(reminderDateTimeString, 'YYYY-MM-DD h:mm A'))
      }

      const extractedImages = extractImages(note.content || '')
      setImages(extractedImages)

      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = note.content || ''
          addControlsToImages()
          addTableEventListeners()
        }
      }, 50)

      setHasUnsavedChanges(false)
    }
  }, [isEditing, note])

  // Page height effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageHeight(window.innerHeight)

      const handleResize = () => {
        setPageHeight(window.innerHeight)
      }

      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    if (note?.reminderAt) {
      setReminderDateTime(dayjs(note.reminderAt))
    } else if (note?.reminderDate && note?.reminderTime) {
      const reminderDateTimeString = `${note.reminderDate} ${note.reminderTime}`
      setReminderDateTime(dayjs(reminderDateTimeString, 'YYYY-MM-DD h:mm A'))
    }
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (isAddingNote || isEditing) {
      autoSaveIntervalRef.current = setInterval(() => {
        if (hasUnsavedChanges && canEdit && (title.trim() || content.trim())) {
          handleAutoSave()
        }
      }, 60000)

      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current)
        }
      }
    }
  }, [isAddingNote, isEditing, hasUnsavedChanges, canEdit, title, content])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        if (canEdit && (title.trim() || content.trim())) {
          handleManualSave()
        }
      }
    }

    if (isAddingNote || isEditing) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isAddingNote, isEditing, canEdit, title, content])

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [title, content, selectedColor, reminderDateTime])

  // Enhanced reminder change handler with validation - only called when user confirms
  // const handleReminderChange = async newValue => {
  //   setReminderError('')

  //   if (newValue && !validateDateTime(newValue)) {
  //     setReminderError('Cannot set reminder for past date/time')
  //     setReminderDateTime(null)
  //     showSnackbar('Cannot set reminder for past date/time', 'error')
  //     return
  //   }

  //   setReminderDateTime(newValue)
  //   setReminderCleared(false) // Reset cleared flag when setting new reminder
  //   setReminderConfirmed(true) // Mark as confirmed by user

  //   // Only show success message and auto-save when user confirms the reminder
  //   if (newValue && reminderConfirmed && canEdit && (title.trim() || content.trim())) {
  //     setTimeout(() => {
  //       handleAutoSave()
  //     }, 500)

  //     showSnackbar('Reminder set and note saved')
  //   }
  // }

  // Handle reminder picker close - save data regardless of how it's closed
const handleReminderPickerClose = () => {
  setReminderPickerOpen(false)
  setTempReminderDateTime(null) // Clear temp value when picker closes without accepting

  // Auto-save when picker is closed (only if there are other changes)
  if (canEdit && (title.trim() || content.trim())) {
    setTimeout(() => {
      handleAutoSave()
    }, 500)
  }
}

  // Handle reminder accept (when user clicks OK/Accept)
const handleReminderAccept = (newValue) => {
  const valueToUse = newValue || tempReminderDateTime

  if (!valueToUse) return

  setReminderError('')

  if (!validateDateTime(valueToUse)) {
    setReminderError('Cannot set reminder for past date/time')
    setReminderDateTime(null)
    setTempReminderDateTime(null)
    showSnackbar('Cannot set reminder for past date/time', 'error')
    return
  }

  // Actually set the reminder only when user clicks OK
  setReminderDateTime(valueToUse)
  setReminderCleared(false)
  setReminderConfirmed(true)
  setTempReminderDateTime(null) // Clear temp value

  // Auto-save and show success message
  if (canEdit && (title.trim() || content.trim())) {
    setTimeout(() => {
      handleAutoSave()
    }, 500)
  }

  showSnackbar('Reminder set and note saved')
}

  // Handle reminder button click
  const handleReminderButtonClick = event => {
    if (hasReminder) {
      // Show options popup if reminder is already set
      setReminderOptionsAnchor(event.currentTarget)
      setReminderOptionsOpen(true)
    } else {
      // Open date picker if no reminder is set
      setReminderConfirmed(false) // Reset confirmed flag
      setReminderPickerOpen(true)
    }
  }

  // Handle clear reminder - sets reminderDate and reminderTime to empty
  const handleClearReminder = async () => {
    setReminderDateTime(null)
    setReminderError('')
    setReminderCleared(true) // Mark as manually cleared
    setReminderConfirmed(false) // Reset confirmed flag

    if (isEditing && note) {
      setTimeout(() => {
        handleAutoSave()
      }, 500)
    }

    showSnackbar('Reminder cleared', 'success')
  }

  // Handle reset/edit reminder - opens date picker with default 5 minutes from now
const handleResetReminder = () => {
  // Set default time to 5 minutes from now
  const defaultTime = dayjs().add(5, 'minute')
  setTempReminderDateTime(defaultTime) // Set temp value, not actual reminder
  setReminderCleared(false)
  setReminderConfirmed(false)
  setReminderPickerOpen(true)
}

  // Enhanced table size selection handler
  const handleTableSizeSelect = (rows, cols) => {
    console.log(`Table size selected: ${rows}x${cols}`)
    console.log('Editor ref current:', editorRef.current)
    console.log('Can edit:', canEdit)

    insertTableWithSize(rows, cols)
    setTableSelectorOpen(false)
  }

  // Table selector button handler
  const handleTableButtonClick = event => {
    console.log('Table button clicked')
    console.log('Editor ref:', editorRef.current)

    setTableSelectorAnchor(event.currentTarget)
    setTableSelectorOpen(true)
  }

  // Enhanced table creation with custom size
  const insertTableWithSize = (rows, cols) => {
    if (!editorRef.current) {
      console.log('Editor ref not available')
      return
    }

    try {
      console.log(`Inserting ${rows}x${cols} table...`)

      // Create table HTML string
      let tableHTML = `
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0; background-color: white; border: 1px solid #ddd;">
      `

      for (let i = 0; i < rows; i++) {
        tableHTML += '<tr>'
        for (let j = 0; j < cols; j++) {
          tableHTML += `
            <td
              contenteditable="true"
              style="
                border: 1px solid #ddd;
                padding: 8px;
                min-width: 80px;
                min-height: 30px;
                vertical-align: top;
                background-color: white;
              "
            >&nbsp;</td>
          `
        }
        tableHTML += '</tr>'
      }

      tableHTML += '</table><br>'

      // Focus the editor first
      editorRef.current.focus()

      // Try to insert at cursor position
      if (typeof window !== 'undefined') {
        try {
          const selection = window.getSelection()

          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)

            // Create a temporary div to hold our HTML
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = tableHTML

            // Insert each child node of the temp div
            while (tempDiv.firstChild) {
              range.insertNode(tempDiv.firstChild)
            }

            // Move cursor after the inserted content
            range.collapse(false)
            selection.removeAllRanges()
            selection.addRange(range)
          } else {
            // No selection, append to end
            editorRef.current.innerHTML += tableHTML
          }
        } catch (selectionError) {
          console.log('Selection method failed, using append method:', selectionError)
          // Fallback to append
          editorRef.current.innerHTML += tableHTML
        }
      } else {
        // Server-side or no window object
        editorRef.current.innerHTML += tableHTML
      }

      // Force update the content state
      const newContent = editorRef.current.innerHTML
      setContent(newContent)

      // Trigger content change handler
      handleContentChange()

      // Add event listeners to newly created table cells
      setTimeout(() => {
        addTableEventListeners()
      }, 100)

      // Focus back to editor
      setTimeout(() => {
        editorRef.current.focus()
      }, 150)

      console.log(`${rows}x${cols} table inserted successfully`)
      showSnackbar(`${rows}x${cols} table inserted successfully`)
    } catch (error) {
      console.error('Error inserting table:', error)

      // Ultimate fallback - simple append
      try {
        const simpleTableHTML = `
          <table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">
            ${Array.from(
              { length: rows },
              () =>
                `<tr>${Array.from(
                  { length: cols },
                  () =>
                    '<td style="border: 1px solid #ddd; padding: 8px; min-width: 80px; min-height: 30px;" contenteditable="true">&nbsp;</td>'
                ).join('')}</tr>`
            ).join('')}
          </table><br>
        `

        editorRef.current.innerHTML += simpleTableHTML
        setContent(editorRef.current.innerHTML)
        handleContentChange()

        // Add event listeners
        setTimeout(() => {
          addTableEventListeners()
        }, 100)

        showSnackbar(`${rows}x${cols} table inserted (simple method)`)
        console.log(`${rows}x${cols} table inserted using simple method`)
      } catch (finalError) {
        console.error('All table insertion methods failed:', finalError)
        showSnackbar('Failed to insert table', 'error')
      }
    }
  }

  // Add table event listeners
  const addTableEventListeners = () => {
    if (typeof window === 'undefined' || !editorRef.current) return

    const tables = editorRef.current.querySelectorAll('table')
    console.log(`Adding event listeners to ${tables.length} tables`)

    tables.forEach((table, tableIndex) => {
      // Add table options button if not already added
      if (!table.querySelector('.table-options-btn')) {
        const optionsBtn = document.createElement('button')
        optionsBtn.className = 'table-options-btn'
        optionsBtn.innerHTML = '⋮'
        optionsBtn.style.position = 'absolute'
        optionsBtn.style.top = '5px'
        optionsBtn.style.right = '5px'
        optionsBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
        optionsBtn.style.border = '1px solid #ddd'
        optionsBtn.style.borderRadius = '4px'
        optionsBtn.style.padding = '4px 8px'
        optionsBtn.style.cursor = 'pointer'
        optionsBtn.style.fontSize = '16px'
        optionsBtn.style.fontWeight = 'bold'
        optionsBtn.style.zIndex = '10'
        optionsBtn.style.display = 'none'
        optionsBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'

        // Make table container relative for absolute positioning
        table.style.position = 'relative'

        // Add click handler for options button
        optionsBtn.onclick = e => {
          e.preventDefault()
          e.stopPropagation()

          // Find the first cell to use for context menu positioning
          const firstCell = table.querySelector('td, th')
          if (firstCell) {
            setSelectedCell(firstCell)
            setSelectedTable(table)
            setTableContextMenu({
              mouseX: e.clientX - 2,
              mouseY: e.clientY - 4
            })
          }
        }

        // Add the options button to the table
        table.appendChild(optionsBtn)

        // Add hover events to show/hide options button
        table.addEventListener('mouseenter', () => {
          optionsBtn.style.display = 'block'
        })

        table.addEventListener('mouseleave', () => {
          optionsBtn.style.display = 'none'
        })
      }

      const cells = table.querySelectorAll('td, th')
      console.log(`Table ${tableIndex + 1} has ${cells.length} cells`)

      cells.forEach((cell, cellIndex) => {
        // Remove existing event listeners to avoid duplicates
        cell.removeEventListener('contextmenu', handleTableContextMenu)

        // Add fresh event listener
        cell.addEventListener('contextmenu', handleTableContextMenu)

        // Ensure proper styling and functionality
        cell.style.position = 'relative'
        cell.style.border = '1px solid #ddd'
        cell.style.padding = '8px'
        cell.style.minWidth = '80px'
        cell.style.minHeight = '30px'
        cell.style.cursor = 'text'
        cell.style.verticalAlign = 'top'
        cell.style.backgroundColor = 'white'

        // Make sure cells are editable
        if (!cell.hasAttribute('contenteditable')) {
          cell.contentEditable = 'true'
        }

        // Add placeholder content if empty
        if (!cell.innerHTML.trim() || cell.innerHTML === '' || cell.innerHTML === '<br>') {
          cell.innerHTML = '&nbsp;'
        }

        // Add input event listener for content changes
        cell.addEventListener('input', () => {
          handleContentChange()
        })

        // Add focus event listener
        cell.addEventListener('focus', () => {
          cell.style.outline = '2px solid #1976d2'
        })

        // Add blur event listener
        cell.addEventListener('blur', () => {
          cell.style.outline = 'none'
        })

        console.log(`Added listeners to cell ${cellIndex + 1} in table ${tableIndex + 1}`)
      })

      // Ensure table has proper styling
      table.style.borderCollapse = 'collapse'
      table.style.width = '100%'
      table.style.margin = '10px 0'
      table.style.border = '1px solid #ddd'
    })
  }

  // Handle table context menu
  const handleTableContextMenu = e => {
    e.preventDefault()
    const cell = e.target.closest('td, th')
    const table = e.target.closest('table')

    if (cell && table) {
      setSelectedCell(cell)
      setSelectedTable(table)
      setTableContextMenu({
        mouseX: e.clientX - 2,
        mouseY: e.clientY - 4
      })
    }
  }

  // Close table context menu
  const handleCloseTableContextMenu = () => {
    setTableContextMenu(null)
    setSelectedCell(null)
    setSelectedTable(null)
  }

  // Table manipulation functions
  const insertRowAbove = () => {
    if (!selectedCell || !selectedTable) return

    const row = selectedCell.closest('tr')
    const newRow = document.createElement('tr')
    const cellsCount = row.cells.length

    for (let i = 0; i < cellsCount; i++) {
      const newCell = document.createElement('td')
      newCell.innerHTML = ''
      newCell.style.border = '1px solid #ddd'
      newCell.style.padding = '8px'
      newCell.style.minWidth = '80px'
      newCell.style.minHeight = '30px'
      newCell.addEventListener('contextmenu', handleTableContextMenu)
      newRow.appendChild(newCell)
    }

    row.parentNode.insertBefore(newRow, row)
    handleContentChange()
    handleCloseTableContextMenu()
  }

  const insertRowBelow = () => {
    if (!selectedCell || !selectedTable) return

    const row = selectedCell.closest('tr')
    const newRow = document.createElement('tr')
    const cellsCount = row.cells.length

    for (let i = 0; i < cellsCount; i++) {
      const newCell = document.createElement('td')
      newCell.innerHTML = ''
      newCell.style.border = '1px solid #ddd'
      newCell.style.padding = '8px'
      newCell.style.minWidth = '80px'
      newCell.style.minHeight = '30px'
      newCell.addEventListener('contextmenu', handleTableContextMenu)
      newRow.appendChild(newCell)
    }

    if (row.nextSibling) {
      row.parentNode.insertBefore(newRow, row.nextSibling)
    } else {
      row.parentNode.appendChild(newRow)
    }

    handleContentChange()
    handleCloseTableContextMenu()
  }

  const insertColumnLeft = () => {
    if (!selectedCell || !selectedTable) return

    const cellIndex = Array.from(selectedCell.parentNode.children).indexOf(selectedCell)
    const rows = selectedTable.querySelectorAll('tr')

    rows.forEach(row => {
      const newCell = document.createElement('td')
      newCell.innerHTML = ''
      newCell.style.border = '1px solid #ddd'
      newCell.style.padding = '8px'
      newCell.style.minWidth = '80px'
      newCell.style.minHeight = '30px'
      newCell.addEventListener('contextmenu', handleTableContextMenu)

      if (row.children[cellIndex]) {
        row.insertBefore(newCell, row.children[cellIndex])
      } else {
        row.appendChild(newCell)
      }
    })

    handleContentChange()
    handleCloseTableContextMenu()
  }

  const insertColumnRight = () => {
    if (!selectedCell || !selectedTable) return

    const cellIndex = Array.from(selectedCell.parentNode.children).indexOf(selectedCell)
    const rows = selectedTable.querySelectorAll('tr')

    rows.forEach(row => {
      const newCell = document.createElement('td')
      newCell.innerHTML = ''
      newCell.style.border = '1px solid #ddd'
      newCell.style.padding = '8px'
      newCell.style.minWidth = '80px'
      newCell.style.minHeight = '30px'
      newCell.addEventListener('contextmenu', handleTableContextMenu)

      if (row.children[cellIndex + 1]) {
        row.insertBefore(newCell, row.children[cellIndex + 1])
      } else {
        row.appendChild(newCell)
      }
    })

    handleContentChange()
    handleCloseTableContextMenu()
  }

  const deleteRow = () => {
    if (!selectedCell || !selectedTable) return

    const row = selectedCell.closest('tr')
    if (selectedTable.querySelectorAll('tr').length > 1) {
      row.remove()
      handleContentChange()
    }
    handleCloseTableContextMenu()
  }

  const deleteColumn = () => {
    if (!selectedCell || !selectedTable) return

    const cellIndex = Array.from(selectedCell.parentNode.children).indexOf(selectedCell)
    const rows = selectedTable.querySelectorAll('tr')

    // Check if table has more than one column
    if (rows[0] && rows[0].children.length > 1) {
      rows.forEach(row => {
        if (row.children[cellIndex]) {
          row.children[cellIndex].remove()
        }
      })
      handleContentChange()
    }
    handleCloseTableContextMenu()
  }

  const deleteTable = () => {
    if (!selectedTable) return

    selectedTable.remove()
    handleContentChange()
    handleCloseTableContextMenu()
  }

  // Font family application
  const applyFontFamily = fontFamily => {
    if (typeof document !== 'undefined') {
      document.execCommand('styleWithCSS', false, true)
      document.execCommand('fontName', false, fontFamily)

      if (editorRef.current) {
        setContent(editorRef.current.innerHTML)
        editorRef.current.focus()
      }
    }
    setShowFontFamilies(false)
  }

  // Text alignment functions
  const alignText = alignment => {
    if (typeof document !== 'undefined') {
      document.execCommand('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1), false, null)

      if (editorRef.current) {
        setContent(editorRef.current.innerHTML)
        editorRef.current.focus()
      }
    }
  }

  // Extract images from HTML content
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

  // Add controls to images in the editor
  const addControlsToImages = () => {
    if (typeof window === 'undefined' || !editorRef.current) return

    const images = editorRef.current.querySelectorAll('img')
    images.forEach(img => {
      if (img.parentElement && img.parentElement.classList.contains('image-container')) return

      const container = document.createElement('div')
      container.className = 'image-container'
      container.style.position = 'relative'
      container.style.display = 'inline-block'
      container.style.margin = '8px 0'

      if (img.parentNode) {
        img.parentNode.insertBefore(container, img)
        container.appendChild(img)

        const previewBtn = document.createElement('button')
        previewBtn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>'
        previewBtn.style.position = 'absolute'
        previewBtn.style.top = '5px'
        previewBtn.style.left = '5px'
        previewBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
        previewBtn.style.border = 'none'
        previewBtn.style.borderRadius = '50%'
        previewBtn.style.padding = '5px'
        previewBtn.style.cursor = 'pointer'
        previewBtn.style.zIndex = '1'
        previewBtn.style.display = 'none'
        previewBtn.onclick = e => {
          e.preventDefault()
          e.stopPropagation()
          handleOpenPreview(img.src)
        }

        const deleteBtn = document.createElement('button')
        deleteBtn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>'
        deleteBtn.style.position = 'absolute'
        deleteBtn.style.top = '5px'
        deleteBtn.style.right = '5px'
        deleteBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
        deleteBtn.style.border = 'none'
        deleteBtn.style.borderRadius = '50%'
        deleteBtn.style.padding = '5px'
        deleteBtn.style.cursor = 'pointer'
        deleteBtn.style.zIndex = '1'
        deleteBtn.style.display = 'none'
        deleteBtn.onclick = e => {
          e.preventDefault()
          e.stopPropagation()
          handleDeleteImage(container)
        }

        container.onmouseenter = () => {
          previewBtn.style.display = 'block'
          deleteBtn.style.display = 'block'
        }

        container.onmouseleave = () => {
          previewBtn.style.display = 'none'
          deleteBtn.style.display = 'none'
        }

        container.appendChild(previewBtn)
        container.appendChild(deleteBtn)
      }
    })
  }

  // Monitor for new content and add event listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && editorRef.current && (isAddingNote || isEditing)) {
      // Initial setup
      addControlsToImages()
      addTableEventListeners()

      const observer = new MutationObserver(mutations => {
        let shouldUpdateListeners = false

        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            // Check if tables or images were added
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'TABLE' || (node.querySelector && node.querySelector('table'))) {
                  shouldUpdateListeners = true
                }
                if (node.tagName === 'IMG' || (node.querySelector && node.querySelector('img'))) {
                  shouldUpdateListeners = true
                }
              }
            })
          }
        })

        if (shouldUpdateListeners) {
          // Debounce the listener updates
          setTimeout(() => {
            addControlsToImages()
            addTableEventListeners()
          }, 100)
        }
      })

      observer.observe(editorRef.current, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      })

      return () => observer.disconnect()
    }
  }, [isAddingNote, isEditing])

  // Other existing functions (keeping all existing functionality)
  const fetchEmployees = async () => {
    setIsLoadingEmployees(true)
    try {
      const employeesData = await api.getAllEmployees()
      setEmployees(employeesData)
      setFilteredEmployees(employeesData)
    } catch (error) {
      console.error('Error fetching employees:', error)
      showSnackbar('Failed to load employees', 'error')
    } finally {
      setIsLoadingEmployees(false)
    }
  }

  const fetchSharedEmployees = async notesId => {
    setIsLoadingSharedEmployees(true)
    try {
      const sharedData = await api.getNotesSharedEmployees(notesId)
      setSharedEmployees(sharedData)
      return sharedData
    } catch (error) {
      console.error('Error fetching shared employees:', error)
      showSnackbar('Failed to load shared employees', 'error')
      return []
    } finally {
      setIsLoadingSharedEmployees(false)
    }
  }

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
    setFilteredEmployees(prev => prev.filter(emp => emp._id !== employee._id))
  }

  const handleAccessChange = (employeeId, access) => {
    setSelectedEmployees(prev => prev.map(emp => (emp.employeeId === employeeId ? { ...emp, access } : emp)))
  }

  const handleSharedAccessChange = (employeeUniqueId, access) => {
    setSharedEmployees(prev =>
      prev.map(emp => (emp.employeUniqueId === employeeUniqueId ? { ...emp, access, modified: true } : emp))
    )
  }

  const handleRemoveSelectedEmployee = employeeId => {
    setSelectedEmployees(prev => prev.filter(emp => emp.employeeId !== employeeId))
  }

  const handleRemoveSharedEmployee = employeeUniqueId => {
    setSharedEmployees(prev => prev.filter(emp => emp.employeUniqueId !== employeeUniqueId))
  }

  const handleShareNote = async () => {
    setIsSharingNote(true)
    try {
      const allSharedEmployees = [
        ...sharedEmployees.map(emp => ({
          employeeId: emp.employeeId || emp._id,
          access: emp.access
        })),
        ...selectedEmployees.map(emp => ({
          employeeId: emp.employeeId,
          access: emp.access
        }))
      ]

      const response = await api.shareNotes(note._id, allSharedEmployees)
      if (response.status) {
        let message = `Note sharing updated successfully!`
        if (selectedEmployees.length > 0) {
          message += ` Added ${selectedEmployees.length} new employee(s).`
        }
        if (sharedEmployees.some(emp => emp.modified)) {
          message += ` Updated access levels.`
        }

        showSnackbar(message)
        handleCloseShareDialog()
      } else {
        showSnackbar(response.message || 'Failed to update note sharing', 'error')
      }
    } catch (error) {
      console.error('Error updating note sharing:', error)
      showSnackbar('Failed to update note sharing', 'error')
    } finally {
      setIsSharingNote(false)
    }
  }

  const handleOpenShareDialog = () => {
    if (!note || !note._id) {
      showSnackbar('Note must be saved before sharing', 'error')
      return
    }

    setShowShareDialog(true)
    setShowEmployeeList(false)
    fetchEmployees()

    const loadSharedEmployees = async () => {
      const sharedData = await fetchSharedEmployees(note._id)
    }
    loadSharedEmployees()
  }

  const handleCloseShareDialog = () => {
    setShowShareDialog(false)
    setSelectedEmployees([])
    setSharedEmployees([])
    setEmployeeSearchTerm('')
    setFilteredEmployees([])
    setEmployees([])
    setShowEmployeeList(false)
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const handleAutoSave = async () => {
    try {
      const editorContent = editorRef.current ? editorRef.current.innerHTML : content
      const cleanContent = cleanupEditorContent(editorContent)
      const formattedContent = formatHTML(cleanContent)

      let reminderDate = null
      let reminderTime = null

      // Only set reminder values if reminderDateTime exists and is not manually cleared
      if (reminderDateTime && !reminderCleared) {
        reminderDate = reminderDateTime.format('YYYY-MM-DD')
        reminderTime = reminderDateTime.format('h:mm A')
      }

      if (isEditing && note) {
        const response = await api.updateNote(
          note._id,
          title.trim(),
          formattedContent,
          selectedColor,
          reminderDate,
          reminderTime
        )

        if (response.status) {
          setHasUnsavedChanges(false)
          setLastSaved(new Date())
        }
      } else {
        let noteData = {
          title: title.trim(),
          content: formattedContent,
          bgColor: selectedColor
        }

        // Only include reminder data if it exists and is not cleared
        if (reminderDate && reminderTime) {
          noteData.reminderDate = reminderDate
          noteData.reminderTime = reminderTime
        }

        if (type === 'board' && subBoardId) {
          noteData.type = 'board'
          noteData.subBoardId = subBoardId
        } else if (type === 'board' && boardId) {
          noteData.type = 'board'
          noteData.boardId = boardId
        } else {
          noteData.type = 'notes'
        }

        const response = await api.addNote(noteData)

        if (response && response.status) {
          note = response.items
          setHasUnsavedChanges(false)
          setLastSaved(new Date())

          if (onNoteAdded && typeof onNoteAdded === 'function') {
            if (subBoardId) {
              onNoteAdded(response.items, subBoardId)
            } else {
              onNoteAdded(response.items)
            }
          }
        }
      }
    } catch (error) {
      console.error('Auto-save error:', error)
    }
  }

  const handleManualSave = async () => {
    try {
      const editorContent = editorRef.current ? editorRef.current.innerHTML : content
      const cleanContent = cleanupEditorContent(editorContent)
      const formattedContent = formatHTML(cleanContent)

      let reminderDate = null
      let reminderTime = null

      // Only set reminder values if reminderDateTime exists and is not manually cleared
      if (reminderDateTime && !reminderCleared) {
        reminderDate = reminderDateTime.format('YYYY-MM-DD')
        reminderTime = reminderDateTime.format('h:mm A')
      }

      if (isEditing && note) {
        const response = await api.updateNote(
          note._id,
          title.trim(),
          formattedContent,
          selectedColor,
          reminderDate,
          reminderTime
        )

        if (response.status) {
          setHasUnsavedChanges(false)
          setLastSaved(new Date())
          showSnackbar('Note saved successfully')
        }
      } else {
        let noteData = {
          title: title.trim(),
          content: formattedContent,
          bgColor: selectedColor
        }

        // Only include reminder data if it exists and is not cleared
        if (reminderDate && reminderTime) {
          noteData.reminderDate = reminderDate
          noteData.reminderTime = reminderTime
        }

        if (type === 'board' && subBoardId) {
          noteData.type = 'board'
          noteData.subBoardId = subBoardId
        } else if (type === 'board' && boardId) {
          noteData.type = 'board'
          noteData.boardId = boardId
        } else {
          noteData.type = 'notes'
        }

        const response = await api.addNote(noteData)

        if (response && response.status) {
          note = response.items
          setHasUnsavedChanges(false)
          setLastSaved(new Date())
          showSnackbar('Note saved successfully')

          if (onNoteAdded && typeof onNoteAdded === 'function') {
            if (subBoardId) {
              onNoteAdded(response.items, subBoardId)
            } else {
              onNoteAdded(response.items)
            }
          }
        }
      }
    } catch (error) {
      console.error('Manual save error:', error)
      showSnackbar('Failed to save note', 'error')
    }
  }

  const handleDeleteImage = imageElement => {
    if (editorRef.current && imageElement) {
      imageElement.remove()
      setContent(editorRef.current.innerHTML)

      const updatedImages = extractImages(editorRef.current.innerHTML)
      setImages(updatedImages)
    }
  }

  const handleOpenPreview = imageUrl => {
    setPreviewImage(imageUrl)
    setPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setPreviewOpen(false)
    setPreviewImage('')
  }

  const formatText = (command, value = null) => {
    if (typeof document !== 'undefined') {
      document.execCommand(command, false, value)

      if (editorRef.current) {
        setContent(editorRef.current.innerHTML)
        editorRef.current.focus()
      }
    }
  }

  const handleImageUpload = async e => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    setImageUploading(true)

    try {
      const response = await api.uploadImage(file)

      if (response.status) {
        const imageUrl = response.items.image
        const imageHtml = `<img src="${imageUrl}" alt="Uploaded Image" style="max-width: 200px; height: auto;" />`

        if (editorRef.current) {
          if (typeof window !== 'undefined') {
            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0)
              const imgElement = document.createElement('div')
              imgElement.innerHTML = imageHtml
              range.insertNode(imgElement.firstChild)
            } else {
              editorRef.current.innerHTML += imageHtml
            }
          } else {
            editorRef.current.innerHTML += imageHtml
          }

          setContent(editorRef.current.innerHTML)
          addControlsToImages()

          const updatedImages = extractImages(editorRef.current.innerHTML)
          setImages(updatedImages)
        }
      } else {
        console.error('Image upload failed:', response.message)
        showSnackbar('Failed to upload image', 'error')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      showSnackbar('Failed to upload image', 'error')
    } finally {
      setImageUploading(false)
    }
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setContent(newContent)

      if (typeof window !== 'undefined') {
        const updatedImages = extractImages(newContent)
        setImages(updatedImages)
      }

      // Mark as having unsaved changes
      setHasUnsavedChanges(true)

      // Ensure table event listeners are active
      setTimeout(() => {
        addTableEventListeners()
      }, 50)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && editorRef.current && (isAddingNote || isEditing)) {
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus()
          const range = document.createRange()
          const selection = window.getSelection()
          if (selection) {
            range.selectNodeContents(editorRef.current)
            range.collapse(false)
            selection.removeAllRanges()
            selection.addRange(range)
          }
        }
      }, 100)
    }
  }, [isAddingNote, isEditing])

  const handleAddNote = async () => {
    console.log('handleAddNote called')
    setIsLoading(true)
    try {
      const editorContent = editorRef.current ? editorRef.current.innerHTML : content
      const cleanContent = cleanupEditorContent(editorContent)
      const formattedContent = formatHTML(cleanContent)

      let noteData = {
        title: title.trim(),
        content: formattedContent,
        bgColor: selectedColor
      }

      // Only include reminder data if it exists and is not cleared
      if (reminderDateTime && !reminderCleared) {
        noteData.reminderDate = reminderDateTime.format('YYYY-MM-DD')
        noteData.reminderTime = reminderDateTime.format('h:mm A')
      }

      if (type === 'board' && subBoardId) {
        noteData.type = 'board'
        noteData.subBoardId = subBoardId
      } else if (type === 'board' && boardId) {
        noteData.type = 'board'
        noteData.boardId = boardId
      } else {
        noteData.type = 'notes'
      }

      const response = await api.addNote(noteData)

      if (response && response.status) {
        if (onNoteAdded && typeof onNoteAdded === 'function') {
          if (subBoardId) {
            onNoteAdded(response.items, subBoardId)
          } else {
            onNoteAdded(response.items)
          }
        }

        resetForm()

        if (forceOpen && onCloseEdit) {
          onCloseEdit()
        } else {
          setIsAddingNote(false)
        }

        showSnackbar('Note added successfully')
      } else {
        showSnackbar(response?.message || 'Failed to add note', 'error')
      }
    } catch (error) {
      console.error('Error adding note:', error)
      showSnackbar(`Failed to add note: ${error.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateNote = async () => {
    setIsLoading(true)
    try {
      const editorContent = editorRef.current ? editorRef.current.innerHTML : content
      const cleanContent = cleanupEditorContent(editorContent)
      const formattedContent = formatHTML(cleanContent)

      let reminderDate = null
      let reminderTime = null

      // Only set reminder values if reminderDateTime exists and is not manually cleared
      if (reminderDateTime && !reminderCleared) {
        reminderDate = reminderDateTime.format('YYYY-MM-DD')
        reminderTime = reminderDateTime.format('h:mm A')
      }

      const response = await api.updateNote(
        note._id,
        title,
        formattedContent,
        selectedColor,
        reminderDate,
        reminderTime
      )

      if (response.status) {
        if (onNoteEdited && typeof onNoteEdited === 'function') {
          onNoteEdited(
            response.items || {
              ...note,
              title,
              content: formattedContent,
              bgColor: selectedColor,
              reminderDate,
              reminderTime
            }
          )
        }

        resetForm()
        if (onCloseEdit) onCloseEdit()
        showSnackbar('Note updated successfully')
      } else {
        showSnackbar(response.message || 'Failed to update note', 'error')
      }
    } catch (error) {
      console.error('Error updating note:', error)
      showSnackbar('Failed to update note', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!note) return

    setIsLoading(true)
    try {
      const response = await api.deleteNote(note._id)

      if (response.status) {
        if (onNoteDeleted && typeof onNoteDeleted === 'function') {
          onNoteDeleted(note._id)
        }

        resetForm()
        setDeleteConfirmOpen(false)
        if (onCloseEdit) onCloseEdit()
        showSnackbar('Note deleted successfully')
      } else {
        showSnackbar(response.message || 'Failed to delete note', 'error')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      showSnackbar('Failed to delete note', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setSelectedColor(getRandomColor())
    setImages([])
    setShowTextColors(false)
    setShowFontSizes(false)
    setShowFontFamilies(false)
    setEditorFocused(false)
    setToolbarExpanded(false)
    setReminderDateTime(null)
    setReminderError('')
    setReminderCleared(false) // Reset the cleared flag
    setReminderConfirmed(false) // Reset the confirmed flag
    setSelectedEmployees([])
    setHasUnsavedChanges(false)
    setLastSaved(null)

    if (editorRef.current) {
      editorRef.current.innerHTML = ''
    }

    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current)
    }
  }

  const cleanupEditorContent = htmlContent => {
    if (typeof window === 'undefined') return htmlContent

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent

    // Remove image containers and extract images
    const containers = tempDiv.querySelectorAll('.image-container')
    containers.forEach(container => {
      const img = container.querySelector('img')
      if (img && container.parentNode) {
        container.parentNode.insertBefore(img, container)
        container.parentNode.removeChild(container)
      }
    })

    // Remove all buttons (including table options buttons)
    const buttons = tempDiv.querySelectorAll('button')
    buttons.forEach(button => {
      if (button.parentNode) {
        button.parentNode.removeChild(button)
      }
    })

    // Remove table options buttons specifically
    const tableOptionsButtons = tempDiv.querySelectorAll('.table-options-btn')
    tableOptionsButtons.forEach(btn => {
      if (btn.parentNode) {
        btn.parentNode.removeChild(btn)
      }
    })

    return tempDiv.innerHTML
  }

 const handleClose = async () => {
  try {
    // Auto-save before closing if there's content and user can edit
    if (canEdit && (title.trim() || content.trim())) {
      await handleAutoSave()
    }

    // Call the noteClosed callback safely
    if (noteClosed && typeof noteClosed === 'function') {
      noteClosed()
    }
  } catch (error) {
    console.error('Error saving note on close:', error)
    // Continue with closing even if save fails
  }

  // Continue with existing close logic
  if (forceOpen && onCloseEdit) {
    onCloseEdit()
  } else if (isEditing) {
    if (onCloseEdit) onCloseEdit()
  } else {
    setIsAddingNote(false)
  }
  resetForm()
}

  const toggleToolbar = () => {
    setToolbarExpanded(!toolbarExpanded)
  }

  const formatHTML = html => {
    return html
  }

  const defaultButtonStyle = {
    borderRadius: '50%',
    width: 64,
    height: 64,
    minWidth: 'auto',
    boxShadow: 3
  }

  const defaultButtonPosition = {
    position: 'fixed',
    bottom: 30,
    right: 30,
    zIndex: 1000
  }

  const applyTextColor = color => {
    if (typeof document !== 'undefined') {
      const selection = document.getSelection()

      if (selection && selection.rangeCount > 0) {
        document.execCommand('styleWithCSS', false, true)
        document.execCommand('foreColor', false, color)

        if (editorRef.current) {
          setContent(editorRef.current.innerHTML)
          editorRef.current.focus()
        }
      }
    }

    setShowTextColors(false)
  }

  const isSaveDisabled = !title.trim() || (!content.trim() && images.length === 0) || isLoading || !canEdit

  return (
    <>
      {/* Floating Add Button - only shown when not in edit mode */}
      {!isEditing && (
        <Box sx={buttonPosition || defaultButtonPosition}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
  setSelectedColor(getRandomColor());
  setIsAddingNote(true);
}}
            sx={buttonStyle || defaultButtonStyle}
          >
            <AddIcon fontSize='large' />
          </Button>
        </Box>
      )}

      {/* Add/Edit Note Dialog */}
      <Dialog
        open={isAddingNote || isEditing || forceOpen}
        onClose={handleClose}
        maxWidth='md'
        fullWidth
        scroll='paper'
        PaperProps={{
          sx: {
            background: selectedColor,
            maxHeight: pageHeight,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box style={{ position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            style={{
              position: 'absolute',
              position: 'absolute',
              right: '4px',
              zIndex: '9999',
              top: '-1px',
              fontSize: '14px'
            }}
          >
            <IoMdClose />
          </IconButton>
        </Box>
        <DialogTitle sx={{ position: 'sticky', top: 0, zIndex: 10, background: selectedColor, pb: 0 }}>
          {/* Auto-save status */}
          {(isAddingNote || isEditing) && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                {hasUnsavedChanges
                  ? 'Unsaved changes'
                  : lastSaved
                  ? `Last saved: ${lastSaved.toLocaleTimeString()}`
                  : ''}
              </Typography>
              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                Press Ctrl+S to save
              </Typography>
            </Box>
          )}

          {canEdit && (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
  value={tempReminderDateTime || reminderDateTime}
  onChange={setTempReminderDateTime}
  onAccept={handleReminderAccept}
  open={reminderPickerOpen}
  onClose={handleReminderPickerClose}
  minDateTime={dayjs()}
  disablePast={false}
  minutesStep={5}
  shouldDisableTime={(timeValue, clockType) => {
    if (!tempReminderDateTime && !reminderDateTime) return false

    const now = dayjs()
    const selectedDate = dayjs(tempReminderDateTime || reminderDateTime)

    // If it's today, disable past times
    if (selectedDate.isSame(now, 'day')) {
      if (clockType === 'hours') {
        return timeValue < now.hour()
      }
      if (clockType === 'minutes') {
        return selectedDate.hour() === now.hour() && timeValue <= now.minute()
      }
    }

    return false
  }}
  slotProps={{
    textField: {
      sx: { display: 'none' }
    }
  }}
  sx={{
    '& .MuiPickersPopper-root': {
      position: 'fixed !important',
      top: '50% !important',
      left: '50% !important',
      transform: 'translate(-50%, -50%) !important',
      zIndex: 1300
    }
  }}
/>
              </LocalizationProvider>
            </>
          )}

          {/* View-only access warning */}
          {!canEdit && sharedByInfo && (
            <Alert severity='warning' sx={{ mb: 2 }}>
              <Box>
                <Typography variant='body2'>You don't have permission to edit this note.</Typography>
                <Typography variant='caption'>
                  Get permission from {sharedByInfo.employeName} ({sharedByInfo.workEmail})
                </Typography>
              </Box>
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            variant='standard'
            placeholder='Title'
            InputProps={{
              disableUnderline: true,
              readOnly: !canEdit
            }}
            sx={{
              '& input': {
                fontSize: '1.5rem',
                fontWeight: 'bold',
                padding: '8px 0'
              }
            }}
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 1
            }}
          >
            <IconButton onClick={toggleToolbar} size='small' sx={{ borderRadius: '4px', p: 0 }}>
              {toolbarExpanded ? <KeyboardArrowUpIcon fontSize='small' /> : <KeyboardArrowDownIcon fontSize='small' />}
            </IconButton>
          </Box>

          {/* Enhanced Toolbar with new features */}
          <Collapse in={toolbarExpanded && canEdit}>
            <Box
              ref={toolbarRef}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                py: 1,
                width: '90%',
                marginLeft: 'auto',
                marginRight: 'auto',
                justifyContent: 'space-around',
                background: selectedColor,
                zIndex: 5
              }}
            >
              {/* Font Family Dropdown */}
              <Box sx={{ position: 'relative' }}>
                <Tooltip title='Font Family'>
                  <IconButton size='small' onClick={() => setShowFontFamilies(!showFontFamilies)}>
                    <Typography fontSize='small' fontWeight='bold'>
                      Aa
                    </Typography>
                  </IconButton>
                </Tooltip>

                {showFontFamilies && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      zIndex: 1000,
                      bgcolor: 'background.paper',
                      boxShadow: 3,
                      borderRadius: 1,
                      p: 1,
                      minWidth: 180,
                      maxHeight: 200,
                      overflow: 'auto'
                    }}
                  >
                    {fontFamilies.map(font => (
                      <Button
                        key={font.value}
                        fullWidth
                        size='small'
                        sx={{
                          justifyContent: 'flex-start',
                          mb: 0.5,
                          fontFamily: font.value
                        }}
                        onClick={() => applyFontFamily(font.value)}
                      >
                        {font.label}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>

              <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

              {/* Text Formatting */}
              <Tooltip title='Bold'>
                <IconButton size='small' onClick={() => formatText('bold')}>
                  <FormatBoldIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Italic'>
                <IconButton size='small' onClick={() => formatText('italic')}>
                  <FormatItalicIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Underline'>
                <IconButton size='small' onClick={() => formatText('underline')}>
                  <FormatUnderlinedIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

              {/* Text Alignment */}
              <Tooltip title='Align Left'>
                <IconButton size='small' onClick={() => alignText('left')}>
                  <FormatAlignLeftIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Align Center'>
                <IconButton size='small' onClick={() => alignText('center')}>
                  <FormatAlignCenterIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Align Right'>
                <IconButton size='small' onClick={() => alignText('right')}>
                  <FormatAlignRightIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Justify'>
                <IconButton size='small' onClick={() => alignText('full')}>
                  <FormatAlignJustifyIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

              {/* Font Size */}
              <Box sx={{ position: 'relative' }}>
                <Tooltip title='Font Size'>
                  <IconButton size='small' onClick={() => setShowFontSizes(!showFontSizes)}>
                    <FormatSizeIcon fontSize='small' />
                  </IconButton>
                </Tooltip>

                {showFontSizes && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      zIndex: 1000,
                      bgcolor: 'background.paper',
                      boxShadow: 3,
                      borderRadius: 1,
                      p: 1,
                      minWidth: 120
                    }}
                  >
                    {fontSizes.map(size => (
                      <Button
                        key={size.value}
                        fullWidth
                        size='small'
                        sx={{ justifyContent: 'flex-start', mb: 0.5 }}
                        onClick={() => {
                          formatText('fontSize', size.value)
                          setShowFontSizes(false)
                        }}
                      >
                        {size.label}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>

              <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

              {/* Lists */}
              <Tooltip title='Bullet List'>
                <IconButton size='small' onClick={() => formatText('insertUnorderedList')}>
                  <FormatListBulletedIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Numbered List'>
                <IconButton size='small' onClick={() => formatText('insertOrderedList')}>
                  <FormatListNumberedIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

              {/* Enhanced Table Button with Size Selector */}
              <Tooltip title='Insert Table'>
                <IconButton size='small' onClick={handleTableButtonClick}>
                  <TableChartIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

              {/* Undo/Redo */}
              <Tooltip title='Undo'>
                <IconButton size='small' onClick={() => formatText('undo')}>
                  <UndoIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Redo'>
                <IconButton size='small' onClick={() => formatText('redo')}>
                  <RedoIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

              {/* Image Upload */}
              <Button
                component='label'
                variant='outlined'
                size='small'
                sx={{ textTransform: 'none', height: 32 }}
                disabled={imageUploading}
              >
                {imageUploading ? 'Uploading...' : <FaImage />}
                <input type='file' accept='image/*' hidden onChange={handleImageUpload} disabled={imageUploading} />
              </Button>
            </Box>
          </Collapse>
        </DialogTitle>

        <DialogContent sx={{ pb: 0 }}>
          <Box
            ref={editorRef}
            contentEditable={canEdit}
            suppressContentEditableWarning
            sx={{
              minHeight: '300px',
              p: 2,
              borderRadius: 1,
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: '1rem',
              lineHeight: 1.5,
              mb: 2,
              overflowY: 'auto',
              backgroundColor: !canEdit ? 'rgba(0,0,0,0.1)' : 'transparent',
              cursor: !canEdit ? 'not-allowed' : 'text',
              '&:focus': {
                borderColor: canEdit ? 'primary.main' : 'transparent'
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                margin: '8px 0'
              },
              '& .image-container': {
                position: 'relative',
                display: 'inline-block',
                margin: '8px 0'
              },
              '& ul, & ol': {
                paddingLeft: '1.5em',
                margin: '0.5em 0'
              },
              '& table': {
                borderCollapse: 'collapse',
                width: '100%',
                margin: '10px 0'
              },
              '& td, & th': {
                border: '1px solid #ddd',
                padding: '8px',
                minWidth: '80px',
                minHeight: '30px'
              }
            }}
            onInput={
              canEdit
                ? e => {
                    handleContentChange()
                    // Trigger a custom event to ensure table listeners are added
                    setTimeout(() => {
                      addControlsToImages()
                      addTableEventListeners()
                    }, 100)
                  }
                : undefined
            }
            onBlur={() => {
              if (canEdit) {
                handleContentChange()
                setEditorFocused(false)
              }
            }}
            onFocus={() => {
              if (canEdit) {
                setEditorFocused(true)
                if (!toolbarExpanded) {
                  setToolbarExpanded(true)
                }
              }
            }}
            onClick={() => {
              if (canEdit && !toolbarExpanded) {
                setToolbarExpanded(true)
              }
            }}
            placeholder={canEdit ? 'Start typing...' : ''}
          />

          {canEdit && !editorFocused && !toolbarExpanded && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: 0.7,
                pointerEvents: 'none'
              }}
            >
              <Typography variant='body2' sx={{ mt: 1 }}>
                Click to start writing...
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2, flexDirection: 'column' }}>
          {/* Top row - Delete, Reminder, Share, Color Picker */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isEditing && canEdit && (
                <Tooltip title='Delete Note'>
                  <IconButton color='error' onClick={() => setDeleteConfirmOpen(true)} disabled={isLoading}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}

              {canEdit && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Tooltip title={hasReminder ? 'Reminder Options' : 'Set Reminder'}>
                    <IconButton
                      ref={reminderButtonRef}
                      onClick={handleReminderButtonClick}
                      disabled={isLoading}
                      sx={{
                        color: hasReminder ? 'primary.main' : 'inherit'
                      }}
                    >
                      <AccessTimeIcon />
                    </IconButton>
                  </Tooltip>

                  {!reminderCleared &&
                    (reminderDateTime || note?.reminderAt || (note?.reminderDate && note?.reminderTime)) && (
                      <Typography
                        variant='caption'
                        sx={{
                          fontSize: '10px',
                          textAlign: 'center',
                          color: 'text.secondary',
                          mt: 0.5
                        }}
                      >
                        {reminderDateTime
                          ? reminderDateTime.format('MMM DD, h:mm A')
                          : note?.reminderAt
                          ? new Date(note.reminderAt).toLocaleString()
                          : note?.reminderDate && note?.reminderTime
                          ? `${dayjs(note.reminderDate + ' ' + note.reminderTime, 'YYYY-MM-DD h:mm A').format(
                              'MMM DD, h:mm A'
                            )}`
                          : ''}
                      </Typography>
                    )}

                  {reminderError && (
                    <Typography
                      variant='caption'
                      sx={{
                        fontSize: '10px',
                        textAlign: 'center',
                        color: 'error.main',
                        mt: 0.5
                      }}
                    >
                      {reminderError}
                    </Typography>
                  )}
                </Box>
              )}

              {isEditing && (
                <Tooltip title='Share Note'>
                  <IconButton onClick={handleOpenShareDialog} disabled={isLoading}>
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title='Change Color'>
                <IconButton onClick={() => setShowColorPicker(true)} disabled={!canEdit}>
                  <PaletteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Cancel and Save buttons */}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%', marginTop: '-40px' }}>
            {' '}
            {/* <Button onClick={handleClose}>Cancel</Button> */}
            {canEdit && (
              <Button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()

                  if (isEditing) {
                    handleUpdateNote()
                  } else {
                    handleAddNote()
                  }
                }}
                variant='contained'
                style={{display:'none'}}
                disabled={isSaveDisabled}
              >
                {isLoading ? <CircularProgress size={24} /> : isEditing ? 'Save' : 'Save'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Enhanced Table Size Selector */}
      <TableSizeSelector
        anchorEl={tableSelectorAnchor}
        open={tableSelectorOpen}
        onClose={() => {
          setTableSelectorOpen(false)
          setTableSelectorAnchor(null)
        }}
        onSelectSize={handleTableSizeSelect}
      />

      {/* Reminder Options Popup */}
      <ReminderOptionsPopup
        anchorEl={reminderOptionsAnchor}
        open={reminderOptionsOpen}
        onClose={() => {
          setReminderOptionsOpen(false)
          setReminderOptionsAnchor(null)
        }}
        onClearReminder={handleClearReminder}
        onResetReminder={handleResetReminder}
      />

      {/* Table Context Menu */}
      <Menu
        open={tableContextMenu !== null}
        onClose={handleCloseTableContextMenu}
        anchorReference='anchorPosition'
        anchorPosition={
          tableContextMenu !== null ? { top: tableContextMenu.mouseY, left: tableContextMenu.mouseX } : undefined
        }
      >
        <MenuItem onClick={insertRowAbove}>Insert Row Above</MenuItem>
        <MenuItem onClick={insertRowBelow}>Insert Row Below</MenuItem>
        <MenuItem onClick={insertColumnLeft}>Insert Column Left</MenuItem>
        <MenuItem onClick={insertColumnRight}>Insert Column Right</MenuItem>
        <Divider />
        <MenuItem onClick={deleteRow}>Delete Row</MenuItem>
        <MenuItem onClick={deleteColumn}>Delete Column</MenuItem>
        <MenuItem onClick={deleteTable} sx={{ color: 'error.main' }}>
          Delete Table
        </MenuItem>
      </Menu>

      {/* Enhanced Color Picker Dialog */}
      <Dialog open={showColorPicker} onClose={() => setShowColorPicker(false)} maxWidth='sm' fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>{/* Color picker mode controls */}</Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {colorPickerMode === 'Colors' && (
            <Box>
              {/* Recently used colors */}
              <Typography variant='subtitle2' sx={{ mb: 1, color: 'text.secondary' }}>
                Recently used
              </Typography>
              <Box
                sx={{ display: 'flex', gap: 1, mb: 3, pb: 3, flexWrap: 'wrap', borderBottom: '1px solid #00000029' }}
              >
                {recentlyUsedColors.map((color, index) => (
                  <Box
                    key={`recent-${index}`}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: color,
                      cursor: 'pointer',
                      border: selectedColor === color ? '3px solid #1976d2' : '1px solid #ddd',
                      boxShadow: 1
                    }}
                    onClick={() => {
                      setSelectedColor(color)
                      setShowColorPicker(false)
                    }}
                  />
                ))}
              </Box>

              {/* All colors */}
              <Typography>All Color</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1 }}>
                {colorOptions.map((color, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: color,
                      cursor: 'pointer',
                      border: selectedColor === color ? '3px solid #1976d2' : '1px solid #ddd',
                      boxShadow: 1,
                      '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s'
                      }
                    }}
                    onClick={() => {
                      setSelectedColor(color)
                      setShowColorPicker(false)
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowColorPicker(false)} sx={{ ml: 'auto' }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Google Sheets-like Share Dialog - keeping existing implementation */}
      <Dialog
        open={showShareDialog}
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
            Share "{title || 'Untitled Note'}"
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
                      bgcolor: employee.modified ? '#fff3cd' : 'transparent',
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
                      <Typography variant='caption' color='text.secondary' style={{ display: 'flex' }}>
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
                      No one has access to this note yet.
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Use the search box above to add people and share this note.
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
            {(selectedEmployees.length > 0 || sharedEmployees.some(emp => emp.modified)) && (
              <Typography variant='caption' color='text.secondary'>
                {selectedEmployees.length > 0 && `+${selectedEmployees.length} new`}
                {selectedEmployees.length > 0 && sharedEmployees.some(emp => emp.modified) && ', '}
                {sharedEmployees.some(emp => emp.modified) && 'access updated'}
              </Typography>
            )}
            <Button
              onClick={handleShareNote}
              variant='contained'
              disabled={isSharingNote || (selectedEmployees.length === 0 && !sharedEmployees.some(emp => emp.modified))}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {isSharingNote ? <CircularProgress size={20} color='inherit' /> : 'Save Changes'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

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

      {/* Image Preview Modal */}
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={previewOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: 24,
              p: 1,
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 2,
              outline: 'none'
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <IconButton
                onClick={handleClosePreview}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
              {previewImage && (
                <img
                  src={previewImage}
                  alt='Preview'
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    margin: '0 auto',
                    borderRadius: '4px'
                  }}
                />
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>

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
    </>
  )
}

export default AddNoteButton
