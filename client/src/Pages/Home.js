import React from 'react'
import BankComponentv2 from '../Components/BankComponentv2'
import Insights from '../Components/InsightsComponent'

function Home() {
  return (
    <div className='home_wrapper'>
      <div className='background_wrapper'>   
        <BankComponentv2 stylingContext = {"Normal"}/>
      </div>
          <div className='background_wrapper'>
            <div className='_wrapper'>  
              <h2 className='transaction_header'>Spending</h2>
              <Insights />
            </div>
        </div>
    </div>
  )
}

export default Home