"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Rating,
} from "@mui/material"

// Loading Spinner Component
const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    <Typography variant="h6">Loading...</Typography>
  </Box>
)

// Mock candidates data
const generateMockCandidates = () => {
  const names = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
    "Jessica Garcia",
    "Christopher Martinez",
    "Ashley Anderson",
    "Matthew Taylor",
    "Amanda Thomas",
  ]
  const jobs = ["Software Engineer", "Data Scientist", "Product Manager", "UX Designer", "DevOps Engineer"]
  const statuses = ["AI Qualified", "Human Review", "Interview Scheduled", "Rejected", "Hired"]
  const sources = ["LinkedIn", "Indeed", "Company Website", "Referrals"]
  const skills = [
    ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    ["Python", "TensorFlow", "SQL", "Tableau", "R"],
    ["Agile", "Scrum", "Analytics", "Strategy", "Leadership"],
    ["Figma", "Sketch", "Prototyping", "User Research", "CSS"],
    ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"],
  ]

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + ` ${i + 1}`,
    email: `candidate${i + 1}@email.com`,
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    location: ["New York, NY", "San Francisco, CA", "Austin, TX", "Seattle, WA", "Boston, MA"][
      Math.floor(Math.random() * 5)
    ],
    jobTitle: jobs[Math.floor(Math.random() * jobs.length)],
    aiScore: Math.floor(Math.random() * 40) + 60,
    skills: skills[Math.floor(Math.random() * skills.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    applicationDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    source: sources[Math.floor(Math.random() * sources.length)],
    experience: Math.floor(Math.random() * 10) + 1,
  }))
}

const statusColors = {
  "AI Qualified": "success",
  "Human Review": "warning",
  "Interview Scheduled": "info",
  Rejected: "error",
  Hired: "primary",
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([])
  const [filteredCandidates, setFilteredCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [jobFilter, setJobFilter] = useState("")
  const [scoreRange, setScoreRange] = useState([0, 100])
  const [sourceFilter, setSourceFilter] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockData = generateMockCandidates()
      setCandidates(mockData)
      setFilteredCandidates(mockData)
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filtered = candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || candidate.status === statusFilter
      const matchesJob = !jobFilter || candidate.jobTitle === jobFilter
      const matchesScore = candidate.aiScore >= scoreRange[0] && candidate.aiScore <= scoreRange[1]
      const matchesSource = !sourceFilter || candidate.source === sourceFilter

      return matchesSearch && matchesStatus && matchesJob && matchesScore && matchesSource
    })

    setFilteredCandidates(filtered)
    setPage(0)
  }, [candidates, searchTerm, statusFilter, jobFilter, scoreRange, sourceFilter])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRowClick = (candidate) => {
    setSelectedCandidate(candidate)
    setModalOpen(true)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const uniqueJobs = [...new Set(candidates.map((c) => c.jobTitle))]
  const uniqueSources = [...new Set(candidates.map((c) => c.source))]
  const uniqueStatuses = [...new Set(candidates.map((c) => c.status))]

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          👥 Candidate Explorer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and analyze candidate applications with AI insights
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔍 Filters
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {uniqueStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Job Title</InputLabel>
              <Select value={jobFilter} label="Job Title" onChange={(e) => setJobFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {uniqueJobs.map((job) => (
                  <MenuItem key={job} value={job}>
                    {job}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Source</InputLabel>
              <Select value={sourceFilter} label="Source" onChange={(e) => setSourceFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {uniqueSources.map((source) => (
                  <MenuItem key={source} value={source}>
                    {source}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>
              AI Score Range: {scoreRange[0]} - {scoreRange[1]}
            </Typography>
            <Slider
              value={scoreRange}
              onChange={(_, newValue) => setScoreRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </Typography>
      </Box>

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Candidate</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Job Applied</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>AI Score</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Key Skills</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Applied</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Source</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((candidate) => (
              <TableRow
                key={candidate.id}
                hover
                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "action.hover" } }}
                onClick={() => handleRowClick(candidate)}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>{candidate.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {candidate.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {candidate.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{candidate.jobTitle}</TableCell>
                <TableCell>
                  <Chip
                    label={`${candidate.aiScore}%`}
                    color={candidate.aiScore >= 80 ? "success" : candidate.aiScore >= 60 ? "warning" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {candidate.skills.slice(0, 2).map((skill, index) => (
                      <Chip key={index} label={skill} size="small" variant="outlined" />
                    ))}
                    {candidate.skills.length > 2 && (
                      <Chip label={`+${candidate.skills.length - 2}`} size="small" variant="outlined" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={candidate.status} color={statusColors[candidate.status] || "default"} size="small" />
                </TableCell>
                <TableCell>{candidate.applicationDate}</TableCell>
                <TableCell>{candidate.source}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRowClick(candidate)
                    }}
                  >
                    👁️ View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCandidates.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Candidate Detail Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        {selectedCandidate && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ mr: 2, bgcolor: "primary.main", width: 56, height: 56 }}>
                  {selectedCandidate.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedCandidate.name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedCandidate.jobTitle}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      📧 Contact Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Email" secondary={selectedCandidate.email} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Phone" secondary={selectedCandidate.phone} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Location" secondary={selectedCandidate.location} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Applied Date" secondary={selectedCandidate.applicationDate} />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      🤖 AI Analysis
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        AI Match Score
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h4" color="primary">
                          {selectedCandidate.aiScore}%
                        </Typography>
                        <Rating value={selectedCandidate.aiScore / 20} readOnly size="small" />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Skills
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selectedCandidate.skills.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      💼 Experience & Background
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Experienced professional with {selectedCandidate.experience} years in the field. Strong background
                      in {selectedCandidate.skills.slice(0, 3).join(", ")} and related technologies.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <Chip label={`${selectedCandidate.experience} years experience`} color="info" />
                      <Chip label={selectedCandidate.source} color="secondary" />
                      <Chip label={selectedCandidate.status} color={statusColors[selectedCandidate.status]} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setModalOpen(false)}>Close</Button>
              <Button variant="outlined" color="error">
                ❌ Reject
              </Button>
              <Button variant="outlined" color="warning">
                📅 Schedule Interview
              </Button>
              <Button variant="contained" color="success">
                ✅ Approve
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  )
}
