import React, {useContext} from 'react'
import TransactionIndexModule from '../Components/Transaction_Index_Module'
import AppContext from '../AppContext'

function Transactions() {

  const {user, setUser} = useContext(AppContext);
      function handleClick() {
        fetch('/api/transactionseed', {
            method: 'POST',  // Use POST for creating data
            headers: {
                'Content-Type': 'application/json',  // Send request as JSON
            },
        })
        .then(response => response.json())
        // .then(fetch("/api/check_session").then((response) => {
        //   if (response.ok) {
        //     response.json()
        //     .then((user) => setUser(user))
        //   }
        // }))  // Wait for JSON response
        .catch(error => console.error('Error:', error));  // Handle any errors
    }
    
    
  return (
    <div className='page_wrapper'>
      <div className='background_wrapper' id='transaction_index'>
        <div className='_wrapper' id='transaction_index'>
          <h2>Transactions</h2>
          <TransactionIndexModule user = {user}/>
          <div className='transactions_button_break'></div>
          <button className='transactions_rng' onClick={handleClick}>
            Generate Random Transactions 
            <span class="tooltiptext">            
              Click to Generate a random set of transactions
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Transactions