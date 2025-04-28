import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format, parse } from "date-fns";
import sv from "date-fns/locale/sv";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { createBookings, createGuestBookings } from "../api/bookings";

// Styled components
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
  marginBottom: theme.spacing(4),
  textAlign: "center",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)",
  boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
  color: "#FFFFFF",
  padding: "10px 24px",
  "&:hover": {
    background: "linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)",
  },
}));

const StyledLink = styled("a")(({ theme }) => ({
  color: "#D4AF37",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

// Services data
const services = [
  { value: "haircut", label: "Herrklippning", duration: 30, price: 150 },
  {
    value: "haircut-beard",
    label: "Herrklippning med skägg",
    duration: 45,
    price: 200,
  },
];

const BookingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize form data with proper date/time parsing
  const [formData, setFormData] = useState({
    date: location.state?.date ? new Date(location.state.date) : null,
    time: location.state?.time
      ? parse(location.state.time, "HH:mm", new Date())
      : null,
    service: location.state?.service || "",
    customerName: "",
    customerPhone: "",
    id: user?.id || "",
  });

  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kontrollera om användaren är inloggad
    const user = localStorage.getItem("user");

    if (user) {
      const userData = JSON.parse(user);
      setFormData((prev) => ({
        ...prev,
        customerName: userData.name,
        customerPhone: userData.phone || "1234567890",
      }));
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.date || !formData.time) {
      setError("Vänligen välj både datum och tid");
      return;
    }

    if (!formData.customerName.trim()) {
      setError("Vänligen ange ditt namn");
      return;
    }

    // Validera telefonnummer
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.customerPhone.replace(/\s/g, ""))) {
      setError("Vänligen ange ett giltigt telefonnummer (10 siffror)");
      return;
    }

    if (!formData?.service?.trim()) {
      setError("Please select service");
      return;
    }

    try {
      let res = {};
      const newBooking = {
        id: user?.id || "",
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        service: formData.service,
        date: format(formData.date, "yyyy-MM-dd"),
        time: format(formData.time, "HH:mm"),
        status: "Bekräftad",
        stylist: location.state.stylistId,
        // stylistId: location.state.stylistId,
      };

      if (user?.id) {
        res = await createBookings(newBooking);
      } else {
        res = await createGuestBookings(newBooking);
      }

      if (res.status === 201) {
        // // Spara bokningen i localStorage
        // const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        // bookings.push(newBooking);
        // localStorage.setItem("bookings", JSON.stringify(bookings));
        // // Navigera till bekräftelsesidan
        navigate("/booking-confirmation", { state: { booking: newBooking } });
      } else {
        setError("Ett fel uppstod vid bokningen. Vänligen försök igen.");
      }
    } catch (error) {
      setError("Ett fel uppstod vid bokningen. Vänligen försök igen.");
    }
  };

  if (user) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sv}>
        <Container maxWidth="md">
          <Box sx={{ py: 8 }}>
            <StyledPaper>
              <StyledTypography variant="h4" component="h1" gutterBottom>
                Boka tid hos {user?.name || "vår frisör"}
              </StyledTypography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Namn"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      disabled={isLoggedIn}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Telefon"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      disabled={isLoggedIn}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ minWidth: "30%", maxWidth: "30%" }}>
                    <StyledTextField
                      fullWidth
                      select
                      label="Tjänst"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      {services.map((service) => (
                        <MenuItem key={service.value} value={service.value}>
                          {service.label} - {service.duration} min -{" "}
                          {service.price} kr
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Datum"
                      value={formData.date}
                      onChange={(newValue) =>
                        setFormData((prev) => ({ ...prev, date: newValue }))
                      }
                      minDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                      disabled={isLoggedIn}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      label="Tid"
                      value={formData.time}
                      onChange={(newValue) =>
                        setFormData((prev) => ({ ...prev, time: newValue }))
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                      disabled={isLoggedIn}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3 }}
                    >
                      Boka
                    </StyledButton>
                  </Grid>
                </Grid>
              </Box>
            </StyledPaper>
          </Box>
        </Container>
      </LocalizationProvider>
    );
  } else {
    return (
      <Container maxWidth="sm">
        <StyledPaper>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ color: "#D4AF37" }}
          >
            Boka Tid
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Visar den valda tiden */}
            <Box
              sx={{ mb: 3, p: 2, border: "1px solid #D4AF37", borderRadius: 1 }}
            >
              <Typography
                variant="body1"
                sx={{ color: "#D4AF37", fontWeight: "bold" }}
              >
                Vald tid:
              </Typography>
              <Typography variant="body1">
                {new Date(location.state.date).toLocaleDateString("sv-SE")} kl.{" "}
                {location.state.time}
              </Typography>
              <input type="hidden" name="date" value={location.state.date} />
              <input type="hidden" name="time" value={location.state.time} />
            </Box>

            {/* Namn och telefonnummer */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="customerName"
              label="Namn"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="customerPhone"
              label="Telefonnummer"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              placeholder="0701234567"
              sx={{ mb: 2 }}
            />

            {/* Inloggningslänk */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <StyledLink href="#" onClick={() => navigate("/account")}>
                Har du redan ett konto? Logga in här
              </StyledLink>
            </Box>

            {/* Tjänstval */}
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Tjänst"
              name="service"
              value={formData.service}
              onChange={handleChange}
              sx={{ mb: 3 }}
            >
              {services.map((service) => (
                <MenuItem key={service.value} value={service.value}>
                  {service.label} - {service.duration} min - {service.price} kr
                </MenuItem>
              ))}
            </TextField>

            <StyledButton type="submit" fullWidth variant="contained">
              Boka
            </StyledButton>
          </Box>
        </StyledPaper>
      </Container>
    );
  }
};

export default BookingForm;
