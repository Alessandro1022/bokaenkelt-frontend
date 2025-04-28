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
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)",
  boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
  color: "#FFFFFF",
  padding: "12px 32px",
  fontSize: "1.1rem",
  marginTop: theme.spacing(4),
  "&:hover": {
    background: "linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)",
  },
}));

const Home = () => {
  return (
    <Container maxWidth="md">
      <StyledBox>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontFamily: "Playfair Display, serif",
            color: "#D4AF37",
            marginBottom: 2,
          }}
        >
          Welcome to BokaEnkelt
        </Typography>
        <Typography variant="h2" component="h1" gutterBottom>
          Välkommen till BokaEnkelt
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "#666",
            marginBottom: 4,
            maxWidth: "600px",
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
