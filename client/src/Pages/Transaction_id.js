import React, {useContext} from 'react'
import Transaction_Id_module from '../Components/Transaction_Id_module'
import AppContext from '../AppContext'


function TransactionId() {
  const { banks } = useContext(AppContext);
  return (
    <div className='page_wrapper'>
      <div className='background_wrapper' id='test' style={{width:"800px"}}>
        <div className='_wrapper' style={{width:"800px"}} id='test'>
          <h2>Transactions</h2>
          <Transaction_Id_module banks = {banks}/>
        </div>
      </div>
    </div>
  )
}

export default TransactionId