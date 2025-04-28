import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '600px',
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  border: '1px solid #D4AF37',
  boxShadow: '0 4px 8px rgba(212, 175, 55, 0.15)',
}));

const StylistMap = ({ stylists, userLocation, onStylistSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.addEventListener('load', () => {
      // Initialize map
      const mapOptions = {
        center: userLocation || { lat: 34.0736, lng: -118.4000 }, // Default to Beverly Hills
        zoom: 12,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#D4AF37' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#FDF6E3' }],
          },
        ],
      };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add markers for stylists
      stylists.forEach((stylist) => {
        const marker = new window.google.maps.Marker({
          position: stylist.coordinates,
          map: mapInstanceRef.current,
          title: stylist.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/gold-dot.png',
          },
        });

        // Add click listener
        marker.addListener('click', () => {
          onStylistSelect(stylist);
          mapInstanceRef.current.setCenter(stylist.coordinates);
          mapInstanceRef.current.setZoom(15);
        });

        markersRef.current.push(marker);
      });

      // Add user location marker if available
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: userLocation,
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          },
        });
        markersRef.current.push(userMarker);
      }
    });

    return () => {
      // Cleanup
      document.head.removeChild(script);
      markersRef.current.forEach((marker) => marker.setMap(null));
    };
  }, [stylists, userLocation]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontFamily: 'Playfair Display, serif',
          color: '#D4AF37',
          mb: 2,
        }}
      >
        Stylist Locations
      </Typography>
      <StyledPaper>
        <Box ref={mapRef} sx={{ height: '100%', width: '100%' }} />
      </StyledPaper>
    </Box>
  );
};

export default StylistMap; 