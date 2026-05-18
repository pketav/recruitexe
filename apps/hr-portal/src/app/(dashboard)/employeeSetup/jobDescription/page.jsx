"use client"

import {
  Container,
  Box,
  Button,
  Modal,
  Typography,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Grid,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material"
import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { DataGrid } from "@mui/x-data-grid"
import { EditOutlined as EditIcon } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import CircularProgress from "@mui/material/CircularProgress"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"

export default function JobDescription() {
  const [jobDescs, setJobDescs] = useState([])
  const [designations, setDesignations] = useState([])
  const [depts, setDepts] = useState([])
  const [subDepts, setSubDepts] = useState([])
  const [desc, setDesc] = useState("")
  const [openDesc, setOpenDesc] = useState(false)
  const [addDesc, setAddDesc] = useState(false)
  const [editDesc, setEditDesc] = useState(false)
  const [ailoading, setAiLoading] = useState(false)
  const [skillInput, setSkillInput] = useState("")

  // States for displaying parsed job description in the view modal
  const [viewJobSummary, setViewJobSummary] = useState("")
  const [viewKeySkills, setViewKeySkills] = useState([])
  const [viewRolesAndResponsibilities, setViewRolesAndResponsibilities] = useState([])

  // New states for live preview in add/edit modals
  const [previewJobSummary, setPreviewJobSummary] = useState("")
  const [previewKeySkills, setPreviewKeySkills] = useState([])
  const [previewRolesAndResponsibilities, setPreviewRolesAndResponsibilities] = useState([])

  const token = window.localStorage.getItem("authToken")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter()

  const [addDescData, setAddDescData] = useState({
    jobDescription: "",
    designationId: "",
    departmentId: "",
    subdeparmentId: "",
    specialSkills: [],
  })

  const [ediDescData, setEditDescData] = useState({
    jobDescriptionId: "",
    jobDescription: "",
    designationId: "",
    departmentId: "",
    subdeparmentId: "",
    specialSkills: [],
    status: "active",
  })

  // Helper function to parse the combined job description string
  const parseJobDescriptionString = useCallback((value) => {
    let summary = ""
    let skills = []
    let responsibilities = []

    const keySkillsHeader = "Key Skills:\n"
    const rolesHeader = "Roles and Responsibilities:\n"

    const parts = value.split(keySkillsHeader)
    if (parts.length > 1) {
      summary = parts[0].trim()
      const remaining = parts[1]

      const rolesParts = remaining.split(rolesHeader)
      if (rolesParts.length > 1) {
        skills = rolesParts[0]
          .split("\n")
          .map((s) => s.replace(/^\u2022 /, "").trim())
          .filter((s) => s)
        responsibilities = rolesParts[1]
          .split("\n")
          .map((r) => r.replace(/^\u2022 /, "").trim())
          .filter((r) => r)
      } else {
        skills = remaining
          .split("\n")
          .map((s) => s.replace(/^\u2022 /, "").trim())
          .filter((s) => s)
      }
    } else {
      summary = value.trim()
    }
    return { summary, skills, responsibilities }
  }, [])

  // Fetch departments
  const getDepartment = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/newdepartment/newdeparment`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setDepts(res.data.items.filter((i) => i.isActive === true) || [])
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  // Fetch sub-departments
  const fetchSubDepartments = async (departmentId) => {
    if (!departmentId) return
    try {
      const res = await axios.get(`${baseUrl}/v1/api/newdepartment/sub/${departmentId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      setSubDepts(res.data.items || [])
    } catch (error) {
      console.error("Error fetching sub-departments:", error)
    }
  }

  // Fetch designations based on department and sub-department
  const fetchDesignations = async (departmentId, subDepartmentId) => {
    if (!departmentId || !subDepartmentId) return
    try {
      const res = await axios.get(
        `${baseUrl}/v1/api/designation/getDepartmentsWithDesignations?departmentId=${departmentId}&subDepartmentId=${subDepartmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      setDesignations(res.data.items || [])
    } catch (error) {
      console.error("Error fetching designations:", error)
    }
  }

  // Fetch all job descriptions
  const getAllJobDesc = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/jobdescription/getAll`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      if (res.data.status) {
        setJobDescs(res.data.items)
      }
    } catch (error) {
      console.error("Error fetching job descriptions:", error)
    }
  }

  // Auto-generate job description
  const AutoGenerateJD = async () => {
    setAiLoading(true)
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/jobdescription/AIgeneratedJd`,
        {
          designationId: addDescData.designationId || ediDescData.designationId,
          subdeparmentId: addDescData.subdeparmentId || ediDescData.subdeparmentId,
          departmentId: addDescData.departmentId || ediDescData.departmentId,
          specialSkills: addDescData.specialSkills || ediDescData.specialSkills,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        },
      )
      if (res.data.status) {
        const jobData = res.data.items.jobDescription
        const jobSummary = jobData.JobSummary || ""
        const keySkills = Array.isArray(jobData.KeySkills)
          ? jobData.KeySkills.map((skill) => `\u2022 ${skill}`).join("\n")
          : ""
        const rolesAndResponsibilities = Array.isArray(jobData.RolesAndResponsibilities)
          ? jobData.RolesAndResponsibilities.map((role) => `\u2022 ${role}`).join("\n")
          : ""

        let formattedJobDescription = ""
        if (jobSummary) {
          formattedJobDescription += `${jobSummary}\n\n`
        }
        if (keySkills) {
          formattedJobDescription += "Key Skills:\n"
          formattedJobDescription += `${keySkills}\n\n`
        }
        if (rolesAndResponsibilities) {
          formattedJobDescription += "Roles and Responsibilities:\n"
          formattedJobDescription += rolesAndResponsibilities
        }

        if (editDesc) {
          setEditDescData((prev) => ({
            ...prev,
            jobDescription: formattedJobDescription,
          }))
        } else {
          setAddDescData((prev) => ({
            ...prev,
            jobDescription: formattedJobDescription,
          }))
        }
      }
    } catch (error) {
      console.error("Error generating job description:", error)
    } finally {
      setAiLoading(false)
    }
  }

  // Handle add job description
  const handleSubmitAdd = async () => {
    try {
      const res = await axios.post(`${baseUrl}/v1/api/jobdescription/Add`, addDescData, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      if (res.data.status) {
        setAddDesc(false)
        setAddDescData({
          jobDescription: "",
          designationId: "",
          departmentId: "",
          subdeparmentId: "",
          specialSkills: [],
        })
        setSkillInput("")
        getAllJobDesc()
      }
    } catch (error) {
      console.error("Error adding job description:", error)
    }
  }

  // Handle edit job description
  const handleEdit = (row) => {
    setEditDesc(true)
    setEditDescData({
      jobDescriptionId: row._id,
      jobDescription: row.jobDescription,
      designationId: row?.designationId?._id || "",
      departmentId: row?.departmentId?._id || "",
      subdeparmentId: row?.subdeparmentId?._id || "",
      specialSkills: row?.specialSkills || [],
      status: row.status || "active",
    })
    // Fetch sub-departments and designations for the selected department
    fetchSubDepartments(row?.departmentId?._id)
    fetchDesignations(row?.departmentId?._id, row?.subdeparmentId?._id)
  }

  // Handle submit edit
  const handleSubmitEdit = async () => {
    try {
      const res = await axios.post(`${baseUrl}/v1/api/jobdescription/update`, ediDescData, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      if (res.data.status) {
        setEditDesc(false)
        setEditDescData({
          jobDescriptionId: "",
          jobDescription: "",
          designationId: "",
          departmentId: "",
          subdeparmentId: "",
          specialSkills: [],
          status: "active",
        })
        setSkillInput("")
        getAllJobDesc()
      }
    } catch (error) {
      console.error("Error updating job description:", error)
    }
  }

  // Handle skill input
  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.trim()

      if (editDesc) {
        if (!ediDescData.specialSkills.includes(newSkill)) {
          setEditDescData((prev) => ({
            ...prev,
            specialSkills: [...prev.specialSkills, newSkill],
          }))
        }
      } else {
        if (!addDescData.specialSkills.includes(newSkill)) {
          setAddDescData((prev) => ({
            ...prev,
            specialSkills: [...prev.specialSkills, newSkill],
          }))
        }
      }
      setSkillInput("")
    }
  }

  // Handle skill deletion
  const handleSkillDelete = (skillToDelete) => {
    if (editDesc) {
      setEditDescData((prev) => ({
        ...prev,
        specialSkills: prev.specialSkills.filter((skill) => skill !== skillToDelete),
      }))
    } else {
      setAddDescData((prev) => ({
        ...prev,
        specialSkills: prev.specialSkills.filter((skill) => skill !== skillToDelete),
      }))
    }
  }

  // Handle view description - now parses the string into separate parts for the view modal
  const handleDesc = (value) => {
    const { summary, skills, responsibilities } = parseJobDescriptionString(value)
    setViewJobSummary(summary)
    setViewKeySkills(skills)
    setViewRolesAndResponsibilities(responsibilities)
    setOpenDesc(true)
  }

  // Effect to parse job description for live preview in add modal
  useEffect(() => {
    const { summary, skills, responsibilities } = parseJobDescriptionString(addDescData.jobDescription)
    setPreviewJobSummary(summary)
    setPreviewKeySkills(skills)
    setPreviewRolesAndResponsibilities(responsibilities)
  }, [addDescData.jobDescription, parseJobDescriptionString])

  // Effect to parse job description for live preview in edit modal
  useEffect(() => {
    const { summary, skills, responsibilities } = parseJobDescriptionString(ediDescData.jobDescription)
    setPreviewJobSummary(summary)
    setPreviewKeySkills(skills)
    setPreviewRolesAndResponsibilities(responsibilities)
  }, [ediDescData.jobDescription, parseJobDescriptionString])

  // Fetch initial data
  useEffect(() => {
    getAllJobDesc()
    getDepartment()
  }, [])

  // Fetch sub-departments when department changes
  useEffect(() => {
    fetchSubDepartments(addDescData.departmentId || ediDescData.departmentId)
  }, [addDescData.departmentId, ediDescData.departmentId])

  // Fetch designations when department or sub-department changes
  useEffect(() => {
    fetchDesignations(
      addDescData.departmentId || ediDescData.departmentId,
      addDescData.subdeparmentId || ediDescData.subdeparmentId,
    )
  }, [addDescData.departmentId, addDescData.subdeparmentId, ediDescData.departmentId, ediDescData.subdeparmentId])

  const columns = [
    {
      field: "departmentName",
      headerName: "Department Name",
      width: 200,
      renderCell: (params) => (params.row?.departmentId?.name || "-").toUpperCase(),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subdeparmentName",
      headerName: "Sub-Department Name",
      width: 200,
      renderCell: (params) => (params.row?._subDepartmentName || "-").toUpperCase(),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "designationName",
      headerName: "Designation Name",
      width: 200,
      renderCell: (params) => (params.row?.designationId?.name || "-").toUpperCase(),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "jobDescription",
      headerName: "Job Description",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button variant="outlined" size="small" color="success" onClick={() => handleDesc(params.row.jobDescription)}>
          View
        </Button>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const dateStr = params.row?.createdAt
        if (!dateStr) return "-"
        const date = new Date(dateStr)
        return isNaN(date.getTime())
          ? "-"
          : date.toLocaleString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const dateStr = params.row?.updatedAt
        if (!dateStr) return "-"
        const date = new Date(dateStr)
        return isNaN(date.getTime())
          ? "-"
          : date.toLocaleString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
      },
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 300,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <IconButton color="primary" onClick={() => handleEdit(params.row)}>
    //       <EditIcon />
    //     </IconButton>
    //   ),
    // },
  ]

  // Component to render the preview cards
  const JobDescriptionPreview = ({ summary, skills, responsibilities }) => (
    <Box
      sx={{
        mt: 3,
        p: 2,
        border: "1px dashed #ccc",
        borderRadius: 2,
        bgcolor: "#f9f9f9",
        maxHeight: 300,
        overflowY: "auto",
      }}
    >
      {" "}
      {/* Added maxHeight and overflowY */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
        Live Preview:
      </Typography>
      {summary && (
        <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 1, borderLeft: "4px solid #1976d2" }}>
          <CardHeader
            title={
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                Job Summary
              </Typography>
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {summary}
            </Typography>
          </CardContent>
        </Card>
      )}
      {skills.length > 0 && (
        <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 1, borderLeft: "4px solid #388e3c" }}>
          <CardHeader
            title={
              <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                Key Skills
              </Typography>
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ pt: 1 }}>
            <Box component="ul" sx={{ pl: 2, m: 0, listStyleType: "disc" }}>
              {skills.map((skill, index) => (
                <Typography component="li" key={index} sx={{ mb: 0.5, color: "text.secondary", fontSize: "0.875rem" }}>
                  {skill}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
      {responsibilities.length > 0 && (
        <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 1, borderLeft: "4px solid #9c27b0" }}>
          <CardHeader
            title={
              <Typography variant="subtitle1" fontWeight="bold" color="secondary.main">
                Roles and Responsibilities
              </Typography>
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ pt: 1 }}>
            <Box component="ul" sx={{ pl: 2, m: 0, listStyleType: "disc" }}>
              {responsibilities.map((role, index) => (
                <Typography component="li" key={index} sx={{ mb: 0.5, color: "text.secondary", fontSize: "0.875rem" }}>
                  {role}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
      {!summary && skills.length === 0 && responsibilities.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No structured content to preview.
        </Typography>
      )}
    </Box>
  )

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ mb: 4, display: "flex", gap: 3, alignItems: "center" }}>
          <Typography fontSize={20} fontWeight={600}>
            Job Description
          </Typography>
          <Tooltip title="Defines the responsibilities, skills, and expectations for a job role.">
            <InfoOutlinedIcon sx={{ color: "#1976d2", fontSize: 20, cursor: "pointer" }} />
          </Tooltip>
        </Box>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button variant="outlined" size="small" onClick={() => setAddDesc(true)}>
            Add Job Description
          </Button>
          <Button variant="outlined" size="small" onClick={() => router.push("/employeeSetup")}>
            Back
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={jobDescs}
        columns={columns}
        getRowId={(row) => row._id}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />
      <Modal
        open={openDesc}
        onClose={() => {
          setOpenDesc(false)
          setViewJobSummary("")
          setViewKeySkills([])
          setViewRolesAndResponsibilities([])
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600, md: 700 },
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ borderBottom: "2px solid rgb(14, 115, 182)", pb: 1, color: "#333" }}
          >
            Job Description Details
          </Typography>

          {/* Scrollable content area */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
            {viewJobSummary && (
              <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
                <CardHeader
                  title={
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      Job Summary
                    </Typography>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    {viewJobSummary}
                  </Typography>
                </CardContent>
              </Card>
            )}

        

            {viewRolesAndResponsibilities.length > 0 && (
              <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
                <CardHeader
                  title={
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      Roles and Responsibilities
                    </Typography>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Box component="ul" sx={{ pl: 2, m: 0, listStyleType: "disc" }}>
                    {viewRolesAndResponsibilities.map((role, index) => (
                      <Typography component="li" key={index} sx={{ mb: 0.5, color: "text.secondary" }}>
                        {role}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

{viewKeySkills.length > 0 && (
              <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
                <CardHeader
                  title={
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      Key Skills
                    </Typography>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Box component="ul" sx={{ pl: 2, m: 0, listStyleType: "disc" }}>
                    {viewKeySkills.map((skill, index) => (
                      <Typography component="li" key={index} sx={{ mb: 0.5, color: "text.secondary" }}>
                        {skill}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {!viewJobSummary && viewKeySkills.length === 0 && viewRolesAndResponsibilities.length === 0 && (
              <Typography color="text.secondary">
                No detailed description available or format not recognized.
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            size="small"
            sx={{
              mt: 2,
              alignSelf: "flex-end",
              bgcolor: "#00c65c",
              "&:hover": { bgcolor: "#5ed294" },
            }}
            onClick={() => {
              setOpenDesc(false)
              setViewJobSummary("")
              setViewKeySkills([])
              setViewRolesAndResponsibilities([])
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
      <Modal
        open={addDesc}
        onClose={() => {
          setAddDesc(false)
          setAddDescData({
            jobDescription: "",
            designationId: "",
            departmentId: "",
            subdeparmentId: "",
            specialSkills: [],
          })
          setSkillInput("")
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 850,
            maxHeight: "90vh", // Added maxHeight
            overflowY: "auto", // Added overflowY
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Add Job Description
          </Typography>
          <FormControl fullWidth variant="outlined" required size="small">
            <InputLabel>Department</InputLabel>
            <Select
              name="departmentId"
              value={addDescData.departmentId}
              onChange={(e) => {
                setAddDescData({
                  ...addDescData,
                  departmentId: e.target.value,
                  subdeparmentId: "",
                  designationId: "",
                })
                setSubDepts([])
                setDesignations([])
              }}
              label="Department"
            >
              {depts.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" required size="small" disabled={!addDescData.departmentId}>
            <InputLabel>Sub-Department</InputLabel>
            <Select
              name="subdeparmentId"
              value={addDescData.subdeparmentId}
              onChange={(e) => {
                setAddDescData({
                  ...addDescData,
                  subdeparmentId: e.target.value,
                  designationId: "",
                })
                setDesignations([])
              }}
              label="Sub-Department"
            >
              {subDepts.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" required size="small" disabled={!addDescData.subdeparmentId}>
            <InputLabel>Designation</InputLabel>
            <Select
              name="designationId"
              value={addDescData.designationId}
              onChange={(e) => setAddDescData({ ...addDescData, designationId: e.target.value })}
              label="Designation"
            >
              {designations.map((desg) => (
                <MenuItem key={desg._id} value={desg._id}>
                  {desg.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <TextField
              label="Special Skills"
              fullWidth
              size="small"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter"
            />
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {addDescData.specialSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleSkillDelete(skill)}
                  color="primary"
                  size="small"
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Button
              onClick={AutoGenerateJD}
              variant="contained"
              disabled={ailoading || !addDescData.designationId}
              startIcon={ailoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <SmartToyIcon />}
              size="small"
              sx={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "#fff",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 3,
                px: 3,
                py: 1.5,
                my: 3,
                width: "200px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                "&:hover": {
                  background: "linear-gradient(to right, #5a01b0, #1a63e0)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                },
              }}
            >
              {ailoading ? "Generating..." : "Generate Job Description"}
            </Button>
          </Box>
          <TextField
            label="Job Description"
            name="jobDescription"
            fullWidth
            size="small"
            multiline
            rows={8}
            value={addDescData.jobDescription}
            onChange={(e) => setAddDescData({ ...addDescData, jobDescription: e.target.value })}
          />
          {/* Live Preview Section for Add Modal */}
          <JobDescriptionPreview
            summary={previewJobSummary}
            skills={previewKeySkills}
            responsibilities={previewRolesAndResponsibilities}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 3 }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                mt: 2,
                bgcolor: "#00c65c",
                "&:hover": { bgcolor: "#5ed294" },
              }}
              onClick={() => {
                setAddDesc(false)
                setAddDescData({
                  jobDescription: "",
                  designationId: "",
                  departmentId: "",
                  subdeparmentId: "",
                  specialSkills: [],
                })
                setSkillInput("")
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                mt: 2,
                bgcolor: "#00c65c",
                "&:hover": { bgcolor: "#5ed294" },
              }}
              onClick={handleSubmitAdd}
              disabled={!addDescData.jobDescription || !addDescData.designationId}
            >
              Add Description
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={editDesc}
        onClose={() => {
          setEditDesc(false)
          setEditDescData({
            jobDescriptionId: "",
            jobDescription: "",
            designationId: "",
            departmentId: "",
            subdeparmentId: "",
            specialSkills: [],
            status: "active",
          })
          setSkillInput("")
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 850,
            maxHeight: "90vh", // Added maxHeight
            overflowY: "auto", // Added overflowY
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Edit Job Description
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" required size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  name="departmentId"
                  value={ediDescData.departmentId}
                  onChange={(e) => {
                    setEditDescData({
                      ...ediDescData,
                      departmentId: e.target.value,
                      subdeparmentId: "",
                      designationId: "",
                    })
                    setSubDepts([])
                    setDesignations([])
                  }}
                  label="Department"
                >
                  {depts.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" required size="small" disabled={!ediDescData.departmentId}>
                <InputLabel>Sub-Department</InputLabel>
                <Select
                  name="subdeparmentId"
                  value={ediDescData.subdeparmentId}
                  onChange={(e) => {
                    setEditDescData({
                      ...ediDescData,
                      subdeparmentId: e.target.value,
                      designationId: "",
                    })
                    setDesignations([])
                  }}
                  label="Sub-Department"
                >
                  {subDepts.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" required size="small" disabled={!ediDescData.subdeparmentId}>
                <InputLabel>Designation</InputLabel>
                <Select
                  name="designationId"
                  value={ediDescData.designationId}
                  onChange={(e) => setEditDescData({ ...ediDescData, designationId: e.target.value })}
                  label="Designation"
                >
                  {designations.map((desg) => (
                    <MenuItem key={desg._id} value={desg._id}>
                      {desg.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Special Skills"
                fullWidth
                size="small"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
              />
              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {ediDescData.specialSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleSkillDelete(skill)}
                    color="primary"
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Button
                  onClick={AutoGenerateJD}
                  variant="contained"
                  disabled={ailoading || !ediDescData.designationId}
                  startIcon={ailoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <SmartToyIcon />}
                  size="small"
                  sx={{
                    background: "linear-gradient(to right, #6a11cb, #2575fc)",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    my: 3,
                    width: "200px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    "&:hover": {
                      background: "linear-gradient(to right, #5a01b0, #1a63e0)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  {ailoading ? "Generating..." : "Generate Job Description"}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Activity Status"
                size="small"
                value={ediDescData.status}
                onChange={(e) => setEditDescData({ ...ediDescData, status: e.target.value })}
                SelectProps={{ native: false }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">In-Active</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Job Description"
                name="jobDescription"
                fullWidth
                size="small"
                multiline
                rows={8}
                value={ediDescData.jobDescription}
                onChange={(e) => setEditDescData({ ...ediDescData, jobDescription: e.target.value })}
              />
            </Grid>
          </Grid>
          {/* Live Preview Section for Edit Modal */}
          <JobDescriptionPreview
            summary={previewJobSummary}
            skills={previewKeySkills}
            responsibilities={previewRolesAndResponsibilities}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 3 }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                mt: 2,
                bgcolor: "#00c65c",
                "&:hover": { bgcolor: "#5ed294" },
              }}
              onClick={() => {
                setEditDesc(false)
                setEditDescData({
                  jobDescriptionId: "",
                  jobDescription: "",
                  designationId: "",
                  departmentId: "",
                  subdeparmentId: "",
                  specialSkills: [],
                  status: "active",
                })
                setSkillInput("")
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                mt: 2,
                bgcolor: "#00c65c",
                "&:hover": { bgcolor: "#5ed294" },
              }}
              onClick={handleSubmitEdit}
              disabled={!ediDescData.jobDescription || !ediDescData.designationId}
            >
              Edit Description
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  )
}
