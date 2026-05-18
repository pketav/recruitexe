"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material"
import { Add, Remove, Person, Business, Assignment } from "@mui/icons-material"
import { rolePermissionService } from "../../api/rolePermission-service"

const AddRolePermissionForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    role: "",
    expenseType: [],
    departmentsSelected: [],
  })

  const [expenseTypes, setExpenseTypes] = useState([])
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [levels, setLevels] = useState([])
  const [remitterLevels, setRemitterLevels] = useState([])
  const [selectedExpenseTypeConfig, setSelectedExpenseTypeConfig] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [roleId, setRoleID] = useState([])
  const [approverEntries, setApproverEntries] = useState([])
  const [submitterEntries, setSubmitterEntries] = useState([{ id: 1, employee: "" }])
  const [remitterEntries, setRemitterEntries] = useState([])

  // Helper function to get unique employee ID
  const getEmployeeId = (emp) => {
    return String(emp._id || emp.id || `emp-${Math.random().toString(36).substr(2, 9)}`)
  }

  // Helper function to get employee name
  const getEmployeeName = (emp) => {
    return String(emp.employeeName || emp.employeName || "Unknown Employee")
  }

  // Helper function to get unique expense type ID
  const getExpenseTypeId = (type) => {
    return String(type._id || type.id || `expense-${Math.random().toString(36).substr(2, 9)}`)
  }

  // Helper function to get unique department ID
  const getDepartmentId = (dept) => {
    return String(dept._id || dept.id || `dept-${Math.random().toString(36).substr(2, 9)}`)
  }

  // Helper function to generate levels up to a given max level string (e.g., "L2", "R3")
  const generateLevels = (maxLevelString, prefix) => {
    if (!maxLevelString || typeof maxLevelString !== "string") return []

    // Extract number from "L2" or "R2" - make sure we're looking at the last character
    const levelNumber = Number.parseInt(maxLevelString.replace(/[^0-9]/g, ""))
    if (isNaN(levelNumber)) return []

    const generated = []
    for (let i = 1; i <= levelNumber; i++) {
      generated.push({ id: i, name: `${prefix}${i}` })
    }
    return generated
  }

  // Function to create approver entries based on levels
  const createApproverEntries = (levelsArray, existingData = {}) => {
    return levelsArray.map((level, index) => ({
      id: index + 1,
      level: level.name,
      employee: existingData[level.name]?.employeeId || "",
    }))
  }

  // Function to create remitter entries based on remitter levels
  const createRemitterEntries = (remitterLevelsArray, existingData = {}) => {
    return remitterLevelsArray.map((level, index) => ({
      id: index + 1,
      remitterLevel: level.name,
      employee: existingData[level.name]?.employeeId || "",
    }))
  }

  // Load initial data
  useEffect(() => {
    if (open) {
      loadInitialData()
    }
  }, [open])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [roleAssignmentsData, expenseTypesData, employeesData, departmentsData] = await Promise.all([
        rolePermissionService.getAllRoleAssignments(),
        rolePermissionService.getAllExpenseTypes(),
        rolePermissionService.getAllEmployees(),
        rolePermissionService.getAllDepartments(),
      ])

      const expenseTypes = expenseTypesData?.items || expenseTypesData || []
      const employees = employeesData?.items || employeesData || []
      const departments = departmentsData?.items || departmentsData || []
      const roleAssign = roleAssignmentsData.items || roleAssignmentsData || []

      setRoleID(roleAssign)
      setSelectedExpenseTypeConfig(roleAssign[0]?.fromWhere || "")

      setExpenseTypes(Array.isArray(expenseTypes) ? expenseTypes : [])
      setEmployees(Array.isArray(employees) ? employees : [])
      setDepartments(Array.isArray(departments) ? departments : [])
      console.log("roleAssign", roleAssign)

      if (roleAssign.length > 0) {
        const currentRoleAssign = roleAssign[0]

        // Determine initial role based on available data
        let initialRole = ""
        if (currentRoleAssign.roleApprover && Object.keys(currentRoleAssign.roleApprover).length > 0) {
          initialRole = "approver"
        } else if (currentRoleAssign.roleSubmitter && currentRoleAssign.roleSubmitter.employeeId) {
          initialRole = "submitter"
        } else if (currentRoleAssign.roleRemitter && Object.keys(currentRoleAssign.roleRemitter).length > 0) {
          initialRole = "remitter"
        }
        setFormData((prev) => ({ ...prev, role: initialRole }))

        // Generate levels based on approverLevel and remitterLevel
        const maxApproverLevel = currentRoleAssign.approverLevel
        const maxRemitterLevel = currentRoleAssign.remitterLevel

        console.log("Setting levels with maxApproverLevel:", maxApproverLevel)
        console.log("Setting remitterLevels with maxRemitterLevel:", maxRemitterLevel)

        const generatedLevels = generateLevels(maxApproverLevel, "L")
        const generatedRemitterLevels = generateLevels(maxRemitterLevel, "R")

        setLevels(generatedLevels)
        setRemitterLevels(generatedRemitterLevels)

        // Create approver entries automatically based on generated levels
        const approverEntries = createApproverEntries(generatedLevels, currentRoleAssign.roleApprover || {})
        setApproverEntries(approverEntries)

        // Create remitter entries automatically based on generated remitter levels
        const remitterEntries = createRemitterEntries(generatedRemitterLevels, currentRoleAssign.roleRemitter || {})
        setRemitterEntries(remitterEntries)

        // Populate Submitter Entries
        if (currentRoleAssign.roleSubmitter && currentRoleAssign.roleSubmitter.employeeId) {
          setSubmitterEntries([{ id: 1, employee: currentRoleAssign.roleSubmitter.employeeId }])
        } else {
          setSubmitterEntries([{ id: 1, employee: "" }])
        }

        // Set initial expenseType or departmentsSelected if available
        if (currentRoleAssign.expenseType && currentRoleAssign.expenseType.length > 0) {
          setFormData((prev) => ({ ...prev, expenseType: currentRoleAssign.expenseType }))
        }
        if (currentRoleAssign.departmentId && currentRoleAssign.departmentId.length > 0) {
          setFormData((prev) => ({ ...prev, departmentsSelected: currentRoleAssign.departmentId }))
        }
      } else {
        // If no role assignments data, set default levels and create entries
        const defaultLevels = generateLevels("L3", "L")
        const defaultRemitterLevels = generateLevels("R3", "R")

        setLevels(defaultLevels)
        setRemitterLevels(defaultRemitterLevels)

        // Create default entries
        setApproverEntries(createApproverEntries(defaultLevels))
        setRemitterEntries(createRemitterEntries(defaultRemitterLevels))
        setSubmitterEntries([{ id: 1, employee: "" }])
      }
    } catch (error) {
      console.error("Error loading initial data:", error)
      // Set fallback data if API fails
      setExpenseTypes([])
      setEmployees([])
      setDepartments([])

      const fallbackLevels = generateLevels("L3", "L")
      const fallbackRemitterLevels = generateLevels("R3", "R")

      setLevels(fallbackLevels)
      setRemitterLevels(fallbackRemitterLevels)
      setApproverEntries(createApproverEntries(fallbackLevels))
      setRemitterEntries(createRemitterEntries(fallbackRemitterLevels))
      setSubmitterEntries([{ id: 1, employee: "" }])
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ role: "", expenseType: [], departmentsSelected: [] })
    setSelectedExpenseTypeConfig("")
    // Reset entries to match current levels
    setApproverEntries(createApproverEntries(levels))
    setSubmitterEntries([{ id: 1, employee: "" }])
    setRemitterEntries(createRemitterEntries(remitterLevels))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleApproverEntryChange = (id, field, value) => {
    setApproverEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
  }

  const handleSubmitterEntryChange = (id, field, value) => {
    setSubmitterEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
  }

  const handleRemitterEntryChange = (id, field, value) => {
    setRemitterEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
  }

  const addSubmitterEntry = () => {
    const newId = Math.max(...submitterEntries.map((e) => e.id)) + 1
    setSubmitterEntries([...submitterEntries, { id: newId, employee: "" }])
  }

  const removeSubmitterEntry = (id) => {
    if (submitterEntries.length > 1) {
      setSubmitterEntries(submitterEntries.filter((entry) => entry.id !== id))
    }
  }

  const getFilteredEmployees = () => {
    if (selectedExpenseTypeConfig === "Department" && formData.departmentsSelected.length > 0) {
      return employees.filter((emp) => {
        const empDeptId = typeof emp.departmentId === "object" ? emp.departmentId?._id : emp.departmentId
        return formData.departmentsSelected.includes(empDeptId || "")
      })
    }
    return employees
  }

  const handleSubmit = async () => {
    setSubmitLoading(true)
    try {
      let entries = []

      if (formData.role === "approver") {
        entries = approverEntries
      } else if (formData.role === "submitter") {
        entries = submitterEntries
      } else if (formData.role === "remitter") {
        entries = remitterEntries
      }

      const validEntries = entries.filter((entry) => {
        if (formData.role === "approver") {
          return entry.employee && entry.level
        } else if (formData.role === "remitter") {
          return entry.employee && entry.remitterLevel
        } else {
          return entry.employee
        }
      })

      if (validEntries.length === 0) {
        alert("Please fill at least one complete entry")
        setSubmitLoading(false)
        return
      }

      const rolePermissionData = {}

      if (Array.isArray(roleId) && roleId.length > 0 && roleId[0]?._id) {
        rolePermissionData.id = roleId[0]._id
      } else {
        alert("Role assignment ID is missing. Please ensure a role assignment is loaded or selected.")
        setSubmitLoading(false)
        return
      }

      if (selectedExpenseTypeConfig === "ExpenseType") {
        rolePermissionData.expenseType = Array.isArray(formData.expenseType)
          ? formData.expenseType
          : [formData.expenseType]
      } else if (selectedExpenseTypeConfig === "Department") {
        rolePermissionData.departmentId = formData.departmentsSelected
      }

      if (formData.role === "approver") {
        rolePermissionData.roleApprover = {}
        validEntries.forEach((entry) => {
          const level = entry.level
          if (!rolePermissionData.roleApprover[level]) {
            rolePermissionData.roleApprover[level] = {
              level: level,
              employeeId: entry.employee,
            }
          }
        })
      } else if (formData.role === "submitter") {
        const entry = validEntries[0]
        rolePermissionData.roleSubmitter = {
          employeeId: entry.employee,
        }
        if (Object.keys(rolePermissionData.roleApprover || {}).length === 0) {
          delete rolePermissionData.roleApprover
        }
      } else if (formData.role === "remitter") {
        rolePermissionData.roleRemitter = {}
        validEntries.forEach((entry) => {
          const level = entry.remitterLevel
          if (!rolePermissionData.roleRemitter[level]) {
            rolePermissionData.roleRemitter[level] = {
              level: level,
              employeeId: entry.employee,
            }
          }
        })
        if (Object.keys(rolePermissionData.roleApprover || {}).length === 0) {
          delete rolePermissionData.roleApprover
        }
      }

      console.log("Submitting role permission data:", rolePermissionData)

      const response = await rolePermissionService.addRolePermission(rolePermissionData)

      onSubmit({
        role: formData.role,
        expenseType: formData.expenseType,
        configType: selectedExpenseTypeConfig,
        entries: validEntries,
        apiResponse: response,
      })

      resetForm()
      onClose()
    } catch (error) {
      console.error("Error submitting role permission:", error)
      alert(error.message || "Failed to add role permission")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "approver":
        return <Assignment sx={{ color: "#4caf50" }} />
      case "submitter":
        return <Person sx={{ color: "#2196f3" }} />
      case "remitter":
        return <Business sx={{ color: "#ff9800" }} />
      default:
        return null
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "approver":
        return "#4caf50"
      case "submitter":
        return "#2196f3"
      case "remitter":
        return "#ff9800"
      default:
        return "#7c4dff"
    }
  }

  if (loading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Assignment sx={{ color: "#7c4dff", fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
            Add Role Assignment
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
          Configure role assignments for expense management workflow
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          {/* Primary Selection Cards */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Card sx={{ flex: 1, border: formData.role ? "2px solid #7c4dff" : "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Role *</InputLabel>
                  <Select
                    labelId="role-label"
                    name="role"
                    value={formData.role}
                    label="Role *"
                    onChange={handleInputChange}
                    sx={{ "& .MuiSelect-select": { display: "flex", alignItems: "center", gap: 1 } }}
                  >
                    <MenuItem value="approver">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Assignment sx={{ color: "#4caf50", fontSize: 20 }} />
                        Approver
                      </Box>
                    </MenuItem>
                    <MenuItem value="submitter">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Person sx={{ color: "#2196f3", fontSize: 20 }} />
                        Submitter
                      </Box>
                    </MenuItem>
                    <MenuItem value="remitter">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Business sx={{ color: "#ff9800", fontSize: 20 }} />
                        Remitter
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Box>

          {/* Global Expense Type or Department dropdown based on selectedExpenseTypeConfig */}
          {selectedExpenseTypeConfig === "ExpenseType" && (
            <Card sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="expense-type-label">Expense Type *</InputLabel>
                  <Select
                    labelId="expense-type-label"
                    name="expenseType"
                    multiple
                    value={formData.expenseType}
                    label="Expense Type *"
                    onChange={handleInputChange}
                    // renderValue={(selected) => (
                    //   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    //     {selected.map((value) => {
                    //       const type = expenseTypes.find((t) => (t._id || t.id) === value)
                    //       return <Chip key={value} label={type?.name || String(value)} size="small" />
                    //     })}
                    //   </Box>
                    // )}
                  >
                    {expenseTypes.map((type) => (
                      <MenuItem key={getExpenseTypeId(type)} value={getExpenseTypeId(type)}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}
                        >
                          {type.name || "Unnamed Type"}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          )}

          {selectedExpenseTypeConfig === "Department" && (
            <Card sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="department-label">Department *</InputLabel>
                  <Select
                    labelId="department-label"
                    name="departmentsSelected"
                    multiple
                    value={formData.departmentsSelected}
                    label="Department *"
                    onChange={handleInputChange}
                    // renderValue={(selected) => (
                    //   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    //     {selected.map((value) => {
                    //       const dept = departments.find((d) => (d._id || d.id) === value)
                    //       return <Chip key={value} label={dept?.name || String(value)} size="small" />
                    //     })}
                    //   </Box>
                    // )}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={getDepartmentId(dept)} value={getDepartmentId(dept)}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}
                        >
                          {dept.name || "Unnamed Department"}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          )}

          {/* Dynamic Entries based on Role */}
          {formData.role && (
            <>
              {formData.role === "approver" && approverEntries.length > 0 && (
                <Card sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {getRoleIcon("approver")}
                        <Typography variant="h6" sx={{ color: getRoleColor("approver"), fontWeight: 600 }}>
                          Approver Assignments ({approverEntries.length} levels)
                        </Typography>
                      </Box>
                    </Box>

                    {approverEntries.map((entry) => (
                      <Card
                        key={`approver-${entry.id}-${entry.level}`}
                        sx={{ mb: 2, backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <FormControl sx={{ flex: 1 }}>
                              <InputLabel>Level *</InputLabel>
                              <Select
                                value={entry.level}
                                label="Level *"
                                disabled // Level is pre-filled and cannot be changed
                              >
                                <MenuItem value={entry.level}>{entry.level}</MenuItem>
                              </Select>
                            </FormControl>

                            <FormControl sx={{ flex: 2 }}>
                              <InputLabel>Employee *</InputLabel>
                              <Select
                                value={entry.employee}
                                label="Employee *"
                                onChange={(e) => handleApproverEntryChange(entry.id, "employee", e.target.value)}
                              >
                                {employees.map((emp) => (
                                  <MenuItem key={getEmployeeId(emp)} value={getEmployeeId(emp)}>
                                    {getEmployeeName(emp) || "Unnamed Employee"}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              )}

              {formData.role === "submitter" && (
                <Card sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {getRoleIcon("submitter")}
                        <Typography variant="h6" sx={{ color: getRoleColor("submitter"), fontWeight: 600 }}>
                          Submitter Assignments
                        </Typography>
                      </Box>
                      <Button
                        startIcon={<Add />}
                        onClick={addSubmitterEntry}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: getRoleColor("submitter"),
                          color: getRoleColor("submitter"),
                          "&:hover": {
                            borderColor: getRoleColor("submitter"),
                            backgroundColor: `${getRoleColor("submitter")}10`,
                          },
                        }}
                      >
                        Add More
                      </Button>
                    </Box>
                    {submitterEntries.map((entry) => (
                      <Card
                        key={`submitter-${entry.id}`}
                        sx={{ mb: 2, backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <FormControl sx={{ flex: 2 }}>
                              <InputLabel>Employee *</InputLabel>
                              <Select
                                value={entry.employee}
                                label="Employee *"
                                onChange={(e) => handleSubmitterEntryChange(entry.id, "employee", e.target.value)}
                              >
                                {employees.map((emp) => (
                                  <MenuItem key={getEmployeeId(emp)} value={getEmployeeId(emp)}>
                                    {getEmployeeName(emp)}{" "}
                                    {emp.designationId?.name ? `- ${emp.designationId.name}` : ""}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <IconButton
                              onClick={() => removeSubmitterEntry(entry.id)}
                              disabled={submitterEntries.length === 1}
                              sx={{
                                color: "error.main",
                                "&:hover": { backgroundColor: "error.light", color: "white" },
                              }}
                            >
                              <Remove />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              )}

              {formData.role === "remitter" && remitterEntries.length > 0 && (
                <Card sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {getRoleIcon("remitter")}
                        <Typography variant="h6" sx={{ color: getRoleColor("remitter"), fontWeight: 600 }}>
                          Remitter Assignments ({remitterEntries.length} levels)
                        </Typography>
                      </Box>
                    </Box>
                    {remitterEntries.map((entry) => (
                      <Card
                        key={`remitter-${entry.id}-${entry.remitterLevel}`}
                        sx={{ mb: 2, backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <FormControl sx={{ flex: 1 }}>
                              <InputLabel>Remitter Level *</InputLabel>
                              <Select
                                value={entry.remitterLevel}
                                label="Remitter Level *"
                                disabled // Level is pre-filled and cannot be changed
                              >
                                <MenuItem value={entry.remitterLevel}>{entry.remitterLevel}</MenuItem>
                              </Select>
                            </FormControl>

                            <FormControl sx={{ flex: 2 }}>
                              <InputLabel>Employee *</InputLabel>
                              <Select
                                value={entry.employee}
                                label="Employee *"
                                onChange={(e) => handleRemitterEntryChange(entry.id, "employee", e.target.value)}
                              >
                                {employees.map((emp) => (
                                  <MenuItem key={getEmployeeId(emp)} value={getEmployeeId(emp)}>
                                    {getEmployeeName(emp)}{" "}
                                    {emp.designationId?.name ? `- ${emp.designationId.name}` : ""}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={submitLoading}
          sx={{
            borderColor: "#e0e0e0",
            color: "#666",
            "&:hover": { borderColor: "#bdbdbd", backgroundColor: "#f5f5f5" },
            textTransform: "none",
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !formData.role ||
            (selectedExpenseTypeConfig === "ExpenseType" && formData.expenseType.length === 0) ||
            (selectedExpenseTypeConfig === "Department" && formData.departmentsSelected.length === 0) ||
            submitLoading
          }
          sx={{
            backgroundColor: "#7c4dff",
            "&:hover": { backgroundColor: "#6a1ee8" },
            "&:disabled": { backgroundColor: "#e0e0e0" },
            textTransform: "none",
            px: 4,
          }}
        >
          {submitLoading ? <CircularProgress size={20} color="inherit" /> : "Create Assignment"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddRolePermissionForm
