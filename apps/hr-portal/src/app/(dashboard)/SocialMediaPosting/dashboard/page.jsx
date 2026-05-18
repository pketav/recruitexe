"use client"

import { useState, useEffect } from "react"
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Stack,
    Button,
    TextField,
    InputAdornment,
    Container,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from "@mui/material"
import {
    AutoAwesome,
    Schedule,
    CheckCircle,
    Cancel,
    Error as ErrorIcon,
    LinkedIn,
    Search as SearchIcon,
    Visibility,
    Edit,
    Delete,
    CalendarToday,
    Refresh,
    Share,
    Close,
} from "@mui/icons-material"
import DraftsIcon from '@mui/icons-material/Drafts';
import { styled } from "@mui/material/styles"
import { format, formatDistanceToNow } from "date-fns"
import { useApi } from "@core/hooks/useApi"

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: theme.spacing(3),
}))

const StatsCard = styled(Card)(({ theme, bgcolor }) => ({
    borderRadius: theme.spacing(2),
    border: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    backgroundColor: bgcolor || theme.palette.background.paper,
    transition: theme.transitions.create(["transform", "box-shadow"]),
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
}))

const PostCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    border: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(["transform", "box-shadow"]),
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    },
    position: "relative",
}))

const StatusChip = styled(Chip)(({ theme, status }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case "posted":
                return {
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                    "& .MuiChip-icon": { color: "#166534" },
                }
            case "scheduled":
                return {
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    "& .MuiChip-icon": { color: "#92400e" },
                }
            case "cancelled":
                return {
                    backgroundColor: "#f3f4f6",
                    color: "#6b7280",
                    "& .MuiChip-icon": { color: "#6b7280" },
                }
            //   case "failed":
            //     return {
            //       backgroundColor: "#fecaca",
            //       color: "#dc2626",
            //       "& .MuiChip-icon": { color: "#dc2626" },
            //     }
            case "draft":
                return {
                    backgroundColor: "#dbeafe",
                    color: "#1d4ed8",
                    "& .MuiChip-icon": { color: "#1d4ed8" },
                }
            default:
                return {
                    backgroundColor: "#f3f4f6",
                    color: "#6b7280",
                    "& .MuiChip-icon": { color: "#6b7280" },
                }
        }
    }

    return {
        ...getStatusStyles(status),
        fontWeight: 600,
        fontSize: "0.75rem",
        border: "none",
    }
})

const ActionButtonsContainer = styled(Box)({
    position: "absolute",
    top: 16,
    right: 16,
    display: "flex",
    gap: 8,
})

const TabPanel = ({ children, value, index, ...other }) => (
    <div role="tabpanel" hidden={value !== index} {...other}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
)

const dashboard = () => {
    // State Management
    const [dashboardData, setDashboardData] = useState(null)
    const [isLoadingPosts, setIsLoadingPosts] = useState(true)
    const [error, setError] = useState(null)
    const [tabValue, setTabValue] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // Dialog states
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState(null)
    const [isDeletingPost, setIsDeletingPost] = useState(false)

    // Use the consistent API hook
    const { callApi, loading } = useApi()

    // Fetch dashboard data from real API
    const fetchDashboardData = async () => {
        setIsLoadingPosts(true)
        setError(null)

        try {
            console.log("Fetching dashboard data...")

            const result = await callApi({
                endpoint: `/v1/api/post/AllPost?postStatus=${statusFilter}`,
                method: "GET",
                disableSnackbar: true,
            })

            console.log("API Response:", result.data)

            if (result.data.status && result.data.items) {
                setDashboardData(result.data)
            } else {
                throw new Error("Invalid API response format")
            }
        } catch (err) {
            console.error("Error fetching dashboard data:", err)
            setError(err.message || "Failed to load dashboard data. Please try again later.")
            setDashboardData(null)
        } finally {
            setIsLoadingPosts(false)
        }
    }

    // Delete post using jobPostId
    const deletePost = async (post) => {
        if (!post) return
        if (!post.orgIds[0]) return

        const Payload = {
            orgId: post.orgIds[0].orgId
        }

        setIsDeletingPost(true)
        try {
            // Use jobId if available, otherwise fall back to _id
            const ID = post.linkedinPostId.split('urn:li:share:')[1];

            const result = await callApi({
                endpoint: `/v1/api/linkedin/posts/${ID}`,
                method: "DELETE",
                data: Payload

            })

            console.log("Delete response:", result.data)

            if (result.data.status) {
                // Update local state by removing the deleted post
                setDashboardData((prevData) => ({
                    ...prevData,
                    items: {
                        scheduledPosts: prevData.items.scheduledPosts.filter((p) => p._id !== post._id),
                        postedContents: prevData.items.postedContents.filter((p) => p._id !== post._id),
                    },
                }))

                setDeleteDialogOpen(false)
                setPostToDelete(null)
            } else {
                throw new Error(result.data.message || "Failed to delete post")
            }
        } catch (err) {
            console.error("Failed to delete post:", err)
            setError("Failed to delete post. Please try again.")
        } finally {
            setIsDeletingPost(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [statusFilter])

    // Calculate statistics
    const getStatistics = () => {
        if (!dashboardData) return {}

        const allPosts = [...dashboardData.items.scheduledPosts, ...dashboardData.items.postedContents]
        const stats = {
            total: allPosts.length,
            posted: allPosts.filter((p) => p.status === "posted").length,
            scheduled: allPosts.filter((p) => p.status === "scheduled").length,
            //   failed: allPosts.filter((p) => p.status === "failed").length,
            cancelled: allPosts.filter((p) => p.status === "cancelled").length,
            draft: allPosts.filter((p) => p.status === "draft").length,
        }
        return stats
    }

    // Filter posts
    const getFilteredPosts = (posts) => {
        let filtered = posts
        if (searchQuery.trim()) {
            filtered = filtered.filter(
                (post) =>
                    post.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (post.position && post.position.toLowerCase().includes(searchQuery.toLowerCase())),
            )
        }
        if (statusFilter !== "all") {
            filtered = filtered.filter((post) => post.status === statusFilter)
        }
        return filtered
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "posted":
                return <CheckCircle fontSize="small" />
            case "scheduled":
                return <Schedule fontSize="small" />
            case "cancelled":
                return <Cancel fontSize="small" />
            //   case "failed":
            //     return <ErrorIcon fontSize="small" />
            case "draft":
                return <DraftsIcon fontSize="small" />
            default:
                return <Schedule fontSize="small" />
        }
    }

    // Action handlers
    const handleView = (post) => {
        setSelectedPost(post)
        setViewDialogOpen(true)
    }

    const handleEdit = (post) => {
        console.log("Edit post:", post._id)
        // Add edit functionality here
    }

    const handleDelete = (post) => {
        setPostToDelete(post)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!postToDelete) return
        console.log("postToDelete==>", postToDelete)
        await deletePost(postToDelete)
    }

    const handleShare = (post) => {
        if (post.linkedinPostId) {
            const linkedinUrl = `https://www.linkedin.com/feed/update/${post.linkedinPostId}/`
            window.open(linkedinUrl, "_blank")
        }
    }

    const truncateText = (text, maxLength = 150) => {
        if (!text || text.length <= maxLength) return text
        return text.substring(0, maxLength) + "..."
    }

    // Loading State
    if (isLoadingPosts) {
        return (
            <DashboardContainer>
                <Container maxWidth="xl">
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
                        <Stack spacing={2} alignItems="center">
                            <CircularProgress size={48} />
                            <Typography variant="h6" color="text.secondary">
                                Loading dashboard data...
                            </Typography>
                        </Stack>
                    </Box>
                </Container>
            </DashboardContainer>
        )
    }

    // Error State
    if (error) {
        return (
            <DashboardContainer>
                <Container maxWidth="xl">
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Error Loading Dashboard
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                        <Button variant="outlined" onClick={fetchDashboardData} startIcon={<Refresh />}>
                            Try Again
                        </Button>
                    </Alert>
                </Container>
            </DashboardContainer>
        )
    }

    if (!dashboardData) {
        return (
            <DashboardContainer>
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 8,
                            bgcolor: "white",
                            borderRadius: 2,
                            border: "2px dashed #e2e8f0",
                        }}
                    >
                        <LinkedIn sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                        <Typography variant="h6" fontWeight="600" gutterBottom color="#64748b">
                            No data available
                        </Typography>
                        <Typography variant="body2" color="#94a3b8" sx={{ mb: 3 }}>
                            Unable to load dashboard data
                        </Typography>
                        <Button variant="outlined" onClick={fetchDashboardData} startIcon={<Refresh />}>
                            Retry
                        </Button>
                    </Box>
                </Container>
            </DashboardContainer>
        )
    }

    const stats = getStatistics()
    const allPosts = [...dashboardData.items.scheduledPosts, ...dashboardData.items.postedContents]
    const filteredPosts = getFilteredPosts(allPosts)

    return (
        <DashboardContainer>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <AutoAwesome sx={{ fontSize: 32, color: "#6366f1" }} />
                        <Typography variant="h4" fontWeight="bold" color="#1e293b">
                            LinkedIn Posting Analytics
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="body1" color="#64748b">
                            Monitor and track your job posting performance
                        </Typography>
                        <Chip
                            label="Live Data"
                            size="small"
                            sx={{ backgroundColor: "#dbeafe", color: "#1d4ed8", fontWeight: 600 }}
                        />
                    </Stack>

                    {/* <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchDashboardData}
              disabled={loading}
              sx={{ borderRadius: 2, borderColor: "#e2e8f0", color: "#64748b" }}
            >
              Refresh Data
            </Button>
          </Stack> */}
                </Box>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard bgcolor="#dbeafe">
                            <CardContent sx={{ textAlign: "center", py: 3 }}>
                                <Typography variant="h3" fontWeight="bold" color="#1d4ed8" sx={{ mb: 1 }}>
                                    {stats.total}
                                </Typography>
                                <Typography variant="body2" color="#64748b" fontWeight={500}>
                                    Total Posts
                                </Typography>
                            </CardContent>
                        </StatsCard>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard bgcolor="#dcfce7">
                            <CardContent sx={{ textAlign: "center", py: 3 }}>
                                <Typography variant="h3" fontWeight="bold" color="#166534" sx={{ mb: 1 }}>
                                    {stats.posted}
                                </Typography>
                                <Typography variant="body2" color="#64748b" fontWeight={500}>
                                    Posted
                                </Typography>
                            </CardContent>
                        </StatsCard>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard bgcolor="#fef3c7">
                            <CardContent sx={{ textAlign: "center", py: 3 }}>
                                <Typography variant="h3" fontWeight="bold" color="#92400e" sx={{ mb: 1 }}>
                                    {stats.scheduled}
                                </Typography>
                                <Typography variant="body2" color="#64748b" fontWeight={500}>
                                    Scheduled
                                </Typography>
                            </CardContent>
                        </StatsCard>
                    </Grid>



                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard bgcolor="#f3f4f6">
                            <CardContent sx={{ textAlign: "center", py: 3 }}>
                                <Typography variant="h3" fontWeight="bold" color="#6b7280" sx={{ mb: 1 }}>
                                    {stats.draft}
                                </Typography>
                                <Typography variant="body2" color="#64748b" fontWeight={500}>
                                    Drafts
                                </Typography>
                            </CardContent>
                        </StatsCard>
                    </Grid>
                </Grid>

                {/* Search and Filter */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search posts by content or position..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "white",
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Filter by Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "white",
                                },
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="posted">Posted</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="draft">Draft</option>
                        </TextField>
                    </Grid>
                </Grid>

                {/* Tabs */}
                {/* <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                    <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                        <Tab label={`All Posts (${stats.total})`} />
                        <Tab label={`Scheduled (${stats.scheduled})`} />
                        <Tab label={`Posted (${stats.posted})`} />
                    </Tabs>
                </Box> */}

                {/* All Posts Tab */}
                <TabPanel value={tabValue} index={0}>
                    {filteredPosts.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 8,
                                bgcolor: "white",
                                borderRadius: 2,
                                border: "2px dashed #e2e8f0",
                            }}
                        >
                            <LinkedIn sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                            <Typography variant="h6" fontWeight="600" gutterBottom color="#64748b">
                                No posts found
                            </Typography>
                            <Typography variant="body2" color="#94a3b8">
                                {searchQuery || statusFilter !== "all"
                                    ? "Try adjusting your search terms or filters"
                                    : "No posts available"}
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredPosts.map((post) => (
                                <Grid item xs={12} md={6} lg={4} key={post._id}>
                                    <PostCard>
                                        {/* Action Buttons */}
                                        <ActionButtonsContainer>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleView(post)}
                                                    sx={{
                                                        backgroundColor: "white",
                                                        boxShadow: 1,
                                                        "&:hover": { backgroundColor: "#f8fafc" },
                                                    }}
                                                >
                                                    <Visibility fontSize="small" sx={{ color: "#64748b" }} />
                                                </IconButton>
                                            </Tooltip>
                                            {/* <Tooltip title="Edit Post">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(post)}
                          sx={{
                            backgroundColor: "white",
                            boxShadow: 1,
                            "&:hover": { backgroundColor: "#f8fafc" },
                          }}
                        >
                          <Edit fontSize="small" sx={{ color: "#64748b" }} />
                        </IconButton>
                      </Tooltip> */}
                                            {post.status == 'posted' ?
                                                <Tooltip title="Delete Linkedin Post">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(post)}
                                                        sx={{
                                                            backgroundColor: "white",
                                                            boxShadow: 1,
                                                            "&:hover": { backgroundColor: "#fef2f2" },
                                                        }}
                                                    >
                                                        <Delete fontSize="small" sx={{ color: "#ef4444" }} />
                                                    </IconButton>
                                                </Tooltip> : null}

                                        </ActionButtonsContainer>

                                        <CardContent sx={{ p: 3, pr: 7 }}>
                                            {/* Header with LinkedIn icon and status */}
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                                <LinkedIn sx={{ color: "#0077B5", fontSize: 20 }} />
                                                <StatusChip
                                                    icon={getStatusIcon(post.status)}
                                                    label={post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                                    size="small"
                                                    status={post.status}
                                                />
                                            </Stack>

                                            {/* Content */}
                                            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6, color: "#374151" }}>
                                                {truncateText(post.message)}
                                            </Typography>

                                            {/* Position */}
                                            {post.position && (
                                                <Chip
                                                    label={post.position}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "#f0f9ff",
                                                        color: "#0369a1",
                                                        fontWeight: 600,
                                                        mb: 2,
                                                    }}
                                                />
                                            )}

                                            {/* Image Preview */}
                                            {post.imageUrls && post.imageUrls.length > 0 && post.imageUrls[0] && (
                                                <Box sx={{ mb: 2 }}>
                                                    <img
                                                        src={post.imageUrls[0] || "/placeholder.svg"}
                                                        alt="Post preview"
                                                        style={{
                                                            width: "100%",
                                                            height: 120,
                                                            objectFit: "cover",
                                                            borderRadius: 8,
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = "none"
                                                        }}
                                                    />
                                                </Box>
                                            )}

                                            {/* Footer */}
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <CalendarToday sx={{ fontSize: 14, color: "#94a3b8" }} />
                                                    <Typography variant="caption" color="#94a3b8">
                                                        {post.postedAt
                                                            ? formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })
                                                            : post.scheduleTime
                                                                ? format(new Date(post.scheduleTime), "MMM dd, yyyy")
                                                                : "No date"}
                                                    </Typography>
                                                </Stack>

                                                {/* {post.linkedinPostId && (
                          <Tooltip title="View on LinkedIn">
                            <IconButton size="small" onClick={() => handleShare(post)} sx={{ color: "#0077B5" }}>
                              <Share fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )} */}
                                            </Stack>

                                            <Typography variant="caption" color="#94a3b8" sx={{ mt: 1, display: "block" }}>
                                                {post.organization?.name}
                                            </Typography>
                                        </CardContent>
                                    </PostCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </TabPanel>

                {/* Scheduled Posts Tab */}
                <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={3}>
                        {getFilteredPosts(dashboardData.items.scheduledPosts).map((post) => (
                            <Grid item xs={12} md={6} lg={4} key={post._id}>
                                <PostCard>
                                    <ActionButtonsContainer>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleView(post)}
                                                sx={{ backgroundColor: "white", boxShadow: 1 }}
                                            >
                                                <Visibility fontSize="small" sx={{ color: "#64748b" }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Post">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(post)}
                                                sx={{ backgroundColor: "white", boxShadow: 1 }}
                                            >
                                                <Edit fontSize="small" sx={{ color: "#64748b" }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Post">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(post)}
                                                sx={{ backgroundColor: "white", boxShadow: 1 }}
                                            >
                                                <Delete fontSize="small" sx={{ color: "#ef4444" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </ActionButtonsContainer>
                                    <CardContent sx={{ p: 3, pr: 7 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <LinkedIn sx={{ color: "#0077B5", fontSize: 20 }} />
                                            <StatusChip
                                                icon={getStatusIcon(post.status)}
                                                label={post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                                size="small"
                                                status={post.status}
                                            />
                                        </Stack>
                                        <Typography variant="body2" sx={{ mb: 2, color: "#374151" }}>
                                            {truncateText(post.message)}
                                        </Typography>
                                        {post.position && (
                                            <Chip
                                                label={post.position}
                                                size="small"
                                                sx={{ backgroundColor: "#f0f9ff", color: "#0369a1", fontWeight: 600, mb: 2 }}
                                            />
                                        )}
                                        {post.imageUrls && post.imageUrls.length > 0 && post.imageUrls[0] && (
                                            <img
                                                src={post.imageUrls[0] || "/placeholder.svg"}
                                                alt="Post preview"
                                                style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8 }}
                                                onError={(e) => {
                                                    e.target.style.display = "none"
                                                }}
                                            />
                                        )}
                                    </CardContent>
                                </PostCard>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                {/* Posted Content Tab */}
                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                        {getFilteredPosts(dashboardData.items.postedContents).map((post) => (
                            <Grid item xs={12} md={6} lg={4} key={post._id}>
                                <PostCard>
                                    <ActionButtonsContainer>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleView(post)}
                                                sx={{ backgroundColor: "white", boxShadow: 1 }}
                                            >
                                                <Visibility fontSize="small" sx={{ color: "#64748b" }} />
                                            </IconButton>
                                        </Tooltip>
                                        {post.linkedinPostId && (
                                            <Tooltip title="View on LinkedIn">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleShare(post)}
                                                    sx={{ backgroundColor: "white", boxShadow: 1 }}
                                                >
                                                    <Share fontSize="small" sx={{ color: "#0077B5" }} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </ActionButtonsContainer>
                                    <CardContent sx={{ p: 3, pr: 7 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <LinkedIn sx={{ color: "#0077B5", fontSize: 20 }} />
                                            <StatusChip
                                                icon={getStatusIcon(post.status)}
                                                label={post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                                size="small"
                                                status={post.status}
                                            />
                                        </Stack>
                                        <Typography variant="body2" sx={{ mb: 2, color: "#374151" }}>
                                            {truncateText(post.message)}
                                        </Typography>
                                        {post.position && (
                                            <Chip
                                                label={post.position}
                                                size="small"
                                                sx={{ backgroundColor: "#f0f9ff", color: "#0369a1", fontWeight: 600, mb: 2 }}
                                            />
                                        )}
                                        {post.imageUrls && post.imageUrls.length > 0 && post.imageUrls[0] && (
                                            <img
                                                src={post.imageUrls[0] || "/placeholder.svg"}
                                                alt="Post preview"
                                                style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8 }}
                                                onError={(e) => {
                                                    e.target.style.display = "none"
                                                }}
                                            />
                                        )}
                                        <Typography variant="caption" color="#94a3b8" sx={{ mt: 2, display: "block" }}>
                                            Posted {formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })}
                                        </Typography>
                                    </CardContent>
                                </PostCard>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                {/* Analytics Tab */}
                <TabPanel value={tabValue} index={3}>
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <Typography variant="h6" gutterBottom color="#374151">
                            Analytics Overview
                        </Typography>
                        <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                            Detailed analytics and insights coming soon...
                        </Typography>
                        <Button variant="outlined" disabled>
                            View Analytics
                        </Button>
                    </Box>
                </TabPanel>

                {/* View Dialog */}
                <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Post Details</Typography>
                            <IconButton onClick={() => setViewDialogOpen(false)}>
                                <Close />
                            </IconButton>
                        </Stack>
                    </DialogTitle>
                    <DialogContent>
                        {selectedPost && (
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <LinkedIn sx={{ color: "#0077B5", fontSize: 24 }} />
                                    <StatusChip
                                        icon={getStatusIcon(selectedPost.status)}
                                        label={selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                                        size="small"
                                        status={selectedPost.status}
                                    />
                                </Stack>
                                <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
                                    {selectedPost.message}
                                </Typography>
                                {selectedPost.position && (
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#4f46e5" }}>
                                        Position: {selectedPost.position}
                                    </Typography>
                                )}
                                {selectedPost.imageUrls && selectedPost.imageUrls.length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                            Images ({selectedPost.imageUrls.length})
                                        </Typography>
                                        <Grid container spacing={1}>
                                            {selectedPost.imageUrls.map(
                                                (imageUrl, index) =>
                                                    imageUrl && (
                                                        <Grid item xs={6} key={index}>
                                                            <img
                                                                src={imageUrl || "/placeholder.svg"}
                                                                alt={`Post image ${index + 1}`}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "auto",
                                                                    borderRadius: 8,
                                                                    maxHeight: 200,
                                                                    objectFit: "cover",
                                                                }}
                                                                onError={(e) => {
                                                                    e.target.style.display = "none"
                                                                }}
                                                            />
                                                        </Grid>
                                                    ),
                                            )}
                                        </Grid>
                                    </Box>
                                )}
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body2" color="#94a3b8">
                                    Organization: {selectedPost.organization?.name}
                                </Typography>
                                {/* <Typography variant="body2" color="#94a3b8">
                  Job ID: {selectedPost.jobId || "N/A"}
                </Typography>
                <Typography variant="body2" color="#94a3b8">
                  LinkedIn Post ID: {selectedPost.linkedinPostId || "N/A"}
                </Typography> */}
                                <Typography variant="body2" color="#94a3b8">
                                    {selectedPost.postedAt
                                        ? `Posted: ${format(new Date(selectedPost.postedAt), "PPP 'at' p")}`
                                        : selectedPost.scheduleTime
                                            ? `Scheduled: ${format(new Date(selectedPost.scheduleTime), "PPP 'at' p")}`
                                            : "No date available"}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        {postToDelete && (
                            <Box>
                                <Typography sx={{ mb: 2 }}>
                                    Are you sure you want to delete this post? This Will Delete Post From Linkedin Account
                                </Typography>

                                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, mb: 2 }}>
                                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                        Post Details:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {truncateText(postToDelete.message, 100)}
                                    </Typography>
                                    {/* <Typography variant="caption" color="text.secondary">
                                        Position: {postToDelete.position || "N/A"}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="text.secondary">
                                        Job ID: {postToDelete.jobId || postToDelete._id}
                                    </Typography> */}
                                </Box>

                                {isDeletingPost && (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                        <CircularProgress size={16} />
                                        <Typography variant="body2" color="text.secondary">
                                            Deleting post...
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeletingPost}>
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            color="error"
                            variant="contained"
                            disabled={isDeletingPost}
                            startIcon={isDeletingPost ? <CircularProgress size={16} /> : <Delete />}
                        >
                            {isDeletingPost ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </DashboardContainer>
    )
}
export default dashboard