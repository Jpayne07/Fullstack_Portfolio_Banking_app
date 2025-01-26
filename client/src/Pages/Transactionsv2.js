import React, {useContext} from 'react'
import '../App.css'
import TransactionModule from '../Components/Transaction_Module'
import AppContext from '../AppContext'


function Transactions() {

  const { banks } = useContext(AppContext);
      function handleClick() {
        fetch('/api/transactionseed', {
            method: 'POST',  // Use POST for creating data
            headers: {
                'Content-Type': 'application/json',  // Send request as JSON
            },
        })
        .then(response => response.json())  // Wait for JSON response
        .then(data => {
            console.log(data);  // Handle the response
        })
        .catch(error => console.error('Error:', error));  // Handle any errors
    }
    
  return (
    <div className='page_wrapper'>
    <div className='transactions_page_wrapper'>
      
      <h2 className='transaction_header'>Transactions</h2>
      <TransactionModule banks = {banks}/>
      <div className='transactions_button_break'></div>
      <button className='transactions_rng' onClick={handleClick}> {/*need to setup request response cycle in the app api*/ }
      Generate Random Transactions 
            <span class="tooltiptext">            
            Click to Generate a random set of transactions
            </span>
        </button>
    </div>
  
    </div>
  )
}

export default Transactions