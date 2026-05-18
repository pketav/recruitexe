import React, { useCallback, useState, useMemo } from 'react';
import { useSupercluster } from '../hooks/useSupercluster';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import EmployeeMarker from './markers/EmployeeMarker';
import CustomerMarker from './markers/CustomerMarker';
import BranchMarker from './markers/BranchMarker';

const ClusterMarker = ({ count, position, onClick }) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <AdvancedMarker position={position} onClick={handleClick}>
      <div className="cluster-marker">
        <span>{count}</span>
        <style jsx>{`
          .cluster-marker {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            background-color: #1e40af;
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            width: ${Math.min(60, Math.max(40, 30 + count / 2))}px;
            height: ${Math.min(60, Math.max(40, 30 + count / 2))}px;
            font-weight: bold;
            font-size: ${Math.min(20, Math.max(14, 12 + count / 10))}px;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
          }
          
          .cluster-marker:hover {
            transform: scale(1.1);
          }
        `}</style>
      </div>
    </AdvancedMarker>
  );
};

const MarkerClusterer = ({ 
  points,
  clusteringEnabled = true, 
  onMarkerClick,
  filters = { employees: true, customers: true, branches: true },
  trackedEmployeeId = null
}) => {
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);
  
  // Get clusters using the custom hook
  const { clusters, getLeaves, supercluster } = useSupercluster(points, {
    radius: 75,
    maxZoom: 15,
    minZoom: 3
  });

  // Handle cluster click - zoom in or show info window with all points
  const handleClusterClick = useCallback((clusterId) => {
    const cluster = clusters.find(c => c.properties.cluster_id === clusterId);
    if (!cluster) return;

    const [longitude, latitude] = cluster.geometry.coordinates;
    
    // Get the cluster leaves (points in this cluster)
    const leaves = getLeaves(clusterId);
    
    if (leaves.length > 10) {
      // If there are many points in the cluster, zoom in
      if (mapCenter && mapZoom) {
        setMapCenter({ lat: latitude, lng: longitude });
        setMapZoom(Math.min((mapZoom || 0) + 2, 20));
      }
    } else {
      // If there are few points, show info with all points
      onMarkerClick(null, { 
        clusterPoints: leaves.map(leaf => ({
          ...leaf.properties,
          position: { 
            lat: leaf.geometry.coordinates[1], 
            lng: leaf.geometry.coordinates[0] 
          }
        }))
      });
    }
  }, [clusters, getLeaves, mapCenter, mapZoom, onMarkerClick]);

  // Filter points based on user selection
  const filteredClusters = useMemo(() => {
    return clusteringEnabled 
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
  }, [clusteringEnabled, clusters, filters]);

  // If clustering is disabled, filter and render individual markers
  const individualMarkers = useMemo(() => {
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
              onClick={() => onMarkerClick(null, props)}
              isTracking={props.id === trackedEmployeeId}
            />
          );
        case 'customer':
          return (
            <CustomerMarker
              key={props.id}
              position={position}
              customerData={props}
              onClick={() => onMarkerClick(null, props)}
            />
          );
        case 'branch':
          return (
            <BranchMarker
              key={props.id}
              position={position}
              branchData={props}
              onClick={() => onMarkerClick(null, props)}
            />
          );
        default:
          return null;
      }
    });
  }, [clusteringEnabled, points, filters, onMarkerClick, trackedEmployeeId]);

  return (
    <>
      {clusteringEnabled ? (
        <>
          {filteredClusters.map(cluster => {
            const [lng, lat] = cluster.geometry.coordinates;
            const position = { lat, lng };
            
            // If this is a cluster
            if (cluster.properties.cluster) {
              return (
                <ClusterMarker
                  key={`cluster-${cluster.id}`}
                  position={position}
                  count={cluster.properties.point_count}
                  onClick={() => handleClusterClick(cluster.properties.cluster_id)}
                />
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
                    onClick={() => onMarkerClick(null, props)}
                    isTracking={props.id === trackedEmployeeId}
                  />
                );
              case 'customer':
                return (
                  <CustomerMarker
                    key={props.id}
                    position={position}
                    customerData={props}
                    onClick={() => onMarkerClick(null, props)}
                  />
                );
              case 'branch':
                return (
                  <BranchMarker
                    key={props.id}
                    position={position}
                    branchData={props}
                    onClick={() => onMarkerClick(null, props)}
                  />
                );
              default:
                return null;
            }
          })}
        </>
      ) : (
        // Render without clustering
        individualMarkers
      )}
    </>
  );
};

export default MarkerClusterer;
