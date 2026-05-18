import React, { useState } from 'react'

import { Box, Typography, Button, Grid, Snackbar, Alert, MenuItem,IconButton } from '@mui/material'

import UploadFileIcon from '@mui/icons-material/UploadFile'

import DeleteIcon from '@mui/icons-material/Delete'

import CustomTextField from '@/@core/components/mui/TextField'

const CustomForm = ({
  formName = 'Custom Form',
  fields,
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  handleFileUpload,
  handleFileRemove,
  fileFields = []
}) => {
  const [errors, setErrors] = useState({})
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const validate = () => {
    let newErrors = {}

    fields.forEach(({ name, label, required }) => {
      if (required && (!formData[name] || formData[name].toString().trim() === '')) {
        newErrors[name] = `${label} is required`
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setSnackbarMessage('Please fill all required fields')

      setSnackbarOpen(true)
    }

    return Object.keys(newErrors).length === 0
  }

  const handleCloseSnackbar = () => setSnackbarOpen(false)

  // Separate categorized and uncategorized fields
  const categorizedFields = fields.filter(field => field.category)
  const uncategorizedFields = fields.filter(field => !field.category)

  // Group categorized fields
  const groupedFields = categorizedFields.reduce((acc, field) => {
    acc[field.category] = acc[field.category] || []
    acc[field.category].push(field)

    return acc
  }, {})

  return (
    <Box component='form' onSubmit={e => handleSubmit(e, formData)} sx={{ padding: '16px', width: '100%' }}>
      <Typography variant='h5' textAlign='left' sx={{ fontWeight: 'bold', mb: '12px' }}>
        {formName}
      </Typography>

      {/* Render categorized sections */}
      {Object.entries(groupedFields).map(([category, categoryFields]) => (
        <Box key={category} sx={{ marginBottom: 4 }}>
          <Typography variant='h6' component='h2' textAlign='left' className='font-bold' mb={4}>
            {category}
          </Typography>
          <Grid container spacing={3}>
            {categoryFields.map(({ name, label, type, required, options, readOnly }) => (
              <Grid item xs={12} md={3} key={name}>
                {type === 'select' ? (
                  <CustomTextField
                    fullwidth
                    label={label}
                    select
                    name={name} // Ensure name is set
                    value={formData[name] ?? ''} // Use nullish coalescing for clarity
                    onChange={handleChange}
                    required={required}
                    disabled={readOnly}
                  >
                    {options?.map(({ value, label }) => (
                      <MenuItem key={value} value={value} disabled={readOnly}>
                        {label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                ) : (
                  <CustomTextField
                    label={label}
                    type={type || 'text'}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    required={required}
                    {...(readOnly ? { inputProps: { readOnly: true } } : {})}
                    error={!!errors[name]}
                    helperText={errors[name] || ''}
                    fullwidth
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Render uncategorized fields */}
      {uncategorizedFields.length > 0 && (
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
            General
          </Typography>
          <Grid container spacing={3}>
            {uncategorizedFields.map(({ name, label, type, required, options, readOnly }) => (
              <Grid item xs={12} md={3} key={name}>
                {type === 'select' ? (
                  <CustomTextField
                    fullwidth
                    label={label}
                    select
                    name={name} // Ensure name is set
                    value={formData[name] ?? ''} // Use nullish coalescing for clarity
                    onChange={handleChange}
                    required={required}
                    disabled={readOnly}
                  >
                    {options?.map(({ value, label }) => (
                      <MenuItem key={value} value={value} disabled={readOnly}>
                        {label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                ) : (
                  <CustomTextField
                    label={label}
                    type={type || 'text'}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    required={required}
                    error={!!errors[name]}
                    {...(readOnly ? { inputProps: { readOnly: true } } : {})}
                    helperText={errors[name] || ''}
                    fullwidth
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Grid container spacing={3}>
        {fileFields.map(({ name, label, acceptedTypes }) => (
          <Grid item xs={12} md={3} key={name}>
            <Typography variant='subtitle2' sx={{ fontWeight: 'bold', mb: 1 }}>
              {label}
            </Typography>
            <Box
              sx={{ border: '1px solid #E0E0E0', borderRadius: 2, overflow: 'hidden', position: 'relative', p: '16px' }}
            >
              {formData[name] ? (
                typeof formData[name] === 'string' ? (
                  <Typography variant='caption'>{formData[name]}</Typography>
                ) : formData[name]?.file?.type?.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(formData[name].file)}
                    alt='Preview'
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant='caption'>{formData[name]?.name || 'File uploaded'}</Typography>
                )
              ) : (
                <label>
                  <UploadFileIcon />
                  <Typography>{label}</Typography>
                  <input
                    type='file'
                    hidden
                    accept={acceptedTypes.join(', ')}
                    onChange={e => handleFileUpload(e, name)}
                  />
                </label>
              )}
              {formData[name] && (
                <IconButton onClick={() => handleFileRemove(name)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
      {/* Submit Button */}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          type='submit'
          variant='contained'
          sx={{
            background: 'linear-gradient(45deg,#910BFF,#5035FE)',
            transition: '0.3s',
            '&:hover': { background: 'linear-gradient(45deg,#2405EE,#46027D)' }
          }}
        >
          Submit
        </Button>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} variant="filled" severity='error' sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CustomForm
