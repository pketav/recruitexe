import React, { useState, useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const SearchBox = ({ onPlaceSelect, mapInstance }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const searchTimeout = useRef(null);
  const [geocoder, setGeocoder] = useState(null);

  // Initialize geocoder when map instance is available
  useEffect(() => {
    if (mapInstance && window.google && !geocoder) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [mapInstance, geocoder]);

  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchQuery.trim() || !geocoder) {
      setResults([]);
      setShowResults(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setShowResults(true);
    
    // Set a timeout to avoid too many API calls
    searchTimeout.current = setTimeout(() => {
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        setLoading(false);
        
        if (status === 'OK' && results.length > 0) {
          // Limit to top 5 results
          setResults(results.slice(0, 5));
        } else {
          setResults([]);
        }
      });
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, geocoder]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePlaceSelect = (place) => {
    if (onPlaceSelect) {
      const location = place.geometry.location;
      const lat = location.lat();
      const lng = location.lng();
      
      onPlaceSelect({
        position: { lat, lng },
        address: place.formatted_address,
        name: place.formatted_address.split(',')[0],
        placeId: place.place_id
      });
    }
    
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setShowResults(false)}>
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
        <Paper
          elevation={3}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: 8,
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SvgIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </SvgIcon>
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search for a location..."
            inputProps={{ 'aria-label': 'search for a location' }}
            value={searchQuery}
            onChange={handleSearchChange}
            ref={inputRef}
            onFocus={() => {
              if (results.length > 0) {
                setShowResults(true);
              }
            }}
          />
          {loading ? (
            <CircularProgress size={24} sx={{ mr: 1 }} />
          ) : searchQuery ? (
            <IconButton sx={{ p: '10px' }} aria-label="clear" onClick={handleClearSearch}>
              <SvgIcon fontSize="small">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </SvgIcon>
            </IconButton>
          ) : (
            <Tooltip title="Search for any address or location">
              <IconButton sx={{ p: '10px' }} aria-label="info">
                <SvgIcon fontSize="small">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </SvgIcon>
              </IconButton>
            </Tooltip>
          )}
        </Paper>

        <Fade in={showResults}>
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              top: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              zIndex: 1000,
              display: showResults ? 'block' : 'none',
              maxHeight: 300,
              overflow: 'auto',
              borderRadius: 2,
              mt: 0.5
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : results.length > 0 ? (
              <List>
                {results.map((place, index) => (
                  <React.Fragment key={place.place_id}>
                    <ListItem 
                      button 
                      onClick={() => handlePlaceSelect(place)}
                      sx={{ 
                        py: 1.5,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <SvgIcon color="action">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </SvgIcon>
                      </ListItemIcon>
                      <ListItemText 
                        primary={place.formatted_address.split(',')[0]} 
                        secondary={place.formatted_address} 
                        primaryTypographyProps={{ fontWeight: 500 }}
                        secondaryTypographyProps={{ 
                          noWrap: true,
                          sx: { maxWidth: '320px' }
                        }}
                      />
                    </ListItem>
                    {index < results.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : searchQuery ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No results found for "{searchQuery}"
                </Typography>
              </Box>
            ) : null}
          </Paper>
        </Fade>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBox;
