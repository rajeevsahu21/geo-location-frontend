import axios from "axios";

const Axios = axios.create({
  baseURL: "https://geo-location.onrender.com/api",
  headers: { "x-access-token": localStorage.getItem("token") },
});

export default Axios;
