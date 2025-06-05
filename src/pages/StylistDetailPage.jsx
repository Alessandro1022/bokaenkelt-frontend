import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { Rating } from "react-simple-star-rating";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import {
  generateHourlySlots,
  getNextDate,
  getWeekdayIndex,
} from "../lib/helper";
import {
  createGuestRating,
  createRatings,
  getStylistRatings,
} from "../api/ratings";
import { useAuth } from "../contexts/AuthContext";
import { getBookedTimeSlots } from "../api/bookings";
import { getStylistDetails } from "../api/stylists";
import { STYLIST_TABS } from "../lib/constants";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StylistDetailPage = () => {
  const navigate = useNavigate();
  const { stylistId } = useParams();
  const { user } = useAuth();

  // STATES
  const [selectedDate, setSelectedDate] = useState(getNextDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [value, setValue] = React.useState(0);
  const [ratingForm, setRatingForm] = useState({
    rating: 0,
    userName: "",
    userReview: "",
  });
  const [selectedStylist, setSelectedStylist] = useState({});
  const [ratingLoader, setRatingLoader] = useState(false);
  const [loading, setLoading] = useState({
    fetchStylistDetails: true,
    fetchBookedSlots: true,
    fetchStylistRatings: true,
  });

  // EFFECTS
  useEffect(() => {
    fetchStylistDetails();
  }, []);

  // API FUNCTIONS
  const fetchStylistDetails = async () => {
    try {
      const res = await getStylistDetails(stylistId);
      if (res.status === 200) {
        setSelectedStylist(res?.data?.data);
        await fetchBookedSlots();
        await fetchStylistRatings();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({
        fetchStylistDetails: false,
      });
    }
  };
  const fetchBookedSlots = async (date) => {
    try {
      const _data = {
        stylistId: stylistId,
        date: date
          ? date.toISOString().slice(0, 10)
          : selectedDate.toISOString().slice(0, 10),
      };
      const bookedSlots = await getBookedTimeSlots(_data);
      if (bookedSlots.status === 200) {
        setBookedSlots(bookedSlots?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({
        fetchBookedSlots: false,
      });
    }
  };
  const fetchStylistRatings = async () => {
    try {
      const res = await getStylistRatings(stylistId);
      if (res.status === 200) {
        setUserReviews(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({
        fetchStylistRatings: false,
      });
    }
  };

  // FUNCTIONS
  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchBookedSlots(date);
  };
  const disableWeekdays = (date) => {
    const day = date.getDay();

    const allowedDays = selectedStylist?.availability?.days.map((name) =>
      getWeekdayIndex(name)
    );
    return !allowedDays.includes(day);
  };
  const handleTimeSelect = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hours, minutes);

    // const startTime = new Date(selectedDate);
    // startTime.setHours(11, 0);

    // const endTime = new Date(selectedDate);
    // endTime.setHours(23, 0);

    // if (selectedDateTime < startTime || selectedDateTime > endTime) {
    //   setError("Välj en tid mellan 11:00 och 23:00");
    //   return;
    // }

    setSelectedTime(time);
    setError(null);
  };
  const handleBooking = async () => {
    try {
      if (!selectedDate || !selectedTime) {
        setError("Välj datum och tid för bokningen");
        return;
      }
      setBookingLoading(true);

      const stateData = {
        stylistId: stylistId,
        date: selectedDate.toISOString(),
        time: selectedTime,
        stylistName: selectedStylist.name,
        services: selectedStylist.services,
      };

      navigate("/booking", { state: stateData });
    } catch (error) {
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };
  const handleTabChange = (event, newValue) => {
    const tabName = event.target.innerText;
    setValue(newValue);

    let element = document.getElementById(tabName);
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };
  const handleRatingFormChange = (e) => {
    const { name, value } = e.target;
    setRatingForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleRate = async (e) => {
    try {
      e.preventDefault();

      setRatingLoader(true);

      const _data = {
        rating: ratingForm.rating,
        name: ratingForm.userName,
        review: ratingForm.userReview,
        stylist: stylistId,
      };
      let res = {};
      if (user?.id) {
        res = await createRatings(_data);
      } else {
        res = await createGuestRating(_data);
      }

      if (res.status === 200) {
        setRatingForm({ rating: 0, userName: "", userReview: "" });
        fetchStylistRatings();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRatingLoader(false);
    }
  };
  const checkVisibleTab = (tabName) => {
    const isVisible = selectedStylist?.tabs?.includes(tabName);
    return isVisible;
  };

  if (
    loading.fetchBookedSlots &&
    loading.fetchStylistDetails &&
    loading.fetchStylistRatings
  ) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={48} />
      </Container>
    );
  } else {
    return (
      <Container maxWidth="lg">
        <StyledPaper>
          <Grid container spacing={4}>
            <Grid width="100%">
              <StyledCardMedia
                image={`${API_BASE_URL}/${selectedStylist.imageUrl}`}
                title={selectedStylist?.name}
                sx={{
                  height: { xs: 250, sm: 350, md: 400, lg: 400 },
                  width: "100%",
                }}
              />
              <Box>
                <Tabs
                  value={value}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  style={{ borderTop: "1px solid #d4af37" }}
                >
                  {/* {checkHasPremium()?.map((tab, index) => {
                    return (
                      <Tab
                        key={index}
                        label={tab}
                        style={{ textTransform: "capitalize" }}
                      />
                    );
                  })} */}
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

                <CardContent
                  id="Info"
                  sx={{
                    p: { xs: 0, sm: 0, md: 2 },
                    overflowX: "hidden",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      color: "#D4AF37",
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                    }}
                  >
                    {selectedStylist?.name}
                  </Typography>

                  <Typography variant="body1" mb={2}>
                    {selectedStylist?.bio}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Erfarenhet:</strong> {selectedStylist?.experience}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Tillgänglighet:</strong>{" "}
                    {selectedStylist?.availability?.days?.join(", ")}{" "}
                    {selectedStylist?.availability?.hours?.start + " "}-
                    {" " + selectedStylist?.availability?.hours?.end}
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
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
                      sx={{
                        color: "#D4AF37",
                        marginTop: 5,
                        fontSize: {
                          xs: "1.5rem",
                          sm: "1.8rem",
                          md: "2rem",
                        },
                      }}
                    >
                      Tjänster
                    </Typography>
                    <Grid container spacing={2}>
                      {!selectedStylist?.services?.length && (
                        <Typography
                          component="p"
                          gutterBottom
                          sx={{
                            fontSize: {
                              xs: "1.5rem",
                              sm: "1.5rem",
                              md: "1.5rem",
                            },
                            mb: 2,
                          }}
                        >
                          No Services
                        </Typography>
                      )}
                      {selectedStylist?.services?.map((service, index) => (
                        <Grid key={service._id} sx={{ cursor: "default" }}>
                          <Card
                            sx={{
                              background:
                                "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
                              border: "1px solid #D4AF37",
                              height: "100%",
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

                <CardContent
                  id="Calendar"
                  sx={{
                    p: { xs: 0, sm: 0, md: 2 },
                    overflowX: "hidden",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      color: "#D4AF37",
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    }}
                  >
                    Välj datum och tid
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 12,
                        md: 6,
                        lg: 6,
                        xl: 6,
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box width="100%">
                        {error && (
                          <Alert
                            severity="error"
                            sx={{
                              width: {
                                xs: "100%",
                                sm: "100%",
                                md: "70%",
                                lg: "70%",
                              },
                            }}
                          >
                            {error}
                          </Alert>
                        )}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DemoContainer components={["DateCalendar"]}>
                            <DateCalendar
                              views={["year", "month", "day"]}
                              value={selectedDate}
                              onChange={handleDateChange}
                              minDate={getNextDate()}
                              shouldDisableDate={disableWeekdays}
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
                          </DemoContainer>
                        </LocalizationProvider>
                      </Box>
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 12,
                        md: 6,
                        lg: 6,
                        xl: 6,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Tillgängliga tider:
                        </Typography>
                        <Grid container spacing={1}>
                          {generateHourlySlots(
                            selectedStylist?.availability?.hours?.start,
                            selectedStylist?.availability?.hours?.end
                          )?.map((time, index) => (
                            <Grid key={index}>
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
                        <StyledButton
                          variant="contained"
                          onClick={handleBooking}
                          disabled={!selectedDate || !selectedTime}
                          sx={{
                            width: { xs: "100%", sm: "50%" },
                            marginTop: "16px",
                          }}
                        >
                          {bookingLoading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Boka tid"
                          )}
                        </StyledButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                {checkVisibleTab("Reviews") && (
                  <CardContent
                    id="Reviews"
                    sx={{
                      p: { xs: 0, sm: 0, md: 2 },
                      overflowX: "hidden",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      sx={{
                        color: "#D4AF37",
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                        mb: 2,
                      }}
                    >
                      Reviews
                    </Typography>
                    <Grid
                      direction="row"
                      container
                      spacing={3}
                      sx={{ overflow: "hidden" }}
                    >
                      <Grid
                        maxHeight={450}
                        size={{
                          xs: 12,
                          sm: 12,
                          md: 6,
                          lg: 6,
                          xl: 6,
                        }}
                        style={{ overflowX: "auto" }}
                      >
                        {!userReviews.length && (
                          <Typography
                            component="p"
                            gutterBottom
                            sx={{
                              fontSize: {
                                xs: "1.5rem",
                                sm: "1.5rem",
                                md: "1.5rem",
                              },
                              mb: 2,
                            }}
                          >
                            No Reviews
                          </Typography>
                        )}
                        {userReviews.map((review, index) => (
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
                                  initialValue={review.rating}
                                  size={18}
                                  readonly
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
                                {review.review}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Grid>
                      <Grid
                        size={{
                          xs: 12,
                          sm: 12,
                          md: 6,
                          lg: 6,
                          xl: 6,
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>
                            Share your feedback
                          </Typography>
                          <TextField
                            type="text"
                            name="userName"
                            value={ratingForm.userName}
                            onChange={handleRatingFormChange}
                            placeholder="Enter your name"
                            required
                            style={{
                              marginBottom: 10,
                              width: "80%",
                            }}
                          />
                        </Box>
                        <Box>
                          <TextAreaStyle
                            minRows={8}
                            name="userReview"
                            placeholder="Enter your review here..."
                            className="textarea"
                            required
                            value={ratingForm.userReview}
                            onChange={handleRatingFormChange}
                            style={{
                              width: "80%",
                            }}
                          />
                        </Box>
                        <Box>
                          <Rating
                            transition
                            allowFraction
                            initialValue={ratingForm.rating}
                            onClick={(value) =>
                              setRatingForm((prev) => ({
                                ...prev,
                                rating: value,
                              }))
                            }
                          />
                        </Box>

                        <Box>
                          <StyledButton
                            type="submit"
                            variant="contained"
                            onClick={handleRate}
                            disabled={!ratingForm.rating}
                            sx={{
                              width: { xs: "100%", sm: "25%" },
                              marginTop: "16px",
                              textTransform: "capitalize",
                            }}
                          >
                            {ratingLoader ? (
                              <CircularProgress size={24} />
                            ) : (
                              "Rate"
                            )}
                          </StyledButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                )}

                {checkVisibleTab("Photos") && (
                  <CardContent
                    id="Photos"
                    sx={{
                      p: { xs: 0, sm: 0, md: 2 },
                      overflowX: "hidden",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      sx={{
                        color: "#D4AF37",
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                        mb: 2,
                      }}
                    >
                      Photos
                    </Typography>
                    <Grid container spacing={3} sx={{ maxHeight: "25rem" }}>
                      <Grid>
                        {!selectedStylist?.photos && (
                          <Typography
                            component="p"
                            gutterBottom
                            sx={{
                              fontSize: {
                                xs: "1.5rem",
                                sm: "1.5rem",
                                md: "1.5rem",
                              },
                              mb: 2,
                            }}
                          >
                            No Photos
                          </Typography>
                        )}
                        {selectedStylist?.photos?.map((img, index) => (
                          <img
                            key={index}
                            src={`${API_BASE_URL}/${img}`}
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
                )}

                {checkVisibleTab("Contact") && (
                  <CardContent
                    id="Contact"
                    sx={{
                      p: { xs: 0, sm: 0, md: 2 },
                      overflowX: "hidden",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      sx={{
                        color: "#D4AF37",
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      }}
                    >
                      Location
                    </Typography>
                    <Grid container spacing={5}>
                      <Grid
                        size={{
                          xs: 12,
                          sm: 12,
                          md: 6,
                          lg: 6,
                          xl: 6,
                        }}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {selectedStylist?.location?.map?.length > 0 ? (
                          <div
                            style={{
                              width: "100%",
                              height: "auto",
                              maxWidth: "500px",
                              margin: 5,
                              borderRadius: "15px",
                              overflow: "hidden",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: selectedStylist?.location?.map,
                            }}
                          ></div>
                        ) : (
                          <Typography
                            component="p"
                            gutterBottom
                            sx={{
                              fontSize: {
                                xs: "1.5rem",
                                sm: "1.5rem",
                                md: "1.5rem",
                              },
                              mb: 2,
                            }}
                          >
                            No Map
                          </Typography>
                        )}
                      </Grid>
                      <Grid
                        size={{
                          xs: 12,
                          sm: 12,
                          md: 6,
                          lg: 6,
                          xl: 6,
                        }}
                        padding={2}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ marginBottom: 1 }}
                        >
                          <strong>Adress:</strong>{" "}
                          {selectedStylist?.location?.address}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ marginBottom: 1 }}
                        >
                          <strong>Phone:</strong> {selectedStylist?.phone}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ marginBottom: 1 }}
                        >
                          <strong>Email:</strong> {selectedStylist?.email}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                )}
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>
      </Container>
    );
  }
};

export default StylistDetailPage;

const CustomTabPanel = (props) => {
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
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  // padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  overflow: "hidden",
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
const TextAreaStyle = styled(TextareaAutosize)(({ theme }) => ({
  background: "transparent",
  borderRadius: 5,
  borderColor: "#888",
  outline: "none",
  width: "100%",
  padding: 10,
  "&:hover": {
    borderColor: "black",
  },
  "&:focus": {
    borderColor: "#d4af37",
  },
}));
