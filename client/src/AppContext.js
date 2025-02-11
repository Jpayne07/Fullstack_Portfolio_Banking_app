import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
      fetch('/api/insights')
      .then((r) => r.json())
      .then(insightsData => {
      setCategories(insightsData);
    }).catch(error => {
      console.log("error in insights")
      setLoading(false);
      
    });
  }, [user]);

  useEffect(() => {
    console.log('now checking session, Loading:',loading)
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
        // Optionally set an error state here
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleLogin(username, password, navigate, setSubmitting) {
    
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

  
      

  return (
    <AppContext.Provider value={{loading, categories, user, setUser, setLoading, setCategories, handleLogin, errors }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;