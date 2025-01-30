import React, {useContext} from 'react'
import BankComponentv2 from '../Components/BankComponentv2'
import Insights from '../Components/Insights'
import AppContext from '../AppContext'

function Home() {
    const { banks } = useContext(AppContext)
  return (
    <div className='home_wrapper'>
      <div className='background_wrapper'>   
          <BankComponentv2 banks = {banks}/>
      </div>
          <div className='background_wrapper'>
          <div className='_wrapper' style={{padding:"50px"}}>  
            <h2 className='transaction_header'>Spending</h2>
            <Insights />
          </div>
        </div>
    </div>
  )
}

export default Home