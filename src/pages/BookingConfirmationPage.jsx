import React from 'react';
import { Box, Container, Typography, Paper, Button, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import NoteIcon from '@mui/icons-material/Note';
import WorkIcon from '@mui/icons-material/Work';
import format from 'date-fns/format';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)',
  border: '1px solid #D4AF37',
  borderRadius: 16,
  boxShadow: '0 4px 8px rgba(212, 175, 55, 0.15)',
  textAlign: 'center',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Playfair Display, serif',
  color: '#D4AF37',
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)',
  boxShadow: '0 3px 5px 2px rgba(212, 175, 55, .3)',
  color: '#FFFFFF',
  padding: '10px 24px',
  '&:hover': {
    background: 'linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)',
  },
}));

const BookingConfirmationPage = () => {
  const location = useLocation();
  const bookingDetails = location.state || {};

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <StyledPaper>
          <CheckCircleIcon sx={{ fontSize: 80, color: '#D4AF37', mb: 2 }} />
          <StyledTypography variant="h3" component="h1">
            Booking Confirmed!
          </StyledTypography>
          <Typography variant="h6" sx={{ mb: 4, color: '#666' }}>
            Thank you for choosing our salon. We look forward to seeing you!
          </Typography>
          
          {Object.keys(bookingDetails).length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" sx={{ mb: 2, color: '#D4AF37', textAlign: 'left' }}>
                Booking Details
              </Typography>
              <List sx={{ textAlign: 'left', mb: 3 }}>
                {bookingDetails.stylistName && (
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon sx={{ color: '#D4AF37' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Stylist" 
                      secondary={bookingDetails.stylistName} 
                    />
                  </ListItem>
                )}
                {bookingDetails.date && (
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon sx={{ color: '#D4AF37' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Date" 
                      secondary={format(new Date(bookingDetails.date), 'MMMM d, yyyy')} 
                    />
                  </ListItem>
                )}
                {bookingDetails.time && (
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeIcon sx={{ color: '#D4AF37' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Time" 
                      secondary={bookingDetails.time} 
                    />
                  </ListItem>
                )}
                {bookingDetails.name && (
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon sx={{ color: '#D4AF37' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Name" 
                      secondary={bookingDetails.name} 
                    />
                  </ListItem>
                )}
                {bookingDetails.phone && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon sx={{ color: '#D4AF37' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone" 
                      secondary={bookingDetails.phone} 
                    />
                  </ListItem>
                )}
                {bookingDetails.email && (
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon sx={{ color: '#D4AF37' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={bookingDetails.email} 
                    />
                  </ListItem>
                )}
                {bookingDetails.notes && (
                  <ListItem>
                    <ListItemIcon>
                      <NoteIcon sx={{ color: '#D4AF37' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Notes" 
                      secondary={bookingDetails.notes} 
                    />
                  </ListItem>
                )}
              </List>
            </>
          )}
          
          <StyledButton
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
          >
            Return to Home
          </StyledButton>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default BookingConfirmationPage; 