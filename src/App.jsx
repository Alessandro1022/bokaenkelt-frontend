import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CookieConsent from "react-cookie-consent";

// Pages
import Home from "./pages/Home";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import StylistLogin from "./pages/StylistLogin";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import StylistDashboard from "./pages/StylistDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import StylistGrid from "./pages/StylistGrid";
import StylistDetailPage from "./pages/StylistDetailPage";
import NotFound from "./pages/NotFound";
import AccountPage from "./pages/AccountPage";
import KontaktPage from "./pages/KontaktPage";
import IntegritetpolicyPage from "./pages/IntegritetpolicyPage";

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
        { path: "customer/login", element: <CustomerLogin /> },
        { path: "stylist/login", element: <StylistLogin /> },
        { path: "superadmin/login", element: <SuperAdminLogin /> },
        {
          path: "customer/dashboard",
          element: (
            <PrivateRoute>
              <CustomerDashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "stylist/dashboard",
          element: (
            <PrivateRoute>
              <StylistDashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "superadmin/dashboard",
          element: (
            <PrivateRoute>
              <SuperAdminDashboard />
            </PrivateRoute>
          ),
        },
        { path: "stylists", element: <StylistGrid /> },
        { path: "stylist/:stylistId", element: <StylistDetailPage /> },
        { path: "book/:stylistId", element: <BookingForm /> },
        { path: "account", element: <AccountPage /> },
        { path: "kontakt", element: <KontaktPage /> },
        { path: "integritetpolicy", element: <IntegritetpolicyPage /> },
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
    <>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale="sv">
          <CssBaseline />
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
      <CookieConsent
        location="bottom"
        buttonText="Accept All"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="cookieConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        declineButtonStyle={{ fontSize: "13px" }}
        expires={7}
      >
        This website uses cookies to enhance the user experience.{" "}
        <span style={{ color: "#f1d600" }}>Learn more</span>
        {/* <a href="/privacy-policy" style={{ color: "#f1d600" }}>
          Learn more
        </a> */}
      </CookieConsent>
    </>
  );
}

export default App;
