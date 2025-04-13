import React, {useContext} from 'react'
import TransactionIndexModule from '../Components/Transaction_Index_Module'
import AppContext from '../AppContext'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';

function Transactions() {

  const {user, handleTransactionSeed, accounts, handleAccountDeletion, deleteState, loading} = useContext(AppContext);
  const { id } = useParams()
  
  const navigate = useNavigate();
  const account = accounts.find((account) => parseInt(account.id) === parseInt(id))
  if (loading) {
    return <div>Loading...</div>; // Display loading indicator
  }
  if (account)
   return (
    <div className='page_wrapper'>
      <div className='background_wrapper' id='transaction_index'>
        <div className='_wrapper' id='transaction_index'>
          <h2 style={{width:"100%", textAlign:"center"}}>Transactions</h2>
          <h1 style={{padding:"15px 0", textAlign:"left" }}>{`${account.bank.name}: ${account.account_type}`}</h1>
          <div className='bank_account_container' >
        <div style={{width:"100%"}}>
          {/* Begin Headers */}
        <div className="transaction_headers">
        <span id="transaction_header_show"><h4>Description</h4></span>
        <span id="transaction_header_show"><h4>Date</h4></span>
        <span id="transaction_header_hide"><h4>ID</h4></span>
        <span id="transaction_header_hide"><h4>ACCT#</h4></span>
        <span id="transaction_header_show"><h4>Amount</h4></span>
        <span id="transaction_header_hide"><h4>Edit</h4></span>
        </div>

          <TransactionIndexModule user = {user}/>
          </div>
          </div>
          <div className='transactions_button_break'></div>
          <button className='transactions_rng' onClick={()=>handleTransactionSeed(id)}>
            Generate Random Transactions 
            <span className="tooltiptext">            
              Click to Generate a random set of transactions
            </span>
          </button>
          <button className='transactions_rng'
          style={{background:"red"}} 
          onClick={()=>handleAccountDeletion(navigate, id)}
          > Delete Account </button>
          {deleteState?
          <div style={{width:"100%", justifyContent:"center"}}>
            <p style={{textAlign:"center"}}>Account Deleted</p>
          </div>
          :null}
        </div>
      </div>
    </div>
  )
  else{return (<div className='page_wrapper'>
    <div className='background_wrapper' id='transaction_index'>
      <div className='_wrapper' id='transaction_index'>
        <h2 style={{width:"100%", textAlign:"center"}}>No accounts Exist Here - Please Navigate to <Link to="/accounts">Accounts</Link></h2></div></div></div>)}
  
}

export default Transactions