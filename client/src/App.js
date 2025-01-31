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
    const checkSession = async () => {
      try {
        // setLoading(true); // Start loading
        const res = await fetch('/api/check_session');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        // setLoading(false); // Stop loading in finally block to ensure it's called in all cases

      }
    };
  
    checkSession();
  }, [setUser, setLoading]); // Include setLoading in dependency array
  
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
