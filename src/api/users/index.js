import api from "../client";
import Cookies from "js-cookie";

export const loginUser = async (userData) => {
  const response = await api.post("/api/stylists/login", userData);
  if (response.status === 200) {
    const _token = response.data.token;
    const _user = response.data.user;

    // localStorage.setItem('token', _token);
    Cookies.set("token", _token, {
      expires: 7, // Expiration time in days
      secure: true, // Ensures cookie is only sent over HTTPS
      sameSite: "strict", // Helps prevent CSRF attacks
    });
    localStorage.setItem("user", JSON.stringify(_user));
    return response;
  }
};

export const loginSuperAdmin = async (userData) => {
  const response = await api.post("/api/superadmin/login", userData);
  if (response.status === 200) {
    const _token = response.data.token;
    const _user = response.data.user;

    // localStorage.setItem("token", _token);
    Cookies.set("token", _token, {
      expires: 7, // Expiration time in days
      secure: true, // Ensures cookie is only sent over HTTPS
      sameSite: "strict", // Helps prevent CSRF attacks
    });
    localStorage.setItem("user", JSON.stringify(_user));
    return response;
  }
};
