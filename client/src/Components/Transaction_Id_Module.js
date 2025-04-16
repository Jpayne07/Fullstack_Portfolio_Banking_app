import React, {useContext, useState} from 'react'
import AppContext from '../AppContext';

import { useParams } from 'react-router-dom';
import EditableText from './EditableText';


function Transaction_Id_Module() {
  const { user,accounts, API_URL, transactions, setTransactions } = useContext(AppContext)
  const { id } = useParams()
  const uniqueDateSet = new Set();
    // const transactionList = user.map(user=>{
      return <div className='bank_account_container'>
       
        {accounts
        .filter((account) => account.transactions.some((transaction) => transaction.id === Number(id))
      )
        .map(account=>{
          return <div style={{width:"100%"}}key={account.id}>
            <h1 style={{padding:"15px 0", textAlign:"left"}}>{`${account.bank.name}: ${account.account_type}`}</h1>
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
          uniqueDateSet.add(date)
          
            return(
              
            <div className='transaction_rows' key={transaction.id} id="singular">
                 {/* <p className="time">
                   {shouldRenderDate?null:date}
                </p> */}
                <EditableText initialText={transaction.title} setTransactions = {setTransactions} transactions = {transactions} transactionId={id}  keyName={'title'} API_URL = {API_URL}/>
                <EditableText initialText={date} transactionId={id} setTransactions = {setTransactions} transactions = {transactions} keyName={'created_at'} API_URL = {API_URL}/>
                <p>{transaction.id}</p>
                <p>{transaction.card?transaction.card.card_number.toString().slice(-4):null}</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "4px" }}>$</span>
                <EditableText initialText={transaction.amount} setTransactions = {setTransactions} transactions = {transactions} transactionId={id} keyName={'amount'} API_URL = {API_URL} />
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

}

export default Transaction_Id_Module