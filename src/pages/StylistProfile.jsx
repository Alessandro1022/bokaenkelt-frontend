import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Rating,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import format from 'date-fns/format';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import NoteIcon from '@mui/icons-material/Note';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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
  marginBottom: theme.spacing(2),
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

const StyledChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(212, 175, 55, 0.1)',
  color: '#D4AF37',
  border: '1px solid #D4AF37',
  margin: theme.spacing(0.5),
  '&:hover': {
    background: 'rgba(212, 175, 55, 0.2)',
  },
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: 'rgba(212, 175, 55, 0.05)',
  border: '1px solid rgba(212, 175, 55, 0.1)',
  '&:hover': {
    background: 'rgba(212, 175, 55, 0.1)',
  }
}));

const TimeButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  minWidth: '100px',
  background: 'rgba(212, 175, 55, 0.1)',
  color: '#D4AF37',
  border: '1px solid #D4AF37',
  '&:hover': {
    background: 'rgba(212, 175, 55, 0.2)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
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

const StylistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stylist, setStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    author: '',
  });
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [activeStep, setActiveStep] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStylist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stylists/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.data && data.data.stylist) {
          setStylist(data.data.stylist);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching stylist:', error);
        setError('Failed to fetch stylist information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStylist();
  }, [id]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setAvailableTimes(getAvailableTimesForDate(date));
    setTimeDialogOpen(true);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeDialogOpen(false);
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = () => {
    // Here you would typically make an API call to save the booking
    console.log('Booking submitted:', {
      stylistId: stylist.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      ...bookingForm
    });
    
    // Show success message instead of navigating
    setBookingSuccess(true);
  };

  const handleCloseBookingDialog = () => {
    setBookingDialogOpen(false);
    setBookingSuccess(false);
    setActiveStep(0);
    setBookingForm({
      name: '',
      phone: '',
      email: '',
      notes: '',
    });
  };

  const handleReviewSubmit = () => {
    // Create a new review object
    const reviewToAdd = {
      id: reviews.length + 1,
      author: newReview.author || "Anonymous",
      rating: newReview.rating,
      comment: newReview.comment,
      date: format(new Date(), 'yyyy-MM-dd')
    };
    
    // Add the new review to the reviews array
    setReviews([...reviews, reviewToAdd]);
    
    // Close the dialog and reset the form
    setReviewDialogOpen(false);
    setNewReview({ rating: 5, comment: '', author: '' });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getAvailableTimesForDate = (date) => {
    return [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
      "16:00", "16:30"
    ];
  };

  const handleBookAppointment = () => {
    navigate(`/booking/${id}`);
  };

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
          <StyledButton onClick={() => navigate('/')}>
            Return to Home
          </StyledButton>
        </Box>
      </Container>
    );
  }

  if (!stylist) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="info" sx={{ mb: 4 }}>
            Stylist not found.
          </Alert>
          <StyledButton onClick={() => navigate('/')}>
            Return to Home
          </StyledButton>
        </Box>
      </Container>
    );
  }

  const steps = ['Select Date & Time', 'Your Information', 'Confirmation'];

  const getStepContent = (step) => {
    if (bookingSuccess) {
      return (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: '#D4AF37', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, color: '#D4AF37' }}>
            Booking Confirmed!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Thank you for choosing our salon. We look forward to seeing you!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'left' }}>
            <strong>Stylist:</strong> {stylist.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'left' }}>
            <strong>Date:</strong> {format(selectedDate, 'MMMM d, yyyy')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'left' }}>
            <strong>Time:</strong> {selectedTime}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'left' }}>
            <strong>Name:</strong> {bookingForm.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'left' }}>
            <strong>Phone:</strong> {bookingForm.phone}
          </Typography>
          {bookingForm.email && (
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'left' }}>
              <strong>Email:</strong> {bookingForm.email}
            </Typography>
          )}
          {bookingForm.notes && (
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'left' }}>
              <strong>Notes:</strong> {bookingForm.notes}
            </Typography>
          )}
        </Box>
      );
    }

    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#D4AF37' }}>
              Selected Date: {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Not selected'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, color: '#D4AF37' }}>
              Selected Time: {selectedTime || 'Not selected'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please confirm your appointment details before proceeding.
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box>
            <StyledTextField
              fullWidth
              label="Your Name"
              name="name"
              value={bookingForm.name}
              onChange={handleInputChange}
              required
            />
            <StyledTextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={bookingForm.phone}
              onChange={handleInputChange}
              required
            />
            <StyledTextField
              fullWidth
              label="Email (optional)"
              name="email"
              value={bookingForm.email}
              onChange={handleInputChange}
            />
            <StyledTextField
              fullWidth
              label="Additional Notes (optional)"
              name="notes"
              multiline
              rows={3}
              value={bookingForm.notes}
              onChange={handleInputChange}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#D4AF37' }}>
              Booking Summary
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WorkIcon sx={{ color: '#D4AF37' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Stylist" 
                  secondary={stylist.name} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EventIcon sx={{ color: '#D4AF37' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Date" 
                  secondary={format(selectedDate, 'MMMM d, yyyy')} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EventIcon sx={{ color: '#D4AF37' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Time" 
                  secondary={selectedTime} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon sx={{ color: '#D4AF37' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Name" 
                  secondary={bookingForm.name} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon sx={{ color: '#D4AF37' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone" 
                  secondary={bookingForm.phone} 
                />
              </ListItem>
              {bookingForm.email && (
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon sx={{ color: '#D4AF37' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={bookingForm.email} 
                  />
                </ListItem>
              )}
              {bookingForm.notes && (
                <ListItem>
                  <ListItemIcon>
                    <NoteIcon sx={{ color: '#D4AF37' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Notes" 
                    secondary={bookingForm.notes} 
                  />
                </ListItem>
              )}
            </List>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Please confirm your booking details. You will receive a confirmation email shortly.
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <StyledPaper>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={stylist.profileImage || 'https://source.unsplash.com/random/400x500?portrait'}
                alt={stylist.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <StyledTypography variant="h4" component="h1">
                  {stylist.name}
                </StyledTypography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={stylist.rating || 0} precision={0.1} readOnly sx={{ color: '#D4AF37' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({stylist.reviews || 0} reviews)
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" paragraph>
                  {stylist.description || 'Professional stylist with expertise in various hair treatments and styles.'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <StyledTypography variant="h6">
                  Specialties
                </StyledTypography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {stylist.specialties && stylist.specialties.map((specialty, index) => (
                    <StyledChip key={index} label={specialty} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <StyledTypography variant="h6">
                  Experience
                </StyledTypography>
                <Typography variant="body1">
                  {stylist.experience || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <StyledTypography variant="h6">
                  Availability
                </StyledTypography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {stylist.availability && stylist.availability.map((day, index) => (
                    <StyledChip key={index} label={day} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <StyledTypography variant="h6">
                  Contact Information
                </StyledTypography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ color: '#D4AF37', mr: 1 }} />
                    <Typography variant="body1">
                      {stylist.email || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ color: '#D4AF37', mr: 1 }} />
                    <Typography variant="body1">
                      {stylist.phone || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ color: '#D4AF37', mr: 1 }} />
                    <Typography variant="body1">
                      {stylist.address || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <StyledButton
                  variant="contained"
                  size="large"
                  startIcon={<CalendarMonthIcon />}
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>
      </Box>

      {/* Time Selection Dialog */}
      <Dialog open={timeDialogOpen} onClose={() => setTimeDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>
          Select Time for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {availableTimes.map((time) => (
              <TimeButton
                key={time}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </TimeButton>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimeDialogOpen(false)} sx={{ color: '#D4AF37' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog 
        open={bookingDialogOpen} 
        onClose={handleCloseBookingDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>
          {bookingSuccess ? 'Booking Confirmation' : `Book Appointment with ${stylist?.name}`}
        </DialogTitle>
        <DialogContent>
          {!bookingSuccess && (
            <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          {getStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          {bookingSuccess ? (
            <StyledButton onClick={handleCloseBookingDialog}>
              Close
            </StyledButton>
          ) : (
            <>
              <Button onClick={handleCloseBookingDialog} sx={{ color: '#D4AF37' }}>
                Cancel
              </Button>
              {activeStep > 0 && (
                <Button onClick={handleBack} sx={{ color: '#D4AF37' }}>
                  Back
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <StyledButton onClick={handleBookingSubmit}>
                  Confirm Booking
                </StyledButton>
              ) : (
                <StyledButton onClick={handleNext}>
                  Next
                </StyledButton>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>
          Write a Review
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Your Name"
              value={newReview.author}
              onChange={(e) => setNewReview(prev => ({ ...prev, author: e.target.value }))}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#D4AF37' },
                  '&:hover fieldset': { borderColor: '#B38B2D' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
                },
              }}
            />
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={newReview.rating}
                onChange={(event, newValue) => {
                  setNewReview(prev => ({ ...prev, rating: newValue }));
                }}
                sx={{ ml: 2, color: '#D4AF37' }}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#D4AF37' },
                  '&:hover fieldset': { borderColor: '#B38B2D' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)} sx={{ color: '#D4AF37' }}>
            Cancel
          </Button>
          <StyledButton onClick={handleReviewSubmit}>
            Submit Review
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StylistProfile; 