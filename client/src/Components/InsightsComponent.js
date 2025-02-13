import React, {useContext} from 'react'
import AppContext from '../AppContext'



function Insights() {
  const { categories } = useContext(AppContext);
  return (
  <div className='bank_account_container' style={{flexWrap:"wrap"}}>
    <div className="transaction_headers" style={{gridTemplateColumns:"3fr 2fr", width:"100%"}}>
      <h4>Category</h4>
      <h4>Amount</h4>
    </div>
    {Object.entries(categories)
      .map(([key, value])=>{
        return(
        <div style={{width:"100%"}}key={key} >
          <div className='transaction_rows'  style={{gridTemplateColumns: "3fr 2fr"}}>
            <p id='transaction_name'>{key}</p>
            <p id='Price'><span id='DollaBill'>$ </span>{value}</p>
          </div>
        </div>)
      })
    }
  </div>)
}

export default Insights