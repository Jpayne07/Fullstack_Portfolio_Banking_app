import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './Styling/App.css'
import './Styling/Forms.css'
import './Styling/Modules.css'
import Nav from './Components/Nav';
import {Outlet } from 'react-router-dom';
import Login from './Pages/Login';
import AppContext from './AppContext';




function App() {
  const navigate=useNavigate()
  const { user, loading} = useContext(AppContext);

  


  useEffect(() => {
    if (!loading && !user) {
      console.log("Loading in use effect:", loading)
      console.log('User state:', user);
      navigate('/login'); // Redirect only if not loading and user is null
    }
  }, [loading, user, navigate]);


  if (loading) {
    return <div>Loading...</div>; // Display loading indicator
  }
  if (!user) return <Login />;
  if (!loading){
  return (
    <main>
      <Nav />
      <Outlet />
    </main>
  );
}
}

export default App
