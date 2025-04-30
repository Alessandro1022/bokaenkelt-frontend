import api from "../client";


export const createBookings = async (bookingData) => {
    try {
        const response = await api.post("/api/bookings", bookingData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const createGuestBookings = async (bookingData) => {
    try {
        const response = await api.post("/api/bookings/guest", bookingData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const fetchBookings = async () => {
    try {
        const response = await api.get("/api/bookings");
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const fetchStylistBookings = async () => {
    try {
        const response = await api.get("/api/bookings/stylist");
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const updateBookings = async (bookingData) => {
    try {
        const _id = bookingData.id || bookingData._id;
        const response = await api.put(`/api/bookings/${_id}`, bookingData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const deleteBookings = async (bookingId) => {
    try {
        const response = await api.delete(`/api/bookings/${bookingId}`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const getBookedTimeSlots = async (data) => {
    try {
        const response = await api.post(`/api/bookings/bookedSlots`, data);
        return response;
    } catch (error) {
        console.log(error);
    }
}