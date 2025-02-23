import React from 'react'
import BanksComponentv2 from '../Components/BankComponentv2'

function Accounts() {
  return (
    <div style={{display:"flex", justifyContent:"center"}}>
      <div className='login_wrapper' 
      style={{minHeight:"600px"}}>
        <BanksComponentv2 stylingContext = {"Grid"}/>
      </div>
    </div>
  )
}

export default Accounts