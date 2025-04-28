import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

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

const UserProfile = ({ user, onEditProfile, onEditBooking }) => {
  const {
    name,
    email,
    phone,
    address,
    profileImage,
    bookings = [],
  } = user;

  return (
    <Box>
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <StyledTypography variant="h4" component="h1">
            My Profile
          </StyledTypography>
          <Tooltip title="Edit Profile">
            <IconButton
              onClick={onEditProfile}
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
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                src={profileImage}
                sx={{
                  width: 150,
                  height: 150,
                  margin: '0 auto',
                  border: '4px solid #D4AF37',
                  boxShadow: '0 4px 8px rgba(212, 175, 55, 0.2)',
                }}
              />
            </Box>
            <InfoBox>
              <PersonIcon />
              <Typography variant="body1">
                <strong>Name:</strong> {name}
              </Typography>
            </InfoBox>
            <InfoBox>
              <EmailIcon />
              <Typography variant="body1">
                <strong>Email:</strong> {email}
              </Typography>
            </InfoBox>
            <InfoBox>
              <PhoneIcon />
              <Typography variant="body1">
                <strong>Phone:</strong> {phone}
              </Typography>
            </InfoBox>
            <InfoBox>
              <LocationOnIcon />
              <Typography variant="body1">
                <strong>Address:</strong> {address}
              </Typography>
            </InfoBox>
          </Grid>

          <Grid item xs={12} md={8}>
            <StyledTypography variant="h5" component="h2">
              My Bookings
            </StyledTypography>
            <List>
              {bookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <ListItem
                    sx={{
                      background: 'rgba(212, 175, 55, 0.05)',
                      borderRadius: 2,
                      mb: 2,
                      '&:hover': {
                        background: 'rgba(212, 175, 55, 0.1)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={booking.stylist.profileImage}>
                        <CalendarTodayIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontFamily: 'Playfair Display, serif' }}>
                            {booking.service}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${booking.price}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            {booking.stylist.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            {booking.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            {booking.time} ({booking.duration} minutes)
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: booking.status === 'confirmed' ? 'success.main' : 'warning.main',
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: booking.status === 'confirmed' ? '#4caf50' : '#ff9800',
                              marginRight: 8 
                            }} />
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Tooltip title="Edit Booking">
                      <IconButton
                        onClick={() => onEditBooking(booking.id)}
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
                  </ListItem>
                  <Divider sx={{ my: 2 }} />
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default UserProfile; 