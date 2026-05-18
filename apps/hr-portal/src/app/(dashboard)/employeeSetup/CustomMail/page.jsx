'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Slide,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
  Add,
  PictureAsPdf,
  Visibility,
  ModelTraining,
  Delete,
  Mail
} from '@mui/icons-material'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import {
  Settings as SettingsIcon,
  Download as DownloadIcon,
  ViewColumn as ViewColumnIcon,
  FilterList as FilterIcon
} from '@mui/icons-material'
import axios from 'axios'
import JoditProEditor from './JoditProEditor/page'
import { useRouter } from 'next/navigation'
import ViewComfyIcon from '@mui/icons-material/ViewComfy'
import { CalendarIcon, Filter } from 'lucide-react'
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import { KeyboardBackspace } from '@mui/icons-material'
import { useApi } from "@core/hooks/useApi"

// Enhanced theme with modern design
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h6: {
      fontWeight: 600
    },
    body1: {
      fontSize: '0.875rem'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
          }
        }
      }
    }
  }
})

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4)
}))

const EditorCard = styled(Card)(() => ({
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: '1px solid #e3f2fd'
}))

const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{ gap: 1 }}>
      <GridToolbarColumnsButton startIcon={<ViewColumnIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarFilterButton startIcon={<FilterIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarDensitySelector startIcon={<SettingsIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarExport
        startIcon={<DownloadIcon />}
        sx={{ color: 'primary.main' }}
        csvOptions={{
          disableToolbarButton: false
        }}
        printOptions={{
          disableToolbarButton: true
        }}
      />
    </GridToolbarContainer>
  )
}

const CustomMail = () => {
  const [openPreview, setOpenPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [viewMode, setViewMode] = useState('table')
  const { callApi } = useApi()

  const beautifyTemplate = html => {
    if (!html) return ''

    const mockValues = {
      candidateUniqueId: 'ABC123456',
      candidateName: 'John Doe',
      joiningDate: '01/07/2025',
      companyName: 'FinCoopers HR'
    }

    let rendered = html

    Object.keys(mockValues).forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      rendered = rendered.replace(regex, mockValues[key])
    })

    // Scoped dialog styles
    const scopedStyle = `
      <style>
        .template-preview * {
          box-sizing: border-box;
          max-width: 100%;
        }
        .template-preview {
          font-family: 'Segoe UI', sans-serif;
          color: #1f2937;
          padding: 1rem;
          line-height: 1.6;
        }
        .template-preview table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          margin: 1rem 0;
          border-radius: 8px;
          overflow: hidden;
        }
        .template-preview th,
        .template-preview td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .template-preview img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          display: block;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        .template-preview pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .template-preview .signature-highlight {
          background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
          padding: 2px 4px;
          border-radius: 3px;
        }
        .template-preview .page-break {
          border-top: 2px dashed #ccc;
          margin: 20px 0;
          height: 1px;
        }
        .template-preview .todo-list {
          list-style: none;
          padding-left: 0;
        }
        .template-preview .todo-list li {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .template-preview .todo-list input[type="checkbox"] {
          margin-right: 8px;
        }
        .template-variable {
            background-color: #f0f0ff;
            padding: 2px 4px;
            border-radius: 4px;
            color: #333;
            font-weight: bold;
            }
      </style>
    `

    return `${scopedStyle}<div class="template-preview">${rendered}</div>`
  }

  const router = useRouter()

  const handleDelete = async id => {
    try {
      const res = await callApi({
        endpoint: `/v1/api/templete/deleteTemplate?templateId=${id}`,
        method: 'POST',
        data: {},
        disableSnackbar: false
      })
      if (res.success) {
        getAllPdfList()
      }
    } catch (error) {
      console.error('Error fetching branch types:', error)
    }
  }

  const columns = [
    {
      field: 'title',
      headerName: 'Mail Title',
      width:230,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography variant='body2' sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
        field: 'subject',
        headerName: 'Mail Subject',
        width:250,
        renderCell: params => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ModelTraining sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              {params.value || '-'}
            </Typography>
          </Box>
        )
      },
      {
        field: 'senderId',
        headerName: 'Sender Mail',
        width:250,
        renderCell: params => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ModelTraining sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              {params.value || '-'}
            </Typography>
          </Box>
        )
      },
    {
      field: 'modelType',
      headerName: 'Model Type',
      width:200,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ModelTraining sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography variant='body2' sx={{ fontWeight: 500 }}>
            {params.value || '-'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width:150,
      align: 'center',
      headerAlign: 'center',
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon size={16} className='text-gray-500' />
          <Typography variant='body2'>{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width:150,
      align: 'center',
      headerAlign: 'center',
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon size={16} className='text-gray-500' />
          <Typography variant='body2'>{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width:240,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size='small'
            variant='contained'
            sx={{
              bgcolor: 'success.main',
              color: 'white',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'success.dark',
                boxShadow: 3
              }
            }}
            onClick={() => {
              setSelectedTemplate(params.row)
              setViewMode('editor')
            }}
          >
            Edit
          </Button>
          <Tooltip title='Preview'>
            <Button
              size='small'
              variant='contained'
              onClick={() => {
                setPreviewContent(params.row)
                setOpenPreview(true)
              }}
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'success.dark',
                  boxShadow: 3
                }
              }}
            >
              Preview
            </Button>
          </Tooltip>
          {/* <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete color='error' />
          </IconButton> */}
        </Box>
      )
    }
  ]

  const handleSaveTemplate = async templateData => {
    try {
      const { templateName, content,senderId, variablesType,subject } = templateData

      if (!templateName.trim()) {
        throw new Error('Template name is required')
      }

      if (!subject.trim()) {
        throw new Error('Subject is required')
      }

      if (!content.trim()) {
        throw new Error('Template content cannot be empty')
      }


      const response = await callApi({
        endpoint: `/v1/api/mail/content/add`,
        method: 'POST',
        data: {
          content,
          name: templateName,
          modelType: variablesType,
          subject:subject,
          body:content,
          senderId
        },
        disableSnackbar: false
      })

      if (response && response.success) {
        await getAllPdfList()
        setViewMode('table')
        setSelectedTemplate(null)

        return {
          success: true,
          message: 'Template saved successfully with all PRO features!'
        }
      } else {
        throw new Error(response?.message || 'Failed to save template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      return {
        success: false,
        message: error.message || 'An error occurred while saving the template'
      }
    }
  }

  const handleUpdateTemplate = async templateData => {
    try {
      const { templateName, content, templateId, variablesType, subject, senderId } = templateData
      if (!templateName.trim()) {
        throw new Error('Template name is required')
      }

      if (!content.trim()) {
        throw new Error('Template content cannot be empty')
      }

      console.log('Saving template with Jodit PRO features:', {
        templateName,
        contentLength: content.length,
        hasProFeatures: content.includes('jodit-pro') || content.includes('todo-list') || content.includes('page-break')
      })

      const response = await callApi({
        endpoint: `/v1/api/mail/content/update`,
        method: 'POST',
        data: {
            content,
            name: templateName,
            modelType: variablesType,
            subject:subject,
            body:content,
            senderId,
            id: templateId,
        },
        disableSnackbar: false
      })

      if (response && response.success) {
        await getAllPdfList()
        setViewMode('table')
        setSelectedTemplate(null)

        return {
          success: true,
          message: 'Template saved successfully with all PRO features!'
        }
      } else {
        throw new Error(response?.message || 'Failed to save template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      return {
        success: false,
        message: error.message || 'An error occurred while saving the template'
      }
    }
  }

  const handleContentChange = content => {
    console.log('Content updated with Jodit PRO features:', {
      length: content.length,
      hasImages: content.includes('<img'),
      hasTables: content.includes('<table'),
      hasTodoLists: content.includes('todo-list'),
      hasPageBreaks: content.includes('page-break'),
      hasEmojis: content.includes('emoji'),
      hasSignatures: content.includes('signature-highlight')
    })
  }

  const handleVariableCopy = variableName => {
    console.log('Variable copied:', variableName)
  }

  const handleTemplateLoad = htmlContent => {
    console.log('Template loaded:', {
      size: htmlContent.length,
      hasProFeatures: htmlContent.includes('jodit-pro')
    })
  }

  const getAllPdfList = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${baseUrl}/v1/api/mail/content/list`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })

      const items = response.data?.items || []

      const mappedRows = items.map(item => ({
        id: item._id,
        title: item.name,
        organizationId: item.organizationId,
        content: item.body,
        subject:item.subject,
        modelType: item?.modelType || '-',
        senderId:item?.senderId || '-',
        toMail:item.toMail || '-',
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : '',
        updatedAt: item.updatedAt
          ? new Date(item.updatedAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : ''
      }))

      setRows(mappedRows)
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAllPdfList()
  }, [])

  return (
    <>
      <ThemeProvider theme={theme}>
        <StyledContainer maxWidth='2xl' sx={{ minHeight: '100vh' }}>
          {viewMode === 'editor' ? (
            <Slide direction='up' in={viewMode === 'editor'} timeout={600}>
              <EditorCard>
                <Box
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Box display='flex' alignItems='center' gap={2}>
                      <EditIcon sx={{ color: '#ffffff' }} />
                      <Typography variant='h6' fontWeight={600} color='#FFFFFF'>
                        {selectedTemplate ? 'Edit Template' : 'Create New Template'}
                      </Typography>
                      {selectedTemplate && (
                        <Chip label={selectedTemplate.title} color='primary' variant='outlined' size='small' />
                      )}
                    </Box>
                    <Button
                      variant='outlined'
                      color='#ffffff'
                      startIcon={<CloseIcon sx={{ color: '#ffffff' }} />}
                      onClick={() => {
                        setViewMode('table')
                        setSelectedTemplate(null)
                      }}
                      sx={{
                        borderRadius: '25px',
                        borderColor: '#ffffff',
                        color: '#ffffff',
                        px: 3,
                        py: 1,
                        fontWeight: 550,
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                      }}
                    >
                      Back to Table
                    </Button>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <JoditProEditor
                    initialValue={selectedTemplate?.content || ''}
                    isUpdate={!!selectedTemplate}
                    onSave={handleSaveTemplate}
                    onUpdate={handleUpdateTemplate}
                    selectedTemplate={selectedTemplate}
                    templates={rows}
                    onChange={handleContentChange}
                    onVariableCopy={handleVariableCopy}
                    onTemplateLoad={handleTemplateLoad}
                    editorConfig={{
                      theme: 'default',
                      language: 'en',
                      googleTranslateApiKey: process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY,
                      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                      uploaderUrl: '/api/upload',
                      aiAssistantEnabled: true,
                      enableAdvancedFeatures: true
                    }}
                    showTabs={true}
                    enableAutoSave={true}
                    autoSaveInterval={300000}
                  />
                </CardContent>
              </EditorCard>
            </Slide>
          ) : (
            <Slide direction='up' in={viewMode === 'table'} timeout={400}>
              <Box>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <Box
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
                        '50%': { transform: 'translateY(-20px)' }
                      }
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          background: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Mail sx={{ fontSize: 28, color: 'white' }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                       <Typography variant='h5' fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
                          Custom Mail
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        color='white'
                        variant='outlined'
                        startIcon={<Add />}
                        onClick={() => {
                          setSelectedTemplate(null)
                          setViewMode('editor')
                        }}
                        sx={{
                          borderRadius: '25px',
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                        }}
                      >
                        Create Mail
                      </Button>
                      <Button
                        sx={{ borderRadius: '25px' }}
                        color='white'
                        variant='outlined'
                        onClick={() => router.push('/employeeSetup')}
                      >
                        <KeyboardBackspace />
                      </Button>
                    </Box>
                  </Box>
                </Paper>

                <DataGrid
                  rows={rows}
                  columns={columns}
                  loading={isLoading}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } }
                  }}
                  pageSizeOptions={[5, 10, 15, 25, 50]}
                  disableRowSelectionOnClick
                  disableColumnResize
                  slots={{
                    toolbar: CustomToolbar
                  }}
                  sx={{
                    width: '100%',
                    height: 650, 
                    overflow: 'auto', 
                    '& .MuiDataGrid-main': {
                      overflow: 'auto'
                    },
                    '& .MuiDataGrid-virtualScroller': {
                      overflow: 'auto'
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#1976d2',
                      color: '#fff',
                      fontWeight: 600,
                      minWidth: '100%' 
                    },
                    '& .MuiDataGrid-columnHeader': {
                      backgroundColor: '#1976d2',
                      color: '#fff',
                      borderRight: 'none'
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 'bold',
                      color: '#fff'
                    },
                    '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
                      color: '#fff'
                    },
                    '& .MuiDataGrid-columnSeparator': {
                      display: 'none'
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden'
                    },
                    '& .MuiDataGrid-row': {
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        cursor: 'pointer'
                      }
                    },
                    '& .MuiDataGrid-toolbarContainer': {
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '1px solid #e0e0e0'
                    }
                  }}                  
                />
              </Box>
            </Slide>
          )}
        </StyledContainer>
        <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth='lg'
        fullWidth
        sx={{
            '& .MuiDialog-paper': {
            borderRadius: 2,
            maxHeight: '75vh',
            display: 'flex',
            flexDirection: 'column'
            },
            '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }
        }}
        >
        <DialogTitle>Template Preview</DialogTitle>

        <DialogContent
            dividers
            sx={{
            p: 0,
            backgroundColor: '#f5f5f5',
            flexGrow: 1,
            overflow: 'hidden'
            }}
        >
            <Box sx={{ p: 3 }}>
            {/* Static subject */}
            <Typography variant="h6" fontWeight="bold" mb={2}>
                Subject: {previewContent?.subject}
            </Typography>

            {/* Scrollable content */}
            <Box
                sx={{
                backgroundColor: '#fff',
                padding: 4,
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: 800,
                margin: '0 auto',
                overflowY: 'auto',
                maxHeight: '50vh',
                border: '1px solid #e0e0e0',
                fontFamily: 'Arial, sans-serif',
                color: '#333',
                '& *': {
                    maxWidth: '100%',
                    wordBreak: 'break-word'
                },
                '& h1, h2, h3, h4, h5': {
                    marginTop: '1rem',
                    fontWeight: 600
                },
                '& p': {
                    marginBottom: '1rem',
                    lineHeight: 1.6
                },
                '& img': {
                    maxWidth: '100%',
                    height: 'auto'
                },
                '& table': {
                    borderCollapse: 'collapse',
                    width: '100%'
                },
                '& th, & td': {
                    border: '1px solid #ccc',
                    padding: '8px',
                    textAlign: 'left'
                }
                }}
                dangerouslySetInnerHTML={{ __html: beautifyTemplate(previewContent?.content) }}
            />
            </Box>
        </DialogContent>

        <DialogActions>
            <Button onClick={() => setOpenPreview(false)} variant='contained' color='primary'>
            Close
            </Button>
        </DialogActions>
        </Dialog>

      </ThemeProvider>
    </>
  )
}

export default CustomMail

  


