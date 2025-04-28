import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Welcome to Hair Booking
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Book your next hairstyle with our professional stylists
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/stylists"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
          >
            Find Stylists
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="primary"
            size="large"
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage; 