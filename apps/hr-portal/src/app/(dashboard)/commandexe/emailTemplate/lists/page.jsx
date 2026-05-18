'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { getAllEmailtemplatesAPI } from '@/services/apiService'

// import DataTable from '@/app/common/dataTable'
import Modal from '../../components/modal'

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid'

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ p: 4 }}>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        csvOptions={{
          fileName: 'exported-data',
          delimiter: ',',
          utf8WithBom: true
        }}
      />
    </GridToolbarContainer>
  )
}

export default function PDFLists() {
  const [templates, setTemplates] = useState([])
  const [rows, setRows] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [queryParams, setQueryParams] = useState({})
  const router = useRouter()

  const columns = [
    {
      field: 'templateName',
      headerName: 'Template Name',
      flex: 1,
      minWidth: 150,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      renderCell: params => {
        return (
          <>
            <Button variant='contained' color='success' onClick={() => handlePreview(params.row)}>
              Preview Template
            </Button>
          </>
        )
      }
    }
  ]

  useEffect(() => {
    fetchVariables()
  }, [])

  const fetchVariables = async () => {
    try {
      const res = await getAllEmailtemplatesAPI()


      if (res && res.items) {
        setRows(
          res.items.map(item => ({
            _id: item?._id,
            id: item?._id,
            htmlContent: item.htmlContent,
            templateName: queryParams.templateName,
            templateName: item.templateName || 'N/A'
          }))
        )
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const handlePreview = row => {

    setPreviewContent(row.htmlContent)
    setQueryParams(row)
    setPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setPreviewOpen(false)
    setPreviewContent('')
    setQueryParams({})
  }

  const handleNavigate = row => {

    if (queryParams) {
      // Navigate to update page with template data from modal
      localStorage.setItem(
        'templateData',
        JSON.stringify({
          _id: queryParams._id,
          htmlContent: queryParams.htmlContent
        })
      )

      router.push('/commandexe/emailTemplate/updateTemplate')
    }
  }

  const handleOpen = () => {
    router.push('/commandexe/emailTemplate/addTemplate')
  }

  return (
    <>
      <Paper sx={{ p: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 4 }}>
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            Templates
          </Typography>
          <Box>
            <Button
              variant='outlined'
              onClick={() => router.push('/employeeSetup')}
              sx={{ marginRight: '10px' }}
            >
              Back
            </Button>
            <Button variant='contained' color='primary' sx={{ height: 40 }} onClick={handleOpen}>
              Create Template
            </Button>
          </Box>
        </Box>
        {/*         
        <DataTable
          columns={columns}
          rows={rows}
          pageSize={5}
          page={0}
          rowsPerPage={10}
          totalItems={rows.length}
          extraActions={row => (
            <Button 
              variant='contained' 
              color='success'
              onClick={() => handlePreview(row)}
            >
              Preview Template
            </Button>
          )}
        /> */}

        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            getRowId={row => row._id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
              }
            }}
            rowHeight={50}
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant='body2'>No Templates found</Typography>
                </Box>
              )
            }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#9180ff',
                color: '#ffffff',
                fontWeight: 'bold'
              }
            }}
          />
        </div>
      </Paper>

      {/* HTML Preview Dialog */}
      <Modal
        open={previewOpen}
        handleClose={handleClosePreview}
        maxWidth='lg'
        fullWidth={true}
        title='HTML Preview'
        showButton={false}
      >
        <div dangerouslySetInnerHTML={{ __html: previewContent }} style={{ margin: '20px 0' }} />
        <DialogActions>
          <Button onClick={handleClosePreview} color='primary'>
            Close
          </Button>
          <Button variant='contained' onClick={handleNavigate} color='success'>
            Update
          </Button>
        </DialogActions>
      </Modal>
    </>
  )
}
