import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAxios from "../api";
import EditUserModal from "../components/Modal/EditUserModal";

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

export default function AdminHome({ searchTerm }) {
  const navigate = useNavigate();
  const Axios = useAxios();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [users, setUsers] = React.useState([]);
  const [total, setTotal] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const updateUserHandler = async () => {
    setShowModal(false);
    await Axios({
      url: `/user/detail`,
      method: "PUT",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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
    getUsers();
  };

  const getUsers = async () => {
    await Axios(
      `/user?pageNumber=${
        page + 1
      }&limit=${rowsPerPage}&searchTerm=${searchTerm}`
    )
      .then((res) => {
        setUsers(res.data.data);
        setTotal(res.data.total);
      })
      .catch((err) => {
        setIsError(true);
        setShowAlert(true);
        setAlertMessage(err.response.data.message);
      });
    setIsLoading(false);
  };
  React.useEffect(() => {
    getUsers();
  }, [page, rowsPerPage, searchTerm]);

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

  if (!users.length) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "90vh",
          justifyContent: "center",
          alignItems: "center",
          mr: 10,
          ml: 10,
        }}
      >
        <Typography variant="h2" component="h2">
          No User Found
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
      {showModal && (
        <EditUserModal
          open={showModal}
          setOpen={setShowModal}
          onSuccess={updateUserHandler}
          user={user}
          setUser={setUser}
          title="Update User"
          label="Name"
          label1="Email Address"
          successButton="Update"
          content="Change Any Field to Update User Details"
        />
      )}
      <TableContainer sx={{ maxHeight: "83.6vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontWeight: 700 }}>Name</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }} align="right">
                Email
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }} align="right">
                Role
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }} align="right">
                Edit User
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 700 }} align="right">
                Courses
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">{row.email}</StyledTableCell>
                <StyledTableCell align="right">{row.role}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    onClick={() => {
                      setUser(row);
                      setShowModal(true);
                    }}
                  >
                    <EditIcon />
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    onClick={() => {
                      navigate(`/courses`, {
                        state: { userId: row._id, role: row.role },
                      });
                    }}
                  >
                    <ArrowForwardIosIcon />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15, 25, 100]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
