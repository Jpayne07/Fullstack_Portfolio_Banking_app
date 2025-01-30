import React, {useContext} from 'react'
import AppContext from '../AppContext'

function Insights() {
  const uniqueDateSet = new Set();
  const { banks, categories } = useContext(AppContext);
  console.log('Categories', categories)
    const transactionList = banks.map(bank=>{
      return <div className='bank_account_container' style={{flexWrap:"wrap"}}>
        <div className="transaction_headers">
            <h4>Category</h4>
            <h4>Amount</h4>
            </div>
        {Object.entries(categories)
        .map(([key, value])=>{
          return <div style={{width:"100%"}}>
            
                <div className='transaction_rows' key={key} style={{gridTemplateColumns: "3fr 2fr"}}>
                <p id='transaction_name'>{key}</p>
                <p id='Price'><span id='DollaBill'>$ </span>{value}</p>
                
                </div>
        </div>
        
        }
        
    )
    
}</div>
      
        
    })
    
  
  return (
    
    <div>{transactionList}</div>
      
      
  )

}

export default Insights