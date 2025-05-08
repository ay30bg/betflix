// import { useState, useEffect } from 'react';
// import BetForm from '../components/BetForm';
// import HistoryTable from '../components/HistoryTable';
// import Header from '../components/header';
// import '../styles/game.css';

// function Game() {
//   const [balance, setBalance] = useState(() => {
//     const savedUser = localStorage.getItem('userProfile');
//     return savedUser ? JSON.parse(savedUser).balance : 1000;
//   });
//   const [bets, setBets] = useState(() => {
//     const savedBets = localStorage.getItem('betHistory');
//     return savedBets ? JSON.parse(savedBets) : [];
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [lastResult, setLastResult] = useState(null);

//   useEffect(() => {
//     localStorage.setItem('betHistory', JSON.stringify(bets));
//   }, [bets]);

//   useEffect(() => {
//     const savedUser = localStorage.getItem('userProfile');
//     if (savedUser) {
//       const user = JSON.parse(savedUser);
//       localStorage.setItem('userProfile', JSON.stringify({ ...user, balance }));
//     }
//   }, [balance]);

//   const getResultColorClass = (result, type) => {
//     if (type === 'color') {
//       return result.toLowerCase();
//     }
//     return result % 2 === 0 ? 'green' : 'red';
//   };

//   const handleBet = async ({ type, value, amount, clientSeed, color, exactMultiplier }) => {
//     try {
//       setIsLoading(true);
//       setError('');

//       const period = clientSeed.slice(0, 8);
//       console.log('Processing bet with clientSeed:', clientSeed, 'period:', period);

//       if (bets.some((bet) => bet.period === period)) {
//         throw new Error(`Duplicate bet with period ${period} ignored.`);
//       }

//       const resultNumber = Math.floor(Math.random() * 10);
//       const resultColor = resultNumber % 2 === 0 ? 'Green' : 'Red';

//       let won = false;
//       let payout = 0;

//       if (type === 'color') {
//         won = value === resultColor;
//         payout = won ? amount * 2 : -amount;
//       } else if (type === 'number') {
//         if (value === resultNumber) {
//           won = true;
//           payout = amount * (exactMultiplier || 10);
//         } else if (color === resultColor) {
//           won = true;
//           payout = amount * 2;
//         } else {
//           payout = -amount;
//         }
//       }

//       const newBet = {
//         period,
//         type,
//         value,
//         amount,
//         result: type === 'color' ? resultColor : resultNumber,
//         won,
//       };

//       setBalance((prev) => Math.max(prev + payout, 0));
//       setBets((prevBets) => {
//         const updatedBets = [newBet, ...prevBets].slice(0, 10);
//         return updatedBets;
//       });
//       setLastResult({ ...newBet, payout });
//     } catch (err) {
//       setError(err.message);
//       console.error('Bet processing error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="game-page container">
//       <Header balance={balance} />
//       <div className="game958">
//         {error && <p className="game-error" role="alert">{error}</p>}
//       </div>
//       {isLoading && (
//         <div className="loading-spinner" aria-live="polite">
//           Processing Bet...
//         </div>
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
//             aria-label="Close result"
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
//       {!lastResult && !isLoading && (
//         <p className="no-result">Place a bet to see the result.</p>
//       )}
//       <BetForm
//         onSubmit={handleBet}
//         isLoading={isLoading}
//         balance={balance}
//         isDisabled={balance === 0 || isLoading}
//       />
//       <HistoryTable bets={bets} />
//     </div>
//   );
// }

// export default Game;

// src/pages/Game.jsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBalance } from '../context/BalanceContext';
import BetForm from '../components/BetForm';
import HistoryTable from '../components/HistoryTable';
import Header from '../components/Header';
import '../styles/game.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_URL}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

const fetchBets = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_URL}/api/bets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch bets');
  return response.json();
};

const placeBet = async (betData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_URL}/api/bets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(betData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to process bet');
  }
  return response.json();
};

function Game() {
  const queryClient = useQueryClient();
  const { setBalance } = useBalance();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastResult, setLastResult] = useState(null);

  // Fetch user profile (balance)
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    onSuccess: (data) => setBalance(data.balance),
    onError: (err) => setError(err.message),
  });

  // Fetch bets
  const { data: betsData } = useQuery({
    queryKey: ['bets'],
    queryFn: fetchBets,
    onError: (err) => setError(err.message),
  });

  // Place bet mutation
  const mutation = useMutation({
    mutationFn: placeBet,
    onSuccess: (data) => {
      setBalance(data.balance);
      setLastResult({ ...data.bet, payout: data.bet.payout });
      queryClient.setQueryData(['bets'], (old) => ({
        bets: [data.bet, ...(old?.bets || [])].slice(0, 10),
      }));
      queryClient.invalidateQueries(['userProfile']);
    },
    onError: (err) => setError(err.message),
    onSettled: () => setIsLoading(false),
  });

  const getResultColorClass = (result, type) => {
    if (type === 'color') {
      return result.toLowerCase();
    }
    return result % 2 === 0 ? 'green' : 'red';
  };

  const handleBet = async ({ type, value, amount, clientSeed, color, exactMultiplier }) => {
    setIsLoading(true);
    setError('');
    try {
      const period = clientSeed.slice(0, 8);
      if (betsData?.bets.some((bet) => bet.period === period)) {
        throw new Error(`Duplicate bet with period ${period} ignored.`);
      }
      await mutation.mutateAsync({ type, value, amount, clientSeed, color, exactMultiplier });
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (userLoading || !userData || !betsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-page container">
      <Header />
      <div className="game958">
        {error && <p className="game-error" role="alert">{error}</p>}
      </div>
      {isLoading && (
        <div className="loading-spinner" aria-live="polite">
          Processing Bet...
        </div>
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
      {!lastResult && !isLoading && (
        <p className="no-result">Place a bet to see the result.</p>
      )}
      <BetForm
        onSubmit={handleBet}
        isLoading={isLoading}
        balance={userData.balance}
        isDisabled={userData.balance === 0 || isLoading}
      />
      <HistoryTable bets={betsData.bets} />
    </div>
  );
}

export default Game;
