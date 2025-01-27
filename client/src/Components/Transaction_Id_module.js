import React, {useState} from 'react'
import { useParams } from 'react-router-dom';
import Pencil from '../images/Pencil.svg'
import EditableText from './EditableText';


function Transaction_Id_module({banks}) {
  const { id } = useParams()

  const uniqueDateSet = new Set();
    const transactionList = banks.map(bank=>{
      return <div className='bank_account_container'>
       
        {bank.accounts
        .filter((account) => account.transactions.some((transaction) => transaction.id === Number(id))
      )
        .map(account=>{
          return <div style={{width:"100%"}}>
            {/* bank_name below */}
            <h1 style={{padding:"15px 0", textAlign:"left"}}>{`${account.banks.bank_name}: ${account.account_type}`}</h1>
            <div className="transaction_headers" id='singular'>
            <h4>Description</h4>
                  <h4>Date</h4>
                  <h4>ID</h4>
                  <h4>ACCT#</h4>
                  <h4>Amount</h4>
            </div>
            {account.transactions.filter(transaction =>transaction.id === Number(id))
            .map((transaction) => {
              // date below
              const date = new Date(transaction.created_at).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }
            )
          
          const shouldRenderDate = uniqueDateSet.has(date);
          uniqueDateSet.add(date)
          
            return(
              
            <div className='transaction_rows' key={transaction.id} id="singular">
                 {/* <p className="time">
                   {shouldRenderDate?null:date}
                </p> */}
                <EditableText initialText={transaction.title} transactionId={id}  keyName={'title'}/>
                <EditableText initialText={date} transactionId={id}  keyName={'date'}/>
                <p>{transaction.id}</p>
                <p>{transaction.card.card_number.toString().slice(-4)}</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "4px" }}>$</span>
                <EditableText initialText={transaction.amount} transactionId={id} keyName={'amount'} />
                </div>                
                        </div>
                        )
                    }
                  )}

                </div>
  }
)
}
</div>
      
        
    })
    
  
  return (
    
    <div>{transactionList}</div>
      
      
  )
}

export default Transaction_Id_module