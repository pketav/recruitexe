import React, { useState, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  styled
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'

const getRandomColor = (name) => {
  const colors = ['#8c7ae6', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
  const index = name ? name.charCodeAt(0) % colors.length : 0
  return colors[index]
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const GroupModal = ({
  open,
  onClose,
  onCreateGroup,
  groupEmployees,
  loadingGroupEmployees,
  creatingGroup,
  baseUrl
}) => {
  const [groupName, setGroupName] = useState('')
  const [groupMembers, setGroupMembers] = useState([])
  const [searchGroupMembers, setSearchGroupMembers] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [groupPhoto, setGroupPhoto] = useState(null)
  const [groupPhotoUrl, setGroupPhotoUrl] = useState('')
  const [uploadingGroupPhoto, setUploadingGroupPhoto] = useState(false)
  const groupPhotoInputRef = useRef(null)

  const handleClose = () => {
    setGroupName('')
    setGroupMembers([])
    setSearchGroupMembers('')
    setGroupDescription('')
    setGroupPhoto(null)
    setGroupPhotoUrl('')
    onClose()
  }

  const toggleGroupMember = (employeeId) => {
    setGroupMembers(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId)
      } else {
        return [...prev, employeeId]
      }
    })
  }

  const getFilteredGroupEmployees = () => {
    if (!searchGroupMembers) return groupEmployees

    return groupEmployees.filter(
      emp =>
        emp.employeName?.toLowerCase().includes(searchGroupMembers.toLowerCase()) ||
        emp.workEmail?.toLowerCase().includes(searchGroupMembers.toLowerCase()) ||
        emp.userName?.toLowerCase().includes(searchGroupMembers.toLowerCase())
    )
  }

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

      const response = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${localStorage.getItem("authToken")}`,
        }
      })

      if (response.data.status) {
        const fileUrl = response.data.items.image
        setGroupPhotoUrl(fileUrl)
      } else {
        console.error('Group photo upload failed:', response.data.message)
      }
    } catch (error) {
      console.error('Error uploading group photo:', error)
    } finally {
      setUploadingGroupPhoto(false)
    }
  }

  const handleCreateGroup = () => {
    if (!groupName.trim() || groupMembers.length === 0) {
      return
    }

    const groupData = {
      groupName: groupName.trim(),
      participantIds: groupMembers,
      description: groupDescription.trim(),
      groupPhoto: groupPhotoUrl
    }

    onCreateGroup(groupData)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Create New Group
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Group Photo Upload */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              mr: 2,
              overflow: 'hidden'
            }}
            onClick={() => groupPhotoInputRef.current?.click()}
          >
            {uploadingGroupPhoto ? (
              <CircularProgress size={30} />
            ) : groupPhotoUrl ? (
              <img
                src={groupPhotoUrl}
                alt="Group"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <AddIcon sx={{ fontSize: 30, color: '#ccc' }} />
            )}
          </Box>
          <Box>
            <Typography variant="subtitle2">Group Photo</Typography>
            <Typography variant="caption" color="text.secondary">
              Click to upload photo
            </Typography>
          </Box>
          <input
            type="file"
            accept="image/*"
            ref={groupPhotoInputRef}
            onChange={handleGroupPhotoSelect}
            style={{ display: 'none' }}
          />
        </Box>

        {/* Group Name */}
        <TextField
          fullWidth
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          margin="normal"
          required
        />

        {/* Group Description */}
        <TextField
          fullWidth
          label="Description (Optional)"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          margin="normal"
          multiline
          rows={2}
        />

        {/* Member Search */}
        <TextField
          fullWidth
          label="Search Members"
          value={searchGroupMembers}
          onChange={(e) => setSearchGroupMembers(e.target.value)}
          margin="normal"
          placeholder="Search by name or email..."
        />

        {/* Members List */}
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          Select Members ({groupMembers.length} selected)
        </Typography>

        <Box sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
          {loadingGroupEmployees ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List dense>
              {getFilteredGroupEmployees()?.map(employee => (
                <ListItem key={employee._id} button onClick={() => toggleGroupMember(employee._id)}>
                  <Checkbox
                    checked={groupMembers.includes(employee._id)}
                    onChange={() => toggleGroupMember(employee._id)}
                  />
                  <ListItemAvatar>
                    <Avatar
                      src={employee.employeePhoto}
                      sx={{ bgcolor: getRandomColor(employee.employeName) }}
                    >
                      {!employee.employeePhoto && getInitials(employee.employeName)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={employee.employeName}
                    secondary={employee.workEmail || employee.userName}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleCreateGroup}
          disabled={!groupName.trim() || groupMembers.length === 0 || creatingGroup}
          sx={{
            backgroundColor: '#8c7ae6',
            '&:hover': { backgroundColor: '#7266ba' }
          }}
        >
          {creatingGroup ? <CircularProgress size={20} /> : 'Create Group'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const GroupList = ({ 
  tabValue, 
  onOpenGroupModal,
  groupModalProps 
}) => {
  if (tabValue !== 1) return null

  return (
    <>
      {/* <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={onOpenGroupModal}
        fullWidth
        sx={{
          mb: 2,
          borderRadius: '25px',
          backgroundColor: '#8c7ae6',
          '&:hover': {
            backgroundColor: '#7266ba'
          }
        }}
      >
        Create New Group
      </Button> */}

      <GroupModal {...groupModalProps} />
    </>
  )
}

export default GroupList