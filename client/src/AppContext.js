import React, { createContext, useState, useEffect  } from 'react';


const AppContext = createContext();


export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [banks, setBanks] = useState([])

  useEffect(() => {
      fetch('/api/insights')
      .then((r) => r.json())
      .then(insightsData => {
      setCategories(insightsData);
    }).catch(error => {
      console.log("Error fetching insights", error)
      setLoading(false);
      
    });
  }, [user]);
  
  useEffect(() => {
    fetch('/api/banks')
    .then((r) => r.json())
    .then(banks => {
      setBanks(banks);
  }).catch(error => {
    console.log("Error in fetching banks", error)
    setLoading(false);
    
  });
}, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/check_session")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleLogin(username, password, setSubmitting, navigate) {
    
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => {
        if (r.ok) {
          r.json().then((user) => {
            setUser(user);
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
      .finally(()=>{
        setSubmitting(false)
      })
      
  }
  // this is for the login without signup
  function mockLogin(username, password, navigate) {
    console.log("Nav test", navigate)
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => {
        if (r.ok) {
          r.json().then((user) => {
            setUser(user);
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
  // this will seed transactions on individual account pages
  function handleTransactionSeed() {
    fetch('/api/transactionseed', {
        method: 'POST',  
        headers: {
            'Content-Type': 'application/json',  
        },
    })
    .then(response => response.json())
    .then(document.location.reload())
    .catch(error => console.error('Error:', error)); 
}
function handleNewAccountSubmission(bank_name, account_value, account_type, setSubmitting, navigate, setErrorState) {
  fetch("/api/account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({bank_name, account_value, account_type}),
  })
  .then((r) => {
    if (r.ok) {
      navigate('/accounts')
      .then(document.location.reload())
    
    }
    else {
      console.log("Something went wrong")
      setSubmitting(false)
      setErrorState(true)
      
    }})
    
}
      

  return (
    <AppContext.Provider value={{loading,
     banks,
     categories,
     user,
     setUser,
     setLoading,
     setCategories,
     handleLogin,
     errors,
     handleTransactionSeed,
     mockLogin,
     handleNewAccountSubmission }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;