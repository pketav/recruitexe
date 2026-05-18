"use client"

import { useEffect, useState } from "react"

import { Box, Button, Card, Grid, Typography, CircularProgress, Avatar, TextField, IconButton } from "@mui/material"
import { format, parseISO, isValid } from "date-fns"


import Dialog from "@mui/material/Dialog"

import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"

import { MdAdd, MdDarkMode, MdLightMode, MdWbTwighlight } from "react-icons/md"





import { IoIosNotifications, IoMdClose } from "react-icons/io"


import TasksList from "./taskComponents/TasksList"


import AddTaskDialog from "./taskComponents/AddTaskDialog"


const useWindowWidth = () => {
  // Initialize state with current window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount

  return windowWidth;
};

const ChatByTask = () => {

  const width = useWindowWidth();
  const [loading, setLoading] = useState(false)
  const [employeeIdFromToken, setEmployeeIdFromToken] = useState(null)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTaskData, setSelectedTaskData] = useState(null)
  const [self, setSelf] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [selfTasks, setSelfTasks] = useState({})
  const [assignedTask, setAssignedTask] = useState({})
  const [receivedTask, setReceivedTask] = useState({})
  const [statusFilter, setStatusFilter] = useState("all")
  const [assignedEmployees, setAssignedEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [employeeList, setEmployeeList] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [activeSection, setActiveSection] = useState("task")
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false)
  const [receivedEmployeeList, setReceivedEmployeeList] = useState([])
  const [selectedReceivedEmployee, setSelectedReceivedEmployee] = useState("")
  const [receivedEmployeeModalOpen, setReceivedEmployeeModalOpen] = useState(false)
  const [pageHeight, setPageHeight] = useState(0)

  const filters = {
    normal: "invert(1)",
    dim: "brightness(0.5) grayscale(1) hue-rotate(45deg)",
    light: "brightness(1.2) contrast(1.2)",
    dark: "brightness(0.3) grayscale(0.7)"
  };

  const [currentFilter, setCurrentFilter] = useState("normal");

  useEffect(() => {
    const saved = localStorage.getItem("bgFilter") || "normal";

    setCurrentFilter(saved);
  }, []);

  // Update localStorage on filter change
  const handleFilterChange = (filterKey) => {
    setCurrentFilter(filterKey);
    localStorage.setItem("bgFilter", filterKey);
  };

  useEffect(() => {
    // Get initial height
    setPageHeight(window.innerHeight)

    // Add event listener for resize
    const handleResize = () => {
      setPageHeight(window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const handleEmployeeCardClick = (employee) => {
    setSelectedEmployee(employee.employeeId)
    setEmployeeModalOpen(true)
  }

  const handleEmployeeModalClose = () => {
    setEmployeeModalOpen(false)
    setSelectedEmployee(null)
  }

  const handleTaskSelect = (taskId, groupDetails) => {
    setSelectedTaskId(taskId)
    setSelectedGroupDetails(groupDetails)
  }

  const handleItemClick = (itemId) => {
    setActiveSection(itemId)
  }

  // Extract unique employees from assigned tasks
  const extractUniqueEmployees = (tasks) => {
    const uniqueEmployees = new Map()

    Object.values(tasks)
      .flat()
      .forEach((task) => {
        if (task.employeeDetail && task.employeeDetail._id) {
          uniqueEmployees.set(task.employeeDetail._id, {
            _id: task.employeeDetail._id,
            employeName: task.employeeDetail.employeName,
          })
        }
      })

    return Array.from(uniqueEmployees.values())
  }

  const formatDate = (date) => {
    if (!date) return ""
    const dateObj = typeof date === "string" ? parseISO(date) : date

    if (!isValid(dateObj)) return ""

    return format(dateObj, "yyyy-MM-dd")
  }

  const parseDateString = (dateString) => {
    if (!dateString) return null
    const cleanedDate = dateString.replace(/\s*(AM|PM)/i, "").trim()
    const parsedDate = parseISO(cleanedDate)

    if (isValid(parsedDate)) return parsedDate
    const fallbackDate = new Date(dateString)

    return isValid(fallbackDate) ? fallbackDate : null
  }

  const fetchEmployeeNames = async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/task/getTaskEmployeeName?status=assignedTask`, {
        headers: { Authorization: localStorage?.getItem('authToken') },
      })

      if (!response.ok) throw new Error("Failed to fetch employee names")

      const data = await response.json()

      if (data.status && data.items) {
        setEmployeeList(data.items)
      }
    } catch (err) {
      console.error("Error fetching employee names:", err)
      setError("Failed to fetch employee names")
    }
  }

  // Add this new function to fetch employees for received tasks

  const fetchReceivedEmployeeNames = async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/task/getTaskEmployeeName?status=receivedTask`, {
        headers: { Authorization: localStorage?.getItem('authToken') },
      })

      if (!response.ok) throw new Error("Failed to fetch received task employee names")

      const data = await response.json()

      if (data.status && data.items) {
        setReceivedEmployeeList(data.items)
      }
    } catch (err) {
      console.error("Error fetching received task employee names:", err)
      setError("Failed to fetch received task employee names")
    }
  }

  // Add these handler functions for the received employee modal
  const handleReceivedEmployeeCardClick = (employee) => {
    setSelectedReceivedEmployee(employee.employeeId)
    setReceivedEmployeeModalOpen(true)
  }

  const handleReceivedEmployeeModalClose = () => {
    setReceivedEmployeeModalOpen(false)
    setSelectedReceivedEmployee(null)
  }

  useEffect(() => {
    fetchReceivedEmployeeNames()
  }, [])

  // Fetch employee names when employeeIdFromToken is available
  useEffect(() => {
    fetchEmployeeNames()
    fetchReceivedEmployeeNames()
  }, [])

  // Refresh tasks when selectedEmployee changes

  // Listen for task status changes

  const handleAddRepeatTaskOpenModal = (taskData = null) => {
    setRepeat(true)
    setSelectedTaskData(taskData)
    setIsModalOpen(true)
  }

  const handleAddTaskOpenModal = (taskData = null) => {
    setIsModalOpen(true)
  }

  const handleAddSelfTaskOpenModal = () => {
    setSelf(true)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTaskData(null)
    setSelf(null)
    setRepeat(null)
    fetchEmployeeNames()
  }

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value)
  }

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value)
  }

  return (
    <>
      {/* {activeSection === "BodEod" && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", width: "100%", gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            size="small"
            sx={{ width: 200 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            size="small"
            sx={{ width: 200 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      )} */}


      <Box style={{ display: "flex", height: "100%",
        // background: 'linear-gradient(172deg, rgba(49, 39, 111, 0.23) 0%, rgba(49, 39, 111, 0.78) 50%, rgba(49, 39, 111, 1) 100%)'
         }}>

<Box  sx={{

    width: {
      xs: '100%',
      sm: `${width}px`
    }
  }}>



  <Box style={{ borderRadius:'0px 0px 10px 10px',height: pageHeight - 100, overflowY: 'scroll',scrollbarWidth: 'thin',
    scrollbarColor: '#0082c61a #ff0f0f00',marginBottom:'20px' }}>



          <>

            <Grid container spacing={2} style={{ width: "100%", paddingRight: "17px" }}>
              <Grid container spacing={5} mt={0} ml={5}>
                {/* <Grid item sm={4} style={{ borderRight: '1px solid #00000026' }}>
          <Box style={{ padding: '0 15px ' }}>
            <TasksList tasks={selfTasks} type='selfTask' />
          </Box>
        </Grid> */}
                <Grid item sm={6} style={{ borderRight: "1px solid #00000026" }}>
                  <Box style={{ padding: "0 15px " }}>
                    <Card
                      style={{
                        padding: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "5px",
                        marginBottom: "10px",
                      }}
                      sx={{ backgroundColor: "primary.main" }}
                    >
                      <Typography style={{ textAlign: "center", fontWeight: "800", color: "white" }}>
                        Assigned Task
                      </Typography>
                      <MdAdd
                        onClick={handleAddTaskOpenModal}
                        style={{ fontWeight: "900", cursor: "pointer", color: "white" }}
                      />
                    </Card>

                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Box style={{ height: pageHeight - 190, overflowY: "scroll" }}>
                        {employeeList.map((employee) => (
                          <Card
                            key={employee.employeeId}
                            style={{
                              justifyContent: "space-between",
                              padding: "6px 10px",
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleEmployeeCardClick(employee)}
                          >
                            <Box style={{ textTransform: "capitalize", display: "flex" }}>
                              <img
                                src={
                                  employee.employeePhoto ||
                                  "https://cdn.fincooper.in/PROD/LOS/PDF/1739280645912_file_1736400490565.1%20(1).png" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  marginRight: "7px",
                                }}
                                onError={(e) => {
                                  e.target.src =
                                    "https://cdn.fincooper.in/PROD/LOS/PDF/1739280645912_file_1736400490565.1%20(1).png"
                                }}
                              />
                              {employee.employeName}({employee.employeUniqueId})
                            </Box>{" "}
                            <span style={{ fontSize: "12px" }}> Task-{employee.taskCount}</span>
                          </Card>
                        ))}
                      </Box>
                    )}

                    <Dialog open={employeeModalOpen} onClose={handleEmployeeModalClose} maxWidth="lg" fullWidth>
                      <DialogTitle>
                        {employeeList.find((emp) => emp.employeeId === selectedEmployee) && (
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                src={
                                  employeeList.find((emp) => emp.employeeId === selectedEmployee).employeePhoto ||
                                  "https://cdn.fincooper.in/PROD/LOS/PDF/default_avatar.png"
                                }
                                sx={{ width: 40, height: 40, mr: 2 }}
                              />
                              <Typography variant="h6">
                                {employeeList.find((emp) => emp.employeeId === selectedEmployee).employeName}'s Tasks
                              </Typography>
                            </Box>
                            <Button onClick={() => handleEmployeeModalClose()} variant="outlined">
                              <IoMdClose />
                            </Button>
                          </Box>
                        )}
                      </DialogTitle>
                      <DialogContent>
                        {/* {selectedEmployee} */}
                        <TasksList tasks={assignedTask} type="assignedTask" employeeId={selectedEmployee} />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => handleEmployeeModalClose()} variant="outlined">
                          Close
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleEmployeeModalClose()
                            handleAddTaskOpenModal()
                          }}
                        >
                          Assign New Task
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                </Grid>
                <Grid item sm={6}>
                  <Card
                    style={{
                      padding: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                    sx={{ backgroundColor: "primary.main" }}
                  >
                    <Typography style={{ textAlign: "center", fontWeight: "800", color: "white" }}>
                      Received Task
                    </Typography>
                  </Card>

                  <Box>
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Box style={{ height: pageHeight - 190, overflowY: "scroll" }}>
                        {receivedEmployeeList.map((employee) => (
                          <Card
                            key={employee.employeeId}
                            style={{
                              padding: "6px 10px",
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                              cursor: "pointer",
                              justifyContent: "space-between",
                            }}
                            onClick={() => handleReceivedEmployeeCardClick(employee)}
                          >
                            <Box style={{ textTransform: "capitalize", display: "flex" }}>
                              {/* {employee.employeeId} */}
                              <img
                                src={
                                  employee.employeePhoto ||
                                  "https://cdn.fincooper.in/PROD/LOS/PDF/1739280645912_file_1736400490565.1%20(1).png" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  marginRight: "7px",
                                }}
                                onError={(e) => {
                                  e.target.src =
                                    "https://cdn.fincooper.in/PROD/LOS/PDF/1739280645912_file_1736400490565.1%20(1).png"
                                }}
                              />
                              {employee.employeName}({employee.employeUniqueId})
                            </Box>
                            <span style={{ fontSize: "12px" }}> Task-{employee.taskCount}</span>
                          </Card>
                        ))}
                      </Box>
                    )}

                    <Dialog
                      open={receivedEmployeeModalOpen}
                      onClose={handleReceivedEmployeeModalClose}
                      maxWidth="lg"
                      fullWidth
                    >
                      <DialogTitle>
                        {receivedEmployeeList.find((emp) => emp.employeeId === selectedReceivedEmployee) && (
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                src={
                                  receivedEmployeeList.find((emp) => emp.employeeId === selectedReceivedEmployee)
                                    .employeePhoto || "https://cdn.fincooper.in/PROD/LOS/PDF/default_avatar.png"
                                }
                                sx={{ width: 40, height: 40, mr: 2 }}
                              />
                              <Typography variant="h6">
                                {
                                  receivedEmployeeList.find((emp) => emp.employeeId === selectedReceivedEmployee)
                                    .employeName
                                }
                                's Tasks
                              </Typography>
                            </Box>
                            <Button onClick={() => handleReceivedEmployeeModalClose()} variant="outlined">
                              <IoMdClose />
                            </Button>
                          </Box>
                        )}
                      </DialogTitle>
                      <DialogContent>
                        {/* {selectedReceivedEmployee} */}
                        <TasksList tasks={receivedTask} type="receivedTask" employeeId={selectedReceivedEmployee} />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => handleReceivedEmployeeModalClose()} variant="outlined">
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </>


        </Box>
</Box>
        <AddTaskDialog
          isModalOpen={isModalOpen}
          handleCloseModal={() => {
            handleCloseModal()

            // Add refresh on close
          }}

          // onTaskAdded={refreshAllTasks}
          initialTaskData={selectedTaskData}
          self={self}
          repeat={repeat}
        />
      </Box>
      {/* <AddNoteButton

  buttonPosition={{
    position: "fixed",
    bottom: 30,
    right: 30,
    zIndex: 1000,
  }}
  buttonStyle={{
    borderRadius: "50%",
    width: 64,
    height: 64,
    minWidth: "auto",
    boxShadow: 3,
  }}
/> */}
    </>
  )
}

// Add ACL configuration
ChatByTask.acl = {
  action: "manage",
  subject: "ChatByTask",
}

export default ChatByTask

