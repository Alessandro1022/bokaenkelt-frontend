import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import NearbyStylists from '../components/NearbyStylists';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)',
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

const NearbyStylistsPage = () => {
  return (
    <StyledContainer>
      <StyledTypography variant="h4" component="h1">
        Find Your Perfect Stylist
      </StyledTypography>
      <NearbyStylists />
    </StyledContainer>
  );
};

export default NearbyStylistsPage; 