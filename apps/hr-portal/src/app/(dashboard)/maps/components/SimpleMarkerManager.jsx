import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import EmployeeMarker from './markers/EmployeeMarker';
import CustomerMarker from './markers/CustomerMarker';
import BranchMarker from './markers/BranchMarker';

/**
 * A simplified marker manager that doesn't use clustering
 * This is a fallback to ensure the map works
 */
const SimpleMarkerManager = ({
  points,
  onMarkerClick,
  filters = { employees: true, customers: true, branches: true },
  trackedEmployeeId = null
}) => {
  // Filter points based on the selected filters
  const filteredFeatures = (points?.features || []).filter(feature => {
    const type = feature.properties.type;
    if (type === 'employee' && !filters.employees) return false;
    if (type === 'customer' && !filters.customers) return false;
    if (type === 'branch' && !filters.branches) return false;
    return true;
  });

  return (
    <>
      {filteredFeatures.map(feature => {
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
      })}
    </>
  );
};

export default SimpleMarkerManager;
