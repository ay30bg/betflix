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


import { createContext, useContext, useState, useEffect } from 'react';

const BalanceContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';
const CONVERSION_RATE = 10; // 1 USDT = 10 in-game currency

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
        // Convert USDT to in-game currency
        const convertedBalance = typeof data.balance === 'number' ? data.balance * CONVERSION_RATE : 0;
        setBalance(convertedBalance);
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
      // Convert USDT to in-game currency
      setBalance(newBalance * CONVERSION_RATE);
    }
  };

  const withdraw = async ({ amountInGameCurrency, cryptoCurrency, walletAddress, network }) => {
    if (typeof amountInGameCurrency !== 'number' || amountInGameCurrency <= 0) {
      setError('Invalid withdrawal amount');
      return { success: false, message: 'Invalid withdrawal amount' };
    }

    if (amountInGameCurrency > balance) {
      setError('Insufficient balance');
      return { success: false, message: 'Insufficient balance' };
    }

    if (!['BTC', 'ETH', 'USDT'].includes(cryptoCurrency)) {
      setError('Unsupported cryptocurrency');
      return { success: false, message: 'Unsupported cryptocurrency' };
    }

    if (cryptoCurrency === 'USDT' && !['BEP20', 'TRC20', 'TON'].includes(network)) {
      setError('Invalid or missing USDT network');
      return { success: false, message: 'Invalid or missing USDT network' };
    }

    if (!walletAddress || !/^[a-zA-Z0-9]{26,48}$/.test(walletAddress)) {
      setError('Invalid wallet address');
      return { success: false, message: 'Invalid wallet address' };
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return { success: false, message: 'No authentication token found' };
      }

      // Convert in-game currency to USDT
      const amountInUSDT = amountInGameCurrency / CONVERSION_RATE;

      const response = await fetch(`${API_URL}/api/user/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amountInUSDT,
          cryptoCurrency,
          walletAddress,
          network,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Withdrawal failed: ${response.status}`);
      }

      const data = await response.json();
      // Update balance with the new balance from API (converted to in-game currency)
      const newBalance = typeof data.balance === 'number' ? data.balance * CONVERSION_RATE : 0;
      setBalance(newBalance);
      setError(null);
      return { success: true, message: data.message, newBalance };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BalanceContext.Provider value={{ balance, setBalance: updateBalance, withdraw, isLoading, error }}>
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
