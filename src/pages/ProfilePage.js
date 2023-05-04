import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import AuthContext from "../store/auth-context";
import useAxios from "../api";

const ProfilePage = () => {
  const Axios = useAxios();
  const authCtx = useContext(AuthContext);
  const [name, setName] = useState(authCtx.user.name);
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    await Axios({
      url: "/user",
      method: "PUT",
      data: { name },
    })
      .then((res) => {
        setEditMode(false);
        setShowAlert(true);
        setAlertMessage(res.data.message);
        setIsError(false);
        authCtx.setUser((prev) => ({ ...prev, name }));
      })
      .catch((err) => {
        setShowAlert(true);
        setAlertMessage(err.response.data.message);
        setIsError(true);
      });
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <Stack
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
      }}
      spacing={3}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={isError ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Avatar
        alt={authCtx.user.name}
        src={authCtx.user?.profileImage}
        sx={{ width: 120, height: 120 }}
      />
      <TextField
        style={{ margin: 20 }}
        label="Name"
        variant="outlined"
        value={name}
        onChange={handleNameChange}
        disabled={!editMode}
      />
      {!editMode && (
        <Button
          style={{ margin: 2 }}
          variant="contained"
          color="primary"
          startIcon={<Edit />}
          onClick={handleEditClick}
        >
          Edit Name
        </Button>
      )}
      {editMode && (
        <Button
          style={{ margin: 2 }}
          variant="contained"
          color="primary"
          onClick={handleSaveClick}
        >
          Save Name
        </Button>
      )}
      <Typography variant="h6" component="h6">
        EMAIL: {authCtx.user.email.toUpperCase()}
      </Typography>
      <Typography variant="h6" component="h6">
        ROLE: {authCtx.user.role.toUpperCase()}
      </Typography>
    </Stack>
  );
};

export default ProfilePage;
