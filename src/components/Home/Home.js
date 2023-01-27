import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Axios from "../../api";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
} from "@mui/material";
import Modal from "../Modal/Modal";

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

const Home = () => {
  const [courses, setCourses] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  const [courseId, setCourseId] = React.useState(null);
  const [showCourseModal, setShowCourseModal] = React.useState(false);
  const [courseName, setCourseName] = React.useState("");
  const [radius, setRadius] = React.useState(null);
  const [showClassModal, setShowClassModal] = React.useState(false);
  const hiddenFileInput = React.useRef(null);

  const fileChangeHandler = async (event) => {
    const fileUploaded = event.target.files[0];
    const fileExt = fileUploaded.name.split(".").pop();
    console.log(fileExt, courseId);
    if (fileExt !== "csv" && fileExt !== "xlsx") {
      setIsError(true);
      setShowAlert(true);
      setAlertMessage("Only csv and xlsx format are allow");
      return;
    }
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("emails", fileUploaded);
    await Axios({
      method: "post",
      url: "/inviteStudentsToEnrollCourse",
      data: formData,
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

  const createCourseHandler = async () => {
    if (courseName.trim().length === 0) {
      setIsError(true);
      setShowAlert(true);
      setAlertMessage("Course Name can't be empty");
      return;
    }
    setShowCourseModal(false);
    await Axios({
      method: "post",
      url: "/createCourse",
      data: { courseName },
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
    setCourseName("");
    getCourses();
  };

  const openStartClassModalHandler = async (courseId, radius) => {
    setRadius(radius);
    setCourseId(courseId);
    setShowClassModal(true);
  };

  const startClassHandler = async () => {
    setShowClassModal(false);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await Axios({
          method: "post",
          url: "/startClass",
          data: {
            courseId,
            radius,
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
        setAlertMessage("Allow Location Access to Start Class");
      }
    );
  };
  const endClassHandler = async (course) => {
    await Axios({
      method: "post",
      url: "/dismissClass",
      data: { courseId: course._id },
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
    await Axios("/getCourses")
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
          justifyContent: "center",
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
      {showCourseModal && (
        <Modal
          open={showCourseModal}
          setOpen={setShowCourseModal}
          onSuccess={createCourseHandler}
          title="Create Course"
          label="Course Name"
          enteredValue={courseName}
          setEnteredvalue={setCourseName}
          successButton="Create"
          content="Please Enter the Course Name"
        />
      )}
      {showClassModal && (
        <Modal
          open={showClassModal}
          setOpen={setShowClassModal}
          onSuccess={startClassHandler}
          title="Start Class"
          label="Class Radius"
          enteredValue={radius}
          setEnteredvalue={setRadius}
          successButton="Start"
          content="Change if You want to modify the class radius"
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
                Course Code
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }} align="right">
                Start Class
              </StyledTableCell>
              {window.innerWidth >= 500 && (
                <StyledTableCell sx={{ fontWeight: 700 }} align="right">
                  Total Student
                </StyledTableCell>
              )}
              {window.innerWidth >= 500 && (
                <StyledTableCell sx={{ fontWeight: 700 }} align="right">
                  Default Radius
                </StyledTableCell>
              )}
              {window.innerWidth >= 500 && (
                <StyledTableCell sx={{ fontWeight: 700 }} align="right">
                  Invite Students
                </StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  {row.courseName}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.courseCode}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    onClick={() => {
                      row.activeClass
                        ? endClassHandler(row)
                        : openStartClassModalHandler(row._id, row.radius);
                    }}
                  >
                    {row.activeClass ? <CloseIcon /> : <AddCircleIcon />} Class
                  </Button>
                </StyledTableCell>
                {window.innerWidth >= 500 && (
                  <StyledTableCell align="right">
                    {row.students.length}
                  </StyledTableCell>
                )}
                {window.innerWidth >= 500 && (
                  <StyledTableCell align="right">{row.radius}</StyledTableCell>
                )}
                {window.innerWidth >= 500 && (
                  <StyledTableCell align="right">
                    <Button
                      onClick={() => {
                        hiddenFileInput.current.click();
                        setCourseId(row._id);
                      }}
                    >
                      <UploadFileIcon />
                      <input
                        ref={hiddenFileInput}
                        onChange={fileChangeHandler}
                        type="file"
                        accept={[".xls", ".xlsx", ".csv"]}
                        style={{ display: "none" }}
                      />
                    </Button>
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ "& > :not(style)": { m: 5, mt: 4 } }}>
        <Fab
          onClick={() => setShowCourseModal(true)}
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
      </Box>
    </Stack>
  );
};

export default Home;
