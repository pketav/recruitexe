"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Stack,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ArticleIcon from "@mui/icons-material/Article";
import { useApi } from "@core/hooks/useApi";
import { toast } from "react-toastify";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function DocumentManagement() {
  const { callApi } = useApi();

  const [designations, setDesignations] = useState([]);
  const [templates, setTemplates] = useState([]);


  const [setupOpen, setSetupOpen] = useState(false);
  const [selectedDesigId, setSelectedDesigId] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState("");


  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editFields, setEditFields] = useState([]);


  useEffect(() => {
    fetchDesignations();
    fetchTemplates();
  }, []);

  const fetchDesignations = async () => {
    const res = await callApi({
      endpoint: "/v1/api/designation/getAll",
      method: "GET",
      auth: true,
      disableSnackbar: true,
    });
    setDesignations(res?.data?.items || []);
  };

  const fetchTemplates = async () => {
    const res = await callApi({
      endpoint: "/v1/api/documentFormTemplate/getAll",
      method: "GET",
      auth: true,
      disableSnackbar: true,
    });
    setTemplates(res?.data?.items || []);
  };

  useEffect(() => {
    const desig = designations.find((d) => d._id === selectedDesigId);
    if (desig?.organizationId) {
      setOrganizationId(desig.organizationId);
    } else if (selectedDesigId) {
      (async () => {
        const res = await callApi({
          endpoint: `/v1/api/designation/detail/${selectedDesigId}`,
          method: "GET",
          auth: true,
          disableSnackbar: true,
        });
        setOrganizationId(res?.data?.organizationId || "");
      })();
    }
  }, [selectedDesigId, designations]);


  const handleAddField = () => {
    const trimmed = newField.trim();
    if (!trimmed) return;
    if (fields.some((f) => f.fieldName.toLowerCase() === trimmed.toLowerCase())) {
      toast.warning("Field already added.");
      return;
    }
    setFields([...fields, { fieldName: trimmed }]);
    setNewField("");
  };

  const handleDeleteField = (index) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  const handleSubmit = async () => {

    if (!selectedDesigId || !organizationId || fields.length === 0) {
      toast.warning("All fields are required (Designation, Organization and Fields)");
      return;
    }

    const payload = {
      designationId: selectedDesigId,
      organizationId,
      fields,
      status: "active"
    };


    const res = await callApi({
      endpoint: "/v1/api/documentFormTemplate/add",
      method: "POST",
      auth: true,
      data: payload,
    });

    toast.success(res?.message || "Template saved!");
    setSetupOpen(false);
    setSelectedDesigId("");
    setOrganizationId("");
    setFields([]);
    setNewField("");
    fetchTemplates();
  };


  const handleEditClick = async (templateId) => {
    const res = await callApi({
      endpoint: `/v1/api/documentFormTemplate/detail/${templateId}`,
      method: "GET",
      auth: true,
      disableSnackbar: true,
    });

    const template = res?.data?.items;
    setSelectedTemplate(template);
    setEditFields(template?.fields || []);
    setEditModalOpen(true);
  };

  const handleFieldChange = (index, value) => {
    const updated = [...editFields];
    updated[index].fieldName = value;
    setEditFields(updated);
  };

  const handleAddEditField = () => {
    setEditFields([...editFields, { fieldName: "" }]);
  };

  const handleUpdate = async () => {
    const payload = {
      designationId: selectedTemplate?.designation?._id,
      fields: editFields.map((f) => ({ fieldName: f.fieldName })),
    };


    const res = await callApi({
      endpoint: `/v1/api/documentFormTemplate/update/${selectedTemplate._id}`,
      method: "POST",
      data: payload,
      auth: true,
    });

    toast.success(res?.message || "Fields updated!");
    setEditModalOpen(false);
    fetchTemplates();
  };

  return (
    <Box p={4} sx={{ bgcolor: "#f9f9fc" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        mb={3}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          fontSize={30}
          sx={{
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(45deg, #7b2ff7 0%, #7b2ff7 50%, #f107a3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <InsertDriveFileIcon sx={{ mr: 1, fontSize: 32 }} />
          Document Setup
        </Typography>
        <Button variant="contained" onClick={() => setSetupOpen(true)}>
          + Add Documents
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#2a78f5" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Designation</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Organization</TableCell>
              {/* <TableCell sx={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Status</TableCell> */}
              <TableCell sx={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Documents</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {templates.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.designation?.name}</TableCell>
                <TableCell>{row.organization?.name}</TableCell>
                {/* <TableCell>
                  <Chip
                    label={row.status || "Inactive"}
                    color={row.status === "active" ? "success" : "error"}
                    variant="outlined"
                    size="small"
                  />
                </TableCell> */}
                <TableCell>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap rowGap={1}>
                    {row.fields.map((f) => (
                      <Chip
                        key={f._id}
                        icon={<ArticleIcon fontSize="small" />}
                        label={f.fieldName}
                        size="small"
                        variant={"filled"}
                        color={"primary"}
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit Fields">
                    <IconButton onClick={() => handleEditClick(row._id)} sx={{ color: "#7b2ff7" }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Setup Modal */}
      <Dialog open={setupOpen} onClose={() => setSetupOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Document Setup
          <IconButton onClick={() => setSetupOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Designation</InputLabel>
            <Select
              value={selectedDesigId}
              label="Select Designation"
              onChange={(e) => setSelectedDesigId(e.target.value)}
            >
              {designations.map((d) => (
                <MenuItem key={d._id} value={d._id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Add Document Field"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddField}>
              Add
            </Button>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
            {fields.map((field, idx) => (
              <Chip
                key={idx}
                label={field.fieldName}
                color="primary"
                onDelete={() => handleDeleteField(idx)}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={!selectedDesigId || !organizationId || fields.length === 0}
          >
            Submit Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth
        maxWidth={false}
        sx={{
          "& .MuiDialog-paper": {
            width: "450px",
            maxWidth: "90%",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#2a78f5",
            py: 1,
            px: 2,
            color: "#fff",
            fontSize: "1rem",
            padding: 4,
          }}
        >
          Edit Fields - {selectedTemplate?.designation?.name}
          <IconButton onClick={() => setEditModalOpen(false)} size="small" sx={{ color: "#fff" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2, px: 2, padding: 4 }}>
          <Stack spacing={2}>
            {editFields.map((field, idx) => (
              <Box key={idx} display="flex" gap={1} alignItems="center">
                <TextField
                  fullWidth
                  value={field.fieldName}
                  onChange={(e) => handleFieldChange(idx, e.target.value)}
                  size="small"
                />
                <Button
                  color="error"
                  onClick={() => {
                    const updated = [...editFields];
                    updated.splice(idx, 1);
                    setEditFields(updated);
                  }}
                  size="small"
                  sx={{ minWidth: 36, px: 1 }}
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </Button>
              </Box>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", py: 1.5, px: 2, margin: 1 }}>
          <Button onClick={handleAddEditField} size="small">+ Add Field</Button>
          <Button variant="contained" onClick={handleUpdate} size="small">
            Update Fields
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
