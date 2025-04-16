import React, { useContext, useEffect } from 'react'
import AddNewAccountForm from '../Components/AddNewAccountForm';
import AppContext from '../AppContext';
import { useNavigate } from 'react-router-dom';
import '../Styling/App.css'

function AddNewAccount() {

  const {errorState} = useContext(AppContext)
  
  return (
    <main>
        <div className='login_wrapper'>
          <div className='background_wrapper' id='login'style = {{width:"1200px", maxWidth:"600px"}}>
            <div className='_wrapper' id='login' > 
              <div className='login_content'>
                <div className='login_header'><h2>Create New Bank Account</h2>
                  {errorState?<p>Invalid account information. Bank name must be less than 30 characters and account value must be positive.</p>:null}
                </div>
                {/* form for new account creation below */}
                <AddNewAccountForm />
              </div>
            </div>
          </div>
        </div>
        
    
    </main>
  )
}

export default AddNewAccount