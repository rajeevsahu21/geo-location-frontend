import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Axios from "../../api";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
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

const Class = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [classes, setClasses] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  const [classId, setClassId] = React.useState(null);
  const [showAlertModal, setShowAlertModal] = React.useState(false);

  const deleteClassHandler = async () => {
    setShowAlertModal(false);
    await Axios({
      method: "delete",
      url: "/deleteClassById",
      params: { classId },
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
    getClasses();
  };

  const getClasses = async () => {
    await Axios({ url: "/getClassesByCourseId", params: { courseId } })
      .then((res) => {
        setClasses(res.data.data);
      })
      .catch((err) => {
        setIsError(true);
        setShowAlert(true);
        setAlertMessage(err.response.data.message);
      });
    setIsLoading(false);
  };

  React.useEffect(() => {
    getClasses();
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
      {showAlertModal && (
        <AlertModal
          open={showAlertModal}
          setOpen={setShowAlertModal}
          title="Delete Class"
          content="Are you sure you want to delete this Class?"
          successButton="Delete"
          onSuccess={deleteClassHandler}
        />
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Created Date
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Is Active
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Students
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }}>Radius</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }}>
                Delete Class
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  {new Date(row.createdAt).toLocaleString("en-GB")}
                </StyledTableCell>
                <StyledTableCell>{row.active ? "Yes" : "No"}</StyledTableCell>
                <StyledTableCell>
                  <Button
                    onClick={() => {
                      navigate(`/class/${row._id}`);
                    }}
                  >
                    {row.students.length}
                  </Button>
                </StyledTableCell>
                <StyledTableCell>{row.radius}</StyledTableCell>
                <StyledTableCell>
                  <Button
                    onClick={() => {
                      setClassId(row._id);
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

export default Class;
