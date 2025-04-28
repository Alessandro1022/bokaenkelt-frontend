import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)',
  border: '1px solid #D4AF37',
  borderRadius: 16,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(212, 175, 55, 0.2)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Playfair Display, serif',
  color: '#2C2C2C',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(212, 175, 55, 0.1)',
  color: '#D4AF37',
  border: '1px solid #D4AF37',
  '&:hover': {
    background: 'rgba(212, 175, 55, 0.2)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)',
  boxShadow: '0 3px 5px 2px rgba(212, 175, 55, .3)',
  color: '#FFFFFF',
  marginTop: 'auto',
  '&:hover': {
    background: 'linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)',
  },
}));

const StylistCard = ({ id, name, image, rating, reviews, specialties, experience }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const navigate = useNavigate();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleViewProfile = () => {
    navigate(`/stylist/${id}`);
  };

  return (
    <StyledCard>
      <StyledCardMedia
        image={image || 'https://source.unsplash.com/random/400x300?portrait'}
        alt={name}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <StyledTypography variant="h6" sx={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            {name}
          </StyledTypography>
          <IconButton
            onClick={handleFavoriteClick}
            sx={{ color: '#FFFFFF' }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </StyledCardMedia>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={rating} precision={0.1} readOnly sx={{ color: '#D4AF37' }} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({reviews} reviews)
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Experience: {experience}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {specialties && specialties.map((specialty, index) => (
            <StyledChip
              key={index}
              label={specialty}
              size="small"
            />
          ))}
        </Box>
        
        <StyledButton
          variant="contained"
          fullWidth
          onClick={handleViewProfile}
        >
          View Profile
        </StyledButton>
      </CardContent>
    </StyledCard>
  );
};

export default StylistCard; 