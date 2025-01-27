import React from 'react'

function BanksComponentv2({banks}) {

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options can be used to round to whole numbers.
    trailingZeroDisplay: 'stripIfInteger'   // This is probably what most people
                                            // want. It will only stop printing
                                            // the fraction when the input
                                            // amount is a round number (int)
                                            // already. If that's not what you
                                            // need, have a look at the options
                                            // below.
    //minimumFractionDigits: 0, // This suffices for whole numbers, but will
                                // print 2500.10 as $2,500.1
    //maximumFractionDigits: 0, // Causes 2500.99 to be printed as $2,501
  });
    const bankElement = banks.map(bank=>{
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