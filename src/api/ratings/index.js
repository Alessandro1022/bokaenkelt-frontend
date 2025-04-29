import api from "../client";


export const createRatings = async (ratingData) => {
    try {
        const response = await api.post("/api/ratings", ratingData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const createGuestRating = async (ratingData) => {
    try {
        const response = await api.post("/api/ratings/guest", ratingData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const getStylistRatings = async (stylistId) => {
    try {
        const response = await api.get(`/api/ratings/stylist/${stylistId}`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

