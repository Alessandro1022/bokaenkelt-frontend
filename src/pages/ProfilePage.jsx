import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';

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

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: 'Test User',
    email: 'test@example.com',
    phone: 'Not provided',
    address: 'Not provided'
  });

  useEffect(() => {
    // Hämta bokningar från localStorage
    const storedBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
    setBookings(storedBookings);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Bekräftad';
      case 'pending':
        return 'Väntar';
      case 'cancelled':
        return 'Avbokad';
      default:
        return status;
    }
  };

  const upcomingBookings = bookings.filter(booking => 
    isAfter(new Date(booking.date), new Date())
  );

  const pastBookings = bookings.filter(booking => 
    isBefore(new Date(booking.date), new Date())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profilinformation */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#D4AF37', mr: 2 }}>
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography variant="h5">{userInfo.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Kund sedan {format(new Date(), 'MMMM yyyy')}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#D4AF37' }}>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="E-post" secondary={userInfo.email} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#D4AF37' }}>
                    <PhoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Telefon" secondary={userInfo.phone} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#D4AF37' }}>
                    <LocationOnIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Adress" secondary={userInfo.address} />
              </ListItem>
            </List>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <StyledButton
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate('/edit-profile')}
              >
                Redigera profil
              </StyledButton>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Bokningar */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Kommande bokningar" />
                <Tab label="Tidigare bokningar" />
              </Tabs>
            </Box>

            {activeTab === 0 ? (
              <List>
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <Card key={booking.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <EventIcon sx={{ mr: 1, color: '#D4AF37' }} />
                              <Typography>
                                {format(new Date(booking.date), 'EEEE d MMMM yyyy')}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTimeIcon sx={{ mr: 1, color: '#D4AF37' }} />
                              <Typography>{booking.time}</Typography>
                            </Box>
                            <Typography variant="h6">{booking.service}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                            <Chip
                              label={getStatusLabel(booking.status)}
                              color={getStatusColor(booking.status)}
                              sx={{ mb: 1 }}
                            />
                            <Box>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={() => navigate(`/booking/${booking.id}`)}
                              >
                                Visa detaljer
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => {/* Hantera avbokning */}}
                              >
                                Avboka
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    Inga kommande bokningar
                  </Typography>
                )}
              </List>
            ) : (
              <List>
                {pastBookings.length > 0 ? (
                  pastBookings.map((booking) => (
                    <Card key={booking.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <EventIcon sx={{ mr: 1, color: '#D4AF37' }} />
                              <Typography>
                                {format(new Date(booking.date), 'EEEE d MMMM yyyy')}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTimeIcon sx={{ mr: 1, color: '#D4AF37' }} />
                              <Typography>{booking.time}</Typography>
                            </Box>
                            <Typography variant="h6">{booking.service}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                            <Chip
                              label={getStatusLabel(booking.status)}
                              color={getStatusColor(booking.status)}
                              sx={{ mb: 1 }}
                            />
                            <Box>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate(`/booking/${booking.id}`)}
                              >
                                Visa detaljer
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    Inga tidigare bokningar
                  </Typography>
                )}
              </List>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage; 