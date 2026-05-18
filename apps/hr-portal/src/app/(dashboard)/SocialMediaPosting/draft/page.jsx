"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Skeleton,
  Alert,
  AlertTitle,
  Box,
  Grid,
  Divider,
  Paper,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  Tooltip,
  Fade,
  CircularProgress,
  InputAdornment,
} from "@mui/material"
import {
  Description as FileTextIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Publish as PublishIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  Visibility as PreviewIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { formatDistanceToNow } from "date-fns"
import axios from "axios"
import { useApi } from "@core/hooks/useApi"

// Add the uploadFile function after the useApi hook declaration
const uploadFile = async (file) => {
  const formDataObj = new FormData()
  formDataObj.append("file", file)

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null

    const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, formDataObj, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: token,
      },
    })
    return res.data.url
  } catch (error) {
    console.error("Error uploading file:", error)
    return null
  }
}

// Styled Components for better design
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["transform", "box-shadow", "border-color"]),
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.light,
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
    },
  },
}))

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1, 2),
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.875rem",
  minHeight: 36,
  transition: theme.transitions.create(["transform", "box-shadow"]),
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[4],
  },
}))

const ImagePreview = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  position: "relative",
  maxWidth: 200,
  cursor: "pointer",
  transition: theme.transitions.create(["transform", "box-shadow"]),
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[8],
  },
}))

const CustomChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  fontWeight: 500,
  fontSize: "0.75rem",
}))

export function DraftsList() {
  // State Management
  const [drafts, setDrafts] = useState([])
  const [filteredDrafts, setFilteredDrafts] = useState([])
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Edit Dialog States
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState(null)
  const [editForm, setEditForm] = useState({ message: "", imageUrl: "" })
  const [isUpdatingDraft, setIsUpdatingDraft] = useState(false)

  // Add these new states after the existing edit dialog states
  const [editImageFile, setEditImageFile] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Preview Dialog States
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [previewDraft, setPreviewDraft] = useState(null)

  // Delete Confirmation Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [draftToDelete, setDraftToDelete] = useState(null)
  const [isDeletingDraft, setIsDeletingDraft] = useState(false)

  // Publishing States
  const [publishingDrafts, setPublishingDrafts] = useState(new Set())

  // Use the consistent API hook
  const { callApi, loading } = useApi()

  // Fetch Draft Posts
  const fetchDraftPosts = async () => {
    setIsLoadingDrafts(true)
    setError(null)

    try {
      const result = await callApi({
        endpoint: "/v1/api/linkedin/posts/drafts",
        method: "GET",
        disableSnackbar: true,
      })

      if (result.data.status && Array.isArray(result.data.items)) {
        const mappedDrafts = result.data.items.map((draft) => ({
          id: draft._id,
          position: draft.position || "Untitled Post",
          message: draft.message || "",
          imageUrl: draft.imageUrls?.[0] || null,
          imageUrls: draft.imageUrls || [],
          createdAt: draft.createdAt,
          updatedAt: draft.updatedAt,
          jobId: draft.jobId,
          organizationId: draft.organizationId,
          // Additional metadata
          wordCount: draft.message ? draft.message.split(" ").length : 0,
          characterCount: draft.message ? draft.message.length : 0,
        }))

        setDrafts(mappedDrafts)
        setFilteredDrafts(mappedDrafts)
      } else {
        throw new Error("Invalid draft post response format.")
      }
    } catch (err) {
      console.error("Error fetching drafts:", err)
      setError(err.message || "Failed to load drafts. Please try again later.")
      setDrafts([])
      setFilteredDrafts([])
    } finally {
      setIsLoadingDrafts(false)
    }
  }

  // Search and Filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDrafts(drafts)
    } else {
      const filtered = drafts.filter(
        (draft) =>
          draft.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          draft.message.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredDrafts(filtered)
    }
  }, [searchQuery, drafts])

  // Edit Handlers
  const handleEditClick = (draft) => {
    setSelectedDraft(draft)
    setEditForm({
      message: draft.message,
      imageUrl: draft.imageUrl || "",
    })
    setEditImageFile(null)
    setEditImagePreview(draft.imageUrl || "")
    setEditDialogOpen(true)
  }

  // Image handling functions for edit dialog
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setEditImageFile(file)
      setIsUploadingImage(true)

      if (file.type.startsWith("image/")) {
        // Show immediate preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setEditImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)

        try {
          // Upload file to get URL
          const uploadedUrl = await uploadFile(file)
          if (uploadedUrl) {
            setEditImagePreview(uploadedUrl)
            setEditForm((prev) => ({ ...prev, imageUrl: uploadedUrl }))
          } else {
            setError("Failed to upload image. Please try again.")
          }
        } catch (error) {
          console.error("Failed to upload image:", error)
          setError("Failed to upload image. Please try again.")
        } finally {
          setIsUploadingImage(false)
        }
      }
    }
  }

  const handleRemoveImage = () => {
    setEditImageFile(null)
    setEditImagePreview("")
    setEditForm((prev) => ({ ...prev, imageUrl: "" }))
    // Clear file input
    const fileInput = document.getElementById("edit-image-upload")
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleEditSubmit = async () => {
    if (!selectedDraft) return

    setIsUpdatingDraft(true)
    try {
      const payload = {
        message: editForm.message,
        imageUrls: editForm.imageUrl ? [editForm.imageUrl] : [],
      }

      const result = await callApi({
        endpoint: `/v1/api/linkedin/posts/draft/${selectedDraft.id}`,
        method: "PATCH",
        data: payload,
      })

      if (result.data.status) {
        // Update local state
        const updatedDrafts = drafts.map((draft) =>
          draft.id === selectedDraft.id
            ? {
                ...draft,
                message: editForm.message,
                imageUrl: editForm.imageUrl || null,
                updatedAt: new Date().toISOString(),
                characterCount: editForm.message.length,
                wordCount: editForm.message.split(" ").length,
              }
            : draft,
        )
        setDrafts(updatedDrafts)
        handleEditDialogClose()
      }
    } catch (err) {
      console.error("Failed to update draft:", err)
    } finally {
      setIsUpdatingDraft(false)
    }
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
    setSelectedDraft(null)
    setEditForm({ message: "", imageUrl: "" })
    setEditImageFile(null)
    setEditImagePreview("")
    setIsUploadingImage(false)
  }

  // Preview Handlers
  const handlePreviewClick = (draft) => {
    setPreviewDraft(draft)
    setPreviewDialogOpen(true)
  }

  const handlePreviewDialogClose = () => {
    setPreviewDialogOpen(false)
    setPreviewDraft(null)
  }

  // Publish Handler
  const handlePublishDraft = async (draft) => {
    setPublishingDrafts((prev) => new Set([...prev, draft.id]))

    try {
      const payload = {
        postId: draft.id,
      }

      const result = await callApi({
        endpoint: "/v1/api/linkedin/post/draft",
        method: "POST",
        data: payload,
      })

      if (result.data.status) {
        // Remove published draft from local state
        const updatedDrafts = drafts.filter((d) => d.id !== draft.id)
        setDrafts(updatedDrafts)
      }
    } catch (err) {
      console.error("Failed to publish draft:", err)
    } finally {
      setPublishingDrafts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(draft.id)
        return newSet
      })
    }
  }

  // Delete Handlers - Updated to use proper dialog
  const handleDeleteClick = (draft) => {
    setDraftToDelete(draft)
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setDraftToDelete(null)
    setIsDeletingDraft(false)
  }

  const handleConfirmDelete = async () => {
    if (!draftToDelete) return

    setIsDeletingDraft(true)
    try {
      const result = await callApi({
        endpoint: `/v1/api/linkedin/draft/delete/${draftToDelete.id}`,
        method: "DELETE",
      })

      if (result.data.status) {
        const updatedDrafts = drafts.filter((d) => d.id !== draftToDelete.id)
        setDrafts(updatedDrafts)
        handleDeleteDialogClose()
      }
    } catch (err) {
      console.error("Failed to delete draft:", err)
    } finally {
      setIsDeletingDraft(false)
    }
  }

  // Utility Functions
  const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const getTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "Unknown time"
    }
  }

  // Initial Load
  useEffect(() => {
    fetchDraftPosts()
  }, [])

  // Loading State
  if (isLoadingDrafts) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={24} sx={{ mt: 1 }} />
        </Box>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ borderRadius: 3 }}>
                <CardHeader
                  title={<Skeleton variant="text" width="80%" />}
                  subheader={<Skeleton variant="text" width="60%" />}
                  action={<Skeleton variant="rectangular" width={60} height={24} />}
                />
                <CardContent>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2, borderRadius: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  }

  // Error State
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <AlertTitle>Error Loading Drafts</AlertTitle>
          {error}
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchDraftPosts}>
              Try Again
            </Button>
          </Box>
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#1a1a1a" }}>
              Draft Posts
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and publish your saved draft posts
            </Typography>
          </Box>
          {/* <ActionButton variant="outlined" startIcon={<RefreshIcon />} onClick={fetchDraftPosts} disabled={loading}>
            Refresh
          </ActionButton> */}
        </Stack>

        {/* Search and Filter Bar */}
        <Box sx={{ mb: 3 }}>
          <StyledTextField
            fullWidth
            placeholder="Search drafts by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        {/* Stats Bar */}
        <Box
          sx={{
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <FileTextIcon color="primary" fontSize="small" />
              <Typography variant="body2" fontWeight="600">
                {filteredDrafts.length} Draft{filteredDrafts.length !== 1 ? "s" : ""}
              </Typography>
            </Stack>
            {searchQuery && (
              <CustomChip
                label={`Filtered: ${filteredDrafts.length} of ${drafts.length}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      </Box>

      {/* Empty State */}
      {filteredDrafts.length === 0 && !isLoadingDrafts && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 4,
            bgcolor: "grey.50",
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <FileTextIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" fontWeight="600" gutterBottom>
            {searchQuery ? "No drafts found" : "No draft posts yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery ? "Try adjusting your search terms" : "Create your first draft post to get started"}
          </Typography>
          {searchQuery && (
            <Button variant="outlined" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </Box>
      )}

      {/* Drafts Grid */}
      <Grid container spacing={3}>
        {filteredDrafts.map((draft) => (
          <Grid item xs={12} md={6} lg={4} key={draft.id}>
            <Fade in timeout={300}>
              <StyledCard>
                <CardHeader
                  title={
                    <Typography variant="h6" component="h3" fontWeight="600" noWrap>
                      {draft.position}
                    </Typography>
                  }
                  subheader={
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {getTimeAgo(draft.createdAt)}
                        </Typography>
                      </Stack>
                      {draft.updatedAt !== draft.createdAt && (
                        <CustomChip label="Updated" size="small" color="info" variant="outlined" />
                      )}
                    </Stack>
                  }
                  action={<CustomChip label="Draft" size="small" color="default" variant="outlined" />}
                />

                <CardContent sx={{ pt: 0 }}>
                  {/* Content Preview */}
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 80,
                    }}
                  >
                    {truncateText(draft.message)}
                  </Typography>

                  {/* Image Preview */}
                  {draft.imageUrl && (
                    <Box sx={{ mb: 2 }}>
                      <ImagePreview onClick={() => handlePreviewClick(draft)}>
                        <img
                          src={draft.imageUrl || "/placeholder.svg"}
                          alt="Draft preview"
                          style={{
                            width: "100%",
                            height: 120,
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "white",
                            borderRadius: 1,
                            p: 0.5,
                          }}
                        >
                          <PreviewIcon fontSize="small" />
                        </Box>
                      </ImagePreview>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Stats and Actions */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {draft.characterCount} chars
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {draft.wordCount} words
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Preview">
                        <IconButton size="small" onClick={() => handlePreviewClick(draft)}>
                          <PreviewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditClick(draft)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(draft)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <ActionButton
                        variant="contained"
                        size="small"
                        startIcon={publishingDrafts.has(draft.id) ? <CircularProgress size={16} /> : <PublishIcon />}
                        onClick={() => handlePublishDraft(draft)}
                        disabled={publishingDrafts.has(draft.id)}
                        sx={{
                          background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                          color: "white",
                        }}
                      >
                        {publishingDrafts.has(draft.id) ? "Publishing..." : "Publish"}
                      </ActionButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </StyledCard>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Edit Dialog with Image Upload */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Edit Draft Post
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <StyledTextField
              fullWidth
              label="Post Content"
              name="message"
              value={editForm.message}
              onChange={handleEditFormChange}
              multiline
              rows={6}
              placeholder="Write your post content here..."
              helperText={`${editForm.message.length}/3000 characters`}
            />

            {/* Image Upload Section */}
            <Box>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Post Image
              </Typography>

              {/* Image Upload/Remove Controls */}
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <ActionButton
                  variant="outlined"
                  component="label"
                  startIcon={isUploadingImage ? <CircularProgress size={18} /> : <ImageIcon />}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? "Uploading..." : editImagePreview ? "Change Image" : "Upload Image"}
                  <input id="edit-image-upload" type="file" accept="image/*" onChange={handleImageUpload} hidden />
                </ActionButton>

                {editImagePreview && (
                  <ActionButton
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveImage}
                    disabled={isUploadingImage}
                  >
                    Remove Image
                  </ActionButton>
                )}
              </Stack>

              {/* Image Preview */}
              {editImagePreview && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Image Preview:
                  </Typography>
                  <ImagePreview sx={{ maxWidth: 400 }}>
                    <img
                      src={editImagePreview || "/placeholder.svg"}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=400&text=Image+Error"
                      }}
                    />
                    {editImageFile && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          bgcolor: "success.main",
                          color: "white",
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <Typography variant="caption" fontWeight="600">
                          New Upload
                        </Typography>
                      </Box>
                    )}
                  </ImagePreview>

                  {editImageFile && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 2,
                        bgcolor: "success.50",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "success.200",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 8, height: 8, bgcolor: "success.main", borderRadius: "50%" }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="600" color="success.dark" noWrap>
                            {editImageFile.name}
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            ({(editImageFile.size / 1024 / 1024).toFixed(2)} MB)
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </Box>
              )}

              {/* Image URL Input (Alternative) */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Or paste an image URL:
                </Typography>
                <StyledTextField
                  fullWidth
                  label="Image URL (Optional)"
                  name="imageUrl"
                  value={editForm.imageUrl}
                  onChange={(e) => {
                    handleEditFormChange(e)
                    if (e.target.value && !editImageFile) {
                      setEditImagePreview(e.target.value)
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleEditDialogClose} disabled={isUpdatingDraft}>
            Cancel
          </Button>
          <ActionButton
            onClick={handleEditSubmit}
            variant="contained"
            disabled={isUpdatingDraft || !editForm.message.trim()}
            startIcon={isUpdatingDraft ? <CircularProgress size={18} /> : null}
          >
            {isUpdatingDraft ? "Saving..." : "Save Changes"}
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onClose={handlePreviewDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Post Preview
          </Typography>
        </DialogTitle>
        <DialogContent>
          {previewDraft && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {previewDraft.position}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {previewDraft.message}
              </Typography>
              {previewDraft.imageUrl && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={previewDraft.imageUrl || "/placeholder.svg"}
                    alt="Post image"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 8,
                      maxHeight: 400,
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {previewDraft.characterCount} characters
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {previewDraft.wordCount} words
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created {getTimeAgo(previewDraft.createdAt)}
                </Typography>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewDialogClose}>Close</Button>
          {previewDraft && (
            <ActionButton
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                handlePreviewDialogClose()
                handleEditClick(previewDraft)
              }}
            >
              Edit
            </ActionButton>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "error.50",
                color: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WarningIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600" color="error.main">
                Delete Draft Post
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          {draftToDelete && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to delete this draft post?
              </Typography>

              <Box
                sx={{
                  p: 3,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  {draftToDelete.position}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {draftToDelete.message || "No content"}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Created {getTimeAgo(draftToDelete.createdAt)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {draftToDelete.characterCount} characters
                  </Typography>
                </Stack>
              </Box>

              <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Warning:</strong> This draft will be permanently deleted and cannot be recovered.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleDeleteDialogClose}
            disabled={isDeletingDraft}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <ActionButton
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isDeletingDraft}
            startIcon={isDeletingDraft ? <CircularProgress size={18} /> : <DeleteIcon />}
            sx={{
              bgcolor: "error.main",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            {isDeletingDraft ? "Deleting..." : "Delete Draft"}
          </ActionButton>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
