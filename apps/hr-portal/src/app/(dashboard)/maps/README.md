# Google Maps Tracking System

This component implements a comprehensive Google Maps integration with the following features:

## Features

1. **Multiple Marker Types:**
   - Employee markers with avatar display
   - Customer markers with business type indicators
   - Branch office markers

2. **Employee Live Tracking:**
   - Real-time tracking of employee movements
   - Visual indication of tracked employees
   - Movement path displayed on the map

3. **Employee Movement History:**
   - View employee movement history by date
   - Timeline view showing locations and activities
   - Path visualization on the map

4. **Interactive Info Windows:**
   - Detailed information displayed when clicking on markers
   - Different information layouts for each marker type
   - Quick actions for employee tracking

5. **Marker Clustering:**
   - Automatic clustering of nearby markers
   - Custom cluster appearance
   - Expandable cluster information

6. **Custom Marker Icons:**
   - Distinctive icons for each marker type
   - Visual indicators for tracking status
   - Hover effects for better user interaction

7. **Filter Controls:**
   - Show/hide specific marker types
   - Toggle clustering feature
   - Expandable control panel

## Setup Instructions

1. **API Key Setup:**
   - Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the required Google Maps APIs (Maps JavaScript API, Geocoding API)
   - Add the API key to your environment variables:
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

2. **Install Required Dependencies:**
   ```bash
   npm install @vis.gl/react-google-maps supercluster @types/supercluster date-fns
   ```

3. **Usage:**
   - Navigate to the Maps page to see the implementation
   - Use the filter panel to customize the view
   - Click on markers to see detailed information
   - For employees, you can track their live movement or view historical data

## Component Structure

- **GoogleMapContainer.jsx** - Main component integrating all map features
- **Markers** - Custom marker components for different entity types
- **MarkerClusterer.jsx** - Handles clustering of nearby markers
- **InfoWindow.jsx** - Displays details when markers are clicked
- **FilterPanel.jsx** - Controls for filtering marker types
- **Timeline.jsx** - Employee movement history visualization
- **Hooks** - Custom hooks for tracking and clustering

## Data Structure

The current implementation uses sample data in the following format:

- **Employees**: Records with location history and tracking information
- **Customers**: Business locations with contact details and visit schedule
- **Branches**: Office locations with detailed information

In a production environment, this would be connected to your backend API.

## Customizing Marker Styles

You can customize the marker appearances by modifying the respective marker components:

- `EmployeeMarker.jsx`
- `CustomerMarker.jsx`
- `BranchMarker.jsx`

Each component contains styled-jsx styling that can be adjusted to match your design requirements.

## Adding New Marker Types

To add new marker types:

1. Create a new marker component in the `components/markers` directory
2. Add the data structure in the `data` directory
3. Update the `MarkerClusterer.jsx` component to handle the new marker type
4. Update the `InfoWindow.jsx` component to display information for the new type
5. Add the new marker type to the filter options in `FilterPanel.jsx`
