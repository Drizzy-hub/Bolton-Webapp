import React, { useState, createContext } from "react";

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  return (
    <AuthenticatedUserContext.Provider
      value={{ user, setUser, userData, setUserData }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
