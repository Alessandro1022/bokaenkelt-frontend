import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
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
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { formatDateToTime } from "../lib/helper";

// API
import {
  deleteBookings,
  fetchBookings,
  updateBookings,
} from "../api/bookings/index";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
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

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editedBooking, setEditedBooking] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadBookings();
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const loadBookings = async () => {
    try {
      const response = await fetchBookings();
      const storedBookings = response.data.length ? response.data : [];

      if (storedBookings) {
        // const parsedBookings = JSON.parse(storedBookings);
        // setBookings(Array.isArray(parsedBookings) ? parsedBookings : []);
        setBookings(storedBookings);
      } else {
        setBookings([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Kunde inte ladda bokningar");
      setLoading(false);
    }
  };

  const handleStorageChange = (e) => {
    if (e.key === "bookings") {
      loadBookings();
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setEditedBooking({ ...booking });
    setEditDialogOpen(true);
  };

  const handleDelete = async (bookingId) => {
    try {
      const res = await deleteBookings(bookingId);
      if (res.status === 200) {
        await loadBookings();
        // const updatedBookings = bookings.filter(
        //   (booking) => (booking.id || booking._id) !== bookingId
        // );
        // localStorage.setItem("bookings", JSON.stringify(updatedBookings));
        // setBookings(updatedBookings);
        showNotification("Bokning borttagen", "success");
      }
    } catch (err) {
      setError("Kunde inte ta bort bokning");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const res = await updateBookings(editedBooking);
      if (res.status === 200) {
        await loadBookings();
        // const updatedBookings = bookings.map((booking) =>
        //   booking.id === editedBooking.id ? editedBooking : booking
        // );
        // localStorage.setItem("bookings", JSON.stringify(updatedBookings));
        // setBookings(updatedBookings);
        setEditDialogOpen(false);
        showNotification("Bokning uppdaterad", "success");
      } else {
        setEditDialogOpen(false);
        showNotification("Bokning uppdaterad", "error");
      }
    } catch (err) {
      setError("Kunde inte uppdatera bokning");
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

  const formatDate = (date) => {
    return format(new Date(date), "EEEE d MMMM yyyy", { locale: sv });
  };

  const formatTime = (time) => {
    // return format(new Date(time), 'HH:mm');
    return time;
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
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
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
          severity={notification.type}
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
          <StyledTypography variant="h4">Mina bokningar</StyledTypography>
          <StyledButton variant="contained" onClick={handleLogout}>
            Logga ut
          </StyledButton>
        </Box>

        {/* <Grid container spacing={3} sx={{ mb: 4 }}>
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
        </Grid> */}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: "Totalt antal bokningar", value: stats.totalBookings },
            { label: "Bekräftade bokningar", value: stats.confirmedBookings },
            { label: "Väntande bokningar", value: stats.pendingBookings },
            { label: "Avbokade bokningar", value: stats.cancelledBookings },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4">{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <StyledPaper>
          <TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                    Datum
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                    Tid
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                    Tjänst
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                    Åtgärder
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id || booking._id}>
                    <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                      {formatDate(booking.date)}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                      {formatTime(booking.time)}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                      {booking.service}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                      <Chip
                        label={getStatusLabel(booking.status)}
                        color={getStatusColor(booking.status)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                      <IconButton onClick={() => handleEdit(booking)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(booking.id || booking._id);
                        }}
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

        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              width: { xs: "90%", sm: "500px" }, // Adjust width based on screen size
              maxWidth: "500px", // Optional: Cap the max width on larger screens
            },
          }}
        >
          <DialogTitle>Redigera bokning</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Datum"
                    name="date"
                    type="date"
                    value={
                      editedBooking?.date
                        ? format(new Date(editedBooking.date), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tid"
                    name="time"
                    type="time"
                    // value={
                    //   editedBooking?.time
                    //     ? format(new Date(editedBooking.time), "HH:mm")
                    //     : ""
                    // }
                    value={
                      editedBooking?.date
                        ? formatDateToTime(editedBooking?.date)
                        : ""
                    }
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tjänst"
                    name="service"
                    value={editedBooking?.service || ""}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={editedBooking?.status || ""}
                    onChange={handleInputChange}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="pending">Väntar</option>
                    <option value="confirmed">Bekräftad</option>
                    <option value="cancelled">Avbokad</option>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Avbryt</Button>
            <Button onClick={handleSaveEdit} color="primary">
              Spara
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CustomerDashboard;
