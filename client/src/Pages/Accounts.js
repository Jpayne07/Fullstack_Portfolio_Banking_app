import React, {use, useContext, useState} from 'react'
import AppContext from '../AppContext'
import Nav from '../Components/Nav'
import BanksComponentv2 from '../Components/BankComponentv2'
function Accounts() {
    const { banks } = useContext(AppContext)
    // useEffect(()=>{
    //     fetch('/api/banks')
    //     .then(r=>r.json())
    //     .then(data=>setBankRaw(data))
    // },[])



  return (
    <div>
      <div className='login_wrapper' style={{minHeight:"600px"}}>
        <div className='background_wrapper' id="login" >
          <BanksComponentv2 banks = {banks}/>
        </div>
      </div>
    </div>
  )
}

export default Accounts