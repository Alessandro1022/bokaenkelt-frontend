import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#D4AF37',
    },
    '&:hover fieldset': {
      borderColor: '#B38B2D',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#D4AF37',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#D4AF37',
    '&.Mui-focused': {
      color: '#D4AF37',
    },
  },
}));

const StylistBookingManager = ({ stylist, onUpdateBookingStatus }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setEditDialogOpen(true);
  };

  const handleStatusChange = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setStatusDialogOpen(true);
  };

  const handleConfirmStatusChange = () => {
    onUpdateBookingStatus(selectedBooking.id, newStatus);
    setStatusDialogOpen(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <StyledPaper elevation={3}>
        <StyledTypography variant="h4" component="h1">
          My Appointments
        </StyledTypography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <List>
              {stylist.bookings.map((booking) => (
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
                      <Avatar src={booking.customer.profileImage}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontFamily: 'Playfair Display, serif' }}>
                            {booking.service}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachMoneyIcon sx={{ color: '#D4AF37' }} />
                            <Typography variant="body1" sx={{ color: '#D4AF37' }}>
                              {booking.price}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            {booking.customer.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            {booking.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            {booking.time} ({booking.duration} minutes)
                          </Typography>
                          <Chip
                            icon={getStatusIcon(booking.status)}
                            label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            color={getStatusColor(booking.status)}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Booking">
                        <IconButton
                          onClick={() => handleEditBooking(booking)}
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
                      <Tooltip title="Update Status">
                        <IconButton
                          onClick={() => handleStatusChange(booking)}
                          sx={{
                            color: '#D4AF37',
                            '&:hover': {
                              backgroundColor: 'rgba(212, 175, 55, 0.1)',
                            },
                          }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </StyledPaper>

      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: '1px solid #D4AF37',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>
          Update Booking Status
        </DialogTitle>
        <DialogContent>
          <StyledTextField
            select
            fullWidth
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </StyledTextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <StyledButton onClick={handleConfirmStatusChange}>
            Update Status
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StylistBookingManager; 