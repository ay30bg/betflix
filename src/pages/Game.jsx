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

// const fetchAllRounds = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   const response = await fetch(`${API_URL}/api/bets/rounds/history`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     if (response.status === 401) throw new Error('Authentication required');
//     throw new Error(errorData || `Rounds fetch failed: ${response.status}`);
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
//   const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

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

//   const { data: allRoundsData, isLoading: roundsLoading } = useQuery({
//     queryKey: ['allRounds'],
//     queryFn: fetchAllRounds,
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
//       queryClient.invalidateQueries(['stats']); // Invalidate stats to refresh Profile stats
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
//   if (balanceLoading || betsLoading || roundLoading || roundsLoading) {
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
//             <button
//               className="history-button"
//               onClick={() => setIsHistoryModalOpen(true)}
//               aria-label="View all rounds history"
//             >
//               View All Rounds
//             </button>
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
//           <div className="pending-bet-notification" role="alert" aria-live="polite">
//             <p>Bet placed on round {pendingBet.period}.</p>
//             <p>Waiting for results... ({timeLeft} seconds remaining)</p>
//           </div>
//         )}
//         {!pendingBet && !lastResult && !mutation.isLoading && (
//           <p className="no-result">Place a bet to see the result.</p>
//         )}
//         {isHistoryModalOpen && (
//           <div className="modal-overlay" role="dialog" aria-labelledby="history-modal-title">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h2 id="history-modal-title">All Rounds History</h2>
//                 <button
//                   className="modal-close"
//                   onClick={() => setIsHistoryModalOpen(false)}
//                   aria-label="Close modal"
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <table className="history-table">
//                   <thead>
//                     <tr>
//                       <th>Period</th>
//                       <th>Color</th>
//                       <th>Number</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {allRoundsData?.length > 0 ? (
//                       allRoundsData.map((round) => (
//                         <tr key={round.period}>
//                           <td>{round.period}</td>
//                           <td className={`color-${round.result?.color?.toLowerCase()}`}>
//                             {round.result?.color || 'N/A'}
//                           </td>
//                           <td>{round.result?.number || 'N/A'}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="3">No rounds available</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//         <BetForm
//           onSubmit={handleBet}
//           isLoading={mutation.isLoading}
//           balance={balance ?? 0}
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
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useBalance } from '../context/BalanceContext';
import BetForm from '../components/BetForm';
import HistoryTable from '../components/HistoryTable';
import Header from '../components/header';
import '../styles/game.css';

// Error Boundary Fallback
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="error-boundary" role="alert">
    <p>Error: {error.message}</p>
    <button onClick={resetErrorBoundary} aria-label="Retry loading game">
      Retry
    </button>
  </div>
);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// API Functions
const fetchBets = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/history?includePending=false`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(errorData || `Bets fetch failed: ${response.status}`);
  }
  const bets = await response.json();
  return bets.filter(
    (bet) =>
      bet &&
      bet.type &&
      bet.value !== undefined &&
      bet.amount !== undefined &&
      bet.status !== 'pending'
  );
};

const fetchCurrentRound = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_URL}/api/bets/current`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.text().catch(() => 'Unknown error');
      if (response.status === 401) throw new Error('Authentication required');
      if (response.status === 429) throw new Error('Too many requests, please try again later');
      throw new Error(errorData || `Round fetch failed: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  }
};

const placeBet = async (betData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_URL}/api/bets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(betData),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Bet placement failed: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  }
};

const fetchBetResult = async (period) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_URL}/api/bets/result/${period}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Bet result fetch failed: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  }
};

const fetchAllRounds = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_URL}/api/bets/rounds/history`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.text().catch(() => 'Unknown error');
      if (response.status === 401) throw new Error('Authentication required');
      throw new Error(errorData || `Rounds fetch failed: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  }
};

function Game() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { balance, setBalance, isLoading: balanceLoading, error: balanceError } = useBalance();
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pendingBet, setPendingBet] = useState(() => {
    const saved = localStorage.getItem('pendingBet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.period && /^round-\d+$/.test(parsed.period)) {
          return parsed;
        }
      } catch {
        localStorage.removeItem('pendingBet');
      }
    }
    return null;
  });
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Redirect if no token
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setNotification({ type: 'error', message: 'Please log in to continue.' });
      navigate('/login');
    }
  }, [navigate]);

  // Save pendingBet to localStorage
  useEffect(() => {
    if (pendingBet) {
      localStorage.setItem('pendingBet', JSON.stringify(pendingBet));
    } else {
      localStorage.removeItem('pendingBet');
    }
  }, [pendingBet]);

  // Handle authentication errors centrally
  useEffect(() => {
    if (
      error.includes('Authentication required') ||
      balanceError?.message.includes('Authentication required')
    ) {
      setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [error, balanceError, navigate]);

  // Check for pending bets from backend
  const { data: pendingBets } = useQuery({
    queryKey: ['pendingBets'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return [];
      const response = await fetch(`${API_URL}/api/bets/history?includePending=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch pending bets');
      const bets = await response.json();
      return bets.filter((bet) => bet.status === 'pending');
    },
    onSuccess: (data) => {
      if (data.length > 0 && !pendingBet) {
        setPendingBet(data[0]);
      }
    },
    enabled: !!localStorage.getItem('token'),
  });

  const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
    queryKey: ['bets'],
    queryFn: fetchBets,
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  const { data: roundData, isLoading: roundLoading } = useQuery({
    queryKey: ['currentRound'],
    queryFn: fetchCurrentRound,
    refetchInterval: document.visibilityState === 'visible' ? 6000 : false,
    staleTime: 6000,
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  const { data: allRoundsData, isLoading: roundsLoading } = useQuery({
    queryKey: ['allRounds'],
    queryFn: fetchAllRounds,
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  // Update timeLeft every second
  useEffect(() => {
    if (roundData?.expiresAt && !isNaN(new Date(roundData.expiresAt).getTime())) {
      const updateTimeLeft = () => {
        const timeRemaining = Math.max(0, (new Date(roundData.expiresAt) - Date.now()) / 1000);
        setTimeLeft(Math.floor(timeRemaining));
      };
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(0);
    }
  }, [roundData]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  // Prevent navigation during bet processing
  const handleBeforeUnload = useCallback(
    (e) => {
      if (pendingBet || mutation.isLoading) {
        e.preventDefault();
        e.returnValue = 'You have a pending bet. Are you sure you want to leave?';
      }
    },
    [pendingBet, mutation.isLoading]
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleBeforeUnload]);

  // Modal accessibility
  useEffect(() => {
    if (isHistoryModalOpen)5
      const modal = document.querySelector('.modal-content');
      if (modal) modal.focus();
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsHistoryModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isHistoryModalOpen]);

  // Fetch bet result with retry logic
  const fetchResult = useCallback(
    async (retryCount = 3) => {
      if (!pendingBet?.period || !/^round-\d+$/.test(pendingBet.period)) {
        setError('Invalid bet period');
        setPendingBet(null);
        setTimeout(() => setError(''), 5000);
        return;
      }
      try {
        const data = await fetchBetResult(pendingBet.period);
        if (!data.bet || typeof data.bet.result === 'undefined' || data.bet.status === 'pending') {
          if (retryCount > 0) {
            setTimeout(() => fetchResult(retryCount - 1), 3000);
            return;
          }
          setError('Result not available');
          setPendingBet(null);
          setTimeout(() => setError(''), 5000);
          return;
        }
        if (
          !data.bet.type ||
          data.bet.value === undefined ||
          data.bet.amount === undefined ||
          data.bet.status === 'pending'
        ) {
          setError('Invalid bet data received');
          setPendingBet(null);
          setTimeout(() => setError(''), 5000);
          return;
        }
        setLastResult({ ...data.bet, payout: data.bet.payout });
        if (typeof data.balance === 'number') {
          setBalance(data.balance);
        }
        queryClient.invalidateQueries(['bets']);
        queryClient.invalidateQueries(['stats']);
        setPendingBet(null);
      } catch (err) {
        const errorMessage = err.message.includes('Round has expired')
          ? 'Round has ended. Please place a new bet.'
          : err.message;
        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
        if (err.message.includes('Round has expired')) {
          setPendingBet(null);
          queryClient.invalidateQueries(['bets']);
        }
      }
    },
    [pendingBet, queryClient, setBalance]
  );

  // Trigger fetchResult for pending bets
  useEffect(() => {
    if (pendingBet && !lastResult) {
      fetchResult();
    }
  }, [pendingBet, lastResult, fetchResult]);

  const mutation = useMutation({
    mutationFn: placeBet,
    onSuccess: (data) => {
      if (typeof data.balance === 'number') {
        setBalance(data.balance);
      }
      setPendingBet({ ...data.bet, status: 'pending' });
      setError('');
    },
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    },
  });

  const getResultColorClass = useCallback((result, type) => {
    if (!result || !type) return '';
    if (type === 'color') {
      return result.toLowerCase() || '';
    }
    const num = parseInt(result, 10);
    return isNaN(num) ? '' : num % 2 === 0 ? 'green' : 'red';
  }, []);

  const handleBet = async (betData) => {
    if (betData.error) {
      setError(betData.error);
      setTimeout(() => setError(''), 5000);
      return;
    }
    if (typeof balance !== 'number' || balance < 0) {
      setError('Invalid balance. Please try again later.');
      setTimeout(() => setError(''), 5000);
      return;
    }
    if (betData.amount > balance) {
      setError('Insufficient balance');
      setTimeout(() => setError(''), 5000);
      return;
    }
    try {
      await mutation.mutateAsync(betData);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  // Render loading state
  if (balanceLoading || betsLoading || roundLoading || roundsLoading) {
    return (
      <ReactErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="game-page container">
          <Header />
          <div className="loading-spinner" aria-live="polite">
            Loading...
          </div>
        </div>
      </ReactErrorBoundary>
    );
  }

  // Render main UI
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
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
            <button
              className="history-button"
              onClick={() => setIsHistoryModalOpen(true)}
              aria-label="View all rounds history"
            >
              View All Rounds
            </button>
          </div>
        </div>
        {mutation.isLoading && (
          <div className="loading-spinner" aria-live="polite">
            Processing Bet...
          </div>
        )}
        {lastResult && (
          <div
            key={lastResult.period}
            className={`result ${getResultColorClass(lastResult.result, lastResult.type)} ${
              lastResult.won ? 'won' : 'lost'
            }`}
            role="alert"
            aria-live="polite"
          >
            <button
              className="result-close"
              onClick={() => setLastResult(null)}
              aria-label="Close bet result notification"
            >
              ×
            </button>
            <div className="result-header">
              {lastResult.won ? (
                <span className="result-icon">🎉 You Won!</span>
              ) : (
                <span className="result-icon">😔 You Lost</span>
              )}
            </div>
            <div className="result-detail">
              {lastResult.type === 'color'
                ? `Color: ${lastResult.result || 'Pending'}`
                : `Number: ${lastResult.result || 'Pending'}`}
            </div>
            <div className="result-payout">
              {lastResult.payout === 0
                ? 'No Payout'
                : lastResult.won
                ? `+$${Math.abs(lastResult.payout).toFixed(2)}`
                : `-$${Math.abs(lastResult.payout).toFixed(2)}`}
            </div>
          </div>
        )}
        {pendingBet && !lastResult && !mutation.isLoading && (
          <div className="pending-bet-notification" role="alert" aria-live="polite">
            <p>Bet placed on round {pendingBet.period}.</p>
            <p>Waiting for results... ({timeLeft} seconds remaining)</p>
          </div>
        )}
        {!pendingBet && !lastResult && !mutation.isLoading && (
          <p className="no-result">Place a bet to see the result.</p>
        )}
        {isHistoryModalOpen && (
          <div className="modal-overlay" role="dialog" aria-labelledby="history-modal-title">
            <div className="modal-content" tabIndex={-1}>
              <div className="modal-header">
                <h2 id="history-modal-title">All Rounds History</h2>
                <button
                  className="modal-close"
                  onClick={() => setIsHistoryModalOpen(false)}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Color</th>
                      <th>Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRoundsData?.length > 0 ? (
                      allRoundsData.map((round) => (
                        <tr key={round.period}>
                          <td>{round.period}</td>
                          <td className={`color-${round.result?.color?.toLowerCase()}`}>
                            {round.result?.color || 'N/A'}
                          </td>
                          <td>{round.result?.number || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No rounds available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        <BetForm
          onSubmit={handleBet}
          isLoading={mutation.isLoading}
          balance={typeof balance === 'number' ? balance : 0}
          isDisabled={
            typeof balance !== 'number' ||
            balance === 0 ||
            mutation.isLoading ||
            timeLeft < 10
          }
          roundData={roundData}
          timeLeft={timeLeft}
        />
        <HistoryTable bets={betsData || []} />
      </div>
    </ReactErrorBoundary>
  );
}

export default memo(Game);
