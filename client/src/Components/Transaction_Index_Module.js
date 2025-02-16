import React, {useState,useContext} from 'react'
import { useParams } from 'react-router-dom';
import AppContext from '../AppContext';


function TransactionIndexModule({}) {
  const {user, API_URL} = useContext(AppContext);
  const { id } = useParams()
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const itemsPerPage = 10; // Number of transactions per page
  const uniqueDateSet = new Set();

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  // handle transaction delete
  const handleDelete=(id)=>{
    fetch(`${API_URL}api/transaction/${id}`, { method: 'DELETE' })
    .then(() => alert('Transaction deleted, please refresh page'));
  }

  // map transactions
    const transactionList = user.accounts
    .filter(account=> parseInt(account.id) === parseInt(id))
    .map(account=>{
      const totalTransactions = account.transactions.length;
        const paginatedTransactions = account.transactions.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage);

      return (
        <div className='bank_account_container' >
        <div style={{width:"100%"}}>
          {/* H1 Bank: Account Name */}
        <h1 style={{padding:"15px 0", textAlign:"left" }}>{`${account.bank.name}: ${account.account_type}`}</h1>
          {/* Begin Headers */}
        <div className="transaction_headers">
        <span id="transaction_header_show"><h4>Description</h4></span>
        <span id="transaction_header_show"><h4>Date</h4></span>
        <span id="transaction_header_hide"><h4>ID</h4></span>
        <span id="transaction_header_hide"><h4>ACCT#</h4></span>
        <span id="transaction_header_show"><h4>Amount</h4></span>
        <span id="transaction_header_hide"><h4>Edit</h4></span>
        </div>
        {/* begin transactions */}
        {paginatedTransactions.map((transaction) => {
          // date below
          const date = new Date(transaction.created_at).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          uniqueDateSet.add(date)
      
        return(
          
        <div className='transaction_rows' key={transaction.id}>
          <p id='transaction_name'>{transaction.title}</p>
          <p>{date}</p>
          <p id="transaction_header_hide">{transaction.id}</p>
          <p id="transaction_value_hide">{transaction.card?transaction.card.card_number.toString().slice(-4):null}</p>
          <p id='Price'><span id='DollaBill'>$ </span>{transaction.transaction_type ==="Negative"?`-${transaction.amount}`:transaction.amount}</p>
          <div id="transaction_value_hide">
            <a href={`/transactions/${transaction.id}`}>
              <svg width="20" height="20" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39 65H68.25M53.625 11.375C54.9179 10.0821 56.6715 9.35571 58.5 9.35571C59.4054 9.35571 60.3019 9.53404 61.1383 9.88051C61.9748 10.227 62.7348 10.7348 63.375 11.375C64.0152 12.0152 64.523 12.7752 64.8695 13.6117C65.216 14.4481 65.3943 15.3446 65.3943 16.25C65.3943 17.1554 65.216 18.0519 64.8695 18.8883C64.523 19.7248 64.0152 20.4848 63.375 21.125L22.75 61.75L9.75 65L13 52L53.625 11.375Z" stroke="#2BFF5C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <svg width="20"height="20" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={()=>handleDelete(transaction.id)}>
              <path d="M11.5 23H19.1667M19.1667 23H80.5M19.1667 23V76.6667C19.1667 78.7 19.9744 80.65 21.4122 82.0878C22.85 83.5256 24.8 84.3333 26.8333 84.3333H65.1667C67.2 84.3333 69.15 83.5256 70.5878 82.0878C72.0256 80.65 72.8333 78.7 72.8333 76.6667V23M30.6667 23V15.3333C30.6667 13.3 31.4744 11.35 32.9122 9.91219C34.35 8.47441 36.3 7.66667 38.3333 7.66667H53.6667C55.7 7.66667 57.65 8.47441 59.0878 9.91219C60.5256 11.35 61.3333 13.3 61.3333 15.3333V23M38.3333 42.1667V65.1667M53.6667 42.1667V65.1667" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        )
      })}

    {/* Pagination Controls */}
    <div className="pagination_controls" style={{ marginTop: "20px" }}>
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}>
        Previous
      </button>
      <span>
        Page {currentPage} of{" "}
        {Math.ceil(totalTransactions / itemsPerPage)}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage * itemsPerPage >= totalTransactions}>
        Next
      </button>
    </div>
  </div>
</div>)     
    })

  return (
    <div>{transactionList}</div> 
  )
}

export default TransactionIndexModule