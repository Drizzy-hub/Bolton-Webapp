import React, { useState, createContext, useEffect } from "react";

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [userData, setUserData]= useState();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser, userData, setUserData }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
