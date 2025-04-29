import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  background: "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
  border: "1px solid #D4AF37",
  borderRadius: 16,
  boxShadow: "0 4px 8px rgba(212, 175, 55, 0.15)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)",
  boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
  color: "#FFFFFF",
  padding: "10px 24px",
  "&:hover": {
    background: "linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "8px 16px",
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: "#D4AF37",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
}));

const AccountPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Validera telefonnummer
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setError("Vänligen ange ett giltigt telefonnummer (10 siffror)");
      return;
    }

    // Hämta användare från localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("Inget konto hittades med detta telefonnummer");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.phone !== formData.phone) {
      setError("Fel telefonnummer");
      return;
    }

    login(user);
    navigate("/booking");
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();

    // Validera telefonnummer
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setError("Vänligen ange ett giltigt telefonnummer (10 siffror)");
      return;
    }

    if (!formData.name.trim()) {
      setError("Vänligen ange ditt namn");
      return;
    }

    // Kontrollera om telefonnummer redan finns
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const existingUser = JSON.parse(storedUser);
      if (existingUser.phone === formData.phone) {
        setError("Detta telefonnummer är redan registrerat");
        return;
      }
    }

    // Spara användarinformation
    const userData = {
      name: formData.name,
      phone: formData.phone,
      id: Date.now().toString(),
    };

    localStorage.setItem("user", JSON.stringify(userData));
    login(userData);
    setSuccess("Konto skapat! Du omdirigeras nu...");
    setTimeout(() => navigate("/booking"), 1500);
  };

  const handleForgotPassword = () => {
    // Enkel återställning baserad på telefonnummer
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setError("Vänligen ange ett giltigt telefonnummer (10 siffror)");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("Inget konto hittades med detta telefonnummer");
      return;
    }

    setSuccess("Ett nytt lösenord har skickats till ditt telefonnummer");
  };

  return (
    <Container maxWidth="sm" sx={{ padding: 0 }}>
      <StyledPaper>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Logga in" />
          <Tab label="Skapa konto" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {activeTab === 0 ? (
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Telefonnummer"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0701234567"
              sx={{ mb: 2 }}
            />

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 3 }}
            >
              Logga in
            </StyledButton>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ fontWeight: 500 }}
              >
                Inga konto?
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <StyledButton
                  variant="contained"
                  fullWidth
                  onClick={() => setActiveTab(1)}
                  sx={{
                    background:
                      "linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)",
                    },
                  }}
                >
                  Skapa konto
                </StyledButton>

                <Typography variant="body2" color="text.secondary">
                  eller
                </Typography>

                <StyledButton
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/booking")}
                  sx={{
                    borderColor: "#D4AF37",
                    color: "#D4AF37",
                    "&:hover": {
                      borderColor: "#B38B2D",
                      backgroundColor: "rgba(212, 175, 55, 0.04)",
                    },
                  }}
                >
                  Boka som gäst
                </StyledButton>
              </Box>

              <Divider sx={{ my: 1 }} />

              <StyledLink
                href="#"
                onClick={handleForgotPassword}
                sx={{
                  textAlign: "center",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Glömt telefonnummer?
              </StyledLink>
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleCreateAccount} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Namn"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Telefonnummer"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0701234567"
              sx={{ mb: 3 }}
            />

            <StyledButton type="submit" fullWidth variant="contained">
              Skapa Konto
            </StyledButton>
          </Box>
        )}
      </StyledPaper>
    </Container>
  );
};

export default AccountPage;
