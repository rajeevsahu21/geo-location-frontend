import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";

export default function EditUserModal({
  open,
  setOpen,
  title,
  label,
  label1,
  user,
  setUser,
  content,
  onSuccess,
  successButton,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={label}
          fullWidth
          value={user.name}
          variant="standard"
          onChange={(e) => {
            setUser((prev) => {
              return { ...prev, name: e.target.value };
            });
          }}
        />
        <TextField
          margin="dense"
          id="email"
          type="email"
          label={label1}
          fullWidth
          value={user.email}
          variant="standard"
          onChange={(e) => {
            setUser((prev) => {
              return { ...prev, email: e.target.value };
            });
          }}
        />
        <Box sx={{ minWidth: 120, mb: 2, mt: 2 }}>
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={user.role}
              label="Role"
              onChange={(e) => {
                setUser((prev) => {
                  return { ...prev, role: e.target.value };
                });
              }}
            >
              <MenuItem value={"student"}>Student</MenuItem>
              <MenuItem value={"teacher"}>Teacher</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSuccess}>{successButton}</Button>
      </DialogActions>
    </Dialog>
  );
}
