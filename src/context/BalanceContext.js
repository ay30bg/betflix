import { createContext, useContext, useState, useEffect } from 'react';

const BalanceContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setBalance(0);
          return;
        }
        const response = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch balance: ${response.status}`);
        }
        const data = await response.json();
        setBalance(typeof data.balance === 'number' ? data.balance : 0);
      } catch (err) {
        setError(err.message);
        setBalance(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, []);

  const updateBalance = (newBalance) => {
    if (typeof newBalance === 'number') {
      setBalance(newBalance);
    }
  };

  return (
    <BalanceContext.Provider value={{ balance, setBalance: updateBalance, isLoading, error }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};


