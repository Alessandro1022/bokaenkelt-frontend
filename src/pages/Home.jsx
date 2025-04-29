import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100vh - 200px)",
  textAlign: "center",
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)",
  boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
  color: "#FFFFFF",
  padding: theme.spacing(1.5, 4),
  fontSize: "1rem",
  marginTop: theme.spacing(4),
  "&:hover": {
    background: "linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
    padding: theme.spacing(1, 3),
  },
}));

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 } }}>
      <StyledBox>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontFamily: "Playfair Display, serif",
            color: "#D4AF37",
            marginBottom: 2,
            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              md: "3rem",
            },
          }}
        >
          Welcome to BokaEnkelt
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "2.5rem",
            },
          }}
        >
          Välkommen till BokaEnkelt
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            marginBottom: 4,
            maxWidth: "600px",
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.2rem",
            },
          }}
        >
          Upplev konsten av enkel och smidig bokning med vår smarta plattform.
          Boka din tid idag och förenkla din vardag.
        </Typography>
        <StyledButton
          component={RouterLink}
          to="/stylists"
          variant="contained"
          size="large"
        >
          Book Now
        </StyledButton>
      </StyledBox>
    </Container>
  );
};

export default Home;
