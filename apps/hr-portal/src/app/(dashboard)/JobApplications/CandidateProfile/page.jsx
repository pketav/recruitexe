'use client'

import {
  Tabs, Tab, Box, Typography, Grid, Container, Paper, Fade, Chip, Avatar,
  Divider, CircularProgress, IconButton, Tooltip
} from "@mui/material";
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LanguageIcon from '@mui/icons-material/Language';
import VerifiedIcon from '@mui/icons-material/Verified';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import DownloadIcon from '@mui/icons-material/Download';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { LinearProgress } from '@mui/material';
import { useRouter } from "next/navigation";
import { ArrowBack } from "@mui/icons-material";

// Custom styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  background: '#ffffff',
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '8px',
  background: '#ffffff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  border: '1px solid #e0e0e0',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: '#ffffff',
  borderBottom: '1px solid #e0e0e0',
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    backgroundColor: '#333333',
    height: '2px',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.9rem',
    color: '#555555',
    padding: theme.spacing(1, 3),
    '&:hover': {
      color: '#333333',
      backgroundColor: '#f7f7f7',
    },
    '&.Mui-selected': {
      color: '#333333',
      fontWeight: 600,
    },
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '8px',
  background: '#ffffff',
  border: '1px solid #e0e0e0',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
}));

const TimelineCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(5),
  marginBottom: theme.spacing(3),
  '&:before': {
    content: '""',
    position: 'absolute',
    left: '20px',
    top: '0',
    bottom: '-24px',
    width: '4px',
    background: 'linear-gradient(to bottom, #333333, #e0e0e0)',
  },
}));

const TimelineDot = styled(Avatar)(({ theme }) => ({
  position: 'absolute',
  left: '12px',
  top: '12px',
  width: '32px',
  height: '32px',
  background: '#ffffff',
  border: '3px solid #333333',
  color: '#333333',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const TimelineHeader = styled(Box)(({ theme }) => ({
  background: '#f7f7f7',
  padding: theme.spacing(2),
  borderRadius: '6px 6px 0 0',
  borderBottom: '1px solid #e0e0e0',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#333333',
  marginBottom: theme.spacing(3),
  fontSize: '1.5rem',
  fontFamily: '"Roboto", sans-serif',
  borderBottom: '2px solid #e0e0e0',
  paddingBottom: theme.spacing(1),
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: '8px',
  background: '#f7f7f7',
  marginBottom: theme.spacing(3),
  border: '1px solid #e0e0e0',
}));

const DocumentPreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  '& img': {
    transition: 'opacity 0.2s ease',
    opacity: 0.9,
    '&:hover': {
      opacity: 1,
    },
  },
}));

function TabPanel({ children, value, index }) {
  return (
    <Fade in={value === index} timeout={300}>
      <Box hidden={value !== index} sx={{ p: { xs: 1.5, md: 3 } }}>
        {children}
      </Box>
    </Fade>
  );
}

const InfoItem = ({ label, value, icon }) => (
  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
    {icon && (
      <Avatar sx={{ bgcolor: '#f7f7f7', color: '#555555', width: 32, height: 32 }}>
        {icon}
      </Avatar>
    )}
    <Box>
      <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, fontSize: '0.85rem' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: '#333333', fontWeight: 400, fontSize: '0.95rem' }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  </Box>
);

const formatLabel = (text) =>
  text
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

// Helper function to format address objects
const formatAddress = (address) => {
  if (!address || typeof address !== 'object') return 'N/A';
  const { address1, address2, city, state, country, pincode } = address;
  const parts = [address1, address2, city, state, country, pincode].filter(part => part);
  return parts.join(', ');
};

export default function CandidateProfile() {
  const [candidateData, setCandidateData] = useState({});
  const [loading, setLoading] = useState(true);
  const token = window.localStorage.getItem("authToken");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  const tabLabels = [
    { label: "Basic Info", icon: <PersonIcon /> },
    { label: "KYC", icon: <VerifiedIcon /> },
    { label: "Bank Details", icon: <MonetizationOnIcon /> },
    { label: "Education", icon: <SchoolIcon /> },
    { label: "Personal Documents", icon: <TimelineIcon /> },
    { label: "Family", icon: <PersonIcon /> },
    { label: "Professional Experience", icon: <WorkIcon /> },
    { label: "Preferences", icon: <WorkIcon /> },
    { label: "Summary & Other Details", icon: <PersonIcon /> },
  ];

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/v1/api/job/detail?id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      if (res.data.status) {
        setCandidateData(res.data.items.candidateId);
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <StyledContainer maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress color="inherit" sx={{ color: '#555555' }} />
        </Box>
      </StyledContainer>
    );
  }

  // Combine Profile_Info address fields into a single address
  const profileAddress = candidateData.profile_Info ? {
    address1: candidateData.profile_Info.address1,
    address2: candidateData.profile_Info.address2,
    city: candidateData.profile_Info.city,
    state: candidateData.profile_Info.state,
    country: candidateData.profile_Info.country,
    pincode: candidateData.profile_Info.pincode,
  } : {};

  // Define preferred order for Basic Info fields
  const preferredOrder = [
    'Name', 'email', 'gender', 'dob',
    'maritalStatus', 'EmergencyNumber', 'EmergencyContact', 'RelationwihContact',
    'Nationality', 'identityMark', 'height', 'caste', 'category', 'religion',
    'bloodGroup', 'homeDistrict', 'homeState', 'nearestRailwaySt', 'Reference',
    'CurrentAddress', 'PermentAddress', 'ProfileAddress', 'socialAccounts'
  ];

  // Prepare Basic Info fields in preferred order
  const orderedBasicInfo = [];
  preferredOrder.forEach(key => {
    if (key === 'ProfileAddress' && profileAddress.address1) {
      orderedBasicInfo.push({ key: 'ProfileAddress', value: formatAddress(profileAddress), label: 'Profile Address' });
    } else if (key === 'socialAccounts' && candidateData.profile_Info?.socialAccounts) {
      orderedBasicInfo.push({ key, value: candidateData.profile_Info.socialAccounts.join(', '), label: 'Social Accounts' });
    } else if (candidateData.Basic_Info?.[key] && !['fatherName', 'MotherName'].includes(key)) {
      orderedBasicInfo.push({
        key,
        value: key === 'CurrentAddress' || key === 'PermentAddress' ? formatAddress(candidateData.Basic_Info[key]) : candidateData.Basic_Info[key],
        label: key === 'CurrentAddress' ? 'Current Address' : key === 'PermentAddress' ? 'Permanent Address' : formatLabel(key)
      });
    }
  });

  return (
    <StyledContainer maxWidth="xl">
      <IconButton variant="outlined" size="small" color="primary" onClick={() => router.push("/JobApplications")}>
        <ArrowBack />
      </IconButton>
      <StyledPaper>
        {/* Profile Header */}
        <ProfileHeader>
          <Avatar
            src={candidateData.profilePicture}
            alt={candidateData.Basic_Info?.Name || 'Candidate'}
            sx={{ width: 80, height: 80, border: '2px solid #e0e0e0' }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333333', mb: 0.5 }}>
              {candidateData.Basic_Info?.Name || 'Candidate Name'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555555', mb: 1 }}>
              {candidateData.Basic_Info?.email || 'N/A'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              {candidateData.profile_Info?.socialAccounts?.map((account, idx) => (
                <Tooltip key={idx} title={account}>
                  <IconButton
                    href={account}
                    target="_blank"
                    sx={{ color: '#555555', '&:hover': { bgcolor: '#f7f7f7' } }}
                  >
                    {account.includes('linkedin') ? <LinkedInIcon /> : <GitHubIcon />}
                  </IconButton>
                </Tooltip>
              ))}
              {candidateData.resume && (
                <Tooltip title="Download Resume">
                  <IconButton
                    href={candidateData.resume}
                    download
                    sx={{ color: '#555555', '&:hover': { bgcolor: '#f7f7f7' } }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <LinearProgress
              variant="determinate"
              value={candidateData.profileCompletionPercentage || 0}
              sx={{
                width: '150px',
                height: '6px',
                borderRadius: '3px',
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { bgcolor: '#333333' },
              }}
            />
            <Typography variant="caption" sx={{ mt: 0.5, color: '#555555' }}>
              Profile Completion: {candidateData.profileCompletionPercentage || 0}%
            </Typography>
          </Box>
        </ProfileHeader>

        {/* Tabs */}
        <StyledTabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="candidate profile tabs"
        >
          {tabLabels.map(({ label, icon }, index) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {icon}
                  {label}
                </Box>
              }
              aria-label={label}
            />
          ))}
        </StyledTabs>

        {/* Tab 0 - Basic Info */}
        <TabPanel value={tabIndex} index={0}>
          <SectionTitle>Basic Information</SectionTitle>
          <Grid container spacing={2}>
            {orderedBasicInfo.map(({ key, value, label }) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <InfoCard>
                    <InfoItem
                      label={label}
                      value={typeof value === 'object' ? JSON.stringify(value) : value}
                      icon={<PersonIcon />}
                    />
                  </InfoCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 1 - KYC */}
        <TabPanel value={tabIndex} index={1}>
          <SectionTitle>KYC Details</SectionTitle>
          <Grid container spacing={2}>
            {Object.entries(candidateData.KYC_Details || {}).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <InfoCard>
                    <InfoItem label={formatLabel(key)} value={value} icon={<VerifiedIcon />} />
                  </InfoCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 2 - Bank Details */}
        <TabPanel value={tabIndex} index={2}>
          <SectionTitle>Bank Details</SectionTitle>
          <Grid container spacing={2}>
            {Object.entries(candidateData.Bank_verification || {}).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <InfoCard>
                    <InfoItem label={formatLabel(key)} value={value} icon={<MonetizationOnIcon />} />
                  </InfoCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 3 - Education */}
        <TabPanel value={tabIndex} index={3}>
          <SectionTitle>Education Details</SectionTitle>
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {(candidateData.education || []).map((edu, idx) => (
              <motion.div
                key={edu._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <TimelineCard>
                  <TimelineDot>
                    <SchoolIcon fontSize="small" />
                  </TimelineDot>
                  <InfoCard sx={{ borderRadius: '6px', overflow: 'hidden' }}>
                    <TimelineHeader>
                      <Typography variant="h6" sx={{ color: '#333333', fontWeight: 600 }}>
                        {edu.degree || edu.course || edu.graduationdegress || 'Education Entry'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555555' }}>
                        {edu.startDate && edu.endDate ? `${new Date(edu.startDate).getFullYear()} - ${new Date(edu.endDate).getFullYear()}` : edu.yearOfPassing || 'N/A'}
                      </Typography>
                    </TimelineHeader>
                    <Box sx={{ p: 2.5 }}>
                      <Grid container spacing={2}>
                        {Object.entries(edu)
                          .filter(([key]) => key !== '_id' && key !== 'certificate' && key !== 'description')
                          .map(([key, value]) => (
                            <Grid item xs={12} sm={6} key={key}>
                              <InfoItem label={formatLabel(key)} value={value} icon={<SchoolIcon />} />
                            </Grid>
                          ))}
                      </Grid>
                      {edu.description && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1 }}>
                            Description
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#333333' }}>
                            {edu.description}
                          </Typography>
                        </Box>
                      )}
                      {edu.certificate && (
                        <Box sx={{ mt: 2 }}>
                          <Tooltip title="Download Certificate">
                            <IconButton href={edu.certificate} download sx={{ color: '#555555' }}>
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  </InfoCard>
                </TimelineCard>
              </motion.div>
            ))}
          </Box>
        </TabPanel>

        {/* Tab 4 - Personal Documents */}
        <TabPanel value={tabIndex} index={4}>
          <SectionTitle>Personal Documents</SectionTitle>
          <Grid container spacing={2}>
            {Object.entries(candidateData.Personal_Documents || {}).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <InfoCard>
                    <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1.5 }}>
                      {formatLabel(key)}
                    </Typography>
                    {Array.isArray(value) ? (
                      value.map((item, idx) => (
                        <DocumentPreview key={idx} sx={{ mb: 2 }}>
                          <Box
                            component="img"
                            src={typeof item === 'object' ? Object.values(item)[0] : item}
                            alt={key}
                            sx={{
                              width: '100%',
                              maxHeight: '150px',
                              objectFit: 'contain',
                              borderRadius: '6px',
                            }}
                          />
                          <Tooltip title="Download Document">
                            <IconButton
                              href={typeof item === 'object' ? Object.values(item)[0] : item}
                              download
                              sx={{ position: 'absolute', top: 6, right: 6, color: '#555555' }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </DocumentPreview>
                      ))
                    ) : (
                      <DocumentPreview>
                        <Box
                          component="img"
                          src={value}
                          alt={key}
                          sx={{
                            width: '100%',
                            maxHeight: '150px',
                            objectFit: 'contain',
                            borderRadius: '6px',
                          }}
                        />
                        <Tooltip title="Download Document">
                          <IconButton href={value} download sx={{ position: 'absolute', top: 6, right: 6, color: '#555555' }}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </DocumentPreview>
                    )}
                  </InfoCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 5 - Family */}
        <TabPanel value={tabIndex} index={5}>
          <SectionTitle>Family Details</SectionTitle>
          <Grid container spacing={2}>
            {Object.entries(candidateData.Family_Info || {})
              .filter(([key]) => !['fatherName', 'motherName'].includes(key))
              .map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InfoCard>
                      <InfoItem
                        label={formatLabel(key)}
                        value={typeof value === 'object' ? JSON.stringify(value) : value}
                        icon={<PersonIcon />}
                      />
                    </InfoCard>
                  </motion.div>
                </Grid>
              ))}
            {(candidateData.nominee || []).map((nominee, idx) => (
              <Grid item xs={12} sm={6} md={4} key={nominee._id || idx}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <InfoCard>
                    <Typography variant="h6" sx={{ color: '#333333', fontWeight: 600, mb: 2 }}>
                      Nominee {idx + 1}
                    </Typography>
                    {Object.entries(nominee).map(([key, value]) => (
                      key !== '_id' && (
                        <InfoItem key={key} label={formatLabel(key)} value={value} icon={<PersonIcon />} />
                      )
                    ))}
                  </InfoCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 6 - Professional Experience */}
        <TabPanel value={tabIndex} index={6}>
          <SectionTitle>Professional Experience</SectionTitle>
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {(candidateData.professional_Experience || [])
              .filter(exp => exp.title || exp.organization)
              .map((exp, idx) => (
                <motion.div
                  key={exp._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <TimelineCard>
                    <TimelineDot>
                      <WorkIcon fontSize="small" />
                    </TimelineDot>
                    <InfoCard sx={{ borderRadius: '6px', overflow: 'hidden' }}>
                      <TimelineHeader>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ color: '#333333', fontWeight: 600 }}>
                            {exp.title || exp.organization || 'Work Experience'}
                          </Typography>
                          {exp.isCurrentJob && (
                            <Chip
                              label="Current Job"
                              color="primary"
                              size="small"
                              sx={{ bgcolor: '#333333', color: '#ffffff' }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: '#555555' }}>
                          {exp.startDate && exp.endDate ? `${new Date(exp.startDate).getFullYear()} - ${new Date(exp.endDate).getFullYear()}` : exp.startDate ? `${new Date(exp.startDate).getFullYear()} - Present` : 'N/A'}
                        </Typography>
                      </TimelineHeader>
                      <Box sx={{ p: 2.5 }}>
                        <Grid container spacing={2}>
                          {Object.entries(exp)
                            .filter(([key]) => key !== '_id' && key !== 'salarySlip' && key !== 'description')
                            .map(([key, value]) => (
                              <Grid item xs={12} sm={6} key={key}>
                                <InfoItem
                                  label={formatLabel(key)}
                                  value={Array.isArray(value) ? value.join(', ') : value || 'N/A'}
                                  icon={<WorkIcon />}
                                />
                              </Grid>
                            ))}
                        </Grid>
                        {exp.description && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1 }}>
                              Description
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#333333' }}>
                              {exp.description}
                            </Typography>
                          </Box>
                        )}
                        {(exp.salarySlip || []).length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1 }}>
                              Documents
                            </Typography>
                            {exp.salarySlip.map((doc, i) => (
                              <Tooltip key={i} title="Download Document">
                                <IconButton href={doc} download sx={{ mr: 1, color: '#555555' }}>
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </InfoCard>
                  </TimelineCard>
                </motion.div>
              ))}
          </Box>
        </TabPanel>

        {/* Tab 7 - Preferences */}
        <TabPanel value={tabIndex} index={7}>
          <SectionTitle>Job Preferences</SectionTitle>
          <Grid container spacing={2}>
            {Object.entries(candidateData.jobPreferences || {}).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <InfoCard>
                    <InfoItem
                      label={formatLabel(key)}
                      value={Array.isArray(value) ? value.join(', ') : value}
                      icon={<WorkIcon />}
                    />
                  </InfoCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 8 - Summary & Other Details */}
        <TabPanel value={tabIndex} index={8}>
          <SectionTitle>Profile Overview</SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <InfoCard>
                  <Typography variant="h6" sx={{ color: '#333333', fontWeight: 600, mb: 2 }}>
                    Personal Summary
                  </Typography>
                  {candidateData.summary && (
                    <InfoItem label="Summary" value={candidateData.summary} icon={<PersonIcon />} />
                  )}
                  {candidateData.aboutUs && (
                    <InfoItem label="About Us" value={candidateData.aboutUs} icon={<PersonIcon />} />
                  )}
                  {candidateData.Reasonforleaving && (
                    <InfoItem label="Reason for Leaving" value={candidateData.Reasonforleaving} icon={<WorkIcon />} />
                  )}
                  {candidateData.skills?.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1 }}>
                        Skills
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {candidateData.skills.map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            sx={{
                              bgcolor: '#f7f7f7',
                              color: '#333333',
                              fontWeight: 500,
                              '&:hover': { bgcolor: '#e0e0e0' },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {candidateData.languagesKnown?.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1 }}>
                        Languages Known
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {candidateData.languagesKnown.map((lang, idx) => (
                          <Chip
                            key={idx}
                            label={lang}
                            icon={<LanguageIcon sx={{ color: '#555555' }} />}
                            sx={{
                              bgcolor: '#f7f7f7',
                              color: '#333333',
                              fontWeight: 500,
                              '&:hover': { bgcolor: '#e0e0e0' },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {candidateData.others?.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1 }}>
                        Other Links
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {candidateData.others.map((item, idx) => (
                          <Chip
                            key={idx}
                            label={item.key}
                            component="a"
                            href={item.value}
                            target="_blank"
                            clickable
                            sx={{
                              bgcolor: '#f7f7f7',
                              color: '#333333',
                              fontWeight: 500,
                              '&:hover': { bgcolor: '#e0e0e0' },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </InfoCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <InfoCard>
                  <Typography variant="h6" sx={{ color: '#333333', fontWeight: 600, mb: 2 }}>
                    Professional Details
                  </Typography>
                  {candidateData.expectedSalary && (
                    <InfoItem label="Expected Salary" value={candidateData.expectedSalary} icon={<MonetizationOnIcon />} />
                  )}
                  {candidateData.currentCTC && (
                    <InfoItem label="Current CTC" value={candidateData.currentCTC} icon={<MonetizationOnIcon />} />
                  )}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1 }}>
                      Status
                    </Typography>
                    <Chip
                      label={candidateData.status || 'N/A'}
                      sx={{
                        bgcolor: candidateData.status === 'Active' ? '#f7f7f7' : '#e0e0e0',
                        color: '#333333',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  <InfoItem
                    label="Profile Completion"
                    value={`${candidateData.profileCompletionPercentage}%`}
                    icon={<PersonIcon />}
                  />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1 }}>
                      Email Verified
                    </Typography>
                    <Chip
                      label={String(candidateData.isEmailVerified) === 'true' ? 'Verified' : 'Not Verified'}
                      sx={{
                        bgcolor: candidateData.isEmailVerified ? '#f7f7f7' : '#e0e0e0',
                        color: '#333333',
                        fontWeight: 500,
                      }}
                      icon={<VerifiedIcon sx={{ color: '#555555' }} />}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1 }}>
                      Profile Completed
                    </Typography>
                    <Chip
                      label={String(candidateData.isProfileCompleted) === 'true' ? 'Completed' : 'Incomplete'}
                      sx={{
                        bgcolor: candidateData.isProfileCompleted ? '#f7f7f7' : '#e0e0e0',
                        color: '#333333',
                        fontWeight: 500,
                      }}
                      icon={<VerifiedIcon sx={{ color: '#555555' }} />}
                    />
                  </Box>
                  <InfoItem label="Created At" value={candidateData.createdAt} icon={<ScheduleIcon />} />
                  {candidateData.resumeDetails && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#555555', fontWeight: 500, mb: 1 }}>
                        Resume Details
                      </Typography>
                      <InfoItem
                        label="File Name"
                        value={candidateData.resumeDetails.originalFileName}
                        icon={<TimelineIcon />}
                      />
                      <InfoItem
                        label="Uploaded At"
                        value={candidateData.resumeDetails.uploadedAt}
                        icon={<ScheduleIcon />}
                      />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {candidateData.resumeDetails.parsedKeywords.map((keyword, idx) => (
                          <Chip
                            key={idx}
                            label={keyword}
                            sx={{
                              bgcolor: '#f7f7f7',
                              color: '#333333',
                              fontWeight: 500,
                              '&:hover': { bgcolor: '#e0e0e0' },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </InfoCard>
              </motion.div>
            </Grid>
          </Grid>
        </TabPanel>
      </StyledPaper>
    </StyledContainer>
  );
}
