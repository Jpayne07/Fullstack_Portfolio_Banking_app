import React, {useContext} from 'react'
import AppContext from '../AppContext'
import BanksComponentv2 from '../Components/BankComponentv2'
function Accounts() {
    const { banks } = useContext(AppContext)




  return (
    <div style={{display:"flex", justifyContent:"center"}}>
      <div className='login_wrapper' style={{minHeight:"600px", width:"1200px", maxWidth:"1200px"}}>
        {/* <div className='background_wrapper' id="login" style={{maxWidth:"1200px"}}> */}
          <BanksComponentv2 stylingContext = {"Grid"}/>
        {/* </div> */}
      </div>
    </div>
  )
}

export default Accounts