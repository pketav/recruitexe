'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Toolbar,
  AppBar,
  IconButton,
  Drawer,
  useTheme,
  Tooltip,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Button
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  Refresh,
  Menu as MenuIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  AccountCircle as AccountCircleIcon,
  CloudUpload as UploadIcon,
  CloudDownload as DownloadIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  DriveFileRenameOutline as RenameIcon,
  CreateNewFolder as NewFolderIcon,
  ContentCopy,
  Delete
} from '@mui/icons-material';

import FileList from './FileList';
import FolderTree from './FolderTree';
import SearchComponent from './Search';
import UploadComponent from './Upload';
import downloadService from './downloadService';

const drawerWidth = 260;

// Custom styled components for Windows-like UI
const LightToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: 40,
  padding: theme.spacing(0, 1),
  backgroundColor: '#f0f0f0',
  borderBottom: '1px solid #e0e0e0'
}));

const WindowsAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#f8f8f8',
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: '1px solid #e0e0e0'
}));

const FileExplorerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#ffffff'
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  padding: 6,
  color: theme.palette.text.secondary,
  '&.Mui-disabled': {
    color: theme.palette.action.disabled
  }
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: 6,
  color: theme.palette.primary.main,
  '&.Mui-disabled': {
    color: theme.palette.action.disabled
  }
}));

function Explorer() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([{ name: 'Root', path: '' }]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [viewMode, setViewMode] = useState('list');
  const [selectedItems, setSelectedItems] = useState([]);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch files and folders for the current path
  const fetchContents = async (path = '', addToHistory = true) => {
    setIsLoading(true);
    setError(null);
    setSelectedItems([]);

    // Add request tracking for debugging
    const requestId = Date.now();
    console.log(`[${requestId}] Starting request for path: "${path}"`);

    try {
      const response = await axios.get(`${baseUrl}/v1/api/fileShare/list-objects`, {
        params: {
          prefix: path
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage?.getItem('authToken')
        },
        timeout: 30000, // 30 seconds
        validateStatus: function (status) {
          // Don't throw for any status code, we'll handle it manually
          return true;
        }
      });

      console.log(`[${requestId}] Response received:`, {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      // Handle different HTTP status codes
      if (response.status === 408) {
        throw new Error('Request timeout. The server took too long to respond.');
      }

      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }

      if (response.status === 403) {
        throw new Error('Access denied. You don\'t have permission to view this folder.');
      }

      if (response.status === 404) {
        throw new Error('Folder not found.');
      }

      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }

      // Check if response has data
      if (!response.data) {
        console.error(`[${requestId}] No data in response`);
        throw new Error('No data received from server');
      }

      // Check API response status
      if (response.data.status === false || response.data.status === 'false') {
        console.error(`[${requestId}] API returned false status:`, response.data);

        // Check for specific error messages in the response
        const errorMessage = response.data?.message ||
                            response.data?.error ||
                            response.data?.errorMessage ||
                            'Failed to fetch folder contents';

        throw new Error(errorMessage);
      }

      // Check if we have the expected data structure
      if (!response.data.items) {
        console.error(`[${requestId}] Invalid response structure - missing items:`, response.data);

        // Some APIs might return data directly without wrapping in 'items'
        // Check if files and folders are at the root level
        if (response.data.files && response.data.folders) {
          console.log(`[${requestId}] Found files and folders at root level`);
          const data = response.data;

          setFiles(data.files || []);
          setFolders(data.folders || []);
          setCurrentPath(path);
          updateBreadcrumbs(path);

          if (addToHistory) {
            const newHistoryIndex = historyIndex + 1;
            const newHistory = [...navigationHistory.slice(0, newHistoryIndex), path];
            setNavigationHistory(newHistory);
            setHistoryIndex(newHistoryIndex);
          }

          return;
        }

        throw new Error('Invalid response format from server');
      }

      const data = response.data.items;

      // Validate data structure
      if (!data || typeof data !== 'object') {
        console.error(`[${requestId}] Invalid items data:`, data);
        throw new Error('Invalid data format received');
      }

      // Ensure files and folders are arrays
      const filesArray = Array.isArray(data.files) ? data.files : [];
      const foldersArray = Array.isArray(data.folders) ? data.folders : [];

      setFiles(filesArray);
      setFolders(foldersArray);
      setCurrentPath(data.prefix || path);

      // Update breadcrumbs
      updateBreadcrumbs(data.prefix || path);

      // Add to navigation history
      if (addToHistory) {
        const newHistoryIndex = historyIndex + 1;
        const newHistory = [...navigationHistory.slice(0, newHistoryIndex), path];
        setNavigationHistory(newHistory);
        setHistoryIndex(newHistoryIndex);
      }

      console.log(`[${requestId}] Successfully loaded:`, {
        files: filesArray.length,
        folders: foldersArray.length,
        path: data.prefix || path
      });

    } catch (err) {
      console.error(`[${requestId}] Failed to fetch contents:`, err);

      let errorMessage = 'Failed to fetch contents';

      if (axios.isTimeout(err)) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (axios.isCancel(err)) {
        errorMessage = 'Request was cancelled.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.response) {
        // The request was made and the server responded with an error status
        if (err.response.status === 408) {
          errorMessage = 'Server timeout. The request took too long to process.';
        } else {
          errorMessage = `Server error: ${err.response.status} - ${err.response.statusText}`;
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check if the server is running.';
      } else if (err.message) {
        // Use the error message we set above
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Clear data on error
      setFiles([]);
      setFolders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update breadcrumbs based on current path
  const updateBreadcrumbs = (path) => {
    if (!path) {
      setBreadcrumbs([{ name: 'Root', path: '' }]);
      return;
    }

    // Split the path into segments
    const segments = path.split('/').filter(Boolean);

    // Create breadcrumb items
    const crumbs = [{ name: 'Root', path: '' }];

    let currentSegment = '';

    segments.forEach((segment) => {
      currentSegment += segment + '/';
      crumbs.push({
        name: segment,
        path: currentSegment
      });
    });

    setBreadcrumbs(crumbs);
  };

  // Navigate to a folder
  const navigateToFolder = (folderPath) => {
    fetchContents(folderPath);
  };

  // Navigate using breadcrumbs
  const navigateToBreadcrumb = (path) => {
    fetchContents(path);
  };

  // Navigate to parent folder
  const navigateUp = () => {
    if (breadcrumbs.length > 1) {
      const parentCrumb = breadcrumbs[breadcrumbs.length - 2];
      fetchContents(parentCrumb.path);
    }
  };

  // Navigation history functions
  const navigateBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      fetchContents(navigationHistory[newIndex], false);
    }
  };

  const navigateForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      fetchContents(navigationHistory[newIndex], false);
    }
  };

  const refreshCurrentFolder = () => {
    fetchContents(currentPath, false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  };

  // Handle selected items from FileList
  const handleSelectionChange = (selectedKeys) => {
    setSelectedItems(selectedKeys);
  };

  // Action menu handlers
  const handleActionMenuOpen = (event) => {
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setActionAnchorEl(null);
  };

  // Handle download for files and folders
  const handleDownload = async () => {
    handleActionMenuClose();

    if (selectedItems.length === 0) {
      showSnackbar('No items selected for download', 'warning');
      return;
    }

    try {
      if (selectedItems.length === 1) {
        // Check if it's a file or folder
        const item = [...files, ...folders].find(item => item.key === selectedItems[0]);
        if (!item) return;

        if (item.type === 'folder' || folders.some(f => f.key === item.key)) {
          // It's a folder
          await downloadService.downloadFolder(item.key, item.name);
        } else {
          // It's a file
          await downloadService.downloadFile(item.key, item.name);
        }
      } else {
        // Multiple items selected
        await downloadService.downloadMultipleFiles(selectedItems, 'download.zip');
      }

      showSnackbar('Download started successfully', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showSnackbar('Failed to download: ' + error.message, 'error');
    }
  };

  // Handle delete operation
  const handleDelete = async () => {
    handleActionMenuClose();

    if (selectedItems.length === 0) {
      showSnackbar('No items selected for deletion', 'warning');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      return;
    }

    try {
      for (const key of selectedItems) {
        await axios.delete(`${baseUrl}/v1/api/fileShare/delete?key=${encodeURIComponent(key)}`, {
          headers: {
            'Authorization': localStorage?.getItem('authToken')
          }
        });
      }

      showSnackbar(`${selectedItems.length} item(s) deleted successfully`, 'success');
      refreshCurrentFolder();
    } catch (error) {
      console.error('Delete error:', error);
      showSnackbar('Failed to delete: ' + error.message, 'error');
    }
  };

  // Create a new folder
  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    try {
      const folderPath = currentPath ? `${currentPath}${folderName}/` : `${folderName}/`;

      await axios.post(`${baseUrl}/v1/api/fileShare/create-folder`,
        { path: folderPath },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage?.getItem('authToken')
          }
        }
      );

      showSnackbar('Folder created successfully', 'success');
      refreshCurrentFolder();
    } catch (error) {
      console.error('Folder creation error:', error);
      showSnackbar('Failed to create folder: ' + error.message, 'error');
    }
  };

  // Handle upload completion
  const handleUploadComplete = () => {
    refreshCurrentFolder();
    showSnackbar('Files uploaded successfully', 'success');
  };

  // Show snackbar notifications
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Initial data fetch
  useEffect(() => {
    fetchContents();
  }, []);

  return (
    <FileExplorerBox>

      {/* App Bar */}

      <WindowsAppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>

        <LightToolbar style={{height:'84px'}}>
          <IconButton
            edge="start"
            aria-label="toggle sidebar"
            onClick={toggleDrawer}
            size="small"
            sx={{ mr: 0.5 }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Typography variant="body1" component="div" sx={{ fontWeight: 'medium', mr: 2 }}>
            Finexe File Sharing
          </Typography>

          <NavigationButton
            size="small"
            disabled={historyIndex <= 0}
            onClick={navigateBack}
            aria-label="Back"
          >
            <ArrowBack fontSize="small" />
          </NavigationButton>

          <NavigationButton
            size="small"
            disabled={historyIndex >= navigationHistory.length - 1}
            onClick={navigateForward}
            aria-label="Forward"
          >
            <ArrowForward fontSize="small" />
          </NavigationButton>

          <NavigationButton
            size="small"
            disabled={breadcrumbs.length <= 1}
            onClick={navigateUp}
            aria-label="Up"
          >
            <ArrowUpward fontSize="small" />
          </NavigationButton>

          <NavigationButton
            size="small"
            onClick={refreshCurrentFolder}
            aria-label="Refresh"
          >
            <Refresh fontSize="small" />
          </NavigationButton>

          {/* <Box sx={{ mx: 1, pl: 1, borderLeft: '1px solid #e0e0e0' }}>
            <SearchComponent
              onNavigateToFolder={navigateToFolder}
              currentPath={currentPath}
            />
          </Box> */}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UploadComponent
              currentPath={currentPath}
              onUploadComplete={handleUploadComplete}
            />

            <Tooltip title="Create New Folder">
              <Button
                variant="outlined"
                startIcon={<NewFolderIcon />}
                onClick={handleCreateFolder}
                size="small"
                sx={{ borderRadius: 1 }}
              >
                New Folder
              </Button>
            </Tooltip>

            {selectedItems.length > 0 && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  size="small"
                  sx={{ borderRadius: 1 }}
                >
                  Download
                </Button>

                <Tooltip title="More Actions">
                  <IconButton
                    size="small"
                    onClick={handleActionMenuOpen}
                    color="primary"
                  >
                    <MenuIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <Tooltip title={viewMode === 'list' ? 'Grid View' : 'List View'}>
              <IconButton size="small" onClick={toggleViewMode} color="primary">
                {viewMode === 'list' ? <GridViewIcon fontSize="small" /> : <ViewListIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            <AccountCircleIcon sx={{ ml: 1, color: 'primary.main' }} />
          </Box>
        </LightToolbar>
      </WindowsAppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: '84px', // Height of the AppBar with custom toolbar
            height: 'calc(100% - 40px)',
            borderRight: '1px solid #e0e0e0',
            backgroundColor: '#f8f8f8'
          },
        }}
      >
        <Box sx={{
          overflow: 'auto',
          pt: 1,
          height: '100%',
          backgroundColor: '#f8f8f8',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f8f8f8',
          }
        }}>
          <Typography variant="subtitle2" sx={{ px: 2, py: 0.5, color: 'text.secondary' }}>
            Explorer
          </Typography>
          <FolderTree
            currentPath={currentPath}
            onNavigate={navigateToFolder}
          />
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '40px', // Height of the AppBar with custom toolbar
          // width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          width:'100%',
          padding:'12px',
          marginTop:'5px',
          // ml: { sm: `${drawerOpen ? drawerWidth : 0}px` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#ffffff',
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f8f8f8',
          }
        }}
      >

        {/* File location path bar */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          py: 0.75,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f8f8'
        }}>

          <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
            Location:
          </Typography>
          <Box sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            backgroundColor: '#ffffff',
            border: '1px solid #d0d0d0',
            borderRadius: '2px'
          }}>
            {breadcrumbs.map((crumb, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                {index > 0 && (
                  <Typography variant="body2" sx={{ mx: 0.5, color: 'text.secondary' }}>
                    &gt;
                  </Typography>
                )}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigateToBreadcrumb(crumb.path)}
                  sx={{
                    fontWeight: index === breadcrumbs.length - 1 ? 'bold' : 'normal',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    color: 'primary.main'
                  }}
                >
                  {crumb.name}
                </Link>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Main file content */}
        <Box sx={{
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: '#ffffff'
        }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : (
            <FileList
              files={files}
              folders={folders}
              currentPath={currentPath}
              onFolderClick={navigateToFolder}
              viewMode={viewMode}
              onSelectionChange={handleSelectionChange}
            />
          )}
        </Box>
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <ListItemIcon>
            <RenameIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FileExplorerBox>
  );
}

export default Explorer;
