// Sample employee data with location history for different dates
export const employeesData = [
  {
    id: 'emp1',
    name: 'John Doe',
    designation: 'Sales Representative',
    phone: '+1 123-456-7890',
    email: 'john.doe@example.com',
    avatar: '/images/avatars/1.png',
    currentLocation: { lat: 28.6139, lng: 77.2090 }, // Delhi
    historyData: {
      '2024-03-23': [
        { time: '09:00', location: { lat: 28.6129, lng: 77.2295 }, activity: 'Checked in at office' },
        { time: '10:30', location: { lat: 28.6354, lng: 77.2250 }, activity: 'Client meeting' },
        { time: '12:00', location: { lat: 28.6312, lng: 77.2151 }, activity: 'Lunch break' },
        { time: '14:00', location: { lat: 28.6411, lng: 77.2178 }, activity: 'Field visit' },
        { time: '17:30', location: { lat: 28.6139, lng: 77.2090 }, activity: 'Returned to office' }
      ],
      '2024-03-22': [
        { time: '09:15', location: { lat: 28.6139, lng: 77.2090 }, activity: 'Checked in at office' },
        { time: '11:00', location: { lat: 28.5621, lng: 77.2387 }, activity: 'Site inspection' },
        { time: '13:30', location: { lat: 28.5710, lng: 77.2310 }, activity: 'Lunch with client' },
        { time: '15:00', location: { lat: 28.5819, lng: 77.2259 }, activity: 'Product demo' },
        { time: '18:00', location: { lat: 28.6139, lng: 77.2090 }, activity: 'End of day' }
      ]
    }
  },
  {
    id: 'emp2',
    name: 'Jane Smith',
    designation: 'Field Agent',
    phone: '+1 987-654-3210',
    email: 'jane.smith@example.com',
    avatar: '/images/avatars/5.png',
    currentLocation: { lat: 28.5355, lng: 77.3910 }, // Noida
    historyData: {
      '2024-03-23': [
        { time: '08:30', location: { lat: 28.5355, lng: 77.3910 }, activity: 'Started work' },
        { time: '10:00', location: { lat: 28.5431, lng: 77.4002 }, activity: 'Customer appointment' },
        { time: '12:30', location: { lat: 28.5374, lng: 77.3968 }, activity: 'Lunch break' },
        { time: '14:30', location: { lat: 28.5456, lng: 77.3892 }, activity: 'Technical support' },
        { time: '17:00', location: { lat: 28.5355, lng: 77.3910 }, activity: 'End of shift' }
      ],
      '2024-03-22': [
        { time: '08:45', location: { lat: 28.5355, lng: 77.3910 }, activity: 'Start of day' },
        { time: '09:30', location: { lat: 28.5701, lng: 77.3219 }, activity: 'Team meeting' },
        { time: '11:45', location: { lat: 28.5641, lng: 77.3155 }, activity: 'Training session' },
        { time: '13:15', location: { lat: 28.5599, lng: 77.3245 }, activity: 'Lunch' },
        { time: '15:30', location: { lat: 28.5355, lng: 77.3910 }, activity: 'Admin work' }
      ]
    }
  },
  {
    id: 'emp3',
    name: 'Robert Johnson',
    designation: 'Delivery Driver',
    phone: '+1 555-123-4567',
    email: 'robert.johnson@example.com',
    avatar: '/images/avatars/8.png',
    currentLocation: { lat: 28.4595, lng: 77.0266 }, // Gurugram
    historyData: {
      '2024-03-23': [
        { time: '09:00', location: { lat: 28.4595, lng: 77.0266 }, activity: 'Loading vehicle' },
        { time: '10:15', location: { lat: 28.4649, lng: 77.0359 }, activity: 'First delivery' },
        { time: '11:45', location: { lat: 28.4705, lng: 77.0432 }, activity: 'Second delivery' },
        { time: '13:30', location: { lat: 28.4619, lng: 77.0281 }, activity: 'Lunch break' },
        { time: '14:30', location: { lat: 28.4769, lng: 77.0513 }, activity: 'Third delivery' },
        { time: '16:00', location: { lat: 28.4828, lng: 77.0571 }, activity: 'Fourth delivery' },
        { time: '17:45', location: { lat: 28.4595, lng: 77.0266 }, activity: 'Return to warehouse' }
      ],
      '2024-03-22': [
        { time: '08:45', location: { lat: 28.4595, lng: 77.0266 }, activity: 'Start of day' },
        { time: '09:30', location: { lat: 28.4698, lng: 77.0336 }, activity: 'Delivery 1' },
        { time: '11:00', location: { lat: 28.4725, lng: 77.0475 }, activity: 'Delivery 2' },
        { time: '12:30', location: { lat: 28.4615, lng: 77.0399 }, activity: 'Lunch' },
        { time: '14:00', location: { lat: 28.4755, lng: 77.0622 }, activity: 'Delivery 3' },
        { time: '18:00', location: { lat: 28.4595, lng: 77.0266 }, activity: 'End of shift' }
      ]
    }
  },
  {
    id: 'emp4',
    name: 'Sarah Williams',
    designation: 'Marketing Executive',
    phone: '+1 444-555-6666',
    email: 'sarah.williams@example.com',
    avatar: '/images/avatars/2.png',
    currentLocation: { lat: 28.6280, lng: 77.3649 }, // East Delhi
    historyData: {
      '2024-03-23': [
        { time: '09:15', location: { lat: 28.6280, lng: 77.3649 }, activity: 'Office arrival' },
        { time: '11:00', location: { lat: 28.6316, lng: 77.3512 }, activity: 'Marketing campaign meeting' },
        { time: '12:45', location: { lat: 28.6364, lng: 77.3499 }, activity: 'Lunch' },
        { time: '14:30', location: { lat: 28.6280, lng: 77.3649 }, activity: 'Video shoot' },
        { time: '17:00', location: { lat: 28.6293, lng: 77.3712 }, activity: 'Client dinner' }
      ],
      '2024-03-22': [
        { time: '09:00', location: { lat: 28.6280, lng: 77.3649 }, activity: 'Office work' },
        { time: '10:30', location: { lat: 28.6214, lng: 77.3720 }, activity: 'Team brainstorming' },
        { time: '13:00', location: { lat: 28.6197, lng: 77.3677 }, activity: 'Lunch break' },
        { time: '15:15', location: { lat: 28.6322, lng: 77.3578 }, activity: 'Photoshoot location' },
        { time: '18:30', location: { lat: 28.6280, lng: 77.3649 }, activity: 'Day end' }
      ]
    }
  },
  {
    id: 'emp5',
    name: 'Michael Brown',
    designation: 'Technical Support',
    phone: '+1 333-222-1111',
    email: 'michael.brown@example.com',
    avatar: '/images/avatars/3.png',
    currentLocation: { lat: 28.7041, lng: 77.1025 }, // North Delhi
    historyData: {
      '2024-03-23': [
        { time: '08:30', location: { lat: 28.7041, lng: 77.1025 }, activity: 'Work start' },
        { time: '10:00', location: { lat: 28.7089, lng: 77.1127 }, activity: 'Hardware installation' },
        { time: '12:15', location: { lat: 28.7102, lng: 77.1021 }, activity: 'Break' },
        { time: '13:00', location: { lat: 28.7134, lng: 77.0999 }, activity: 'Network troubleshooting' },
        { time: '16:45', location: { lat: 28.7041, lng: 77.1025 }, activity: 'Shift end' }
      ],
      '2024-03-22': [
        { time: '08:45', location: { lat: 28.7041, lng: 77.1025 }, activity: 'Day start' },
        { time: '09:30', location: { lat: 28.7011, lng: 77.1095 }, activity: 'Server maintenance' },
        { time: '12:00', location: { lat: 28.7058, lng: 77.1125 }, activity: 'Lunch time' },
        { time: '14:00', location: { lat: 28.7019, lng: 77.1067 }, activity: 'Client support call' },
        { time: '17:30', location: { lat: 28.7041, lng: 77.1025 }, activity: 'End of day' }
      ]
    }
  }
];

// Utility function to get employee history for a specific date
export const getEmployeeHistoryByDate = (employeeId, date) => {
  const employee = employeesData.find(emp => emp.id === employeeId);
  if (!employee || !employee.historyData[date]) {
    return [];
  }
  return employee.historyData[date];
};

// Convert employees data to GeoJSON format for map display
export const employeesGeoJson = {
  type: 'FeatureCollection',
  features: employeesData.map(employee => ({
    type: 'Feature',
    properties: {
      id: employee.id,
      name: employee.name,
      designation: employee.designation,
      phone: employee.phone,
      email: employee.email,
      avatar: employee.avatar,
      type: 'employee'
    },
    geometry: {
      type: 'Point',
      coordinates: [employee.currentLocation.lng, employee.currentLocation.lat]
    }
  }))
};
