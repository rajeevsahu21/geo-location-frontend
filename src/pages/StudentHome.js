import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddTaskIcon from "@mui/icons-material/AddTask";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import useAxios from "../api";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
} from "@mui/material";
import Modal from "../components/Modal/Modal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StudentHome = () => {
  const Axios = useAxios();
  const [courses, setCourses] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  const [courseCode, setCourseCode] = React.useState("");
  const [markBtn, setMarkBtn] = React.useState(false);
  const [showEnrollCourseModal, setShowEnrollCourseModal] =
    React.useState(false);

  const markAttendanceHandler = async (courseId) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setMarkBtn(true);
        await Axios({
          method: "put",
          url: "/class",
          data: {
            courseId,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          },
        })
          .then((res) => {
            setIsError(false);
            setShowAlert(true);
            setAlertMessage(res.data.message);
          })
          .catch((err) => {
            setMarkBtn(false);
            setIsError(true);
            setShowAlert(true);
            setAlertMessage(err.response.data.message);
          });
        getCourses();
      },
      (err) => {
        console.error(err);
        setIsError(true);
        setShowAlert(true);
        setAlertMessage("Allow Location Access to Mark Attendance");
      }
    );
  };

  const enrollCourseHandler = async () => {
    if (courseCode.trim().length === 0) {
      setIsError(true);
      setShowAlert(true);
      setAlertMessage("Course Code can't be empty");
      return;
    }
    setShowEnrollCourseModal(false);
    await Axios({
      method: "post",
      url: "/course/enroll",
      data: { courseCode },
    })
      .then((res) => {
        setIsError(false);
        setShowAlert(true);
        setAlertMessage(res.data.message);
      })
      .catch((err) => {
        setIsError(true);
        setShowAlert(true);
        setAlertMessage(err.response.data.message);
      });
    setCourseCode("");
    getCourses();
  };

  const getCourses = async () => {
    await Axios("/course")
      .then((res) => {
        setCourses(res.data.data);
      })
      .catch((err) => {
        setIsError(true);
        setShowAlert(true);
        setAlertMessage(err.response.data.message);
      });
    setIsLoading(false);
  };
  React.useEffect(() => {
    getCourses();
    const interval = setInterval(() => getCourses(), 4000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "90vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack sx={{ width: "100%" }}>
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
      {showEnrollCourseModal && (
        <Modal
          open={showEnrollCourseModal}
          setOpen={setShowEnrollCourseModal}
          onSuccess={enrollCourseHandler}
          title="Enroll Course"
          label="Course Code"
          enteredValue={courseCode}
          setEnteredvalue={setCourseCode}
          successButton="Join"
          content="Please Enter the Course Code"
        />
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Course Name
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }} align="right">
                Mark Attendance
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  {row.courseName}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    disabled={markBtn ? true : row.activeClass ? false : true}
                    variant="contained"
                    onClick={() => {
                      markAttendanceHandler(row._id);
                    }}
                  >
                    <AddTaskIcon />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ position: "fixed", right: "40px", bottom: "40px" }}>
        <Fab
          onClick={() => setShowEnrollCourseModal(true)}
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
      </Box>
    </Stack>
  );
};

export default StudentHome;
