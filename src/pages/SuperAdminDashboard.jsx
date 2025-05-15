import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { createStylist, getAllStylist, deleteStylist } from "../api/stylists";

const SuperAdminDashboard = () => {
  // STATES & REFS
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState({ stylists: true, addStylist: false });
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [stylistForm, setStylistForm] = useState({ email: "", password: "" });
  const [stylistDialog, setStylistDialog] = useState(false);

  // EFFECTS
  useEffect(() => {
    loadStylists();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // API FUNCTIONS
  const loadStylists = async () => {
    try {
      const response = await getAllStylist();
      const storedstylists = response?.data?.data?.length
        ? response?.data?.data
        : [];
      setStylists(storedstylists);
    } catch (err) {
      setError("Kunde inte ladda bokningar");
      console.error("Error loading stylists:", err);
    } finally {
      setLoading((prev) => ({ ...prev, stylists: false }));
    }
  };

  // FUNCTIONS
  const handleStorageChange = (e) => {
    if (e.key === "stylists") {
      loadstylists();
    }
  };
  const showNotification = (message, severity = "success") => {
    setNotification({ message, severity });
    setTimeout(() => setNotification(null), 3000);
  };
  const handleDelete = async (id) => {
    try {
      const res = await deleteStylist(id);
      if (res.status === 200) {
        showNotification(res?.data?.message);
        await loadStylists();
      }
    } catch (err) {
      console.error(err);
      showNotification(error?.response?.data?.message, "error");
      // setError("Kunde inte ta bort bokningen");
      // console.error("Error deleting booking:", err);
    }
  };
  const handleAddStylist = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^.{6,}$/;

      if (!stylistForm.email.trim()) {
        return alert("Email is required!");
      }

      if (!emailRegex.test(stylistForm.email)) {
        return alert("Enter valid email!");
      }

      if (!stylistForm.password.trim()) {
        return alert("Password is required!");
      }

      if (!passwordRegex.test(stylistForm.password)) {
        return alert("Password must be at least 6 characters.");
      }

      setLoading((prev) => ({ ...prev, addStylist: true }));

      const res = await createStylist(stylistForm);
      if (res?.status === 200) {
        showNotification(res.data.message, "success");
        await loadStylists();
      }
    } catch (error) {
      console.error(error);
      showNotification(error?.response?.data?.message, "error");
    } finally {
      setLoading((prev) => ({ ...prev, addStylist: false }));
      setStylistForm({ email: "", password: "" });
      setStylistDialog(false);
    }
  };

  if (loading.stylists) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {notification && (
        <Alert
          severity={notification.severity}
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          {notification.message}
        </Alert>
      )}
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <StyledTypography
            variant="h4"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              fontFamily: "Playfair Display, serif",
              color: "#D4AF37",
              mb: 3,
            }}
          >
            Super Admin Panel
          </StyledTypography>
          <StyledButton
            type="submit"
            onClick={() => setStylistDialog(true)}
            variant="contained"
          >
            Add Stylist
          </StyledButton>
        </Box>

        {/* TABLE */}
        <StyledPaper>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Reviews</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Options</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stylists.map((stylist) => (
                  <TableRow key={stylist.id}>
                    <TableCell>{stylist.name}</TableCell>
                    <TableCell>{stylist.email}</TableCell>
                    <TableCell>{stylist.phone}</TableCell>
                    <TableCell>{stylist.experience}</TableCell>
                    <TableCell>{stylist.reviews}</TableCell>
                    <TableCell>{stylist.isActive?.toString()}</TableCell>

                    <TableCell>
                      <IconButton
                        onClick={() => handleDelete(stylist.id || stylist._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        {/* ADD STYLIST DIALOG */}
        <Dialog open={stylistDialog} onClose={() => setStylistDialog(false)}>
          <DialogTitle>Add Stylist</DialogTitle>
          <DialogContent>
            <Box sx={{ width: { xs: "100%", sm: "500px" } }}>
              <Grid container spacing={2} mt={1}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    required
                    label="Email"
                    name="email"
                    type="email"
                    value={stylistForm.email}
                    onChange={(e) => {
                      setStylistForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    required
                    type="text"
                    label="Password"
                    name="password"
                    value={stylistForm.password}
                    onChange={(e) => {
                      setStylistForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStylistDialog(false)}>Cancel</Button>
            <Button
              onClick={handleAddStylist}
              variant="contained"
              color="primary"
            >
              {loading.addStylist ? <CircularProgress size={18} /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default SuperAdminDashboard;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
  border: "1px solid #D4AF37",
  borderRadius: 16,
  boxShadow: "0 4px 8px rgba(212, 175, 55, 0.15)",
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Playfair Display, serif",
  color: "#D4AF37",
  marginBottom: theme.spacing(3),
}));
const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)",
  boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
  color: "#FFFFFF",
  padding: "10px 24px",
  "&:hover": {
    background: "linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)",
  },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: "Playfair Display, serif",
  color: "#D4AF37",
  fontWeight: "bold",
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#D4AF37",
    },
    "&:hover fieldset": {
      borderColor: "#B38B2D",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#D4AF37",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#D4AF37",
    "&.Mui-focused": {
      color: "#D4AF37",
    },
  },
}));
