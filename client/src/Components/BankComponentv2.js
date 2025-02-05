import React, {useContext, useEffect, useState} from 'react'
import AppContext from '../AppContext';

function BanksComponentv2({stylingContext}) {
  const { loading, user } = useContext(AppContext)
  const bankNames = []
  const uniqueNames = new Set()
  let transactionTally = 0
  const negativeTally = 0
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options can be used to round to whole numbers.
    trailingZeroDisplay: 'stripIfInteger'
  });
  if (loading) {
    return <p>Loading...</p>;
  }

  
    const accountElement = user.accounts.length > 0? user.accounts.sort((a, b) => a.bank_id - b.bank_id)
    // need to only show first occurence
    .map(account=>{
      console.log("Begin render", account)
      if(stylingContext==="Normal"){
        const accountValue = (account.account_value)
        if (!bankNames.includes(account.bank_name)) {
          bankNames.push(account.bank_name); // Add to the list if it's not already there
    
          return (
          <div style={{width: "100%"}}key={account.id} >
          <h2 style={{padding:"15px 0", textAlign:"left"}}>{account.bank_name}</h2>

              <div className='bank_account_container'>
                  <h4 ><a href={`account/${account.id}`}>{account.account_type}</a></h4>
                  <p>{formatter.format(accountValue)}</p>
              </div>
 
        </div>)
        }
        else{
        return(
            <div style={{width: "100%"}}key={account.id}>
              {/* <h2 style={{padding:"15px 0", textAlign:"left"}}>{account.bank_name}</h2> */}

                  <div className='bank_account_container'>
                      <h4 ><a href={`account/${account.id}`}>{account.account_type}</a></h4>
                      <p>{formatter.format(accountValue)}</p>
                  </div>
     
            </div>
        )}
    }else{
      console.log(account)
      return(
        <div>
          <h2 style={{padding:"15px 0", textAlign:"left"}}>{account.bank_name}</h2>
              <div className='bank_account_container'style={{ padding:"20px",width: "100%", flexWrap:"wrap", alignContent:"center", gap:"25px", backgroundImage: "linear-gradient(to right,grey,white)", borderRadius:"10px"}}>
                  <h4 style={{width:"100%"}}><a href={`account/${account.id}`}>Account Type: {account.account_type}</a></h4>
                  <p>Account Balance: {formatter.format(account.account_value)}</p><br></br>
                  <p style={{ color: "red" }}>Total Spending: $
                  {
                    account.transactions.reduce((total, transaction) => {
                      return transaction.transaction_type === "Negative"
                        ? total + parseInt(transaction.amount)
                        : total;
                    }, 0) // Initial value of total
                  }
                </p>
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
      </div>

    
  )
}

export default BanksComponentv2