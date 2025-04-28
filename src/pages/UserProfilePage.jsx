import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

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

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+46 70 123 45 67',
    avatar: 'https://source.unsplash.com/random/150x150?portrait',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically make an API call to update the profile
    console.log('Saving profile:', profile);
  };

  const handleChange = (field) => (event) => {
    setProfile({
      ...profile,
      [field]: event.target.value,
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <StyledPaper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <StyledTypography variant="h3" component="h1">
              My Profile
            </StyledTypography>
            {!isEditing ? (
              <StyledButton
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Edit Profile
              </StyledButton>
            ) : (
              <StyledButton
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save Changes
              </StyledButton>
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={profile.avatar}
                  sx={{
                    width: 150,
                    height: 150,
                    margin: '0 auto',
                    border: '4px solid #D4AF37',
                  }}
                />
                {isEditing && (
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, color: '#D4AF37', borderColor: '#D4AF37' }}
                  >
                    Change Photo
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon sx={{ color: '#D4AF37' }} />
                  </ListItemIcon>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={profile.name}
                      onChange={handleChange('name')}
                      variant="outlined"
                    />
                  ) : (
                    <ListItemText primary="Name" secondary={profile.name} />
                  )}
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <EmailIcon sx={{ color: '#D4AF37' }} />
                  </ListItemIcon>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={profile.email}
                      onChange={handleChange('email')}
                      variant="outlined"
                    />
                  ) : (
                    <ListItemText primary="Email" secondary={profile.email} />
                  )}
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon sx={{ color: '#D4AF37' }} />
                  </ListItemIcon>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={profile.phone}
                      onChange={handleChange('phone')}
                      variant="outlined"
                    />
                  ) : (
                    <ListItemText primary="Phone" secondary={profile.phone} />
                  )}
                </ListItem>
              </List>

              <Divider sx={{ my: 4 }} />

              <StyledTypography variant="h4" component="h2">
                Recent Bookings
              </StyledTypography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon sx={{ color: '#D4AF37' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Haircut & Styling"
                    secondary="March 25, 2024 at 14:00"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon sx={{ color: '#D4AF37' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Hair Coloring"
                    secondary="March 18, 2024 at 10:00"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default UserProfilePage; 