import { useContext } from "react";
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
import AuthContext from "./store/auth-context";
import Message from "./components/Message/Message";

const App = () => {
  const authCtx = useContext(AuthContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: authCtx.isLoggedIn ? (
        <>
          <Navbar />
          {authCtx.user?.role === "teacher" ? <Home /> : <StudentHome />}
        </>
      ) : (
        <Auth />
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "courses",
      element: authCtx.isLoggedIn ? (
        <>
          <Navbar />
          <Course />
        </>
      ) : (
        <Auth />
      ),
    },
    {
      path: "messages",
      element: authCtx.isLoggedIn ? (
        <>
          <Navbar />
          <Message />
        </>
      ) : (
        <Auth />
      ),
    },
    {
      path: "course/:courseId",
      element: authCtx.isLoggedIn ? (
        <>
          <Navbar />
          <SingleCourse />
        </>
      ) : (
        <Auth />
      ),
    },
    {
      path: "classes/:courseId",
      element: authCtx.isLoggedIn ? (
        <>
          <Navbar />
          <Class />
        </>
      ) : (
        <Auth />
      ),
    },
    {
      path: "class/:classId",
      element: authCtx.isLoggedIn ? (
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
