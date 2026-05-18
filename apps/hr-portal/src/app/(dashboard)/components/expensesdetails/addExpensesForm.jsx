"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Typography,
  InputAdornment,
  OutlinedInput,
  DialogContent,
  DialogActions,
  Alert,
  Fade,
} from "@mui/material";
import { Category, FileUpload, PictureAsPdf } from "@mui/icons-material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { fetchAllExpenseTypes } from "../../api/expense-type-service";
import { addExpenses } from "../../api/expense-user-service";

const AddExpensesForm = ({ onClose, onSubmit, editData, showSnackbar }) => {
  const [formDataList, setFormDataList] = useState([{ expenseType: "", price: "", image: null }]);
  const [errors, setErrors] = useState({});
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRefs = useRef([]);

  useEffect(() => {
    fileInputRefs.current = formDataList.map((_, index) => fileInputRefs.current[index] || React.createRef());
  }, [formDataList.length]);

  useEffect(() => {
    const loadExpenseTypes = async () => {
      try {
        const data = await fetchAllExpenseTypes();
        setExpenseTypes(data || []);
      } catch (error) {
        setErrors({ general: "Failed to load expense types." });
      }
    };
    loadExpenseTypes();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormDataList([
        {
          id: editData.id || editData._id || "",
          expenseType: editData.expenseType || "",
          price: editData.price || editData.amount || "",
          image: null,
        },
      ]);
    }
  }, [editData]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedList = [...formDataList];
    updatedList[index][name] = value;
    setFormDataList(updatedList);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ general: "Invalid file type. Please upload an image or PDF." });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ general: "File size exceeds 5MB limit." });
        return;
      }
      const updatedList = [...formDataList];
      updatedList[index].image = file;
      setFormDataList(updatedList);
      setErrors({});
    }
  };

  const handleRemoveFile = (index) => {
    const updatedList = [...formDataList];
    updatedList[index].image = null;
    setFormDataList(updatedList);
  };

  const handleAddMore = () => {
    setFormDataList([...formDataList, { expenseType: "", price: "", image: null }]);
  };

  const handleRemove = (index) => {
    const updatedList = [...formDataList];
    updatedList.splice(index, 1);
    setFormDataList(updatedList);
    fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const isEmpty = formDataList.some((data) => !data.expenseType || !data.price);
  if (isEmpty) {
    setErrors({ general: "Please fill all required fields in each entry." });
    return;
  }

  try {
    let response;
    if (editData) {
      response = await addExpenses([{ ...formDataList[0], id: editData.id || editData._id }]);
    } else {
      response = await addExpenses(formDataList);
    }

    if (response.status) {
      showSnackbar(response.message , "success");
      onSubmit(); 
      onClose();
    } else {
      showSnackbar(response.message || "Failed to submit expense", "error");
      onClose();
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    const errorMessage = error.message || "Failed to save expense. Please try again.";
    setErrors({ general: errorMessage });
    showSnackbar(errorMessage, "error"); 
  }
};
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ general: "Invalid file type. Please upload an image or PDF." });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ general: "File size exceeds 5MB limit." });
        return;
      }
      const updatedList = [...formDataList];
      updatedList[index].image = file;
      setFormDataList(updatedList);
      setErrors({});
    }
  };

  const handleUploadClick = (index) => {
    fileInputRefs.current[index]?.current?.click();
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ mx: { xs: 2, sm: 4 }, my: 3 }}>
        <DialogContent
          sx={{
            p: { xs: 3, sm: 5 },
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <form onSubmit={handleSubmit} aria-label="Add or edit expense form">
            {formDataList.map((data, index) => (
              <Card
                key={index}
                sx={{
                  mb: 4,
                  borderRadius: "24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  background: "#ffffff",
                  border: "1px solid #f1f5f9",
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required>
                            <InputLabel
                              id={`expenseType-label-${index}`}
                              sx={{
                                color: "#1e293b",
                                fontWeight: 600,
                                fontSize: "1rem",
                                transform: "translate(14px, -8px) scale(0.75)",
                              }}
                            >
                              Expense Type
                            </InputLabel>
                            <Select
                              labelId={`expenseType-label-${index}`}
                              name="expenseType"
                              value={data.expenseType}
                              onChange={(e) => handleInputChange(index, e)}
                              input={
                                <OutlinedInput
                                  label="Expense Type"
                                  startAdornment={
                                    <InputAdornment position="start">
                                      <Category sx={{ color: "#6b7280", fontSize: 24 }} />
                                    </InputAdornment>
                                  }
                                />
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "14px",
                                  backgroundColor: "#f9fafb",
                                  "&:hover": {
                                    backgroundColor: "#f1f5f9",
                                  },
                                  "&.Mui-focused": {
                                    backgroundColor: "#ffffff",
                                    boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.1)",
                                  },
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#d1d5db",
                                    borderWidth: "2px",
                                  },
                                },
                              }}
                            >
                              {expenseTypes.length > 0 ? (
                                expenseTypes.map((et) => (
                                  <MenuItem key={et.id} value={et.id}>
                                    {et.name}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>No expense types available</MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Amount"
                            name="price"
                            type="number"
                            value={data.price}
                            onChange={(e) => {
                              if (e.target.value >= 0) {
                                handleInputChange(index, e);
                              }
                            }}
                            fullWidth
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CurrencyRupeeIcon sx={{ color: "#6b7280", fontSize: 24 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                                backgroundColor: "#f9fafb",
                                "&:hover": {
                                  backgroundColor: "#f1f5f9",
                                },
                                "&.Mui-focused": {
                                  backgroundColor: "#ffffff",
                                  boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.1)",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#d1d5db",
                                  borderWidth: "2px",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "#1e293b",
                                fontWeight: 600,
                                fontSize: "1rem",
                                transform: "translate(14px, -8px) scale(0.75)",
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        role="region"
                        aria-label="Drag and drop file upload"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleUploadClick(index);
                          }
                        }}
                        sx={{
                          border: `2px dashed ${dragActive ? "#3b82f6" : "#d1d5db"}`,
                          borderRadius: "16px",
                          p: 4,
                          textAlign: "center",
                          backgroundColor: dragActive ? "rgba(59, 130, 246, 0.08)" : "#f9fafb",
                          minHeight: "240px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                          "&:hover": {
                            borderColor: "#3b82f6",
                            backgroundColor: "rgba(59, 130, 246, 0.05)",
                            transform: "scale(1.01)",
                          },
                          "&:focus": {
                            outline: "2px solid #3b82f6",
                          },
                        }}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={(e) => handleDrop(index, e)}
                      >
                        {data.image ? (
                          <Box sx={{ position: "relative", width: "100%", textAlign: "center" }}>
                            {data.image.type && data.image.type.startsWith("image/") ? (
                              <Box sx={{ position: "relative", mb: 3 }}>
                                <Box
                                  component="img"
                                  src={URL.createObjectURL(data.image)}
                                  alt="Uploaded bill preview"
                                  sx={{
                                    maxHeight: 260,
                                    maxWidth: "100%",
                                    objectFit: "contain",
                                    borderRadius: "12px",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                    transition: "transform 0.3s ease-in-out",
                                    "&:hover": { transform: "scale(1.03)" },
                                  }}
                                />
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  mb: 3,
                                  p: 3,
                                  borderRadius: "12px",
                                  border: "1px solid #e5e7eb",
                                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                  backgroundColor: "#f9fafb",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 1,
                                  transition: "transform 0.3s ease-in-out",
                                  "&:hover": { transform: "scale(1.01)" },
                                }}
                              >
                                <PictureAsPdf sx={{ color: "#ef4444", fontSize: 48 }} />
                                <Typography
                                  variant="body1"
                                  sx={{ color: "#1e293b", fontWeight: 600, fontSize: "1.1rem" }}
                                >
                                  {data.image.name || "Uploaded PDF"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#6b7280", fontSize: "0.9rem" }}
                                >
                                  {(data.image.size / (1024 * 1024)).toFixed(2)} MB
                                </Typography>
                              </Box>
                            )}
                            <Button
                              variant="contained"
                              onClick={() => handleRemoveFile(index)}
                              sx={{
                                background: "linear-gradient(90deg, #ef4444, #dc2626)",
                                color: "#ffffff",
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: 600,
                                borderRadius: "12px",
                                px: 4,
                                py: 1.5,
                                boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
                                transition: "all 0.3s ease-in-out",
                                "&:hover": {
                                  background: "linear-gradient(90deg, #dc2626, #b91c1c)",
                                  boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              Remove Bill
                            </Button>
                          </Box>
                        ) : (
                          <>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#475569",
                                mb: 3,
                                fontWeight: 500,
                                fontSize: "1.1rem",
                                lineHeight: 1.5,
                              }}
                            >
                              Drag & drop your bill here or click to browse
                            </Typography>
                            <Button
                              variant="contained"
                              component="label"
                              startIcon={<FileUpload />}
                              sx={{
                                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: 600,
                                borderRadius: "12px",
                                px: 5,
                                py: 1.5,
                                boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
                                transition: "all 0.3s ease-in-out",
                                "&:hover": {
                                  background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                                  boxShadow: "0 8px 28px rgba(59, 130, 246, 0.4)",
                                  transform: "translateY(-2px)",
                                },
                              }}
                              onClick={() => handleUploadClick(index)}
                            >
                              Upload Bill
                              <input
                                type="file"
                                hidden
                                accept="image/jpeg,image/png,image/jpg,application/pdf"
                                ref={(el) => (fileInputRefs.current[index] = el)}
                                onChange={(e) => handleFileChange(index, e)}
                              />
                            </Button>
                          </>
                        )}
                      </Box>
                    </Grid>

                    {!editData && formDataList.length > 1 && (
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          onClick={() => handleRemove(index)}
                          fullWidth
                          sx={{
                            borderColor: "#ef4444",
                            color: "#ef4444",
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                            borderRadius: "12px",
                            py: 1.5,
                            "&:hover": {
                              borderColor: "#dc2626",
                              backgroundColor: "rgba(239, 68, 68, 0.08)",
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          Remove This Entry
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Grid container spacing={3}>
              {!editData && (
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    onClick={handleAddMore}
                    fullWidth
                    sx={{
                      background: "linear-gradient(90deg, #10b981, #34d399)",
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: "12px",
                      py: 1.5,
                      boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        background: "linear-gradient(90deg, #059669, #22c55e)",
                        boxShadow: "0 8px 28px rgba(16, 185, 129, 0.4)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Add Another Expense
                  </Button>
                </Grid>
              )}
              <Grid item xs={12} md={editData ? 12 : 6}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                    py: 1.5,
                    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                      boxShadow: "0 8px 28px rgba(59, 130, 246, 0.4)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {editData ? "Update Expense" : "Submit Expenses"}
                </Button>
              </Grid>
            </Grid>

            {errors.general && (
              <Alert
                severity="error"
                sx={{
                  mt: 3,
                  borderRadius: "12px",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid #ef4444",
                  fontWeight: 500,
                  fontSize: "1rem",
                  py: 2,
                }}
              >
                {errors.general}
              </Alert>
            )}
          </form>
        </DialogContent>

        <DialogActions
          sx={{
            p: { xs: 3, sm: 4 },
            backgroundColor: "#ffffff",
            borderRadius: "0 0 20px 20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              color: "#475569",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#f3f4f6",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Fade>
  );
};

export default AddExpensesForm;