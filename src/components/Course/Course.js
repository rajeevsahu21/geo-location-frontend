import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import useAxios from "../../api";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AlertModal from "../Modal/AlertModal";

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

const Course = () => {
  const Axios = useAxios();
  const navigate = useNavigate();
  const [courses, setCourses] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  const [courseId, setCourseId] = React.useState(null);
  const [showAlertModal, setShowAlertModal] = React.useState(false);

  const sendAttendance = async (course) => {
    await Axios({
      method: "post",
      url: "/course/attendance",
      params: { courseId: course._id },
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
  };

  const deleteCourseHandler = async () => {
    setShowAlertModal(false);
    await Axios({
      method: "delete",
      url: `/course/${courseId}`,
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
    getCourses();
  };

  const toggleCourseEnrollment = async (course, toggle) => {
    await Axios({
      method: "put",
      url: `/course/${course._id}`,
      data: {
        toggle,
      },
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
      {showAlertModal && (
        <AlertModal
          open={showAlertModal}
          setOpen={setShowAlertModal}
          title="Delete Course"
          content="Are you sure you want to delete this Course?"
          successButton="Delete"
          onSuccess={deleteCourseHandler}
        />
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Course Name
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Send Attendance
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Class Data
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Students
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Toogle Enrollment
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Delete Course
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  {row.courseName}
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    onClick={() => {
                      sendAttendance(row);
                    }}
                  >
                    <ForwardToInboxIcon />
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    onClick={() => {
                      navigate(`/classes/${row._id}`);
                    }}
                  >
                    class <CalendarViewMonthIcon />
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    onClick={() => {
                      navigate(`/course/${row._id}`);
                    }}
                  >
                    {row.students.length}
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    onClick={() => {
                      row.isActive
                        ? toggleCourseEnrollment(row, false)
                        : toggleCourseEnrollment(row, true);
                    }}
                  >
                    {row.isActive ? <LockOpenIcon /> : <LockIcon />}
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    onClick={() => {
                      setCourseId(row._id);
                      setShowAlertModal(true);
                    }}
                  >
                    <DeleteForeverIcon />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default Course;
