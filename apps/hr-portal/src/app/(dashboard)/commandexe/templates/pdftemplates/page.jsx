'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'

// Import the complete Jodit PRO Editor component
// Import API services
import {
  addTemplate,
  getAllPDFtemplatesAPI,
  getAllVariablesAPI,
  getMyPartnersAPI,
  getPartnerProductsAPI
} from '@/services/apiService'

import { useRouter } from 'next/navigation'
import JoditProEditor from '../JoditProEditor'

const PDFTemplatesPage = () => {
  // State management
  const [variables, setVariables] = useState([])
  const [products, setProducts] = useState([])
  const [partners, setPartners] = useState([])
  const [templates, setTemplates] = useState([])
  const [selectedPartner, setSelectedPartner] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const router = useRouter()

  // Initialize data on component mount
  useEffect(() => {
    initializeData()
  }, [])

  // Fetch products when partner changes
  useEffect(() => {
    if (selectedPartner) {
      fetchProducts(selectedPartner)
    }
  }, [selectedPartner])

  const initializeData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchVariables(),
        fetchPartners(),
        fetchTemplates()
      ])
    } catch (error) {
      console.error('Error initializing data:', error)
      setError('Failed to load initial data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const fetchVariables = async () => {
    try {
      const res = await getAllVariablesAPI()
      if (res && res.items) {
        setVariables(res.items)
      }
    } catch (error) {
      console.error('Error fetching variables:', error)
      throw error
    }
  }

  const fetchProducts = async (partnerId) => {
    try {
      const data = await getPartnerProductsAPI(partnerId)
      if (data.status && data.items) {
        setProducts(data.items)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchPartners = async () => {
    try {
      const data = await getMyPartnersAPI()
      if (data.status && data.items) {
        setPartners(data.items)
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      throw error
    }
  }

  const fetchTemplates = async () => {
    try {
      const res = await getAllPDFtemplatesAPI()
      if (res && res.items) {
        setTemplates(res.items)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      throw error
    }
  }

  // Handle partner selection
  const handlePartnerChange = (partnerId) => {
    setSelectedPartner(partnerId)
    setSelectedProduct('') // Reset product selection when partner changes
  }

  // Handle product selection
  const handleProductChange = (productId) => {
    setSelectedProduct(productId)
  }

  // Handle template save with enhanced error handling and success feedback
  const handleSaveTemplate = async (templateData) => {
    try {
      const { templateName, content, selectedProduct: productId, selectedPartner: partnerId } = templateData

      if (!templateName.trim()) {
        throw new Error('Template name is required')
      }

      if (!productId) {
        throw new Error('Please select a product')
      }

      if (!content.trim()) {
        throw new Error('Template content cannot be empty')
      }


      const response = await addTemplate(content, productId, templateName)

      if (response && response.status) {
        // Refresh templates list
        await fetchTemplates()
        
        // Navigate to templates list
        router.push('/templates/pdflists')
        
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

  // Handle content changes for any additional processing
  const handleContentChange = (content) => {
    // Optional: Add any real-time content processing here
  }

  // Handle variable copy for additional functionality
  const handleVariableCopy = (variableName) => {
    // Optional: Add analytics or tracking here
  }

  // Handle template load for additional processing
  const handleTemplateLoad = (htmlContent) => {
  }

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Loading Jodit PRO Editor...
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Initializing all premium features
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        flexDirection="column"
        gap={2}
      >
        <Typography variant="h6" color="error">
          Error Loading Editor
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box>


      {/* Jodit PRO Editor Component */}
      <JoditProEditor
        initialValue="" // Start with empty content
        variables={variables}
        templates={templates}
        partners={partners}
        products={products}
        isUpdate={false}
        selectedPartner={selectedPartner}
        selectedProduct={selectedProduct}
        onSave={handleSaveTemplate}
        onChange={handleContentChange}
        onVariableCopy={handleVariableCopy}
        onPartnerChange={handlePartnerChange}
        onProductChange={handleProductChange}
        onTemplateLoad={handleTemplateLoad}
        // PRO Editor configuration
        editorConfig={{
          // Additional custom configuration can be passed here
          theme: 'default',
          language: 'en',
          // Custom API endpoints
          googleTranslateApiKey: process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY,
          googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          // Custom upload endpoint
          uploaderUrl: '/api/upload',
          // AI Assistant configuration
          aiAssistantEnabled: true,
          // Enhanced features
          enableAdvancedFeatures: true
        }}
        showTabs={true} // Enable tabbed interface
        enableAutoSave={true} // Enable auto-save
        autoSaveInterval={300000} // 5 minutes
      />

     
    </Box>
  )
}

export default PDFTemplatesPage
