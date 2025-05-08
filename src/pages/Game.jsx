// import { useState, useCallback } from 'react';
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

// function Game() {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { setBalance } = useBalance();
//   const [error, setError] = useState('');
//   const [lastResult, setLastResult] = useState(null);

//   const { data: userData, isLoading: userLoading, error: userError } = useQuery({
//     queryKey: ['userProfile'],
//     queryFn: fetchUserProfile,
//     onSuccess: (data) => setBalance(data.balance),
//     onError: (err) => {
//       setError(err.message);
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
//     refetchInterval: 1000, // Refetch every second for countdown
//     onError: (err) => {
//       setError(err.message);
//       if (err.message === 'Authentication required') {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     },
//     retry: 0,
//   });

//   const mutation = useMutation({
//     mutationFn: placeBet,
//     onSuccess: (data) => {
//       setBalance(data.balance);
//       setLastResult({ ...data.bet, payout: data.bet.payout });
//       queryClient.invalidateQueries(['bets']);
//       queryClient.invalidateQueries(['userProfile']);
//     },
//     onError: (err) => setError(err.message),
//   });

//   const getResultColorClass = useCallback((result, type) => {
//     if (type === 'color') {
//       return result?.toLowerCase() || '';
//     }
//     return parseInt(result) % 2 === 0 ? 'green' : 'red';
//   }, []);

//   const handleBet = async ({ type, value, amount, clientSeed, color, exactMultiplier }) => {
//     setError('');
//     try {
//       if (amount > userData.balance) {
//         throw new Error('Bet amount exceeds available balance');
//       }
//       await mutation.mutateAsync({ type, value, amount, clientSeed, color, exactMultiplier });
//     } catch (err) {
//       setError(err.message);
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

//   const timeLeft = roundData ? Math.max(0, (new Date(roundData.expiresAt) - Date.now()) / 1000) : 0;

//   return (
//     <div className="game-page container">
//       <Header />
//       <div className="game958">
//         {error && <p className="game-error" role="alert">{error}</p>}
//         <div className="round-info">
//           <p>Current Round: {roundData?.period}</p>
//           <p>Time Left: {Math.floor(timeLeft)} seconds</p>
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
//       {!lastResult && !mutation.isLoading && (
//         <p className="no-result">Place a bet to see the result.</p>
//       )}
//       <BetForm
//         onSubmit={handleBet}
//         isLoading={mutation.isLoading}
//         balance={userData.balance}
//         isDisabled={userData.balance === 0 || mutation.isLoading}
//       />
//       <HistoryTable bets={betsData || []} />
//     </div>
//   );
// }

// export default Game;


import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext';
import BetForm from '../components/BetForm';
import HistoryTable from '../components/HistoryTable';
import Header from '../components/header';
import '../styles/game.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(`Profile fetch failed: ${response.status}`);
  }
  return response.json();
};

const fetchBets = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(`Bets fetch failed: ${response.status}`);
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
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(`Round fetch failed: ${response.status}`);
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

function Game() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setBalance } = useBalance();
  const [error, setError] = useState('');
  const [lastResult, setLastResult] = useState(null);

  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    onSuccess: (data) => setBalance(data.balance),
    onError: (err) => {
      setError(err.message);
      if (err.message === 'Authentication required') {
        localStorage.removeItem('token');
        navigate('/login');
      }
    },
    retry: 0,
  });

  const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
    queryKey: ['bets'],
    queryFn: fetchBets,
    onError: (err) => {
      setError(err.message);
      if (err.message === 'Authentication required') {
        localStorage.removeItem('token');
        navigate('/login');
      }
    },
    retry: 0,
  });

  const { data: roundData, isLoading: roundLoading } = useQuery({
    queryKey: ['currentRound'],
    queryFn: fetchCurrentRound,
    refetchInterval: 1000, // Refetch every second for countdown
    onError: (err) => {
      setError(err.message);
      if (err.message === 'Authentication required') {
        localStorage.removeItem('token');
        navigate('/login');
      }
    },
    retry: 0,
  });

  const mutation = useMutation({
    mutationFn: placeBet,
    onSuccess: (data) => {
      console.log('Mutation success:', data);
      setBalance(data.balance);
      setLastResult({ ...data.bet, payout: data.bet.payout });
      queryClient.invalidateQueries(['bets']);
      queryClient.invalidateQueries(['userProfile']);
    },
    onError: (err) => {
      console.error('Mutation error:', err.message);
      setError(err.message);
    },
    onSettled: () => console.log('Mutation settled'),
  });

  const getResultColorClass = useCallback((result, type) => {
    if (type === 'color') {
      return result?.toLowerCase() || '';
    }
    return parseInt(result) % 2 === 0 ? 'green' : 'red';
  }, []);

  const handleBet = async ({ type, value, amount, clientSeed, color, exactMultiplier }) => {
    console.log('Handling bet:', { type, value, amount, clientSeed, color, exactMultiplier });
    setError('');
    try {
      if (amount > userData.balance) {
        throw new Error('Bet amount exceeds available balance');
      }
      await mutation.mutateAsync({ type, value, amount, clientSeed, color, exactMultiplier });
    } catch (err) {
      console.error('Handle bet error:', err.message);
      setError(err.message);
    }
  };

  if (userLoading || betsLoading || roundLoading) {
    return (
      <div className="game-page container">
        <Header />
        <div className="loading-spinner" aria-live="polite">Loading...</div>
      </div>
    );
  }

  if (userError || betsError) {
    return (
      <div className="game-page container">
        <Header />
        <p className="game-error" role="alert">{error}</p>
        {error === 'Authentication required' && (
          <button onClick={() => navigate('/login')} className="login-button">
            Log In
          </button>
        )}
      </div>
    );
  }

  const timeLeft = roundData ? Math.max(0, (new Date(roundData.expiresAt) - Date.now()) / 1000) : 0;

  return (
    <div className="game-page container">
      <Header />
      <div className="game958">
        {error && (
          <p className="game-error" role="alert" style={{ color: 'red', fontWeight: 'bold' }}>
            {error}
          </p>
        )}
        <div className="round-info">
          <p>Current Round: {roundData?.period || 'Loading...'}</p>
          <p>Time Left: {Math.floor(timeLeft)} seconds</p>
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
      {!lastResult && !mutation.isLoading && (
        <p className="no-result">Place a bet to see the result.</p>
      )}
      <BetForm
        onSubmit={handleBet}
        isLoading={mutation.isLoading}
        balance={userData.balance}
        isDisabled={userData.balance === 0 || mutation.isLoading}
        roundData={roundData}
      />
      <HistoryTable bets={betsData || []} />
    </div>
  );
}

export default Game;
