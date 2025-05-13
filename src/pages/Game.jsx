// import React, { useState, useEffect, useCallback, memo } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { useBalance } from '../context/BalanceContext';
// import BetForm from '../components/BetForm';
// import HistoryTable from '../components/HistoryTable';
// import Header from '../components/header';
// import '../styles/game.css';

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { error: null };
//   static getDerivedStateFromError(error) {
//     return { error };
//   }
//   render() {
//     if (this.state.error) {
//       return <div>Error: {this.state.error.message}</div>;
//     }
//     return this.props.children;
//   }
// }

// const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// // API Functions
// const fetchBets = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   const response = await fetch(`${API_URL}/api/bets/history`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     if (response.status === 401) throw new Error('Authentication required');
//     throw new Error(errorData || `Bets fetch failed: ${response.status}`);
//   }
//   const bets = await response.json();
//   return bets.filter(bet => bet && bet.type && bet.value !== undefined && bet.amount !== undefined);
// };

// const fetchCurrentRound = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   const response = await fetch(`${API_URL}/api/bets/current`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     if (response.status === 401) throw new Error('Authentication required');
//     if (response.status === 429) throw new Error('Too many requests, please try again later');
//     throw new Error(errorData || `Round fetch failed: ${response.status}`);
//   }
//   return response.json();
// };

// const placeBet = async (betData) => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   const response = await fetch(`${API_URL}/api/bets`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(betData),
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.error || `Bet placement failed: ${response.status}`);
//   }
//   return response.json();
// };

// const fetchBetResult = async (period) => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   console.log(`Fetching result for period: ${period}`);
//   const response = await fetch(`${API_URL}/api/bets/result/${period}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     console.error(`Error response: ${JSON.stringify(errorData)}`);
//     throw new Error(errorData.error || `Bet result fetch failed: ${response.status}`);
//   }
//   return response.json();
// };

// function Game() {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { balance, setBalance, isLoading: balanceLoading, error: balanceError } = useBalance();
//   const [error, setError] = useState('');
//   const [notification, setNotification] = useState(null);
//   const [lastResult, setLastResult] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [pendingBet, setPendingBet] = useState(null);

//   // Handle authentication errors
//   const handleAuthError = useCallback((message) => {
//     setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
//     localStorage.removeItem('token');
//     setTimeout(() => {
//       navigate('/login');
//     }, 3000);
//   }, [navigate]);

//   const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
//     queryKey: ['bets'],
//     queryFn: fetchBets,
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setError(errorMessage);
//       setTimeout(() => setError(''), 5000);
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//   });

//   const { data: roundData, isLoading: roundLoading } = useQuery({
//     queryKey: ['currentRound'],
//     queryFn: fetchCurrentRound,
//     refetchInterval: 6000,
//     staleTime: 6000,
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setError(errorMessage);
//       setTimeout(() => setError(''), 5000);
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//   });

//   // Update timeLeft every second
//   useEffect(() => {
//     if (roundData?.expiresAt) {
//       const updateTimeLeft = () => {
//         const timeRemaining = Math.max(0, (new Date(roundData.expiresAt) - Date.now()) / 1000);
//         setTimeLeft(Math.floor(timeRemaining));
//       };
//       updateTimeLeft();
//       const interval = setInterval(updateTimeLeft, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [roundData]);

//   // Clear notification after 3 seconds
//   useEffect(() => {
//     if (notification) {
//       const timeout = setTimeout(() => setNotification(null), 3000);
//       return () => clearTimeout(timeout);
//     }
//   }, [notification]);

//   // Fetch bet result with retry logic
//   const fetchResult = useCallback(async (retryCount = 3) => {
//     if (!pendingBet?.period) {
//       console.warn('No pending bet period available');
//       setError('No valid bet period available');
//       setPendingBet(null);
//       return;
//     }
//     if (!/^round-\d+$/.test(pendingBet.period)) {
//       console.warn(`Invalid period format: ${pendingBet.period}`);
//       setError('Invalid bet period format');
//       setPendingBet(null);
//       return;
//     }
//     try {
//       console.log(`Attempting to fetch result for period: ${pendingBet.period}`);
//       const data = await fetchBetResult(pendingBet.period);
//       if (!data.bet || typeof data.bet.result === 'undefined') {
//         console.warn(`Result not ready, retries left: ${retryCount}`);
//         if (retryCount > 0) {
//           setTimeout(() => fetchResult(retryCount - 1), 3000);
//           return;
//         }
//         setError('Result not available');
//         setPendingBet(null);
//         return;
//       }
//       setLastResult({ ...data.bet, payout: data.bet.payout });
//       if (typeof data.balance === 'number') {
//         setBalance(data.balance);
//       }
//       queryClient.invalidateQueries(['bets']);
//       setPendingBet(null);
//     } catch (err) {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message.includes('Round has expired')
//         ? 'Round has ended. Please place a new bet.'
//         : err.message;
//       console.error(`Fetch result error: ${err.message}`);
//       setError(errorMessage);
//       setTimeout(() => setError(''), 5000);
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       } else if (err.message.includes('Round has expired')) {
//         setPendingBet(null);
//       }
//     }
//   }, [pendingBet, queryClient, setBalance, handleAuthError]);

//   // Trigger fetchResult at 15 seconds for 2-minute rounds
//   useEffect(() => {
//     if (timeLeft <= 15 && pendingBet && !lastResult) {
//       const timer = setTimeout(() => {
//         fetchResult();
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [timeLeft, pendingBet, fetchResult, lastResult]);

//   const mutation = useMutation({
//     mutationFn: placeBet,
//     onSuccess: (data) => {
//       console.log('Place bet response:', data);
//       if (typeof data.balance === 'number') {
//         setBalance(data.balance);
//       }
//       setPendingBet(data.bet);
//       setError('');
//     },
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setError(errorMessage);
//       setTimeout(() => setError(''), 5000);
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//   });

//   const getResultColorClass = useCallback((result, type) => {
//     if (!result) return '';
//     if (type === 'color') {
//       return result.toLowerCase();
//     }
//     return parseInt(result) % 2 === 0 ? 'green' : 'red';
//   }, []);

//   const handleBet = async (betData) => {
//     if (betData.error) {
//       setError(betData.error);
//       setTimeout(() => setError(''), 5000);
//       return;
//     }
//     if (betData.amount > (balance ?? 0)) {
//       setError('Insufficient balance');
//       setTimeout(() => setError(''), 5000);
//       return;
//     }
//     try {
//       await mutation.mutateAsync(betData);
//     } catch (err) {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setError(errorMessage);
//       setTimeout(() => setError(''), 5000);
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     }
//   };

//   // Render loading state
//   if (balanceLoading || betsLoading || roundLoading) {
//     return (
//       <ErrorBoundary>
//         <div className="game-page container">
//           <Header />
//           <div className="loading-spinner" aria-live="polite">Loading...</div>
//         </div>
//       </ErrorBoundary>
//     );
//   }

//   // Render main UI
//   return (
//     <ErrorBoundary>
//       <div className="game-page container">
//         <Header />
//         {notification && (
//           <div className={`result ${notification.type}`} role="alert" aria-live="polite">
//             {notification.message}
//           </div>
//         )}
//         {error && !notification && (
//           <p className="game-error" role="alert" aria-live="polite">
//             {error}
//           </p>
//         )}
//         {(balanceError || betsError) && (
//           <p className="game-error" role="alert" aria-live="polite">
//             {balanceError?.message || betsError?.message}
//           </p>
//         )}
//         <div className="game958">
//           <div className="round-info">
//             <p>Current Round: {roundData?.period || 'Loading...'}</p>
//             <p>Time Left: {timeLeft} seconds</p>
//             <p>Expires At: {roundData?.expiresAt || 'N/A'}</p>
//           </div>
//         </div>
//         {mutation.isLoading && (
//           <div className="loading-spinner" aria-live="polite">Processing Bet...</div>
//         )}
//         {lastResult && (
//           <div
//             key={lastResult.period}
//             className={`result ${getResultColorClass(lastResult.result, lastResult.type)} ${lastResult.won ? 'won' : 'lost'}`}
//             role="alert"
//             aria-live="polite"
//           >
//             <button
//               className="result-close"
//               onClick={() => setLastResult(null)}
//               aria-label="Close bet result notification"
//             >
//               ×
//             </button>
//             <div className="result-header">
//               {lastResult.won ? (
//                 <span className="result-icon">🎉 You Won!</span>
//               ) : (
//                 <span className="result-icon">😔 You Lost</span>
//               )}
//             </div>
//             <div className="result-detail">
//               {lastResult.type === 'color' ? `Color: ${lastResult.result || 'Pending'}` : `Number: ${lastResult.result || 'Pending'}`}
//             </div>
//             <div className="result-payout">
//               {lastResult.payout === 0
//                 ? 'No Payout'
//                 : lastResult.won
//                 ? `+$${Math.abs(lastResult.payout).toFixed(2)}`
//                 : `-$${Math.abs(lastResult.payout).toFixed(2)}`}
//             </div>
//           </div>
//         )}
//         {pendingBet && !lastResult && !mutation.isLoading && (
//           <p className="no-result">Bet placed, waiting for round to end...</p>
//         )}
//         {!pendingBet && !lastResult && !mutation.isLoading && (
//           <p className="no-result">Place a bet to see the result.</p>
//         )}
//         <BetForm
//           onSubmit={handleBet}
//           isLoading={mutation.isLoading}
//           balance={balance ?? 0}
//           // Updated: Disable betting when timeLeft < 10 seconds
//           isDisabled={(balance ?? 0) === 0 || mutation.isLoading || timeLeft < 10}
//           roundData={roundData}
//           timeLeft={timeLeft}
//         />
//         <HistoryTable bets={betsData || []} />
//       </div>
//     </ErrorBoundary>
//   );
// }

// export default memo(Game);


import React, { useState, useEffect, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext';
import BetForm from '../components/BetForm';
import HistoryTable from '../components/HistoryTable';
import Header from '../components/header';
import '../styles/game.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// API Functions
const fetchBets = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(errorData || `Bets fetch failed: ${response.status}`);
  }
  const bets = await response.json();
  return bets.filter(bet => bet && bet.type && bet.value !== undefined && bet.amount !== undefined);
};

const fetchCurrentRound = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/current`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    if (response.status === 401) throw new Error('Authentication required');
    if (response.status === 429) throw new Error('Too many requests, please try again later');
    throw new Error(errorData || `Round fetch failed: ${response.status}`);
  }
  return response.json();
};

const placeBet = async (betData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(betData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Bet placement failed: ${response.status}`);
  }
  return response.json();
};

const fetchBetResult = async (period) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  console.log(`Fetching result for period: ${period}`);
  const response = await fetch(`${API_URL}/api/bets/result/${period}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Error response: ${JSON.stringify(errorData)}`);
    throw new Error(errorData.error || `Bet result fetch failed: ${response.status}`);
  }
  return response.json();
};

function Game() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { balance, setBalance, isLoading: balanceLoading, error: balanceError } = useBalance();
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [lastResults, setLastResults] = useState([]); // Changed to array for multiple results
  const [timeLeft, setTimeLeft] = useState(0);
  const [pendingBets, setPendingBets] = useState([]); // Changed to array for multiple bets
  const [betCount, setBetCount] = useState(0); // Track number of bets in current round

  // Handle authentication errors
  const handleAuthError = useCallback((message) => {
    setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
    localStorage.removeItem('token');
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  }, [navigate]);

  const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
    queryKey: ['bets'],
    queryFn: fetchBets,
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  const { data: roundData, isLoading: roundLoading } = useQuery({
    queryKey: ['currentRound'],
    queryFn: fetchCurrentRound,
    refetchInterval: 6000,
    staleTime: 6000,
    onSuccess: (data) => {
      // Reset pending bets and bet count if round changes
      if (pendingBets.length > 0 && pendingBets[0]?.period !== data.period) {
        setPendingBets([]);
        setBetCount(0);
        setLastResults([]);
      }
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  // Update timeLeft every second
  useEffect(() => {
    if (roundData?.expiresAt) {
      const updateTimeLeft = () => {
        const timeRemaining = Math.max(0, (new Date(roundData.expiresAt) - snatchers = new Date()) / 1000);
        setTimeLeft(Math.floor(timeRemaining));
      };
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [roundData]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  // Fetch bet results with retry logic
  const fetchResult = useCallback(
    async (period, retryCount = 3) => {
      if (!period || !/^round-\d+$/.test(period)) {
        console.warn(`Invalid period format: ${period}`);
        setError('Invalid bet period format');
        setPendingBets([]);
        setBetCount(0);
        return;
      }
      try {
        console.log(`Attempting to fetch results for period: ${period}`);
        const data = await fetchBetResult(period);
        if (!data.bets || data.bets.every(bet => typeof bet.result === 'undefined')) {
          console.warn(`Results not ready, retries left: ${retryCount}`);
          if (retryCount > 0) {
            setTimeout(() => fetchResult(period, retryCount - 1), 3000);
            return;
          }
          setError('Results not available');
          setPendingBets([]);
          setBetCount(0);
          return;
        }
        setLastResults(data.bets.map(bet => ({ ...bet, payout: bet.payout })));
        if (typeof data.balance === 'number') {
          setBalance(data.balance);
        }
        queryClient.invalidateQueries(['bets']);
        setPendingBets([]);
        setBetCount(0);
      } catch (err) {
        const errorMessage = err.message.includes('Authentication required')
          ? 'Session expired. Please log in again.'
          : err.message.includes('Round has expired')
          ? 'Round has ended. Please place a new bet.'
          : err.message;
        console.error(`Fetch result error: ${err.message}`);
        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
        if (err.message.includes('Authentication required')) {
          handleAuthError(errorMessage);
        } else if (err.message.includes('Round has expired')) {
          setPendingBets([]);
          setBetCount(0);
        }
      }
    },
    [queryClient, setBalance, handleAuthError]
  );

  // Trigger fetchResult at 15 seconds for 2-minute rounds
  useEffect(() => {
    if (timeLeft <= 15 && pendingBets.length > 0 && lastResults.length === 0) {
      const timer = setTimeout(() => {
        if (pendingBets[0]?.period) {
          fetchResult(pendingBets[0].period);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, pendingBets, fetchResult, lastResults]);

  const mutation = useMutation({
    mutationFn: placeBet,
    onSuccess: (data) => {
      console.log('Place bet response:', data);
      if (typeof data.balance === 'number') {
        setBalance(data.balance);
      }
      setPendingBets(prev => [...prev, data.bet]);
      setBetCount(prev => prev + 1);
      setError('');
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
  });

  const getResultColorClass = useCallback((result, type) => {
    if (!result) return '';
    if (type === 'color') {
      return result.toLowerCase();
    }
    return parseInt(result) % 2 === 0 ? 'green' : 'red';
  }, []);

  const handleBet = async (betData) => {
    if (betData.error) {
      setError(betData.error);
      setTimeout(() => setError(''), 5000);
      return;
    }
    if (betData.amount > (balance ?? 0)) {
      setError('Insufficient balance');
      setTimeout(() => setError(''), 5000);
      return;
    }
    if (betCount >= 3) {
      setError('Maximum of 3 bets allowed per round');
      setTimeout(() => setError(''), 5000);
      return;
    }
    try {
      await mutation.mutateAsync(betData);
    } catch (err) {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    }
  };

  // Render loading state
  if (balanceLoading || betsLoading || roundLoading) {
    return (
      <ErrorBoundary>
        <div className="game-page container">
          <Header />
          <div className="loading-spinner" aria-live="polite">Loading...</div>
        </div>
      </ErrorBoundary>
    );
  }

  // Render main UI
  return (
    <ErrorBoundary>
      <div className="game-page container">
        <Header />
        {notification && (
          <div className={`result ${notification.type}`} role="alert" aria-live="polite">
            {notification.message}
          </div>
        )}
        {error && !notification && (
          <p className="game-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        {(balanceError || betsError) && (
          <p className="game-error" role="alert" aria-live="polite">
            {balanceError?.message || betsError?.message}
          </p>
        )}
        <div className="game958">
          <div className="round-info">
            <p>Current Round: {roundData?.period || 'Loading...'}</p>
            <p>Time Left: {timeLeft} seconds</p>
            <p>Expires At: {roundData?.expiresAt || 'N/A'}</p>
            <p>Bets Placed: {betCount}/3</p>
          </div>
        </div>
        {mutation.isLoading && (
          <div className="loading-spinner" aria-live="polite">Processing Bet...</div>
        )}
        {lastResults.length > 0 && (
          <div className="results-container">
            {lastResults.map(result => (
              <div
                key={result._id}
                className={`result ${getResultColorClass(result.result, result.type)} ${result.won ? 'won' : 'lost'}`}
                role="alert"
                aria-live="polite"
              >
                <button
                  className="result-close"
                  onClick={() => setLastResults(prev => prev.filter(r => r._id !== result._id))}
                  aria-label="Close bet result notification"
                >
                  ×
                </button>
                <div className="result-header">
                  {result.won ? (
                    <span className="result-icon">🎉 You Won!</span>
                  ) : (
                    <span className="result-icon">😔 You Lost</span>
                  )}
                </div>
                <div className="result-detail">
                  {result.type === 'color' ? `Color: ${result.result || 'Pending'}` : `Number: ${result.result || 'Pending'}`}
                </div>
                <div className="result-payout">
                  {result.payout === 0
                    ? 'No Payout'
                    : result.won
                    ? `+$${Math.abs(result.payout).toFixed(2)}`
                    : `-$${Math.abs(result.payout).toFixed(2)}`}
                </div>
              </div>
            ))}
          </div>
        )}
        {pendingBets.length > 0 && lastResults.length === 0 && !mutation.isLoading && (
          <div className="pending-bets">
            {pendingBets.map(bet => (
              <p key={bet._id} className="no-result">
                Bet placed ({bet.type}: {bet.value}, ${bet.amount.toFixed(2)}), waiting for round to end...
              </p>
            ))}
          </div>
        )}
        {pendingBets.length === 0 && lastResults.length === 0 && !mutation.isLoading && (
          <p className="no-result">Place a bet to see the result.</p>
        )}
        <BetForm
          onSubmit={handleBet}
          isLoading={mutation.isLoading}
          balance={balance ?? 0}
          isDisabled={(balance ?? 0) === 0 || mutation.isLoading || timeLeft < 10 || betCount >= 3}
          roundData={roundData}
          timeLeft={timeLeft}
        />
        <HistoryTable bets={betsData || []} />
      </div>
    </ErrorBoundary>
  );
}

export default memo(Game);
