import React, {useContext, useState} from 'react'
import TransactionIndexModule from '../Components/Transaction_Index_Module'
import AppContext from '../AppContext'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

function Transactions() {

  const {user, handleTransactionSeed} = useContext(AppContext);
  const { id } = useParams()
  const [deleteState, setDeleteState] = useState(false)
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  return (
    <div className='page_wrapper'>
      <div className='background_wrapper' id='transaction_index'>
        <div className='_wrapper' id='transaction_index'>
          <h2 style={{width:"100%", textAlign:"center"}}>Transactions</h2>
          <TransactionIndexModule user = {user}/>
          <div className='transactions_button_break'></div>
          <button className='transactions_rng' onClick={()=>handleTransactionSeed(id)}>
            Generate Random Transactions 
            <span className="tooltiptext">            
              Click to Generate a random set of transactions
            </span>
          </button>
          <button className='transactions_rng'
          style={{background:"red"}} 
          onClick={()=>fetch(`/api/singular_account/${id}`,{
            method:"DELETE"
          })
          .then(r=>r.json)
          .then(setDeleteState(true))
          .then(()=>{
            navigate('/accounts')
            document.location.reload()})
          }> Delete Account </button>
          {deleteState?
          <div style={{width:"100%", justifyContent:"center"}}>
            <p style={{textAlign:"center"}}>Account Deleted</p>
          </div>
          :null}
        </div>
      </div>
    </div>
  )
}

export default Transactions