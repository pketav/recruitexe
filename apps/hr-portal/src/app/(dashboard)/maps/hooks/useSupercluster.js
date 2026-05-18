import { useState, useEffect, useRef } from 'react';
import Supercluster from 'supercluster';
import { useMap } from '@vis.gl/react-google-maps';

export const useSupercluster = (points, options) => {
  const [clusters, setClusters] = useState([]);
  const superclusterRef = useRef(null);
  const mapRef = useRef(null);
  const listenerRef = useRef(null);
  const pointsRef = useRef(null);
  const optionsRef = useRef(null);
  const map = useMap();
  
  // Store the current map instance in a ref
  useEffect(() => {
    mapRef.current = map;
  }, [map]);
  
  // Store the current points and options in refs to avoid dependency cycles
  useEffect(() => {
    pointsRef.current = points;
    optionsRef.current = options;
  }, [points, options]);
  
  // Function to update clusters - defined outside of useEffect to avoid recreation
  const updateClusters = () => {
    if (!superclusterRef.current || !mapRef.current) return;
    
    try {
      const bounds = mapRef.current.getBounds();
      if (!bounds) return;
      
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      
      const bbox = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
      const zoom = Math.round(mapRef.current.getZoom());
      
      const newClusters = superclusterRef.current.getClusters(bbox, zoom);
      setClusters(newClusters);
    } catch (error) {
      console.error('Error updating clusters:', error);
    }
  };
  
  // Initialize Supercluster and set up map event listeners
  useEffect(() => {
    if (!mapRef.current || !pointsRef.current?.features?.length) return;
    
    // Clean up existing listener if it exists
    if (listenerRef.current) {
      google.maps.event.removeListener(listenerRef.current);
      listenerRef.current = null;
    }
    
    // Initialize or update the Supercluster instance
    superclusterRef.current = new Supercluster(optionsRef.current);
    superclusterRef.current.load(pointsRef.current.features);
    
    // Calculate initial clusters
    updateClusters();
    
    // Set up map bounds and zoom changed listeners for more responsive updates
    if (mapRef.current && window.google) {
      const events = ['bounds_changed', 'zoom_changed', 'dragend'];
      
      // Create a debounced version of updateClusters to avoid too many updates
      let timeoutId;
      const debouncedUpdate = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(updateClusters, 100); // 100ms debounce
      };
      
      // Add all event listeners
      const listeners = events.map(event => 
        mapRef.current.addListener(event, debouncedUpdate)
      );
      
      // Store all listeners
      listenerRef.current = listeners;
    } else {
      // Fallback to the original method
      listenerRef.current = mapRef.current.addListener('bounds_changed', updateClusters);
    }
    
    return () => {
      if (listenerRef.current) {
        if (Array.isArray(listenerRef.current)) {
          // Remove all listeners if we added multiple
          listenerRef.current.forEach(listener => {
            if (listener) google.maps.event.removeListener(listener);
          });
        } else {
          // Remove the single listener
          google.maps.event.removeListener(listenerRef.current);
        }
        listenerRef.current = null;
      }
    };
  }, [map, points]); // Only depend on map and points to avoid infinite loops
  
  // Get the leaves of a cluster
  const getLeaves = (clusterId, limit = 10, offset = 0) => {
    if (!superclusterRef.current) return [];
    return superclusterRef.current.getLeaves(clusterId, limit, offset);
  };
  
  return { clusters, getLeaves, supercluster: superclusterRef.current };
};
