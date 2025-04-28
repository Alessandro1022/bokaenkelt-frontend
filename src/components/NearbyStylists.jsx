import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import MapIcon from '@mui/icons-material/Map';
import DirectionsIcon from '@mui/icons-material/Directions';
import FilterListIcon from '@mui/icons-material/FilterList';
import StylistMap from './StylistMap';
import StylistCard from './StylistCard';
import api from '../api/client';

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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  border: '1px solid #D4AF37',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)',
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)',
  borderRadius: 16,
  border: '1px solid #D4AF37',
  boxShadow: '0 4px 8px rgba(212, 175, 55, 0.15)',
}));

const NearbyStylists = ({ userLocation, searchRadius = 10 }) => {
  const [stylists, setStylists] = useState([]);
  const [filteredStylists, setFilteredStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [filters, setFilters] = useState({
    minRating: 0,
    specialties: [],
    maxDistance: 20,
    availability: 'all',
  });

  useEffect(() => {
    const fetchNearbyStylists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!userLocation) {
          throw new Error('User location is required to find nearby stylists');
        }

        const response = await api.searchStylists({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: searchRadius,
        });

        setStylists(response.data.stylists);
      } catch (err) {
        console.error('Error fetching nearby stylists:', err);
        setError(err.response?.data?.message || 'Failed to fetch nearby stylists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userLocation) {
      fetchNearbyStylists();
    }
  }, [userLocation, searchRadius]);

  useEffect(() => {
    // Apply filters to stylists
    const filtered = stylists.filter((stylist) => {
      const ratingMatch = stylist.rating >= filters.minRating;
      const distanceMatch = stylist.distance <= filters.maxDistance;
      const specialtiesMatch =
        filters.specialties.length === 0 ||
        filters.specialties.every((specialty) =>
          stylist.specialties.includes(specialty)
        );
      const availabilityMatch =
        filters.availability === 'all' ||
        (filters.availability === 'now' && isStylistAvailableNow(stylist));

      return ratingMatch && distanceMatch && specialtiesMatch && availabilityMatch;
    });

    setFilteredStylists(filtered);
  }, [stylists, filters]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationDialogOpen(false);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleOpenDirections = (coordinates) => {
    const { lat, lng } = coordinates;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank'
    );
  };

  const isStylistAvailableNow = (stylist) => {
    const now = new Date();
    const day = now.getDay();
    const time = now.getHours() + ':' + now.getMinutes();
    const availability = stylist.availability;

    // Simple check - can be enhanced with more sophisticated logic
    return availability.includes(now.toLocaleDateString('en-US', { weekday: 'short' }));
  };

  const handleStylistSelect = (stylist) => {
    setSelectedStylist(stylist);
    // Scroll to the selected stylist's card
    const element = document.getElementById(`stylist-${stylist.id}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  if (loading) {
    return (
      <StyledBox>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress sx={{ color: '#D4AF37' }} />
        </Box>
      </StyledBox>
    );
  }

  if (error) {
    return (
      <StyledBox>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </StyledBox>
    );
  }

  if (!stylists.length) {
    return (
      <StyledBox>
        <Alert severity="info">
          No stylists found in your area. Try increasing the search radius.
        </Alert>
      </StyledBox>
    );
  }

  return (
    <Box>
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <StyledTypography variant="h4" component="h1">
            Find Nearby Stylists
          </StyledTypography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledButton
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDialogOpen(true)}
            >
              Filters
            </StyledButton>
            <StyledButton
              startIcon={<LocationOnIcon />}
              onClick={() => setLocationDialogOpen(true)}
            >
              Set Location
            </StyledButton>
          </Box>
        </Box>

        <StylistMap
          stylists={filteredStylists}
          userLocation={userLocation}
          onStylistSelect={handleStylistSelect}
        />

        <Grid container spacing={3}>
          {filteredStylists.map((stylist) => (
            <Grid item xs={12} md={6} lg={4} key={stylist.id}>
              <StyledCard
                id={`stylist-${stylist.id}`}
                sx={{
                  border: selectedStylist?.id === stylist.id ? '2px solid #D4AF37' : undefined,
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={stylist.profileImage}
                  alt={stylist.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Playfair Display, serif' }}>
                    {stylist.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StarIcon sx={{ color: '#D4AF37', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {stylist.rating} ({stylist.experience} experience)
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    {stylist.specialties.map((specialty) => (
                      <Chip
                        key={specialty}
                        label={specialty}
                        size="small"
                        sx={{ mr: 1, mb: 1, borderColor: '#D4AF37', color: '#D4AF37' }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {stylist.distance} km away
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {stylist.availability}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <StyledButton
                      variant="outlined"
                      startIcon={<DirectionsIcon />}
                      onClick={() => handleOpenDirections(stylist.coordinates)}
                      sx={{
                        background: 'transparent',
                        color: '#D4AF37',
                        border: '1px solid #D4AF37',
                        '&:hover': {
                          background: 'rgba(212, 175, 55, 0.1)',
                        },
                      }}
                    >
                      Get Directions
                    </StyledButton>
                    <StyledButton
                      variant="outlined"
                      startIcon={<PhoneIcon />}
                      href={`tel:${stylist.phone}`}
                      sx={{
                        background: 'transparent',
                        color: '#D4AF37',
                        border: '1px solid #D4AF37',
                        '&:hover': {
                          background: 'rgba(212, 175, 55, 0.1)',
                        },
                      }}
                    >
                      Call
                    </StyledButton>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </StyledPaper>

      <Dialog
        open={locationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: '1px solid #D4AF37',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>
          Set Your Location
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Allow us to access your location to find stylists near you.
            </Typography>
            <TextField
              fullWidth
              label="Search Radius (km)"
              type="number"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationDialogOpen(false)}>Cancel</Button>
          <StyledButton onClick={handleGetLocation}>
            Use My Location
          </StyledButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: '1px solid #D4AF37',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>
          Filter Stylists
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Minimum Rating</InputLabel>
              <Select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                label="Minimum Rating"
              >
                <MenuItem value={0}>Any Rating</MenuItem>
                <MenuItem value={4}>4+ Stars</MenuItem>
                <MenuItem value={4.5}>4.5+ Stars</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Specialties</InputLabel>
              <Select
                multiple
                value={filters.specialties}
                onChange={(e) => handleFilterChange('specialties', e.target.value)}
                label="Specialties"
              >
                <MenuItem value="Haircut">Haircut</MenuItem>
                <MenuItem value="Coloring">Coloring</MenuItem>
                <MenuItem value="Styling">Styling</MenuItem>
                <MenuItem value="Extensions">Extensions</MenuItem>
                <MenuItem value="Treatment">Treatment</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography gutterBottom>Maximum Distance (km)</Typography>
              <Slider
                value={filters.maxDistance}
                onChange={(_, value) => handleFilterChange('maxDistance', value)}
                min={1}
                max={50}
                step={1}
                valueLabelDisplay="auto"
                sx={{ color: '#D4AF37' }}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Availability</InputLabel>
              <Select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                label="Availability"
              >
                <MenuItem value="all">All Times</MenuItem>
                <MenuItem value="now">Available Now</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <StyledButton onClick={() => setFilterDialogOpen(false)}>
            Apply Filters
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NearbyStylists; 