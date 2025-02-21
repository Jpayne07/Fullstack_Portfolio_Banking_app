import React, { createContext, useState, useEffect  } from 'react';


const AppContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [banks, setBanks] = useState([])

  useEffect(() => {
      
      fetch(`/api/insights`,{
        method: 'GET',
        credentials: 'include'
      })
      .then((r) => r.json())
      .then(insightsData => {
      setCategories(insightsData);
    }).catch(error => {
      console.log("Error fetching insights", error)
      setLoading(false);
      
    });
  }, [user]);
  
  useEffect(() => {
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
}, []);

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
          console.log(data)
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
        if (r.ok) {
          r.json().then((user) => {
            setUser(user);
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
    console.log("Nav test", navigate)
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
    .then(document.location.reload())
    .catch(error => console.error('Error:', error)); 
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
     mockLogin, API_URL }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;