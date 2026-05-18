'use client'

import { AccountTree, Add, Business, CalendarToday, Delete, Download, Edit, Email, Filter, KeyboardBackspace, LocationCity, People, Person, Phone, PictureAsPdf, Settings, ViewAgendaTwoTone, ViewColumn, Search, Work } from '@mui/icons-material'
import {
  Container, Paper, Box, Button, Typography, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Grid,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Avatar,
  Tab,
  Tabs,
  Card,
  Modal,
  CardContent,
  InputAdornment,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material'
import { Activity, Users, UserCheck, UserX, Eye, Clock } from "lucide-react"
import { DateRange } from "react-date-range"
import { VpnKey, Dashboard } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { styled, keyframes } from "@mui/material/styles"
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Send } from '@mui/icons-material';
import { BusinessCenter } from '@mui/icons-material';
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Group, DashboardCustomize, Description } from '@mui/icons-material';
import PinDropIcon from '@mui/icons-material/PinDrop';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import { Calendar } from 'lucide-react'
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { BsSuitcase } from 'react-icons/bs'
import CloseIcon from '@mui/icons-material/Close'
import EmailForm from './EmailModal'
import { Refresh } from '@mui/icons-material'
const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateMobile = (mobile) =>
  /^[6-9]\d{9}$/.test(mobile);


const ViewListModal = ({ open, onClose, title, items = [], iconType = 'designation' }) => {
  const Icon = iconType === 'designation' ? Work : LocationCity

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography fontSize={20} fontWeight={600}>{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ mt: -6 }}>
        <List dense>
          {items.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <Icon style={{ fontSize: 26, color: '#1976d2' }} />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ fontSize: 15 }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button onClick={onClose} variant='outlined' color='primary'>
          Close
        </Button>
      </Box>

    </Dialog>
  )
}


export default function AgencySetup() {

  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  const [tabValue, setTabValue] = useState('dashboard')
  const handleTabChange = (e, newValue) => {
    if (newValue) setTabValue(newValue);
  };



  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState('')
  const [accounts, setAccounts] = useState([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [selectedClients, setSelectedClients] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);



  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  }






  function MetricCard({ title, value, subtitle, icon: Icon, bgcolor, textColor, onClick }) {
    return (
      <Card
        sx={{
          bgcolor: bgcolor,
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          cursor: onClick ? "pointer" : "default",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
          },
          "&:hover .hover-icon": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
          },
        }}
        onClick={onClick}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: textColor || "text.primary", mb: 0.5 }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar
              className="hover-icon"
              sx={{
                width: 40,
                height: 40,
                transition: "background-color 0.3s ease",
                bgcolor: "rgba(0,0,0,0.04)",
              }}
            >
              <Icon size={20} color={textColor || "#666"} />
            </Avatar>
          </Stack>
        </CardContent>
      </Card>
    );
  }




  const ClientItem = ({ name, location, date, iconColor }) => (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.06)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: `${iconColor}1A` /* light bg */, color: iconColor }}>
          <Description fontSize="small" />
        </Avatar>
        <Box>
          <Typography fontWeight={600}>{name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {location}
          </Typography>
        </Box>
      </Stack>
      <Typography variant="body2" fontWeight={600}>
        Created On <br /> {date}
      </Typography>
    </Paper>
  )

  const ListCard = ({ title, data, iconColor }) => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 3,
        backgroundColor: '#f9fafb',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Avatar sx={{ bgcolor: `${iconColor}1A`, color: iconColor }}>
          <Description fontSize="small" />
        </Avatar>
        <Typography fontWeight={600}>{title}</Typography>
      </Box>
      {data.map((item, index) => (
        <ClientItem
          key={index}
          name={item.name}
          location={item.location}
          date={item.date}
          iconColor={iconColor}
        />
      ))}
    </Paper>
  )



  // Enhanced Period Filter Component
  const PeriodFilterDropdown = ({
    selectedPeriod,
    onPeriodChange,
  }) => {
    const [customDialogOpen, setCustomDialogOpen] = useState(false)


    const periodOptions = [
      { value: "all", label: "All", icon: <Activity size={16} /> },
      { value: "today", label: "Today", icon: <Clock size={16} /> },
      { value: "week", label: "Last 7 Days", icon: <Calendar size={16} /> },
      { value: "month", label: "Last 30 Days", icon: <Calendar size={16} /> },
      { value: "year", label: "Last Year", icon: <Calendar size={16} /> },
    ]

    const handlePeriodSelect = (period) => {
      if (period === "custom") {
        setCustomDialogOpen(true)
      } else {
        onPeriodChange(period)
      }
    }



    return (
      <>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={selectedPeriod}
            label="Time Period"
            onChange={(e) => handlePeriodSelect(e.target.value)}
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(99, 102, 241, 0.3)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(99, 102, 241, 0.5)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6366f1",
              },
            }}
          >
            {periodOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {option.icon}
                  <Typography>{option.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      </>
    )
  }


  const [addAgency, setAddAgency] = useState(false)
  const router = useRouter()
  const [allAgency, setAllAgency] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [allDesignations, setAllDesignations] = useState([])
  const token = window.localStorage.getItem('authToken')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState({ title: '', items: [], iconType: '' })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    Email: '',
    MobileNumber: '',
    location: []
  });
  const [Assignee, setAssignee] = useState("")
  const [openAssign, setOpenAssign] = useState(false)
  const [selectedDesignation, setSelectedDesignation] = useState('')
  const [allCandidates, setAllCandidates] = useState([])
  const [errors, setErrors] = useState({});
  const [listType, setListType] = useState("client")
  const [assignedCandidates, setAssignedCandidates] = useState([])
  const [viewedClient, setViewedClient] = useState({})
  const [viewClientCandidates, setViewClientCandidates] = useState(false)
  const [filters, setFilters] = useState({
    clientId: "",
    designationId: "",
    search: ""
  })

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState({
    location: '',
    client: '',
    startDate: null,
    endDate: null,
    search: ''
  });


  const clearAllFilter = () => {
    setFilter({
      location: '',
      client: '',
      startDate: null,
      endDate: null,
      search: ''
    })
  }


  const [filteredData, setFilteredData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [clients, setClients] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);

  const [originalData, setOriginalData] = useState({})
  const [changesMade, setChangesMade] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleToggleChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const validate = () => {
    const errs = {};

    if (!formData.companyName?.trim()) {
      errs.companyName = 'Company name is required';
    } else if (formData.companyName.length < 3) {
      errs.companyName = 'Company name too short';
    }

    if (!validateEmail(formData.Email)) {
      errs.Email = 'Enter valid email address';
    }

    if (!validateMobile(formData.MobileNumber)) {
      errs.MobileNumber = 'Enter valid 10-digit mobile number';
    }

    if (!formData.location.length) {
      errs.location = 'Select at least one location';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenModal = (title, items, iconType) => {
    setModalData({ title, items, iconType })
    setOpenModal(true)
  }


  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState('');





  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleDateRangeApply = () => {
    const start = tempDateRange[0].startDate;
    const end = tempDateRange[0].endDate;

    setFilter((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));

    setDateModalOpen(false);
  };

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/v1/api/Agency/getAgencyDashboard?timeFilter=${selectedPeriod}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const data = await res.json();

        if (data?.status) {
          setMetrics(data.items);
        } else {
          throw new Error('API responded with an error');
        }
      } catch (err) {
        setMetricsError('Unable to fetch dashboard metrics.');
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchDashboardMetrics();
  }, [selectedPeriod, baseUrl, token]);



  useEffect(() => {
    const hasChanged = JSON.stringify(originalData) === JSON.stringify(formData);
    setChangesMade(hasChanged);
  }, [formData, originalData]);

  const getAllAgency = async () => {
    try {
      const { location, client, startDate, endDate, search } = filter;

      let url = `${baseUrl}/v1/api/Agency/getAllAgencyClients`;
      const params = new URLSearchParams();


      if (location) params.append("location", location);
      if (client) params.append("clientId", client);
      if (startDate && endDate) {
        params.append("startDate", dayjs(startDate).format("YYYY-MM-DD"));
        params.append("endDate", dayjs(endDate).format("YYYY-MM-DD"));
      }
      if (search) params.append("search", search);

      const query = params.toString();
      if (query) {
        url += `?${query}`;
      }


      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: token
        }
      });

      if (res.data.status) {
        setAllAgency(res.data.items);
        setTotalItems(res.data.items.length);
      } else {
        console.error(" API returned error:", res.data);
      }
    } catch (error) {
      console.error(" Error fetching filtered agency data:", error);
    }
  };
  useEffect(() => {
    getAllAgency();
  }, [filter]);


  const getAllLocations = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/v1/api/branch/getList`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data.status) {
        setAllLocations(res.data.items)

      }
    } catch (error) {
      console.error('Error fetching branch types:', error)
    }
  }
  const getAllDesignations = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/v1/api/designation/getAll`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data.status) {
        setAllDesignations(res.data.items)

      }
    } catch (error) {
      console.error('Error fetching branch types:', error)
    }
  }


  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [locationsRes, clientsRes] = await Promise.all([
          axios.get(`${baseUrl}/v1/api/Agency/getAllAgencyClientsForLocation`, {
            headers: {
              authorization: token
            }
          }),
          axios.get(`${baseUrl}/v1/api/Agency/getAgencyClient`, {
            headers: {
              authorization: token
            }
          })
        ]);

        setLocationOptions(locationsRes.data.items || []);
        setClientOptions(clientsRes.data.items || []);
      } catch (err) {
        console.error("Dropdown fetch failed", err);
      }
    };

    fetchDropdownData();
  }, []);







  // Fetch the Gmail Accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setLoadingAccounts(false)
        return
      }
      try {
        const res = await axios.get(`${baseUrl}/v1/api/mail/users`, {
          headers: { Authorization: token }
        })
        setAccounts(res.data.items || [])
      } catch (err) {
        setAccounts([])
      } finally {
        setLoadingAccounts(false)
      }
    };
    fetchAccounts();
  }, [baseUrl]);





  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton startIcon={<ViewColumn />} sx={{ color: 'primary.main' }} />
        <GridToolbarFilterButton startIcon={<Filter />} sx={{ color: 'primary.main' }} />
        <GridToolbarDensitySelector startIcon={<Settings />} sx={{ color: 'primary.main' }} />
        <GridToolbarExport
          startIcon={<Download />}
          sx={{ color: 'primary.main' }}
          csvOptions={{
            disableToolbarButton: false
          }}
          printOptions={{
            disableToolbarButton: true
          }}
        />
      </GridToolbarContainer>
    )
  }


  useEffect(() => {
    getAllDesignations()
    getAllLocations()
  }, [])

  const clearAllFilters = () => {
    setFilters({
      clientId: "",
      designationId: "",
      search: ""
    })
  }

  const handleDelete = async (id) => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/Agency/deleteAgencyClient/${id}`, {},
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data.status) {
        getAllAgency()
      }
    } catch (error) {
      console.error('Error fetching branch types:', error)
    }
  }
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setFormData({
      companyName: client.companyName || '',
      Email: client.Email || '',
      MobileNumber: client.MobileNumber || '',
      location: client.location.map(i => i._id) || [],
      isActive: client.isActive ?? true,
    });
    setOriginalData({
      companyName: client.companyName || '',
      Email: client.Email || '',
      MobileNumber: client.MobileNumber || '',
      location: client.location.map(i => i._id) || [],
      isActive: client.isActive ?? true,
    })
    setAddAgency(true);
  };



  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const endpoint = selectedClient
        ? `${baseUrl}/v1/api/Agency/updateAgencyClient/${selectedClient._id}`
        : `${baseUrl}/v1/api/Agency/createAgencyClient`;

      const res = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });

      if (res.data.status) {
        getAllAgency();
        setAddAgency(false);
        setFormData({
          companyName: '',
          Email: '',
          MobileNumber: '',
          location: [],
          isActive: formData.isActive,
        });
        setOriginalData({
          companyName: '',
          Email: '',
          MobileNumber: '',
          location: [],
          isActive: formData.isActive,
        })
        setSelectedClient(null);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  const getAllCandidates = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/v1/api/job/getAll?page=&limit=&position=${selectedDesignation}&resumeShortlisted=shortlisted`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data.status) {
        setAllCandidates(res.data.items?.data)

      }
    } catch (error) {
      console.error('Error fetching branch types:', error)
    }
  }

  useEffect(() => {
    getAllCandidates()
  }, [selectedDesignation])

  const getAssignedCandidates = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/v1/api/Agency/getAssignedCandidatesToClients?clientId=${filters?.clientId}&designationId=${filters?.designationId}&search=${filters?.search}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data.status) {
        setAssignedCandidates(res.data.items?.data)

      }
    } catch (error) {
      console.error('Error fetching branch types:', error)
    }
  }

  useEffect(() => {
    if (tabValue === "candidate") { getAssignedCandidates() }
  }, [tabValue, filters])

  const handleAssign = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/Agency/assignMultipleCandidatesToClient`, {
        "clientId": Assignee,
        "candidateIds": selectedIds
      },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        }
      )
      if (res.data.status) {
        getAllAgency()
        setOpenAssign(false)
      }
    } catch (error) {
      console.error('Error fetching branch types:', error)
    }
  }

  const columns = [
    {
      field: 'ClientUniqueId',
      headerName: 'Client ID',
      width: 150,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <VpnKey sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant='body2' fontWeight={600} color='white'>
            Client ID
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VpnKey sx={{ fontSize: 16, color: 'warning.main' }} />
            <Typography variant='body2' noWrap>
              {params.value?.slice(0, 8)}
            </Typography>
          </Box>
        </Tooltip>
      )
    },

    {
      field: 'companyName',
      headerName: 'Agency Name',
      width: 220,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <Business sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant='body2' fontWeight={600} color='white'>
            Client Name
          </Typography>
        </Box>
      ),
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant='body2' fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'Email',
      headerName: 'Agency Email',
      width: 250,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <Email sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant='body2' fontWeight={600} color='white'>
            Client Email
          </Typography>
        </Box>
      ),
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Email sx={{ fontSize: 16, color: 'info.main' }} />
          <Typography variant='body2'>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'MobileNumber',
      headerName: 'Agency Contact',
      width: 150,

      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <Phone sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant='body2' fontWeight={600} color='white'>
            Client Contact
          </Typography>
        </Box>
      ),
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Phone sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant='body2'>{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'location',
      headerName: 'Agency Locations',
      width: 220,

      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <LocationCity sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant='body2' fontWeight={600} color='white'>
            Client Locations
          </Typography>
        </Box>
      ),
      renderCell: params => (
        <Tooltip title="View all Locations">
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={() => handleOpenModal('Agency Locations', params.value, 'location')}
          >
            <LocationCity sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant='body2' noWrap>
              {Array.isArray(params.value) && params.value.length > 0
                ? `${params.value[0].name}${params.value.length > 1 ? ', ...' : ''}`
                : ''}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 150,

      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <CalendarToday sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant='body2' fontWeight={600} color='white'>
            Created Date
          </Typography>
        </Box>
      ),
      renderCell: params => {
        const dateStr = params.row?.createdAt
        if (!dateStr)
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant='body2'>-</Typography>
            </Box>
          )
        const date = new Date(dateStr)
        const formattedDate = isNaN(date.getTime())
          ? '-'
          : date.toLocaleString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant='body2'>{formattedDate}</Typography>
          </Box>
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <Settings sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant='body2' fontWeight={600} color='white'>
            Actions
          </Typography>
        </Box>
      ),
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <IconButton >
              <Edit color='primary' onClick={() => handleEditClient(params.row)} />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.row._id)}>
              <Delete color='error' />
            </IconButton>
            <Button sx={{
              color: "#3b82f6",
              backgroundColor: "#eff6ff",
              "&:hover": { backgroundColor: "#dbeafe" },
            }} size='small' onClick={() => { setAssignee(params.row._id); setOpenAssign(true) }}
            >Assign</Button>
          </Box>
        )
      }
    }
  ]

  const fullColumnDefs = [
    {
      field: "candidateUniqueId",
      headerName: "ID",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} onClick={(e) => { e.stopPropagation(); router.push(`/JobApplications/aiScreening/aiScreenedCandidate/candidatesProfile?id=${params.row.id}`) }}>
          <Person sx={{ fontSize: 16, color: "primary.main" }} />
          <Typography variant="body2" sx={{ textDecoration: "underline" }}>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Candidate Name",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Person sx={{ fontSize: 16, color: "success.main" }} />
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,

      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Business sx={{ fontSize: 16, color: "warning.main" }} />
          <Typography variant="body2">{listType === 'client' ? params.value.name : params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "position",
      headerName: "Position",
      width: 200,

      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Work sx={{ fontSize: 16, color: "secondary.main" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "resume",
      headerName: "Resume",
      width: 100,
      headerAlign: "center",
      align: "center",

      renderCell: (params) => (
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            window.open(params.row.resume, "_blank")
          }}
        >
          <PictureAsPdf sx={{ fontSize: 18 }} />
        </IconButton>
      ),
    },
  ]

  const TabsContainer = styled(Box)(({ theme }) => ({
    background: "linear-gradient(45deg, #7b2ff7 0%, #7b2ff7 50%, #f107a3 100%)",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
  }))

  const StyledTab = styled(Tab)(({ theme }) => ({
    color: "white",
    fontWeight: 500,
    minHeight: 48,
    "&.Mui-selected": {
      backgroundColor: "white",
      color: "#2196F3",
      borderRadius: theme.spacing(1),
    },
    "&:hover": {
      color: "white",
      borderRadius: theme.spacing(1),
    },
    "&.MuiTab-root:hover": {
      color: "#0b0303",
    },
  }))


  const assignedColumns = [
    {
      field: 'clientName',
      headerName: 'Client Name',
      width: 350,
      headerAlign: 'start',
      align: 'start',
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', ml:5 }}>
          <Business sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant='body2' fontWeight={600} color='white'>
            Client Name
          </Typography>
        </Box>
      ),
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 , ml:5 }}>
          <Business sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant='body2' fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'excelUrl',
      headerName: 'Candidate Excel',
      width: 350,
      headerAlign: "center",
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant='body2' fontWeight={600} color='white'>
            Candidate Excel
          </Typography>
        </Box>
      ),
      renderCell: params => {
        const url = params.value;

        if (!url) return <Typography variant="body2" color="text.secondary">No file</Typography>;

        return (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              width: '100%',
              justifyContent: "center",
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, '_blank');
            }}
          >
            <img src="/excel.png" alt="Excel" style={{ width: 20, height: 20 }} />
            <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline' }}>
              View Excel
            </Typography>
          </Box>
        );
      }
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 400,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <Settings sx={{ fontSize: 16, color: 'white' }} />
          <Typography variant='body2' fontWeight={600} color='white'>
            Actions
          </Typography>
        </Box>
      ),
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', gap: 5, alignItems: 'center', width: '100%', justifyContent: 'center' }}>


            {/* Send Mail Button */}
            <Button
              variant="contained"
              size="small"
              startIcon={<Send />}
              sx={{
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: 2,
                px: 2,
                fontSize: 13,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#1e40af'
                }
              }}
              onClick={e => {
                e.stopPropagation();
                setSelectedEmail(params.row.Email || '');
                setSelectedFileUrl(params.row.excelUrl || '');
                setEmailModalOpen(true);
              }}
            >
              Send Mail
            </Button>

            {/* View Candidates Button */}
            <Button
              sx={{
                color: "#3b82f6",
                backgroundColor: "#eff6ff",
                "&:hover": { backgroundColor: "#dbeafe" },
              }}
              size='small'
              onClick={() => {
                setViewedClient(params.row);
                setViewClientCandidates(true);
              }}
            >
              View Candidates
            </Button>

          </Box>
        );
      }
    }


  ]
  console.log("form", changesMade, selectedClient)

  return (
    <Container maxWidth="xl">
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #E5E7EB'
        }}
      >
        {/* Header Title and Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side: Avatar + Title */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ bgcolor: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)", width: 32, height: 32 }}>
              <Users size={20} />
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: "column" }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #7b2ff7 0%, #7b2ff7 50%, #f107a3 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Clients
              </Typography>
              <Typography variant="body2">Add Clients According to your budget</Typography>
            </Box>
          </Stack>

          {/* Right side: Dropdown + Add Client button */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 'auto' }}>
            {tabValue === 'dashboard' && (
              <PeriodFilterDropdown
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            )}

            {tabValue === "clients" && (
              <Button
                color='white'
                variant='outlined'
                startIcon={<Add />}
                onClick={() => {
                  setSelectedClient(null);
                  setAddAgency(true);
                  setFormData({
                    companyName: '',
                    Email: '',
                    MobileNumber: '',
                    location: [],
                    isActive: formData.isActive
                  });
                  setOriginalData({
                    companyName: '',
                    Email: '',
                    MobileNumber: '',
                    location: [],
                    isActive: formData.isActive
                  });
                  setErrors({});
                }}
                sx={{
                  borderRadius: '25px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                }}
              >
                Add Client
              </Button>
            )}
          </Box>
        </Box>


      </Paper>

      {/* Navigation Tabs */}
      <TabsContainer>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          TabIndicatorProps={{ style: { display: "none" } }}
        >
          <StyledTab icon={<Dashboard size={16} />} label="Dashboard" value="dashboard" iconPosition="start" />
          <StyledTab icon={<Users size={16} />} label="Clients" value="clients" iconPosition="start" />
          <StyledTab icon={<Users size={16} />} label="Candidates" value="candidate" iconPosition="start" />

        </Tabs>
      </TabsContainer>





      {/* Conditional Tabs */}
      {tabValue === 'dashboard' && (
        <Box>
          {/* Stats Cards */}
          <Box sx={{ px: 2, py: 3, bgcolor: "#fff", borderRadius: 3, mb: 4 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <BusinessCenter fontSize="small" color="primary" />
              <Typography fontWeight={600} variant="subtitle1">Agency Breakdown</Typography>
            </Box>
            {loadingMetrics && <CircularProgress sx={{ my: 2 }} />}
            {metricsError && <Alert severity="error">{metricsError}</Alert>}

            {!loadingMetrics && metrics && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Total Clients"
                    value={metrics?.summary?.totalClients}
                    subtitle=""
                    icon={Description}
                    bgcolor="#d1fae5"
                    textColor="#15803d"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Active Clients"
                    value={metrics?.summary?.activeClients}
                    subtitle=""
                    icon={Description}
                    bgcolor="#dbeafe"
                    textColor="#1d4ed8"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Inactive Clients"
                    value={metrics?.summary?.inactiveClients}
                    subtitle=""
                    icon={Description}
                    bgcolor="#fee2e2"
                    textColor="#dc2626"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Assign Candidates"
                    value={metrics?.summary?.assignedCandidates}
                    subtitle=""
                    icon={Group}
                    bgcolor="#fce7f3"
                    textColor="#9333ea"
                  />
                </Grid>
              </Grid>
            )}

          </Box>

          {/* Active / Inactive Lists */}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ListCard
                title="Active Clients"
                iconColor="#22c55e"
                data={(metrics?.recentClients?.active ?? []).map(client => ({
                  name: client.companyName,
                  location: client.location?.map(l => l.name).join(', '),
                  date: new Date(client.createdAt).toLocaleDateString('en-IN'),
                }))}
              />

            </Grid>
            <Grid item xs={12} md={6}>
              <ListCard
                title="Inactive Clients"
                iconColor="#ef4444"
                data={(metrics?.recentClients?.inactive ?? []).map(client => ({
                  name: client.companyName,
                  location: client.location?.map(l => l.name).join(', '),
                  date: new Date(client.createdAt).toLocaleDateString('en-IN'),
                }))}
              />

            </Grid>
          </Grid>

        </Box>
      )}


      {tabValue === 'clients' && (

        <Paper sx={{ p: 2, overflow: 'hidden', height: 650 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, mt:3 }}>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
              {/* Left side: Search */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="🔍 Search Clients"
                  variant="outlined"
                  size="small"
                  value={filter.search}
                  onChange={e => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  
                />
              </Grid>

              {/* Right side: Other filters */}
              <Grid item xs={12} md={9}>
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item xs={12} sm={4} md={3}>
                    <TextField
                      fullWidth
                      select
                      size="small"
                      label="Location"
                      value={filter.location}
                      onChange={e => setFilter(prev => ({ ...prev, location: e.target.value }))}
                    >
                      <MenuItem value="">Select Location</MenuItem>
                      {locationOptions.map(loc => (
                        <MenuItem key={loc._id} value={loc._id}>
                          {loc.locationName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4} md={3}>
                    <TextField
                      fullWidth
                      select
                      size="small"
                      label="Client"
                      value={filter.client}
                      onChange={e => setFilter(prev => ({ ...prev, client: e.target.value }))}
                    >
                      <MenuItem value="">Select Client</MenuItem>
                      {clientOptions.map(client => (
                        <MenuItem key={client._id} value={client._id}>{client.companyName}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4} md={3}>
                    <TextField
                      label="Date Range"
                      value={
                        filter.startDate && filter.endDate
                          ? `${dayjs(filter.startDate).format('DD/MM/YYYY')} - ${dayjs(filter.endDate).format('DD/MM/YYYY')}`
                          : ''
                      }
                      onClick={() => setDateModalOpen(true)}  // This opens the modal
                      size="small"
                      fullWidth
                      InputProps={{
                        readOnly: true, // Prevent manual editing
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarToday color="action" />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Select date range"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} md={1} sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    <IconButton
                      onClick={clearAllFilter}
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        width: 30,
                        height: 30,
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                          transform: "scale(1.1) rotate(180deg)",
                          boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                        },
                      }}
                    >
                      <Refresh fontSize="small" />
                    </IconButton>
                    <Typography fontSize={14} fontWeight={600} color="primary" ml={2}>
                      Reset
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Date Range Modal */}
            <Dialog open={dateModalOpen} onClose={() => setDateModalOpen(false)} maxWidth="xs" fullWidth>
              <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday fontSize="small" />
                  Select Custom Date Range
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setTempDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={tempDateRange}
                    maxDate={new Date()}
                    showSelectionPreview={true}
                    showDateDisplay={false}
                  />
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button onClick={() => setDateModalOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDateRangeApply}
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                  }}
                >
                  Apply Range
                </Button>
              </DialogActions>
            </Dialog>


          </Paper>
          <DataGrid
            rows={allAgency}
            columns={columns}
            pagination
            getRowId={row => row._id}
            paginationModel={{ page, pageSize: rowsPerPage }}
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page)
              setRowsPerPage(pageSize)
            }}
            rowCount={totalItems}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            disableRowSelectionOnClick
            slots={{
              toolbar: CustomToolbar
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#1976d2',
                color: '#fff',
                fontWeight: 600
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#1976d2',
                color: '#fff',
                borderRight: 'none'
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                color: '#fff'
              },
              '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
                color: '#fff'
              },
              '& .MuiDataGrid-columnSeparator': {
                display: 'none'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                display: 'flex',
                alignItems: 'center'
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  cursor: 'pointer'
                }
              },
              '& .MuiDataGrid-toolbarContainer': {
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e0e0e0'
              }
            }}
          />
        </Paper>)}

      {tabValue === 'candidate' && (
        <Paper sx={{ p: 2, overflow: 'hidden', height: 650 }}>
          <Grid container spacing={2} my={2} alignItems='center'>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder='🔍 Search'
                size='small'
                value={filters?.search}
                onChange={e => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3.5}>
              <FormControl fullWidth size='small'>
                <InputLabel>Select Client</InputLabel>
                <Select value={filters?.clientId} onChange={e => setFilters((prev) => ({ ...prev, clientId: e.target.value }))} label='Status'>
                  {allAgency.map(item => <MenuItem value={item._id}>{item.companyName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3.5}>
              <FormControl fullWidth size='small'>
                <InputLabel>Select Designation</InputLabel>
                <Select value={filters?.designationId} onChange={e => setFilters((prev) => ({ ...prev, designationId: e.target.value }))} label='Status'>
                  {allDesignations.map(item => <MenuItem value={item._id}>{item.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={1} sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={clearAllFilters}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  width: 30,
                  height: 30,
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                    transform: "scale(1.1) rotate(180deg)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                  },
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
              <Typography fontSize={14} fontWeight={600} color="primary" ml={2}>
                Reset
              </Typography>
            </Grid>
          </Grid>
          <DataGrid
            rows={assignedCandidates}
            columns={assignedColumns}
            pagination
            getRowId={row => row._id}
            paginationModel={{ page, pageSize: rowsPerPage }}
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page)
              setRowsPerPage(pageSize)
            }}
            rowCount={totalItems}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            disableRowSelectionOnClick
            slots={{
              toolbar: CustomToolbar
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#1976d2',
                color: '#fff',
                fontWeight: 600
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#1976d2',
                color: '#fff',
                borderRight: 'none'
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                color: '#fff'
              },
              '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
                color: '#fff'
              },
              '& .MuiDataGrid-columnSeparator': {
                display: 'none'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                display: 'flex',
                alignItems: 'center'
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  cursor: 'pointer'
                }
              },
              '& .MuiDataGrid-toolbarContainer': {
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e0e0e0'
              }
            }}
          />
        </Paper>)}
      <ViewListModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={modalData.title}
        items={modalData.items}
        iconType={modalData.iconType}
      />

      <Dialog
        open={addAgency}
        onClose={() => {
          setAddAgency(false)
        }}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: "center", gap: 2 }}>
            <People color="primary" />
            {selectedClient ? 'Update Client' : 'Add Client'}

          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ px: 3 }}>
            {/* Form Header */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant='h6' fontWeight={600} color='primary.main' sx={{ mb: 1 }}>
                Client Information
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                  error={!!errors.Email}
                  helperText={errors.Email}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mobile Number"
                  name="MobileNumber"
                  type="tel"
                  value={formData.MobileNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*$/.test(value)) return;

                    if (value.length > 10) return;

                    if (value.length === 1 && !/^[6-9]$/.test(value)) return;

                    setFormData((prev) => ({ ...prev, MobileNumber: value }));
                    setErrors((prev) => ({ ...prev, MobileNumber: '' }));
                  }}
                  required
                  error={!!errors.MobileNumber}
                  helperText={errors.MobileNumber}
                  inputProps={{
                    maxLength: 10,
                    inputMode: 'numeric',
                    pattern: '[6-9]{1}[0-9]{9}'
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleToggleChange}
                      color="primary"
                    />
                  }
                  label={formData.isActive ? 'Active' : 'Inactive'}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 600,
                      color: formData.isActive ? 'green' : 'red',
                    },
                  }}
                />
              </Grid>



              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  size="small"
                  label="Locations"
                  name="location"
                  select
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                      allLocations
                        .filter((item) => selected.includes(item._id))
                        .map((item) => item.name)
                        .join(', ')
                  }}
                  value={formData.location}
                  onChange={handleChange}
                  required
                  error={!!errors.location}
                  helperText={errors.location}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {allLocations.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      <Checkbox checked={formData.location.includes(item._id)} />
                      <ListItemText primary={item.name} />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
          <Button
            variant='outlined'
            onClick={() => {
              setAddAgency(false)
              setFormData({
                companyName: '',
                Email: '',
                MobileNumber: '',
                location: [],
              });
              setOriginalData({
                companyName: '',
                Email: '',
                MobileNumber: '',
                location: [],
              })
            }}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#d0d0d0',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={changesMade && selectedClient}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 2,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #1976d2, #1565c0)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
            startIcon={<Add />}
          >
            {selectedClient ? 'Update Client' : 'Create Client'}
          </Button>

        </DialogActions>
      </Dialog>
      <Dialog
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 18, fontWeight: 600 }}>
          <People color="primary" />
          Assign Candidates
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4} mt={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Designation"
                  name="designationId"
                  select
                  value={selectedDesignation}
                  onChange={(e) => {
                    setSelectedDesignation(e.target.value)
                  }}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value={""}>All</MenuItem>
                  {allDesignations.map((item) => (
                    <MenuItem key={item._id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}

                </TextField>
              </Grid>

              <Grid item xs={12}>

                <Box sx={{ height: 400, overflow: 'hidden' }}>
                  <DataGrid
                    rows={allCandidates}
                    columns={fullColumnDefs}
                    pagination
                    getRowId={(row) => row._id}
                    onRowSelectionModelChange={(newSelection) => setSelectedIds(newSelection)}
                    checkboxSelection
                    hideFooter
                    sx={{
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                        color: 'black',
                        fontWeight: 600,
                        position: 'sticky',
                        top: 0,
                        zIndex: 1
                      },
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#f5f5f5',
                        color: 'black',
                        borderRight: 'none'
                      },
                      '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                        color: 'black'
                      },
                      '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
                        color: 'black'
                      },
                      '& .MuiDataGrid-columnSeparator': {
                        display: 'none'
                      },
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        display: 'flex',
                        alignItems: 'center'
                      },
                      '& .MuiDataGrid-row': {
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                          cursor: 'pointer'
                        }
                      },
                      '& .MuiDataGrid-toolbarContainer': {
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e0e0e0'
                      }
                    }}

                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e0e0e0'
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setOpenAssign(false)
              setSelectedDesignation('')
            }}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#d0d0d0',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAssign}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 2,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #1976d2, #1565c0)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
            startIcon={<Add />}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={viewClientCandidates}
        onClose={() => setViewClientCandidates(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 18, fontWeight: 600 }}>
          <People color="primary" />
          Assigned Candidates
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ height: 400, overflow: 'auto' }}>
            <DataGrid
              rows={viewedClient?.candidates}
              columns={fullColumnDefs}
              pagination
              getRowId={(row) => row._id}
              hideFooter
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  color: 'black',
                  fontWeight: 600,
                  position: 'sticky',
                  top: 0,
                  zIndex: 2
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                  color: 'black',
                  borderRight: 'none'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  color: 'black'
                },
                '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
                  color: 'black'
                },
                '& .MuiDataGrid-columnSeparator': {
                  display: 'none'
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-row': {
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    cursor: 'pointer'
                  }
                },
                '& .MuiDataGrid-toolbarContainer': {
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #e0e0e0'
                }
              }}
            />
          </Box>


        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e0e0e0'
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setViewClientCandidates(false)
              setViewedClient({})
            }}
            sx={{
              borderRadius: '25px',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#d0d0d0',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Close
          </Button>

        </DialogActions>
      </Dialog>


      <Modal open={emailModalOpen} onClose={() => setEmailModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 400,
            maxWidth: 600
          }}
        >
          <EmailForm
            to={selectedEmail}
            onClose={() => setEmailModalOpen(false)}
            fromEmails={accounts.map(acc => acc.email)}
            accounts={accounts}
            loadingAccounts={loadingAccounts}
            fileUrl={selectedFileUrl}  // 👈 This is the Excel file URL
          />
        </Box>
      </Modal>


    </Container>
  )
}
