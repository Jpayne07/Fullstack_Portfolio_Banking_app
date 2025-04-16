import React, { createContext, useState, useEffect  } from 'react';


const AppContext = createContext();
// checking for API url in dev vs prod
const API_URL_FROM_ENV = process.env.REACT_APP_API_URL;
const API_URL = API_URL_FROM_ENV ? API_URL_FROM_ENV:''
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [insights, setinsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [errorState, setErrorState] = useState(false)
  const [banks, setBanks] = useState([])
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [deleteState, setDeleteState] = useState(false)

  // login function
  function handleLogin(username, password, setSubmitting, navigate) {
    
    fetch(`${API_URL}/api/bank/login`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => {
        if (r.ok) {
          r.json().then((data) => {
            // setting user to contain most data we'll reference
            setUser(data)
            setAccounts(data.accounts)

            const transactionsList = data.accounts.reduce((acc, account) => {
              return [...acc, ...account.transactions];
            }, []);
            setTransactions(transactionsList)
            navigate('/')
          })
        } else {
          r.json().then((err) => {
            setErrors([err.message || "Invalid login credentials. Please try again."]);
          });
        }
      })
      .catch((err) => {
        setErrors([err.message || "Network error. Please try again later."]);
      })
      .finally(()=>{
        setSubmitting(false)
      })
      
  }
  // this is for the login without signup
  function mockLogin(username, password, navigate) {
    fetch(`${API_URL}/api/bank/login`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => {
        if (r.ok) {
          r.json().then((data) => {
            setUser(data)
            setAccounts(data.accounts)

            const transactionsList = data.accounts.reduce((acc, account) => {
              return [...acc, ...account.transactions];
            }, []);

            setTransactions(transactionsList)
            navigate('/')
          });
        } else {
          r.json().then((err) => {
            setErrors([err.message || "Invalid login credentials. Please try again."]);
          });
        }
      })
      .catch((err) => {
        setErrors([err.message || "Network error. Please try again later."]);
      })
      
  }
  // setting the value for the categories section
  useEffect(()=>{
  let transactionCategories =[]
  accounts.forEach(account => {
    account.transactions.forEach((transaction)=>{
      if (transaction.type = "Negative"){
        if (transactionCategories[transaction.category]){
          transactionCategories[transaction.category] += transaction.amount;
        }
        else{
          transactionCategories[transaction.category] = transaction.amount;
        }
      }
    })
  })
  setinsights(transactionCategories)
  },[user, accounts])
  

// handle new bank account creation
function handleNewAccountSubmission(bank_name,
  account_value,
  account_type,
  cardNumber,
  setSubmitting,
  navigate) {
    console.log(account_type)
  fetch(`${API_URL}/api/bank/accounts`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({bank_name, account_value, account_type, cardNumber}),
  })
    .then((r) => {
      if (r.ok){
        r.json()
        .then((data)=>{
          setAccounts([...accounts, data])
          navigate('/accounts')
        })
      }
      else {
        r.json().then((err)=>{
          setSubmitting(false)
          setErrorState(true)
          setErrors(err)

        })
      }
    })
    .catch((err) => {

      setErrors([err || "Network error. Please try again later."]);
    })
    
}

  // handle bank account deletion
  function handleAccountDeletion(navigate, id){
    fetch(`${API_URL}/api/bank/singular_account/${id}`,{
      method:"DELETE", 
      credentials:"include"
    })
    .then(()=>setDeleteState(true))
    .then(()=>{
      setLoading(true)
      navigate('/accounts')
      const newAccountSet = accounts.filter((account)=>parseInt(account.id) !== parseInt(id))
      setAccounts(newAccountSet)
      setLoading(false)
      setTimeout(() => {
        setDeleteState(false);
      }, 3000)}
      
      )
      
  }
  // check session ensures a user is still logged in between refreshes
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/bank/check_session`,{
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        
        // Check if data contains a valid user_id or similar flag
        if (data.id) {
          setUser(data);
          setAccounts(data.accounts);
          const transactionsList = data.accounts.reduce((acc, account) => {
            return [...acc, ...account.transactions];
          }, []);
          setTransactions(transactionsList);
        } else {
          setUser(null);
        }
      })
      .catch(error => {
        console.error("Error fetching session:", error);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // this will seed transactions on individual account pages - simply mock data to show frontend capability
  function handleTransactionSeed(id) {
    fetch(`${API_URL}/api/bank/transactionseed`, {
        method: 'POST', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',  
        },
        body: JSON.stringify({ id }),
    })
    .then(response => response.json())
    .then(data=>{
      console.log(data)
      const accountID = data[0]['account_id']
      setTransactions([...transactions, ...data])
      const accountToUpdate = accounts.find(account => parseInt(account.id) === parseInt(accountID));

      if (accountToUpdate) {
        // Create a new transactions array for the matching account
        const updatedTransactions = [...accountToUpdate.transactions, ...data];

        // Map over accounts to update the correct account immutably
        const updatedAccounts = accounts.map(account => 
          parseInt(account.id) === parseInt(accountID)
            ? { ...account, transactions: updatedTransactions }
            : account
        );

        setAccounts(updatedAccounts);
      }


    }
      
    )
    .catch(error => console.error('Error:', error)); 
}
// function to delete individual transactions
const handleTransactionDelete=(transactionID)=>{
  fetch(`${API_URL}/api/bank/transaction/${transactionID}`, { 
    method: 'DELETE',
    credentials: 'include', 
  })
  .then(() => {
    const newTransactionList = transactions.filter(transaction=>parseInt(transaction.id) !==parseInt(transactionID))
    setTransactions(newTransactionList)

  })
}
      

  return (
    <AppContext.Provider value={{loading,
     transactions,
     setTransactions,
     banks,
     accounts,
     user,
     setUser,
     setLoading,
     handleLogin,
     deleteState,
     handleAccountDeletion,
     insights,
     errors,
     errorState,
     handleTransactionSeed,
     handleNewAccountSubmission,
     handleTransactionDelete,
     mockLogin, 
     API_URL }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;