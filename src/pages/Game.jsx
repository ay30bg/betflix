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
//   return bets.filter((bet) => bet && bet.status !== 'invalid');
// };

// const fetchPendingBets = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   const response = await fetch(`${API_URL}/api/bets/pending`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     if (response.status === 401) throw new Error('Authentication required');
//     throw new Error(errorData || `Pending bets fetch failed: ${response.status}`);
//   }
//   return response.json();
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

// // Optional: Fetch profile to sync balance
// const fetchProfile = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   const response = await fetch(`${API_URL}/api/user/profile`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     throw new Error(errorData || `Profile fetch failed: ${response.status}`);
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
//   const handleAuthError = useCallback(
//     (message) => {
//       setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
//       localStorage.removeItem('token');
//       setTimeout(() => {
//         navigate('/login');
//       }, 3000);
//     },
//     [navigate]
//   );

//   // Optional: Fetch profile on mount to ensure latest balance
//   useQuery({
//     queryKey: ['profile'],
//     queryFn: fetchProfile,
//     onSuccess: (data) => {
//       if (typeof data.balance === 'number') {
//         setBalance(data.balance);
//       }
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
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//   });

//   const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
//     queryKey: ['bets'],
//     queryFn: fetchBets,
//     onSuccess: (data) => {
//       // Update balance for finalized bets
//       data.forEach((bet) => {
//         if (bet.status === 'finalized' && typeof bet.newBalance === 'number') {
//           setBalance(bet.newBalance);
//           if (bet.won && bet.payout > 0) {
//             setNotification({
//               type: 'success',
//               message: `You won $${bet.payout.toFixed(2)} for round ${bet.period}! Balance updated.`,
//             });
//           } else if (!bet.won) {
//             setNotification({
//               type: 'info',
//               message: `Bet lost for round ${bet.period}. No payout.`,
//             });
//           }
//         }
//       });
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
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//   });

//   const { data: pendingBetsData, isLoading: pendingBetsLoading } = useQuery({
//     queryKey: ['pendingBets'],
//     queryFn: fetchPendingBets,
//     refetchInterval: 2000, // Poll every 2 seconds
//     onSuccess: (data) => {
//       const activeBet = data.find(
//         (bet) => bet.status === 'pending' && bet.roundStatus === 'active'
//       );
//       if (activeBet && !pendingBet) {
//         setPendingBet(activeBet);
//         setNotification({
//           type: 'info',
//           message: `Restored pending bet for round ${activeBet.period}`,
//         });
//       }
//       // Check for expired or unresolvable bets
//       data.forEach((bet) => {
//         if (bet.status === 'pending' && bet.roundExpiresAt && new Date(bet.roundExpiresAt) < new Date()) {
//           fetchResult(bet.period);
//         } else if (bet.status === 'invalid' || bet.roundStatus === 'not_found') {
//           if (typeof bet.newBalance === 'number') {
//             setBalance(bet.newBalance);
//           }
//           setNotification({
//             type: 'warning',
//             message: `Bet for round ${bet.period} could not be settled: ${bet.error || 'Unknown error'}.`,
//           });
//           if (bet === pendingBet) {
//             setPendingBet(null);
//           }
//         } else if (bet.status === 'pending' && bet.createdAt && new Date(bet.createdAt) < new Date(Date.now() - 5 * 60 * 1000)) {
//           setNotification({
//             type: 'warning',
//             message: `Bet for round ${bet.period} is still pending. Please refresh or contact support.`,
//           });
//         } else if (bet.status === 'finalized' && typeof bet.newBalance === 'number') {
//           setBalance(bet.newBalance);
//           if (bet.won && bet.payout > 0) {
//             setNotification({
//               type: 'success',
//               message: `You won $${bet.payout.toFixed(2)} for round ${bet.period}! Balance updated.`,
//             });
//           } else if (!bet.won) {
//             setNotification({
//               type: 'info',
//               message: `Bet lost for round ${bet.period}. No payout.`,
//             });
//           }
//         }
//       });
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

//   // Clear notification after 5 seconds
//   useEffect(() => {
//     if (notification) {
//       const timeout = setTimeout(() => setNotification(null), 5000);
//       return () => clearTimeout(timeout);
//     }
//   }, [notification]);

//   // Fetch bet result with retry logic
//   const fetchResult = useCallback(
//     async (period, retryCount = 15) => {
//       if (!period) {
//         console.warn('No period provided for fetchResult');
//         setError('No valid bet period available');
//         setPendingBet(null);
//         return;
//       }
//       if (!/^round-\d+$/.test(period)) {
//         console.warn(`Invalid period format: ${period}`);
//         setError('Invalid bet period format');
//         setPendingBet(null);
//         return;
//       }
//       try {
//         console.log(`Attempting to fetch result for period: ${period}`);
//         const data = await fetchBetResult(period);
//         if (data.bet.status === 'pending') {
//           console.warn(`Result not ready, retries left: ${retryCount}`);
//           if (retryCount > 0) {
//             setTimeout(() => fetchResult(period, retryCount - 1), 2000);
//             return;
//           }
//           setError('Result not available yet. Please refresh.');
//           return;
//         }
//         setLastResult({ ...data.bet, payout: data.bet.payout });
//         if (typeof data.balance === 'number') {
//           setBalance(data.balance);
//           if (data.bet.won && data.bet.payout > 0) {
//             setNotification({
//               type: 'success',
//               message: `You won $${data.bet.payout.toFixed(2)}! Balance updated.`,
//             });
//           } else if (!data.bet.won) {
//             setNotification({
//               type: 'info',
//               message: `Bet lost. No payout.`,
//             });
//           }
//         } else {
//           console.warn('Balance not returned in fetchResult response:', data);
//           setNotification({
//             type: 'warning',
//             message: 'Balance update failed. Please refresh.',
//           });
//         }
//         queryClient.invalidateQueries(['bets']);
//         queryClient.invalidateQueries(['stats']);
//         setPendingBet(null);
//       } catch (err) {
//         const errorMessage = err.message.includes('Authentication required')
//           ? 'Session expired. Please log in again.'
//           : err.message.includes('Round data missing')
//           ? 'Bet could not be settled, amount refunded'
//           : err.message.includes('Bet not found')
//           ? 'No bet found for this round'
//           : 'Error fetching bet result';
//         console.error(`Fetch result error: ${err.message}`);
//         setError(errorMessage);
//         setTimeout(() => setError(''), 5000);
//         if (err.message.includes('Authentication required')) {
//           handleAuthError(errorMessage);
//         } else {
//           queryClient.invalidateQueries(['bets']);
//           queryClient.invalidateQueries(['pendingBets']);
//         }
//       }
//     },
//     [pendingBet, queryClient, setBalance, handleAuthError]
//   );

//   // Trigger fetchResult at 20 seconds for 2-minute rounds
//   useEffect(() => {
//     if (timeLeft <= 20 && pendingBet && !lastResult) {
//       const timer = setTimeout(() => {
//         fetchResult(pendingBet.period);
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
//       setNotification({ type: 'success', message: 'Bet placed successfully!' });
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
//   if (balanceLoading || betsLoading || roundLoading || roundsLoading || pendingBetsLoading) {
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
//               View History
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
//               {lastResult.type === 'color' ? `Color: ${lastResult.result || 'N/A'}` : `Number: ${lastResult.result || 'N/A'}`}
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
//           <div className="no-result" role="alert" aria-live="polite">
//             <p>Bet placed on {pendingBet.period}.</p>
//             <p>Waiting for results... ⌛</p>
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
  return bets.filter((bet) => bet && bet.status !== 'invalid');
};

const fetchPendingBets = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(errorData || `Pending bets fetch failed: ${response.status}`);
  }
  return response.json();
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

const fetchAllRounds = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/rounds/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(errorData || `Rounds fetch failed: ${response.status}`);
  }
  return response.json();
};

// Optional: Fetch profile to sync balance
const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    throw new Error(errorData || `Profile fetch failed: ${response.status}`);
  }
  return response.json();
};

// Helper function to process rounds data
const processRoundsData = (rounds, currentPeriod) => {
  if (!rounds || !Array.isArray(rounds)) return [];

  // Extract current round's timestamp for comparison
  const currentTimestamp = currentPeriod ? parseInt(currentPeriod.split('-')[1] || 0) : 0;

  const playedRounds = rounds
    .filter((round) => {
      // Ensure round has a valid result and is not in the future
      const roundTimestamp = parseInt(round.period.split('-')[1] || 0);
      return (
        round.result &&
        (round.result.color || round.result.number) &&
        roundTimestamp <= currentTimestamp
      );
    })
    .sort((a, b) => {
      const periodA = parseInt(a.period.split('-')[1] || 0);
      const periodB = parseInt(b.period.split('-')[1] || 0);
      return periodB - periodA; // Descending order
    });
  return playedRounds.slice(0, 10);
};

function Game() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { balance, setBalance, isLoading: balanceLoading, error: balanceError } = useBalance();
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pendingBet, setPendingBet] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Handle authentication errors
  const handleAuthError = useCallback(
    (message) => {
      setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
      localStorage.removeItem('token');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    },
    [navigate]
  );

  // Optional: Fetch profile on mount to ensure latest balance
  useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    onSuccess: (data) => {
      if (typeof data.balance === 'number') {
        setBalance(data.balance);
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

  const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
    queryKey: ['bets'],
    queryFn: fetchBets,
    onSuccess: (data) => {
      // Update balance for finalized bets
      data.forEach((bet) => {
        if (bet.status === 'finalized' && typeof bet.newBalance === 'number') {
          setBalance(bet.newBalance);
          if (bet.won && bet.payout > 0) {
            setNotification({
              type: 'success',
              message: `You won $${bet.payout.toFixed(2)} for round ${bet.period}! Balance updated.`,
            });
          } else if (!bet.won) {
            setNotification({
              type: 'info',
              message: `Bet lost for round ${bet.period}. No payout.`,
            });
          }
        }
      });
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

  const { data: pendingBetsData, isLoading: pendingBetsLoading } = useQuery({
    queryKey: ['pendingBets'],
    queryFn: fetchPendingBets,
    refetchInterval: 2000, // Poll every 2 seconds
    onSuccess: (data) => {
      const activeBet = data.find(
        (bet) => bet.status === 'pending' && bet.roundStatus === 'active'
      );
      if (activeBet && !pendingBet) {
        setPendingBet(activeBet);
        setNotification({
          type: 'info',
          message: `Restored pending bet for round ${activeBet.period}`,
        });
      }
      // Check for expired or unresolvable bets
      data.forEach((bet) => {
        if (bet.status === 'pending' && bet.roundExpiresAt && new Date(bet.roundExpiresAt) < new Date()) {
          fetchResult(bet.period);
        } else if (bet.status === 'invalid' || bet.roundStatus === 'not_found') {
          if (typeof bet.newBalance === 'number') {
            setBalance(bet.newBalance);
          }
          setNotification({
            type: 'warning',
            message: `Bet for round ${bet.period} could not be settled: ${bet.error || 'Unknown error'}.`,
          });
          if (bet === pendingBet) {
            setPendingBet(null);
          }
        } else if (bet.status === 'pending' && bet.createdAt && new Date(bet.createdAt) < new Date(Date.now() - 5 * 60 * 1000)) {
          setNotification({
            type: 'warning',
            message: `Bet for round ${bet.period} is still pending. Please refresh or contact support.`,
          });
        } else if (bet.status === 'finalized' && typeof bet.newBalance === 'number') {
          setBalance(bet.newBalance);
          if (bet.won && bet.payout > 0) {
            setNotification({
              type: 'success',
              message: `You won $${bet.payout.toFixed(2)} for round ${bet.period}! Balance updated.`,
            });
          } else if (!bet.won) {
            setNotification({
              type: 'info',
              message: `Bet lost for round ${bet.period}. No payout.`,
            });
          }
        }
      });
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

  const { data: roundData, isLoading: roundLoading } = useQuery({
    queryKey: ['currentRound'],
    queryFn: fetchCurrentRound,
    refetchInterval: 6000,
    staleTime: 6000,
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

  const { data: allRoundsData, isLoading: roundsLoading } = useQuery({
    queryKey: ['allRounds'],
    queryFn: fetchAllRounds,
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
        const timeRemaining = Math.max(0, (new Date(roundData.expiresAt) - Date.now()) / 1000);
        setTimeLeft(Math.floor(timeRemaining));
      };
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [roundData]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  // Fetch bet result with retry logic
  const fetchResult = useCallback(
    async (period, retryCount = 15) => {
      if (!period) {
        console.warn('No period provided for fetchResult');
        setError('No valid bet period available');
        setPendingBet(null);
        return;
      }
      if (!/^round-\d+$/.test(period)) {
        console.warn(`Invalid period format: ${period}`);
        setError('Invalid bet period format');
        setPendingBet(null);
        return;
      }
      try {
        console.log(`Attempting to fetch result for period: ${period}`);
        const data = await fetchBetResult(period);
        if (data.bet.status === 'pending') {
          console.warn(`Result not ready, retries left: ${retryCount}`);
          if (retryCount > 0) {
            setTimeout(() => fetchResult(period, retryCount - 1), 2000);
            return;
          }
          setError('Result not available yet. Please refresh.');
          return;
        }
        setLastResult({ ...data.bet, payout: data.bet.payout });
        if (typeof data.balance === 'number') {
          setBalance(data.balance);
          if (data.bet.won && data.bet.payout > 0) {
            setNotification({
              type: 'success',
              message: `You won $${data.bet.payout.toFixed(2)}! Balance updated.`,
            });
          } else if (!data.bet.won) {
            setNotification({
              type: 'info',
              message: `Bet lost. No payout.`,
            });
          }
        } else {
          console.warn('Balance not returned in fetchResult response:', data);
          setNotification({
            type: 'warning',
            message: 'Balance update failed. Please refresh.',
          });
        }
        queryClient.invalidateQueries(['bets']);
        queryClient.invalidateQueries(['stats']);
        setPendingBet(null);
      } catch (err) {
        const errorMessage = err.message.includes('Authentication required')
          ? 'Session expired. Please log in again.'
          : err.message.includes('Round data missing')
          ? 'Bet could not be settled, amount refunded'
          : err.message.includes('Bet not found')
          ? 'No bet found for this round'
          : 'Error fetching bet result';
        console.error(`Fetch result error: ${err.message}`);
        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
        if (err.message.includes('Authentication required')) {
          handleAuthError(errorMessage);
        } else {
          queryClient.invalidateQueries(['bets']);
          queryClient.invalidateQueries(['pendingBets']);
        }
      }
    },
    [queryClient, setBalance, handleAuthError]
  );

  // Trigger fetchResult at 20 seconds for 2-minute rounds
  useEffect(() => {
    if (timeLeft <= 20 && pendingBet && !lastResult) {
      const timer = setTimeout(() => {
        fetchResult(pendingBet.period);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, pendingBet, fetchResult, lastResult]);

  const mutation = useMutation({
    mutationFn: placeBet,
    onSuccess: (data) => {
      console.log('Place bet response:', data);
      if (typeof data.balance === 'number') {
        setBalance(data.balance);
      }
      setPendingBet(data.bet);
      setError('');
      setNotification({ type: 'success', message: 'Bet placed successfully!' });
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
  if (balanceLoading || betsLoading || roundLoading || roundsLoading || pendingBetsLoading) {
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
            <button
              className="history-button"
              onClick={() => setIsHistoryModalOpen(true)}
              aria-label="View past 10 rounds history"
            >
              View History
            </button>
          </div>
        </div>
        {mutation.isLoading && (
          <div className="loading-spinner" aria-live="polite">Processing Bet...</div>
        )}
        {lastResult && (
          <div
            key={lastResult.period}
            className={`result ${getResultColorClass(lastResult.result, lastResult.type)} ${lastResult.won ? 'won' : 'lost'}`}
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
              {lastResult.type === 'color' ? `Color: ${lastResult.result || 'N/A'}` : `Number: ${lastResult.result || 'N/A'}`}
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
          <div className="no-result" role="alert" aria-live="polite">
            <p>Bet placed on {pendingBet.period}.</p>
            <p>Waiting for results... ⌛</p>
          </div>
        )}
        {!pendingBet && !lastResult && !mutation.isLoading && (
          <p className="no-result">Place a bet to see the result.</p>
        )}
        {isHistoryModalOpen && (
          <div className="modal-overlay" role="dialog" aria-labelledby="history-modal-title">
            <div className="modal-content">
              <div className="modal-header">
                <h2 id="history-modal-title">Past 10 Rounds History</h2>
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
                    {processRoundsData(allRoundsData, roundData?.period).length > 0 ? (
                      processRoundsData(allRoundsData, roundData?.period).map((round) => (
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
                        <td colSpan="3">No completed rounds available</td>
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
          balance={balance ?? 0}
          isDisabled={(balance ?? 0) === 0 || mutation.isLoading || timeLeft < 10}
          roundData={roundData}
          timeLeft={timeLeft}
        />
        <HistoryTable bets={betsData || []} />
      </div>
    </ErrorBoundary>
  );
}

export default memo(Game);
