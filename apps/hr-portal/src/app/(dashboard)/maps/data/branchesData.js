// Sample branch office data
export const branchesData = [
  {
    id: 'branch1',
    name: 'Delhi Headquarters',
    address: '1 Corporate Avenue, Connaught Place, Delhi',
    phone: '+91 11-1234-5678',
    manager: 'Vikram Sharma',
    employeeCount: 120,
    location: { lat: 28.6304, lng: 77.2177 }, // Connaught Place, Delhi
    established: '1995-03-15'
  },
  {
    id: 'branch2',
    name: 'Noida Regional Office',
    address: '45 Tech Park, Sector 62, Noida',
    phone: '+91 120-987-6543',
    manager: 'Priya Patel',
    employeeCount: 75,
    location: { lat: 28.5970, lng: 77.3252 }, // Sector 62, Noida
    established: '2005-07-22'
  },
  {
    id: 'branch3',
    name: 'Gurugram Corporate Center',
    address: '789 Business Hub, Cyber City, Gurugram',
    phone: '+91 124-567-8901',
    manager: 'Rajesh Kumar',
    employeeCount: 95,
    location: { lat: 28.4964, lng: 77.0919 }, // Cyber City, Gurugram
    established: '2008-11-10'
  },
  {
    id: 'branch4',
    name: 'South Delhi Branch',
    address: '23 Green Park Extension, South Delhi',
    phone: '+91 11-2468-1357',
    manager: 'Ananya Singh',
    employeeCount: 45,
    location: { lat: 28.5589, lng: 77.2039 }, // Green Park, South Delhi
    established: '2012-05-30'
  },
  {
    id: 'branch5',
    name: 'East Delhi Operation Center',
    address: '56 Laxmi Nagar Complex, East Delhi',
    phone: '+91 11-9753-1246',
    manager: 'Sanjay Gupta',
    employeeCount: 60,
    location: { lat: 28.6279, lng: 77.2789 }, // Laxmi Nagar, East Delhi
    established: '2015-09-18'
  }
];

// Convert branches data to GeoJSON format for map display
export const branchesGeoJson = {
  type: 'FeatureCollection',
  features: branchesData.map(branch => ({
    type: 'Feature',
    properties: {
      id: branch.id,
      name: branch.name,
      type: 'branch',
      address: branch.address,
      phone: branch.phone,
      manager: branch.manager,
      employeeCount: branch.employeeCount,
      established: branch.established
    },
    geometry: {
      type: 'Point',
      coordinates: [branch.location.lng, branch.location.lat]
    }
  }))
};
