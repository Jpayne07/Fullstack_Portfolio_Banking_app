import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './App.css';
import './Forms.css'
import './Modules.css'
import Nav from './Components/Nav';
import {Outlet } from 'react-router-dom';
import Login from './Pages/Login';
import AppContext from './AppContext';




function App() {
  const navigate=useNavigate()
  const { user, loading, setUser, setLoading } = useContext(AppContext);
  const [sessionChecked, setSessionChecked] = useState(false);

  

  useEffect(() => {
    fetch("/api/check_session").then((response) => {
      if (response.ok) {
        response.json()
        .then((user) => setUser(user))
      }
    });
  }, []);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login'); // Redirect only if not loading and user is null
    }
  }, [loading, user, navigate]);
  
  // Log user when it changes
  useEffect(() => {
    console.log('User state:', user);
  }, [user]);

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
