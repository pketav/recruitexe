'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TableSortLabel,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  styled
} from '@mui/material'
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  TableChart as TableIcon,
  MoreVert as MoreVertIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  CloudDownload as DownloadIcon,
  DriveFileRenameOutline as RenameIcon
} from '@mui/icons-material'

// Styled components for Windows-like UI
const WindowsTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0.75, 1),
  borderBottom: '1px solid #f0f0f0',
  fontSize: '0.875rem'
}))

const WindowsTableHeaderCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0.75, 1),
  borderBottom: '1px solid #e0e0e0',
  backgroundColor: '#f8f8f8',
  fontSize: '0.875rem',
  fontWeight: 'bold',
  color: theme.palette.text.secondary
}))

export default function FileList({
  files,
  folders,
  currentPath,
  onFolderClick,
  viewMode = 'list',
  onSelectionChange = () => {}
}) {
  const [selected, setSelected] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [contextMenu, setContextMenu] = useState(null)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)

  // Report selection changes to parent component
  useEffect(() => {
    onSelectionChange(selected)
  }, [selected, onSelectionChange])

  // Reset selection when path changes
  useEffect(() => {
    setSelected([])
  }, [currentPath])

  // Format file size
  const formatSize = bytes => {
    if (!bytes && bytes !== 0) return '-'
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format date
  const formatDate = dateString => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date
      .toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
      .replace(',', '')
  }

  const isEmpty = (!files || files.length === 0) && (!folders || folders.length === 0)

  // Combine files and folders for sorting
  const allItems = [
    ...(folders || []).map(folder => ({ ...folder, type: 'folder' })),
    ...(files || []).map(file => ({ ...file, type: 'file' }))
  ]

  // Sorting function
  const descendingComparator = (a, b, orderBy) => {
    // Folders always come before files
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1
    }

    // For same types, compare by the orderBy property
    if (orderBy === 'size') {
      if (a.type === 'folder') return 0 // Folders don't have size
      return b.size < a.size ? -1 : b.size > a.size ? 1 : 0
    }

    if (orderBy === 'lastModified') {
      if (a.type === 'folder') return 0 // If we don't have lastModified for folders
      const dateA = new Date(a.lastModified || 0)
      const dateB = new Date(b.lastModified || 0)
      return dateB < dateA ? -1 : dateB > dateA ? 1 : 0
    }

    // Default case for name
    const nameA = (a.name || '').toLowerCase()
    const nameB = (b.name || '').toLowerCase()
    return nameB < nameA ? -1 : nameB > nameA ? 1 : 0
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  const sortedItems = [...allItems].sort(getComparator(order, orderBy))

  // Sorting handler
  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // Selection handlers
  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = allItems.map(item => item.key)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, key) => {
    const selectedIndex = selected.indexOf(key)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, key)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const isSelected = key => selected.indexOf(key) !== -1

  // Context menu handlers
  const handleContextMenu = (event, item) => {
    event.preventDefault()
    if (!isSelected(item.key)) {
      setSelected([item.key])
    }
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      item: item
    })
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }

  // Action menu handlers
  const handleActionMenuOpen = event => {
    setActionMenuAnchor(event.currentTarget)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null)
  }

  const handleFolderDoubleClick = folderKey => {
    onFolderClick(folderKey)
  }

  // Function to get the appropriate icon for a file based on its extension
  const getFileIcon = fileName => {
    if (!fileName) return <FileIcon fontSize='small' sx={{ color: '#607d8b' }} />

    const extension = fileName.split('.').pop().toLowerCase()

    switch (extension) {
      case 'pdf':
        return <PdfIcon fontSize='small' sx={{ color: '#e53935' }} />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon fontSize='small' sx={{ color: '#7b1fa2' }} />
      case 'doc':
      case 'docx':
        return <DescriptionIcon fontSize='small' sx={{ color: '#1565c0' }} />
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <TableIcon fontSize='small' sx={{ color: '#2e7d32' }} />
      case 'js':
      case 'html':
      case 'css':
      case 'json':
      case 'xml':
        return <CodeIcon fontSize='small' sx={{ color: '#f57c00' }} />
      default:
        return <FileIcon fontSize='small' sx={{ color: '#607d8b' }} />
    }
  }

  const renderListView = () => {
    return (
      <TableContainer
        sx={{
          flex: 1,
          boxShadow: 'none',
          height: '100%',
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f8f8f8'
          }
        }}
      >
        <Table stickyHeader size='small'>
          <TableHead>
            <TableRow>
              <WindowsTableHeaderCell padding='checkbox' sx={{ width: 40 }}>
                <Checkbox
                  size='small'
                  indeterminate={selected.length > 0 && selected.length < allItems.length}
                  checked={allItems.length > 0 && selected.length === allItems.length}
                  onChange={handleSelectAllClick}
                />
              </WindowsTableHeaderCell>
              <WindowsTableHeaderCell sx={{ width: '40%' }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </WindowsTableHeaderCell>
              <WindowsTableHeaderCell sx={{ width: '12%' }}>Type</WindowsTableHeaderCell>
              <WindowsTableHeaderCell sx={{ width: '12%' }}>
                <TableSortLabel
                  active={orderBy === 'size'}
                  direction={orderBy === 'size' ? order : 'asc'}
                  onClick={() => handleRequestSort('size')}
                >
                  Size
                </TableSortLabel>
              </WindowsTableHeaderCell>
              <WindowsTableHeaderCell sx={{ width: '20%' }}>
                <TableSortLabel
                  active={orderBy === 'lastModified'}
                  direction={orderBy === 'lastModified' ? order : 'asc'}
                  onClick={() => handleRequestSort('lastModified')}
                >
                  Date Modified
                </TableSortLabel>
              </WindowsTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems.map(item => {
              const isItemSelected = isSelected(item.key)
              const isFolder = item.type === 'folder'

              return (
                <TableRow
                  hover
                  onClick={event => handleClick(event, item.key)}
                  onDoubleClick={() => isFolder && handleFolderDoubleClick(item.key)}
                  onContextMenu={event => handleContextMenu(event, item)}
                  role='checkbox'
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={item.key}
                  selected={isItemSelected}
                  sx={{
                    cursor: 'pointer',
                    // height: '32px',
// background:'red',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)'
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.12)'
                    }
                  }}
                >
                  <WindowsTableCell padding='checkbox'>
                    <Checkbox
                      size='small'
                      checked={isItemSelected}
                      onClick={event => event.stopPropagation()}
                      onChange={event => handleClick(event, item.key)}
                    />
                  </WindowsTableCell>
                  <WindowsTableCell component='th' scope='row' sx={{ display: 'flex', alignItems: 'center' }}>
                    {isFolder ? (
                      <FolderIcon sx={{ mr: 1, color: 'gold', fontSize: '1.2rem' }} />
                    ) : (
                      <Box sx={{ mr: 1 }}>{getFileIcon(item.name)}</Box>
                    )}
                    <Typography variant='body2' noWrap>
                      {item.name}
                    </Typography>
                  </WindowsTableCell>
                  <WindowsTableCell>
                    <Typography variant='body2' noWrap>
                      {isFolder ? 'Folder' : item.name && item.name.split('.').pop().toUpperCase() + ' File'}
                    </Typography>
                  </WindowsTableCell>
                  <WindowsTableCell>
                    <Typography variant='body2' noWrap>
                      {isFolder ? '-' : formatSize(item.size)}
                    </Typography>
                  </WindowsTableCell>
                  <WindowsTableCell>
                    <Typography variant='body2' noWrap>
                      {isFolder ? '-' : formatDate(item.lastModified)}
                    </Typography>
                  </WindowsTableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const renderGridView = () => {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 1.5,
          p: 2,
          overflow: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f8f8f8'
          }
        }}
      >
        {sortedItems.map(item => {
          const isItemSelected = isSelected(item.key)
          const isFolder = item.type === 'folder'

          return (
            <Box
              key={item.key}
              onClick={event => handleClick(event, item.key)}
              onDoubleClick={() => isFolder && handleFolderDoubleClick(item.key)}
              onContextMenu={event => handleContextMenu(event, item)}
              sx={{
                p: 1,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.1s',
                bgcolor: isItemSelected ? 'action.selected' : 'transparent',
                border: isItemSelected ? '1px solid #bdbdbd' : '1px solid transparent',
                borderRadius: '2px',
                '&:hover': {
                  bgcolor: 'action.hover'
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 100,
                position: 'relative'
              }}
            >
              {isItemSelected && (
                <Checkbox
                  size='small'
                  checked={true}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    padding: 0.5
                  }}
                />
              )}
              <Box sx={{ mb: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isFolder ? (
                  <FolderIcon sx={{ fontSize: 40, color: 'gold' }} />
                ) : (
                  <Box sx={{ fontSize: 40, color: 'primary.main' }}>{getFileIcon(item.name)}</Box>
                )}
              </Box>
              <Typography
                variant='caption'
                component='div'
                noWrap
                title={item.name}
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  lineHeight: '1.2',
                  fontWeight: 'normal'
                }}
              >
                {item.name}
              </Typography>
            </Box>
          )
        })}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }}
    >
      {/* Selection actions toolbar - only shows when items are selected */}
      {selected.length > 0 && (
        <Toolbar
          variant='dense'
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f0f0f0',
            minHeight: '40px !important'
          }}
        >
          <Typography sx={{ flex: '1 1 100%' }} variant='body2' component='div'>
            {selected.length} {selected.length === 1 ? 'item' : 'items'} selected
          </Typography>

          <Tooltip title='Actions'>
            <IconButton size='small' onClick={handleActionMenuOpen}>
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Menu anchorEl={actionMenuAnchor} open={Boolean(actionMenuAnchor)} onClose={handleActionMenuClose}>
            <MenuItem onClick={handleActionMenuClose}>
              <ListItemIcon>
                <DownloadIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Download</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleActionMenuClose}>
              <ListItemIcon>
                <CopyIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleActionMenuClose}>
              <ListItemIcon>
                <RenameIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Rename</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleActionMenuClose}>
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      )}

      {/* Content */}
      {isEmpty ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography variant='body1' color='text.secondary'>
            This folder is empty
          </Typography>
        </Box>
      ) : viewMode === 'list' ? (
        renderListView()
      ) : (
        renderGridView()
      )}

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference='anchorPosition'
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        {contextMenu?.item?.type === 'folder' && (
          <MenuItem
            onClick={() => {
              handleFolderDoubleClick(contextMenu.item.key)
              handleCloseContextMenu()
            }}
          >
            <ListItemIcon>
              <FolderIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Open</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleCloseContextMenu}>
          <ListItemIcon>
            <DownloadIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>
          <ListItemIcon>
            <CopyIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>
          <ListItemIcon>
            <RenameIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseContextMenu}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
