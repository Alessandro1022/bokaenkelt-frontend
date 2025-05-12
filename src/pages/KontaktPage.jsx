import { Box, Typography } from "@mui/material";

const KontaktPage = () => {
  return (
    <>
      <Box>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.8rem", lg: "2rem" },
          }}
        >
          Kontakt - BokaEnkelt
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Vi på BokaEnkelt vill göra det enkelt för dig att komma i kontakt med
          oss - oavsett om du har frågor om din bokning, vill rapportera ett
          tekniskt problem eller bara vill veta mer om våra tjänster. Vi finns
          här för att hjälpa dig på bästa sätt.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Om du behöver support eller har andra ärenden är du varmt välkommen
          att mejla oss på bokaenkelt1@gmail.com eller ringa direkt till vår
          kundtjänst på 079-301 45 55. Vi besvarar alla mejl så snabbt vi kan,
          oftast inom 24 timmar under vardagar.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Vårt kontor är baserat i Göteborg, och vi arbetar varje dag för att
          förbättra vår plattform och ge både kunder och stylister en smidig och
          trygg bokningsupplevelse. Du kan alltid räkna med personlig och
          professionell service när du kontaktar oss.
        </Typography>
      </Box>

      <Box mt={10}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.8rem", lg: "2rem" },
          }}
        >
          Om oss - BokaEnkelt
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          BokaEnkelt är en digital bokningsplattform skapad för att förenkla
          vardagen - både för kunder som vill boka frisörtid och för stylister
          som vill nå ut till fler. Vi tror på enkelhet, effektivitet och tillit
          i varje steg av bokningsprocessen.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Idén till plattformen växte fram ur en frustration över krångliga och
          ineffektiva bokningssystem. Vi ville skapa något som känns modernt,
          snabbt och användarvänligt - både för privatpersoner och för
          yrkesverksamma inom skönhetsbranschen.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Bakom BokaEnkelt står ett engagerat team med erfarenhet inom teknik,
          service och skönhet. Vi strävar efter att ligga i framkant genom att
          kombinera smart teknik med högkvalitativ kundservice. Genom vår
          plattform kan stylister fokusera på sitt hantverk - och kunder kan
          känna sig trygga i att få just den behandling de önskar, när de vill.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Vi är stolta över att ha vår bas i Göteborg, men vår vision är större:
          att digitalisera och förbättra bokningsupplevelsen i hela Sverige.
        </Typography>
      </Box>
    </>
  );
};

export default KontaktPage;
