import React, { useState, useEffect, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext'; // Assuming a similar context for balance
import BetForm from '../components/BetForm'; // Reused, but modified for even/odd
import HistoryTable from '../components/HistoryTable'; // Reused, but adapted for even/odd data
import Header from '../components/Header'; // Reused
import { jwtDecode } from 'jwt-decode';
import '../styles/game.css'; // Reusing the same CSS with minor adjustments

// ErrorBoundary remains the same
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

const API_URL = process.env.REACT_APP_API_URL || 'https://evenodd-backend.vercel.app';

// Token expiration check (same as original)
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

// API functions adapted for even/odd game
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
    throw new Error(errorData.error || `Bet result fetch failed: ${ლ

System: Let's create a simplified version of the `EvenOddGame` component, focusing on the core functionality and UI, while reusing and adapting the provided CSS and components. I'll assume the backend API endpoints are similar but tailored for an even/odd game (e.g., betting on "even" or "odd" instead of colors or numbers). The `BetForm` and `HistoryTable` components will be modified to accommodate even/odd betting options. Since the full code for these components wasn't provided, I'll create simplified versions that align with the game's requirements.

---

### EvenOddGame Component

```jsx
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext'; // Assuming a similar context for balance
import { jwtDecode } from 'jwt-decode';
import '../styles/game.css'; // Reusing the provided CSS

// ErrorBoundary (unchanged)
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

// API URL (replace with your actual backend)
const API_URL = process.env.REACT_APP_API_URL || 'https://evenodd-backend.vercel.app';

// Token expiration check (unchanged)
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

// API functions (simplified and adapted for even/odd)
const fetchBets = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(response.status === 401 ? 'Authentication required' : 'Failed to fetch bets');
  return (await response.json()).filter((bet) => bet && bet.status !== 'invalid');
};

const fetchPendingBets = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(response.status === 401 ? 'Authentication required' : 'Failed to fetch pending bets');
  return response.json();
};

const fetchCurrentRound = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/current`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(response.status === 401 ? 'Authentication required' : 'Failed to fetch current round');
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
  if (!response.ok) throw new Error('Bet placement failed');
  return response.json();
};

const fetchBetResult = async (period) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/result/${period}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch bet result');
  return response.json();
};

const fetchRecentRounds = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/bets/rounds/recent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch recent rounds');
  return response.json();
};

const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  const response = await fetch(`${API_URL}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

// Simplified BetForm component
const BetForm = ({ onSubmit, isLoading, balance, isDisabled, roundData, timeLeft }) => {
  const [amount, setAmount] = useState('');
  const [choice, setChoice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!choice || !amount || amount <= 0) {
      onSubmit({ error: 'Please select even/odd and enter a valid amount' });
      return;
    }
    onSubmit({ choice, amount: parseFloat(amount), period: roundData?.period });
  };

  return (
    <div className="bet-form-container">
      <form className="bet-form" onSubmit={handleSubmit}>
        <div className="color-button-group">
          <button
            type="button"
            className={`color-button even ${choice === 'even' ? 'selected' : ''}`}
            onClick={() => setChoice('even')}
            disabled={isDisabled}
          >
            Even
          </button>
          <button
            type="button"
            className={`color-button odd ${choice === 'odd' ? 'selected' : ''}`}
            onClick={() => setChoice('odd')}
            disabled={isDisabled}
          >
            Odd
          </button>
        </div>
        <div className="form-group">
          <label className="modal-label">Bet Amount</label>
          <input
            type="number"
            className="modal-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            disabled={isDisabled}
          />
        </div>
        <button type="submit" className="modal-submit" disabled={isLoading || isDisabled}>
          {isLoading ? 'Placing Bet...' : 'Place Bet'}
        </button>
      </form>
    </div>
  );
};

// Simplified HistoryTable component
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
              <td>{bet.period}</td>
              <td>{bet.choice}</td>
              <td>₦{bet.amount.toFixed(2)}</td>
              <td>{bet.result || 'N/A'}</td>
              <td className={bet.status === 'won' ? 'won' : bet.status === 'lost' ? 'lost' : 'pending'}>
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
  const { balance, setBalance, isLoading: balanceLoading } = useBalance();
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pendingBet, setPendingBet] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleAuthError = useCallback(() => {
    setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
    localStorage.removeItem('token');
    queryClient.clear();
    setBalance(0);
    setPendingBet(null);
    setLastResult(null);
    setTimeout(() => navigate('/login'), 3000);
  }, [navigate, queryClient, setBalance]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) handleAuthError();

    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken && isTokenExpired(currentToken)) handleAuthError();
    }, 60000);
    return () => clearInterval(interval);
  }, [handleAuthError]);

  useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    onSuccess: (data) => {
      if (typeof data.balance === 'number') setBalance(data.balance);
    },
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication')) handleAuthError();
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  const { data: betsData, isLoading: betsLoading } = useQuery({
    queryKey: ['bets'],
    queryFn: fetchBets,
    onSuccess: (data) => {
      data.forEach((bet) => {
        if (bet.status === 'finalized' && typeof bet.newBalance === 'number') {
          setBalance(bet.newBalance);
          setNotification({
            type: bet.won ? 'success' : 'info',
            message: bet.won
              ? `You won ₦${bet.payout.toFixed(2)} for round ${bet.period}!`
              : `Bet lost for round ${bet.period}.`,
          });
        }
      });
    },
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication')) handleAuthError();
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  const { data: pendingBetsData, isLoading: pendingBetsLoading } = useQuery({
    queryKey: ['pendingBets'],
    queryFn: fetchPendingBets,
    refetchInterval: 5000,
    onSuccess: (data) => {
      const activeBet = data.find((bet) => bet.status === 'pending' && bet.roundStatus === 'active');
      if (activeBet && !pendingBet) {
        setPendingBet(activeBet);
        setNotification({ type: 'info', message: `Restored pending bet for round ${activeBet.period}` });
      }
    },
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication')) handleAuthError();
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  const { data: roundData, isLoading: roundLoading } = useQuery({
    queryKey: ['currentRound'],
    queryFn: fetchCurrentRound,
    refetchInterval: 6000,
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication')) handleAuthError();
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  const { data: recentRoundsData, isLoading: roundsLoading } = useQuery({
    queryKey: ['recentRounds'],
    queryFn: fetchRecentRounds,
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication')) handleAuthError();
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
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

  const fetchResult = useCallback(
    async (period) => {
      try {
        const data = await fetchBetResult(period);
        if (data.bet.status === 'pending') return;
        setLastResult(data.bet);
        if (typeof data.balance === 'number') {
          setBalance(data.balance);
          setNotification({
            type: data.bet.won ? 'success' : 'info',
            message: data.bet.won
              ? `You won ₦${data.bet.payout.toFixed(2)}!`
              : 'Bet lost.',
          });
        }
        queryClient.invalidateQueries(['bets']);
        setPendingBet(null);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(''), 5000);
        if (err.message.includes('Authentication')) handleAuthError();
      }
    },
    [queryClient, setBalance, handleAuthError]
  );

  const debouncedFetchResult = useCallback(
    (period) => {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fetchResult(period), 1000);
      };
    },
    [fetchResult]
  );

  const mutation = useMutation({
    mutationFn: placeBet,
    onSuccess: (data) => {
      setBalance(data.balance);
      setPendingBet(data.bet);
      setNotification({ type: 'success', message: 'Bet placed successfully!' });
      queryClient.invalidateQueries(['bets']);
      queryClient.invalidateQueries(['pendingBets']);
    },
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
      if (err.message.includes('Authentication')) handleAuthError();
    },
  });

  const handleBet = async (betData) => {
    if (betData.error) {
      setError(betData.error);
      setTimeout(() => setError(''), 5000);
      return;
    }
    if (betData.amount > balance) {
      setError('Insufficient balance');
      setTimeout(() => setError(''), 5000);
      return;
    }
    mutation.mutate(betData);
  };

  if (balanceLoading || betsLoading || roundLoading || roundsLoading || pendingBetsLoading) {
    return (
      <ErrorBoundary>
        <div className="game-page container">
          <Header />
          <div className="loading-spinner">Loading...</div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="game-page">
        <Header />
        {notification && (
          <div className={`result ${notification.type}`} role="alert">
            {notification.message}
          </div>
        )}
        {error && (
          <p className="game-error" role="alert">
            {error}
          </p>
        )}
        <div className="round-info">
          <p>Current Round: {roundData?.period || 'Loading...'}</p>
          <p>Time Left: {timeLeft} seconds</p>
          <button
            className="history-button"
            onClick={() => setIsHistoryModalOpen(true)}
            aria-label="View recent rounds history"
          >
            View History
          </button>
        </div>
        {mutation.isLoading && <div className="loading-spinner">Processing Bet...</div>}
        {lastResult && (
          <div
            className={`result ${lastResult.won ? 'won' : 'lost'}`}
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
              {lastResult.won ? '🎉 You Won!' : '😔 You Lost'}
            </div>
            <div className="result-detail">Result: {lastResult.result || 'N/A'}</div>
            <div className="result-payout">
              {lastResult.payout === 0 ? 'No Payout' : `₦${Math.abs(lastResult.payout).toFixed(2)}`}
            </div>
          </div>
        )}
        {pendingBet && !lastResult && !mutation.isLoading && (
          <div className="no-result" role="alert">
            <p>Bet placed on {pendingBet.period}.</p>
            <p>Waiting for results... ⌛</p>
          </div>
        )}
        {!pendingBet && !lastResult && !mutation.isLoading && (
          <p className="no-result">Place a bet to see the result.</p>
        )}
        {isHistoryModalOpen && (
          <div className="modal-overlay" role="dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Recent Rounds</h2>
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
        />
        <HistoryTable bets={betsData || []} />
      </div>
    </ErrorBoundary>
  );
}

export default memo(EvenOddGame);
