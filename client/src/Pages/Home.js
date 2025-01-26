import React, {useContext} from 'react'
import BankComponent from '../Components/BankComponent'
import TransactionModule from '../Components/Transaction_Module'
import AppContext from '../AppContext'

function Home() {
    const { banks } = useContext(AppContext)
    const { transactions } = useContext(AppContext)
  return (
    <div className='home_wrapper'>
      <div className='background_wrapper'>
        <div className='_wrapper'>
          <h2>Bank Name</h2>
          <div className='bank_id'>
            <h3 id = "bank_name"><BankComponent banks = {banks}/></h3>
          </div>
        </div>
        
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