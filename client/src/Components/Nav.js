import React, { useContext, useState } from 'react'
import '../Styling/App.css'
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

  const [isVisible, setIsVisible] = useState(false);

  const toggleLinks = () => {
    setIsVisible((prev) => !prev);
  };

  
  return (<div>
    <div class="topnav">
      <div className='mobile'><i class="fa fa-bars" id='hamburger' onClick={toggleLinks}></i></div>
    
        <div id="myLinks" style={{ display: isVisible ? "flex" : "none" }}>
        <NavLink to="/" className="nav-link" id='mobile' onClick={toggleLinks}>Home</NavLink>
        <NavLink to="/accounts" className="nav-link" id='mobile' onClick={toggleLinks}>Accounts</NavLink>
        <NavLink to="/insights" className="nav-link" id='mobile' onClick={toggleLinks}>Insights</NavLink>
        {user?<button id = "signup" onClick={handleLogout}
          >Logout</button>:
          <button id = "signup" onClick={()=>{navigate('/login')}}>Login</button>}
        </div>
      </div>
    <div className='main_nav_wrapper'>
      
        <nav className='main_nav' id='desktop'>
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/accounts" className="nav-link">Accounts</NavLink>
        <NavLink to="/insights" className="nav-link">Insights</NavLink>
        {user?<button id = "signup" onClick={handleLogout}
          >Logout</button>:
          <button id = "signup" onClick={()=>{navigate('/login')}}>Login</button>}
        </nav>
    </div>
    </div>
  )
}

export default Nav