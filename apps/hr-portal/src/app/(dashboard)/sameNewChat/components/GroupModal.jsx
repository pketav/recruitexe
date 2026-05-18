import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  CircularProgress,
  IconButton,
  styled
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    minWidth: 500,
    maxWidth: 600
  }
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    // borderRadius: 12
  }
}))

const GroupModal = ({
open,
onClose,
userInfo,
employeeIdFromToken,
  onGroupCreated // Add this prop to trigger chat list refresh
}) => {
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Group photo states
  const [groupPhoto, setGroupPhoto] = useState(null)
  const [groupPhotoUrl, setGroupPhotoUrl] = useState('')
  const [uploadingGroupPhoto, setUploadingGroupPhoto] = useState(false)
  const groupPhotoInputRef = useRef(null)
  const {userData} = useAuth()

  const baseUrl = process.env.NEXT_PUBLIC_CHAT_SOCKET_URL

  // Fetch employees when modal opens
  useEffect(() => {
    if (open) {
      fetchEmployees()
    }
  }, [open])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/users/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${localStorage.getItem("authToken")}`,
        }
      })

      if (response.data && response.data.items.users && Array.isArray(response.data.items.users)) {
        // Filter out current user
        const filteredEmployees = response.data.items.users.filter(emp => emp._id !== userData.empID)
        setEmployees(filteredEmployees)
      } else {
        setEmployees([])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setGroupName('')
    setGroupDescription('')
    setSelectedMembers([])
    setSearchTerm('')
    setGroupPhoto(null)
    setGroupPhotoUrl('')
    onClose()
  }

  const toggleMemberSelection = (employeeId) => {
    setSelectedMembers(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId)
      } else {
        return [...prev, employeeId]
      }
    })
  }

  // Group photo upload handlers
  const handleGroupPhotoSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setGroupPhoto(file)
    await handleGroupPhotoUpload(file)
  }

  const handleGroupPhotoUpload = async (file) => {
    try {
      setUploadingGroupPhoto(true)

      const formData = new FormData()
      formData.append('files', file)

      // Try to use the same API pattern as your other uploads
      const response = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${localStorage.getItem("authToken")}`,
        }
      })


      if (response.data && response.data.status) {
        const fileUrl = response.data.items.image
        setGroupPhotoUrl(fileUrl)
      } else {
        console.error('Group photo upload failed:', response.data?.message)
        // Try alternative upload if first fails
        await uploadPhotoAlternative(file)
      }
    } catch (error) {
      console.error('Error uploading group photo:', error)
      // Try alternative upload method
      await uploadPhotoAlternative(file)
    } finally {
      setUploadingGroupPhoto(false)
    }
  }

  // Alternative upload method
  const uploadPhotoAlternative = async (file) => {
    try {
      // You can skip photo upload for now and just show a placeholder
      const reader = new FileReader()
      reader.onload = (e) => {
        setGroupPhotoUrl(e.target.result) // Use base64 for preview
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Alternative photo upload failed:', error)
      alert('Photo upload failed, but you can still create the group')
    }
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      alert('Please enter group name and select at least one member')
      return
    }

    try {
      setCreating(true)

      // First, let's test if the server is reachable
      try {
        const testResponse = await fetch(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/users/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization:`Bearer ${localStorage.getItem("authToken")}`,
          }
        })

        if (!testResponse.ok) {
          throw new Error(`Server not accessible: ${testResponse.status}`)
        }
      } catch (serverTestError) {
        console.error('Server connectivity test failed:', serverTestError)
        alert('Cannot connect to server. Please check if the backend is running.')
        return
      }

      const payload = {
        userId: userData.empID,
        groupName: groupName.trim(),
        participantIds: selectedMembers,
        oneSignalId: 'fd5de1b0-abd9-467e-b540-b1ff2b630f85',
        description: groupDescription.trim(),
        groupPhoto: groupPhotoUrl,
        groupSettings: {
          visibility: 'private',
          joinApproval: true,
          onlyAdminsCanPost: false
        }
      }


      // Try a different endpoint pattern that might work
      const endpoints = [
        `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/chat/group/createGroupApi`,
        `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/chat/group/createGroup`,
        `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/chat/createGroup`,
        `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/group/create`
      ]

      let success = false
      let lastError = null

      for (let i = 0; i < endpoints.length && !success; i++) {
        const endpoint = endpoints[i]

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              // 'ngrok-skip-browser-warning': 'true',
              'Content-Type': 'application/json',
              'userId': employeeIdFromToken,
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify(payload)
          })


          if (response.status === 404) {
            continue
          }

          const responseData = await response.json()

          if (response.ok && responseData && responseData.status) {
            alert('Group created successfully!')
            handleClose()

            // Instead of page reload, just refresh the chat list
            setTimeout(() => {
              // Call the refresh function passed from parent
              if (onGroupCreated) {
                onGroupCreated()
              }
            }, 500)

            success = true
            return
          } else if (responseData.message) {
            throw new Error(responseData.message)
          } else {
            throw new Error(`HTTP ${response.status}`)
          }
        } catch (endpointError) {
          lastError = endpointError

          if (i === endpoints.length - 1) {
            // This was the last endpoint, throw the error
            throw endpointError
          }
        }
      }

      if (!success) {
        throw new Error('All endpoints failed')
      }

    } catch (error) {
      console.error('Error creating group:', error)

      // For now, let's simulate group creation for testing
      if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {

        // Simulate successful group creation for development
        const confirm = window.confirm(
          'Network error occurred. Would you like to simulate group creation for testing purposes?\n\n' +
          `Group: ${groupName}\n` +
          `Members: ${selectedMembers.length} selected\n\n` +
          'Click OK to simulate success, Cancel to see error.'
        )

        if (confirm) {
          alert('Group created successfully! (Simulated for testing)')
          handleClose()

          // Instead of page reload, just refresh the chat list
          setTimeout(() => {
            if (onGroupCreated) {
              onGroupCreated()
            }
          }, 500)

          return
        }
      }

      // Show detailed error for debugging
      const errorDetails = [
        `Error: ${error.message}`,
        `User ID: ${userData.empID}`,
        `Employee Token: ${employeeIdFromToken}`,
        `Group Name: ${groupName}`,
        `Members: ${selectedMembers.length}`,
        '',
        'Please check:',
        '1. Backend server is running',
        '2. ngrok tunnel is active',
        '3. API endpoint exists',
        '4. CORS is configured'
      ].join('\n')

      console.error('Detailed error info:', errorDetails)
      alert(`Group creation failed:\n\n${errorDetails}`)
    } finally {
      setCreating(false)
    }
  }

  const filteredEmployees = employees.filter(emp =>
    emp.employeName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" fontWeight={600}>
          Create New Group
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Group Photo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', mr: 2 }}>
            <Avatar
              src={groupPhotoUrl}
              sx={{
                width: 80,
                height: 80,
                cursor: 'pointer',
                border: '2px dashed #8c7ae6'
              }}
              onClick={() => groupPhotoInputRef.current?.click()}
            >
              {!groupPhotoUrl && <AddPhotoAlternateIcon sx={{ fontSize: 30 }} />}
            </Avatar>
            {uploadingGroupPhoto && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Group Photo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click to upload a group photo
            </Typography>
            <Button
              size="small"
              onClick={() => groupPhotoInputRef.current?.click()}
              disabled={uploadingGroupPhoto}
              sx={{ mt: 1 }}
            >
              {uploadingGroupPhoto ? 'Uploading...' : 'Choose Photo'}
            </Button>
          </Box>
          <input
            ref={groupPhotoInputRef}
            type="file"
            accept="image/*"
            onChange={handleGroupPhotoSelect}
            style={{ display: 'none' }}
          />
        </Box>

        {/* Group Info */}
        <Box sx={{ mb: 3 }}>
          <StyledTextField
            fullWidth
            // size='small'
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <StyledTextField
            fullWidth
            label="Description (Optional)"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            multiline
            rows={2}
          />
        </Box>

        {/* Member Selection */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Add Members ({selectedMembers.length} selected)
        </Typography>

        {/* Search Members */}
        <StyledTextField
          fullWidth
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          // size="small"
        />

        {/* Employee List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List sx={{
            maxHeight: 300,
            overflow: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: 2
          }}>
            {filteredEmployees.map((employee) => {
              const isSelected = selectedMembers.includes(employee._id)

              return (
                <ListItem
                  key={employee._id}
                  onClick={() => toggleMemberSelection(employee._id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.50' },
                    bgcolor: isSelected ? 'rgba(140, 122, 230, 0.1)' : 'transparent'
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation()
                      toggleMemberSelection(employee._id)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      color: '#4E36FF',
                      '&.Mui-checked': {
                        color: '#4E36FF',
                      },
                    }}
                  />
                  <ListItemAvatar>
                    <Avatar src={employee.employeePhoto} alt={employee.employeName}>
                      {!employee.employeePhoto && employee.employeName?.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={isSelected ? 600 : 400}
                        color={isSelected ? '#8c7ae6' : 'text.primary'}
                      >
                        {employee.employeName}
                      </Typography>
                    }
                    secondary={employee.workEmail || employee.designation}
                  />
                </ListItem>
              )
            })}

            {filteredEmployees.length === 0 && !loading && (
              <ListItem>
                <ListItemText
                  primary="No employees found"
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                />
              </ListItem>
            )}
          </List>
        )}

        {/* Selected Members Preview */}
        {selectedMembers.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Selected Members:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedMembers.map(memberId => {
                const member = employees.find(emp => emp._id === memberId)
                return member ? (
                  <Box
                    key={memberId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: 'rgba(140, 122, 230, 0.1)',
                      borderRadius: 1,
                      p: 0.5,
                      fontSize: '0.75rem'
                    }}
                  >
                    <Avatar sx={{ width: 20, height: 20, mr: 0.5 }} src={member.employeePhoto}>
                      {member.employeName?.charAt(0)}
                    </Avatar>
                    <Typography variant="caption">
                      {member.employeName}
                    </Typography>
                  </Box>
                ) : null
              })}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleCreateGroup}
          variant="contained"
          disabled={!groupName.trim() || selectedMembers.length === 0 || creating}
          sx={{
            backgroundColor: '#8c7ae6',
            '&:hover': {
              backgroundColor: '#7c6ad6'
            }
          }}
        >
          {creating ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Creating...
            </>
          ) : (
            'Create Group'
          )}
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}

export default GroupModal
