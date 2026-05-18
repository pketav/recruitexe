'use client';

import React from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  CircularProgress,
  styled
} from '@mui/material'

const ChatListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: 8,
  padding: '12px 16px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f8f8fb'
  }
}))

const SearchResults = ({
  results,
  loading,
  pageHeight,
  onEmployeeSelect,
  tabValue
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (results.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No {tabValue === 0 ? 'employees' : 'groups'} found
        </Typography>
      </Box>
    )
  }

  return (
    <List sx={{ maxHeight: pageHeight - 200, overflow: 'auto', px: 2 }}>
      {results.map((employee) => (
        <ChatListItem
          key={employee._id}
          onClick={() => onEmployeeSelect(employee)}
        >
          <ListItemAvatar>
            <Avatar src={employee.employeePhoto} alt={employee.employeName}>
              {!employee.employeePhoto && employee.employeName?.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={employee.employeName}
            secondary={employee.workEmail || employee.designation}
          />
        </ChatListItem>
      ))}
    </List>
  )
}

export default SearchResults