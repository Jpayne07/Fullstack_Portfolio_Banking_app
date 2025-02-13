import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import SignupForm from '../Components/SignupForm';
import '../Styling/App.css'




function Signup() {
    const navigate = useNavigate();
    const { handleLogin } = useContext(AppContext);

    function handleSubmit(username, password, setSubmitting) {
        fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        })
        .then((r) => {
          if (r.ok) {
            (handleLogin(username, password, setSubmitting, navigate))
          
          }
          else {
            alert("Signup is Wrong!")
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