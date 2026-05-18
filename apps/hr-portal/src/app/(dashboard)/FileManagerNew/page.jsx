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
  Stack
} from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
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
  PictureAsPdf as PdfIcon,
  Memory,
  Storage
} from '@mui/icons-material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
// import ImageIcon from '@mui/icons-material/Image'
import DescriptionIcon from '@mui/icons-material/Description'
// import TableChartIcon from '@mui/icons-material/TableChart'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile' // (optional fallback)
import ArticleIcon from '@mui/icons-material/Article' // for DOC/DOCX


import axios from 'axios'
import Folders from './Folders/page'

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

const StyledCard = styled(Card)(({ bgcolor }) => ({
  background: bgcolor || '#ffffff',
  padding: '8px',
  height: '180px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
  }
}))

const FolderCard = styled(Card)(() => ({
  borderRadius: 12 ,
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

const StorageCard = styled(Card)(() => ({
  padding: '24px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 16
}))

const strokeWidth = 25
const radius = 80
const centerX = 100 // instead of radius
const centerY = 100

const polarToCartesian = angleInDegrees => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  }
}

const describeArc = (startAngle, endAngle) => {
  const start = polarToCartesian(startAngle)
  const end = polarToCartesian(endAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y].join(' ')
}

function FileManagementDashboard() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [folderData, setFolderData] = useState({ folders: [], files: [] })
  const [parentHistory, setParentHistory] = useState([])
  const [currentParentId, setCurrentParentId] = useState('')
  const [folderPath, setFolderPath] = useState([]) // array of { _id, name }
  const [total, setTotal] = useState('')
  const [used, setUsed] = useState('')
  const fileInputRef = useRef(null)
  const tabs = ['Folders', 'Recent']
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('Folders')
  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase()
  
    switch (extension) {
      case 'pdf':
        return <PdfIcon sx={{ color: '#d32f2f', fontSize: 36 }} />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <ImageIcon sx={{ color: '#0288d1', fontSize: 36 }} />
      case 'doc':
      case 'docx':
        return <DocumentIcon sx={{ color: '#1976d2', fontSize: 36 }} />
      case 'xls':
      case 'xlsx':
        return <TableChartIcon sx={{ color: '#388e3c', fontSize: 36 }} />
      case 'txt':
        return <DescriptionIcon sx={{ color: '#757575', fontSize: 36 }} />
      default:
        return <DescriptionIcon sx={{ color: '#616161', fontSize: 36 }} />
    }
  }
  const labelToImageMap = {
    Videos: '/video.png',
    Document: '/document.png',
    Audios: '/music.png',
    Images: '/image1.png',
    'Excel Sheet': '/excel.png',
    Others: '/other.png'
  };
  
  const labelToBgColorMap = {
    Videos: '#FF705826',
    Document: '#5A607F0F',
    Audios: '#21C4FA40',
    Images: '#A77AFF40',
    'Excel Sheet': '#85E62340',
    Others: '#90E0EF'
  };
  
  const [dashboardData, setDashboardData] = useState([])

  const getDashboardData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/api/finalFileShare/folder-data-usage`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
  
      const categories = response.data.items?.categories || [];
  
      const labelToImageMap = {
        Videos: '/video.png',
        Document: '/document.png',
        Audios: '/music.png',
        Images: '/image1.png',
        'Excel Sheet': '/excel.png',
        Others: '/other.png'
      };
  
      const enriched = categories.map((item, index) => ({
        title: item.label,
        count: `${item.count} files`,
        size: `${item.sizeGB} GB`,
        sizeGB: item.sizeGB,
        percent: item.percent,
        bgcolor: labelToBgColorMap[item.label] || '#e0e0e0', // fallback color
        icon: (
          <Box
            component='img'
            src={labelToImageMap[item.label] || '/image1.png'}
            alt={item.label}
            sx={{ width: 45, height: 45, objectFit: 'contain' }}
          />
        )
      }));
  
      setTotal(response.data.items?.organization?.quotaGB);
      setUsed(response.data.items?.organization?.usedGB);
      setDashboardData(enriched);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };
  
  useEffect(() => {
    getDashboardData()
  }, [])

  const renderSegments = () => {
    let startAngle = -90 // Half-donut from left to right

    return dashboardData
      .filter(segment => parseFloat(segment.percent) > 0)
      .map((segment, index) => {
        const percent = parseFloat(segment.percent)
        const angle = (percent / 100) * 180
        const endAngle = startAngle + angle

        const path = describeArc(startAngle, endAngle)

        const result = (
          <path
            key={index}
            d={path}
            stroke={segment.bgcolor}
            strokeWidth={strokeWidth}
            fill='none'
            strokeLinecap='round'
          />
        )

        startAngle = endAngle
        return result
      })
  }
  const [recentFiles, setRecentFiles] = useState([])

  const getAllRecent = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/finalFileShare/recent-activity`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      const activities = res?.data?.items?.items?.map((activity, index) => {
        const file = activity?.file
        return {
          file: {
            name: file?.name,
            mimetype: file?.mimetype,
            type: file?.mimetype?.includes('directory')
              ? 'Folder'
              : file?.mimetype?.split('/')[1]?.toUpperCase() || 'File',
            size: file?.size || 0,
            action: activity?.action || 'unknown',
            at: activity?.at || null,            
            icon: `/image${(index % 4) + 1}.png`,
            location: file?.location,
            key: file?.key,
            typeRaw: file?.type
          }
        }
      })

      setRecentFiles(activities)
    } catch (error) {
      console.error('Error fetching recent files:', error)
    }
  }

  useEffect(() => {
    getAllRecent()
  }, [])

  const [createFolderName, setCreateFolderName] = useState('')
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)

  const [queryText, setQueryText] = useState('')
  const [fileTypes, setFileTypes] = useState([]) // e.g., ['pdf', 'image']
  const [isFolderLoading, setIsFolderLoading] = useState(false)
  const handleOpenError = message => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
        <Container maxWidth='2xl'>
          <Box
            sx={{
              mb: 3,
              borderBottom: '2px solid #e0e0e0',
              width: '100%'
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                py: 2,
                px:4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Animated Circle Background */}
              {/* <Box
      sx={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: '200px',
        height: '200px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }}
    /> */}

              {/* Header Content */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >
                {/* Left: Icon + Title */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
  {/* Icon + Title */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 30, color: '#ffb86c' }} />
                </Box>
                <Typography variant="h4" fontWeight={700} sx={{ color: "white", mb: 0.5 }}>
                File Manager
                </Typography>
              </Box>
            </Box>

               
               
                {/* Right: Tabs */}
                <Box sx={{ display: 'flex', gap: 4, mt: { xs: 2, sm: 0 } }}>
                  {tabs.map(tab => (
                    <Box
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      sx={{
                        cursor: 'pointer',
                        position: 'relative',
                        pb: 1,
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          bottom: 0,
                          height: 3,
                          width: '100%',
                          background: activeTab === tab ? 'linear-gradient(to right, #ffffff, #eeeeee)' : 'transparent',
                          borderRadius: 4,
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      <Typography
                        fontSize={18}
                        fontWeight={530}
                        sx={{
                          background: activeTab === tab ? 'linear-gradient(to right, #ffffff, #eeeeee)' : 'none',
                          WebkitBackgroundClip: activeTab === tab ? 'text' : 'none',
                          WebkitTextFillColor: activeTab === tab ? 'transparent' : '#ffffff',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {tab}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Main Content Grid */}
          <Grid container spacing={3}>
            {/* Left Section */}
            <Grid item xs={12}>
              {/* Category Cards */}
       
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {dashboardData.map((category, index) => (
                  <Grid item xs={12} sm={6} md={1.7} key={index}>
                    {/* <StyledCard bgcolor={category.bgcolor}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}> */}
                      <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", p:1, backgroundColor:"white"}}>
                      {category.icon}
                        {/* <Typography variant='h6' color='#28303F' fontWeight={600} sx={{ mt: 1, mb: 0.5 }}>
                          {category.title}
                        </Typography> */}
                        <Typography variant='body2' color='#ABAEBD' mt={1}>
                          {category.count}
                        </Typography>
                        {/* <Typography variant='caption' color='#ABAEBD'>
                          {category.size}
                        </Typography> */}
                      </Box>

                      {/* </CardContent>
                    </StyledCard> */}
                  </Grid>
                ))}
                <Grid item xs={12} lg={1.7}>
                  {/* <StorageCard sx={{ bgcolor: '#EAF1FB' }}> */}
                    <Box
                      sx={{
                        padding: '5px',
                        height: '90px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:"white"
                      }}
                    >
                      {/* <svg width='160' height='120' viewBox='0 0 220 120'>
                        <path
                          d={describeArc(-90, 90)}
                          stroke='#e0e0e0'
                          strokeWidth={strokeWidth}
                          fill='none'
                          strokeLinecap='round'
                        />
                        {renderSegments()}
                      </svg> */}
                      <Box
                      component='img'
                      src={'/allData.png'}
                      alt={"Storage"}
                      sx={{ width: 45, height: 45, objectFit: 'contain' }}
                    />
                      <Typography fontSize={16} fontWeight={700} color='primary'>
                        {used} GB
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Used of {total} GB
                      </Typography>
                    </Box>
                  {/* </StorageCard> */}
                </Grid>
              </Grid>
             
              {activeTab === 'Folders' ? (
                <Folders />
              ) : (
                <Box>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant='h6' fontWeight={600}>
                          Recent Files
                        </Typography>
                        <IconButton size='small' sx={{ ml: 1 }}>
                          {/* <KeyboardArrowDownIcon /> */}
                        </IconButton>
                      </Box>

                      <Grid container spacing={3}>
                        {recentFiles.map((item, index) => {
                      const file = item.file
                      const isFolder = file.type === 'folder'
                      const fileUrl = file.location
                      const canOpen = !isFolder && fileUrl

                          return (
                            <Grid item xs={12} sm={6} md={2} key={index}>
                            <Box>
                              <FolderCard
                                onClick={() => {
                                  if (canOpen) {
                                    window.open(fileUrl, '_blank')
                                  } else if (isFolder) {
                                  } else {
                                    handleOpenError('This file cannot be opened. No preview or URL available.')
                                  }
                                }}
                                sx={{
                                  cursor: canOpen || isFolder ? 'pointer' : 'not-allowed',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  p: 2,
                                  borderRadius: 2,
                                  boxShadow: 1
                                }}
                              >
                                {/* Top: Icon + menu */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getFileIcon(file.name)}

                                    <IconButton
                                      size='small'
                                      sx={{ ml: 'auto' }}
                                      onClick={e => {
                                        e.stopPropagation()
                                      }}
                                    >
                                      {/* <MoreVertIcon fontSize='small' /> */}
                                    </IconButton>
                                  </Box>

                                  {/* Middle: File Name + Size (wrapped) */}
                                  <Box sx={{ mt: 1 }}>
                                    <Typography
                                      variant='subtitle2'
                                      fontWeight={600}
                                      sx={{
                                        fontSize: '0.85rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: '1.2em',
                                        minHeight: '2.5em'
                                      }}
                                    >
                                      {file.name} · {!isFolder ? `${(file.size / 1024).toFixed(1)} KB` : ''}
                                    </Typography>
                                  </Box>

                                  {/* Bottom: Action + Date */}
                                  <Box>
                                    <Stack direction='column' justifyContent='space-between' spacing={1}>
                                    <Typography variant='caption' color='text.secondary' noWrap>
                                        At: {file.at ? new Date(file.at).toLocaleString() : 'N/A'}
                                      </Typography>
                                      {canOpen && (
                                      <Typography variant='caption' color='text.secondary' noWrap>
                                        Action: {file.action || '-'}
                                      </Typography>)}

                                    </Stack>

                                    {!canOpen && !isFolder && (
                                      <Typography variant='caption' color='error'>
                                        Cannot open
                                      </Typography>
                                    )}
                                  </Box>
                                </FolderCard>
                              </Box>
                            </Grid>
                          )
                        })}
                      </Grid>

                    </Box>
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity='error' elevation={6} variant='filled'>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  )
}

export default FileManagementDashboard
