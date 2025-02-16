import React, {useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import SignupForm from '../Components/SignupForm';
import '../Styling/App.css'




function Signup() {
    const navigate = useNavigate();
    const { handleLogin, API_URL } = useContext(AppContext);
    const [errorState, setErrorState] = useState(false)
    const [errorMessage, seterrorMessage] = useState('')
    
    function handleSubmit(username, password, setSubmitting) {
      fetch(`${API_URL}api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then((r) => {
          if (r.ok) {

            handleLogin(username, password, setSubmitting, navigate);
            return r.json()
          } else {
            return r.json().then((data) => {
              // Now data is the parsed JSON object
              console.log(data);
              console.log(data.error);
              setErrorState(true);
              seterrorMessage(data.error)
              setSubmitting(false);
              throw new Error(data.error || "Signup failed");
            });
          }
        })
        .catch((err) => {
          console.error(err);
          setSubmitting(false);
        });

  }
  return (
    <main>
        <div className='login_wrapper'>
          <div className='background_wrapper' id='login'>
            <div className='_wrapper' id='login'>
              <div className='login_content'>
                <div className='login_header'><h2>Signup</h2>
                  <p>{errorState?
                    <p>{errorMessage}</p>
                  :null}
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