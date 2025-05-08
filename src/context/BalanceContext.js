// src/context/BalanceContext.js
import { createContext, useContext, useState } from 'react';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(null); // null indicates uninitialized

  const updateBalance = (newBalance) => {
    if (typeof newBalance === 'number') {
      setBalance(newBalance);
    }
  };

  return (
    <BalanceContext.Provider value={{ balance, setBalance: updateBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);
