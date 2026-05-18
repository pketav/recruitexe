'use client';

import React from 'react'
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DeleteIcon from '@mui/icons-material/Delete'

const DeleteMessageMenu = ({ anchorEl, open, onClose, onDeleteForMe, onDeleteForEveryone, isSender }) => {
  const handleDeleteForMe = () => {
    onDeleteForMe()
    onClose()
  }

  const handleDeleteForEveryone = () => {
    onDeleteForEveryone()
    onClose()
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 200,
          boxShadow: 3,
        },
      }}
    >
      <MenuItem onClick={handleDeleteForMe}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Delete for me" />
      </MenuItem>
      
      {isSender && (
        <>
          <Divider />
          <MenuItem onClick={handleDeleteForEveryone}>
            <ListItemIcon>
              <DeleteForeverIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primary="Delete for everyone" primaryTypographyProps={{ color: 'error' }} />
          </MenuItem>
        </>
      )}
    </Menu>
  )
}

export default DeleteMessageMenu
