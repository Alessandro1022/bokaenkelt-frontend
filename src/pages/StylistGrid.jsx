import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Button,
  Box,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StylistGrid = () => {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchStylists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/stylists");
      setStylists(response.data);
    } catch (err) {
      console.error("Error fetching stylists:", err);
      setError(err.message || "Failed to fetch stylists");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStylists();
  }, [fetchStylists]);

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target?.value?.toLowerCase());
  }, []);

  const handleStylistClick = (stylist) => {
    navigate(`/stylist/${stylist?._id}`);
  };

  const filteredStylists = stylists.filter(
    (stylist) =>
      stylist?.name?.toLowerCase()?.includes(searchTerm) ||
      stylist?.specialties?.some((specialty) =>
        specialty?.toLowerCase()?.includes(searchTerm)
      )
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchStylists}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <TextField
        fullWidth
        label="Search stylists"
        variant="outlined"
        onChange={handleSearch}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={4}>
        {filteredStylists.map((stylist) => (
          <Grid item key={stylist._id || stylist.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                mx: "auto", // Center horizontally
                width: {
                  xs: "250px", // Full width on mobile
                  sm: "350px", // Slight padding on small screens
                  md: "400px", // Tighter on medium screens
                  lg: "400px", // Fixed width on large screens
                },
                maxWidth: "400px",
                minWidth: {
                  xs: "250px", // Flexible for mobile
                  sm: "350px", // Reasonable minimum for tablet
                  lg: "400px", // Enforced fixed on large
                },
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                  transition: "all 0.3s ease-in-out",
                },
              }}
              onClick={() => handleStylistClick(stylist)}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={`${API_BASE_URL}/${stylist.imageUrl}`}
                  alt={stylist.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {stylist.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {stylist.bio}
                  </Typography>
                  <Typography variant="subtitle2" color="primary">
                    Specialties: {stylist.specialties.join(", ")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Experience: {stylist.experience} years
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StylistGrid;
