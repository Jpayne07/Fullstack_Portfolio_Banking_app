import React, {useContext} from 'react'
import AppContext from '../AppContext';
import { useNavigate } from 'react-router-dom';

function BanksComponentv2({stylingContext}) {
  const { loading, user } = useContext(AppContext)
  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    trailingZeroDisplay: 'stripIfInteger'
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  
  const accountElement = user.accounts.length > 0? user.accounts.sort((a, b) => a.bank_id - b.bank_id)
  // need to only show first occurence
  .map(account=>{
    // for styling context on home page
    if(stylingContext==="Normal"){
      const accountValue = (account.account_value)
      return(

        <div style={{width: "100%"}}key={account.id}>
          <h2 style={{padding:"15px 0", textAlign:"left"}}>{account.bank.name}</h2>
          <div className='bank_account_container'>
              <h4 ><a href={`account/${account.id}`} id = "accountLinks">{account.account_type}</a></h4>
              <p>{formatter.format(accountValue)}</p>
          </div>
        </div>
        
      )
  }
  // for styling context on '/accounts' page
  else{
    
    return(
      <div>
        <h2 id = 'bank_name' style={{padding:"15px 0", textAlign:"left"}} >{account.bank.name}</h2>
        <div className='bank_account_container'
          // div styling
          style={{ padding:"20px",
          width: "100%",
          flexWrap:"wrap",
          alignContent:"center",
          gap:"25px",
          backgroundImage: "linear-gradient(to right,grey,white)",
          borderRadius:"10px"}}>
          
          <h4 style={{width:"100%"}}><a href={`account/${account.id}`}>Account Type: {account.account_type}</a></h4>
          <p>Account Balance: {formatter.format(account.account_value)}</p><br></br>
          <p style={{ color: "red", width:"100%"}}>Total Spending: $
            {
              account.transactions.reduce((total, transaction) => {
                return transaction.transaction_type === "Negative" ? total + parseInt(transaction.amount) : total}, 0) 
                  // Initial value of total
            }
          </p>
          <p>Card Ending in: #{account.card.card_number.toString().slice(-4)}</p>

        </div>        
      </div>
  )
  }}) : (
  <p>No banks available.</p>
  )
  return (
    <div className='_wrapper' id="login" style={{padding:"50px", maxWidth:"1200px"}}>
      <h1>Accounts</h1>
      <div className={stylingContext==='Normal'?'bank_id':'account_grid'}>
        {accountElement}
      </div>
      <div className='addAccountWrapper'>
        <button className='addAccounts' onClick={()=> navigate('/add_account')}>Add Accounts</button>
      </div>
    </div>
  )
}

export default BanksComponentv2