import { google } from 'googleapis';

// Initialize the Google Calendar API
const calendar = google.calendar('v3');

// Function to create a calendar event
export const createCalendarEvent = async (booking, accessToken) => {
  try {
    const event = {
      summary: `Hair Appointment - ${booking.service}`,
      description: `Customer: ${booking.customerName}\nPhone: ${booking.customerPhone}\nEmail: ${booking.customerEmail}\nNotes: ${booking.notes}`,
      start: {
        dateTime: `${booking.date}T${booking.time}:00`,
        timeZone: 'Europe/Stockholm',
      },
      end: {
        dateTime: `${booking.date}T${booking.time}:00`,
        timeZone: 'Europe/Stockholm',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({
      auth: accessToken,
      calendarId: 'primary',
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

// Function to check if user is authenticated with Google
export const isGoogleAuthenticated = () => {
  return localStorage.getItem('googleAccessToken') !== null;
};

// Function to save Google access token
export const saveGoogleToken = (token) => {
  localStorage.setItem('googleAccessToken', token);
};

// Function to remove Google access token
export const removeGoogleToken = () => {
  localStorage.removeItem('googleAccessToken');
}; 