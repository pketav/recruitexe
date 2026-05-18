// src/app/(dashboard)/maps/components/CustomPolyline.jsx

import { useEffect, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

/**
 * Custom polyline component for displaying employee movement paths
 * @param {Object} props - Component props
 * @param {Array} props.coordinates - Array of {lat, lng} coordinates
 * @param {boolean} props.clearPath - Flag to clear the path
 * @param {string} props.pathColor - Color for the path line
 * @param {number} props.strokeWeight - Width of the path line
 */
export function CustomPolyline({ 
  coordinates, 
  clearPath, 
  pathColor = '#4f46e5', 
  strokeWeight = 4 
}) {
  const mapData = useMap();
  const mapsLib = useMapsLibrary('maps');
  const [path, setPath] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);

  // Clear all markers, info windows and polyline
  const clearMapObjects = () => {
    if (path) {
      path.setMap(null);
    }
    markers.forEach(marker => marker.setMap(null));
    infoWindows.forEach(infoWindow => infoWindow.close());
    setMarkers([]);
    setInfoWindows([]);
    setPath(null);
  };

  // Effect to handle path clearing
  useEffect(() => {
    if (clearPath) {
      clearMapObjects();
    }
  }, [clearPath]);

  // Effect to draw new path when coordinates change
  useEffect(() => {
    if (!mapsLib || !mapData || !window.google?.maps || !coordinates?.length) return;

    // Clear existing path and markers
    clearMapObjects();

    // Create new polyline
    const polyline = new google.maps.Polyline({
      path: coordinates,
      strokeColor: pathColor,
      strokeOpacity: 1.0,
      strokeWeight: strokeWeight,
      geodesic: true,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: pathColor,
            fillOpacity: 1,
            scale: 3,
            strokeColor: '#FFFFFF',
            strokeWeight: 1
          },
          repeat: '100px'
        }
      ]
    });

    // Create markers for key points (start, end, and some intermediates)
    const newMarkers = [];
    const newInfoWindows = [];
    
    // Create markers for start, end and some intermediates
    const markerIndices = [
      0, // Start point
      coordinates.length - 1, // End point
    ];
    
    // Add some intermediate points if there are many coordinates
    if (coordinates.length > 10) {
      // Add quarter, half and three-quarter points
      markerIndices.push(
        Math.floor(coordinates.length * 0.25),
        Math.floor(coordinates.length * 0.5),
        Math.floor(coordinates.length * 0.75)
      );
    }
    
    // Make sure we don't have duplicates
    const uniqueIndices = [...new Set(markerIndices)].sort((a, b) => a - b);
    
    uniqueIndices.forEach((index) => {
      const coord = coordinates[index];
      const isStart = index === 0;
      const isEnd = index === coordinates.length - 1;
      
      // Format the timestamp if available
      let timeLabel = '';
      if (coord.timestamp) {
        const timestamp = new Date(coord.timestamp);
        timeLabel = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      const icon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: isStart || isEnd ? 8 : 6,
        fillColor: isStart ? '#34A853' : isEnd ? '#EA4335' : pathColor,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF'
      };

      const marker = new google.maps.Marker({
        position: coord,
        map: mapData,
        icon: icon,
        title: isStart ? 'Start Point' : isEnd ? 'End Point' : `Waypoint ${index + 1}`
      });

      const defaultIcon = { ...icon };
      const hoverIcon = { ...icon, scale: icon.scale * 1.3 };

      marker.addListener('mouseover', () => {
        marker.setIcon(hoverIcon);
      });

      marker.addListener('mouseout', () => {
        marker.setIcon(defaultIcon);
      });

      const infoContent = `
        <div style="padding: 8px; min-width: 150px;">
          <strong>${isStart ? 'Start Point' : isEnd ? 'End Point' : 'Waypoint'}</strong>
          ${timeLabel ? `<br><span style="color: #555;">Time: ${timeLabel}</span>` : ''}
          <br>Lat: ${coord.lat.toFixed(4)}
          <br>Lng: ${coord.lng.toFixed(4)}
        </div>
      `;
      
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });

      marker.addListener('click', () => {
        // Close any open info windows
        newInfoWindows.forEach(iw => iw.close());
        
        // Open this info window
        infoWindow.open(mapData, marker);
      });

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });

    setPath(polyline);
    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);
    polyline.setMap(mapData);

    // Auto-fit the map to include all points
    if (coordinates.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      coordinates.forEach(coord => bounds.extend(coord));
      mapData.fitBounds(bounds, { padding: 50 });
    }

    // Cleanup function
    return () => {
      clearMapObjects();
    };
  }, [mapsLib, mapData, coordinates, pathColor, strokeWeight]);

  return null;
}
