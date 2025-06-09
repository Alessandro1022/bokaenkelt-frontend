import { useEffect, useState } from "react";
import ReactCookieConsent from "react-cookie-consent";
import Cookie from "js-cookie";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [modal, setModal] = useState(false);

  //   EFFECTS
  useEffect(() => {
    const consent = Cookie.get("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  // FUNCTIONS
  const modalHandler = () => {
    setModal((prev) => !prev);
  };
  const handleAccept = () => {
    Cookie.set("cookieConsent", "true", { expires: 7 });
    setModal(false);
    setShowBanner(false);
  };
  const handleDecline = () => {
    Cookie.set("cookieConsent", "false", { expires: 7 });
    setModal(false);
    setShowBanner(false);
  };

  return (
    <>
      {showBanner && (
        <ReactCookieConsent
          location="bottom"
          buttonText="Accept All"
          declineButtonText="Decline"
          enableDeclineButton
          cookieName="cookieConsent"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          declineButtonStyle={{ fontSize: "13px" }}
          expires={7}
          onAccept={handleAccept}
          onDecline={handleDecline}
        >
          This website uses cookies to enhance the user experience.{" "}
          <span
            style={{ color: "#f1d600", cursor: "pointer" }}
            onClick={modalHandler}
          >
            Learn more
          </span>
        </ReactCookieConsent>
      )}

      <Dialog open={modal} onClose={modalHandler}>
        <DialogContent>
          {/* <Box>
            <Typography mt={2} variant="subtitle2" color="text.primary">
              Learn More - Our Use of Cookies at Bokaenkelt
            </Typography>
            <Typography mt={1} variant="subtitle2" color="text.secondary">
              At Bokaenkelt, we use cookies to ensure our platform operates
              securely, reliably, and efficiently. Cookies help us improve your
              user experience, analyze usage patterns, and maintain the
              essential functionality of our booking system.
            </Typography>
            <Typography mt={2} variant="subtitle2" color="text.primary">
              What are cookies?
            </Typography>
            <Typography mt={1} variant="subtitle2" color="text.secondary">
              Cookies are small text files stored in your browser when you visit
              a website. They allow the site to remember your actions and
              preferences over time, such as your language settings or
              previously selected booking options.
            </Typography>
            <Typography mt={2} variant="subtitle2" color="text.primary">
              Why we use cookies:
            </Typography>
            <Typography mt={1} variant="subtitle2" color="text.secondary">
              • To ensure the website functions correctly and securely <br />•
              To enable basic features like login and booking confirmation
              <br />
              • To measure traffic and performance (aggregated and anonymous)
              <br />• To enhance stability and detect errors
            </Typography>

            <Typography mt={1} variant="subtitle2" color="text.secondary">
              We do not use cookies for advertising or third-party marketing
              purposes. We also do not collect any personally identifiable
              information without your consent.
            </Typography>

            <Typography mt={1} variant="subtitle2" color="text.secondary">
              By continuing to browse and use Bokaenkelt, you agree to our use
              of cookies as outlined in this policy.
            </Typography>

            <Typography mt={1} variant="subtitle2" color="text.secondary">
              For any questions or concerns, you’re welcome to contact us at:
              Bokaenkelt1@gmail.com
            </Typography>
          </Box> */}
          <Box>
            <Typography variant="subtitle2" color="text.primary">
              Läs mer - Så använder vi cookies på Bokaenkelt
            </Typography>
            <Typography mt={1} variant="subtitle2" color="text.secondary">
              På Bokaenkelt använder vi cookies för att säkerställa att vår
              plattform fungerar tryggt, stabilt och effektivt. Cookies hjälper
              oss att förbättra användarupplevelsen, förstå hur tjänsten används
              och bevara grundläggande funktioner i bokningssystemet.
            </Typography>

            <Typography mt={2} variant="subtitle2" color="text.primary">
              Vad är cookies?
            </Typography>
            <Typography mt={1} variant="subtitle2" color="text.secondary">
              Cookies är små textfiler som sparas i din webbläsare när du
              besöker en webbplats. De gör det möjligt för sidan att komma ihåg
              dina inställningar och val över tid – till exempel språk eller
              tidigare bokningar.
            </Typography>

            <Typography mt={2} variant="subtitle2" color="text.primary">
              Varför vi använder cookies
            </Typography>
            <Typography mt={1} variant="subtitle2" color="text.secondary">
              • För att säkerställa att webbplatsen fungerar korrekt och säkert
              <br />• För att möjliggöra grundläggande funktioner som inloggning
              och bokningsbekräftelse
              <br />
              • För att mäta trafik och prestanda (sammanställd och anonym
              statistik)
              <br />• För att upptäcka fel och förbättra stabilitet
            </Typography>

            <Typography mt={1} variant="subtitle2" color="text.secondary">
              Vi använder inte cookies för reklam eller marknadsföring via
              tredje part. Vi samlar heller inte in personligt identifierbar
              information utan ditt godkännande.
            </Typography>

            <Typography mt={1} variant="subtitle2" color="text.secondary">
              Genom att fortsätta använda Bokaenkelt godkänner du vår användning
              av cookies enligt denna policy.
            </Typography>

            <Typography mt={1} variant="subtitle2" color="text.secondary">
              Vid frågor, kontakta oss gärna på: Bokaenkelt1@gmail.com
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            size="small"
            // style={{
            //   background: "linear-gradient(45deg, red 30%, orange 90%)",
            //   boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
            //   color: "#FFFFFF",
            //   textTransform: "capitalize",
            // }}
            onClick={handleAccept}
          >
            Decline
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="small"
            // style={{
            //   background: "linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)",
            //   boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
            //   color: "#FFFFFF",
            //   textTransform: "capitalize",
            // }}
            onClick={handleAccept}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CookieConsent;
