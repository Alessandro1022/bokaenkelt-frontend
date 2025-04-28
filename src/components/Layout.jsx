import React, { useContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "transparent",
  boxShadow: "none",
  borderBottom: "1px solid #D4AF37",
}));

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  padding: "0 16px",
});

const NavButton = styled(Button)(({ theme }) => ({
  color: "#D4AF37",
  margin: "0 8px",
  "&:hover": {
    color: "#B38B2D",
    backgroundColor: "transparent",
  },
}));

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <StyledAppBar position="static">
        <StyledToolbar>
          <NavButton onClick={() => navigate("/")}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              BokaEnkelt
            </Typography>
          </NavButton>
          <Box>
            <NavButton onClick={() => navigate("/stylists")}>
              Boka tid
            </NavButton>
            {user ? (
              <>
                {user.role === "admin" ? (
                  <NavButton onClick={() => navigate("/admin/dashboard")}>
                    Admin
                  </NavButton>
                ) : (
                  <NavButton onClick={() => navigate("/customer/dashboard")}>
                    Min Profil
                  </NavButton>
                )}
                <NavButton onClick={handleLogout}>Logga ut</NavButton>
              </>
            ) : (
              <>
                <NavButton onClick={() => navigate("/customer/login")}>
                  Kund Login
                </NavButton>
                <NavButton onClick={() => navigate("/admin/login")}>
                  Admin Login
                </NavButton>
              </>
            )}
          </Box>
        </StyledToolbar>
      </StyledAppBar>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
