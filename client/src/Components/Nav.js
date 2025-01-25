import React from 'react'
import '../App.css'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';



function Nav({user}) {
  const navigate = useNavigate()
  return (
    <div className='main_nav_wrapper'>
        <nav className='main_nav'>
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/transactions" className="nav-link">Transactions</NavLink>
        <p>Users</p>
        <NavLink to="/accounts" className="nav-link">Accounts</NavLink>
        <NavLink to="/cards" className="nav-link">Cards</NavLink>
        {user?<button id = "signup" onClick={()=>fetch('/api/clear_session')
          .then(r=>r.json)
          .then(
            // alert("Logged Out")
            navigate('/login')
            )
          }
          >Logout</button>:
          <button id = "signup" onClick={()=>{navigate('/login')}}>Login</button>}
        </nav>
    </div>
  )
}

export default Nav