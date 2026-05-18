"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  Add,
  ArrowBack,
  Edit,
  CheckCircle,
  Cancel,
  HourglassEmpty as HourglassFull,
  Search,
  Assessment,
  Settings,
  CreditCard,
  Description,
  Person,
  AccountBalance,
} from "@mui/icons-material";
import AddExpensesForm from "./addExpensesForm";
import {  getAllExpensesById} from "../../api/expense-user-service";
import { fetchAllExpenseTypes } from "../../api/expense-type-service";

export default function ExpensesDetails() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [loading, setLoading] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenDialog = (data = null) => {
    setEditData(data);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditData(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const renderStatusChip = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label="Approved"
            color="success"
            size="small"
            sx={{ minWidth: 100 }}
          />
        );
      case "rejected":
        return (
          <Chip
            icon={<Cancel fontSize="small" />}
            label="Rejected"
            color="error"
            size="small"
            sx={{ minWidth: 100 }}
          />
        );
      case "n/a":
        return (
          <Chip
            label="N/A"
            size="small"
            sx={{
              minWidth: 100,
              backgroundColor: "#f5f5f5",
              color: "#6b7280",
            }}
          />
        );
      case "pending":
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
  };

const fetchExpenses = async () => {
  setLoading(true);
  try {
    const expensesResponse = await getAllExpensesById();
    const expenseTypesResponse = await fetchAllExpenseTypes();
    const expensesMessage = expensesResponse?.message;
    setExpenseTypes(expenseTypesResponse.data || []);
    const expenseTypeMap = (expenseTypesResponse.data || []).reduce((map, type) => {
      map[type.id] = type.name;
      return map;
    }, {});

    const fieldData = expensesResponse.items?.FieldData || [];
    if (!fieldData.length) {
      console.warn("No fieldData found in API response");
      setRows([]);
      showSnackbar(expensesMessage || "No expenses found", "info");
      return;
    }
    const mappedRows = fieldData
      .filter((expense) => {
        if (!expense._id) {
          console.error("Expense missing id:", expense);
          return false;
        }
        return true;
      })
      .map((expense) => ({
        id: expense._id,
        expenseTypeData: expense.expenseTypeData.name || "N/A",
        category: expense.categoryData. name|| "N/A",
        expenseBillname: expense.expenseBillname || "N/A",
        amount: expense.price ?? 0,
        image: expense.image || "N/A",
        approverL1: expense.approverLevels?.L1?.employee || "N/A",
        approverL2: expense.approverLevels?.L2?.employee || "N/A",
        approverL3: expense.approverLevels?.L3?.employee || "N/A",
        approverL1Status: expense.approverLevel?.L1?.status || "N/A",
        approverL2Status: expense.approverLevel?.L2?.status || "N/A",
        approverL3Status: expense.approverLevel?.L3?.status || "N/A",
        remitterR1: expense.remitterLevels?.R1?.employee || "N/A",
        remitterR2: expense.remitterLevels?.R2?.employee || "N/A",
        remitterR3: expense.remitterLevels?.R3?.employee || "N/A",
        remitterR1Status: expense.remitterLevel?.R1?.status || "N/A",
        remitterR2Status: expense.remitterLevel?.R2?.status || "N/A",
        remitterR3Status: expense.remitterLevel?.R3?.status || "N/A",
      }));

    const columnsToShow = allColumns.filter((column) => {
      if (
        ["expenseId", "category", "expenseBillname", "amount", "image", "expenseTypeData"].includes(
          column.field
        )
      ) {
        return true;
      }
      return mappedRows.some((row) => row[column.field] !== "N/A");
    });

    setRows(mappedRows);
    setColumns(columnsToShow);
    showSnackbar(expensesMessage || "Expenses loaded", "success");
  } catch (error) {
    console.error("Error fetching expenses:", error);
    const errorMessage = error.response?.data?.message || "Failed to load expenses";
    showSnackbar(errorMessage, "error");
  } finally {
    setLoading(false);
  }
};


const handleAddExpense = async () => {
  try {
    await fetchExpenses();
    handleCloseDialog();
  } catch (error) {
    console.error("Error refreshing expenses:", error);
    const errorMessage = error.response?.data?.message || "Failed to save expense";
    showSnackbar(errorMessage, "error"); 
  }
};

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const allColumns = [
    {
      field: "expenseTypeData",
      headerName: "Expense name",
      width: 130,
      renderHeader: () => (
        <Box display="flex" alignItems="center" gap={1}>
          <CreditCard fontSize="small" />
          Expense name
        </Box>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 130,
      renderHeader: () => (
        <Box display="flex" alignItems="center" gap={1}>
          Category
        </Box>
      ),
    },
    {
      field: "expenseBillname",
      headerName: "Expense Bill",
      width: 130,
      renderHeader: () => (
        <Box display="flex" alignItems="center" gap={1}>
          Bill Name
        </Box>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 110,
      renderHeader: () => (
        <Box display="flex" alignItems="center" gap={1}>
          Amount
        </Box>
      ),
    },
    {
      field: "image",
      headerName: "Image",
      width: 120,
      renderHeader: () => (
        <Box display="flex" alignItems="center" gap={1}>
          <Description fontSize="small" />
          Bill Image
        </Box>
      ),
      renderCell: (params) =>
        params.value && params.value !== "N/A" ? (
          <Button
            variant="outlined"
            size="small"
            onClick={() => window.open(params.value, "_blank")}
            sx={{ textTransform: "none" }}
          >
            View
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">
            N/A
          </Typography>
        ),
    },
    {
      field: "approverL1",
      headerName: " L1",
      width: 150,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Person sx={{ fontSize: 18, color: "#3b82f6" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            L1
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          size="small"
          sx={{
            backgroundColor: "#e0f2fe",
            color: "#0277bd",
            fontWeight: 500,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      ),
    },
    {
      field: "approverL2",
      headerName: " L2",
      width: 150,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Person sx={{ fontSize: 18, color: "#3b82f6" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            L2
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          size="small"
          sx={{
            backgroundColor: "#e0f2fe",
            color: "#0277bd",
            fontWeight: 500,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      ),
    },
    {
      field: "approverL3",
      headerName: " L3",
      width: 150,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Person sx={{ fontSize: 18, color: "#3b82f6" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            L3
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          size="small"
          sx={{
            backgroundColor: "#e0f2fe",
            color: "#0277bd",
            fontWeight: 500,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      ),
    },
    {
      field: "approverL1Status",
      headerName: "L1 Status",
      width: 120,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 18, color: "#3b82f6" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            L1 Status
          </Typography>
        </Box>
      ),
      renderCell: (params) => renderStatusChip(params.value),
    },
    {
      field: "approverL2Status",
      headerName: "L2 Status",
      width: 120,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 18, color: "#3b82f6" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            L2 Status
          </Typography>
        </Box>
      ),
      renderCell: (params) => renderStatusChip(params.value),
    },
    {
      field: "approverL3Status",
      headerName: "L3 Status",
      width: 120,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 18, color: "#3b82f6" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            L3 Status
          </Typography>
        </Box>
      ),
      renderCell: (params) => renderStatusChip(params.value),
    },
    {
      field: "remitterR1",
      headerName: " R1",
      width: 150,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBalance sx={{ fontSize: 18, color: "#10b981" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            R1
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          size="small"
          sx={{
            backgroundColor: "#d1fae5",
            color: "#065f46",
            fontWeight: 500,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      ),
    },
    {
      field: "remitterR2",
      headerName: " R2",
      width: 150,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBalance sx={{ fontSize: 18, color: "#10b981" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            R2
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          size="small"
          sx={{
            backgroundColor: "#d1fae5",
            color: "#065f46",
            fontWeight: 500,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      ),
    },
    {
      field: "remitterR3",
      headerName: " R3",
      width: 150,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBalance sx={{ fontSize: 18, color: "#10b981" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            R3
          </Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          size="small"
          sx={{
            backgroundColor: "#d1fae5",
            color: "#065f46",
            fontWeight: 500,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      ),
    },
    {
      field: "remitterR1Status",
      headerName: "R1 Status",
      width: 120,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 18, color: "#3b82f6" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            R1 Status
          </Typography>
        </Box>
      ),
      renderCell: (params) => renderStatusChip(params.value),
    },
    {
      field: "remitterR2Status",
      headerName: "R2 Status",
      width: 120,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 18, color: "#3b82f6" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            R2 Status
          </Typography>
        </Box>
      ),
      renderCell: (params) => renderStatusChip(params.value),
    },
    {
      field: "remitterR3Status",
      headerName: "R3 Status",
      width: 120,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 18, color: "#3b82f6" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
            R3 Status
          </Typography>
        </Box>
      ),
      renderCell: (params) => renderStatusChip(params.value),
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 100,
    //   renderHeader: () => (
    //     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    //       <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
    //         Actions
    //       </Typography>
    //     </Box>
    //   ),
    //   renderCell: (params) => (
    //     <IconButton
    //       size="small"
    //       onClick={() => handleOpenDialog(params.row)}
    //       sx={{
    //         color: "#3b82f6",
    //         backgroundColor: "#eff6ff",
    //         "&:hover": {
    //           backgroundColor: "#dbeafe",
    //           color: "#1d4ed8",
    //         },
    //       }}
    //     >
    //       <Edit fontSize="small" />
    //     </IconButton>
    //   ),
    // },
  ];

  const CustomToolbar = () => {
    return (
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
        {/* <GridToolbarFilterButton sx={{ color: "#7c4dff" }} /> */}
      </GridToolbarContainer>
    );
  };

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
              >
                Back
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{
                  backgroundColor: "#3b82f6",
                  boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                    boxShadow: "0 6px 8px rgba(59, 130, 246, 0.4)",
                  },
                }}
              >
                Create Expense
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
                  <Settings sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#1f2937", mb: 0.5 }}>
                    Expenses Details
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#6b7280" }}>
                    Create your expenses with ease
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
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: rowsPerPage },
                },
              }}
              pageSizeOptions={[50, 100, 200]}
              onPaginationModelChange={(model) => setRowsPerPage(model.pageSize)}
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
                    <Assessment sx={{ fontSize: 48, color: "#d1d5db" }} />
                    <Typography variant="h6" sx={{ color: "#6b7280" }}>
                      No expenses found
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                      Try adjusting your search criteria
                    </Typography>
                  </Box>
                ),
              }}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeader .MuiBox-root": {
                  color: "#fff",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                },
                "& .MuiDataGrid-toolbarContainer": {
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                },
              }}
              loading={loading}
            />
          </Box>
        </Paper>

        {/* Add/Edit Expense Dialog */}
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
        >
          <DialogTitle
            sx={{
              p: 4,
              pb: 2,
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ backgroundColor: editData ? "#f59e0b" : "#3b82f6", width: 40, height: 40 }}>
                {editData ? <Edit /> : <Add />}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1f2937" }}>
                  {editData ? "Edit Expense" : "Add Expense"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
                  {editData ? "Update the expense details" : "Create a new expense"}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <AddExpensesForm
            onClose={handleCloseDialog}
            onSubmit={handleAddExpense}
            editData={editData}
            showSnackbar={showSnackbar}
          />
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
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}