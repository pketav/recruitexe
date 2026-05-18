'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Skeleton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
   CircularProgress
} from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'

import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  Image as ImageIcon,
  TableChart as TableChartIcon,
  Folder as FolderIcon,
  Description as DocumentIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material'
import DescriptionIcon from '@mui/icons-material/Description'
import ArticleIcon from '@mui/icons-material/Article'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import MovieIcon from '@mui/icons-material/Movie' // for video
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'


import axios from 'axios'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
    background: {
      default: '#f8f9fa'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)'
        }
      }
    }
  }
})

const FolderCard = styled(Card)(() => ({
  borderRadius: 12,
  padding: '16px',
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  cursor: 'pointer',
  backgroundColor: '#5A607F0F',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
  }
}))

function Folders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [folderData, setFolderData] = useState({ folders: [], files: [] })
  const [parentHistory, setParentHistory] = useState([])
  const [currentParentId, setCurrentParentId] = useState('')
  const [folderPath, setFolderPath] = useState([]) // array of { _id, name }

  const bgColors = ['#21C4FA33', '#85E62340', '#FFCC6840', '#FF705826']
  const fileInputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const clickTimeout = useRef(null)

  const [createFolderName, setCreateFolderName] = useState('')
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  //   const [isFolderLoading, setIsFolderLoading] = useState(false)

  // To open modal
  const openFolderModal = () => setIsFolderModalOpen(true)
  // To close modal
  const closeFolderModal = () => {
    setIsFolderModalOpen(false)
    setCreateFolderName('')
  }

  const handleFolderClick = (folderId, folderName) => {
    setParentHistory(prev => [...prev, currentParentId])
    setFolderPath(prev => [...prev, { _id: folderId, name: folderName }])
    setCurrentParentId(folderId)
  }

  const handleBackClick = () => {
    if (parentHistory.length > 0) {
      const previousParentId = parentHistory[parentHistory.length - 1]

      setParentHistory(prev => prev.slice(0, -1))
      setFolderPath(prev => prev.slice(0, -1))
      setCurrentParentId(previousParentId)
    } else {
      setParentHistory([])
      setFolderPath([])
      setCurrentParentId('')
    }
  }
  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase()
  
    switch (extension) {
      case 'pdf':
        return <PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: 36 }} />
  
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <ImageIcon sx={{ color: '#0288d1', fontSize: 36 }} />
  
      case 'doc':
      case 'docx':
        return <ArticleIcon sx={{ color: '#1976d2', fontSize: 36 }} />
  
      case 'xls':
      case 'xlsx':
        return <TableChartIcon sx={{ color: '#388e3c', fontSize: 36 }} />
  
      case 'ppt':
      case 'pptx':
        return <img src="/ppt-icon.png" alt="ppt" style={{ width: 36, height: 36 }} />
  
      case 'txt':
        return <DescriptionIcon sx={{ color: '#757575', fontSize: 36 }} />
  
      // 🎥 Video files
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'mkv':
      case 'webm':
        return <MovieIcon sx={{ color: '#ff9800', fontSize: 36 }} />
  
      // 🔊 Audio files
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'ogg':
      case 'flac':
        return <AudiotrackIcon sx={{ color: '#9c27b0', fontSize: 36 }} />
  
      // 🗂 Fallback
      default:
        return <DescriptionIcon sx={{ color: '#616161', fontSize: 36 }} />
    }
  }
  
  


  const [queryText, setQueryText] = useState('')
  const [fileTypes, setFileTypes] = useState([]) // e.g., ['pdf', 'image']
  const [isFolderLoading, setIsFolderLoading] = useState(false)

  const handleSearch = async () => {
    try {
      setIsFolderLoading(true)
      const response = await axios.get(
        `${baseUrl}/v1/api/finalFileShare/search/advanced?query=${queryText}&parentId=${currentParentId}&fileTypes=${fileTypes}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      setFolderData(response.data.items || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsFolderLoading(false) // ✅ end loading
    }
  }

  useEffect(() => {
    if (queryText.length > 0) {
      handleSearch()
    } else {
      getAllFolders()
    }
  }, [queryText])

  const getAllFolders = async () => {
    try {
      setIsFolderLoading(true) // ⏳ start loading
      const response = await axios.get(`${baseUrl}/v1/api/finalFileShare/list-objects?parentId=${currentParentId}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      setFolderData(response.data.items || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsFolderLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllFolders()
    }, 400)

    return () => clearTimeout(timeout)
  }, [currentParentId])

  const handleFolderClickOnce = (id, name) => {
    if (clickTimeout.current) return

    clickTimeout.current = setTimeout(() => {
      clickTimeout.current = null
    }, 500)

    handleFolderClick(id, name)
  }

  const handleCreateFolder = async () => {
    if (!createFolderName.trim()) return

    try {
      setIsFolderLoading(true)
      const fullPath = currentParentId
        ? `${folderPath.map(f => f.name).join('/')}/${createFolderName}`
        : `/${createFolderName}`

      const response = await axios.post(
        `${baseUrl}/v1/api/finalFileShare/create-folder`,
        {
          path: fullPath,
          ...(currentParentId && { parentId: currentParentId })
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )

      // Optional: refresh folder list
      //   await setCurrentParentId(currentParentId)
      getAllFolders()
      closeFolderModal()
    } catch (error) {
      console.error('Create folder error:', error)
    } finally {
      setIsFolderLoading(false)
    }
  }

  const handleFileChange = async e => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setIsUploading(true)

      const fullPath = currentParentId
        ? `${folderPath.map(f => f.name).join('/')}/${createFolderName}`
        : `/${createFolderName}`

      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', fullPath)
      if (currentParentId) formData.append('parentId', currentParentId)

      await axios.post(`${baseUrl}/v1/api/finalFileShare/upload`, formData, {
        headers: {
          authorization: token
        }
      })
      getAllFolders()
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            borderRadius:2,
            alignItems: 'center',
            bgcolor: '#FFFFFF',
            p: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' fontWeight={600}>
              Folders
            </Typography>
            {/* <IconButton size='small' sx={{ ml: 1 }}>
              <KeyboardArrowDownIcon />
            </IconButton> */}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              onClick={openFolderModal}
              variant='contained'
              size='small'
              sx={{
                backgroundColor: '#1D3066',
                color: '#fff',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#162955' }
              }}
            >
              + Create Folder
            </Button>
            <input type='file' accept='*' style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />



<Button
  variant="contained"
  size="small"
  onClick={() => fileInputRef.current.click()}
  disabled={isUploading}
  sx={{
    backgroundColor: '#1D3066',
    color: '#fff',
    textTransform: 'none',
    minWidth: 140,
    position: 'relative',
    '&:hover': { backgroundColor: '#162955' }
  }}
>
  {isUploading ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={16} color="inherit" />
      Uploading...
    </Box>
  ) : (
    '+ Upload File'
  )}
</Button>

            <TextField
              placeholder='Search files...'
              size='small'
              value={queryText}
              onChange={e => setQueryText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch()
              }}
              sx={{
                width: 300,
                bgcolor: '#f4f4f4',
                '& .MuiOutlinedInput-root': { borderRadius: 1 }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Box>
        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Section */}
          <Grid item xs={12}>
            {/* Folders */}
            <Box sx={{ mb: 4 }}>
              {currentParentId && (
                <Button
                  variant='contained'
                  size='small'
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBackClick}
                  sx={{
                    backgroundColor: '#1D3066',
                    color: '#fff',
                    mb: 2,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#162955' }
                  }}
                >
                  Back

                </Button>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  label='All'
                  onClick={() => {
                    setFolderPath([])
                    setCurrentParentId('')
                  }}
                  variant='contained'
                  color='#E6F7FF'
                />

                {folderPath.map((folder, index) => (
                  <Box key={folder._id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant='body2'>/</Typography>
                    <Chip
                      label={folder.name}
                      onClick={() => {
                        const newPath = folderPath.slice(0, index + 1)
                        setFolderPath(newPath)
                        setCurrentParentId(folder._id)
                      }}
                      variant='contained'
                      color='#E6F7FF'
                    />
                  </Box>
                ))}
              </Box>

              <Grid container spacing={2}>
                {isFolderLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Grid item xs={12} sm={6} md={2} key={i}>
                      <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                        <Skeleton variant='rectangular' height={60} />
                        <Skeleton width='80%' sx={{ mt: 1 }} />
                        <Skeleton width='60%' />
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <>
                    {Array.isArray(folderData?.folders) && folderData.folders.length > 0
                      ? folderData.folders.map(folder => (
                          <Grid item xs={12} sm={6} md={2} key={folder._id}>
                            <FolderCard onClick={() => handleFolderClickOnce(folder._id, folder.name)}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  component='img'
                                  src='/image5.png'
                                  alt='Folder Icon'
                                  sx={{ width: 32, height: 32, objectFit: 'contain' }}
                                />
                                <IconButton size='small' sx={{ ml: 'auto' }}>
                                  {/* <MoreVertIcon fontSize='small' /> */}
                                </IconButton>
                              </Box>
                              <Box>
                                <Typography variant='subtitle2' fontWeight={600} noWrap>
                                  {folder.name}
                                </Typography>
                                <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>
                                  {folder.subfolderCount} subfolders
                                </Typography>
                              </Box>
                            </FolderCard>
                          </Grid>
                        ))
                      : null}

                    {/* FILES */}
                    {Array.isArray(folderData?.files) &&
                      folderData.files.length > 0 &&
                      folderData.files.map((file, index) => (
                        <Grid item xs={12} sm={6} md={2} key={file._id}>
                          <FolderCard
                            onClick={() => {
                              if (file?.url) {
                                window.open(file.url, '_blank')
                              } else {
                                console.warn('File URL not available')
                              }
                            }}
                            sx={{ cursor: 'pointer' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getFileIcon(file.name)} {/* ✅ <- REPLACEMENT HERE */}

                            {/* <Box
                            component='img'
                            src={`/image${(index % 4) + 1}.png`}
                            alt='File Icon'
                            sx={{ width: 25, height: 25, objectFit: 'contain' }}
                          /> */}

                              <IconButton
                                size='small'
                                sx={{ ml: 'auto' }}
                                onClick={e => {
                                  e.stopPropagation()
                                  // Add context menu or other actions here
                                }}
                              >
                                {/* <MoreVertIcon fontSize='small' /> */}
                              </IconButton>
                            </Box>
                            <Box>
                              <Typography variant='subtitle2' fontWeight={600} noWrap>
                                {file.name}
                              </Typography>
                              <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>
                                {(file.size / 1024).toFixed(1)} KB
                              </Typography>
                            </Box>
                          </FolderCard>
                        </Grid>
                      ))}

                    {/* No content fallback */}
                    {!folderData.folders?.length && !folderData.files?.length && (
                      <Grid item xs={12}>
                        <Typography variant='body2' color='text.secondary' align='center'>
                          No files or folders found
                        </Typography>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Dialog open={isFolderModalOpen} onClose={closeFolderModal} maxWidth='xs' fullWidth>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogContent>
          <TextField
  autoFocus
  margin="dense"
  label="Folder Name"
  fullWidth
  variant="outlined"
  value={createFolderName}
  onChange={e => {
    const input = e.target.value
    // Remove leading spaces and allow only letters, numbers, and single spaces between words
    const cleaned = input.replace(/^\s+/, '').replace(/\s{2,}/g, ' ')
    setCreateFolderName(cleaned)
  }}
/>

          </DialogContent>
          <DialogActions>
            <Button
              variant='contained'
              size='small'
              sx={{
                backgroundColor: '#1D3066',
                color: '#fff',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#162955' }
              }}
              onClick={closeFolderModal}
              disabled={isFolderLoading}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              size='small'
              sx={{
                backgroundColor: '#1D3066',
                color: '#fff',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#162955' }
              }}
              onClick={handleCreateFolder}
              disabled={isFolderLoading || !createFolderName}
            >
              {isFolderLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}

export default Folders
