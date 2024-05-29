import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import { AuthNavigator } from './auth';



const Navigator = () => {
  return (
   <BrowserRouter>
   <AuthNavigator/>
   </BrowserRouter>
  );
};

export default Navigator;