// import React, { useState, useEffect, useCallback, memo } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { useBalance } from '../context/BalanceContext';
// import BetForm from '../components/EvenOddBetForm';
// import { jwtDecode } from 'jwt-decode';
// import '../styles/game.css';

// // ErrorBoundary
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

// // API URL
// const API_URL = process.env.REACT_APP_API_URL || 'https://evenodd-backend.vercel.app';

// // Token expiration check
// const isTokenExpired = (token) => {
//   if (!token) return true;
//   try {
//     const decoded = jwtDecode(token);
//     const currentTime = Math.floor(Date.now() / 1000);
//     return decoded.exp < currentTime;
//   } catch (err) {
//     console.error('Error decoding token:', err);
//     return true;
//   }
// };

// // API functions
// const fetchBets = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   const response = await fetch(`${API_URL}/api/bets/history`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     throw new Error(
//       response.status === 401 ? 'Authentication required' : errorData || `Bets fetch failed: ${response.status}`
//     );
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
//     throw new Error(
//       response.status === 401 ? 'Authentication required' : errorData || `Pending bets fetch failed: ${response.status}`
//     );
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
//     throw new Error(
//       response.status === 401
//         ? 'Authentication required'
//         : response.status === 429
//         ? 'Too many requests, please try again later'
//         : errorData || `Round fetch failed: ${response.status}`
//     );
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
//     throw new Error(errorData.error || `Bet result fetch failed: ${response.status}`);
//   }
//   return response.json();
// };

// const fetchRecentRounds = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   const response = await fetch(`${API_URL}/api/bets/rounds/recent`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     throw new Error(
//       response.status === 401 ? 'Authentication required' : errorData || `Recent rounds fetch failed: ${response.status}`
//     );
//   }
//   return response.json();
// };

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

// function EvenOddGame() {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { balance, setBalance, isLoading: balanceLoading, error: balanceError } = useBalance();
//   const [error, setError] = useState('');
//   const [notification, setNotification] = useState(null);
//   const [lastResult, setLastResult] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [pendingBet, setPendingBet] = useState(null);
//   const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

//   const handleAuthError = useCallback(
//     (message) => {
//       setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
//       localStorage.removeItem('token');
//       queryClient.clear();
//       setBalance(0);
//       setPendingBet(null);
//       setLastResult(null);
//       setTimeout(() => navigate('/login'), 3000);
//     },
//     [navigate, queryClient, setBalance]
//   );

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token && isTokenExpired(token)) {
//       handleAuthError('Token expired');
//     }

//     const interval = setInterval(() => {
//       const currentToken = localStorage.getItem('token');
//       if (currentToken && isTokenExpired(currentToken)) {
//         handleAuthError('Token expired');
//       }
//     }, 60000);

//     return () => clearInterval(interval);
//   }, [handleAuthError]);

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
//       if (err.message.includes('Authentication')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//     staleTime: 1000,
//   });

//   const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
//     queryKey: ['bets'],
//     queryFn: fetchBets,
//     onSuccess: (data) => {
//       data.forEach((bet) => {
//         if (bet.status === 'finalized' && typeof bet.newBalance === 'number') {
//           setBalance(bet.newBalance);
//           if (bet.won && bet.payout > 0) {
//             setNotification({
//               type: 'success',
//               message: `You won ₦${bet.payout.toFixed(2)} for round ${bet.period}! Balance updated.`,
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
//       if (err.message.includes('Authentication')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//     staleTime: 1000,
//   });

//   const { data: pendingBetsData, isLoading: pendingBetsLoading } = useQuery({
//     queryKey: ['pendingBets'],
//     queryFn: fetchPendingBets,
//     refetchInterval: 5000,
//     onSuccess: (data) => {
//       const activeBet = data.find((bet) => bet.status === 'pending' && bet.roundStatus === 'active');
//       if (activeBet && !pendingBet) {
//         setPendingBet(activeBet);
//         setNotification({
//           type: 'info',
//           message: `Restored pending bet for round ${activeBet.period}`,
//         });
//       }
//       data.forEach((bet) => {
//         if (bet.status === 'pending' && bet.roundExpiresAt && new Date(bet.roundExpiresAt) < new Date()) {
//           debouncedFetchResult(bet.period);
//         }
//       });
//     },
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setError(errorMessage);
//       setTimeout(() => setError(''), 5000);
//       if (err.message.includes('Authentication')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//     staleTime: 1000,
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
//       if (err.message.includes('Authentication')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//   });

//   const { data: recentRoundsData, isLoading: roundsLoading } = useQuery({
//     queryKey: ['recentRounds'],
//     queryFn: fetchRecentRounds,
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setError(errorMessage);
//       setTimeout(() => setError(''), 5000);
//       if (err.message.includes('Authentication')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//     staleTime: 1000,
//   });

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

//   useEffect(() => {
//     if (notification) {
//       const timeout = setTimeout(() => setNotification(null), 5000);
//       return () => clearTimeout(timeout);
//     }
//   }, [notification]);

//   const debounce = (func, wait) => {
//     let timeout;
//     return (...args) => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => func(...args), wait);
//     };
//   };

//   const fetchResult = useCallback(
//     async (period, retryCount = 40) => {
//       if (!period) {
//         setError('No valid bet period available');
//         setPendingBet(null);
//         return;
//       }
//       try {
//         const data = await fetchBetResult(period);
//         if (data.bet.status === 'pending') {
//           if (retryCount > 0) {
//             setTimeout(() => debouncedFetchResult(period, retryCount - 1), 2000);
//             return;
//           }
//           setError('Result not available yet. Please refresh.');
//           return;
//         }
//         setLastResult(data.bet);
//         if (typeof data.balance === 'number') {
//           setBalance(data.balance);
//           setNotification({
//             type: data.bet.won ? 'success' : 'info',
//             message: data.bet.won
//               ? `You won ₦${data.bet.payout.toFixed(2)}! Balance updated.`
//               : `Bet lost for round ${data.bet.period}. No payout.`,
//           });
//         }
//         queryClient.invalidateQueries(['bets']);
//         queryClient.invalidateQueries(['pendingBets']);
//         queryClient.invalidateQueries(['profile']);
//         setPendingBet(null);
//       } catch (err) {
//         const errorMessage = err.message.includes('Authentication required')
//           ? 'Session expired. Please log in again.'
//           : err.message;
//         setError(errorMessage);
//         setTimeout(() => setError(''), 5000);
//         if (err.message.includes('Authentication')) {
//           handleAuthError(errorMessage);
//         }
//       }
//     },
//     [queryClient, setBalance, handleAuthError]
//   );

//   const debouncedFetchResult = useCallback(debounce(fetchResult, 1000), [fetchResult]);

//   useEffect(() => {
//     if (timeLeft <= 20 && pendingBet && !lastResult) {
//       const timer = setTimeout(() => {
//         debouncedFetchResult(pendingBet.period);
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [timeLeft, pendingBet, debouncedFetchResult, lastResult]);

//   const mutation = useMutation({
//     mutationFn: placeBet,
//     onSuccess: (data) => {
//       if (typeof data.balance === 'number') {
//         setBalance(data.balance);
//       }
//       setPendingBet(data.bet);
//       setError('');
//       setNotification({ type: 'success', message: 'Bet placed successfully!' });
//       queryClient.invalidateQueries(['profile']);
//       queryClient.invalidateQueries(['bets']);
//       queryClient.invalidateQueries(['pendingBets']);
//     },
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setError(errorMessage);
//       setTimeout(() => setError(''), 5000);
//       if (err.message.includes('Authentication')) {
//         handleAuthError(errorMessage);
//       }
//     },
//   });

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
//       if (err.message.includes('Authentication')) {
//         handleAuthError(errorMessage);
//       }
//     }
//   };

//   if (balanceLoading || betsLoading || roundLoading || roundsLoading || pendingBetsLoading) {
//     return (
//       <ErrorBoundary>
//         <div className="game-page container">
//           <div className="loading-spinner" aria-live="polite">Loading...</div>
//         </div>
//       </ErrorBoundary>
//     );
//   }

//   return (
//     <ErrorBoundary>
//       <div className="game-page">
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
//         <div className="round-info">
//           <p>Current Round: {roundData?.period || 'Loading...'}</p>
//           <p>Time Left: {timeLeft} seconds</p>
//           <p>Expires At: {roundData?.expiresAt || 'N/A'}</p>
//           <button
//             className="history-button"
//             onClick={() => setIsHistoryModalOpen(true)}
//             aria-label="View recent rounds history"
//           >
//             View History
//           </button>
//         </div>
//         {mutation.isLoading && (
//           <div className="loading-spinner" aria-live="polite">Processing Bet...</div>
//         )}
//         {lastResult && (
//           <div
//             key={lastResult.period}
//             className={`result ${lastResult.won ? 'won' : 'lost'}`}
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
//               Result: {lastResult.result || 'N/A'}
//             </div>
//             <div className="result-payout">
//               {lastResult.payout === 0
//                 ? 'No Payout'
//                 : lastResult.won
//                 ? `+₦${Math.abs(lastResult.payout).toFixed(2)}`
//                 : `-₦${Math.abs(lastResult.payout).toFixed(2)}`}
//             </div>
//           </div>
//         )}
//         {pendingBet && !lastResult && !mutation.isLoading && (
//           <div className="no-result" role="alert" aria-live="polite">
//             <p>Bet placed on {pendingBet.period}.</p>
//             <p>Waiting for results... ⏳</p>
//           </div>
//         )}
//         {!pendingBet && !lastResult && !mutation.isLoading && (
//           <p className="no-result">Place a bet to see the result.</p>
//         )}
//         {isHistoryModalOpen && (
//           <div className="modal-overlay" role="dialog" aria-labelledby="history-modal-title">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h2 id="history-modal-title">Recent Rounds History</h2>
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
//                       <th>Result</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {recentRoundsData?.length > 0 ? (
//                       recentRoundsData.map((round) => (
//                         <tr key={round.period}>
//                           <td>{round.period}</td>
//                           <td>{round.result || 'N/A'}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="2">No rounds available</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// }

// export default memo(EvenOddGame);


import React, { useState, useEffect, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext';
import { jwtDecode } from 'jwt-decode';
import '../styles/game.css';
import BetForm from './EvenOddBetForm'; // Import the new BetForm component
import HistoryTable from './HistoryTable'; // Assuming HistoryTable is a separate component

// ErrorBoundary
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

// API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://evenodd-backend.vercel.app';

// Token expiration check
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (err) {
    console.error('Error decoding token:', err);
    return true;
  }
};

// API functions
const fetchBets = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    throw new Error(
      response.status === 401 ? 'Authentication required' : errorData || `Bets fetch failed: ${response.status}`
    );
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
    throw new Error(
      response.status === 401 ? 'Authentication required' : errorData || `Pending bets fetch failed: ${response.status}`
    );
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
    throw new Error(
      response.status === 401
        ? 'Authentication required'
        : response.status === 429
        ? 'Too many requests, please try again later'
        : errorData || `Round fetch failed: ${response.status}`
    );
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
    throw new Error(errorData.error || `Bet result fetch failed: ${response.status}`);
  }
  return response.json();
};

const fetchRecentRounds = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/rounds/recent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    throw new Error(
      response.status === 401 ? 'Authentication required' : errorData || `Recent rounds fetch failed: ${response.status}`
    );
  }
  return response.json();
};

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

// HistoryTable component
const HistoryTable = ({ bets }) => (
  <div className="history-table-container">
    <table className="history-table">
      <thead>
        <tr>
          <th>Period</th>
          <th>Choice</th>
          <th>Amount</th>
          <th>Result</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bets.length > 0 ? (
          bets.map((bet) => (
            <tr key={bet._id}>
              <td data-label="Period">{bet.period}</td>
              <td data-label="Choice">{bet.choice}</td>
              <td data-label="Amount">₦{bet.amount.toFixed(2)}</td>
              <td data-label="Result">{bet.result || 'N/A'}</td>
              <td data-label="Status" className={bet.status === 'won' ? 'won' : bet.status === 'lost' ? 'lost' : 'pending'}>
                {bet.status}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="no-history">No bets available</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

function EvenOddGame() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { balance, setBalance, isLoading: balanceLoading, error: balanceError } = useBalance();
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pendingBet, setPendingBet] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleAuthError = useCallback(
    (message) => {
      setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
      localStorage.removeItem('token');
      queryClient.clear();
      setBalance(0);
      setPendingBet(null);
      setLastResult(null);
      setTimeout(() => navigate('/login'), 3000);
    },
    [navigate, queryClient, setBalance]
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      handleAuthError('Token expired');
    }

    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken && isTokenExpired(currentToken)) {
        handleAuthError('Token expired');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [handleAuthError]);

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
      if (err.message.includes('Authentication')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
    staleTime: 1000,
  });

  const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
    queryKey: ['bets'],
    queryFn: fetchBets,
    onSuccess: (data) => {
      data.forEach((bet) => {
        if (bet.status === 'finalized' && typeof bet.newBalance === 'number') {
          setBalance(bet.newBalance);
          if (bet.won && bet.payout > 0) {
            setNotification({
              type: 'success',
              message: `You won ₦${bet.payout.toFixed(2)} for round ${bet.period}! Balance updated.`,
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
      if (err.message.includes('Authentication')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
    staleTime: 1000,
  });

  const { data: pendingBetsData, isLoading: pendingBetsLoading } = useQuery({
    queryKey: ['pendingBets'],
    queryFn: fetchPendingBets,
    refetchInterval: 5000,
    onSuccess: (data) => {
      const activeBet = data.find((bet) => bet.status === 'pending' && bet.roundStatus === 'active');
      if (activeBet && !pendingBet) {
        setPendingBet(activeBet);
        setNotification({
          type: 'info',
          message: `Restored pending bet for round ${activeBet.period}`,
        });
      }
      data.forEach((bet) => {
        if (bet.status === 'pending' && bet.roundExpiresAt && new Date(bet.roundExpiresAt) < new Date()) {
          debouncedFetchResult(bet.period);
        }
      });
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
    staleTime: 1000,
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
      if (err.message.includes('Authentication')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  const { data: recentRoundsData, isLoading: roundsLoading } = useQuery({
    queryKey: ['recentRounds'],
    queryFn: fetchRecentRounds,
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
    staleTime: 1000,
  });

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

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchResult = useCallback(
    async (period, retryCount = 40) => {
      if (!period) {
        setError('No valid bet period available');
        setPendingBet(null);
        return;
      }
      try {
        const data = await fetchBetResult(period);
        if (data.bet.status === 'pending') {
          if (retryCount > 0) {
            setTimeout(() => debouncedFetchResult(period, retryCount - 1), 2000);
            return;
          }
          setError('Result not available yet. Please refresh.');
          return;
        }
        setLastResult(data.bet);
        if (typeof data.balance === 'number') {
          setBalance(data.balance);
          setNotification({
            type: data.bet.won ? 'success' : 'info',
            message: data.bet.won
              ? `You won ₦${data.bet.payout.toFixed(2)}! Balance updated.`
              : `Bet lost for round ${data.bet.period}. No payout.`,
          });
        }
        queryClient.invalidateQueries(['bets']);
        queryClient.invalidateQueries(['pendingBets']);
        queryClient.invalidateQueries(['profile']);
        setPendingBet(null);
      } catch (err) {
        const errorMessage = err.message.includes('Authentication required')
          ? 'Session expired. Please log in again.'
          : err.message;
        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
        if (err.message.includes('Authentication')) {
          handleAuthError(errorMessage);
        }
      }
    },
    [queryClient, setBalance, handleAuthError]
  );

  const debouncedFetchResult = useCallback(debounce(fetchResult, 1000), [fetchResult]);

  useEffect(() => {
    if (timeLeft <= 20 && pendingBet && !lastResult) {
      const timer = setTimeout(() => {
        debouncedFetchResult(pendingBet.period);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, pendingBet, debouncedFetchResult, lastResult]);

  const mutation = useMutation({
    mutationFn: placeBet,
    onSuccess: (data) => {
      if (typeof data.balance === 'number') {
        setBalance(data.balance);
      }
      setPendingBet(data.bet);
      setError('');
      setNotification({ type: 'success', message: 'Bet placed successfully!' });
      queryClient.invalidateQueries(['profile']);
      queryClient.invalidateQueries(['bets']);
      queryClient.invalidateQueries(['pendingBets']);
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication')) {
        handleAuthError(errorMessage);
      }
    },
  });

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
      // Adjust betData to match backend expectations
      const adjustedBetData = {
        choice: betData.value.toLowerCase(), // Convert 'Even'/'Odd' to 'even'/'odd' to match backend
        amount: betData.amount,
        period: roundData?.period,
      };
      await mutation.mutateAsync(adjustedBetData);
    } catch (err) {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication')) {
        handleAuthError(errorMessage);
      }
    }
  };

  if (balanceLoading || betsLoading || roundLoading || roundsLoading || pendingBetsLoading) {
    return (
      <ErrorBoundary>
        <div className="game-page container">
          <div className="loading-spinner" aria-live="polite">Loading...</div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="game-page">
        {notification && (
          <div className={`result ${notification.type}`} role="alert" aria-live="polite">
            {notification.message}
          </div>
        )}
        {error && !notification && (
          <p className="game-error" role="alert" aria-live="polite">
            {error}
交代
        )}
        {(balanceError || betsError) && (
          <p className="game-error" role="alert" aria-live="polite">
            {balanceError?.message || betsError?.message}
          </p>
        )}
        <div className="round-info">
          <p>Current Round: {roundData?.period || 'Loading...'}</p>
          <p>Time Left: {timeLeft} seconds</p>
          <p>Expires At: {roundData?.expiresAt || 'N/A'}</p>
          <button
            className="history-button"
            onClick={() => setIsHistoryModalOpen(true)}
            aria-label="View recent rounds history"
          >
            View History
          </button>
        </div>
        {mutation.isLoading && (
          <div className="loading-spinner" aria-live="polite">Processing Bet...</div>
        )}
        {lastResult && (
          <div
            key={lastResult.period}
            className={`result ${lastResult.won ? 'won' : 'lost'}`}
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
              Result: {lastResult.result || 'N/A'}
            </div>
            <div className="result-payout">
              {lastResult.payout === 0
                ? 'No Payout'
                : lastResult.won
                ? `+₦${Math.abs(lastResult.payout).toFixed(2)}`
                : `-₦${Math.abs(lastResult.payout).toFixed(2)}`}
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
                <h2 id="history-modal-title">Recent Rounds History</h2>
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
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRoundsData?.length > 0 ? (
                      recentRoundsData.map((round) => (
                        <tr key={round.period}>
                          <td>{round.period}</td>
                          <td>{round.result || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No rounds available</td>
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
          isDisabled={(balance ?? 0) === 0 || mutation.isLoading || timeLeft < 15}
          roundData={roundData}
          timeLeft={timeLeft}
          lastResult={lastResult} // Pass lastResult to BetForm
        />
        <HistoryTable bets={betsData || []} />
      </div>
    </ErrorBoundary>
  );
}

export default memo(EvenOddGame);
