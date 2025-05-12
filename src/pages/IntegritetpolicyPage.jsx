import { Box, Typography } from "@mui/material";

const IntegritetpolicyPage = () => {
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
          Integritetspolicy - BokaEnkelt
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Vi på BokaEnkelt värnar om din personliga integritet och strävar efter
          att alltid behandla dina personuppgifter med största respekt och i
          enlighet med dataskyddsförordningen (GDPR). Denna policy förklarar hur
          vi samlar in, använder och skyddar dina uppgifter när du använder vår
          bokningstjänst.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          När du genomför en bokning eller skapar ett konto hos oss, samlar vi
          in information som namn, e-postadress, telefonnummer och annan
          nödvändig kontaktinformation för att kunna fullfölja din bokning. Vi
          registrerar även vilken tjänst du väljer, vilken stylist du bokar samt
          datum och tid för besöket. Om du ger ditt samtycke kan vi även använda
          platsdata för att föreslå stylister nära dig.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          All information du lämnar används enbart för att tillhandahålla vår
          tjänst - det vill säga att möjliggöra bokningar, skicka
          bokningsbekräftelser och påminnelser, erbjuda relevant kundsupport och
          i vissa fall analysera användningen av plattformen för att förbättra
          din upplevelse. Vi kan även behöva spara viss information under en
          längre tid för att uppfylla juridiska skyldigheter, exempelvis enligt
          bokföringslagen.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Vi säljer aldrig dina uppgifter till tredje part. Däremot samarbetar
          vi med betrodda teknikleverantörer och systemleverantörer som hjälper
          oss att driva plattformen. Dessa aktörer får endast tillgång till den
          information som krävs för att utföra sina tjänster, och de är bundna
          av sekretessavtal.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Dina uppgifter lagras så länge det krävs för att vi ska kunna
          tillhandahålla tjänsten och fullgöra våra skyldigheter gentemot dig
          som användare. Om du avslutar ditt konto eller inte längre använder
          våra tjänster, kommer dina uppgifter att raderas eller anonymiseras
          inom rimlig tid, om vi inte enligt lag är skyldiga att behålla dem
          längre.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Som användare har du alltid rätt att få information om vilka uppgifter
          vi har sparade om dig, begära rättelse, överföring eller radering av
          dina personuppgifter. Du kan när som helst återkalla ditt samtycke
          till databehandling, och du har även rätt att inge klagomål till
          Integritetsskyddsmyndigheten om du anser att vi inte hanterar dina
          uppgifter korrekt.
        </Typography>

        <Typography mt={2} variant="body1" color="text.secondary">
          Om du har frågor om hur vi hanterar din data är du alltid välkommen
          att kontakta oss på bokaenkelt1@gmail.com eller ringa oss på 079-301
          45 55.
        </Typography>
      </Box>
    </>
  );
};

export default IntegritetpolicyPage;
