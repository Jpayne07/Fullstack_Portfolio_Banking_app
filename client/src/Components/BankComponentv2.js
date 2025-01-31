import React, {useContext} from 'react'
import AppContext from '../AppContext';

function BanksComponentv2({stylingContext}) {
  const { banks, loading } = useContext(AppContext)
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options can be used to round to whole numbers.
    trailingZeroDisplay: 'stripIfInteger'
  });
  if (loading) {
    return <p>Loading...</p>;
  }

  
    const bankElement = banks.length > 0? banks.map(bank=>{
      if(stylingContext==="Normal"){
        return(
            <div style={{width: "100%"}}>
              <h2 style={{padding:"15px 0", textAlign:"left"}}>{bank.bank_name}</h2>

                {bank.accounts.map(account=>{
                  return(
                  <div className='bank_account_container'>
                      <h4 ><a href={`account/${account.id}`}>{account.account_type}</a></h4>
                      <p>{formatter.format(account.account_value)}</p>
                  </div>)
                  }
                )
              }         
            </div>
        )
    }else{
      return(
        <div style={{width:"100%"}}>
          <h2 style={{padding:"15px 0", textAlign:"left"}}>{bank.bank_name}</h2>
          <div className='account_grid'>
            {bank.accounts.map(account=>{
              return(
              <div className='bank_account_container'style={{ padding:"20px",width: "100%", flexWrap:"wrap", alignContent:"center", gap:"25px", backgroundImage: "linear-gradient(to right,grey,white)", borderRadius:"10px"}}>
                  <h4 style={{width:"100%"}}><a href={`account/${account.id}`}>Account Type: {account.account_type}</a></h4>
                  <p>Account Balance: {formatter.format(account.account_value)}</p>
                  <p style={{color:"red"}}>Spent This Month: 200,000</p>
              </div>)
              }
            )
          } 
          </div>        
        </div>
    )
    }}) : (
    <p>No banks available.</p>
  )
  return (
        <div className='_wrapper' id="login" style={{padding:"50px", maxWidth:"1200px"}}>
          <h1>Accounts</h1>
          <div className='bank_id'>
            {bankElement}
          </div>
      </div>

    
  )
}

export default BanksComponentv2