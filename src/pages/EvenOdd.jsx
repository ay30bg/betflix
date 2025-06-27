
// import React, { useState, useEffect, useCallback, memo } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import '../styles/even-odd.css';
// import Header from '../components/header';
// import BetForm from '../components/EvenOddBetform';
// import HistoryTable from '../components/EvenOddHistoryTable';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// // Simulated backend API functions
// const simulateBackend = {
//   async placeBet(betData) {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     const result = Math.floor(Math.random() * 100) + 1; // Random number 1-100
//     const isEven = result % 2 === 0;
//     const won = betData.choice === (isEven ? 'even' : 'odd');
//     const payout = won ? betData.amount * 2 : -betData.amount;
    
//     return {
//       bet: {
//         id: Date.now(),
//         period: `round-${Date.now()}`,
//         choice: betData.choice,
//         amount: betData.amount,
//         result: result.toString(),
//         won,
//         payout,
//         status: 'finalized',
//         createdAt: new Date().toISOString(),
//       },
//       balance: betData.balance + payout
//     };
//   },

//   async fetchBets() {
//     // Simulate fetching bet history
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return JSON.parse(localStorage.getItem('bets') || '[]');
//   },

//   async fetchCurrentRound() {
//     return {
//       period: `round-${Date.now()}`,
//       expiresAt: new Date(Date.now() + 30000).toISOString(), // 30-second rounds
//     };
//   }
// };

// function EvenOddGame() {
//   const queryClient = useQueryClient();
//   const [balance, setBalance] = useState(1000); // Starting balance
//   const [notification, setNotification] = useState(null);
//   const [error, setError] = useState('');
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [pendingBet, setPendingBet] = useState(null);
//   const [lastResult, setLastResult] = useState(null);

//   // Fetch current round data
//   const { data: roundData, isLoading: roundLoading } = useQuery({
//     queryKey: ['currentRound'],
//     queryFn: simulateBackend.fetchCurrentRound,
//     refetchInterval: 30000, // New round every 30 seconds
//     staleTime: 1000,
//   });

//   // Fetch bet history
//   const { data: betsData, isLoading: betsLoading } = useQuery({
//     queryKey: ['bets'],
//     queryFn: simulateBackend.fetchBets,
//     staleTime: 1000,
//   });

//   // Timer for current round
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

//   // Clear notifications after 5 seconds
//   useEffect(() => {
//     if (notification) {
//       const timeout = setTimeout(() => setNotification(null), 5000);
//       return () => clearTimeout(timeout);
//     }
//   }, [notification]);

//   // Bet placement mutation
//   const mutation = useMutation({
//     mutationFn: simulateBackend.placeBet,
//     onSuccess: (data) => {
//       setBalance(data.balance);
//       setLastResult(data.bet);
//       setPendingBet(null);
      
//       // Update local bet history
//       const updatedBets = [...(betsData || []), data.bet];
//       localStorage.setItem('bets', JSON.stringify(updatedBets));
      
//       setNotification({
//         type: data.bet.won ? 'success' : 'info',
//         message: data.bet.won 
//           ? `You won $${data.bet.payout.toFixed(2)}!`
//           : `Bet lost. Number was ${data.bet.result}.`
//       });
      
//       queryClient.invalidateQueries(['bets']);
//     },
//     onError: (err) => {
//       setError(err.message || 'Failed to place bet');
//       setTimeout(() => setError(''), 5000);
//     },
//   });

//   const handleBet = useCallback(async (betData) => {
//     if (betData.amount > balance) {
//       setError('Insufficient balance');
//       setTimeout(() => setError(''), 5000);
//       return;
//     }
//     if (timeLeft < 5) {
//       setError('Round is about to end. Please wait for the next round.');
//       setTimeout(() => setError(''), 5000);
//       return;
//     }
    
//     try {
//       setPendingBet({
//         period: roundData.period,
//         choice: betData.choice,
//         amount: betData.amount
//       });
//       await mutation.mutateAsync({
//         ...betData,
//         balance,
//         period: roundData.period
//       });
//     } catch (err) {
//       setPendingBet(null);
//       setError(err.message || 'Failed to place bet');
//       setTimeout(() => setError(''), 5000);
//     }
//   }, [balance, timeLeft, roundData, mutation]);

//   if (roundLoading || betsLoading) {
//     return (
//       <div className="eo-game-page">
//         <Header />
//         <div className="eo-loading-spinner" aria-live="polite">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="eo-game-page">
//       <Header balance={balance} />
//       {notification && (
//         <div className={`eo-notification ${notification.type}`} role="alert" aria-live="polite">
//           {notification.message}
//         </div>
//       )}
//       {error && (
//         <p className="eo-game-error" role="alert" aria-live="polite">
//           {error}
//         </p>
//       )}
//       <div>
//         <div className="eo-round-info">
//           <h2>Even/Odd Game</h2>
//           <p>Current Round: {roundData?.period || 'Loading...'}</p>
//           <p>Time Left: {timeLeft} seconds</p>
//         </div>
        
//         {lastResult && (
//           <div 
//             className={`eo-result ${lastResult.won ? 'won' : 'lost'}`}
//             role="alert"
//             aria-live="polite"
//           >
//             <button
//               className="eo-result-close"
//               onClick={() => setLastResult(null)}
//               aria-label="Close result"
//             >
//               ×
//             </button>
//             <div className="eo-result-header">
//               {lastResult.won ? '🎉 You Won!' : '😔 You Lost'}
//             </div>
//             <div className="eo-result-detail">
//               Number: {lastResult.result} ({lastResult.result % 2 === 0 ? 'Even' : 'Odd'})
//             </div>
//             <div className="eo-result-payout">
//               {lastResult.won 
//                 ? `+$${lastResult.payout.toFixed(2)}`
//                 : `-$${Math.abs(lastResult.payout).toFixed(2)}`}
//             </div>
//           </div>
//         )}

//         {pendingBet && !lastResult && !mutation.isLoading && (
//           <div className="eo-pending-bet" role="alert" aria-live="polite">
//             <p>Bet placed on {pendingBet.choice} for round {pendingBet.period}</p>
//             <p>Waiting for result... ⌛</p>
//           </div>
//         )}

//         <BetForm
//           onSubmit={handleBet}
//           isLoading={mutation.isLoading}
//           balance={balance}
//           isDisabled={balance === 0 || mutation.isLoading || timeLeft < 5}
//           betOptions={['even', 'odd']}
//           roundData={roundData}
//           timeLeft={timeLeft}
//         />
//         <HistoryTable bets={betsData || []} />
//       </div>
//     </div>
//   );
// }

// export default memo(EvenOddGame);


import React from 'react';
import { Link } from 'react-router-dom'; // For navigation
import Header from './header'; // Use provided Header component
import './UnderConstruction.css'; // Responsive CSS

const UnderConstruction = () => {
  return (
    <div className="under-construction-container">
      <Header />S
      <h1>Page Under Construction</h1>
      <p>Check back soon for the Even & Odd game!</p>
      <Link to="/game">
        <button className="explore-button">Explore Other Games</button>
      </Link>
    </div>
  );
};

export default UnderConstruction;
