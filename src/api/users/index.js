import api from "../client";


export const loginUser = async (userData) => {
    const response = await api.post("/api/stylists/login", userData);
    if (response.status === 200) {
        const _token = response.data.token
        const _user = response.data.user;

        localStorage.setItem('token', _token);
        localStorage.setItem('user', JSON.stringify(_user));
        return response;
    }

}

export const loginSuperAdmin = async (userData) => {
    try {
        const response = await api.post("/api/superadmin/login", userData);
        if (response.status === 200) {
            const _token = response.data.token
            const _user = response.data.user;

            localStorage.setItem('token', _token);
            localStorage.setItem('user', _user);
            return response;
        }
    } catch (error) {
        console.log(error);
    }
}