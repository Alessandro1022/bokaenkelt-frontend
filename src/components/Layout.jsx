import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "transparent",
  boxShadow: "none",
  borderBottom: "1px solid #D4AF37",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "0 16px",
}));

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
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { text: "Hem", path: "/" },
    ...(user?.role === "superadmin" || user?.role === "stylist"
      ? []
      : [{ text: "Boka tid", path: "/stylists" }]),
    ...(user
      ? user.role === "stylist"
        ? [{ text: "Min Profil", path: "/stylist/dashboard" }]
        : user.role === "superadmin"
        ? [{ text: "Min Profil", path: "/superadmin/dashboard" }]
        : [{ text: "Min Profil", path: "/stylist/dashboard" }]
      : [
          { text: "Kund Login", path: "/customer/login" },
          { text: "Admin Login", path: "/stylist/login" },
        ]),
    ...(user ? [{ text: "Logga ut", action: handleLogout }] : []),
    ...(user?.id ? [] : [{ text: "Kontakt/Om oss", path: "/kontakt" }]),
    ...(user?.id
      ? []
      : [{ text: "Integritetpolicy/GDPR", path: "/integritetpolicy" }]),
  ];

  const handleMenuClick = (item) => {
    setDrawerOpen(false);
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
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

          {/* {isMobile ? ( */}
          <>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: "#D4AF37" }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                height="100%"
                bgcolor="#fffefa"
              >
                <List>
                  {menuItems.map((item, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => handleMenuClick(item)}
                    >
                      <ListItemText
                        primary={item.text}
                        style={{ color: "#e2b937", cursor: "pointer" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
          {/* ) : (
            <Box>
              {menuItems.map((item, index) => (
                <NavButton
                  key={index}
                  onClick={() =>
                    item.path ? navigate(item.path) : item.action?.()
                  }
                >
                  {item.text}
                </NavButton>
              ))}
            </Box>
          )} */}
        </StyledToolbar>
      </StyledAppBar>

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
