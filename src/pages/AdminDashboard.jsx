import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { deleteBookings, fetchBookings, updateBookings } from "../api/bookings";

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    time: "",
    service: "",
    status: "",
  });

  useEffect(() => {
    loadBookings();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const loadBookings = async () => {
    try {
      const response = await fetchBookings();
      const storedBookings = response.data.length ? response.data : [];
      setBookings(storedBookings);
      // const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      // setBookings(storedBookings);
    } catch (err) {
      setError("Kunde inte ladda bokningar");
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (booking, newStatus) => {
    const _bookingItem = bookings.find((item) => item._id === booking._id);
    const _updatedBooking = { ..._bookingItem, status: newStatus };
    const res = await updateBookings(_updatedBooking);
    if (res.status === 200) {
      await loadBookings();
      showNotification("Bokning uppdaterad", "success");
    }
  };

  const handleStorageChange = (e) => {
    if (e.key === "bookings") {
      loadBookings();
    }
  };

  const showNotification = (message, severity = "success") => {
    setNotification({ message, severity });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setEditFormData({
      date: booking.date,
      time: booking.time,
      service: booking.service,
      status: booking.status,
    });
  };

  const handleDelete = async (bookingId) => {
    try {
      const res = await deleteBookings(bookingId);
      if (res.status === 200) {
        await loadBookings();
        showNotification("Bokning borttagen", "success");
      }
      // const updatedBookings = bookings.filter((booking) => booking.id !== id);
      // localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      // setBookings(updatedBookings);
      // showNotification("Bokning borttagen");
    } catch (err) {
      setError("Kunde inte ta bort bokningen");
      console.error("Error deleting booking:", err);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await updateBookings(editingBooking);
      if (res.status === 200) {
        await loadBookings();
        setEditingBooking(null);
        showNotification("Bokning uppdaterad", "success");
      }
      // const updatedBookings = bookings.map((booking) =>
      //   booking.id === editingBooking.id
      //     ? { ...booking, ...editFormData }
      //     : booking
      // );
      // localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      // setBookings(updatedBookings);
      // setEditingBooking(null);
      // showNotification("Bokning uppdaterad");
    } catch (err) {
      setError("Kunde inte uppdatera bokningen");
      console.error("Error updating booking:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed":
        return "Bekräftad";
      case "pending":
        return "Väntar";
      case "cancelled":
        return "Avbokad";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Ogiltigt datum";
      }
      return date.toLocaleDateString("sv-SE");
    } catch (error) {
      return "Ogiltigt datum";
    }
  };

  const formatTime = (timeString) => {
    try {
      if (!timeString) return "Ingen tid angiven";
      // Kontrollera om tiden redan är i rätt format (HH:mm)
      if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
        return timeString;
      }
      // Om tiden är i ISO-format, extrahera bara HH:mm
      const time = new Date(timeString);
      if (isNaN(time.getTime())) {
        return "Ogiltig tid";
      }
      return time.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Ogiltig tid";
    }
  };

  const getStatistics = () => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
    };
  };

  if (loading) {
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

  const stats = getStatistics();

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
          <StyledTypography variant="h4">
            BokaEnkelt - Admin Panel
          </StyledTypography>
          <StyledButton
            variant="contained"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logga ut
          </StyledButton>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Totalt antal bokningar
                </Typography>
                <Typography variant="h4">{stats.totalBookings}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Bekräftade bokningar
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.confirmedBookings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Väntande bokningar
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.pendingBookings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Avbokade bokningar
                </Typography>
                <Typography variant="h4" color="error.main">
                  {stats.cancelledBookings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kund</TableCell>
                  <TableCell>Datum</TableCell>
                  <TableCell>Tid</TableCell>
                  <TableCell>Tjänst</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Åtgärder</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.customerPhone}</TableCell>
                    <TableCell>{formatDate(booking.date)}</TableCell>
                    <TableCell>{formatTime(booking.time)}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking, e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value="Bekräftad">Bekräftad</MenuItem>
                        <MenuItem value="Väntar">Väntar</MenuItem>
                        <MenuItem value="Avbokad">Avbokad</MenuItem>
                        <MenuItem value="Slutförd">Slutförd</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(booking)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(booking.id || booking._id)}
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

        <Dialog open={!!editingBooking} onClose={() => setEditingBooking(null)}>
          <DialogTitle>Redigera Bokning</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Kundnamn"
                    name="customerName"
                    value={editingBooking?.customerName || ""}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        customerName: e.target.value,
                      });
                      setEditingBooking({
                        ...editingBooking,
                        customerName: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="date"
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        date: e.target.value,
                      });
                      setEditingBooking({
                        ...editingBooking,
                        date: e.target.value,
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="time"
                    type="time"
                    value={editFormData.time}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        time: e.target.value,
                      });
                      setEditingBooking({
                        ...editingBooking,
                        time: e.target.value,
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tjänst"
                    name="service"
                    value={editFormData.service}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        service: e.target.value,
                      });
                      setEditingBooking({
                        ...editingBooking,
                        service: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editFormData.status}
                      onChange={(e) => {
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        });
                        setEditingBooking({
                          ...editingBooking,
                          status: e.target.value,
                        });
                      }}
                      label="Status"
                    >
                      <MenuItem value="Bekräftad">Bekräftad</MenuItem>
                      <MenuItem value="Väntar">Väntar</MenuItem>
                      <MenuItem value="Avbokad">Avbokad</MenuItem>
                      <MenuItem value="Slutförd">Slutförd</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingBooking(null)}>Avbryt</Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              color="primary"
            >
              Spara
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
