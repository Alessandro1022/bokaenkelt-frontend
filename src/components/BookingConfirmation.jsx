import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)',
  border: '1px solid #D4AF37',
  borderRadius: 16,
  boxShadow: '0 4px 8px rgba(212, 175, 55, 0.15)',
  position: 'relative',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #D4AF37, #B38B2D)',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Playfair Display, serif',
  color: '#D4AF37',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
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

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)',
  color: '#FFFFFF',
  padding: '12px 32px',
  fontSize: '1.1rem',
  '&:hover': {
    background: 'linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)',
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    color: '#D4AF37',
    marginRight: theme.spacing(1),
  },
}));

const BookingConfirmation = ({ booking, onEdit, onCancel }) => {
  const {
    stylistName,
    serviceName,
    date,
    time,
    duration,
    price,
    status = 'confirmed',
  } = booking;

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon
          sx={{
            fontSize: 64,
            color: '#D4AF37',
            mb: 2,
          }}
        />
        <StyledTypography variant="h4" component="h1">
          Booking Confirmed!
        </StyledTypography>
        <Typography variant="body1" color="text.secondary">
          Your appointment has been successfully scheduled
        </Typography>
      </Box>

      <Divider sx={{ my: 4, borderColor: '#D4AF37' }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InfoBox>
            <PersonIcon />
            <Typography variant="body1">
              <strong>Stylist:</strong> {stylistName}
            </Typography>
          </InfoBox>
          <InfoBox>
            <CalendarTodayIcon />
            <Typography variant="body1">
              <strong>Date:</strong> {date}
            </Typography>
          </InfoBox>
          <InfoBox>
            <AccessTimeIcon />
            <Typography variant="body1">
              <strong>Time:</strong> {time}
            </Typography>
          </InfoBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoBox>
            <LocationOnIcon />
            <Typography variant="body1">
              <strong>Service:</strong> {serviceName}
            </Typography>
          </InfoBox>
          <InfoBox>
            <AccessTimeIcon />
            <Typography variant="body1">
              <strong>Duration:</strong> {duration} minutes
            </Typography>
          </InfoBox>
          <InfoBox>
            <Typography variant="body1">
              <strong>Price:</strong> {price}
            </Typography>
          </InfoBox>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Tooltip title="Edit Booking">
          <IconButton
            onClick={onEdit}
            sx={{
              color: '#D4AF37',
              '&:hover': {
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
              },
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel Booking">
          <IconButton
            onClick={onCancel}
            sx={{
              color: '#D4AF37',
              '&:hover': {
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <StyledButton
          variant="contained"
          size="large"
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </StyledButton>
      </Box>
    </StyledPaper>
  );
};

export default BookingConfirmation; 