'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  CircularProgress,
  Typography,
  IconButton
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  ChevronRight,
  ExpandMore,
  Computer as ComputerIcon,
  SdCard as SdCardIcon,
  Home
} from '@mui/icons-material';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'

export default function FolderTree({ currentPath, onNavigate }) {
  const [folderStructure, setFolderStructure] = useState({ root: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [loadingFolders, setLoadingFolders] = useState({});
  const router = useRouter();


  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = localStorage.getItem('accessToken');

  // Fetch all folders to build the folder tree
  useEffect(() => {
    const fetchAllFolders = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${baseUrl}/v1/api/fileShare/list-objects`, {
          headers: {
            'Content-Type': 'application/json',
            token: token
          }
        });

        if (!response.data.status) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = response.data.items;

        // Initialize with root folders
        const structure = { root: data.folders };

        // Expanding the first level folders automatically
        const expanded = {};
        data.folders.forEach(folder => {
          expanded[folder.key] = false;
          fetchSubfolders(folder.key);
        });

        setFolderStructure(structure);
        setExpandedFolders(expanded);
      } catch (err) {
        console.error('Failed to fetch folder structure:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFolders();
  }, []);

  const navigateToFinexe = () => {
    router.push("/"); // This works the same in App Router
  }

  // Fetch subfolders for a specific folder
  const fetchSubfolders = async (folderPath) => {
    setLoadingFolders(prev => ({ ...prev, [folderPath]: true }));

    try {
      const response = await axios.get(`${baseUrl}/v1/api/fileShare/list-objects?prefix=${encodeURIComponent(folderPath)}`, {
        headers: {
          'Content-Type': 'application/json',
          token: token
        }
      });

      if (!response.data.status) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = response.data.items;

      setFolderStructure(prevStructure => ({
        ...prevStructure,
        [folderPath]: data.folders
      }));
    } catch (err) {
      console.error(`Failed to fetch subfolders for ${folderPath}:`, err);
    } finally {
      setLoadingFolders(prev => ({ ...prev, [folderPath]: false }));
    }
  };

  // Toggle folder expansion
  const toggleFolder = (folderPath) => {
    // If we haven't fetched this folder's contents yet, do so now
    if (!folderStructure[folderPath]) {
      fetchSubfolders(folderPath);
    }

    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  // Check if a path is part of the current path (to highlight the active tree)
  const isPartOfCurrentPath = (path) => {
    if (!currentPath) return path === '';
    return currentPath.startsWith(path);
  };

  // Recursive function to render the folder tree
  const renderFolders = (folders, level = 0) => {
    if (!folders || folders.length === 0) {
      return level === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No folders found
          </Typography>
        </Box>
      ) : null;
    }

    return (
      <List sx={{ pl: level > 0 ? 1 : 0 }} dense component="div" disablePadding>
        {folders.map((folder) => {
          const isExpanded = expandedFolders[folder.key];
          const hasSubfolders = folderStructure[folder.key]?.length > 0;
          const isActive = currentPath === folder.key;
          const isPathActive = isPartOfCurrentPath(folder.key);
          const isLoading = loadingFolders[folder.key];

          return (
            <div key={folder.key}>
              <ListItem
                disablePadding
                sx={{
                  display: 'block',
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemButton
                  dense
                  onClick={() => onNavigate(folder.key)}
                  sx={{
                    pl: level * 1.5 + 1,
                    pr: 1,
                    py: 0.5,
                    minHeight: 36,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                    },
                  }}
                  selected={isActive}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFolder(folder.key);
                      }}
                      sx={{ p: 0, mr: 0.5 }}
                    >
                      {isLoading ? (
                        <CircularProgress size={16} />
                      ) : hasSubfolders || folderStructure[folder.key] === undefined ? (
                        isExpanded ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />
                      ) : (
                        <span style={{ width: 16 }} />
                      )}
                    </IconButton>
                    {isPathActive ? (
                      <FolderOpenIcon fontSize="small" color="primary" />
                    ) : (
                      <FolderIcon fontSize="small" sx={{ color: 'gold' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        noWrap
                        component="div"
                        sx={{
                          fontWeight: isPathActive ? 'bold' : 'normal',
                          color: isPathActive ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {folder.name}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>

              {/* Render subfolders if expanded */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                {isLoading ? (
                  <Box sx={{ display: 'flex', pl: level * 1.5 + 4, py: 1 }}>
                    <CircularProgress size={20} />
                  </Box>
                ) : (
                  folderStructure[folder.key] && renderFolders(folderStructure[folder.key], level + 1)
                )}
              </Collapse>
            </div>
          );
        })}
      </List>
    );
  };

  // Render Windows Explorer style quick access section
  const renderQuickAccess = () => {
    return (
      <Box sx={{ mb: 2 }}>
        <List dense component="div" disablePadding>
          <ListItem sx={{ pb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Quick access
            </Typography>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton dense onClick={navigateToFinexe}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Home fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2">Back To Finexe</Typography>
                }
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton dense onClick={() => onNavigate('')}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ComputerIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2">Root</Typography>
                }
              />
            </ListItemButton>
          </ListItem>

          {/* <ListItem disablePadding>
            <ListItemButton dense>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SdCardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2">Storage</Typography>
                }
              />
            </ListItemButton>
          </ListItem> */}
        </List>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ overflow: 'auto' }}>
      {renderQuickAccess()}
      <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 1 }}>
        <List dense component="div" disablePadding>
          <ListItem sx={{ pb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Folders
            </Typography>
          </ListItem>
        </List>
        {renderFolders(folderStructure.root)}
      </Box>
    </Box>
  );
}
