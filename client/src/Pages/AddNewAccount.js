import React from 'react'
import { useNavigate } from 'react-router-dom';
import AddNewAccountForm from '../Components/AddNewAccountForm';
import '../Styling/App.css'

function AddNewAccount() {
    const navigate = useNavigate();
    function handleSubmit(bank_name, account_value, account_type) {
        fetch("/api/account", {
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
          }})
          
      }


  return (
    <main>
        <div className='login_wrapper'>
          <div className='background_wrapper' id='login'style = {{width:"1200px", maxWidth:"600px"}}>
            <div className='_wrapper' id='login' style = {{width:"1200px", maxWidth:"600px"}}> 
              <div className='login_content'>
                <div className='login_header'><h2>Create New Bank Account</h2>
                  <p>Don't have an user account? 
                    <a href='/signup' id = "signup">Signup</a>
                  </p>
                </div>
                <AddNewAccountForm handleSubmit={handleSubmit}/>
              </div>
            </div>
          </div>
        </div>
        
    
    </main>
  )
}

export default AddNewAccount