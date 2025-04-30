import api from "../client";

export const getStylistDetails = async (stylistId) => {
    try {
        const response = await api.get(`/api/stylists/${stylistId}`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

