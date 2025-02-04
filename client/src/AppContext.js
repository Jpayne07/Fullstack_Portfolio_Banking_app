import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [banks, setBanks] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [user, setUser] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);



  
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/banks').then((r) => r.json()),
      fetch('/api/account').then((r) => r.json()),
      fetch('/api/insights').then((r) => r.json())
    ]).then(([banksData, accountsData, insightsData]) => {
      console.log("Fetched accounts data:", accountsData)
      setBanks(banksData);
      setAccounts(accountsData)
      setCategories(insightsData);
      setLoading(false);
      console.log("From effect:", accountsData)
    }).catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, []);




  return (
    <AppContext.Provider value={{loading, banks, categories, user, accounts, setUser, setBanks, setLoading, setAccounts, setCategories }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;