import React, {useState, useEffect, useContext} from 'react'
import AppContext from '../AppContext';
import '../Styling/App.css'
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import SignupForm from '../Components/SignupForm';




function Signup() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const { setUser, handleLogin } = useContext(AppContext);

    function handleSubmit(username, password) {
        fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        })
        .then((r) => {
          if (r.ok) {
            (handleLogin(username, password))
          
          }
          else {
            alert("Wrong!")
          }})
          
      }


  return (
    <main>
        <div className='login_wrapper'>
          <div className='background_wrapper' id='login'>
            <div className='_wrapper' id='login'>
              <div className='login_content'>
                <div className='login_header'><h2>Login</h2>
                  <p>Don't have an account? 
                    <a href='/signup' id = "signup">Signup</a>
                  </p>
                </div>
                <SignupForm handleSubmit={handleSubmit}/>
              </div>
            </div>
          </div>
        </div>
        
    
    </main>
  )
}

export default Signup