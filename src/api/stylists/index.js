import api from "../client";

export const getStylistDetails = async (stylistId) => {
    const response = await api.get(`/api/stylists/${stylistId}`);
    return response;
}

export const getAllStylist = async () => {
    const response = await api.get(`/api/superadmin/stylist/all`);
    return response;
}

export const createStylist = async (data) => {
    const response = await api.post(`/api/superadmin/stylist/add`, data);
    return response;
}

export const deleteStylist = async (id) => {
    const response = await api.delete(`/api/superadmin/stylist/delete/${id}`);
    return response;
}

export const uploadStylistCoverImage = async (imageFile) => {
    const response = await api.post(`/api/stylists/update/profile/coverimage`, imageFile, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const uploadStylistPhotos = async (imageFiles) => {
    const response = await api.post(`/api/stylists/update/profile/photos`, imageFiles, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const deletStylistImages = async (imageName) => {
    const response = await api.post(`/api/stylists/update/profile/images/delete/${imageName}`,);
    return response;
}

export const updateStylistProfile = async (data) => {
    const response = await api.post(`/api/stylists/update/profile`, data);
    return response;
}



