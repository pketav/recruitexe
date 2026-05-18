// 'use client'
// import React, { useState, useEffect } from 'react'
// import {
//   Box,
//   Button,
//   Grid,
//   IconButton,
//   TextField,
//   InputLabel,
//   FormControl,
//   Select,
//   MenuItem,
//   Typography,
//   Paper,
//   Divider
// } from '@mui/material'
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
// import DeleteIcon from '@mui/icons-material/Delete'
// import { postInitFormApi, getInitFormApi } from '@/services/apiService'

// const InitForm = () => {
//   const [fields, setFields] = useState([])

//   useEffect(() => {
//     const fetchFields = async () => {
//       try {
//         const data = await getInitFormApi()
//         const initialFields = Array.isArray(data?.items) ? data.items.map(item => ({
//           ...item,
//           isExisting: true // Mark fetched fields as existing
//         })) : []
//         setFields(initialFields)
//       } catch (error) {
//         console.error('Failed to load init fields:', error)
//       }
//     }

//     fetchFields()
//   }, [])

//   const addField = () => {
//     setFields(prev => [
//       ...prev,
//       { fieldName: '', dataType: 'string', isExisting: false }
//     ])
//   }

//   const handleDelete = (index) => {
//     setFields(prev => prev.filter((_, i) => i !== index))
//   }

//   const handleFieldChange = (index, key, value) => {
//     setFields(prev => {
//       const updated = [...prev]
//       updated[index] = { ...updated[index], [key]: value }
//       return updated
//     })
//   }

//   const handleSubmit = async () => {
//     const payload = {
//       initFields: fields.map(field => ({
//         fieldName: field.fieldName,
//         dataType: field.dataType
//       }))
//     }

//     try {
//       const res = await postInitFormApi(payload)
//       console.log('Submitted successfully:', res)
//       const data = await getInitFormApi()
//       setFields(Array.isArray(data?.items) ? data.items.map(item => ({
//         ...item,
//         isExisting: true
//       })) : [])
//     } catch (error) {
//       console.error('Failed to submit fields:', error)
//       alert('Failed to submit fields. See console for details.')
//     }
//   }

//   return (
//     <Paper elevation={3} sx={{ p: 4}}>
//       <Typography variant='h5' fontWeight={600} gutterBottom>
//         Custom Fields Setup
//       </Typography>
//       <Divider sx={{ mb: 4 }} />

//       {fields.map((field, idx) => (
//         // <Paper
//         //   key={idx}
//         //   elevation={1}
//         //   sx={{
//         //     my:4,
//         //     p: 2,
//         //   }}
//         // >
//           <Grid container spacing={2} alignItems='center' padding={3} key={idx}>
//             <Grid item xs={12} sm={3} md={4}>
//               <TextField
//                 size="small"
//                 fullWidth
//                 label="Field Name"
//                 value={field.fieldName}
//                 onChange={(e) => handleFieldChange(idx, 'fieldName', e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12} sm={3} md={4}>
//               <FormControl fullWidth size='small'>
//                 <InputLabel>Data Type</InputLabel>
//                 <Select
//                   value={field.dataType}
//                   label='Data Type'
//                   onChange={(e) => handleFieldChange(idx, 'dataType', e.target.value)}
//                 >
//                   <MenuItem value='string'>Text</MenuItem>
//                   <MenuItem value='file'>Upload</MenuItem>
//                   <MenuItem value='textarea'>Details</MenuItem>
//                   <MenuItem value='multiUpload'>Multi-Upload</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={3} md={3}>
//               <IconButton
//                 color="error"
//                 onClick={() => handleDelete(idx)}
//                 title="Delete"
//               >
//                 <DeleteIcon />
//               </IconButton>
//             </Grid>
//           </Grid>
//         // </Paper>
//       ))}

//       <Box mt={4} textAlign='right'>
//         <Button
//           startIcon={<AddCircleOutlineIcon />}
//           onClick={addField}
//           variant='contained'
//           color='primary'
//           size='large'
//           sx={{ borderRadius: 2, textTransform: 'none', px: 4, mr: 2 }}
//         >
//           Add Field
//         </Button>

//         {fields.length > 0 && (
//           <Button
//             variant='outlined'
//             color='success'
//             onClick={handleSubmit}
//             size='large'
//             sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
//           >
//             Submit All Fields
//           </Button>
//         )}
//       </Box>
//     </Paper>
//   )
// }

// export default InitForm



'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Paper,
  Divider,
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import { postInitFormApi, getInitFormApi } from '@/services/apiService'
import { useRouter } from 'next/navigation'

const InitForm = () => {
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(false) // Loading state for submission only

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const data = await getInitFormApi()
        const initialFields = Array.isArray(data?.items)
          ? data.items.map(item => ({
              ...item,
              isRequired: item.isRequired ?? true,
              isExisting: true
            }))
          : []
        setFields(initialFields)
      } catch (error) {
        console.error('Failed to load init fields:', error)
      }
    }

    fetchFields()
  }, [])

  const addField = () => {
    setFields(prev => [...prev, { fieldName: '', dataType: 'string', isRequired: true, isExisting: false }])
  }

  const handleDelete = index => {
    setFields(prev => prev.filter((_, i) => i !== index))
  }

  const handleFieldChange = (index, key, value) => {
    setFields(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [key]: value }
      return updated
    })
  }

  const handleSubmit = async () => {
    setLoading(true) // Set loading only for submission
    const payload = {
      initFields: fields.map(field => ({
        fieldName: field.fieldName,
        dataType: field.dataType,
        isRequired: field.isRequired
      }))
    }
    console.log('Submitting fields:', payload)

    try {
      const res = await postInitFormApi(payload)
      console.log('Submitted successfully:', res)
      const data = await getInitFormApi()
      setFields(
        Array.isArray(data?.items)
          ? data.items.map(item => ({
              ...item,
              isRequired: item.isRequired ?? true,
              isExisting: true
            }))
          : []
      )
    } catch (error) {
      console.error('Failed to submit fields:', error)
      alert('Failed to submit fields. See console for details.')
    } finally {
      setLoading(false) // Reset loading state
    }
  }

  const router = useRouter()

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 4 }}>
      <Typography variant='h5' fontWeight={600} gutterBottom>
        Custom Fields Setup
      </Typography>
              <Button
                size='large'
                variant='outlined'
                onClick={()=> router.push('/employeeSetup')}
              >
                Back
              </Button>
            </Box>
      <Divider sx={{ mb: 4 }} />

      {loading && (
        <Box display='flex' justifyContent='center' my={2}>
          <CircularProgress /> {/* Loading indicator only during submission */}
        </Box>
      )}

      {fields.map((field, idx) => (
        <Grid container spacing={2} alignItems='center' padding={3} key={idx}>
          <Grid item xs={12} sm={3} md={3}>
            <TextField
              size='small'
              fullWidth
              label='Field Name'
              value={field.fieldName}
              onChange={e => handleFieldChange(idx, 'fieldName', e.target.value)}
              disabled={loading} // Disable input during submission
            />
          </Grid>

          <Grid item xs={12} sm={3} md={3}>
            <FormControl fullWidth size='small'>
              <InputLabel>Data Type</InputLabel>
              <Select
                value={field.dataType}
                label='Data Type'
                onChange={e => handleFieldChange(idx, 'dataType', e.target.value)}
                disabled={loading} // Disable select during submission
              >
                <MenuItem value='string'>Text</MenuItem>
                <MenuItem value='file'>Upload</MenuItem>
                <MenuItem value='textarea'>Details</MenuItem>
                <MenuItem value='multiUpload'>Multi-Upload</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3} md={3}>
            <IconButton
              color='error'
              onClick={() => handleDelete(idx)}
              title='Delete'
              disabled={loading} // Disable delete button during submission
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={field.isRequired}
                  onChange={e => handleFieldChange(idx, 'isRequired', e.target.checked)}
                  color='primary'
                  disabled={loading} // Disable switch during submission
                />
              }
              label='Required'
            />
          </Grid>
        </Grid>
      ))}

      <Box mt={4} textAlign='right'>
        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={addField}
          variant='contained'
          color='primary'
          size='large'
          sx={{ borderRadius: 2, textTransform: 'none', px: 4, mr: 2 }}
          disabled={loading} // Disable add button during submission
        >
          Add Field
        </Button>

        {fields.length > 0 && (
          <Button
            variant='outlined'
            color='success'
            onClick={handleSubmit}
            size='large'
            sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
            disabled={loading} // Disable submit button during submission
            startIcon={loading ? <CircularProgress size={20} /> : null} // Show loading spinner in button
          >
            {loading ? 'Submitting...' : 'Submit All Fields'}
          </Button>
        )}
      </Box>
    </Paper>
  )
}

export default InitForm