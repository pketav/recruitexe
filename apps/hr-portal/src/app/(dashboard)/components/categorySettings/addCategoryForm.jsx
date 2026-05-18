"use client"

import { useState, useEffect, forwardRef } from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Avatar,
  InputAdornment,
  Popover,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  Tooltip,
} from "@mui/material"
import { Close, Image as ImageIcon, Search, ShoppingCart, Info } from "@mui/icons-material"
import { fetchCategoryDropdown, fetchExpenseTypes, addCategory } from "../../api/category-service"

// Custom Alert component
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const AddCategoryForm = ({ open, onClose, onSave, editCategory = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    isSubCategory: false,
    parentCategory: "",
    parentCategoryId: null,
    accountCode: "",
    expenseTypeId: "",
    description: "",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [anchorEl, setAnchorEl] = useState(null)
  const [categories, setCategories] = useState([])
  const [expenseTypes, setExpenseTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingExpenseTypes, setLoadingExpenseTypes] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Simple notification state
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")

  // Function to show a notification
  const showSnackbar = (message, severity = "info") => {
    console.log("Showing snackbar:", message, severity)
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  // Function to hide the notification
  const hideSnackbar = () => {
    setSnackbarOpen(false)
  }

  // Fetch parent categories and expense types when dialog opens
  useEffect(() => {
    if (open) {
      fetchParentCategories()
      fetchExpenseTypeOptions()

      if (editCategory) {
        // If editing, populate form with category data
        setFormData({
          name: editCategory.name || "",
          isSubCategory: editCategory.isSubCategory === "true" || Boolean(editCategory.parentCategory),
          parentCategory: editCategory.parentCategory?.name || "",
          parentCategoryId: editCategory.parentCategory?._id || null,
          accountCode: editCategory.accountCode || "",
          expenseTypeId: editCategory.expenseTypeId || "",
          description: editCategory.description || "",
        })
        // Set image preview if available
        setImagePreview(editCategory.image || null)
      } else {
        // If adding new, reset form
        setFormData({
          name: "",
          isSubCategory: false,
          parentCategory: "",
          parentCategoryId: null,
          accountCode: "",
          expenseTypeId: "",
          description: "",
        })
        setImagePreview(null)
      }
      setSearchTerm("")
      setError(null)
    }
  }, [open, editCategory])

  // Fetch parent categories from API
  const fetchParentCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Fetching parent categories...")
      const data = await fetchCategoryDropdown()
      console.log("Parent categories fetched:", data)
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching parent categories:", err)
      setError("Failed to load parent categories. Please try again.")
      showSnackbar("Failed to load parent categories. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  // Fetch expense types from API
  const fetchExpenseTypeOptions = async () => {
    setLoadingExpenseTypes(true)
    try {
      console.log("Fetching expense types...")
      const data = await fetchExpenseTypes()
      console.log("Expense types fetched:", data)
      setExpenseTypes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching expense types:", err)
      showSnackbar("Failed to load expense types. Using default values.", "warning")
      // Set default expense types in case of error
      setExpenseTypes([
        { _id: "1", name: "Operational" },
        { _id: "2", name: "Variable" },
        { _id: "3", name: "Fixed" },
        { _id: "4", name: "Capital" },
        { _id: "5", name: "Other" },
      ])
    } finally {
      setLoadingExpenseTypes(false)
    }
  }

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleImageChange = () => {
    // Simulate image upload - in a real app, you'd use a file input
    setImagePreview("/placeholder-image.jpg")
    showSnackbar("Image updated", "success")
  }

  const handleSave = async () => {
    setSubmitting(true)
    setError(null)

    try {
      console.log("Preparing to save category...")
      // Create category object from form data
      const categoryData = {
        id: editCategory ? editCategory._id : undefined, // Keep ID if editing
        name: formData.name,
        accountCode: formData.accountCode,
        // expenseTypeId: formData.expenseTypeId,
        description: formData.description,
        // parentCategoryId: formData.isSubCategory ? formData.parentCategoryId : null,
        // isSubCategory: formData.isSubCategory, // This will be converted to string in the service
        // Add any other required fields for the API
        // image: imagePreview,
      }

      console.log("Saving category with data:", categoryData)
      // Call the API to add/update the category
      const result = await addCategory(categoryData)
      console.log("Category saved successfully:", result)

      // Show success notification
      showSnackbar("Category saved successfully!", "success")

      // Call the onSave callback with the result
      onSave(result)
    } catch (err) {
      console.error("Error saving category:", err)
      setError("Failed to save category. Please try again.")
      showSnackbar("Failed to save category. Please try again.", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenParentDropdown = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseParentDropdown = () => {
    setAnchorEl(null)
  }

  const handleSelectParent = (category) => {
    setFormData({
      ...formData,
      parentCategory: category.name,
      parentCategoryId: category._id, // Use _id from the API response
    })
    handleCloseParentDropdown()
    showSnackbar(`Selected parent category: ${category.name}`, "info")
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Get the appropriate icon component for a category
  const getCategoryIcon = () => {
    return <ShoppingCart />
  }

  // Test function to trigger a notification
  const testNotification = () => {
    showSnackbar("This is a test notification", "info")
  }

  return (
    <>
      <DialogTitle>
        {editCategory ? "Edit Category" : "New Category"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Test button for notifications */}
        {/* <Button variant="outlined" size="small" onClick={testNotification} sx={{ mb: 2 }}>
          Test Notification
        </Button> */}

        <Grid container spacing={2}>
          {/* <Grid item xs={12} sm={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Avatar sx={{ width: 80, height: 80, mb: 1 }} src={imagePreview}>
              <ImageIcon />
            </Avatar>
            <Button size="small" onClick={handleImageChange} sx={{ textTransform: "none" }}>
              Change
            </Button>
          </Grid> */}
          <Grid item xs={12} sm={12}>
            <TextField
              margin="dense"
              name="name"
              label="Category Name"
              type="text"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>

        {/* <FormControlLabel
          control={<Checkbox checked={formData.isSubCategory} onChange={handleInputChange} name="isSubCategory" />}
          label="Make this a sub-category"
          sx={{ mb: 2 }}
        /> */}

        {/* Parent Category Dropdown - Only visible when isSubCategory is true */}
        {formData.isSubCategory && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="error"
              component="span"
              sx={{ fontWeight: "medium", mb: 1, display: "block" }}
            >
              Parent Category *
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleOpenParentDropdown}
              disabled={loading}
              sx={{
                justifyContent: "space-between",
                textAlign: "left",
                color: "text.secondary",
                height: "56px",
              }}
              endIcon={loading ? <CircularProgress size={20} /> : <span style={{ marginLeft: "auto" }}>▼</span>}
            >
              {formData.parentCategory || "Select"}
            </Button>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleCloseParentDropdown}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                style: { width: anchorEl ? anchorEl.offsetWidth : null },
              }}
            >
              <Box sx={{ p: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Search"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
                <List sx={{ maxHeight: 300, overflow: "auto" }}>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <ListItemButton
                        key={category._id}
                        onClick={() => handleSelectParent(category)}
                        selected={formData.parentCategoryId === category._id}
                        sx={{
                          borderRadius: "4px",
                          "&.Mui-selected": {
                            backgroundColor: "primary.main",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "primary.dark",
                            },
                            "& .MuiListItemIcon-root": {
                              color: "white",
                            },
                          },
                        }}
                      >
                        <ListItemIcon>{getCategoryIcon()}</ListItemIcon>
                        <ListItemText
                          primary={category.name}
                          secondary={
                            <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="caption" component="span">
                                {category.accountCode}
                              </Typography>
                              {category.description && (
                                <Tooltip title={category.description}>
                                  <Info fontSize="small" sx={{ ml: 1, fontSize: "0.75rem" }} />
                                </Tooltip>
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    ))
                  ) : (
                    <Typography sx={{ p: 2, textAlign: "center" }}>No categories found</Typography>
                  )}
                </List>
              </Box>
            </Popover>
          </Box>
        )}

        <TextField
          margin="dense"
          name="accountCode"
          label="Account Code"
          type="text"
          fullWidth
          value={formData.accountCode}
          onChange={handleInputChange}
          sx={{ mb: 1 }}
        />
        <FormHelperText sx={{ mb: 2 }}>
          A unique reference code for this category that is limited to 50 characters and can comprise of letters,
          digits, hyphen and underscore
        </FormHelperText>
{/* 
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="expense-type-label">Expense Type</InputLabel>
          <Select
            labelId="expense-type-label"
            name="expenseTypeId"
            value={formData.expenseTypeId}
            onChange={handleInputChange}
            label="Expense Type"
            disabled={loadingExpenseTypes}
            startAdornment={
              loadingExpenseTypes ? (
                <InputAdornment position="start">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null
            }
          >
            {expenseTypes.map((type) => (
              <MenuItem key={type._id} value={type._id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        <TextField
          margin="dense"
          name="description"
          label="Description"
          multiline
          rows={4}
          fullWidth
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Max 500 characters"
          inputProps={{ maxLength: 500 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={submitting || !formData.name || (formData.isSubCategory && !formData.parentCategoryId)}
        >
          {submitting ? <CircularProgress size={24} /> : "Save"}
        </Button>
        <Button variant="outlined" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
      </DialogActions>

      {/* Completely rebuilt Snackbar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 2000 }}>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={hideSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={hideSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  )
}

export default AddCategoryForm
