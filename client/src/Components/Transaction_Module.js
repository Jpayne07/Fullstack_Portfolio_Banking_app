import React, {useEffect} from 'react'

function TransactionModule({transactions, dateSetterFunction}) {
  const uniqueDateSet = new Set();
    const transactionList = transactions.map(transaction=>{
      const date = new Date(transaction.created_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      
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
        
    })
    
  
  return (
    
    <div>{transactionList}</div>
      
      
  )
}

export default TransactionModule