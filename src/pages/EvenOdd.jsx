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


// // import React from 'react';
// // import { Link } from 'react-router-dom'; // For navigation
// // import Header from '../components/header';
// // import '../styles/even-odd.css';

// // const UnderConstruction = () => {
// //   return (
// //     <div className="under-construction-container">
// //       <Header />
// //       <div className="construction-container">
// //       <h1>Page Under Construction</h1>
// //       <p>Check back soon for the Even & Odd game!</p>
// //       <Link to="/game">
// //         <button className="explore-button">Explore Other Games</button>
// //       </Link>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UnderConstruction;

import React, { useState, useRef, useEffect } from 'react';
import '../styles/even-odd.css';

const App = () => {
  const [multiplier, setMultiplier] = useState(1.0);
  const [isFlying, setIsFlying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashOutMultiplier, setCashOutMultiplier] = useState(null);
  const [rocketPosition, setRocketPosition] = useState({ left: 0, bottom: 100 });
  const [bet, setBet] = useState(10);
  const [winnings, setWinnings] = useState(0);
  const [balance, setBalance] = useState(1000);
  const [history, setHistory] = useState([]);
  const [isStormy, setIsStormy] = useState(false);
  const [autoCashOut, setAutoCashOut] = useState(null);
  const [leaderboard, setLeaderboard] = useState(
    JSON.parse(localStorage.getItem('leaderboard')) || []
  );
  const [activeTab, setActiveTab] = useState('history');
  const intervalRef = useRef(null);
  const gameAreaRef = useRef(null);

  // Generate pulsing stars
  const [stars, setStars] = useState([]);
  // Add state for shooting stars
  const [shootingStars, setShootingStars] = useState([]);
  // Add state for asteroids with enhanced properties
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: 20 }, () => ({
      left: Math.random() * 600,
      top: Math.random() * 300,
      animationDelay: `${Math.random() * 3}s`,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);

    // Initialize asteroids with varied properties
    const newAsteroids = Array.from({ length: 5 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      left: -20,
      top: Math.random() * 300,
      size: Math.random() * 10 + 6, // Size between 6px and 16px
      speed: Math.random() * 2 + 1, // Speed between 1 and 3
      angle: Math.random() * 60 - 30, // Angle between -30 and 30 degrees
      rotation: Math.random() * 360,
      animationDuration: Math.random() * 5 + 10, // Duration between 10s and 15s
    }));
    setAsteroids(newAsteroids);
  }, []);

  // Generate shooting stars periodically
  useEffect(() => {
    const generateShootingStar = () => {
      const newShootingStar = {
        id: Math.random().toString(36).substr(2, 9),
        left: Math.random() * 600,
        top: -20,
        angle: Math.random() * 90 + 45, // Diagonal trajectory (45° to 135°)
        speed: Math.random() * 2 + 2, // Speed between 2 and 4
        duration: Math.random() * 2 + 1, // Duration between 1s and 3s
      };
      setShootingStars((prev) => [...prev, newShootingStar].slice(-3)); // Keep max 3 shooting stars
    };

    const interval = setInterval(generateShootingStar, 3000); // New shooting star every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Center rocket on mount and on window resize
  useEffect(() => {
    const updateRocketPosition = () => {
      if (gameAreaRef.current) {
        const gameAreaWidth = gameAreaRef.current.offsetWidth;
        const rocketWidth = 100;
        const centeredLeft = Math.max(0, (gameAreaWidth - rocketWidth) / 2);
        setRocketPosition((prev) => ({ ...prev, left: centeredLeft }));
      }
    };
    updateRocketPosition();
    window.addEventListener('resize', updateRocketPosition);
    return () => window.removeEventListener('resize', updateRocketPosition);
  }, []);

  // Reset background position, rocket, and asteroids when game ends
  useEffect(() => {
    if (!isFlying && (crashed || cashOutMultiplier)) {
      if (gameAreaRef.current) {
        gameAreaRef.current.style.backgroundPositionY = '0px';
        const gameAreaWidth = gameAreaRef.current.offsetWidth;
        const rocketWidth = 100;
        const centeredLeft = Math.max(0, (gameAreaWidth - rocketWidth) / 2);
        setRocketPosition({ left: centeredLeft, bottom: 100 });
        // Reset asteroids
        setAsteroids(
          Array.from({ length: 5 }, () => ({
            id: Math.random().toString(36).substr(2, 9),
            left: -20,
            top: Math.random() * 300,
            size: Math.random() * 10 + 6,
            speed: Math.random() * 2 + 1,
            angle: Math.random() * 60 - 30,
            rotation: Math.random() * 360,
            animationDuration: Math.random() * 5 + 10,
          }))
        );
      }
    }
  }, [isFlying, crashed, cashOutMultiplier]);

  const startGame = () => {
    if (bet > balance) {
      alert('Insufficient balance!');
      return;
    }
    setBalance((prev) => prev - bet);
    setIsFlying(true);
    setCrashed(false);
    setCashOutMultiplier(null);
    setMultiplier(1.0);
    setWinnings(0);
    setIsStormy(false);

    // Ensure rocket is centered at start
    if (gameAreaRef.current) {
      const gameAreaWidth = gameAreaRef.current.offsetWidth;
      const rocketWidth = 100;
      setRocketPosition({ left: (gameAreaWidth - rocketWidth) / 2, bottom: 100 });
    }

    const crashPoint = Number((Math.random() * 9 + 1.1).toFixed(2));

    intervalRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const newMultiplier = Number((prev * 1.05).toFixed(2));
        if (newMultiplier > 5) {
          setIsStormy(true);
        }
        if (autoCashOut && newMultiplier >= autoCashOut) {
          cashOut();
          return prev;
        }
        if (newMultiplier >= crashPoint && !crashed) {
          clearInterval(intervalRef.current);
          setIsFlying(false);
          setCrashed(true);
          setHistory((prev) => [
            ...prev,
            { bet, multiplier: newMultiplier, winnings: 0, outcome: 'Crashed' },
          ]);
          return prev;
        }
        return newMultiplier;
      });
      setRocketPosition((prev) => {
        if (!gameAreaRef.current) {
          return prev;
        }
        const gameAreaWidth = gameAreaRef.current.offsetWidth;
        const gameAreaHeight = gameAreaRef.current.offsetHeight;
        const rocketWidth = 100;
        const rocketHeight = 150;
        const rocketSpeed = 2;
        const newBottom = Math.min(prev.bottom + rocketSpeed, gameAreaHeight - rocketHeight);
        const backgroundSpeed = rocketSpeed * 1.2;
        gameAreaRef.current.style.backgroundPositionY = `${-newBottom * backgroundSpeed / rocketSpeed}px`;
        const newLeft = (gameAreaWidth - rocketWidth) / 2 + (Math.random() * 10 - 5);
        return {
          left: newLeft,
          bottom: newBottom,
        };
      });
    }, 100);
  };

  const cashOut = () => {
    if (isFlying && !crashed) {
      setIsFlying(false);
      setCashOutMultiplier(multiplier);
      const calculatedWinnings = Number((bet * multiplier).toFixed(2));
      setWinnings(calculatedWinnings);
      setBalance((prev) => prev + calculatedWinnings);
      setHistory((prev) => [
        ...prev,
        { bet, multiplier, winnings: calculatedWinnings, outcome: 'Cashed Out' },
      ]);
      setLeaderboard((prev) => {
        const newLeaderboard = [
          ...prev,
          { multiplier, winnings: calculatedWinnings, timestamp: new Date().toLocaleString() },
        ].sort((a, b) => b.winnings - a.winnings).slice(0, 5);
        localStorage.setItem('leaderboard', JSON.stringify(newLeaderboard));
        return newLeaderboard;
      });
      clearInterval(intervalRef.current);
    }
  };

  const handleBetChange = (e) => {
    const newBet = Number(e.target.value);
    if (!isNaN(newBet) && newBet >= 1 && newBet <= 1000) {
      setBet(Math.floor(newBet));
    }
  };

  const handleAutoCashOutChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setAutoCashOut(value);
    } else {
      setAutoCashOut(null);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Remove completed shooting stars
  const handleAnimationEnd = (id) => {
    setShootingStars((prev) => prev.filter((star) => star.id !== id));
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div className="game-container">
        <h1>Rocket Blast Game</h1>
        <div className="balance">Balance: ${balance.toFixed(2)}</div>
        <div
          className={`game-area ${isStormy ? 'stormy' : ''}`}
          ref={gameAreaRef}
        >
          <div className="background-layer far-stars"></div>
          <div className="background-layer near-stars"></div>
          <div className="nebula"></div>
          <div className="planet planet-1">
            <div className="planet-ring"></div>
          </div>
          <div className="planet planet-2"></div>
          {stars.map((star, index) => (
            <div
              key={index}
              className="pulsing-star"
              style={{
                left: `${star.left}px`,
                top: `${star.top}px`,
                animationDelay: star.animationDelay,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
            ></div>
          ))}
          {shootingStars.map((star) => (
            <div
              key={star.id}
              className="shooting-star"
              style={{
                left: `${star.left}px`,
                top: `${star.top}px`,
                transform: `rotate(${star.angle}deg)`,
                animationDuration: `${star.duration}s`,
              }}
              onAnimationEnd={() => handleAnimationEnd(star.id)}
            >
              <div className="star-head"></div>
              <div className="star-tail"></div>
            </div>
          ))}
          {asteroids.map((asteroid) => (
            <div
              key={asteroid.id}
              className="asteroid"
              style={{
                left: `${asteroid.left}px`,
                top: `${asteroid.top}px`,
                width: `${asteroid.size}px`,
                height: `${asteroid.size}px`,
                animationDuration: `${asteroid.animationDuration}s`,
                transform: `rotate(${asteroid.angle}deg)`,
              }}
            ></div>
          ))}
          <div className="orbit-trail"></div>
          <div className="hud-overlay">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
          </div>
          <div
            className={`rocket ${crashed ? 'crashed' : ''}`}
            style={{
              left: `${rocketPosition.left}px`,
              bottom: `${rocketPosition.bottom}px`,
              visibility: 'visible',
            }}
          >
            <svg width="100" height="150" viewBox="0 0 200 300" className="rocket-svg">
              {/* SVG content remains unchanged */}
              <defs>
                <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#e6e6e6', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#a1a1a1', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#666666', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ff4500', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#ffa500', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffff00', stopOpacity: 0.8 }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M100,40 L80,200 L120,200 Z"
                fill="#000000"
                fillOpacity="0.3"
                transform="translate(8, 8)"
                className="rocket-shadow"
              />
              <path
                d="M100,30 C115,30 125,50 125,80 C125,140 120,180 100,200 C80,180 75,140 75,80 C75,50 85,30 100,30 Z"
                fill="url(#rocketGradient)"
                stroke="#444"
                strokeWidth="3"
                className="rocket-body"
                filter="url(#glow)"
              />
              <circle cx="100" cy="60" r="10" fill="#222" stroke="#00ffcc" strokeWidth="2" filter="url(#glow)" />
              <circle cx="100" cy="100" r="8" fill="#222" stroke="#00ffcc" strokeWidth="2" filter="url(#glow)" />
              <path
                d="M75,150 L55,200 L75,200 Z"
                fill="url(#rocketGradient)"
                stroke="#444"
                strokeWidth="3"
                className="left-fin"
                filter="url(#glow)"
              />
              <path
                d="M125,150 L145,200 L125,200 Z"
                fill="url(#rocketGradient)"
                stroke="#444"
                strokeWidth="3"
                className="right-fin"
                filter="url(#glow)"
              />
              <path
                d="M80,200 L100,280 L120,200 Z"
                fill="url(#flameGradient)"
                className="rocket-flames outer-flame"
                filter="url(#glow)"
              />
              <path
                d="M90,200 L100,260 L110,200 Z"
                fill="url(#flameGradient)"
                fillOpacity="0.7"
                className="rocket-flames inner-flame"
                filter="url(#glow)"
              />
              <path
                d="M95,200 L100,240 L105,200 Z"
                fill="url(#flameGradient)"
                fillOpacity="0.9"
                className="rocket-flames core-flame"
                filter="url(#glow)"
              />
              {Array.from({ length: 5 }).map((_, index) => (
                <circle
                  key={`exhaust-${index}`}
                  cx={100}
                  cy={220 + index * 5}
                  r="2"
                  fill="#ff4500"
                  className="exhaust-particle"
                  style={{ animationDelay: `${Math.random() * 0.5}s` }}
                />
              ))}
            </svg>
          </div>
          <div className="multiplier">
            Multiplier: {multiplier.toFixed(2)}x
          </div>
          <div className="multiplier-bar">
            <div
              className="multiplier-progress"
              style={{ width: `${Math.min(multiplier * 10, 100)}%` }}
            ></div>
          </div>
          {crashed && <div className="crash-message">Rocket Exploded!</div>}
          {cashOutMultiplier && (
            <div className="cashout-message">
              Cashed out at {cashOutMultiplier.toFixed(2)}x! Winnings: ${winnings.toFixed(2)}
            </div>
          )}
        </div>
        <div className="controls">
          <input
            type="number"
            value={bet}
            onChange={handleBetChange}
            min="1"
            max="1000"
            step="1"
            disabled={isFlying}
            placeholder="Enter bet amount"
            className="bet-input"
          />
          <input
            type="number"
            value={autoCashOut || ''}
            onChange={handleAutoCashOutChange}
            min="1"
            step="0.1"
            disabled={isFlying}
            placeholder="Auto Cash Out (x)"
            className="bet-input"
          />
          {!isFlying && !crashed && !cashOutMultiplier && (
            <button onClick={startGame} className="action-button">Launch Rocket</button>
          )}
          {isFlying && !crashed && (
            <button onClick={cashOut} className="action-button cash-out">Cash Out</button>
          )}
          {(crashed || cashOutMultiplier) && (
            <button onClick={startGame} className="action-button">Play Again</button>
          )}
        </div>
        <div className="tab-container">
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              Game History
            </button>
            <button
              className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('leaderboard')}
            >
              Leaderboard
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'history' && (
              <div className="history">
                <h2>Game History</h2>
                {history.length === 0 ? (
                  <p>No games played yet.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Bet ($)</th>
                        <th>Multiplier (x)</th>
                        <th>Winnings ($)</th>
                        <th>Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((round, index) => (
                        <tr key={index}>
                          <td>{Number(round.bet).toFixed(2)}</td>
                          <td>{Number(round.multiplier).toFixed(2)}</td>
                          <td>{Number(round.winnings).toFixed(2)}</td>
                          <td>{round.outcome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {activeTab === 'leaderboard' && (
              <div className="leaderboard">
                <h2>Leaderboard</h2>
                {leaderboard.length === 0 ? (
                  <p>No high scores yet.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Multiplier (x)</th>
                        <th>Winnings ($)</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr key={index}>
                          <td>{Number(entry.multiplier).toFixed(2)}</td>
                          <td>{Number(entry.winnings).toFixed(2)}</td>
                          <td>{entry.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const RocketGame = () => {
  const [multiplier, setMultiplier] = useState(1.0);
  const [isFlying, setIsFlying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashOutMultiplier, setCashOutMultiplier] = useState(null);
  const [rocketPosition, setRocketPosition] = useState({ left: 0, bottom: 100 });
  const [bet, setBet] = useState(10);
  const [winnings, setWinnings] = useState(0);
  const [balance, setBalance] = useState(1000);
  const [history, setHistory] = useState([]);
  const [isStormy, setIsStormy] = useState(false);
  const [autoCashOut, setAutoCashOut] = useState(null);
  const [leaderboard, setLeaderboard] = useState(
    JSON.parse(localStorage.getItem('leaderboard')) || []
  );
  const [activeTab, setActiveTab] = useState('history');
  const intervalRef = useRef(null);
  const gameAreaRef = useRef(null);

  // Generate pulsing stars
  const [stars, setStars] = useState([]);
  // Add state for shooting stars
  const [shootingStars, setShootingStars] = useState([]);
  // Add state for asteroids with enhanced properties
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: 20 }, () => ({
      left: Math.random() * 600,
      top: Math.random() * 300,
      animationDelay: `${Math.random() * 3}s`,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);

    // Initialize asteroids with varied properties
    const newAsteroids = Array.from({ length: 5 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      left: -20,
      top: Math.random() * 300,
      size: Math.random() * 10 + 6, // Size between 6px and 16px
      speed: Math.random() * 2 + 1, // Speed between 1 and 3
      angle: Math.random() * 60 - 30, // Angle between -30 and 30 degrees
      rotation: Math.random() * 360,
      animationDuration: Math.random() * 5 + 10, // Duration between 10s and 15s
    }));
    setAsteroids(newAsteroids);
  }, []);

  // Generate shooting stars periodically
  useEffect(() => {
    const generateShootingStar = () => {
      const newShootingStar = {
        id: Math.random().toString(36).substr(2, 9),
        left: Math.random() * 600,
        top: -20,
        angle: Math.random() * 90 + 45, // Diagonal trajectory (45° to 135°)
        speed: Math.random() * 2 + 2, // Speed between 2 and 4
        duration: Math.random() * 2 + 1, // Duration between 1s and 3s
      };
      setShootingStars((prev) => [...prev, newShootingStar].slice(-3)); // Keep max 3 shooting stars
    };

    const interval = setInterval(generateShootingStar, 3000); // New shooting star every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Center rocket on mount and on window resize
  useEffect(() => {
    const updateRocketPosition = () => {
      if (gameAreaRef.current) {
        const gameAreaWidth = gameAreaRef.current.offsetWidth;
        const rocketWidth = 100;
        const centeredLeft = Math.max(0, (gameAreaWidth - rocketWidth) / 2);
        setRocketPosition((prev) => ({ ...prev, left: centeredLeft }));
      }
    };
    updateRocketPosition();
    window.addEventListener('resize', updateRocketPosition);
    return () => window.removeEventListener('resize', updateRocketPosition);
  }, []);

  // Reset background position, rocket, and asteroids when game ends
  useEffect(() => {
    if (!isFlying && (crashed || cashOutMultiplier)) {
      if (gameAreaRef.current) {
        gameAreaRef.current.style.backgroundPositionY = '0px';
        const gameAreaWidth = gameAreaRef.current.offsetWidth;
        const rocketWidth = 100;
        const centeredLeft = Math.max(0, (gameAreaWidth - rocketWidth) / 2);
        setRocketPosition({ left: centeredLeft, bottom: 100 });
        // Reset asteroids
        setAsteroids(
          Array.from({ length: 5 }, () => ({
            id: Math.random().toString(36).substr(2, 9),
            left: -20,
            top: Math.random() * 300,
            size: Math.random() * 10 + 6,
            speed: Math.random() * 2 + 1,
            angle: Math.random() * 60 - 30,
            rotation: Math.random() * 360,
            animationDuration: Math.random() * 5 + 10,
          }))
        );
      }
    }
  }, [isFlying, crashed, cashOutMultiplier]);

  const startGame = () => {
    if (bet > balance) {
      alert('Insufficient balance!');
      return;
    }
    setBalance((prev) => prev - bet);
    setIsFlying(true);
    setCrashed(false);
    setCashOutMultiplier(null);
    setMultiplier(1.0);
    setWinnings(0);
    setIsStormy(false);

    // Ensure rocket is centered at start
    if (gameAreaRef.current) {
      const gameAreaWidth = gameAreaRef.current.offsetWidth;
      const rocketWidth = 100;
      setRocketPosition({ left: (gameAreaWidth - rocketWidth) / 2, bottom: 100 });
    }

    const crashPoint = Number((Math.random() * 9 + 1.1).toFixed(2));

    intervalRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const newMultiplier = Number((prev * 1.05).toFixed(2));
        if (newMultiplier > 5) {
          setIsStormy(true);
        }
        if (autoCashOut && newMultiplier >= autoCashOut) {
          cashOut();
          return prev;
        }
        if (newMultiplier >= crashPoint && !crashed) {
          clearInterval(intervalRef.current);
          setIsFlying(false);
          setCrashed(true);
          setHistory((prev) => [
            ...prev,
            { bet, multiplier: newMultiplier, winnings: 0, outcome: 'Crashed' },
          ]);
          return prev;
        }
        return newMultiplier;
      });
      setRocketPosition((prev) => {
        if (!gameAreaRef.current) {
          return prev;
        }
        const gameAreaWidth = gameAreaRef.current.offsetWidth;
        const gameAreaHeight = gameAreaRef.current.offsetHeight;
        const rocketWidth = 100;
        const rocketHeight = 150;
        const rocketSpeed = 2;
        const newBottom = Math.min(prev.bottom + rocketSpeed, gameAreaHeight - rocketHeight);
        const backgroundSpeed = rocketSpeed * 1.2;
        gameAreaRef.current.style.backgroundPositionY = `${-newBottom * backgroundSpeed / rocketSpeed}px`;
        const newLeft = (gameAreaWidth - rocketWidth) / 2 + (Math.random() * 10 - 5);
        return {
          left: newLeft,
          bottom: newBottom,
        };
      });
    }, 100);
  };

  const cashOut = () => {
    if (isFlying && !crashed) {
      setIsFlying(false);
      setCashOutMultiplier(multiplier);
      const calculatedWinnings = Number((bet * multiplier).toFixed(2));
      setWinnings(calculatedWinnings);
      setBalance((prev) => prev + calculatedWinnings);
      setHistory((prev) => [
        ...prev,
        { bet, multiplier, winnings: calculatedWinnings, outcome: 'Cashed Out' },
      ]);
      setLeaderboard((prev) => {
        const newLeaderboard = [
          ...prev,
          { multiplier, winnings: calculatedWinnings, timestamp: new Date().toLocaleString() },
        ].sort((a, b) => b.winnings - a.winnings).slice(0, 5);
        localStorage.setItem('leaderboard', JSON.stringify(newLeaderboard));
        return newLeaderboard;
      });
      clearInterval(intervalRef.current);
    }
  };

  const handleBetChange = (e) => {
    const newBet = Number(e.target.value);
    if (!isNaN(newBet) && newBet >= 1 && newBet <= 1000) {
      setBet(Math.floor(newBet));
    }
  };

  const handleAutoCashOutChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setAutoCashOut(value);
    } else {
      setAutoCashOut(null);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Remove completed shooting stars
  const handleAnimationEnd = (id) => {
    setShootingStars((prev) => prev.filter((star) => star.id !== id));
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div className="game-container">
        <h1>Rocket Blast Game</h1>
        <div className="balance">Balance: ${balance.toFixed(2)}</div>
        <div
          className={`game-area ${isStormy ? 'stormy' : ''}`}
          ref={gameAreaRef}
        >
          <div className="background-layer far-stars"></div>
          <div className="background-layer near-stars"></div>
          <div className="nebula"></div>
          <div className="planet planet-1">
            <div className="planet-ring"></div>
          </div>
          <div className="planet planet-2"></div>
          {stars.map((star, index) => (
            <div
              key={index}
              className="pulsing-star"
              style={{
                left: `${star.left}px`,
                top: `${star.top}px`,
                animationDelay: star.animationDelay,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
            ></div>
          ))}
          {shootingStars.map((star) => (
            <div
              key={star.id}
              className="shooting-star"
              style={{
                left: `${star.left}px`,
                top: `${star.top}px`,
                transform: `rotate(${star.angle}deg)`,
                animationDuration: `${star.duration}s`,
              }}
              onAnimationEnd={() => handleAnimationEnd(star.id)}
            >
              <div className="star-head"></div>
              <div className="star-tail"></div>
            </div>
          ))}
          {asteroids.map((asteroid) => (
            <div
              key={asteroid.id}
              className="asteroid"
              style={{
                left: `${asteroid.left}px`,
                top: `${asteroid.top}px`,
                width: `${asteroid.size}px`,
                height: `${asteroid.size}px`,
                animationDuration: `${asteroid.animationDuration}s`,
                transform: `rotate(${asteroid.angle}deg)`,
              }}
            ></div>
          ))}
          <div className="orbit-trail"></div>
          <div className="hud-overlay">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
          </div>
          <div
            className={`rocket ${crashed ? 'crashed' : ''}`}
            style={{
              left: `${rocketPosition.left}px`,
              bottom: `${rocketPosition.bottom}px`,
              visibility: 'visible',
            }}
          >
            <svg width="100" height="150" viewBox="0 0 200 300" className="rocket-svg">
              {/* SVG content remains unchanged */}
              <defs>
                <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#e6e6e6', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#a1a1a1', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#666666', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ff4500', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#ffa500', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffff00', stopOpacity: 0.8 }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M100,40 L80,200 L120,200 Z"
                fill="#000000"
                fillOpacity="0.3"
                transform="translate(8, 8)"
                className="rocket-shadow"
              />
              <path
                d="M100,30 C115,30 125,50 125,80 C125,140 120,180 100,200 C80,180 75,140 75,80 C75,50 85,30 100,30 Z"
                fill="url(#rocketGradient)"
                stroke="#444"
                strokeWidth="3"
                className="rocket-body"
                filter="url(#glow)"
              />
              <circle cx="100" cy="60" r="10" fill="#222" stroke="#00ffcc" strokeWidth="2" filter="url(#glow)" />
              <circle cx="100" cy="100" r="8" fill="#222" stroke="#00ffcc" strokeWidth="2" filter="url(#glow)" />
              <path
                d="M75,150 L55,200 L75,200 Z"
                fill="url(#rocketGradient)"
                stroke="#444"
                strokeWidth="3"
                className="left-fin"
                filter="url(#glow)"
              />
              <path
                d="M125,150 L145,200 L125,200 Z"
                fill="url(#rocketGradient)"
                stroke="#444"
                strokeWidth="3"
                className="right-fin"
                filter="url(#glow)"
              />
              <path
                d="M80,200 L100,280 L120,200 Z"
                fill="url(#flameGradient)"
                className="rocket-flames outer-flame"
                filter="url(#glow)"
              />
              <path
                d="M90,200 L100,260 L110,200 Z"
                fill="url(#flameGradient)"
                fillOpacity="0.7"
                className="rocket-flames inner-flame"
                filter="url(#glow)"
              />
              <path
                d="M95,200 L100,240 L105,200 Z"
                fill="url(#flameGradient)"
                fillOpacity="0.9"
                className="rocket-flames core-flame"
                filter="url(#glow)"
              />
              {Array.from({ length: 5 }).map((_, index) => (
                <circle
                  key={`exhaust-${index}`}
                  cx={100}
                  cy={220 + index * 5}
                  r="2"
                  fill="#ff4500"
                  className="exhaust-particle"
                  style={{ animationDelay: `${Math.random() * 0.5}s` }}
                />
              ))}
            </svg>
          </div>
          <div className="multiplier">
            Multiplier: {multiplier.toFixed(2)}x
          </div>
          <div className="multiplier-bar">
            <div
              className="multiplier-progress"
              style={{ width: `${Math.min(multiplier * 10, 100)}%` }}
            ></div>
          </div>
          {crashed && <div className="crash-message">Rocket Exploded!</div>}
          {cashOutMultiplier && (
            <div className="cashout-message">
              Cashed out at {cashOutMultiplier.toFixed(2)}x! Winnings: ${winnings.toFixed(2)}
            </div>
          )}
        </div>
        <div className="controls">
          <input
            type="number"
            value={bet}
            onChange={handleBetChange}
            min="1"
            max="1000"
            step="1"
            disabled={isFlying}
            placeholder="Enter bet amount"
            className="bet-input"
          />
          <input
            type="number"
            value={autoCashOut || ''}
            onChange={handleAutoCashOutChange}
            min="1"
            step="0.1"
            disabled={isFlying}
            placeholder="Auto Cash Out (x)"
            className="bet-input"
          />
          {!isFlying && !crashed && !cashOutMultiplier && (
            <button onClick={startGame} className="action-button">Launch Rocket</button>
          )}
          {isFlying && !crashed && (
            <button onClick={cashOut} className="action-button cash-out">Cash Out</button>
          )}
          {(crashed || cashOutMultiplier) && (
            <button onClick={startGame} className="action-button">Play Again</button>
          )}
        </div>
        <div className="tab-container">
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              Game History
            </button>
            <button
              className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('leaderboard')}
            >
              Leaderboard
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'history' && (
              <div className="history">
                <h2>Game History</h2>
                {history.length === 0 ? (
                  <p>No games played yet.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Bet ($)</th>
                        <th>Multiplier (x)</th>
                        <th>Winnings ($)</th>
                        <th>Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((round, index) => (
                        <tr key={index}>
                          <td>{Number(round.bet).toFixed(2)}</td>
                          <td>{Number(round.multiplier).toFixed(2)}</td>
                          <td>{Number(round.winnings).toFixed(2)}</td>
                          <td>{round.outcome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {activeTab === 'leaderboard' && (
              <div className="leaderboard">
                <h2>Leaderboard</h2>
                {leaderboard.length === 0 ? (
                  <p>No high scores yet.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Multiplier (x)</th>
                        <th>Winnings ($)</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr key={index}>
                          <td>{Number(entry.multiplier).toFixed(2)}</td>
                          <td>{Number(entry.winnings).toFixed(2)}</td>
                          <td>{entry.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RocketGame;
