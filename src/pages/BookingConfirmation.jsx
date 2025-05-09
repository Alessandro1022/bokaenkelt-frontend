import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format, parse } from "date-fns";
import sv from "date-fns/locale/sv";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
  border: "1px solid #D4AF37",
  borderRadius: 16,
  boxShadow: "0 4px 8px rgba(212, 175, 55, 0.15)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Playfair Display, serif",
  color: "#D4AF37",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)",
  boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
  color: "#FFFFFF",
  padding: "10px 24px",
  width: "100%",
  maxWidth: "250px",
  "&:hover": {
    background: "linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)",
  },
}));

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [ratings, setRatings] = useState(0);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.booking) {
      setBooking(location.state.booking);
    } else {
      setError("Ingen bokning hittades. Vänligen försök igen.");
    }
  }, [location.state]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Ogiltigt datum"
        : format(date, "EEEE d MMMM yyyy", { locale: sv });
    } catch {
      return "Ogiltigt datum";
    }
  };

  const formatTime = (timeString) => {
    try {
      if (!timeString) return "Ingen tid angiven";
      if (timeString.includes(":")) return timeString;
      if (timeString instanceof Date) return format(timeString, "HH:mm");
      const parsedTime = parse(timeString, "HH:mm", new Date());
      return isNaN(parsedTime.getTime())
        ? "Ogiltig tid"
        : format(parsedTime, "HH:mm");
    } catch {
      return "Ogiltig tid";
    }
  };

  const getServiceLabel = (serviceValue) => {
    switch (serviceValue) {
      case "haircut":
        return "Herrklippning";
      case "haircut-beard":
        return "Herrklippning med skägg";
      default:
        return serviceValue;
    }
  };

  const getServicePrice = (serviceValue) => {
    switch (serviceValue) {
      case "haircut":
        return "150 kr";
      case "haircut-beard":
        return "200 kr";
      default:
        return "0 kr";
    }
  };

  const handleSubmit = async () => {
    return navigate("/");
  };

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: { xs: 4, md: 8 } }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Box display="flex" justifyContent="center">
            <StyledButton variant="contained" onClick={() => navigate("/")}>
              Tillbaka till startsidan
            </StyledButton>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: { xs: 4, md: 8 } }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Laddar bokningsinformation...
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <StyledPaper>
          <StyledTypography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
          >
            Bokningsbekräftelse
          </StyledTypography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Din bokning är bekräftad!
              </Alert>
            </Grid>

            <Grid item size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
              <StyledTypography variant="h6">Bokningsdetaljer</StyledTypography>
              <Typography variant="body1">
                <strong>Datum:</strong> {formatDate(booking.date)}
              </Typography>
              <Typography variant="body1">
                <strong>Tid:</strong> {formatTime(booking.time)}
              </Typography>
              <Typography variant="body1">
                <strong>Tjänst:</strong> {getServiceLabel(booking.service)}
              </Typography>
              <Typography variant="body1">
                <strong>Pris:</strong> {getServicePrice(booking.service)}
              </Typography>
            </Grid>

            <Grid item size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
              <StyledTypography variant="h6">Kundinformation</StyledTypography>
              <Typography variant="body1">
                <strong>Namn:</strong> {booking.customerName}
              </Typography>
              <Typography variant="body1">
                {/* <strong>Telefon:</strong> {booking.customerPhone} */}
                <strong>Email:</strong> {booking.customerEmail}
              </Typography>
              <Typography variant="subtitle2" mt={1}>
                Tack för din bokning hos BokaEnkelt! En bekräftelse har skickats
                till din e-post - kolla även skräpposten. Du får en påminnelse
                12 timmar innan din tid. OBS Vid avbokning - kontakta din
                stylist minst 24 timmar innan.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <StyledButton variant="contained" onClick={handleSubmit}>
                  Tillbaka till startsidan
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default BookingConfirmation;
