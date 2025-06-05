import React, { useState } from "react";
import Cookies from "js-cookie";
import { Container, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import api from "../api/client";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
}));

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.register(formData);
      const { token, user } = response.data;

      // Store token and user data
      // localStorage.setItem('authToken', token);
      Cookies.set("token", token, {
        expires: 7, // Expiration time in days
        secure: true, // Ensures cookie is only sent over HTTPS
        sameSite: "strict", // Helps prevent CSRF attacks
      });
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "stylist") {
        navigate("/stylist/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <RegisterForm onSubmit={handleSubmit} loading={loading} error={error} />
      </Box>
    </StyledContainer>
  );
};

export default RegisterPage;
