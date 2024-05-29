import React from 'react';
import { BrowserRouter,Routes} from 'react-router-dom';
import { AppNavigator } from './app';
import { AuthNavigator } from './auth';



const Navigator = () => {
  return (
   <BrowserRouter>
   <AuthNavigator/>
   </BrowserRouter>
  );
};

export default Navigator;