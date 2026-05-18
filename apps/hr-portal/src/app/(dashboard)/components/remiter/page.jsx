"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Chip,
  Grid,
  FormHelperText,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  HourglassFull,
  ThumbUp,
  ThumbDown,
  Close,
  Search,
  Person,
  CreditCard,
  AccountBalance,
} from "@mui/icons-material";
import { getRemiter, addRemiter } from "../../api/Remiter-service";

// Constants for status
const STATUS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  PENDING: "pending",
};

const Remiter = () => {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [remiterData, setRemiterData] = useState({
    status: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const renderStatusChip = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case STATUS.APPROVED:
        return (
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label="Approved"
            color="success"
            size="small"
            sx={{ minWidth: 100 }}
          />
        );
      case STATUS.REJECTED:
        return (
          <Chip
            icon={<Cancel fontSize="small" />}
            label="Rejected"
            color="error"
            size="small"
            sx={{ minWidth: 100 }}
          />
        );
      case STATUS.PENDING:
      default:
        return (
          <Chip
            icon={<HourglassFull fontSize="small" />}
            label="Pending"
            color="warning"
            size="small"
            variant="outlined"
            sx={{ minWidth: 100 }}
          />
        );
    }
  }, []);

  const allColumns = useMemo(
    () => [
      {
        field: "employeeName",
        headerName: "Employee Name",
        flex: 1,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <Person sx={{ fontSize: 18, color: "#fff" }} />
            Employee Name
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
      },
      {
        field: "employeeId",
        headerName: "Employee ID",
        flex: 1,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <Person sx={{ fontSize: 18, color: "#fff" }} />
            Employee ID
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
      },
      {
        field: "expenseType",
        headerName: "Expense Type",
        flex: 1,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <CreditCard sx={{ fontSize: 18, color: "#fff" }} />
            Expense Type
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
      },
      {
        field: "expenseBillname",
        headerName: "Expense Bill Name",
        flex: 1,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <CreditCard sx={{ fontSize: 18, color: "#fff" }} />
            Expense Bill Name
          </Box>
        ),
        renderCell: ({ value }) => <Typography variant="body2">{value || "N/A"}</Typography>,
      },
      {
        field: "amount",
        headerName: "Amount",
        flex: 1,
        renderCell: ({ value }) => <Typography>₹{value.toLocaleString()}</Typography>,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <AccountBalance sx={{ fontSize: 18, color: "#fff" }} />
            Amount
          </Box>
        ),
      },
      {
        field: "r1Status",
        headerName: "R1",
        flex: 1,
        renderCell: ({ value }) => renderStatusChip(value),
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle sx={{ fontSize: 18, color: "#fff" }} />
            R1
          </Box>
        ),
      },
      {
        field: "r2Status",
        headerName: "R2",
        flex: 1,
        renderCell: ({ value }) => renderStatusChip(value),
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle sx={{ fontSize: 18, color: "#fff" }} />
            R2
          </Box>
        ),
      },
      {
        field: "r3Status",
        headerName: "R3",
        flex: 1,
        renderCell: ({ value }) => renderStatusChip(value),
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle sx={{ fontSize: 18, color: "#fff" }} />
            R3
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        sortable: false,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
              Actions
            </Typography>
          </Box>
        ),
        renderCell: ({ row }) => {
          const canRemit =
            row.r1Status === STATUS.PENDING ||
            row.r2Status === STATUS.PENDING ||
            row.r3Status === STATUS.PENDING;
          return (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenDialog(row)}
              disabled={!canRemit}
              sx={{
                bgcolor: "#3b82f6",
                "&:hover": { bgcolor: "#2563eb" },
                textTransform: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)",
              }}
              aria-label={`Approve expense for ${row.employeeName}`}
            >
              Approve
            </Button>
          );
        },
      },
    ],
    [renderStatusChip]
  );

  const getAllRemiters = useCallback(async () => {
    try {
      setLoading(true);
      const remiter = await getRemiter();
      const newData = remiter.map((item) => ({
        id: item._id || "",
        employeeName: item.employeeName || item.employeName || "N/A",
        employeeId: item.employeeUniqueId || item.employeUniqueId || "N/A",
        expenseType: item.expenseTypeData?.name || "N/A",
        expenseTypeId: item.expenseTypeData?._id || "",
        expenseBillname: item.expenseBillname || "N/A",
        amount: item.price || 0,
        r1Status: item.remitterLevel?.R1?.status || "N/A",
        r2Status: item.remitterLevel?.R2?.status || "N/A",
        r3Status: item.remitterLevel?.R3?.status || "N/A",
        r1remarks: item.remitterLevel?.R1?.remarks || "N/A",
        r2remarks: item.remitterLevel?.R2?.remarks || "N/A",
        r3remarks: item.remitterLevel?.R3?.remarks || "N/A",
        r1approvername: item.remitterLevels?.R1?.employee?.employeeName || item.remitterLevels?.R1?.employee?.employeName || "N/A",
        r2approvername: item.remitterLevels?.R2?.employee?.employeeName || item.remitterLevels?.R2?.employee?.employeName || "N/A",
        r3approvername: item.remitterLevels?.R3?.employee?.employeeName || item.remitterLevels?.R3?.employee?.employeName || "N/A",
      }));

      const columnsToShow = allColumns.filter((column) => {
        if (["employeeName", "employeeId", "expenseType", "expenseBillname", "amount", "actions"].includes(column.field)) {
          return true;
        }
        return newData.some((row) => row[column.field] && row[column.field] !== "N/A");
      });

      setColumns(columnsToShow);
      setExpenses(newData);
    } catch (error) {
      console.error("Error fetching remiter expenses:", error);
      if (error.message === "Authentication token is missing") {
        showSnackbar("Please log in to continue", "error");
        router.push("/login");
      } else {
        showSnackbar(error.message || "Failed to load expenses", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [allColumns, router, showSnackbar]);

  useEffect(() => {
    getAllRemiters();
  }, [getAllRemiters]);

  const handleOpenDialog = useCallback((expense) => {
    if (!expense?.id) {
      showSnackbar("Invalid expense data", "error");
      return;
    }
    setSelectedExpense(expense);
    setRemiterData({
      status: "",
      remarks: "",
    });
    setErrors({});
    setOpenDialog(true);
  }, [showSnackbar]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedExpense(null);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setRemiterData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!remiterData.status) {
      newErrors.status = "Status is required";
    }
    if (!remiterData.remarks) {
      newErrors.remarks = "Remarks are required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [remiterData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    if (!selectedExpense?.id) {
      showSnackbar("Invalid expense selected", "error");
      return;
    }

    setLoading(true);

    try {
      let levelToUpdate = null;
      let stateKey = null;

      if (selectedExpense.r1Status === STATUS.PENDING) {
        levelToUpdate = "R1";
        stateKey = "r1Status";
      } else if (selectedExpense.r1Status === STATUS.APPROVED && selectedExpense.r2Status === STATUS.PENDING) {
        levelToUpdate = "R2";
        stateKey = "r2Status";
      } else if (
        selectedExpense.r1Status === STATUS.APPROVED &&
        selectedExpense.r2Status === STATUS.APPROVED &&
        selectedExpense.r3Status === STATUS.PENDING
      ) {
        levelToUpdate = "R3";
        stateKey = "r3Status";
      } else {
        showSnackbar("No pending remiter level found", "info");
        return;
      }

      const response = await addRemiter(selectedExpense.expenseTypeId, levelToUpdate, {
        status: remiterData.status,
        remarks: remiterData.remarks,
      });

      if (response.status) {
        showSnackbar(response.message || "Remittance submitted successfully", "success");
        await getAllRemiters();
      } else {
        showSnackbar(response.message || "Failed to submit remittance", "error");
      }
    } catch (error) {
      console.error("Error submitting remiter:", {
        message: error.message,
        expenseId: selectedExpense.expenseTypeId,
        level: levelToUpdate,
      });
      showSnackbar(error.message || "Failed to submit remittance", "error");
    } finally {
      setLoading(false);
      if (!errors.status && !errors.remarks) {
        handleCloseDialog();
      }
    }
  }, [
    validateForm,
    selectedExpense,
    remiterData,
    showSnackbar,
    getAllRemiters,
    handleCloseDialog,
    errors,
  ]);

  const filteredRows = useMemo(
    () =>
      expenses.filter((row) =>
        Object.values(row).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [expenses, searchTerm]
  );

  const CustomToolbar = useCallback(
    () => (
      <GridToolbarContainer
        sx={{
          padding: "12px 16px",
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <GridToolbarColumnsButton sx={{ color: "#64748b", fontSize: "0.875rem" }} />
        <GridToolbarDensitySelector sx={{ color: "#64748b", fontSize: "0.875rem" }} />
        <GridToolbarExport
          csvOptions={{ disableToolbarButton: false }}
          printOptions={{ disableToolbarButton: true }}
          sx={{ color: "#64748b", fontSize: "0.875rem" }}
        />
        {/* <TextField
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ ml: "auto", width: "200px" }}
          aria-label="Search expenses"
        /> */}
      </GridToolbarContainer>
    ),
    [searchTerm]
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", p: 3 }}>
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        {/* Header Section */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => router.back()}
                sx={{
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    backgroundColor: "#f1f5f9",
                  },
                }}
                aria-label="Go back"
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    backgroundColor: "#3b82f6",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <Person sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#1f2937", mb: 0.5 }}>
                    Remiter Approval
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#6b7280" }}>
                    Review and remit expense requests submitted by employees
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Data Grid */}
        <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              aria-label="Remiter approval dashboard"
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 50 },
                },
              }}
              pageSizeOptions={[50, 100, 200]}
              getRowId={(row) => row.id}
              slots={{
                toolbar: CustomToolbar,
                noRowsOverlay: () => (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      color: "#9ca3af",
                      gap: 2,
                    }}
                  >
                    <Person sx={{ fontSize: 48, color: "#d1d5db" }} />
                    <Typography variant="h6" sx={{ color: "#6b7280" }}>
                      {searchTerm ? "No matching expenses found" : "No expenses found"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                      {searchTerm ? "Try adjusting your search term" : "Try adjusting your search criteria"}
                    </Typography>
                  </Box>
                ),
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  borderRadius: 0,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                },
                "& .MuiDataGrid-columnHeader": {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
                  color: "#fff",
                },
                "& .MuiDataGrid-row": {
                  "&:hover": {
                    bgcolor: "rgba(99, 102, 241, 0.04)",
                    cursor: "pointer",
                  },
                  "&:nth-of-type(even)": {
                    bgcolor: "rgba(248, 250, 252, 0.5)",
                  },
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #F1F5F9",
                  py: 2,
                },
                "& .MuiDataGrid-footerContainer": {
                  bgcolor: "#FAFBFF",
                  borderTop: "1px solid #E5E7EB",
                },
              }}
              loading={loading}
            />
          </Box>
        </Paper>

        {/* Remiter Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
            },
          }}
          aria-labelledby="remiter-dialog-title"
        >
          <DialogTitle
            id="remiter-dialog-title"
            sx={{
              p: 4,
              pb: 2,
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ backgroundColor: "#3b82f6", width: 40, height: 40 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1f2937" }}>
                  Expense Remittance
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
                  Review and submit your decision
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseDialog}
                sx={{ ml: "auto", color: "#64748b" }}
                aria-label="Close dialog"
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            {selectedExpense && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937", p: "0.5rem" }}>
                    Expense Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Employee
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#1f2937" }}>
                    {selectedExpense.employeeName} ({selectedExpense.employeeId})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Amount
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#1f2937" }}>
                    ₹{selectedExpense.amount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Expense Type
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#1f2937" }}>
                    {selectedExpense.expenseType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Expense Bill Name
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#1f2937" }}>
                    {selectedExpense.expenseBillname}
                  </Typography>
                </Grid>
                {(selectedExpense.r1Status !== "N/A" ||
                  selectedExpense.r2Status !== "N/A" ||
                  selectedExpense.r3Status !== "N/A") && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Current Status
                    </Typography>
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{ border: "1px solid #e2e8f0", borderRadius: "8px" }}
                    >
                      <Table size="small" aria-label="Expense status history">
                        <TableHead>
                          <TableRow
                            sx={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          >
                            <TableCell sx={{ fontWeight: 600, color: "#fff" }}>Level</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: "#fff" }}>Remitter</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: "#fff" }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: "#fff" }}>Remarks</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {  selectedExpense.r1Status !== "N/A"  && (
                            <TableRow>
                              <TableCell sx={{ color: "#1f2937" }}>R1</TableCell>
                              <TableCell sx={{ color: "#1f2937" }}>{selectedExpense.r1approvername}</TableCell>
                              <TableCell>{renderStatusChip(selectedExpense.r1Status)}</TableCell>
                              <TableCell sx={{ color: "#1f2937" }}>{selectedExpense.r1remarks}</TableCell>
                            </TableRow>
                          )}
                          {selectedExpense.r2Status && selectedExpense.r2Status === "N/A" &&  selectedExpense.r2Status !== "N/A"  && (
                            <TableRow>
                              <TableCell sx={{ color: "#1f2937" }}>R2</TableCell>
                              <TableCell sx={{ color: "#1f2937" }}>{selectedExpense.r2approvername}</TableCell>
                              <TableCell>{renderStatusChip(selectedExpense.r2Status)}</TableCell>
                              <TableCell sx={{ color: "#1f2937" }}>{selectedExpense.r2remarks}</TableCell>
                            </TableRow>
                          )}
                          {selectedExpense.r3Status && selectedExpense.r3Status === "N/A" &&  selectedExpense.r3Status !== "N/A"  && (
                            <TableRow>
                              <TableCell sx={{ color: "#1f2937" }}>R3</TableCell>
                              <TableCell sx={{ color: "#1f2937" }}>{selectedExpense.r3approvername}</TableCell>
                              <TableCell>{renderStatusChip(selectedExpense.r3Status)}</TableCell>
                              <TableCell sx={{ color: "#1f2937" }}>{selectedExpense.r3remarks}</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937", mb: 2 }}>
                    Your Decision
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.status} sx={{ mb: 3 }}>
                    <InputLabel id="status-label">Remiter Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      name="status"
                      value={remiterData.status}
                      onChange={handleInputChange}
                      label="Remiter Status"
                      sx={{
                        backgroundColor: "#f9fafb",
                        "&:hover": { backgroundColor: "#f3f4f6" },
                        "&.Mui-focused": { backgroundColor: "white" },
                      }}
                      startAdornment={
                        remiterData.status === STATUS.APPROVED ? (
                          <ThumbUp sx={{ color: "green", mr: 1 }} />
                        ) : remiterData.status === STATUS.REJECTED ? (
                          <ThumbDown sx={{ color: "red", mr: 1 }} />
                        ) : null
                      }
                      aria-describedby="status-error-text"
                    >
                      <MenuItem value={STATUS.APPROVED}>Approved</MenuItem>
                      <MenuItem value={STATUS.REJECTED}>Rejected</MenuItem>
                    </Select>
                    {errors.status && (
                      <FormHelperText id="status-error-text">{errors.status}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.remarks}>
                    <TextField
                      id="remarks"
                      name="remarks"
                      label="Remarks"
                      multiline
                      rows={4}
                      value={remiterData.remarks}
                      onChange={handleInputChange}
                      placeholder="Enter your comments or reasons for remittance/rejection"
                      error={!!errors.remarks}
                      helperText={errors.remarks}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#f9fafb",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                          },
                        },
                      }}
                      aria-describedby="remarks-error-text"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 4, pt: 0 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                textTransform: "none",
                color: "#64748b",
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                },
              }}
              aria-label="Cancel remittance"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#3b82f6",
                boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
                "&:hover": {
                  bgcolor: "#2563eb",
                  boxShadow: "0 6px 8px rgba(59, 130, 246, 0.4)",
                },
                textTransform: "none",
                borderRadius: "8px",
              }}
              aria-label="Submit remittance"
            >
              {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              backgroundColor: snackbar.severity === "success" ? "#d1fae5" : "#fee2e2",
              color: "#1f2937",
            }}
            aria-live="polite"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Remiter;