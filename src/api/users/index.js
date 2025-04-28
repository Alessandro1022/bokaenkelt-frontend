import api from "../client";


export const loginUser = async (userData) => {
    try {
        const response = await api.post("/api/users/login", userData);
        if (response.status === 200) {
            const _token = response.data.token
            const _user = response.data.user;
            localStorage.setItem('token', _token);
            localStorage.setItem('user', _user);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}