import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, TextField, InputAdornment, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import StylistCard from './StylistCard';

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
}));

const StylistGrid = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stylists');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.data && data.data.stylists) {
          setStylists(data.data.stylists);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching stylists:', error);
        setError('Failed to fetch stylists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, []);

  const filteredStylists = stylists.filter(stylist =>
    stylist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (stylist.specialties && stylist.specialties.some(specialty =>
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  return (
    <Box>
      <StyledTypography variant="h4" component="h2">
        Our Expert Stylists
      </StyledTypography>

      <Box sx={{ mb: 4 }}>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Search stylists by name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#D4AF37' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#D4AF37' }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : filteredStylists.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No stylists found matching your search criteria.
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {filteredStylists.map((stylist) => (
            <Grid item xs={12} sm={6} md={4} key={stylist._id || stylist.id}>
              <StylistCard
                id={stylist._id || stylist.id}
                name={stylist.name}
                image={stylist.profileImage || 'https://source.unsplash.com/random/400x300?portrait'}
                rating={stylist.rating || 0}
                reviews={stylist.reviews || 0}
                specialties={stylist.specialties || []}
                experience={stylist.experience || 'N/A'}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StylistGrid; 