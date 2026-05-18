'use client';

import React, { useEffect, useState } from 'react';

import { Box, Card, CardContent, Typography, Avatar, Divider } from '@mui/material';

const UserInformation = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window !== 'undefined') {
        try {
          const token = localStorage?.getItem('authToken');

          if (!token) return;

          const tokenDecodablePart = token?.split('.')[1];
          const decoded = JSON.parse(atob(tokenDecodablePart));
          const employeeIdFromToken = decoded?.Id;

          if (employeeIdFromToken) {
            const response = await fetch(
              `${baseUrl}/v1/api/Auth/getEmployeById/${employeeIdFromToken}`,
              {
                headers: {
                  token: token
                }
              }
            );

            if (!response.ok) {
              throw new Error('Failed to fetch user data');
            }

            const data = await response.json();

            setUserData(data.items.employee);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [baseUrl]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading user information...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            src={userData?.employeePhoto}
            alt={userData?.employeName}
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
            {userData?.employeName || 'Unknown User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData?.designationId?.name || 'No Designation'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <InfoItem label="Employee ID" value={userData?.employeUniqueId} />
          <InfoItem label="Department" value={userData?.departmentId?.name} />
          <InfoItem label="Branch" value={userData?.branchId?.name} />
          <InfoItem label="Reporting Manager" value={userData?.reportingManagerId?.employeName} />
          <InfoItem label="Email" value={userData?.email} />
          <InfoItem label="Phone" value={userData?.mobile} />
        </Box>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    <Typography variant="body2" color="text.secondary">{label}:</Typography>
    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{value || 'N/A'}</Typography>
  </Box>
);

export default UserInformation;
