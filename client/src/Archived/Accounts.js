import React, {useContext} from 'react'
import AppContext from '../AppContext'
import BanksComponentv2 from '../Components/BankComponentv2'
function Accounts() {
    const { banks } = useContext(AppContext)




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