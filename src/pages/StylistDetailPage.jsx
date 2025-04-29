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
import {
  convertEnglishToSwedish,
  generateHourlySlots,
  getNextDate,
} from "../lib/helper";
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
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2), // Reduce padding on small screens
    marginTop: theme.spacing(2), // Adjust margin for small screens
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
    padding: "8px 16px", // Adjust padding for smaller screens
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
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(2), // Adjust margins for smaller screens
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 400,
  backgroundSize: "cover",
  backgroundPosition: "center",
  [theme.breakpoints.down("sm")]: {
    height: 250, // Adjust media height on smaller screens
  },
}));

const tabList = ["Info", "Calendar", "Photos And Reviews", "Contact"];

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
  const _tabIndex = tabList?.findIndex(
    (item) => item === selectedStylist?.tabs?.[0]
  );
  const [tabIndex, setTabIndex] = useState(_tabIndex);
  const [value, setValue] = React.useState(0);

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
    const weekday = date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const selectedDayName = convertEnglishToSwedish(weekday);

    if (
      selectedDayName === "Monday" ||
      selectedDayName === "Måndag" ||
      selectedDayName === "Tuesday" ||
      selectedDayName === "Torsdag"
    ) {
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
    const tabName = event.target.innerText;
    setValue(newValue);
    if (tabName === "Info") return setTabIndex(0);
    if (tabName === "Calendar") return setTabIndex(1);
    if (tabName === "Photos And Reviews") return setTabIndex(2);
    if (tabName === "Contact") return setTabIndex(3);
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
        {value === index && (
          <Box
            sx={{
              p: { xs: 0, sm: 0, md: 4 }, // Adjust padding based on screen size
              overflowX: "hidden", // Prevent horizontal scrolling on small devices
              width: "100%", // Ensure the Box takes up the full width
            }}
          >
            {children}
          </Box>
        )}
      </div>
    );
  }

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <StyledCardMedia
                image={`${API_BASE_URL}/${selectedStylist.imageUrl}`}
                title={selectedStylist?.name}
                sx={{ height: { xs: 250, sm: 350 }, width: "100%" }}
              />
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {selectedStylist?.tabs?.map((tab, index) => {
                      return (
                        <Tab
                          key={index}
                          label={tab}
                          style={{ textTransform: "capitalize" }}
                        />
                      );
                    })}
                  </Tabs>

                  {/* Info TAB */}
                  <CustomTabPanel value={tabIndex} index={0}>
                    <CardContent>
                      <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                          color: "#D4AF37",
                          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, // Responsive font size
                          textAlign: "center",
                          wordBreak: "break-word", // Break long words if needed
                          whiteSpace: "normal", // Allow text to wrap normally
                          overflowWrap: "break-word", // Safe break for long words
                        }}
                      >
                        {selectedStylist?.name}
                      </Typography>

                      <Typography
                        variant="body1"
                        paragraph
                        sx={{ textAlign: "center" }}
                      >
                        {selectedStylist?.bio}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Erfarenhet:</strong>{" "}
                        {selectedStylist?.experience}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>Tillgänglighet:</strong>{" "}
                        {selectedStylist?.availability?.days?.join(", ")}{" "}
                        {selectedStylist?.availability?.hours?.start + " "}-
                        {" " + selectedStylist?.availability?.hours?.end}
                      </Typography>
                      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
                        {selectedStylist?.specialties?.map(
                          (specialty, index) => (
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
                          )
                        )}
                      </Box>
                      <Box sx={{ mb: 4 }}>
                        <Typography
                          variant="h5"
                          gutterBottom
                          sx={{
                            color: "#D4AF37",
                            marginTop: 5,
                            fontSize: {
                              xs: "1.5rem",
                              sm: "1.8rem",
                              md: "2rem",
                            },
                            textAlign: "center",
                          }}
                        >
                          Tjänster
                        </Typography>
                        <Grid container spacing={2}>
                          {selectedStylist?.services?.map((service, index) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4} // Make the service cards responsive
                              key={service.id}
                              sx={{ cursor: "default" }}
                            >
                              <Card
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
                                  border: "1px solid #D4AF37",
                                  height: "100%", // Ensure the cards take full height
                                }}
                              >
                                <CardContent>
                                  <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                      fontSize: { xs: "1.2rem", sm: "1.4rem" },
                                    }}
                                  >
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
                  <CustomTabPanel value={tabIndex} index={1}>
                    <CardContent>
                      <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                          color: "#D4AF37",
                          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, // Adjust font size based on device
                          textAlign: "center",
                        }}
                      >
                        Välj datum och tid
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid
                          item
                          xs={12} // Full width on small screens
                          sm={6} // Half width on medium screens
                          lg={6} // Half width on large screens
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          {error && (
                            <Alert
                              severity="error"
                              sx={{ mb: 2, width: "100%" }}
                            >
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
                                width: "100%", // Make the calendar full width
                              }}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid
                          item
                          xs={12} // Full width on small screens
                          sm={6} // Half width on medium screens
                          lg={6} // Half width on large screens
                        >
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              Tillgängliga tider:
                            </Typography>
                            <Grid container spacing={1}>
                              {generateHourlySlots(
                                selectedStylist.availability.hours.start,
                                selectedStylist.availability.hours.end
                              )?.map((time, index) => (
                                <Grid item xs={4} sm={3} md={2} key={index}>
                                  {" "}
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
                              ))}
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
                              sx={{
                                left: "-0.2rem",
                              }}
                            />
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <StyledButton
                              variant="contained"
                              onClick={handleBooking}
                              disabled={!selectedDate || !selectedTime}
                              sx={{
                                width: { xs: "100%", sm: "50%" }, // Full width on small screens, 50% width on medium screens
                                marginTop: "16px",
                              }}
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
                  <CustomTabPanel value={tabIndex} index={2}>
                    <CardContent>
                      <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                          color: "#D4AF37",
                          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Adjust font size for different screens
                          textAlign: "center",
                        }}
                      >
                        Pictures and Reviews
                      </Typography>
                      <Grid
                        container
                        spacing={3}
                        sx={{ maxHeight: "25rem", overflow: "hidden" }}
                      >
                        {/* USER REVIEWS */}
                        <Grid item xs={12} sm={7} md={7}>
                          {" "}
                          {/* Adjust size based on device */}
                          {reviews.map((review, index) => (
                            <Box key={index} mb={3}>
                              <Box display="flex" alignItems="center">
                                <Avatar src="" sx={{ marginRight: 2 }} />
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
                                  sx={{ maxWidth: "95%" }}
                                >
                                  {review.description}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Grid>

                        {/* REVIEW IMAGES */}
                        <Grid
                          item
                          xs={12}
                          sm={5}
                          md={5}
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                          }}
                        >
                          {reviewImages.splice(0, 10).map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              style={{
                                width: "30%",
                                height: "auto",
                                margin: "5px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            />
                          ))}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CustomTabPanel>

                  {/* Location TAB */}
                  <CustomTabPanel value={tabIndex} index={3}>
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      sx={{
                        color: "#D4AF37",
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Adjust font size for different screens
                        textAlign: "center", // Center the title for smaller screens
                      }}
                    >
                      Location
                    </Typography>
                    <Grid container spacing={5} justifyContent="center">
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "500px",
                            margin: 5,
                          }}
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
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ textAlign: "center", marginBottom: 1 }}
                        >
                          <strong>Adress:</strong> {selectedStylist?.location}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ textAlign: "center", marginBottom: 1 }}
                        >
                          <strong>Phone:</strong> {selectedStylist?.phone}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ textAlign: "center", marginBottom: 1 }}
                        >
                          <strong>Email:</strong> {selectedStylist?.email}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CustomTabPanel>
                </Box>
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default StylistDetailPage;
