import React from 'react'

function BanksComponentv2({banks}) {
    const bankElement = banks.map(bank=>{
        return(
            <div style={{width: "100%"}}>
              <h2 style={{padding:"15px 0"}}>{bank.bank_name}</h2>

                {bank.accounts.map(account=>{
                  return(
                  <div className='bank_account_container'>
                      <h4>{account.account_type}</h4>
                      <p>{account.account_value}</p>
                  </div>)
                  }
                )
              }         
            </div>
        )
    })
  return (
        <div className='_wrapper' id="login" style={{padding:"50px"}}>
          <h1>Accounts</h1>
          <div className='bank_id' style={{gap:"0px"}}>
            {bankElement}
          </div>
      </div>

    
  )
}

export default BanksComponentv2