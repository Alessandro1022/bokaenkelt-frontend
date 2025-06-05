import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";
import { loginSuperAdmin, loginUser } from "../api/users";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
  border: "1px solid #D4AF37",
  borderRadius: 16,
  boxShadow: "0 4px 8px rgba(212, 175, 55, 0.15)",
  maxWidth: 500,
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Playfair Display, serif",
  color: "#D4AF37",
  marginBottom: theme.spacing(3),
  textAlign: "center",
  fontSize: "2rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)",
  boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
  color: "#FFFFFF",
  padding: "12px 24px",
  width: "100%",
  marginTop: theme.spacing(2),
  fontSize: "1rem",
  [theme.breakpoints.down("sm")]: {
    padding: "10px 20px",
    fontSize: "0.9rem",
  },
  "&:hover": {
    background: "linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)",
  },
}));

const SuperAdminogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginSuperAdmin(formData);

      if (res.data.token.length > 0 && res.data.user.id.length > 0) {
        Cookies.set("token", res.data.token, {
          expires: 7, // Expiration time in days
          secure: true, // Ensures cookie is only sent over HTTPS
          sameSite: "strict", // Helps prevent CSRF attacks
        });
        await login({
          email: res.data.user.email,
          role: res.data.user.role,
          name: res.data.user.name,
          id: res.data.user.id,
        });
        navigate("/superadmin/dashboard");
      } else {
        throw new Error("Felaktig e-post eller lösenord");
      }
    } catch (err) {
      console.error(error);
      setError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: { xs: 6, sm: 8 } }}>
        <StyledPaper>
          <StyledTypography variant="h4">Super Admin Login</StyledTypography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-post"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              size="medium"
            />
            <TextField
              fullWidth
              label="Lösenord"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              size="medium"
            />
            <StyledButton type="submit" variant="contained" disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Logga in"
              )}
            </StyledButton>
          </form>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default SuperAdminogin;
