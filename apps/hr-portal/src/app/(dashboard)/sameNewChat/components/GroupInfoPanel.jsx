// Enhanced GroupInfoPanel.jsx
'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  InputBase,
  Drawer,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  CircularProgress,
  Paper,
  Fade,
  Chip
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import axios from 'axios'

export default function GroupInfoDrawer({
  groupInfo,
  open,
  onClose,
  onChatRefresh,
  onRefresh
}) {
  const [editName, setEditName] = useState(false)
  const [groupName, setGroupName] = useState(groupInfo?.group?.name || '')
  const [employees, setEmployees] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState([])

  const isAdmin = groupInfo?.group?.isAdmin
  const roomId = groupInfo?._id

  const onUpdateGroup = async ({ groupId, name }) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/admin/updateGroupInfo`,
        {
          roomId: groupId,
          name,
          description: '',
          image: ''
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      )
      onChatRefresh()
      onRefresh()
    } catch (error) {
      console.error('Failed to update group info:', error)
    }
  }

  const handleGroupNameChange = () => {
    onUpdateGroup({ groupId: roomId, name: groupName })
    setEditName(false)
  }

  const fetchEmployees = async () => {
    try {
      setLoadingUsers(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/users/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      if (response.data?.items?.users) {
        const groupUserIds = groupInfo.recipients.map(user => user._id)
        const filtered = response.data.items.users.filter(
          user => !groupUserIds.includes(user._id)
        )
        setEmployees(filtered)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setEmployees([])
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(()=>{
    setGroupName(groupInfo?.group?.name)
  },[groupInfo?.group])

  const handleAddUsers = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/admin/addUser`,
        {
          roomId,
          userIds: selectedUserIds
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      )
      setAddDialogOpen(false)
      setSelectedUserIds([])
      onClose()
      onChatRefresh()
    } catch (error) {
      console.error('Failed to add users:', error)
    }
  }

  const openAddDialog = () => {
    fetchEmployees()
    setAddDialogOpen(true)
  }

  const handleRemoveMember = async (userId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/admin/removeUser`, {
        roomId,
        userId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      onClose()
      onChatRefresh()
    } catch (error) {
      console.error('Error removing user:', error)
    }
  }

  const handleMakeAdmin = async (userId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/admin/makeAdmin`, {
        roomId,
        userId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      onClose()
      onChatRefresh()
    } catch (error) {
      console.error('Error making admin:', error)
    }
  }

  const handleRemoveAdmin = async (userId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/api/admin/removeAdmin`, {
        roomId,
        userId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      onClose()
      onChatRefresh()
    } catch (error) {
      console.error('Error removing admin:', error)
    }
  }

  return (
    <>
      <Drawer 
        anchor='right' 
        open={open} 
        onClose={onClose} 
        PaperProps={{ 
          sx: { 
            width: 350, 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            backdropFilter: 'blur(10px)'
          } 
        }}
      >
        <Paper
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='h6' sx={{ color: 'white', fontWeight: 700 }}>
            Group Info
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Paper>

        <Box sx={{ p: 3 }}>
          <Fade in timeout={600}>
            <Box display='flex' flexDirection='column' alignItems='center' mb={3}>
              <Avatar
                src={groupInfo?.group?.groupPhoto}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mb: 2,
                  border: '4px solid rgba(102, 126, 234, 0.2)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                }}
              >
                {!groupInfo?.group?.groupPhoto && groupInfo?.group?.name?.[0]}
              </Avatar>
              
              {editName ? (
                <InputBase
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  onBlur={handleGroupNameChange}
                  autoFocus
                  sx={{ 
                    fontSize: 20, 
                    fontWeight: 700, 
                    textAlign: 'center',
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 2,
                    px: 2,
                    py: 1
                  }}
                />
              ) : (
                <Box display='flex' alignItems='center' gap={1}>
                  <Typography fontSize={20} fontWeight={700}>
                    {groupInfo?.group?.name}
                  </Typography>
                  {isAdmin && (
                    <IconButton 
                      size='small' 
                      onClick={() => setEditName(true)}
                      sx={{
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
                      }}
                    >
                      <EditIcon fontSize='small' sx={{ color: '#667eea' }} />
                    </IconButton>
                  )}
                </Box>
              )}
              
              <Chip
                label={`${groupInfo?.group?.participantCount} participants`}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  fontWeight: 600
                }}
              />
            </Box>
          </Fade>

          <Divider sx={{ mb: 3 }} />

          {isAdmin && (
            <Fade in timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: 'rgba(102, 126, 234, 0.05)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                  }
                }}
                onClick={openAddDialog}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32 }}>
                    <PersonAddIcon fontSize="small" />
                  </Avatar>
                  <Typography fontWeight={600} color="#667eea">
                    Add Participants
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          )}

          <Typography variant='subtitle2' gutterBottom fontWeight={700} color='text.secondary' sx={{ mb: 2 }}>
            Members
          </Typography>
          
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {groupInfo?.recipients?.map((user, index) => (
              <Fade in timeout={600 + index * 100} key={user._id}>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                      transform: 'translateX(4px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Box display='flex' alignItems='center' gap={2}>
                    <Avatar 
                      src={user.employeePhoto}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: '2px solid rgba(102, 126, 234, 0.2)'
                      }}
                    >
                      {!user.employeePhoto && user.name[0]}  
                    </Avatar>
                    <Typography fontWeight={600} display="flex" alignItems="center" gap={1}>
                      {user.name}
                      {groupInfo?.group?.admins?.some(item => item._id === user._id) && (
                        <Chip
                          label="Admin"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            color: '#3b82f6',
                            fontWeight: 500,
                            height: 22,
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </Typography>
                  </Box>
                  
                  {isAdmin && (
                    <Box display='flex' gap={1}>
                      <Tooltip title='Remove Member'>
                        <IconButton 
                          onClick={() => handleRemoveMember(user._id)}
                          sx={{
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            '&:hover': { 
                              bgcolor: 'rgba(239, 68, 68, 0.2)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DeleteIcon sx={{ color: '#ef4444', fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                     {!groupInfo?.group?.admins?.some(item => item._id === user._id) && <Tooltip title='Make Admin'>
                        <IconButton 
                          onClick={() => handleMakeAdmin(user._id)}
                          sx={{
                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                            '&:hover': { 
                              bgcolor: 'rgba(59, 130, 246, 0.2)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <AdminPanelSettingsIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>}
                      {groupInfo?.group?.admins?.some(item => item._id === user._id) && <Tooltip title='Remove Admin'>
                        <IconButton 
                          onClick={() => handleRemoveAdmin(user._id)}
                          sx={{
                            bgcolor: 'rgba(245, 158, 11, 0.1)',
                            '&:hover': { 
                              bgcolor: 'rgba(245, 158, 11, 0.2)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <RemoveCircleOutlineIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>}
                    </Box>
                  )}
                </Paper>
              </Fade>
            ))}
          </Box>
        </Box>
      </Drawer>

      {/* Enhanced Add Users Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          color: 'white',
          fontWeight: 700
        }}>
          Select Users to Add
        </DialogTitle>
        <DialogContent sx={{ p: 3,mt:3 }}>
          {loadingUsers ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Select
            fullWidth
            multiple
            value={selectedUserIds}
            onChange={e => setSelectedUserIds(e.target.value)}
            renderValue={selected => `${selected.length} selected`}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(102, 126, 234, 0.3)',
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300, // Adjust height as needed
                },
              },
            }}
          >
            {employees.map(user => (
              <MenuItem key={user._id} value={user._id}>
                <Checkbox checked={selectedUserIds.includes(user._id)} />
                <ListItemText primary={user.employeName} />
              </MenuItem>
            ))}
          </Select>          
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setAddDialogOpen(false)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddUsers} 
            disabled={selectedUserIds.length === 0}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Add Users
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}