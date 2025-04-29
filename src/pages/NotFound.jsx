import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
          px: { xs: 2, sm: 4 }, // Responsive padding for different screen sizes
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: "4rem", sm: "6rem" } }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2, fontSize: { xs: "0.875rem", sm: "1rem" } }} // Adjust font size on smaller screens
        >
          Return Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
