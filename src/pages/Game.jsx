import { useState, useEffect } from 'react';
import BetForm from '../components/BetForm';
import HistoryTable from '../components/HistoryTable';
import Header from '../components/header';
import '../styles/game.css';

function Game() {
  const [balance, setBalance] = useState(() => {
    const savedUser = localStorage.getItem('userProfile');
    return savedUser ? JSON.parse(savedUser).balance : 1000;
  });
  const [bets, setBets] = useState(() => {
    const savedBets = localStorage.getItem('betHistory');
    return savedBets ? JSON.parse(savedBets) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    localStorage.setItem('betHistory', JSON.stringify(bets));
  }, [bets]);

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      localStorage.setItem('userProfile', JSON.stringify({ ...user, balance }));
    }
  }, [balance]);

  const getResultColorClass = (result, type) => {
    if (type === 'color') {
      return result.toLowerCase();
    }
    return result % 2 === 0 ? 'green' : 'red';
  };

  const handleBet = async ({ type, value, amount, clientSeed, color, exactMultiplier }) => {
    try {
      setIsLoading(true);
      setError('');

      const period = clientSeed.slice(0, 8);
      console.log('Processing bet with clientSeed:', clientSeed, 'period:', period);

      if (bets.some((bet) => bet.period === period)) {
        throw new Error(`Duplicate bet with period ${period} ignored.`);
      }

      const resultNumber = Math.floor(Math.random() * 10);
      const resultColor = resultNumber % 2 === 0 ? 'Green' : 'Red';

      let won = false;
      let payout = 0;

      if (type === 'color') {
        won = value === resultColor;
        payout = won ? amount * 2 : -amount;
      } else if (type === 'number') {
        if (value === resultNumber) {
          won = true;
          payout = amount * (exactMultiplier || 10);
        } else if (color === resultColor) {
          won = true;
          payout = amount * 2;
        } else {
          payout = -amount;
        }
      }

      const newBet = {
        period,
        type,
        value,
        amount,
        result: type === 'color' ? resultColor : resultNumber,
        won,
      };

      setBalance((prev) => Math.max(prev + payout, 0));
      setBets((prevBets) => {
        const updatedBets = [newBet, ...prevBets].slice(0, 10);
        return updatedBets;
      });
      setLastResult({ ...newBet, payout });
    } catch (err) {
      setError(err.message);
      console.error('Bet processing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="game-page container">
      <Header balance={balance} />
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
            aria-label="Close result"
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
        balance={balance}
        isDisabled={balance === 0 || isLoading}
      />
      <HistoryTable bets={bets} />
    </div>
  );
}

export default Game;