// import { useState, useEffect, useCallback } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { useBalance } from '../context/BalanceContext';
// import BetForm from '../components/BetForm';
// import HistoryTable from '../components/HistoryTable';
// import Header from '../components/header';
// import '../styles/game.css';

// const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// const fetchUserProfile = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   const response = await fetch(`${API_URL}/api/user/profile`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     if (response.status === 401) throw new Error('Authentication required');
//     throw new Error(`Profile fetch failed: ${response.status}`);
//   }
//   return response.json();
// };

// const fetchBets = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   const response = await fetch(`${API_URL}/api/bets/history`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     if (response.status === 401) throw new Error('Authentication required');
//     throw new Error(`Bets fetch failed: ${response.status}`);
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
//     if (response.status === 401) throw new Error('Authentication required');
//     throw new Error(`Round fetch failed: ${response.status}`);
//   }
//   return response.json();
// };

// const placeBet = async (betData) => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   console.log('Sending bet to server:', betData);
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
//     console.error('Bet response error:', errorData);
//     throw new Error(errorData.error || `Bet placement failed: ${response.status}`);
//   }
//   const data = await response.json();
//   console.log('Bet response success:', data);
//   return data;
// };

// const fetchBetResult = async (period) => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required');
//   console.log('Fetching bet result for period:', period);
//   const response = await fetch(`${API_URL}/api/bets/result/${period}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     console.error('Bet result fetch error:', errorData);
//     throw new Error(errorData.error || `Bet result fetch failed: ${response.status}`);
//   }
//   const data = await response.json();
//   console.log('Bet result fetched:', data);
//   return data;
// };

// function Game() {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { setBalance } = useBalance();
//   const [error, setError] = useState('');
//   const [lastResult, setLastResult] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [pendingBet, setPendingBet] = useState(null);

//   const { data: userData, isLoading: userLoading, error: userError } = useQuery({
//     queryKey: ['userProfile'],
//     queryFn: fetchUserProfile,
//     onSuccess: (data) => setBalance(data.balance),
//     onError: (err) => {
//       setError(err.message);
//       setTimeout(() => setError(''), 5000);
//       if (err.message === 'Authentication required') {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     },
//     retry: 0,
//   });

//   const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
//     queryKey: ['bets'],
//     queryFn: fetchBets,
//     onError: (err) => {
//       setError(err.message);
//       setTimeout(() => setError(''), 5000);
//       if (err.message === 'Authentication required') {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     },
//     retry: 0,
//   });

//   const { data: roundData, isLoading: roundLoading } = useQuery({
//     queryKey: ['currentRound'],
//     queryFn: fetchCurrentRound,
//     refetchInterval: 1000,
//     onSuccess: (data) => {
//       console.log('Fetched roundData:', data);
//     },
//     onError: (err) => {
//       setError(err.message);
//       setTimeout(() => setError(''), 5000);
//       if (err.message === 'Authentication required') {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     },
//     retry: 0,
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

//   // Fetch bet result when round ends
//   useEffect(() => {
//     if (timeLeft === 0 && pendingBet) {
//       const fetchResult = async () => {
//         try {
//           const data = await fetchBetResult(pendingBet.period);
//           setLastResult({ ...data.bet, payout: data.bet.payout });
//           setBalance(data.balance);
//           queryClient.invalidateQueries(['bets']);
//           queryClient.invalidateQueries(['userProfile']);
//           setPendingBet(null);
//         } catch (err) {
//           setError(err.message);
//           setTimeout(() => setError(''), 5000);
//         }
//       };
//       fetchResult();
//     }
//   }, [timeLeft, pendingBet, queryClient, setBalance]);

//   const mutation = useMutation({
//     mutationFn: placeBet,
//     onSuccess: (data) => {
//       console.log('Mutation success:', data);
//       setBalance(data.balance);
//       setPendingBet(data.bet); // Store bet until round ends
//       setError('');
//     },
//     onError: (err) => {
//       console.error('Mutation error:', err.message);
//       setError(err.message);
//       setTimeout(() => setError(''), 5000);
//     },
//     onSettled: () => console.log('Mutation settled'),
//   });

//   const getResultColorClass = useCallback((result, type) => {
//     if (type === 'color') {
//       return result?.toLowerCase() || '';
//     }
//     return parseInt(result) % 2 === 0 ? 'green' : 'red';
//   }, []);

//   const handleBet = async (betData) => {
//     console.log('Handling bet:', betData);
//     if (betData.error) {
//       setError(betData.error);
//       setTimeout(() => setError(''), 5000);
//       return;
//     }
//     try {
//       await mutation.mutateAsync(betData);
//     } catch (err) {
//       console.error('Handle bet error:', err.message);
//       setError(err.message);
//       setTimeout(() => setError(''), 5000);
//     }
//   };

//   if (userLoading || betsLoading || roundLoading) {
//     return (
//       <div className="game-page container">
//         <Header />
//         <div className="loading-spinner" aria-live="polite">Loading...</div>
//       </div>
//     );
//   }

//   if (userError || betsError) {
//     return (
//       <div className="game-page container">
//         <Header />
//         <p className="game-error" role="alert">{error}</p>
//         {error === 'Authentication required' && (
//           <button onClick={() => navigate('/login')} className="login-button">
//             Log In
//           </button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="game-page container">
//       <Header />
//       <div className="game958">
//         {error && (
//           <p className="game-error" role="alert">
//             {error}
//           </p>
//         )}
//         <div className="round-info">
//           <p>Current Round: {roundData?.period || 'Loading...'}</p>
//           <p>Time Left: {timeLeft} seconds</p>
//         </div>
//       </div>
//       {mutation.isLoading && (
//         <div className="loading-spinner" aria-live="polite">Processing Bet...</div>
//       )}
//       {lastResult && (
//         <div
//           key={lastResult.period}
//           className={`result ${getResultColorClass(lastResult.result, lastResult.type)} ${lastResult.won ? 'won' : 'lost'}`}
//           role="alert"
//         >
//           <button
//             className="result-close"
//             onClick={() => setLastResult(null)}
//             aria-label="Close bet result notification"
//           >
//             ×
//           </button>
//           <div className="result-header">
//             {lastResult.won ? (
//               <span className="result-icon">🎉 You Won!</span>
//             ) : (
//               <span className="result-icon">😔 You Lost</span>
//             )}
//           </div>
//           <div className="result-detail">
//             {lastResult.type === 'color' ? `Color: ${lastResult.result}` : `Number: ${lastResult.result}`}
//           </div>
//           <div className="result-payout">
//             {lastResult.payout === 0
//               ? 'No Payout'
//               : lastResult.won
//               ? `+$${Math.abs(lastResult.payout).toFixed(2)}`
//               : `-$${Math.abs(lastResult.payout).toFixed(2)}`}
//           </div>
//         </div>
//       )}
//       {pendingBet && !lastResult && !mutation.isLoading && (
//         <p className="no-result">Bet placed, waiting for round to end...</p>
//       )}
//       {!pendingBet && !lastResult && !mutation.isLoading && (
//         <p className="no-result">Place a bet to see the result.</p>
//       )}
//       <BetForm
//         onSubmit={handleBet}
//         isLoading={mutation.isLoading}
//         balance={userData.balance}
//         isDisabled={userData.balance === 0 || mutation.isLoading || timeLeft < 5}
//         roundData={roundData}
//         timeLeft={timeLeft}
//       />
//       <HistoryTable bets={betsData || []} />
//     </div>
//   );
// }

// export default Game;


import { useState, useEffect, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext';
import BetForm from '../components/BetForm';
import HistoryTable from '../components/HistoryTable';
import Header from '../components/Header';
import '../styles/game.css';

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
    throw new Error(errorData || `Round fetch failed: ${response.status}`);
  }
  return response.json();
};

const placeBet = async (betData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  console.log('Sending bet to server:', betData);
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
    console.error('Bet response error:', errorData);
    throw new Error(errorData.error || `Bet placement failed: ${response.status}`);
  }
  const data = await response.json();
  console.log('Bet response success:', data);
  return data;
};

const fetchBetResult = async (period) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  console.log('Fetching bet result for period:', period);
  const response = await fetch(`${API_URL}/api/bets/result/${period}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Bet result fetch error:', errorData);
    throw new Error(errorData.error || `Bet result fetch failed: ${response.status}`);
  }
  const data = await response.json();
  console.log('Bet result fetched:', data);
  return data;
};

function Game() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { balance, setBalance, isLoading: balanceLoading, error: balanceError } = useBalance();
  const [error, setError] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pendingBet, setPendingBet] = useState(null);

  const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
    queryKey: ['bets'],
    queryFn: fetchBets,
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication required')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  const { data: roundData, isLoading: roundLoading } = useQuery({
    queryKey: ['currentRound'],
    queryFn: fetchCurrentRound,
    refetchInterval: 1000,
    onSuccess: (data) => {
      console.log('Fetched roundData:', data);
    },
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication required')) {
        localStorage.removeItem('token');
        navigate('/login');
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

  // Fetch bet result when round ends
  const fetchResult = useCallback(async () => {
    try {
      const data = await fetchBetResult(pendingBet.period);
      setLastResult({ ...data.bet, payout: data.bet.payout });
      if (typeof data.balance === 'number') {
        setBalance(data.balance);
      }
      queryClient.invalidateQueries(['bets']);
      setPendingBet(null);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  }, [pendingBet, queryClient, setBalance]);

  useEffect(() => {
    if (timeLeft === 0 && pendingBet) {
      fetchResult();
    }
  }, [timeLeft, pendingBet, fetchResult]);

  const mutation = useMutation({
    mutationFn: placeBet,
    onSuccess: (data) => {
      console.log('Bet API response:', data);
      if (typeof data.balance === 'number') {
        // Warn if API balance differs significantly from context balance
        if (Math.abs(data.balance - (balance ?? 0)) > 0.01) {
          console.warn('Balance mismatch:', { api: data.balance, context: balance });
        }
        setBalance(data.balance);
      }
      setPendingBet(data.bet);
      setError('');
    },
    onError: (err) => {
      console.error('Mutation error:', err.message);
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    },
  });

  const getResultColorClass = useCallback((result, type) => {
    if (type === 'color') {
      return result?.toLowerCase() || '';
    }
    return parseInt(result) % 2 === 0 ? 'green' : 'red';
  }, []);

  const handleBet = async (betData) => {
    console.log('Handling bet:', betData);
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
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  if (balanceLoading || betsLoading || roundLoading) {
    return (
      <div className="game-page container">
        <Header />
        <div className="loading-spinner" aria-live="polite">Loading...</div>
      </div>
    );
  }

  if (balanceError || betsError) {
    return (
      <div className="game-page container">
        <Header />
        <p className="game-error" role="alert" aria-live="polite">
          {balanceError?.message || betsError?.message}
        </p>
        {(balanceError?.message.includes('Authentication required') ||
          betsError?.message.includes('Authentication required')) && (
          <button onClick={() => navigate('/login')} className="login-button">
            Log In
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="game-page container">
      <Header />
      <div className="game958">
        {error && (
          <p className="game-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        <div className="round-info">
          <p>Current Round: {roundData?.period || 'Loading...'}</p>
          <p>Time Left: {timeLeft} seconds</p>
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
            {lastResult.type === 'color' ? `Color: ${lastResult.result}` : `Number: ${lastResult.result}`}
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
        <p className="no-result">Bet placed, waiting for round to end...</p>
      )}
      {!pendingBet && !lastResult && !mutation.isLoading && (
        <p className="no-result">Place a bet to see the result.</p>
      )}
      <BetForm
        onSubmit={handleBet}
        isLoading={mutation.isLoading}
        balance={balance ?? 0}
        isDisabled={(balance ?? 0) === 0 || mutation.isLoading || timeLeft < 5}
        roundData={roundData}
        timeLeft={timeLeft}
      />
      <HistoryTable bets={betsData || []} />
    </div>
  );
}

export default memo(Game);
