import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import sv from "date-fns/locale/sv";
import { generateHourlySlots, getNextDate } from "../lib/helper";
import { createGuestRating, createRatings } from "../api/ratings";
import { useAuth } from "../contexts/AuthContext";
import { getBookedTimeSlots } from "../api/bookings";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  background: "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
  border: "1px solid #D4AF37",
  borderRadius: 16,
  boxShadow: "0 4px 8px rgba(212, 175, 55, 0.15)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%)",
  boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
  color: "#FFFFFF",
  padding: "10px 24px",
  "&:hover": {
    background: "linear-gradient(45deg, #B38B2D 30%, #D4AF37 90%)",
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
  border: "1px solid #D4AF37",
  borderRadius: 16,
  boxShadow: "0 4px 8px rgba(212, 175, 55, 0.15)",
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 300,
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

const StylistDetailPage = () => {
  const navigate = useNavigate();
  const { stylistId } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const selectedStylist = location?.state || {};

  const [selectedDate, setSelectedDate] = useState(getNextDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [ratings, setRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState(null);

  // const stylist = {
  //   id: "1",
  // name: "Woolley Cutzzz",
  // image: "",
  // rating: 4.9,
  // reviews: 128,
  // bio: "Professionell frisör med fokus på herrklippning och skäggvård. Erbjuder en avslappnad och professionell upplevelse i Kristinedal träningcenter.",
  // specialties: ["Herrklippning", "Skäggvård"],
  // experience: "5+ års erfarenhet",
  // availability: {
  //   days: ["onsdag", "torsdag", "fredag", "lördag", "söndag"],
  //   hours: {
  //     start: "11:00",
  //     end: "23:00",
  //   },
  // },
  // services: [
  //   {
  //     id: "1",
  //     name: "Herrklippning",
  //     price: 150,
  //     duration: "30 min",
  //     description: "Professionell herrklippning med modern finish",
  //   },
  //   {
  //     id: "2",
  //     name: "Herrklippning med skägg",
  //     price: 200,
  //     duration: "45 min",
  //     description: "Herrklippning inklusive skäggtrimning och styling",
  //   },
  // ],
  // location: "Kristinedal träningcenter",
  // };

  useEffect(() => {
    fetchBookedSlots();
  }, []);

  const fetchBookedSlots = async (_date) => {
    try {
      const _data = {
        stylistId: stylistId,
        date: _date
          ? _date.toISOString().slice(0, 10)
          : selectedDate.toISOString().slice(0, 10),
      };
      const bookedSlots = await getBookedTimeSlots(_data);
      if (bookedSlots.status === 200) {
        setBookedSlots(bookedSlots?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDateChange = (date) => {
    // const day = date.getDay();

    // const isAvailable = selectedStylist?.availability?.days?.includes(
    //   [
    //     "söndag",
    //     "måndag",
    //     "tisdag",
    //     "onsdag",
    //     "torsdag",
    //     "fredag",
    //     "lördag",
    //     "Monday",
    //     "Tuesday",
    //     "Wednesday",
    //     "Thursday",
    //     "Friday",
    //     "Saturday",
    //     "Sunday",
    //   ][day]
    // );

    const selectedDayName = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (selectedDayName === "Monday" || selectedDayName === "Tuesday") {
      setError("Inga tider tillgängliga denna dag");
      return;
    }

    const isAvailable =
      selectedStylist?.availability?.days?.includes(selectedDayName);

    if (!isAvailable) {
      setError("Inga tider tillgängliga denna dag");
      return;
    }

    setSelectedDate(date);
    setError(null);
    fetchBookedSlots(date);
  };
  const handleTimeSelect = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hours, minutes);

    const startTime = new Date(selectedDate);
    startTime.setHours(11, 0);

    const endTime = new Date(selectedDate);
    endTime.setHours(23, 0);

    if (selectedDateTime < startTime || selectedDateTime > endTime) {
      setError("Välj en tid mellan 11:00 och 23:00");
      return;
    }

    setSelectedTime(time);
    setError(null);
  };
  const handleBooking = async () => {
    try {
      if (!selectedDate || !selectedTime) {
        setError("Välj datum och tid för bokningen");
        return;
      }
      setLoading(true);

      const ratingData = {
        customer: user?.id || "",
        stylist: stylistId,
        rating: ratings,
      };
      if (user?.id) {
        await createRatings(ratingData);
      } else {
        await createGuestRating(ratingData);
      }

      const stateData = {
        stylistId: stylistId,
        date: selectedDate.toISOString(),
        time: selectedTime,
        stylistName: selectedStylist.name,
      };
      navigate("/booking", { state: stateData });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <StyledCardMedia
                image={
                  selectedStylist.imageUrl
                    ? selectedStylist.imageUrl
                    : `${API_BASE_URL}/${selectedStylist?.imageUrl}`
                }
                title={selectedStylist?.name}
              />
              <CardContent>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ color: "#D4AF37" }}
                >
                  {selectedStylist?.name}
                </Typography>
                {/* <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Rating
                    value={selectedStylist?.rating || 0}
                    precision={0.1}
                    readOnly
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({selectedStylist?.reviews || 0} recensioner)
                  </Typography>
                </Box> */}
                <Typography variant="body1" paragraph>
                  {selectedStylist?.bio}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Erfarenhet:</strong> {selectedStylist?.experience}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Adress:</strong> {selectedStylist?.location}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Tillgänglighet:</strong>{" "}
                  {selectedStylist?.availability?.days?.join(", ")}{" "}
                  {selectedStylist?.availability?.hours?.start + " "}-
                  {" " + selectedStylist?.availability?.hours?.end}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {selectedStylist?.specialties?.map((specialty, index) => (
                    <Chip
                      key={index}
                      label={specialty}
                      sx={{
                        mr: 1,
                        mb: 1,
                        background: "#D4AF37",
                        color: "#FFFFFF",
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ color: "#D4AF37" }}>
                Tjänster
              </Typography>
              <Grid container spacing={2}>
                {selectedStylist?.services?.map((service, index) => (
                  <Grid
                    item
                    xs={12}
                    key={service.id}
                    sx={{ cursor: "default" }}
                  >
                    <Card
                      sx={{
                        background:
                          "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
                        border: "1px solid #D4AF37",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {service.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.duration} - {service.price} kr
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box>
              <Typography variant="h5" gutterBottom sx={{ color: "#D4AF37" }}>
                Välj datum och tid
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={sv}
              >
                <DateCalendar
                  value={selectedDate}
                  onChange={handleDateChange}
                  minDate={getNextDate()}
                  sx={{
                    "& .Mui-selected": {
                      backgroundColor: "#D4AF37 !important",
                    },
                    "& .MuiPickersDay-dayWithMargin": {
                      "&:hover": {
                        backgroundColor: "rgba(212, 175, 55, 0.1)",
                      },
                    },
                    "& .MuiPickersDay-today": {
                      border: "none !important",
                    },
                  }}
                />
              </LocalizationProvider>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Tillgängliga tider:
                </Typography>
                <Grid container spacing={1}>
                  {generateHourlySlots(
                    selectedStylist.availability.hours.start,
                    selectedStylist.availability.hours.end
                  )?.map((time, index) => {
                    return (
                      <Grid item xs={4} key={index}>
                        <Button
                          disabled={bookedSlots.includes(time)}
                          variant={
                            selectedTime === time ? "contained" : "outlined"
                          }
                          onClick={() => handleTimeSelect(time)}
                          sx={{
                            width: "100%",
                            borderColor: "#D4AF37",
                            color:
                              selectedTime === time ? "#FFFFFF" : "#D4AF37",
                            "&:hover": {
                              borderColor: "#B38B2D",
                            },
                          }}
                        >
                          {time}
                        </Button>
                      </Grid>
                    );
                  })}
                  {/* {Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 11;
                    const time = `${hour.toString().padStart(2, "0")}:00`;
                    return (
                      <Grid item xs={4} key={time}>
                        <Button
                          variant={
                            selectedTime === time ? "contained" : "outlined"
                          }
                          onClick={() => handleTimeSelect(time)}
                          sx={{
                            width: "100%",
                            borderColor: "#D4AF37",
                            color:
                              selectedTime === time ? "#FFFFFF" : "#D4AF37",
                            "&:hover": {
                              borderColor: "#B38B2D",
                            },
                          }}
                        >
                          {time}
                        </Button>
                      </Grid>
                    );
                  })} */}
                </Grid>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Share your feedback
                </Typography>
                <Rating
                  value={ratings}
                  onChange={(e, value) => setRatings(value)}
                  precision={0.1}
                  size="large"
                  style={{
                    left: "-0.2rem",
                  }}
                />
              </Box>

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <StyledButton
                  variant="contained"
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime}
                  style={{ width: "8rem" }}
                >
                  {loading ? <CircularProgress size={24} /> : "Boka tid"}
                </StyledButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default StylistDetailPage;
