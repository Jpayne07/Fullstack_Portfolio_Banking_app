import React, { useContext } from 'react'
import './App.css';
import Nav from './Components/Nav';
import {Outlet, useNavigate } from 'react-router-dom';
import Login from './Pages/Login';
import AppContext from './AppContext';




function App() {
  const { user } = useContext(AppContext);

  if (!user) return <Login />;

  return (
    <main>
      <Nav user={user} />
      <Outlet />
    </main>
  );
}

export default App
