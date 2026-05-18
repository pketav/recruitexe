
"use client"
import React from 'react';

import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Autocomplete,
  TextField
} from '@mui/material'
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from 'react-icons/io'
import { MdAdd } from 'react-icons/md'
import BodEodTasksList from '../taskManager/taskComponents/BodEodTaskList'
import { useEffect, useState } from 'react'

export const BodEod = ({}) => {
  const [taskView, setTaskView] = useState('team')
  const [employees, setEmployees] = useState([])
  const [droploading, setDropLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [hasEmployees, setHasEmployees] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [pageHeight, setPageHeight] = useState(0)
  const [employeeIdFromToken, setEmployeeIdFromToken] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentManagerId, setCurrentManagerId] = useState(null)
  const [expandedEmployees, setExpandedEmployees] = useState({})
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const token = localStorage?.getItem('authToken')
        const tokenDecodablePart = token?.split('.')[1]
        const decoded = JSON.parse(atob(tokenDecodablePart))
        const employeeId = decoded?.Id
        if (employeeId) {
          setEmployeeIdFromToken(employeeId)
        }
      } catch (err) {
        console.error('Error decoding token:', err)
        // setError('Error authenticating user')
      }
    }

    fetchEmployeeId()
  }, [])
  useEffect(() => {
    // Get initial height
    setPageHeight(window.innerHeight)

    // Add event listener for resize
    const handleResize = () => {
      setPageHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  // Handle radio button change
  const handleRadioChange = event => {
    setTaskView(event.target.value)
  }

  // Fetch employees when component mounts
  useEffect(() => {
    if (employeeIdFromToken) {
      setCurrentManagerId(employeeIdFromToken)
      fetchEmployees()
    }
  }, [employeeIdFromToken])

  const navigateToSubordinates = managerId => {
    setCurrentManagerId(managerId)
    setLoading(true)

    fetch(`${baseUrl}/v1/api/Auth/getEmployeeCount?reportingManagerId=${managerId}`, {
      headers: {
        'Authorization': localStorage?.getItem('authToken')
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch subordinates')
        return response.json()
      })
      .then(data => {
        if (data.status && data.items) {
          setEmployees(data.items.employeeDetails)
          // setHasEmployees(data.items.employeeDetails.length > 0)

          // Clear selected employee when navigating
          setSelectedEmployee(null)
        }
      })
      .catch(error => {
        console.error('Error fetching subordinates:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Function to fetch employees
  // Function to fetch employees

  const handleSearch = value => {
    setSearchQuery(value)
    if (value) {
      searchEmployees(value)
    } else {
      fetchEmployees() // If search is cleared, use regular fetch that updates hasEmployees
    }
  }
  const searchEmployees = async searchTerm => {
    setLoading(true)
    const managerId = employeeIdFromToken || 'null'
    try {
      const response = await fetch(
        `${baseUrl}/v1/api/Auth/getEmployeeCount?reportingManagerId=${managerId}${
          searchTerm ? `&employeName=${searchTerm}` : ''
        }`,
        {
          headers: {
            'Authorization': localStorage?.getItem('authToken')
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch employees')
      }

      const data = await response.json()
      if (data.status && data.items) {
        setEmployees(data.items.employeeDetails)
        // Notice: We don't update hasEmployees here
      }
    } catch (error) {
      console.error('Error searching employees:', error)
    } finally {
      setLoading(false)
    }
  }
  const fetchEmployees = async (searchTerm = '') => {
    setLoading(true)
    const managerId = employeeIdFromToken || 'null'
    try {
      const response = await fetch(
        `${baseUrl}/v1/api/Auth/getEmployeeCount?reportingManagerId=${managerId}${
          searchTerm ? `&employeName=${searchTerm}` : ''
        }`,
        {
          headers: {
            'Authorization': localStorage?.getItem('authToken')
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch employees')
      }

      const data = await response.json()
      if (data.status && data.items) {
        setEmployees(data.items.employeeDetails)
        // Set hasEmployees flag based on whether any employees were returned
        setHasEmployees(data.items.employeeDetails.length > 0)

        // Find and set the employee that matches the logged-in user's ID
        if (employeeIdFromToken) {
          const selfEmployee = data.items.employeeDetails.find(emp => emp._id === employeeIdFromToken)
          if (selfEmployee) {
            setSelectedEmployee(selfEmployee)
          }
        }
      } else {
        setHasEmployees(false)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      setHasEmployees(false)
    } finally {
      setLoading(false)
      setInitialLoadComplete(true)
    }
  }
  const toggleEmployeeExpansion = async (employeeId, event) => {
    event.stopPropagation() // Prevent selecting the employee

    // If already expanded, close it
    if (expandedEmployees[employeeId]) {
      setExpandedEmployees(prev => {
        const newState = { ...prev }
        delete newState[employeeId]
        return newState
      })
      return
    }

    try {
      const response = await fetch(`${baseUrl}/v1/api/Auth/getEmployeeCount?reportingManagerId=${employeeId}`, {
        headers: {
          'Authorization': localStorage?.getItem('authToken')
        }
      })

      if (!response.ok) throw new Error('Failed to fetch subordinates')

      const data = await response.json()
      if (data.status && data.items) {
        setExpandedEmployees(prev => ({
          ...prev,
          [employeeId]: data.items.employeeDetails
        }))
      }
    } catch (error) {
      console.error('Error fetching subordinates:', error)
    } finally {
      setLoading(false)
    }
  }
  // Handle employee selection
  const handleEmployeeChange = (event, value) => {
    setSelectedEmployee(value)
  }

  const EmployeeCard = ({
    employee,
    level = 0,
    selectedEmployee,
    onSelectEmployee,
    expandedEmployees,
    toggleEmployeeExpansion
  }) => {
    return (
      <Box>
        {/* {level} */}

        <Card
          className='employeeCard'
          sx={{
            overflow: 'visible',
            marginRight: '9px',
            marginTop: '9px',
            position: 'relative',
            padding: 2,
            marginBottom: '5px',
            cursor: 'pointer',
            boxShadow: expandedEmployees[employee._id] ? 'none' : 'default',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '15px',
            bgcolor: selectedEmployee?._id === employee._id ? 'primary.light' : 'background.paper',
            ml: level * 3 // Apply indentation based on level
          }}
          onClick={() => onSelectEmployee(employee)}
        >
          <Box display='flex' alignItems='center' justifyContent='space-between' style={{ width: '100%' }}>
            <Box display='flex' alignItems='center' gap={1}>
              <img
                style={{
                  height: '25px',
                  width: '25px',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
                src={employee.employeePhoto}
              />
              <div style={{ marginLeft: '5px' }}>
                <Typography style={{ textTransform: 'capitalize', fontWeight: '600',color:  selectedEmployee?._id === employee._id ? 'white' : '#5d5a68', }}>
                  {employee.employeName}{' '}
                </Typography>
                <Typography style={{ fontSize: '10px', color: '#0082c6c4', fontWeight: '600' }}>
                  {employee.employeUniqueId}{' '}
                </Typography>
              </div>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center', alignItems: 'flex-end', flexDirection: 'column' }}>
              <Box
                style={{
                  // position: 'absolute',
                  background: '#00ad3c',
                  right: '27px',
                  borderRadius: '10px',
                  height: '20px',
                  width: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'white',
                  top: '9px',
                  opacity: employee.pendingTask !== 0 ? '1' : '0'
                }}
              >
                {employee.pendingTask}
              </Box>

              <Box
                style={{ height: '20px', display: 'flex', alignItems: 'center' }}
                onClick={e => toggleEmployeeExpansion(employee._id, e)}
              >
                {employee.employePhotoDetail?.employePhotos?.slice(0, 3).map((photo, index) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(photo)
                  return isImage ? (
                    <img
                      key={index}
                      src={photo} // add base URL if needed
                      alt={`Employee Photo ${index + 1}`}
                      style={{
                        width: '20px',
                        height: '20px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        marginLeft: '-10px',
                        border: '1px solid #ffffff78',
                        zIndex: 10 - index,
                        position: 'relative'
                      }}
                    />
                  ) : null
                })}

                {employee.employePhotoDetail?.employePhotos?.length > 3 && (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      marginLeft: '-10px',
                      border: '1px solid #ffffff78',
                      zIndex: 0,
                      position: 'relative',
                      zIndex: '9',
                      marginLeft: '-6px'
                    }}
                  >
                    +{employee.employePhotoDetail.employePhotos.length - 3}
                  </div>
                )}

                {employee.manager &&
                  (expandedEmployees[employee._id] ? (
                    <IoIosArrowUp
                      style={{ cursor: 'pointer' }}
                      // onClick={(e) => toggleEmployeeExpansion(employee._id, e)}
                    />
                  ) : (
                    <IoIosArrowDown
                      style={{ cursor: 'pointer' }}
                      // onClick={(e) => toggleEmployeeExpansion(employee._id, e)}
                    />
                  ))}
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Recursively render subordinates */}
        {expandedEmployees[employee._id] && expandedEmployees[employee._id].length > 0 && (
          <Box className='employeeCardExpended' style={{ background: level === 0 ? 'white' : undefined }}>
            {expandedEmployees[employee._id].map(subordinate => (
              <EmployeeCard
                key={subordinate._id}
                employee={subordinate}
                level={level + 1}
                selectedEmployee={selectedEmployee}
                onSelectEmployee={onSelectEmployee}
                expandedEmployees={expandedEmployees}
                toggleEmployeeExpansion={toggleEmployeeExpansion}
              />
            ))}
          </Box>
        )}
      </Box>
    )
  }
  const handleStartDateChange = e => {
    setStartDate(e.target.value)
  }

  const handleEndDateChange = e => {
    setEndDate(e.target.value)
  }
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: '25px',
        width: '100%'
      }}
    >
      {/* Only show radio buttons if employees were found */}
      {/* {hasEmployees && (
        <FormControl>
          <RadioGroup
            style={{display: 'flex', flexDirection: 'row'}}
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            value={taskView}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="self" control={<Radio />} label="Self" />
            <FormControlLabel value="team" control={<Radio />} label="Team" />
          </RadioGroup>
        </FormControl>
      )} */}

      {/* Always show self tasks if no employees or self is selected */}
      {!hasEmployees || taskView === 'self' ? (
        <BodEodTasksList tasks='selfTasks' type='selfTask' startDate={startDate} endDate={endDate} />
      ) : (
        <>
          <Grid container mt={5}>
            <Grid item sm={2.8}>
              <Autocomplete
                style={{ marginTop: '7px' }}
                freeSolo
                options={[]}
                inputValue={searchQuery}
                onInputChange={(event, newValue) => handleSearch(newValue)}
                renderInput={params => (
                  <TextField {...params} label='Search Employees' variant='outlined' size='small' fullWidth />
                )}
              />
            </Grid>
            <Grid item sm={6}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-start', width: '100%', gap: 2 }}>
                <TextField
                  label='Start Date'
                  type='date'
                  value={startDate}
                  onChange={handleStartDateChange}
                  size='small'
                  sx={{ width: 200 }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <TextField
                  label='End Date'
                  type='date'
                  value={endDate}
                  onChange={handleEndDateChange}
                  size='small'
                  sx={{ width: 200 }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box style={{ width: '100%', display: 'flex' }}>
            <Grid container spacing={1} mt={0}>
              <Grid item sm={3} style={{ marginTop: '0' }}>
                {/* Self Card */}

                <Box
                  style={{
                    paddingLeft: '5px',
                    height: pageHeight - 120,
                    overflowY: 'scroll',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#0082c61a #ff0f0f00'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <>
                      <Card
                        sx={{
                          padding: 2,
                          marginBottom: '5px',
                          borderRadius:'17px',
                          marginRight: '7px',
                          padding: '14px',

                          cursor: 'pointer',
                          bgcolor:
                            selectedEmployee?._id === employeeIdFromToken || !selectedEmployee
                              ? 'primary.light'
                              : 'background.paper'
                        }}
                        onClick={() => {
                          const selfEmployee = employees.find(emp => emp._id === employeeIdFromToken)
                          setSelectedEmployee(selfEmployee || null)
                          setSearchQuery('') // Reset search when changing selected employee
                        }}
                      >
                        <Box display='flex' alignItems='center' gap={1}>
                          <div
                            style={{
                              height: '25px',
                              width: '25px',
                              objectFit: 'cover',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#e0e0e0'
                            }}
                          >
                            S
                          </div>
                          <Typography
                            style={{
                              color: selectedEmployee ? '#5d5a68' : 'white',
                              fontWeight:'600'
                            }}
                            ml={2}
                          >
                            Self
                          </Typography>
                        </Box>
                      </Card>

                      {employees
                        .filter(employee => employee._id !== employeeIdFromToken)
                        .map(employee => (
                          <EmployeeCard
                            key={employee._id}
                            employee={employee}
                            selectedEmployee={selectedEmployee}
                            onSelectEmployee={setSelectedEmployee}
                            expandedEmployees={expandedEmployees}
                            toggleEmployeeExpansion={toggleEmployeeExpansion}
                          />
                        ))}
                    </>
                  )}
                </Box>
              </Grid>

              {selectedEmployee ? (
                <BodEodTasksList
                  tasks='selfTasks'
                  type='selfTask'
                  show='team'
                  employeeId={selectedEmployee._id}
                  startDate={startDate}
                  endDate={endDate}
                />
              ) : employeeIdFromToken ? (
                <BodEodTasksList
                  tasks='selfTasks'
                  type='selfTask'
                  show='team'
                  employeeId={employeeIdFromToken}
                  startDate={startDate}
                  endDate={endDate}
                />
              ) : null}
            </Grid>
          </Box>
        </>
      )}

      <style>
        {`
          .employeeCardExpended:before {
    height: 100%;
    background: #0000001f;
    // content: "";
    display: flex;
    position: absolute;
    width: 1px;
    left:3px
},
.employeeCardExpended {
    position: relative;
}
.employeeCard {
    position: relative;
    z-index: 2;
}
.employeeCard:before {
    // content: "";
    height: 1px;
    width: 100%;
    position: absolute;
    background: #0000001f;
    right: 9px;
    z-index: -1;
}
    .employeeCardExpended {
    position: relative;
    margin-top: -15px;
    padding-top: 3px;
    margin-bottom: 0px;
    padding-bottom: 4px;
    width: 97%;
    border-radius: 0 0px 17px 17px;
    z-index: 1;
    padding-top: 9px;
}
        `}
      </style>
    </Box>
  )
}

export default BodEod
