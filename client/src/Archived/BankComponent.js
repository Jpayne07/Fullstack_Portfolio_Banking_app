import React from 'react'

function BankComponent({banks}) {
  const bankElements = banks.map(bank=>{
    return <div>
      <h3 id = "bank_name">{bank.bank_name}</h3>
      </div>
  })
  return (
    <div>
      <div>{bankElements}</div>
      {banks.map(bank=>{
        return <div>
          <h3>{`${bank.bank_name} Accounts`}</h3>
          <h5>{bank.accounts.map(account=>{return account.account_type})}</h5>
        </div>
      })}
    </div>
  )
}

export default BankComponent