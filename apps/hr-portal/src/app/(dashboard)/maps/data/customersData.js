// Sample customer data
export const customersData = [
  {
    id: 'cust1',
    name: 'ABC Corporation',
    type: 'Corporate',
    contactPerson: 'David Wilson',
    phone: '+1 111-222-3333',
    email: 'david@abccorp.com',
    address: '123 Business Park, Delhi',
    location: { lat: 28.6190, lng: 77.2300 }, // Delhi
    lastVisit: '2024-03-20',
    nextScheduledVisit: '2024-03-28'
  },
  {
    id: 'cust2',
    name: 'XYZ Enterprises',
    type: 'SME',
    contactPerson: 'Emily Clark',
    phone: '+1 222-333-4444',
    email: 'emily@xyzent.com',
    address: '456 Tech Hub, Noida',
    location: { lat: 28.5700, lng: 77.3200 }, // Noida
    lastVisit: '2024-03-18',
    nextScheduledVisit: '2024-03-29'
  },
  {
    id: 'cust3',
    name: 'Global Solutions Ltd',
    type: 'Corporate',
    contactPerson: 'Thomas Baker',
    phone: '+1 333-444-5555',
    email: 'thomas@globalsol.com',
    address: '789 Corporate Tower, Gurugram',
    location: { lat: 28.4900, lng: 77.0800 }, // Gurugram
    lastVisit: '2024-03-22',
    nextScheduledVisit: '2024-04-02'
  },
  {
    id: 'cust4',
    name: 'Retail Masters',
    type: 'Retail',
    contactPerson: 'Olivia Green',
    phone: '+1 444-555-6666',
    email: 'olivia@retailmasters.com',
    address: '234 Shopping Plaza, South Delhi',
    location: { lat: 28.5500, lng: 77.2100 }, // South Delhi
    lastVisit: '2024-03-19',
    nextScheduledVisit: '2024-03-27'
  },
  {
    id: 'cust5',
    name: 'Tech Innovations',
    type: 'Startup',
    contactPerson: 'Nathan Lee',
    phone: '+1 555-666-7777',
    email: 'nathan@techinnovations.com',
    address: '567 Startup Valley, Noida',
    location: { lat: 28.5800, lng: 77.3300 }, // Noida
    lastVisit: '2024-03-21',
    nextScheduledVisit: '2024-03-30'
  },
  {
    id: 'cust6',
    name: 'Healthcare Plus',
    type: 'Healthcare',
    contactPerson: 'Sophia Martinez',
    phone: '+1 666-777-8888',
    email: 'sophia@healthcareplus.com',
    address: '890 Medical Park, East Delhi',
    location: { lat: 28.6300, lng: 77.3000 }, // East Delhi
    lastVisit: '2024-03-15',
    nextScheduledVisit: '2024-03-31'
  },
  {
    id: 'cust7',
    name: 'Education First',
    type: 'Education',
    contactPerson: 'William Turner',
    phone: '+1 777-888-9999',
    email: 'william@educationfirst.com',
    address: '321 Knowledge Center, North Delhi',
    location: { lat: 28.7000, lng: 77.1900 }, // North Delhi
    lastVisit: '2024-03-17',
    nextScheduledVisit: '2024-03-26'
  },
  {
    id: 'cust8',
    name: 'Food Delights',
    type: 'Food & Beverage',
    contactPerson: 'Jessica Adams',
    phone: '+1 888-999-0000',
    email: 'jessica@fooddelights.com',
    address: '432 Culinary Street, West Delhi',
    location: { lat: 28.6500, lng: 77.1200 }, // West Delhi
    lastVisit: '2024-03-16',
    nextScheduledVisit: '2024-04-01'
  }
];

// Convert customers data to GeoJSON format for map display
export const customersGeoJson = {
  type: 'FeatureCollection',
  features: customersData.map(customer => ({
    type: 'Feature',
    properties: {
      id: customer.id,
      name: customer.name,
      type: 'customer',
      businessType: customer.type,
      contactPerson: customer.contactPerson,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      lastVisit: customer.lastVisit,
      nextScheduledVisit: customer.nextScheduledVisit
    },
    geometry: {
      type: 'Point',
      coordinates: [customer.location.lng, customer.location.lat]
    }
  }))
};
