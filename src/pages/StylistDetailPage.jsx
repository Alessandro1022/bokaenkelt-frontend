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
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import sv from "date-fns/locale/sv";
import { API_BASE_URL } from "../lib/constants";
import { generateHourlySlots, getNextDate } from "../lib/helper";
import { createGuestRating, createRatings } from "../api/ratings";
import { useAuth } from "../contexts/AuthContext";
import { getBookedTimeSlots } from "../api/bookings";
import mapLocationImage from "../assets/map_location.png";

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
  height: 400,
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
  const [value, setValue] = React.useState(0);

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

  // EFFECTS

  const reviewImages = [
    "https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg",
    "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg",
    "https://images.pexels.com/photos/7697390/pexels-photo-7697390.jpeg",
    "https://images.pexels.com/photos/897265/pexels-photo-897265.jpeg",
    "https://images.pexels.com/photos/7697390/pexels-photo-7697390.jpeg",
    "https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg",
    "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg",
    "https://images.pexels.com/photos/897265/pexels-photo-897265.jpeg",
    "https://images.pexels.com/photos/897265/pexels-photo-897265.jpeg",
    "https://images.pexels.com/photos/897265/pexels-photo-897265.jpeg",
  ];
  const reviews = [
    {
      name: "Emily Smith",
      rating: 5.0,
      description:
        "Absolutely loved the haircut! Priya did an amazing job and made me feel so comfortable. Will definitely come again.",
    },
    {
      name: "Michael Chen",
      rating: 4.0,
      description:
        "Good service overall. The ambience is relaxing and Kavita was very professional. Just a little delay in my appointment time.",
    },
    {
      name: "Sofia Hernandez",
      rating: 4.8,
      description:
        "I had a facial done by Meera and it was heavenly. My skin feels refreshed and glowing. Highly recommend her!",
    },
  ];

  // EFFECTS
  useEffect(() => {
    fetchBookedSlots();
  }, []);

  // FUNCTIONS
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
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} width="100%">
            <StyledCard>
              <StyledCardMedia
                image={
                  selectedStylist.imageUrl
                    ? selectedStylist.imageUrl
                    : `${API_BASE_URL}/${selectedStylist?.imageUrl}`
                }
                title={selectedStylist?.name}
              />
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleTabChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Info" style={{ textTransform: "capitalize" }} />
                    <Tab
                      label="Calendar"
                      style={{ textTransform: "capitalize" }}
                    />
                    <Tab
                      label="Pictures and Reviews"
                      style={{ textTransform: "capitalize" }}
                    />
                    <Tab
                      label="Contact"
                      style={{ textTransform: "capitalize" }}
                    />
                  </Tabs>
                </Box>

                {/* Info TAB */}
                <CustomTabPanel value={value} index={0}>
                  <CardContent>
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      sx={{ color: "#D4AF37" }}
                    >
                      {selectedStylist?.name}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedStylist?.bio}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <strong>Erfarenhet:</strong> {selectedStylist?.experience}
                    </Typography>
                    {/* <Typography variant="body1" paragraph>
                      <strong>Adress:</strong> {selectedStylist?.location}
                    </Typography> */}
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
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ color: "#D4AF37", marginTop: 5 }}
                      >
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
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {service.duration} - {service.price} kr
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {service.description}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </CardContent>
                </CustomTabPanel>

                {/* Calendar TAB */}
                <CustomTabPanel value={value} index={1}>
                  <CardContent>
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      sx={{ color: "#D4AF37" }}
                    >
                      Välj datum och tid
                    </Typography>
                    <Grid container>
                      <Grid
                        size={{ xs: 12, md: 12, lg: 6 }}
                        style={{
                          width: "auto",
                        }}
                        marginRight={15}
                      >
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
                      </Grid>
                      <Grid size={{ xs: 12, md: 12, lg: 6 }}>
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
                                      selectedTime === time
                                        ? "contained"
                                        : "outlined"
                                    }
                                    onClick={() => handleTimeSelect(time)}
                                    sx={{
                                      width: "100%",
                                      borderColor: "#D4AF37",
                                      color:
                                        selectedTime === time
                                          ? "#FFFFFF"
                                          : "#D4AF37",
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
                        <Box sx={{ mt: 2 }}>
                          <StyledButton
                            variant="contained"
                            onClick={handleBooking}
                            disabled={!selectedDate || !selectedTime}
                            style={{ width: "50%" }}
                          >
                            {loading ? (
                              <CircularProgress size={24} />
                            ) : (
                              "Boka tid"
                            )}
                          </StyledButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </CustomTabPanel>

                {/* Pictures and Reviews TAB */}
                <CustomTabPanel value={value} index={2}>
                  <CardContent>
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      sx={{ color: "#D4AF37" }}
                    >
                      Pictures and Reviews
                    </Typography>
                    <Grid container maxHeight="25rem" overflow="hidden">
                      {/* USER REVIEWS */}
                      <Grid size={7}>
                        {reviews.map((review, index) => {
                          return (
                            <Box key={index} mb={3}>
                              <Box display="flex" alignItems="center">
                                <Avatar
                                  src=""
                                  style={{
                                    marginRight: 10,
                                  }}
                                />
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    component="p"
                                    gutterBottom
                                    sx={{
                                      color: "#D4AF37",
                                      margin: 0,
                                      padding: 0,
                                    }}
                                  >
                                    {review.name}
                                  </Typography>
                                  <Rating
                                    value={review.rating}
                                    onChange={() => {}}
                                    precision={0.1}
                                    readOnly
                                    size="small"
                                  />
                                </Box>
                              </Box>
                              <Box paddingX={1}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  style={{
                                    maxWidth: "95%",
                                  }}
                                >
                                  {review.description}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                      </Grid>

                      {/* REVIEW IMAGES */}
                      <Grid size={5}>
                        {reviewImages.splice(0, 10).map((img, index) => {
                          return (
                            <img
                              key={index}
                              src={img}
                              style={{
                                width: "20%",
                                height: "15%",
                                margin: "5px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            />
                          );
                        })}
                      </Grid>
                    </Grid>
                  </CardContent>
                </CustomTabPanel>

                {/* Location TAB */}
                <CustomTabPanel value={value} index={3}>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ color: "#D4AF37" }}
                  >
                    Location
                  </Typography>
                  <Grid container gap={5}>
                    <Grid
                      width={500}
                      height={300}
                      overflow="hidden"
                      size={{ xs: 12, md: 12, lg: 6 }}
                    >
                      <img
                        src={mapLocationImage}
                        alt="map location"
                        style={{
                          width: "100%",
                          objectFit: "contain",
                          borderRadius: "15px",
                          cursor: "pointer",
                        }}
                      />
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle1">
                        <strong>Adress:</strong> {selectedStylist?.location}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Phone:</strong> {selectedStylist?.phone}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Email:</strong> {selectedStylist?.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </CustomTabPanel>
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default StylistDetailPage;
