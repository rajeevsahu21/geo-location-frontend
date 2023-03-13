import axios from "axios";

const Axios = axios.create({
  baseURL: process.env.REACT_APP_URL,
  headers: { "x-access-token": localStorage.getItem("token") },
});

export default Axios;
