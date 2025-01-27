import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [banks, setBanks] = useState([]);
  const [user, setUser] = useState(null);
  const [transaction, setTransaction] = useState([]);



  useEffect(() => {
    fetch('/api/banks')
      .then((r) => r.json())
      .then((data) => {
        setBanks(data);
      });
  }, []);
  useEffect(() => {
    fetch('/api/transaction')
      .then((r) => r.json())
      .then((data) => {
        setTransaction(data);
      });
  }, []);

  useEffect(() => {
    fetch('/api/check_session')
      .then((r) => {
        if (r.ok) {
          r.json().then((user) => {
            setUser(user);
          });
        }
      });
  }, []);

  return (
    <AppContext.Provider value={{ banks, transaction, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;