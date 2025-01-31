import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [banks, setBanks] = useState([]);
  const [user, setUser] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/banks').then((r) => r.json()),
      fetch('/api/insights').then((r) => r.json())
    ]).then(([banksData, insightsData]) => {
      setBanks(banksData);
      setCategories(insightsData);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, [user]);




  return (
    <AppContext.Provider value={{loading, banks, categories, user, setUser, setBanks, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;