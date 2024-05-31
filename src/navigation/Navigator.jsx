import React, { useContext } from 'react';
import { BrowserRouter,  Navigate,  Route, Routes} from 'react-router-dom';
import { AuthNavigator } from './auth';
import { AuthenticatedUserContext} from '../provider';
import { AppNavigator } from './app';
import { NoPage } from '../pages';



const Navigator = () => {
  const { user } = useContext(AuthenticatedUserContext);
  
  return (
    <BrowserRouter>
      <Routes>
        {AuthNavigator.map(({ path, Component, name }) => (
          <Route 
            key={name} 
            path={path} 
            element={!user ? <Component /> : <Navigate to="/" />} 
          />
        ))}
        {AppNavigator.map(({ path, Component, name }) => (
          <Route 
            key={name} 
            path={path} 
            element={user?.accessToken ? <Component /> : <Navigate to="/login" />} 
          />
        ))}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigator;