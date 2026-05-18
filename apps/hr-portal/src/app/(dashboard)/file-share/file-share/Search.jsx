'use client';

import { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  Toc
} from '@mui/icons-material';
import axios from 'axios';

export default function SearchComponent({ onNavigateToFolder, currentPath }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveRecentSearch = (query) => {
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get(`${baseUrl}/v1/api/fileShare/search?query=${encodeURIComponent(searchQuery)}&prefix=${encodeURIComponent(currentPath)}`, {
        headers: {
          'Content-Type': 'application/json',
          token: token
        }
      });

      if (response.data.status) {
        setSearchResults(response.data.items);
        saveRecentSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    // Show the dropdown with recent searches if the user starts typing
    if (e.target.value && !searchAnchorEl) {
      setSearchAnchorEl(e.currentTarget);
    } else if (!e.target.value) {
      setSearchAnchorEl(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchAnchorEl(null);
  };

  const handleSearchItemClick = (item) => {
    if (item.type === 'folder') {
      onNavigateToFolder(item.key);
    } else {
      // Handle file click (could open preview or download)
      window.open(`${baseUrl}/v1/api/fileShare/download?key=${encodeURIComponent(item.key)}`, '_blank');
    }
    clearSearch();
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    setSearchAnchorEl(null);
    // Automatically search with the selected recent query
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

  // Function to get the appropriate icon for a file based on its extension
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    switch(extension) {
      case 'pdf':
        return <PdfIcon fontSize="small" sx={{ color: '#e53935' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon fontSize="small" sx={{ color: '#7b1fa2' }} />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon fontSize="small" sx={{ color: '#1565c0' }} />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <Toc fontSize="small" sx={{ color: '#2e7d32' }} />;
      case 'js':
      case 'html':
      case 'css':
      case 'json':
      case 'xml':
        return <CodeIcon fontSize="small" sx={{ color: '#f57c00' }} />;
      default:
        return <FileIcon fontSize="small" sx={{ color: '#607d8b' }} />;
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
              backgroundColor: '#fff',
              height: 36,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {isSearching ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon fontSize="small" color="action" />
                )}
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  edge="end"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>

      {/* Recent searches dropdown */}
      <Menu
        anchorEl={searchAnchorEl}
        open={Boolean(searchAnchorEl) && searchQuery && !isSearching && searchResults.length === 0}
        onClose={() => setSearchAnchorEl(null)}
        PaperProps={{
          sx: {
            width: searchAnchorEl ? searchAnchorEl.clientWidth : 'auto',
            mt: 1,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {recentSearches.length > 0 ? (
          <>
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                Recent Searches
              </Typography>
            </MenuItem>
            {recentSearches.map((query, index) => (
              <MenuItem key={index} onClick={() => handleRecentSearchClick(query)}>
                <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" noWrap>{query}</Typography>
              </MenuItem>
            ))}
          </>
        ) : (
          <MenuItem disabled>
            <Typography variant="caption" color="text.secondary">
              No recent searches
            </Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Search results */}
      {searchResults.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 0.5,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1300,
            borderRadius: '4px',
          }}
        >
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
              Search Results
            </Typography>
            <Chip
              label={`${searchResults.length} items`}
              size="small"
              variant="outlined"
              sx={{ height: 24 }}
            />
          </Box>
          <List dense>
            {searchResults.map((item, index) => (
              <ListItem
                key={item.key}
                disablePadding
                divider={index < searchResults.length - 1}
              >
                <ListItemButton onClick={() => handleSearchItemClick(item)}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {item.type === 'folder' ? (
                      <FolderIcon fontSize="small" sx={{ color: 'gold' }} />
                    ) : (
                      getFileIcon(item.name)
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap>{item.name}</Typography>
                    }
                    secondary={
                      <Typography variant="caption" noWrap color="text.secondary">
                        {item.path || 'Root'}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
