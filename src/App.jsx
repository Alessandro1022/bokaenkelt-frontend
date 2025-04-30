import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import StylistGrid from "./pages/StylistGrid";
import StylistDetailPage from "./pages/StylistDetailPage";
import NotFound from "./pages/NotFound";
import AccountPage from "./pages/AccountPage";

// Components
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D4AF37", // Gold color
    },
    secondary: {
      main: "#B38B2D", // Darker gold
    },
  },
  typography: {
    fontFamily: '"Playfair Display", serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
    },
  },
});

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "booking", element: <BookingForm /> },
        { path: "booking-confirmation", element: <BookingConfirmation /> },
        { path: "admin/login", element: <AdminLogin /> },
        { path: "customer/login", element: <CustomerLogin /> },
        {
          path: "admin/dashboard",
          element: (
            <PrivateRoute requireAdmin>
              <AdminDashboard />
            </PrivateRoute>
          ),
        },
        { path: "customer/dashboard", element: <CustomerDashboard /> },
        { path: "stylists", element: <StylistGrid /> },
        { path: "stylist/:stylistId", element: <StylistDetailPage /> },
        { path: "book/:stylistId", element: <BookingForm /> },
        { path: "account", element: <AccountPage /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale="sv">
        <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
