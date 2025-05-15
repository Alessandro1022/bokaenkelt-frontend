import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Autocomplete,
  Chip,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  deleteBookings,
  fetchStylistBookings,
  updateBookings,
} from "../api/bookings";
import {
  getStylistDetails,
  updateStylistProfile,
  uploadStylistCoverImage,
  uploadStylistPhotos,
  deletStylistImages,
} from "../api/stylists";
import { useAuth } from "../contexts/AuthContext";
import { WEEKDAYS, STYLIST_TABS } from "../lib/constants";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StylistDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // STATES
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    time: "",
    service: "",
    status: "",
  });
  const [coverImg, setCoverImg] = useState();
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [services, setServices] = useState([]);
  const [editProfileDialog, setEditProfileDialog] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    specialties: [],
    bio: "",
    experience: 0,
    reviews: 0,
    rating: 0,
    isActive: true,
    availability: {
      hours: {
        start: "",
        end: "",
      },
      days: [],
    },
    loading: false,
    imageUrl: [],
    location: {
      address: "",
      map: "",
    },
    photos: [],
    tabs: [],
    services: "",
    // photos: [],
    // services: [{}],
  });

  // EFFECTS
  useEffect(() => {
    loadBookings();
    getStylistDetail();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // API FUNCTIONS
  const loadBookings = async () => {
    try {
      const response = await fetchStylistBookings();
      const storedBookings = response?.data?.data?.length
        ? response?.data?.data
        : [];

      setBookings(storedBookings);
    } catch (err) {
      setError("Kunde inte ladda bokningar");
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };
  const getStylistDetail = async () => {
    try {
      const response = await getStylistDetails(user?.id);
      if (response.status === 200) {
        const _resData = response?.data?.data;

        const updatedServices = _resData?.services?.map((item) => {
          const servce = `${item.name}, ${item.price}, ${item.duration}, ${item.description}`;
          return { id: item?._id || "", value: servce };
        });

        const _profileData = {
          name: _resData.name,
          phone: _resData.phone,
          specialties: _resData.specialties,
          bio: _resData.bio,
          experience: _resData.experience,
          reviews: _resData.reviews,
          rating: _resData.rating,
          isActive: _resData.isActive,
          availability: _resData.availability,
          imageUrl: _resData.imageUrl,
          location: _resData.location,
          photos: _resData.photos,
          tabs: _resData.tabs,
          services: "",
          loading: false,
        };
        setProfileForm(_profileData);
        setServices(updatedServices);
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
    }
  };

  // FUNCTIONS
  const handleStatusChange = async (booking, newStatus) => {
    const _bookingItem = bookings.find((item) => item._id === booking._id);
    const _updatedBooking = { ..._bookingItem, status: newStatus };
    const res = await updateBookings(_updatedBooking);
    if (res.status === 200) {
      await loadBookings();
      showNotification("Bokning uppdaterad", "success");
    }
  };
  const handleStorageChange = (e) => {
    if (e.key === "bookings") {
      loadBookings();
    }
  };
  const showNotification = (message, severity = "success") => {
    setNotification({ message, severity });
    setTimeout(() => setNotification(null), 3000);
  };
  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setEditFormData({
      date: booking.date,
      time: booking.time,
      service: booking.service,
      status: booking.status,
    });
  };
  const handleDelete = async (bookingId) => {
    try {
      const res = await deleteBookings(bookingId);
      if (res.status === 200) {
        await loadBookings();
        showNotification("Bokning borttagen", "success");
      }
    } catch (err) {
      setError("Kunde inte ta bort bokningen");
      console.error("Error deleting booking:", err);
    }
  };
  const handleSaveEdit = async () => {
    try {
      const res = await updateBookings(editingBooking);
      if (res.status === 200) {
        await loadBookings();
        setEditingBooking(null);
        showNotification("Bokning uppdaterad", "success");
      }
    } catch (err) {
      setError("Kunde inte uppdatera bokningen");
      console.error("Error updating booking:", err);
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Ogiltigt datum";
      }
      return date.toLocaleDateString("sv-SE");
    } catch (error) {
      return "Ogiltigt datum";
    }
  };
  const formatTime = (timeString) => {
    try {
      if (!timeString) return "Ingen tid angiven";
      if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
        return timeString;
      }
      const time = new Date(timeString);
      if (isNaN(time.getTime())) {
        return "Ogiltig tid";
      }
      return time.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Ogiltig tid";
    }
  };
  const getStatistics = () => {
    const totalBookings = bookings.length;

    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed" || b.status === "Bekräftad"
    ).length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending" || b.status === "Väntar"
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled" || b.status === "Avbokad"
    ).length;

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
    };
  };
  const handleWeekDayChange = (item) => {
    const { e, weekDay } = item;

    setProfileForm((prev) => {
      const days = prev.availability.days;
      const updatedDays = e.target.checked
        ? [...days, weekDay]
        : days.filter((item) => item !== weekDay);

      return {
        ...prev,
        availability: {
          ...prev.availability,
          days: updatedDays,
        },
      };
    });
  };
  const handleTabChange = (item) => {
    const { e, tab } = item;

    setProfileForm((prev) => {
      const _tabs = prev.tabs;

      const updatedTabs = e.target.checked
        ? [..._tabs, tab]
        : _tabs.filter((item) => item !== tab);

      return {
        ...prev,
        tabs: updatedTabs,
      };
    });
  };
  const handleUpdateProfile = async () => {
    try {
      setProfileForm((prev) => ({ prev, loading: true }));
      // UPLOAD COVER IMAGE
      if (profileForm?.imageUrl instanceof File) {
        const formData = new FormData();
        formData.append("coverimage", profileForm.imageUrl);
        await uploadStylistCoverImage(formData);
      }
      // UPLOAD PHOTOS
      if (
        profileForm?.photos?.length > 0 &&
        profileForm?.photos?.[0] instanceof File
      ) {
        const formData = new FormData();
        for (let i = 0; i < profileForm.photos.length; i++) {
          const file = profileForm.photos[i];
          if (file instanceof File) {
            formData.append("photos", file); // key must match backend field name
          }
        }
        await uploadStylistPhotos(formData);
      }
      // UPLOAD PROFILE INFO
      const _services = services.map((item) => {
        const _splitedService = item.value.split(",");
        const formatedService = {
          name: _splitedService?.[0]?.trim() || "",
          price: _splitedService?.[1]?.trim() || "",
          duration: _splitedService?.[2]?.trim() || "",
          description: _splitedService?.[3]?.trim() || "",
        };
        return formatedService;
      });

      const profileData = {
        bio: profileForm?.bio,
        experience: profileForm?.experience,
        location: profileForm?.location,
        name: profileForm?.name,
        phone: profileForm?.phone,
        rating: profileForm?.rating,
        reviews: profileForm?.reviews,
        services: _services,
        specialties: profileForm?.specialties,
        tabs: profileForm?.tabs,
        isActive: profileForm?.isActive,
        loading: profileForm?.loading,
        availability: profileForm?.availability,
      };

      const profileRes = await updateStylistProfile(profileData);
      if (profileRes.status === 200) {
        showNotification("Profile updated successfully", "success");
        await getStylistDetail();
        setEditProfileDialog(false);
      }
    } catch (error) {
      console.error("Error in handleUpdateProfile:", error);
      showNotification("Fail to update", "error");
      setEditProfileDialog(false);
    } finally {
      setProfileForm((prev) => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const stats = getStatistics();

  return (
    <Container maxWidth="lg">
      {notification && (
        <Alert
          severity={notification.severity}
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          {notification.message}
        </Alert>
      )}
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr auto",
            },
            alignItems: "center",
            rowGap: 2,
            mb: 4,
          }}
        >
          <StyledTypography
            variant="h4"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              fontFamily: "Playfair Display, serif",
              color: "#D4AF37",
            }}
          >
            BokaEnkelt - Admin Panel
          </StyledTypography>
          <Box
            sx={{
              justifySelf: { xs: "start", sm: "end" },
            }}
          >
            <StyledButton
              variant="contained"
              onClick={() => setEditProfileDialog(true)}
              startIcon={<EditSquareIcon />}
            >
              Edit Profile
            </StyledButton>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: "Totalt antal bokningar", value: stats.totalBookings },
            { label: "Bekräftade bokningar", value: stats.confirmedBookings },
            { label: "Väntande bokningar", value: stats.pendingBookings },
            { label: "Avbokade bokningar", value: stats.cancelledBookings },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4">{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <StyledPaper>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Kund</TableCell>
                  <TableCell>Datum</TableCell>
                  <TableCell>Tid</TableCell>
                  <TableCell>Tjänst</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Åtgärder</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.customerPhone}</TableCell>
                    <TableCell>{formatDate(booking.date)}</TableCell>
                    <TableCell>{formatTime(booking.time)}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking, e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value="Bekräftad">Bekräftad</MenuItem>
                        <MenuItem value="Väntar">Väntar</MenuItem>
                        <MenuItem value="Avbokad">Avbokad</MenuItem>
                        <MenuItem value="Slutförd">Slutförd</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(booking)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(booking.id || booking._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        {/* EDIT BOOKINGS */}
        {editingBooking && (
          <Dialog open={editingBooking} onClose={() => setEditingBooking(null)}>
            <DialogTitle>Redigera Bokning</DialogTitle>
            <DialogContent>
              <Box sx={{ width: { xs: "100%", sm: "500px" } }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Kundnamn"
                      name="customerName"
                      value={editingBooking?.customerName || ""}
                      onChange={(e) => {
                        setEditFormData({
                          ...editFormData,
                          customerName: e.target.value,
                        });
                        setEditingBooking({
                          ...editingBooking,
                          customerName: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="date"
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => {
                        setEditFormData({
                          ...editFormData,
                          date: e.target.value,
                        });
                        setEditingBooking({
                          ...editingBooking,
                          date: e.target.value,
                        });
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="time"
                      type="time"
                      value={editFormData.time}
                      onChange={(e) => {
                        setEditFormData({
                          ...editFormData,
                          time: e.target.value,
                        });
                        setEditingBooking({
                          ...editingBooking,
                          time: e.target.value,
                        });
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tjänst"
                      name="service"
                      value={editFormData.service}
                      onChange={(e) => {
                        setEditFormData({
                          ...editFormData,
                          service: e.target.value,
                        });
                        setEditingBooking({
                          ...editingBooking,
                          service: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={editFormData.status}
                        onChange={(e) => {
                          setEditFormData({
                            ...editFormData,
                            status: e.target.value,
                          });
                          setEditingBooking({
                            ...editingBooking,
                            status: e.target.value,
                          });
                        }}
                        label="Status"
                      >
                        <MenuItem value="Bekräftad">Bekräftad</MenuItem>
                        <MenuItem value="Väntar">Väntar</MenuItem>
                        <MenuItem value="Avbokad">Avbokad</MenuItem>
                        <MenuItem value="Slutförd">Slutförd</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditingBooking(null)}>Avbryt</Button>
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                color="primary"
              >
                Spara
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* EDIT PROFILE */}
        {editProfileDialog && (
          <Dialog
            open={editProfileDialog}
            onClose={() => setEditProfileDialog(false)}
          >
            <DialogTitle>Redigera Bokning</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  width: { xs: "100%", sm: "500px" },
                }}
              >
                <Grid container spacing={2} mt={1}>
                  {/* COVER IMAGE */}
                  <Grid size={12}>
                    {typeof profileForm?.imageUrl === "string"
                      ? profileForm?.imageUrl?.length > 0 && (
                          <img
                            src={`${API_BASE_URL}/${profileForm.imageUrl}`}
                            alt="cover image"
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: 300,
                              borderRadius: "15px",
                              border: "solid 2px gray",
                            }}
                          />
                        )
                      : coverImg?.length > 0 && (
                          <img
                            src={coverImg}
                            alt="cover image"
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: 300,
                              borderRadius: "15px",
                              border: "solid 2px gray",
                            }}
                          />
                        )}

                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        style={{ textTransform: "capitalize" }}
                      >
                        Cover Image
                        <VisuallyHiddenInput
                          type="file"
                          onChange={(event) => {
                            const _files = event.target.files;
                            const coverImgUrl = URL.createObjectURL(_files[0]);

                            setCoverImg(coverImgUrl);
                            setProfileForm((prev) => ({
                              ...prev,
                              imageUrl: _files[0],
                            }));
                          }}
                        />
                      </Button>
                    </Grid>
                  </Grid>

                  {/* NAME */}
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Name"
                      name="name"
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => {
                        setProfileForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                      }}
                    />
                  </Grid>

                  {/* PHONE */}
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Phone"
                      name="phone"
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => {
                        setProfileForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }));
                      }}
                    />
                  </Grid>

                  {/* EXPERIENCE */}
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Experience"
                      name="experience"
                      type="number"
                      value={profileForm.experience}
                      onChange={(e) => {
                        const exp = Number(e.target.value);
                        if (exp >= 0) {
                          setProfileForm((prev) => ({
                            ...prev,
                            experience: e.target.value,
                          }));
                        }
                      }}
                    />
                  </Grid>

                  {/* REVIEWS */}
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Reviews"
                      name="reviews"
                      type="number"
                      value={profileForm.reviews}
                      onChange={(e) => {
                        const exp = Number(e.target.value);
                        if (exp >= 0) {
                          setProfileForm((prev) => ({
                            ...prev,
                            reviews: e.target.value,
                          }));
                        }
                      }}
                    />
                  </Grid>

                  {/* RATING */}
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Rating"
                      name="rating"
                      type="number"
                      value={profileForm.rating}
                      onChange={(e) => {
                        const exp = Number(e.target.value);
                        if (exp >= 0) {
                          setProfileForm((prev) => ({
                            ...prev,
                            rating: e.target.value,
                          }));
                        }
                      }}
                    />
                  </Grid>

                  {/* SPACIALITIES */}
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                    <Autocomplete
                      fullWidth
                      value={profileForm.specialties || []}
                      multiple
                      options={[]}
                      freeSolo
                      size="small"
                      clearOnEscape
                      onChange={(e, value, reason) => {
                        if (reason === "clear") {
                          setProfileForm((prev) => ({
                            ...prev,
                            specialties: [],
                          }));
                        }
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            size="small"
                            {...getTagProps({ index })}
                            onDelete={() => {
                              const _options = profileForm.specialties;
                              const updatedOptions = _options.filter(
                                (item) => item !== option
                              );
                              setProfileForm((prev) => ({
                                ...prev,
                                specialties: updatedOptions,
                              }));
                            }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Specialties"
                          placeholder="Enter specialties"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setProfileForm((prev) => ({
                                ...prev,
                                specialties: [
                                  ...prev.specialties,
                                  e.target.value,
                                ],
                              }));
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* BIO & ADDRESS */}
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                    <TextareaAutosize
                      fullWidth
                      placeholder="Bio"
                      style={{ width: "100%", height: "10%" }}
                      name="bio"
                      type="text"
                      value={profileForm.bio}
                      onChange={(e) => {
                        setProfileForm((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                    <TextareaAutosize
                      fullWidth
                      placeholder="Enter your address"
                      style={{ width: "100%", height: "10%" }}
                      name="address"
                      type="text"
                      value={profileForm?.location?.address}
                      onChange={(e) => {
                        setProfileForm((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            address: e.target.value,
                          },
                        }));
                      }}
                    />
                  </Grid>

                  {/* Map */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Enter Google Map Iframe URL"
                      name="name"
                      type="text"
                      value={profileForm?.location?.map}
                      onChange={(e) => {
                        setProfileForm((prev) => ({
                          ...prev,
                          location: { ...prev.location, map: e.target.value },
                        }));
                      }}
                    />
                  </Grid>

                  {/* AVABILITY */}
                  <Typography variant="body2">Avability</Typography>
                  <Grid container size={12}>
                    <Grid container size={12}>
                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          name="time"
                          type="time"
                          label="Starting Hour"
                          value={
                            profileForm?.availability?.hours?.start || "10:00"
                          }
                          onChange={(e) => {
                            const time = `${e.target.value?.split(":")[0]}:00`;
                            setProfileForm((prev) => ({
                              ...prev,
                              availability: {
                                ...prev.availability,
                                hours: {
                                  ...prev.availability.hours,
                                  start: time,
                                },
                              },
                            }));
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          name="time"
                          type="time"
                          label="Ending Hour"
                          value={
                            profileForm?.availability?.hours?.end || "18:00"
                          }
                          onChange={(e) => {
                            const time = `${e.target.value?.split(":")[0]}:00`;
                            setProfileForm((prev) => ({
                              ...prev,
                              availability: {
                                ...prev.availability,
                                hours: {
                                  ...prev.availability.hours,
                                  end: time,
                                },
                              },
                            }));
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="body2">Weekdays</Typography>
                      {WEEKDAYS?.map((weekDay, index) => {
                        const isChecked =
                          profileForm?.availability?.days.includes(weekDay);

                        return (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                size="small"
                                checked={isChecked}
                                onChange={(e) =>
                                  handleWeekDayChange({ e, weekDay })
                                }
                              />
                            }
                            label={weekDay}
                          />
                        );
                      })}
                    </Grid>
                  </Grid>

                  {/* TABS */}
                  <Grid size={12}>
                    <Typography variant="body2">Tabs</Typography>
                    {STYLIST_TABS?.map((tab, index) => {
                      const isChecked = profileForm?.tabs?.includes(tab);

                      return (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              size="small"
                              checked={isChecked}
                              onChange={(e) => handleTabChange({ e, tab })}
                            />
                          }
                          label={tab}
                        />
                      );
                    })}
                  </Grid>

                  {/* SERVICES */}
                  <Grid size={12}>
                    <Typography variant="body2" mb={1}>
                      Services
                    </Typography>
                    {services?.length > 0 &&
                      services?.map((service, index) => {
                        return (
                          <Box key={index} display="flex">
                            <Typography variant="body1" mb={1}>
                              {index + 1 + ". "}
                              {service.value}
                            </Typography>
                            <span
                              style={{
                                fontSize: 16,
                                color: "red",
                                cursor: "pointer",
                                marginLeft: 5,
                              }}
                              onClick={() => {
                                const filteredServices = services.filter(
                                  (item) => item.id !== service.id
                                );
                                setServices(filteredServices);
                              }}
                            >
                              Remove
                            </span>
                          </Box>
                        );
                      })}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 1,
                      }}
                    >
                      <TextField
                        label="Name, Price, Duration, Description"
                        size="small"
                        name="serviceName"
                        placeholder="ex. name, price, duration, description"
                        value={profileForm?.services || ""}
                        onChange={(e) => {
                          setProfileForm((prev) => ({
                            ...prev,
                            services: e.target.value,
                          }));
                        }}
                        sx={{ flex: 1, minWidth: "200px" }}
                      />
                      <Button
                        onClick={() => {
                          const _id = services.length + 1;
                          setServices((prev) => [
                            ...prev,
                            { id: _id, value: profileForm.services },
                          ]);
                          setProfileForm((prev) => ({ ...prev, services: "" }));
                        }}
                        variant="contained"
                        color="primary"
                      >
                        Add
                      </Button>
                    </Box>
                  </Grid>

                  {/* REVIEW IMAGES */}
                  <Grid size={12}>
                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        style={{ textTransform: "capitalize" }}
                      >
                        Choose Photos
                        <VisuallyHiddenInput
                          type="file"
                          multiple
                          onChange={async (event) => {
                            const _files = event.target.files;
                            const _previewURLS = [];

                            if (_files) {
                              for (let i = 0; i < _files.length; i++) {
                                const file = _files[i];
                                const _imgUrl = URL.createObjectURL(file);
                                _previewURLS.push(_imgUrl);
                              }
                              setReviewPhotos(_previewURLS);
                              setProfileForm((prev) => ({
                                ...prev,
                                photos: _files,
                              }));
                            }
                          }}
                        />
                      </Button>
                    </Grid>
                    <Grid container mt={2}>
                      {typeof profileForm?.photos?.[0] === "string"
                        ? profileForm?.photos?.map((image, index) => {
                            return (
                              <div
                                style={{
                                  position: "relative",
                                  width: "100%",
                                  maxWidth: "80px",
                                  height: "80px",
                                  aspectRatio: "4 / 1.3",
                                  borderRadius: "15px",
                                  marginRight: "0.5rem",
                                  marginBottom: "0.5rem",
                                  border: "2px solid gray",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  key={index}
                                  src={`${API_BASE_URL}/${image}`}
                                  alt="Uploaded"
                                  style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                  }}
                                />
                                <CloseIcon
                                  onClick={async () => {
                                    const filteredPhotos =
                                      profileForm.photos.filter(
                                        (_, indx) => indx !== index
                                      );
                                    const splitedImgName = image?.split("/");
                                    const imageName =
                                      splitedImgName[splitedImgName.length - 1];
                                    const res = await deletStylistImages(
                                      imageName
                                    );
                                    if (res.status === 200) {
                                      setProfileForm((prev) => ({
                                        ...prev,
                                        photos: filteredPhotos,
                                      }));
                                    }
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    color: "red",
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    zIndex: 9999,
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                    padding: "2px",
                                  }}
                                />
                              </div>
                            );
                          })
                        : reviewPhotos?.map((image, index) => {
                            return (
                              <div
                                style={{
                                  position: "relative",
                                  width: "13%",
                                  height: 60,
                                  borderRadius: "15px",
                                  marginRight: 5,
                                  marginBottom: 5,
                                  border: "solid 2px gray",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  key={index}
                                  src={image}
                                  style={{
                                    objectFit: "cover",
                                    width: "13%",
                                    height: 60,
                                  }}
                                />
                                <CloseIcon
                                  onClick={() => {
                                    const filteredPhotos = reviewPhotos.filter(
                                      (_, indx) => indx !== index
                                    );
                                    setReviewPhotos(filteredPhotos);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    color: "red",
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    zIndex: 999,
                                  }}
                                />
                              </div>
                            );
                          })}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              {!profileForm.loading && (
                <Button onClick={() => setEditProfileDialog(false)}>
                  Avbryt
                </Button>
              )}
              <Button
                onClick={handleUpdateProfile}
                variant="contained"
                color="primary"
                disabled={profileForm.loading ? true : false}
              >
                {profileForm.loading ? <CircularProgress size={18} /> : "Spara"}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Container>
  );
};

export default StylistDashboard;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: "linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%)",
  border: "1px solid #D4AF37",
  borderRadius: 16,
  boxShadow: "0 4px 8px rgba(212, 175, 55, 0.15)",
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Playfair Display, serif",
  color: "#D4AF37",
  marginBottom: theme.spacing(3),
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
// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   fontFamily: "Playfair Display, serif",
//   color: "#D4AF37",
//   fontWeight: "bold",
// }));
// const StyledTextField = styled(TextField)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       borderColor: "#D4AF37",
//     },
//     "&:hover fieldset": {
//       borderColor: "#B38B2D",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "#D4AF37",
//     },
//   },
//   "& .MuiInputLabel-root": {
//     color: "#D4AF37",
//     "&.Mui-focused": {
//       color: "#D4AF37",
//     },
//   },
// }));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
