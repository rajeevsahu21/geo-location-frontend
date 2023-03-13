import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Axios from "../../api";
import Modal from "../Modal/Modal";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://gkv.ac.in/" target="_blank">
        GKV University
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Auth() {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("teacher");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const requestbody = isSignUp
      ? {
          email: data.get("email"),
          password: data.get("password"),
          name: `${data.get("firstName").trim()} ${data
            .get("lastName")
            .trim()}`,
          role: role,
          registrationNo: role === "student" ? data.get("registrationNo") : "",
        }
      : { email: data.get("email"), password: data.get("password") };
    await Axios({
      method: "post",
      url: isSignUp ? "/auth/signUp" : "/auth/login",
      data: requestbody,
    })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("name", res.data.user.name);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("profile", res.data.user?.profileImage);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setShowError(err.response.data.message);
      });
    setIsLoading(false);
  };
  const handleGoogle = async (google) => {
    setIsLoading(true);
    await Axios.post("/auth/google", {
      credential: google.credential,
    })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.user.name);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("profile", res.data.user?.profileImage);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setShowError(err.response.data.message);
      });
    setIsLoading(false);
  };
  const forgotPassword = async (email) => {
    setShowModal(false);
    setIsLoading(true);
    await Axios({
      method: "post",
      url: "/auth/recover",
      data: { email },
    })
      .then((res) => {
        setShowSuccess(res.data.message);
      })
      .catch((err) => {
        console.error(err);
        setShowError(err.response.data.message);
      });
    setIsLoading(false);
  };

  React.useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogle,
      });

      google.accounts.id.renderButton(document.getElementById("googleDiv"), {
        type: "standard",
        theme: "filled_blue",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
      });
      if (localStorage.getItem("token") === null) {
        google.accounts.id.prompt();
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {showModal && (
        <Modal
          open={showModal}
          setOpen={setShowModal}
          onSuccess={forgotPassword}
          title="Forgot Password"
          label="Email Address"
          enteredValue={email}
          setEnteredvalue={setEmail}
          successButton="Send"
          content="To forgot password for this website, please enter your email address
 here. you will get forgot password link into your email."
        />
      )}
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignUp ? "Create An Account!" : "Welcome Back!"}
          </Typography>
          {(showError || showSuccess) && (
            <Alert severity={showError ? "error" : "success"}>
              {showError ? showError : showSuccess}
            </Alert>
          )}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            {isSignUp && (
              <Box sx={{ minWidth: 120, mb: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">
                    SignUp As
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role}
                    label="SignUp As"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value={"student"}>Student</MenuItem>
                    <MenuItem value={"teacher"}>Teacher</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
            <Grid container spacing={2}>
              {isSignUp && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
              )}
              {isSignUp && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
              )}
              {isSignUp && role === "student" && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="registrationNo"
                    label="Registration No."
                    name="registrationNo"
                    autoComplete="text"
                    type="text"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword((prevState) => !prevState)
                          }
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading ? true : false}
            >
              {isLoading ? (
                <CircularProgress size={26} />
              ) : isSignUp ? (
                "Sign up"
              ) : (
                "Sign In"
              )}
            </Button>
            <div
              id="googleDiv"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            ></div>
            <Grid container justifyContent="flex-end">
              {!isSignUp && (
                <Grid item xs>
                  <Button
                    onClick={() => {
                      setShowModal(true);
                    }}
                    variant="text"
                  >
                    Forgot password?
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button
                  onClick={() => {
                    setIsSignUp((prevState) => !prevState);
                  }}
                  variant="text"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
