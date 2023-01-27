import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Auth from "./components/Auth/Auth";
import Class from "./components/Class/Class";
import SingleClass from "./components/Class/SingleClass";
import Course from "./components/Course/Course";
import SingleCourse from "./components/Course/SingleCourse";
import ErrorPage from "./components/Error/ErrorPage";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import StudentHome from "./pages/StudentHome";

const App = () => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
    if (token) {
      const decodedJwt = JSON.parse(atob(token.split(".")[1]));
      if (decodedJwt.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
      }
    }
  }, [token]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? (
        <>
          <Navbar /> {role === "teacher" ? <Home /> : <StudentHome />}
        </>
      ) : (
        <Auth />
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "courses",
      element: isAuthenticated ? (
        <>
          <Navbar />
          <Course />
        </>
      ) : (
        <Auth />
      ),
    },
    {
      path: "course/:courseId",
      element: isAuthenticated ? (
        <>
          <Navbar />
          <SingleCourse />
        </>
      ) : (
        <Auth />
      ),
    },
    {
      path: "Classes/:courseId",
      element: isAuthenticated ? (
        <>
          <Navbar />
          <Class />
        </>
      ) : (
        <Auth />
      ),
    },
    {
      path: "Class/:classId",
      element: isAuthenticated ? (
        <>
          <Navbar />
          <SingleClass />
        </>
      ) : (
        <Auth />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
