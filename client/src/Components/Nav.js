import React, { useContext, useEffect } from 'react'
import '../App.css'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';



function Nav() {
  const navigate = useNavigate()
  const { user,setUser,setBanks } = useContext(AppContext);

  const handleLogout = () => {
    fetch('/api/clear_session', {
      method: "DELETE",
    })
      .then(() => {
        alert("Logged Out");
        setUser(null)
        setBanks(null)
        navigate('/login');
      })
      .catch((error) => console.error('Error:', error)); // Optional: handle fetch error
  };
  return (
    <div className='main_nav_wrapper'>
        <nav className='main_nav'>
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/accounts" className="nav-link">Accounts</NavLink>
        <NavLink to="/cards" className="nav-link">Cards</NavLink>
        <NavLink to="/insights" className="nav-link">Insights</NavLink>
        {user?<button id = "signup" onClick={handleLogout}
          >Logout</button>:
          <button id = "signup" onClick={()=>{navigate('/login')}}>Login</button>}
        </nav>
    </div>
  )
}

export default Nav