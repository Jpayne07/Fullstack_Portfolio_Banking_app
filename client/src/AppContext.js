import React, { createContext, useState, useEffect  } from 'react';


const AppContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

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

  function handleLogin(username, password, setSubmitting, navigate) {
    
    fetch(`/api/login`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => {
        console.log(r)
        if (r.ok) {
          r.json().then((user) => {
            console.log("User", user)
            setUser(user)
            setAccounts(user.accounts)
            setTransactions(user.transactions)
            navigate('/');
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
    fetch(`/api/login`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => {
        if (r.ok) {
          r.json().then((user) => {
            setUser(user)
            setAccounts(user.accounts)

            const transactionsList = user.accounts.reduce((acc, account) => {
              return [...acc, ...account.transactions]})

            setTransactions(transactionsList)
            console.log(transactions)
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
  
  useEffect(() => {
    if (!user) return;
    fetch(`/api/banks`,{
      method: 'GET',
      credentials: 'include'
    })
    .then((r) => r.json())
    .then(banks => {
      setBanks(banks);
  }).catch(error => {
    console.log("Error in fetching banks", error)
    setLoading(false);
    
  });
}, [user]);

function handleNewAccountSubmission(bank_name,
  account_value,
  account_type,
  cardNumber,
  setSubmitting,
  navigate) {
    console.log(account_type)
  fetch(`/api/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify({bank_name, account_value, account_type, cardNumber}),
  })
    .then((r) => {
      if (r.ok){
        r.json()
        .then((data)=>{
          console.log('test')
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


  function handleAccountDeletion(navigate, id){
    fetch(`/api/singular_account/${id}`,{
      method:"DELETE"
    })
    .then(()=>setDeleteState(true))
    .then(()=>{
      setLoading(true)
      navigate('/accounts')
      const newAccountSet = accounts.filter((account)=>parseInt(account.id) !== parseInt(id))
      setAccounts(newAccountSet)
      console.log(accounts)
      setLoading(false)}
      
      )
      
  }

  useEffect(() => {
    setLoading(true);
    fetch(`/api/check_session`,{
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Session response:", data);
        
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

  // this will seed transactions on individual account pages
  function handleTransactionSeed(id) {
    fetch(`/api/transactionseed`, {
        method: 'POST', 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',  
        },
        body: JSON.stringify({ id }),
    })
    .then(response => response.json())
    .then(data=>{
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
  
const handleTransactionDelete=(transactionID, accountID)=>{
  fetch(`/api/transaction/${transactionID}`, { method: 'DELETE' })
  .then(() => {
    const newTransactionList = transactions.filter(transaction=>parseInt(transaction.id) !==parseInt(transactionID))
    setTransactions(newTransactionList)

  })
}
      

  return (
    <AppContext.Provider value={{loading,
     transactions,
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