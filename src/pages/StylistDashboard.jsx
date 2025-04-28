import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../api/client';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)',
  border: '1px solid #D4AF37',
  borderRadius: 16,
  boxShadow: '0 4px 8px rgba(212, 175, 55, 0.15)',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Playfair Display, serif',
  color: '#D4AF37',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  '&::before, &::after': {
    content: '"✦"',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#D4AF37',
    opacity: 0.8,
  },
  '&::before': {
    left: theme.spacing(2),
  },
  '&::after': {
    right: theme.spacing(2),
  },
}));

const StylistDashboard = () => {
  const [stylist, setStylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStylistData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getProfile();
        setStylist(response.data.stylist);
      } catch (err) {
        console.error('Error fetching stylist data:', err);
        setError('Failed to fetch stylist data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStylistData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: '#D4AF37' }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!stylist) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="info" sx={{ mb: 4 }}>
            No stylist data found.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <StyledPaper>
          <StyledTypography variant="h4" component="h1">
            Welcome, {stylist.name}
          </StyledTypography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Typography>
                <strong>Email:</strong> {stylist.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {stylist.phone}
              </Typography>
              <Typography>
                <strong>Address:</strong> {stylist.address}
              </Typography>
              <Typography>
                <strong>Experience:</strong> {stylist.experience}
              </Typography>
              <Typography>
                <strong>Specialties:</strong> {stylist.specialties?.join(', ')}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Upcoming Appointments
              </Typography>
              {stylist.bookings?.length > 0 ? (
                stylist.bookings.map((booking) => (
                  <Paper key={booking.id} sx={{ p: 2, mb: 2 }}>
                    <Typography>
                      <strong>Customer:</strong> {booking.customer.name}
                    </Typography>
                    <Typography>
                      <strong>Service:</strong> {booking.service}
                    </Typography>
                    <Typography>
                      <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <strong>Time:</strong> {booking.time}
                    </Typography>
                    <Typography>
                      <strong>Duration:</strong> {booking.duration} minutes
                    </Typography>
                    <Typography>
                      <strong>Price:</strong> ${booking.price}
                    </Typography>
                    <Typography>
                      <strong>Status:</strong> {booking.status}
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography>No upcoming appointments</Typography>
              )}
            </Grid>
          </Grid>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default StylistDashboard; 