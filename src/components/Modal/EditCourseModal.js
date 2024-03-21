import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";

export default function EditCourseModal({
  open,
  setOpen,
  title,
  label,
  label1,
  course,
  setCourse,
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
          value={course.courseName}
          variant="standard"
          onChange={(e) => {
            setCourse((prev) => {
              return { ...prev, courseName: e.target.value };
            });
          }}
        />
        <FormLabel component="legend">{label1}</FormLabel>
        <FormControlLabel
          control={
            <Switch
              checked={course.isActive}
              onChange={(e) => {
                setCourse((prev) => {
                  return { ...prev, isActive: e.target.checked };
                });
              }}
              name="active"
            />
          }
          label={course.isActive ? "Deactivate" : "Activate"}
          labelPlacement="start"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSuccess}>{successButton}</Button>
      </DialogActions>
    </Dialog>
  );
}
