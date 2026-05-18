'use client';
import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import { Box, Typography, Card } from '@mui/material'

const EmployeeHierarchyTest = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [employeeIdFromToken, setEmployeeIdFromToken] = useState('')
  const [hierarchyData, setHierarchyData] = useState({})
  const [headEmployee, setHeadEmployee] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedEmployees, setExpandedEmployees] = useState({})

  // Get employee ID from token
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const token = localStorage?.getItem('authToken')

        if (token) {
          const tokenPart = token.split('.')[1]
          const decoded = JSON.parse(atob(tokenPart))

          if (decoded?.Id) {
            setEmployeeIdFromToken(decoded.Id);
            // setEmployeeIdFromToken('673498723438c6c628d790d0')
          }
        }
      } catch (err) {
        console.error('Error decoding token:', err)
      }
    }

    fetchEmployeeId()
  }, [])

  // Fetch top employee data
  useEffect(() => {
    if (employeeIdFromToken) {
      fetchHeadEmployee(employeeIdFromToken)
      fetchEmployeeData(employeeIdFromToken, 'root')
    }
  }, [employeeIdFromToken])

  // Function to fetch head employee data
  const fetchHeadEmployee = async employeeId => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${baseUrl}/v1/api/Auth/getEmployeeById/${employeeId}`, {
        headers: {
          'Authorization': localStorage?.getItem('authToken')
        }
      })

      if (response.data.status && response.data.subCode === 200) {
        setHeadEmployee(response.data.items)
      }
    } catch (error) {
      console.error('Error fetching head employee:', error)
    }
  }

  // Function to fetch employee data by ID
 // Function to fetch employee data by ID
const fetchEmployeeData = async (managerId, targetId) => {
  setIsLoading(true)
  try {
    const token = localStorage.getItem('accessToken')
    const response = await fetch(`${baseUrl}/v1/api/Auth/getEmployeeCount?reportingManagerId=${managerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
       'Authorization': localStorage?.getItem('authToken')
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()

    if (data.status && data.subCode === 200) {
      const employees = data.items.employeeDetails || []

      if (targetId === 'root') {
        // Initial load - set as root data
        setHierarchyData({
          employeeDetails: employees
        })
      } else {
        // Update the expanded employee's subordinates
        setExpandedEmployees(prev => ({
          ...prev,
          [targetId]: {
            loaded: true,
            employees: employees,
            hasNoEmployees: employees.length === 0 // Add this flag
          }
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching hierarchy:', error)
    // Also handle error case
    if (targetId !== 'root') {
      setExpandedEmployees(prev => ({
        ...prev,
        [targetId]: {
          loaded: true,
          employees: [],
          hasNoEmployees: true
        }
      }))
    }
  } finally {
    setIsLoading(false)
  }
}

  // Handle employee click - expand/collapse and fetch data if needed
  const handleEmployeeClick = employee => {
    const employeeId = employee._id

    // If employee is already expanded, collapse it
    if (expandedEmployees[employeeId] && expandedEmployees[employeeId].loaded) {
      setExpandedEmployees(prev => {
        const newState = { ...prev }
        delete newState[employeeId]
        return newState
      })
      return
    }

    // If not expanded, fetch subordinates data
    fetchEmployeeData(employeeId, employeeId)
  }

  // Render function for employee nodes
  const renderEmployee = (employee, level = 0, isLastChild = false, isFirstEmployee = false, totalEmployees = 1) => {
    const hasSubordinates = expandedEmployees[employee._id]?.employees?.length > 0
    const isExpanded = expandedEmployees[employee._id]?.loaded
    const subordinateCount = expandedEmployees[employee._id]?.employees?.length || 0

    return (
      <div key={employee._id} className='employee-node' style={{display:'flex',flexDirection: 'column',position:'relative',
    alignItems: 'center' }}>
        <div className='tree-line'>
          <span className='connector-line' style={{height: '34px',
    width: '1px',
    display: 'block',
    background: 'black'}}></span>

        </div>
        <Box
          style={{
            width: 'fit-content',
            borderRadius: '27px',
            cursor: 'pointer',
            marginTop:'0',
            display: 'flex',
            alignItems: 'center'
          }}
          className={`
    employee-box
    ${isExpanded ? 'expanded' : ''}
    ${totalEmployees > 1 && isFirstEmployee ? 'employeefirstbox' : 'expandedZero'}
    ${totalEmployees > 1 && isLastChild ? 'employeelastbox' : ''}
    ${totalEmployees > 1 && !isFirstEmployee && !isLastChild ? 'employeemiddlebox' : ''}
  `}
          onClick={() => handleEmployeeClick(employee)}
        >
<Card className='employee-box-inner' sx={{ boxShadow:'9px 6px 10px 3px #0000ff14'}} style={{display:'flex',borderRadius: '29px'}}>
          <div className='employee-avatar'>
            {employee?.employeePhoto ? (
              <Avatar
                style={{ height: '60px', width: '60px' }}
                alt={employee.employeName}
                src={employee.employeePhoto}
              />
            ) : (
              <Avatar style={{ height: '60px', width: '60px', backgroundColor: '#c6f0ff', color: '#333' }}>
                {employee?.employeName?.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </div>
          <div className='employee-details' style={{ padding: '0px 17px' }}>
            <Typography variant='subtitle1' style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
              {employee.employeName}
            </Typography>
            <Typography variant='caption' color='textSecondary'>
              {employee.employeUniqueId || ''}
            </Typography>
            {/* Display count info */}
            {/*<Typography variant='caption' color='error'>
              Total: {totalEmployees}
            </Typography>*/}
          </div>
          {(employee.reportingEmployeeCount > 0 || hasSubordinates) && (
            <div className='toggle-icon'>{isExpanded ? '−' : '+'}</div>
          )}
          </Card>
        </Box>

       {isExpanded && (
  <div style={{ display: 'flex' }} className='children'>
    {hasSubordinates ? (
      expandedEmployees[employee._id].employees.map((sub, idx) =>
        renderEmployee(
          sub,
          level + 1,
          idx === expandedEmployees[employee._id].employees.length - 1,
          idx === 0,
          expandedEmployees[employee._id].employees.length
        )
      )
    ) : (
      <div className='no-employee-message'>
        <Card
          sx={{
            padding: '15px 20px',
            borderRadius: '15px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#f5f5f5',
            border: '2px dashed #ccc'
          }}
        >
          <Typography
            variant='body2'
            color='textSecondary'
            style={{ fontStyle: 'italic', textAlign: 'center' }}
          >
            No employees found
          </Typography>
        </Card>
      </div>
    )}
  </div>
)}
      </div>
    )
  }

  if (isLoading && !hierarchyData.employeeDetails) {
    return <div className='loading'>Loading hierarchy data...</div>
  }

  // Get total root employees count
  const rootEmployeeCount = hierarchyData.employeeDetails?.length || 0;

  return (
    <div className='org-tree-container' style={{scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0, 130, 198, 0.1) rgba(255, 15, 15, 0)'}}>
      {/* <div style={{    position: 'fixed',
    height: '100%',
    width: '100%',
    left: '0',
    right: '0',
    top: '0',
    filter: 'brightness(0.5)',
    backgroundImage:'url(https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'}}>

      </div> */}
      {/* Head Employee Card */}
      <Box>
        {headEmployee && (
          <Box display='flex' flexDirection='column' alignItems='center'  className='head-employee'>
            <Card
              style={{
                width: 'fit-content',
                borderRadius: '27px',
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '2px solid #4dabf7'
              }}
            >
              <Avatar
                style={{ height: '70px', width: '70px', border: '3px solid #4dabf7' }}
                alt={headEmployee.employeName}
                src={headEmployee.employeePhoto || ''}
              >
                {!headEmployee.employeePhoto && headEmployee.employeName?.charAt(0).toUpperCase()}
              </Avatar>
              <Box ml={2}>
                <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                  {headEmployee.employeName}
                </Typography>
                <Typography variant='body2'>{headEmployee.employeUniqueId || ''}</Typography>
                <Typography variant='body2' color='textSecondary'>
                  {headEmployee.currentDesignation || ''}
                </Typography>
                <Typography variant='body2' color='error'>
                  Direct Reports: {rootEmployeeCount}
                </Typography>
              </Box>
            </Card>

            {/* Vertical connector line from head to team */}
            <Box className='vertical-main-connector'></Box>
          </Box>
        )}
        <div className='org-tree'>
          {hierarchyData.employeeDetails?.map((employee, index) =>
            renderEmployee(
              employee,
              0,
              index === hierarchyData.employeeDetails.length - 1,
              index === 0,
              hierarchyData.employeeDetails.length
            )
          )}
        </div>
      </Box>

      <style>
        {`
      .employee-box {
    position:relative;
    overflow: visible;
}
        .org-tree-container {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 100%;
          overflow-x: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
.children:before {
    content: "";
    height: 1px;
    width: 118%;
    background: black;
    position: absolute;
    top: -169px;
    left: 0;
    right: 0;
}
        .org-tree {
          padding: 10px;
          display: flex;

          justify-content: center;

        }

        .head-employee {
          position: relative;
          margin-bottom: 15px;
        }

        .vertical-main-connector {
          height: 40px;
          width: 2px;
          background-color: #4dabf7;
          margin-bottom: 10px;
        }

        .employee-node {
          position: relative;
          margin-bottom: 10px;
        }

        .tree-line {
    position: absolute;
    top: -36px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 2px;
}

        .connector-line {
          color: #c6f0ff;
          font-size: 24px;
        }

        .employee-box {

          padding: 10px 15px;

        }

        .employee-box-inner:hover {
          background-color: #f9f9f9;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .employee-box.expanded {
          border-left-color: #4dabf7;
        }

        .employee-avatar {
          margin-right: 15px;
          flex-shrink: 0;
        }

        .employee-details {
          flex-grow: 1;
        }

        .toggle-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          color: #555;
        }
          .employeefirstbox:before {
    content: "";
    background: black;
    position: absolute;
    height: 1px;
    width: 58%;
    top: -36px;
    right: -19px;
}
    .employeelastbox:after {
    content: '';
    width: 49%;
    position: absolute;
    background: black;
    height: 1px;
    top: -36px;
    left: 0;
}

        .children {
          position: relative;

          margin-top:53px;
        }
.employeemiddlebox:after {
    content: "";
    background: black;
    height: 1px;
    width: 103%;
    position: absolute;
    top: -36px;
}
    .employee-box.expanded:before {
        content: "";
    background: black;
    height: 18px;
    width: 1px;
    position: absolute;
    bottom: -18px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
}
    .employeemiddlebox {

    }


        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
        }


      `}</style>
    </div>
  )
}

export default EmployeeHierarchyTest
