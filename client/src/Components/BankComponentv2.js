import React, {useContext} from 'react'
import AppContext from '../AppContext';
import { Link, useNavigate } from 'react-router-dom';


function BanksComponentv2({stylingContext}) {
  const { loading, accounts } = useContext(AppContext)
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    trailingZeroDisplay: 'stripIfInteger'
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  const accountElement = accounts.length > 0? accounts.sort((a, b) => a.bank_id - b.bank_id)
  // need to only show first occurence
  .map(account=>{
    
    // for styling context on home page
    if(stylingContext==="Normal"){
      const accountValue = (account.account_value)
      return(

        <div style={{width: "100%"}}key={account.id}>
          <h2 style={{padding:"15px 0", textAlign:"left"}}>{account.bank.name}</h2>
          <div className='bank_account_container'>
              <h4 id = "accountLinks"><Link to={`/account/${account.id}`}>{account.account_type}</Link></h4>
              <p>{formatter.format(accountValue)}</p>
          </div>
        </div>
        
      )
  }
  // for styling context on '/accounts' page
  else{
    
    return(
      <div key={account.id}>
        <h2 id = 'bank_name' style={{padding:"15px 0", textAlign:"left"}} >{account.bank.name}</h2>
        <div className='bank_account_container'

          id = "accountIndex">
          
          <h4 style={{width:"100%", fontSize:"1.5rem"}}><Link to={`/account/${account.id}`} style = {{color:"white"}}>Account Type: {account.account_type}</Link></h4>
          <p style={{fontSize:"1.2rem"}}>Account Balance: {formatter.format(account.account_value)}</p>
          <p style={{ color: "red", width:"100%", fontSize:"1.2rem"}}>Total Spending: $
            {
              account.transactions.reduce((total, transaction) => {
                return transaction.transaction_type === "Negative" ? total + parseInt(transaction.amount) : total}, 0) 
                  // Initial value of total
            }
          </p>
          <p style={{fontSize:"1.2rem"}}>Card Ending in: #{account.card.card_number.toString().slice(-4)}</p>

        </div>        
      </div>
  )
  }}) : (
  <p>No banks available.</p>
  )
  return (
    <div className='_wrapper' id="login" style={{padding:"50px", maxWidth:"1200px"}} >
      <h1>Accounts</h1>
      <div className={stylingContext==='Normal'?'bank_id':'account_grid'}>
        {accountElement}
      </div>
      <div className='addAccountWrapper'>
        <button className='addAccounts' onClick={()=> navigate('/account/new')}>Add Accounts</button>
      </div>
    </div>
  )
}

export default BanksComponentv2