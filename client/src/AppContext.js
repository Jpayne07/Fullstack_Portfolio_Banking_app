import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [banks, setBanks] = useState([]);
  const [user, setUser] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    fetch('/api/banks')
      .then((r) => r.json())
      .then((data) => {
        setBanks(data);
      });
  }, []);
  useEffect(() => {
    fetch('/api/insights')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  useEffect(() => {
    fetch('/api/check_session')
      .then((r) => r.ok ? r.json() : null)
      .then((user) => {
        setUser(user);
        setLoading(false);
      });
  }, []);

  return (
    <AppContext.Provider value={{loading, banks, categories, user, setUser, setBanks }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;