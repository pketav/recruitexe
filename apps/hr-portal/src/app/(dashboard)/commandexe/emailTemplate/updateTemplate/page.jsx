'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import JoditEditor from 'jodit-pro-react'
// import JoditProEditor from '@/components/JoditProEditor';

import { Alert, Autocomplete, Button, Grid, MenuItem, Paper, Snackbar } from '@mui/material'

import { getAllUserProductsAPI, getAllVariablesAPI, updateEmailTemplate, updateTemplate } from '@/services/apiService'
import EmailProEditor from '../../email/EmailProEditor'

const JoditEditorComponent = ({ onChange, initialValue = '' }) => {
  const [content, setContent] = useState(initialValue)
  const [variables, setVariables] = useState([])
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const router = useRouter()

  const [templateData, setTemplateData] = useState({
    _id: '',
    htmlContent: '',
    productName: '',
    templateName: ''
  })

  const [selectedVariable, setSelectedVariable] = React.useState('')

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleVariableChange = value => {
    setSelectedVariable(value)
  }

  const handleChange = useCallback(
    newContent => {

      if (newContent !== content) {
        setContent(newContent)
        if (onChange) onChange(newContent)
      }
    },
    [content, onChange]
  )

  // Config now handled by JoditProEditor component

  useEffect(() => {
    fetchVariables()
    fetchProducts()
  }, [])

  useEffect(() => {
    // Retrieve template data from localStorage
    const storedData = localStorage.getItem('templateData')


    if (storedData) {
      const parsedData = JSON.parse(storedData)

      setTemplateData(parsedData)
      // Extract only content inside <body>
      const parser = new DOMParser()
      const doc = parser.parseFromString(parsedData.htmlContent, 'text/html')
      const bodyContent = doc.body.innerHTML

      // You can now use bodyContent in your editor or preview
      setContent(bodyContent) // You can define a new state if needed

      //   setLoading(false)

      // Clear localStorage after retrieving data
      //   localStorage.removeItem('templateData')
    }

    // else {
    //   // If no data is found, redirect back to templates page
    //   alert('No template data found')
    //   router.push('/templates/pdflists') // Adjust this path as needed
    // }
  }, [])

  const fetchVariables = async () => {
    // setLoading(true)
    try {
      const res = await getAllVariablesAPI()


      if (res && res.items) {
        // setVariables(res.items.map((item) => ({
        //   variableName: item?.variableName,
        // })))
        setVariables(res.items)
      }
    } catch (error) {
      console.error('Error fetching variables:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await getAllUserProductsAPI()


      if (data.status) {
        setProducts(data.items)
      }
    } catch (error) {}
  }

  const copyToClipboard = variable => {
    // Make sure variable is a string, not an object
    const textToCopy = typeof variable === 'string' ? variable : variable?.variableName || ''

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // alert(`Copied: ${textToCopy}`);
        setSnackbar({ open: true, message: `Copied: ${textToCopy}`, severity: 'success' })
        setTimeout(() => {
          setSnackbar({ ...snackbar, open: false })
        }, 2000) // Close snackbar after 2 seconds
      })
      .catch(err => console.error('Failed to copy text', err))
  }

  const generateFullHTML = () => {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Generated Content</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border: 1px solid black; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 10px; text-align: center; }
                img { display: block; margin: 0 auto; }
            </style>
        </head>
        <body>
            ${content}
        </body>
        </html>`
  }

  const handleSubmit = async () => {
    try {
      const fullHTML = generateFullHTML()
      const response = await updateTemplate(fullHTML, templateData._id)


      if (response.status) {
        alert('Content saved successfully!')
        localStorage.removeItem('templateData')
        router.push('/commandexe/templates/pdflists') // Adjust this path as needed
      } else {
        alert('Failed to save content.')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('An error occurred while saving content.')
    }
  }

  // Stop propagation for the select dropdown to prevent standard select behavior
  const handleSelectClick = e => {
    // Keep the dropdown open
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      {/* <div>
                {variables.map((variable, index) => (
                    <div key={index} style={{ display: "inline-block", marginRight: "10px" }}>
                        <span>{variable.variableName}</span>
                        <button onClick={() => copyToClipboard(variable.variableName)} style={{ marginLeft: "5px" }}>Copy</button>
                    </div>
                ))}

            </div> */}
      <EmailProEditor
        tName={templateData.templateName}
        initialValue={content}
        onChange={handleChange}
        variables={variables}
        onSave={async data => {

          const fullHTML = generateFullHTML()
          const response = await updateEmailTemplate(fullHTML, data.templateName, templateData._id)
          if (response.status) {
            localStorage.removeItem('templateData')
            router.push('/emailTemplate/lists')
            return { success: true, message: 'Template updated successfully!' }
          }
          return { success: false, message: 'Failed to update template' }
        }}
      />
      {/* <Button onClick={handleSubmit} color="primary" variant="contained"  style={{ marginTop: "10px" }}>Update Content</Button> */}
      <Button
        onClick={() => router.push('/emailTemplate/lists')}
        color='primary'
        variant='contained'
        style={{ marginTop: '10px', marginLeft: '10px' }}
      >
        Back
      </Button>

      {/* Snackbar to show success/fail message */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          variant='filled'
          severity={snackbar.severity}
          sx={{ width: '100%', zIndex: '9999' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  )
}

export default React.memo(JoditEditorComponent)
