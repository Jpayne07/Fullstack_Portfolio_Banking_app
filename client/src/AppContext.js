import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [banks, setBanks] = useState([]);
  const [user, setUser] = useState(null);



  useEffect(() => {
    fetch('/api/banks')
      .then((r) => r.json())
      .then((data) => {
        setBanks(data);
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
    <AppContext.Provider value={{ banks, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;