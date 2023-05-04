import React, { useEffect, useState } from "react";
import useAxios from "../api";

const AuthContext = React.createContext({
  isLoggedIn: false,
  user: {},
  setUser: (user) => {},
  token: null,
  onLogin: (token, user) => {},
  onLogout: () => {},
});

export const AuthContextProvider = (props) => {
  const Axios = useAxios();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    setToken(userToken);
    if (userToken) {
      Axios("/user/me")
        .then((res) => {
          setIsLoggedIn(true);
          setUser(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setToken(null);
  };

  const loginHandler = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        user: user,
        setUser: setUser,
        token: token,
        onLogin: loginHandler,
        onLogout: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
