// import { createContext, useContext, useState, useEffect } from 'react';

// const BalanceContext = createContext();
// const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// export const BalanceProvider = ({ children }) => {
//   const [balance, setBalance] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBalance = async () => {
//       try {
//         setIsLoading(true);
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setBalance(0);
//           return;
//         }
//         const response = await fetch(`${API_URL}/api/user/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!response.ok) {
//           throw new Error(`Failed to fetch balance: ${response.status}`);
//         }
//         const data = await response.json();
//         setBalance(typeof data.balance === 'number' ? data.balance : 0);
//       } catch (err) {
//         setError(err.message);
//         setBalance(0);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchBalance();
//   }, []);

//   const updateBalance = (newBalance) => {
//     if (typeof newBalance === 'number') {
//       setBalance(newBalance);
//     }
//   };

//   return (
//     <BalanceContext.Provider value={{ balance, setBalance: updateBalance, isLoading, error }}>
//       {children}
//     </BalanceContext.Provider>
//   );
// };

// export const useBalance = () => {
//   const context = useContext(BalanceContext);
//   if (!context) {
//     throw new Error('useBalance must be used within a BalanceProvider');
//   }
//   return context;
// };


import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const BalanceContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

export const BalanceProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingBet, setPendingBet] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [notification, setNotification] = useState(null);

  // Handle authentication errors
  const handleAuthError = useCallback(
    (message) => {
      setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
      localStorage.removeItem('token');
      setBalance(0);
      setPendingBet(null);
      setLastResult(null);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    },
    [navigate]
  );

  // Fetch balance
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
          if (response.status === 401) {
            throw new Error('Authentication required');
          }
          throw new Error(`Failed to fetch balance: ${response.status}`);
        }
        const data = await response.json();
        setBalance(typeof data.balance === 'number' ? data.balance : 0);
      } catch (err) {
        setError(err.message);
        setBalance(0);
        if (err.message.includes('Authentication')) {
          handleAuthError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, [handleAuthError]);

  // Poll for bet result
  useEffect(() => {
    if (!pendingBet?.period) return;

    const fetchResult = async (retryCount = 3) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');
        const response = await fetch(`${API_URL}/api/bets/result/${pendingBet.period}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 401) throw new Error('Authentication required');
          throw new Error(errorData.error || `Bet result fetch failed: ${response.status}`);
        }
        const data = await response.json();
        if (!data.bet || typeof data.bet.result === 'undefined') {
          if (retryCount > 0) {
            setTimeout(() => fetchResult(retryCount - 1), 2000);
            return;
          }
          setError('Result not available');
          setPendingBet(null);
          return;
        }
        setLastResult({ ...data.bet, payout: data.bet.payout });
        if (typeof data.balance === 'number') {
          setBalance(data.balance);
        }
        queryClient.invalidateQueries(['bets']);
        setPendingBet(null);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(null), 5000);
        if (err.message.includes('Authentication required')) {
          handleAuthError(err.message);
        }
      }
    };

    const interval = setInterval(() => {
      fetchResult();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [pendingBet, queryClient, handleAuthError]);

  // Clear notifications after 3 seconds
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const updateBalance = (newBalance) => {
    if (typeof newBalance === 'number') {
      setBalance(newBalance);
    }
  };

  return (
    <BalanceContext.Provider
      value={{
        balance,
        setBalance: updateBalance,
        isLoading,
        error,
        pendingBet,
        setPendingBet,
        lastResult,
        setLastResult,
        handleAuthError,
        notification,
        setNotification,
      }}
    >
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
