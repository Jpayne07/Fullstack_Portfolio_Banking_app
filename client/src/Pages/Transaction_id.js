import React, {useContext} from 'react'
import Transaction_Id_Module from '../Components/Transaction_Id_Module'
import AppContext from '../AppContext'


function TransactionId() {
  const { banks } = useContext(AppContext);
  return (
    <div className='page_wrapper'>
      <div className='background_wrapper' id='test' style={{width:"800px"}}>
        <div className='_wrapper' style={{width:"800px"}} id='test'>
          <h2>Transactions</h2>
          <Transaction_Id_Module banks = {banks}/>
        </div>
      </div>
    </div>
  )
}

export default TransactionId