import React from 'react'
import { useParams } from 'react-router-dom';


function TransactionModule({banks}) {
  const { id } = useParams()
  const uniqueDateSet = new Set();
    const transactionList = banks.map(bank=>{
      return <div className='bank_account_container'>
       
        {bank.accounts
        .filter((account) => account.id === Number(id))
        .map(account=>{
          return <div>
            <h1 style={{padding:"15px 0", textAlign:"left"}}>{`${account.banks.bank_name}: ${account.account_type}`}</h1>
            {account.transactions.map(transaction=>{
              const date = new Date(transaction.created_at).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }
            )
          
          const shouldRenderDate = uniqueDateSet.has(date);
          uniqueDateSet.add(date)
          
            return(
              
            <div className='transaction_rows' key={transaction.id}>
                 <p className="time">
                   {shouldRenderDate?null:date}
                </p>
                <p id='transaction_name'>{transaction.title}</p>
                <p id='Price'><span id='DollaBill'>$ </span>{transaction.amount}</p>
            </div>)
        }
      )}</div>
  }
)
}</div>
      
        
    })
    
  
  return (
    
    <div>{transactionList}</div>
      
      
  )
}

export default TransactionModule