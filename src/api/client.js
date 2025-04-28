import axios from 'axios';
import { API_BASE_URL } from '../lib/constants';

// Mock data for testing
const mockStylists = {
  '1': {
    id: '1',
    name: 'Woolley Cutzzz',
    specialty: 'Herrklippning & Skäggvård',
    experience: 5,
    image: '/images/stylist1.jpg',
    rating: 4.9,
    specialties: ['Herrklippning', 'Skäggvård'],
    bio: 'Professionell frisör med fokus på herrklippning och skäggvård. Erbjuder en avslappnad och professionell upplevelse i Kristinedal träningcenter.',
    availability: {
      days: ['onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'],
      hours: {
        start: '11:00',
        end: '23:00'
      }
    },
    services: [
      {
        id: '1',
        name: 'Herrklippning',
        price: 150,
        duration: '30 min',
        description: 'Professionell herrklippning med modern finish'
      },
      {
        id: '2',
        name: 'Herrklippning med skägg',
        price: 200,
        duration: '45 min',
        description: 'Herrklippning inklusive skäggtrimning och styling'
      }
    ],
    location: 'Kristinedal träningcenter'
  }
};

// Mock data for fallbacks
const mockData = {
  stylists: [
    {
      _id: '1',
      name: 'Woolley Cutzzz',
      email: 'woolley@cutzzz.com',
      phone: '+46 70 123 45 67',
      specialties: ['Herrklippning', 'Skäggvård'],
      bio: 'Professionell frisör med fokus på herrklippning och skäggvård. Erbjuder en avslappnad och professionell upplevelse i Kristinedal träningcenter.',
      experience: 5,
      rating: 4.9,
      isActive: true,
      imageUrl: '/images/stylist1.jpg',
      availability: {
        days: ['onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'],
        hours: {
          start: '11:00',
          end: '23:00'
        }
      },
      services: [
        {
          id: '1',
          name: 'Herrklippning',
          price: 150,
          duration: '30 min',
          description: 'Professionell herrklippning med modern finish'
        },
        {
          id: '2',
          name: 'Herrklippning med skägg',
          price: 200,
          duration: '45 min',
          description: 'Herrklippning inklusive skäggtrimning och styling'
        }
      ],
      location: 'Kristinedal träningcenter'
    }
  ],
  profile: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+46 70 123 45 67',
    address: 'Götaplatsen 1, 41134 Göteborg',
    bookings: []
  }
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // No response from server (network error)
    if (!error.response && error.request) {
      console.warn('Network error or server not responding, using mock data fallback');

      // Extract the path from the URL
      const path = error.config.url;

      // Return mock data for known endpoints
      if (path.includes('/api/stylists') && !path.includes('/api/stylists/')) {
        return Promise.resolve({ data: mockData.stylists });
      }

      if (path.includes('/api/auth/me') || path.includes('/api/users/profile')) {
        return Promise.resolve({ data: mockData.profile });
      }

      if (path.includes('/api/stylists/') && path.split('/').length > 3) {
        const id = path.split('/').pop();
        const stylist = mockData.stylists.find(s => s._id === id);
        if (stylist) {
          return Promise.resolve({ data: stylist });
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api; 