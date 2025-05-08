// src/pages/Game.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext';
import BetForm from '../components/BetForm';
import HistoryTable from '../components/HistoryTable';
import Header from '../components/Header';
import '../styles/game.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Please log in to continue');
  const response = await fetch(`${API_URL}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch profile');
  }
  return response.json();
};

const fetchBets = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Please log in to continue');
  const response = await fetch(`${API_URL}/api/bets/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch bets');
  }
  return response.json();
};

const placeBet = async (betData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Please log in to continue');
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
  const navigate = useNavigate();
  const { setBalance } = useBalance();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastResult, setLastResult] = useState(null);

  // Fetch user profile
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    onSuccess: (data) => setBalance(data.balance),
    onError: (err) => {
      setError(err.message);
      if (err.message.includes('log in')) navigate('/login');
    },
  });

  // Fetch bets
  const { data: betsData, isLoading: betsLoading, error: betsError } = useQuery({
    queryKey: ['bets'],
    queryFn: fetchBets,
    onError: (err) => {
      setError(err.message);
      if (err.message.includes('log in')) navigate('/login');
    },
  });

  // Place bet mutation
  const mutation = useMutation({
    mutationFn: placeBet,
    onSuccess: (data) => {
      setBalance(data.balance);
      setLastResult({ ...data.bet, payout: data.bet.payout });
      queryClient.setQueryData(['bets'], (old) => [
        data.bet,
        ...(old || []).slice(0, 9),
      ]);
      queryClient.invalidateQueries(['userProfile']);
    },
    onError: (err) => setError(err.message),
    onSettled: () => setIsLoading(false),
  });

  const getResultColorClass = (result, type) => {
    if (type === 'color') {
      return result.toLowerCase();
    }
    return parseInt(result) % 2 === 0 ? 'green' : 'red';
  };

  const handleBet = async ({ type, value, amount, clientSeed, color, exactMultiplier }) => {
    setIsLoading(true);
    setError('');
    try {
      const period = clientSeed.slice(0, 8);
      if (betsData?.some((bet) => bet.period === period)) {
        throw new Error(`Duplicate bet with period ${period} ignored.`);
      }
      if (amount > userData.balance) {
        throw new Error('Bet amount exceeds available balance');
      }
      await mutation.mutateAsync({ type, value, amount, clientSeed, color, exactMultiplier });
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (userLoading || betsLoading) {
    return <div>Loading...</div>;
  }

  if (userError || betsError) {
    return (
      <div className="game-page container">
        <Header />
        <p className="game-error" role="alert">
          {error || 'Failed to load game data. Please try again.'}
        </p>
      </div>
    );
  }

  if (!userData || !betsData) {
    return (
      <div className="game-page container">
        <Header />
        <p className="game-error" role="alert">
          No data available. Please log in or try again.
        </p>
      </div>
    );
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
      <HistoryTable bets={betsData} />
    </div>
  );
}

export default Game;
