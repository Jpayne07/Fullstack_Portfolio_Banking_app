import React, {useContext} from 'react'
import BankComponentv2 from '../Components/BankComponentv2'
import TransactionModule from '../Components/Transaction_Module'
import AppContext from '../AppContext'

function Home() {
    const { banks } = useContext(AppContext)
    const { transactions } = useContext(AppContext)
  return (
    <div className='home_wrapper'>
      <div className='background_wrapper'>
          
          <BankComponentv2 banks = {banks}/>

        
      </div>
      
          <div className='background_wrapper'>
          <div className='_wrapper'>  

            <h2 className='transaction_header'>Transactions</h2>
            
          <TransactionModule transactions = {transactions}/>
          </div>
        </div>
    </div>
  )
}

export default Home