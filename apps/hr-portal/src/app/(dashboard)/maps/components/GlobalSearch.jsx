import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { employeesData } from '../data/employeesData';
import { customersData } from '../data/customersData';
import { branchesData } from '../data/branchesData';

const GlobalSearch = ({ onSelectResult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  
  // Search all entity types when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    
    // Search employees
    const employeeResults = employeesData
      .filter(emp => 
        emp.name.toLowerCase().includes(term) || 
        emp.designation.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term)
      )
      .map(emp => ({
        ...emp,
        type: 'employee',
        typeLabel: 'Employee',
        color: '#4f46e5',
        secondary: emp.designation
      }));
    
    // Search customers
    const customerResults = customersData
      .filter(cust => 
        cust.name.toLowerCase().includes(term) ||
        cust.contactPerson.toLowerCase().includes(term) ||
        cust.type.toLowerCase().includes(term) ||
        cust.email.toLowerCase().includes(term)
      )
      .map(cust => ({
        ...cust,
        type: 'customer',
        typeLabel: 'Customer',
        color: getCustomerTypeColor(cust.type),
        secondary: cust.contactPerson
      }));
    
    // Search branches
    const branchResults = branchesData
      .filter(branch => 
        branch.name.toLowerCase().includes(term) ||
        branch.manager.toLowerCase().includes(term) ||
        branch.address.toLowerCase().includes(term)
      )
      .map(branch => ({
        ...branch,
        type: 'branch',
        typeLabel: 'Branch',
        color: '#ca8a04',
        secondary: branch.manager
      }));
    
    // Combine all results and limit to 10
    const allResults = [...employeeResults, ...customerResults, ...branchResults]
      .sort((a, b) => {
        // Sort by relevance - exact matches first, then beginning of string, then anywhere
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        if (aName === term && bName !== term) return -1;
        if (bName === term && aName !== term) return 1;
        
        if (aName.startsWith(term) && !bName.startsWith(term)) return -1;
        if (bName.startsWith(term) && !aName.startsWith(term)) return 1;
        
        return aName.localeCompare(bName);
      })
      .slice(0, 10);
    
    setSearchResults(allResults);
  }, [searchTerm]);
  
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    
    if (!showResults && e.target.value.trim()) {
      setShowResults(true);
      setAnchorEl(inputRef.current);
    }
    
    if (showResults && !e.target.value.trim()) {
      setShowResults(false);
    }
  };
  
  const handleSearchFocus = () => {
    if (searchTerm.trim()) {
      setShowResults(true);
      setAnchorEl(inputRef.current);
    }
  };
  
  const handleResultClick = (result) => {
    // Handle different entity types
    if (onSelectResult) {
      onSelectResult(result.type, result);
    }
    
    // Close search results
    setShowResults(false);
    setSearchTerm('');
  };
  
  const handleClickAway = () => {
    setShowResults(false);
  };
  
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', zIndex: 10, maxWidth: 600, width: '100%' }}>
        <Paper
          elevation={3}
          sx={{
            p: '0px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: '8px',
            height: '44px'
          }}
        >
          <IconButton aria-label="search" sx={{ p: '8px' }}>
            <SvgIcon fontSize="small">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </SvgIcon>
          </IconButton>
          <InputBase
            ref={inputRef}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search employees, customers, branches..."
            inputProps={{ 'aria-label': 'search entities' }}
            value={searchTerm}
            onChange={handleSearchInputChange}
            onFocus={handleSearchFocus}
          />
          {searchTerm && (
            <IconButton 
              aria-label="clear search" 
              sx={{ p: '8px' }}
              onClick={() => setSearchTerm('')}
            >
              <SvgIcon fontSize="small">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </SvgIcon>
            </IconButton>
          )}
        </Paper>
        
        <Popper
          open={showResults && searchResults.length > 0}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          style={{ width: anchorEl ? anchorEl.clientWidth : 'auto', zIndex: 1400 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper
                elevation={4}
                sx={{
                  mt: 1,
                  maxHeight: 400,
                  overflow: 'auto',
                  borderRadius: '8px'
                }}
              >
                <List dense sx={{ p: 0 }}>
                  {searchResults.map((result, index) => (
                    <React.Fragment key={`${result.type}-${result.id}`}>
                      <ListItem 
                        sx={{ 
                          py: 1.5, 
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: `${result.color}10`
                          }
                        }}
                        onClick={() => handleResultClick(result)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: `${result.color}20`,
                              color: result.color,
                              fontWeight: 600
                            }}
                          >
                            {result.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {result.name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Chip
                                label={result.typeLabel}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.625rem',
                                  bgcolor: `${result.color}20`,
                                  color: result.color,
                                  mr: 1
                                }}
                              />
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {result.secondary}
                              </Typography>
                            </Box>
                          }
                        />
                        <IconButton size="small" edge="end" sx={{ color: result.color }}>
                          <SvgIcon fontSize="small">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 18 6-6-6-6"/>
                            </svg>
                          </SvgIcon>
                        </IconButton>
                      </ListItem>
                      {index < searchResults.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

// Helper function to get color based on customer type
const getCustomerTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'corporate':
      return '#0ea5e9'; // Sky blue
    case 'sme':
      return '#8b5cf6'; // Purple
    case 'retail':
      return '#f97316'; // Orange
    case 'startup':
      return '#10b981'; // Emerald
    case 'healthcare':
      return '#ef4444'; // Red
    case 'education':
      return '#f59e0b'; // Amber
    case 'food & beverage':
      return '#ec4899'; // Pink
    default:
      return '#6b7280'; // Gray
  }
};

export default GlobalSearch;
