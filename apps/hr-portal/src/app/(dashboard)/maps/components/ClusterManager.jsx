import React, { useState, useEffect, useRef } from 'react';
import Supercluster from 'supercluster';
import { useMap } from '@vis.gl/react-google-maps';
import EmployeeMarker from './markers/EmployeeMarker';
import CustomerMarker from './markers/CustomerMarker';
import BranchMarker from './markers/BranchMarker';

// Custom component to handle clustering without a hook
const ClusterManager = ({ 
  points,
  clusteringEnabled = true, 
  onMarkerClick,
  filters = { employees: true, customers: true, branches: true },
  trackedEmployeeId = null
}) => {
  const [clusters, setClusters] = useState([]);
  const map = useMap();
  const initialized = useRef(false);
  const superclusterRef = useRef(null);
  const options = {
    radius: 75,
    maxZoom: 15,
    minZoom: 3
  };

  // Initialize supercluster once
  useEffect(() => {
    if (initialized.current || !points?.features?.length || !map) return;
    
    try {
      superclusterRef.current = new Supercluster(options);
      superclusterRef.current.load(points.features);
      initialized.current = true;
      
      // Initial calculation of clusters
      calculateClusters();
      
      // Add listener for map bounds change
      const listener = map.addListener('bounds_changed', calculateClusters);
      
      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    } catch (error) {
      console.error("Error initializing cluster manager:", error);
    }
  }, [map]);

  // Update clusters when points or filters change
  useEffect(() => {
    if (!initialized.current || !map) return;
    
    try {
      superclusterRef.current = new Supercluster(options);
      superclusterRef.current.load(points.features);
      calculateClusters();
    } catch (error) {
      console.error("Error updating clusters:", error);
    }
  }, [points, filters]);

  // Function to calculate clusters
  const calculateClusters = () => {
    if (!superclusterRef.current || !map) return;
    
    try {
      const bounds = map.getBounds();
      if (!bounds) return;
      
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      
      const bbox = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
      const zoom = Math.round(map.getZoom());
      
      const newClusters = superclusterRef.current.getClusters(bbox, zoom);
      setClusters(newClusters);
    } catch (error) {
      console.error("Error calculating clusters:", error);
    }
  };

  // Filter clusters based on user selection
  const filteredClusters = clusteringEnabled 
    ? clusters.filter(cluster => {
        // Always show clusters
        if (cluster.properties.cluster) return true;
        
        // Filter individual points by type
        const type = cluster.properties.type;
        if (type === 'employee' && !filters.employees) return false;
        if (type === 'customer' && !filters.customers) return false;
        if (type === 'branch' && !filters.branches) return false;
        
        return true;
      })
    : [];

  // Render individual markers without clustering
  const renderIndividualMarkers = () => {
    if (clusteringEnabled) return null;
    
    const features = points?.features || [];
    return features.filter(feature => {
      const type = feature.properties.type;
      if (type === 'employee' && !filters.employees) return false;
      if (type === 'customer' && !filters.customers) return false;
      if (type === 'branch' && !filters.branches) return false;
      return true;
    }).map(feature => {
      const [lng, lat] = feature.geometry.coordinates;
      const position = { lat, lng };
      const props = feature.properties;
      
      switch (props.type) {
        case 'employee':
          return (
            <EmployeeMarker
              key={props.id}
              position={position}
              employeeData={props}
              onClick={(marker) => onMarkerClick(marker, props)}
              isTracking={props.id === trackedEmployeeId}
            />
          );
        case 'customer':
          return (
            <CustomerMarker
              key={props.id}
              position={position}
              customerData={props}
              onClick={(marker) => onMarkerClick(marker, props)}
            />
          );
        case 'branch':
          return (
            <BranchMarker
              key={props.id}
              position={position}
              branchData={props}
              onClick={(marker) => onMarkerClick(marker, props)}
            />
          );
        default:
          return null;
      }
    });
  };

  // Function to get cluster points
  const getClusterPoints = (clusterId) => {
    if (!superclusterRef.current) return [];
    return superclusterRef.current.getLeaves(clusterId, Infinity);
  };

  // Handle cluster click
  const handleClusterClick = (marker, clusterId) => {
    const leaves = getClusterPoints(clusterId);
    
    if (leaves.length <= 10) {
      // Show info window for all points in the cluster
      onMarkerClick(marker, { 
        clusterPoints: leaves.map(leaf => ({
          ...leaf.properties,
          position: { 
            lat: leaf.geometry.coordinates[1], 
            lng: leaf.geometry.coordinates[0] 
          }
        }))
      });
    } else {
      // Zoom in to the cluster
      if (map) {
        const [lng, lat] = leaves[0].geometry.coordinates;
        map.panTo({ lat, lng });
        map.setZoom((map.getZoom() || 10) + 2);
      }
    }
  };

  return (
    <>
      {clusteringEnabled ? (
        // Render clustered markers
        filteredClusters.map(cluster => {
          const [lng, lat] = cluster.geometry.coordinates;
          const position = { lat, lng };
          
          // If this is a cluster
          if (cluster.properties.cluster) {
            return (
              <div key={`cluster-${cluster.id}`}>
                <div 
                  className="cluster-marker"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${Math.min(60, Math.max(40, 30 + cluster.properties.point_count / 2))}px`,
                    height: `${Math.min(60, Math.max(40, 30 + cluster.properties.point_count / 2))}px`,
                    backgroundColor: '#1e40af',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '4px solid white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    fontWeight: 'bold',
                    fontSize: `${Math.min(20, Math.max(14, 12 + cluster.properties.point_count / 10))}px`,
                    cursor: 'pointer',
                    zIndex: 1
                  }}
                  onClick={(e) => handleClusterClick(e.currentTarget, cluster.properties.cluster_id)}
                >
                  {cluster.properties.point_count}
                </div>
              </div>
            );
          }
          
          // Individual markers
          const props = cluster.properties;
          
          switch (props.type) {
            case 'employee':
              return (
                <EmployeeMarker
                  key={props.id}
                  position={position}
                  employeeData={props}
                  onClick={(marker) => onMarkerClick(marker, props)}
                  isTracking={props.id === trackedEmployeeId}
                />
              );
            case 'customer':
              return (
                <CustomerMarker
                  key={props.id}
                  position={position}
                  customerData={props}
                  onClick={(marker) => onMarkerClick(marker, props)}
                />
              );
            case 'branch':
              return (
                <BranchMarker
                  key={props.id}
                  position={position}
                  branchData={props}
                  onClick={(marker) => onMarkerClick(marker, props)}
                />
              );
            default:
              return null;
          }
        })
      ) : (
        // Render without clustering
        renderIndividualMarkers()
      )}
    </>
  );
};

export default ClusterManager;
