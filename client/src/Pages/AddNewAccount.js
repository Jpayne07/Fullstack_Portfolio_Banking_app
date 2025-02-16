import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AddNewAccountForm from '../Components/AddNewAccountForm';
import AppContext from '../AppContext';
import '../Styling/App.css'

function AddNewAccount() {
    const navigate = useNavigate();
    const { API_URL } = useContext(AppContext);
    const [errorState, setErrorState] = useState(false)
    function handleNewAccountSubmission(bank_name, account_value, account_type, setSubmitting) {
        fetch(`${API_URL}api/account`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({bank_name, account_value, account_type}),
        })
        .then((r) => {
          if (r.ok) {
            navigate('/accounts')
            .then(document.location.reload())
          
          }
          else {
            console.log("Something went wrong")
            setSubmitting(false)
            setErrorState(true)
            
          }})
          
      }


  return (
    <main>
        <div className='login_wrapper'>
          <div className='background_wrapper' id='login'style = {{width:"1200px", maxWidth:"600px"}}>
            <div className='_wrapper' id='login' style = {{width:"1200px", maxWidth:"600px"}}> 
              <div className='login_content'>
                <div className='login_header'><h2>Create New Bank Account</h2>
                  {errorState?<p>Invalid account information. Bank name must be less than 30 characters and account value must be positive.</p>:null}
                </div>
                <AddNewAccountForm handleNewAccountSubmission={handleNewAccountSubmission}/>
              </div>
            </div>
          </div>
        </div>
        
    
    </main>
  )
}

export default AddNewAccount