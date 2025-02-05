import React, {useContext} from 'react'
import '../App.css'
import TransactionIndexModule from '../Components/Transaction_Index_Module'
import AppContext from '../AppContext'
import { useParams } from 'react-router-dom'

function Transactions() {

  const { banks, setBanks, setLoading, setAccounts, setCategories, categories, user} = useContext(AppContext);
      function handleClick() {
        fetch('/api/transactionseed', {
            method: 'POST',  // Use POST for creating data
            headers: {
                'Content-Type': 'application/json',  // Send request as JSON
            },
        })
        .then(response => response.json())  // Wait for JSON response
        // .then(data => {
        //   Promise.all([
        //     fetch('/api/banks').then((r) => r.json()),
        //     fetch('/api/account').then((r) => r.json()),
        //     fetch('/api/insights').then((r) => r.json())
        //   ]).then(([banksData, accountsData, insightsData]) => {
        //     setBanks(banksData);
        //     setAccounts(accountsData)
        //     setCategories(insightsData);
        //     setLoading(false);
        //   }).catch(error => {
        //     console.error('Error fetching data:', error);
        //     setLoading(false);
        //   });  // Handle the response
        // })
        .catch(error => console.error('Error:', error));  // Handle any errors
    }
    
    
  return (
    <div className='page_wrapper'>
    <div className='background_wrapper' id='transaction_index'>
    <div className='_wrapper' id='transaction_index'>
      
      <h2>Transactions</h2>
      <TransactionIndexModule user = {user}/>
      <div className='transactions_button_break'></div>
      <button className='transactions_rng' onClick={handleClick}> {/*need to setup request response cycle in the app api*/ }
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