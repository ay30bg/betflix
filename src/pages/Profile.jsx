// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBalance } from '../context/BalanceContext';
import Header from '../components/header';
import '../styles/profile.css';
import { FaUser, FaBitcoin, FaCopy } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';

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

const fetchStats = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Please log in to continue');
  const response = await fetch(`${API_URL}/api/bets/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch stats');
  }
  return response.json();
};

const fetchReferralLink = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Please log in to continue');
  const response = await fetch(`${API_URL}/api/referral/link`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch referral link');
  }
  return response.json();
};

const updateProfile = async ({ username }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update profile');
  }
  return response.json();
};

const initiateDeposit = async ({ amount, cryptoCurrency }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/transactions/crypto-deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount, cryptoCurrency }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to initiate crypto deposit');
  }
  return response.json();
};

const initiateWithdrawal = async ({ amount, cryptoCurrency, walletAddress }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/transactions/crypto-withdrawal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount, cryptoCurrency, walletAddress }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to initiate crypto withdrawal');
  }
  return response.json();
};

function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { balance, setBalance } = useBalance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [depositResult, setDepositResult] = useState(null);
  const [formData, setFormData] = useState({ username: '' });
  const [depositData, setDepositData] = useState({ amount: '', cryptoCurrency: 'BTC' });
  const [withdrawData, setWithdrawData] = useState({ amount: '', cryptoCurrency: 'BTC', walletAddress: '' });
  const [errors, setErrors] = useState({ profile: '', deposit: '', withdraw: '' });
  const [notification, setNotification] = useState(null);

  // Fetch user profile
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    onSuccess: (data) => {
      setBalance(data.balance);
      setFormData({ username: data.username });
    },
    onError: (err) => {
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) navigate('/login');
    },
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    onError: (err) => {
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) navigate('/login');
    },
  });

  // Fetch referral link
  const { data: referralData, isLoading: referralLoading, error: referralError } = useQuery({
    queryKey: ['referralLink'],
    queryFn: fetchReferralLink,
    onError: (err) => {
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) navigate('/login');
    },
  });

  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (referralData?.referralLink) {
      setReferralLink(referralData.referralLink);
    }
  }, [referralData]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data.user);
      setIsModalOpen(false);
      setErrors((prev) => ({ ...prev, profile: '' }));
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
    },
    onError: (err) => {
      setErrors((prev) => ({ ...prev, profile: err.message }));
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) navigate('/login');
    },
  });

  const depositMutation = useMutation({
    mutationFn: initiateDeposit,
    onSuccess: (data) => {
      setDepositResult(data);
      setErrors((prev) => ({ ...prev, deposit: '' }));
    },
    onError: (err) => {
      setErrors((prev) => ({ ...prev, deposit: err.message }));
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) navigate('/login');
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: initiateWithdrawal,
    onSuccess: (data) => {
      setBalance(data.balance);
      queryClient.setQueryData(['userProfile'], (old) => ({ ...old, balance: data.balance }));
      setIsWithdrawModalOpen(false);
      setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '' });
      setErrors((prev) => ({ ...prev, withdraw: '' }));
      setNotification({ type: 'success', message: data.message });
    },
    onError: (err) => {
      setErrors((prev) => ({ ...prev, withdraw: err.message }));
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) navigate('/login');
    },
  });

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setNotification({ type: 'success', message: 'Referral link copied to clipboard!' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to copy referral link' });
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setErrors((prev) => ({ ...prev, profile: 'Username cannot be empty' }));
      return;
    }
    updateProfileMutation.mutate({ username: formData.username });
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    const amount = parseFloat(depositData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors((prev) => ({ ...prev, deposit: 'Please enter a valid deposit amount greater than 0' }));
      return;
    }
    depositMutation.mutate({ amount, cryptoCurrency: depositData.cryptoCurrency });
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please enter a valid withdrawal amount greater than 0' }));
      return;
    }
    if (amount > balance) {
      setErrors((prev) => ({ ...prev, withdraw: 'Insufficient balance for withdrawal' }));
      return;
    }
    if (!withdrawData.walletAddress || !/^[a-zA-Z0-9]{26,42}$/.test(withdrawData.walletAddress)) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please enter a valid wallet address' }));
      return;
    }
    withdrawMutation.mutate({ amount, cryptoCurrency: withdrawData.cryptoCurrency, walletAddress: withdrawData.walletAddress });
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        localStorage.removeItem('token');
        navigate('/login');
      } catch (err) {
        setNotification({ type: 'error', message: 'Failed to log out' });
      }
    }
  };

  if (userLoading || statsLoading || referralLoading) {
    return (
      <div className="profile-page container">
        <Header />
        <div className="loading-spinner" aria-live="polite">
          Loading...
        </div>
      </div>
    );
  }

  if (userError || statsError || referralError) {
    return (
      <div className="profile-page container">
        <Header />
        <p className="profile-error" role="alert">
          {notification?.message || 'Failed to load profile data. Please try again.'}
        </p>
      </div>
    );
  }

  if (!user || !stats || !referralData) {
    return (
      <div className="profile-page container">
        <Header />
        <p className="profile-error" role="alert">
          No data available. Please log in or try again.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-page container">
      <Header />
      {notification && (
        <div className={`result ${notification.type}`} role="alert">
          {notification.message}
        </div>
      )}
      <h1>Profile</h1>
      <div className="profile-container">
        <div className="profile-info">
          <h2>User Information</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>
          <div className="profile-button-group">
            <button
              onClick={() => setIsModalOpen(true)}
              className="update-profile-button"
              aria-label="Update profile"
              disabled={updateProfileMutation.isLoading}
            >
              <FaUser />
            </button>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="crypto-deposit-button"
              aria-label="Deposit crypto"
              disabled={depositMutation.isLoading}
            >
              <FaBitcoin />
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="crypto-withdraw-button"
              aria-label="Withdraw crypto"
              disabled={withdrawMutation.isLoading || balance === 0}
            >
              <FaBitcoin />
            </button>
          </div>
        </div>
        <div className="referral-section">
          <h2>Referral Link</h2>
          <p>Share your referral link to invite friends!</p>
          <div className="referral-link-container">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="referral-input"
              aria-label="Referral link"
            />
            <button
              onClick={handleCopyReferralLink}
              className="copy-referral-button"
              aria-label="Copy referral link"
              disabled={false}
            >
              Copy Link <FaCopy style={{ marginLeft: '0.5rem' }} />
            </button>
          </div>
        </div>
        <div className="betting-stats">
          <h2>Betting Statistics</h2>
          <p><strong>Total Bets:</strong> {stats.totalBets}</p>
          <p><strong>Wins:</strong> {stats.wins}</p>
          <p><strong>Losses:</strong> {stats.losses}</p>
          <p>
            <strong>Win Rate:</strong>{' '}
            {stats.totalBets > 0
              ? ((stats.wins / stats.totalBets) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="logout-button"
        aria-label="Log out"
        disabled={false}
      >
        Log Out
      </button>

      {/* Update Profile Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setErrors((prev) => ({ ...prev, profile: '' }));
              }}
              className="modal-close"
              aria-label="Close modal"
            >
              ×
            </button>
            <h2>Update Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label htmlFor="username" className="modal-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="modal-input"
                  placeholder="Enter new username"
                  disabled={updateProfileMutation.isLoading}
                />
              </div>
              {errors.profile && <p className="modal-error">{errors.profile}</p>}
              <button
                type="submit"
                className="modal-submit"
                disabled={updateProfileMutation.isLoading}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Crypto Modal */}
      {isDepositModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsDepositModalOpen(false);
                setErrors((prev) => ({ ...prev, deposit: '' }));
                setDepositData({ amount: '', cryptoCurrency: 'BTC' });
                setDepositResult(null);
              }}
              className="modal-close"
              aria-label="Close modal"
            >
              ×
            </button>
            <h2>Deposit Crypto</h2>
            {!depositResult ? (
              <form onSubmit={handleDeposit}>
                <div className="form-group">
                  <label htmlFor="deposit-amount" className="modal-label">
                    Amount (USD)
                  </label>
                  <input
                    id="deposit-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={depositData.amount}
                    onChange={(e) =>
                      setDepositData({ ...depositData, amount: e.target.value })
                    }
                    className="modal-input"
                    placeholder="Enter amount in USD"
                    disabled={depositMutation.isLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="crypto-currency" className="modal-label">
                    Cryptocurrency
                  </label>
                  <select
                    id="crypto-currency"
                    name="cryptoCurrency"
                    value={depositData.cryptoCurrency}
                    onChange={(e) =>
                      setDepositData({ ...depositData, cryptoCurrency: e.target.value })
                    }
                    className="modal-input"
                    disabled={depositMutation.isLoading}
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                  </select>
                </div>
                {errors.deposit && <p className="modal-error">{errors.deposit}</p>}
                <button
                  type="submit"
                  className="modal-submit"
                  disabled={depositMutation.isLoading}
                >
                  Get Deposit Address
                </button>
              </form>
            ) : (
              <div className="deposit-result">
                <p>
                  Send {depositResult.payAmount} {depositData.cryptoCurrency} to:
                </p>
                <p className="deposit-address">{depositResult.payAddress}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(depositResult.payAddress)}
                  className="copy-button"
                >
                  Copy Address
                </button>
                <div className="qr-code">
                  <QRCodeCanvas
                    value={`${depositData.cryptoCurrency.toLowerCase()}:${depositResult.payAddress}?amount=${depositResult.payAmount}`}
                  />
                </div>
                <button
                  onClick={() => {
                    setDepositResult(null);
                    setDepositData({ amount: '', cryptoCurrency: 'BTC' });
                  }}
                  className="modal-submit"
                >
                  New Deposit
                </button>
                <p>
                  Or use the payment link:{' '}
                  <a
                    href={depositResult.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pay Now
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Crypto Modal */}
      {isWithdrawModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsWithdrawModalOpen(false);
                setErrors((prev) => ({ ...prev, withdraw: '' }));
                setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '' });
              }}
              className="modal-close"
              aria-label="Close modal"
            >
              ×
            </button>
            <h2>Withdraw Crypto</h2>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label htmlFor="withdraw-amount" className="modal-label">
                  Amount (USD)
                </label>
                <input
                  id="withdraw-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={withdrawData.amount}
                  onChange={(e) =>
                    setWithdrawData({ ...withdrawData, amount: e.target.value })
                  }
                  className="modal-input"
                  placeholder="Enter withdrawal amount"
                  disabled={withdrawMutation.isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="crypto-currency" className="modal-label">
                  Cryptocurrency
                </label>
                <select
                  id="crypto-currency"
                  name="cryptoCurrency"
                  value={withdrawData.cryptoCurrency}
                  onChange={(e) =>
                    setWithdrawData({ ...withdrawData, cryptoCurrency: e.target.value })
                  }
                  className="modal-input"
                  disabled={withdrawMutation.isLoading}
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="wallet-address" className="modal-label">
                  Wallet Address
                </label>
                <input
                  id="wallet-address"
                  type="text"
                  value={withdrawData.walletAddress}
                  onChange={(e) =>
                    setWithdrawData({ ...withdrawData, walletAddress: e.target.value })
                  }
                  className="modal-input"
                  placeholder="Enter your wallet address"
                  disabled={withdrawMutation.isLoading}
                />
              </div>
              {errors.withdraw && <p className="modal-error">{errors.withdraw}</p>}
              <button
                type="submit"
                className="modal-submit"
                disabled={withdrawMutation.isLoading}
              >
                Withdraw
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
