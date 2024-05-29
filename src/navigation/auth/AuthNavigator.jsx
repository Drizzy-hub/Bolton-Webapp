import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login, NoPage, Signup } from '../../pages';

const AuthNavigator = () => {
  return (
    <Routes>
    <Route index path="login" element={<Login/>} />
      <Route path="signup" element={<Signup/>} />
      <Route path="*" element={<NoPage />} />
  </Routes>
  );
};

export default AuthNavigator;