import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../styles/profile.css';
import { FaUser, FaWallet, FaMoneyCheckAlt, FaCopy } from 'react-icons/fa';

function Profile() {
  const navigate = useNavigate();

  // Initialize user from localStorage or default
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('userProfile');
      return savedUser
        ? JSON.parse(savedUser)
        : { username: 'Player1', email: 'player1@example.com', balance: 1000 };
    } catch (err) {
      console.error('Error parsing userProfile:', err);
      return { username: 'Player1', email: 'player1@example.com', balance: 1000 };
    }
  });

  // Compute betting stats
  const [stats, setStats] = useState(() => {
    try {
      const savedBets = localStorage.getItem('betHistory');
      const bets = savedBets ? JSON.parse(savedBets) : [];
      return {
        totalBets: bets.length,
        wins: bets.filter((bet) => bet.won === true).length,
        losses: bets.filter((bet) => bet.won === false).length,
      };
    } catch (err) {
      console.error('Error parsing betHistory:', err);
      return { totalBets: 0, wins: 0, losses: 0 };
    }
  });

  // Generate referral link
  const [referralLink, setReferralLink] = useState(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${encodeURIComponent(user.username)}`;
  });

  // Sync stats and user with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        // Update user
        const savedUser = localStorage.getItem('userProfile');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          // Update referral link when username changes
          setReferralLink(`${window.location.origin}/signup?ref=${encodeURIComponent(parsedUser.username)}`);
        }
        // Update stats
        const savedBets = localStorage.getItem('betHistory');
        const bets = savedBets ? JSON.parse(savedBets) : [];
        setStats({
          totalBets: bets.length,
          wins: bets.filter((bet) => bet.won === true).length,
          losses: bets.filter((bet) => bet.won === false).length,
        });
      } catch (err) {
        console.error('Error parsing localStorage:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save user to localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(user));
  }, [user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: user.username });
  const [depositData, setDepositData] = useState({ amount: '' });
  const [withdrawData, setWithdrawData] = useState({ amount: '' });
  const [errors, setErrors] = useState({ profile: '', deposit: '', withdraw: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  let notificationTimeout;

  // Clear notification timeout
  const setNotificationWithTimeout = (notification) => {
    clearTimeout(notificationTimeout);
    setNotification(notification);
    notificationTimeout = setTimeout(() => setNotification(null), 3000);
  };

  // Handle copy referral link
  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setNotificationWithTimeout({ type: 'success', message: 'Referral link copied to clipboard!' });
    } catch (err) {
      console.error('Failed to copy referral link:', err);
      setNotificationWithTimeout({ type: 'error', message: 'Failed to copy referral link' });
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setErrors((prev) => ({ ...prev, profile: 'Username cannot be empty' }));
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser((prev) => ({ ...prev, username: formData.username }));
      setReferralLink(`${window.location.origin}/signup?ref=${encodeURIComponent(formData.username)}`);
      setIsModalOpen(false);
      setErrors((prev) => ({ ...prev, profile: '' }));
      setNotificationWithTimeout({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setErrors((prev) => ({ ...prev, profile: 'Failed to update profile' }));
      setNotificationWithTimeout({ type: 'error', message: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deposit funds
  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors((prev) => ({ ...prev, deposit: 'Please enter a valid deposit amount greater than 0' }));
      return;
    }
    if (amount < 3) {
      setErrors((prev) => ({ ...prev, deposit: 'Minimum deposit amount is $3' }));
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser((prev) => ({ ...prev, balance: prev.balance + amount }));
      setIsDepositModalOpen(false);
      setDepositData({ amount: '' });
      setErrors((prev) => ({ ...prev, deposit: '' }));
      setNotificationWithTimeout({ type: 'success', message: `Deposited $${amount.toFixed(2)} successfully!` });
    } catch (err) {
      setErrors((prev) => ({ ...prev, deposit: 'Failed to deposit funds' }));
      setNotificationWithTimeout({ type: 'error', message: 'Failed to deposit funds' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle withdraw funds
  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please enter a valid withdrawal amount greater than 0' }));
      return;
    }
    if (amount > user.balance) {
      setErrors((prev) => ({ ...prev, withdraw: 'Insufficient balance for withdrawal' }));
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser((prev) => ({ ...prev, balance: prev.balance - amount }));
      setIsWithdrawModalOpen(false);
      setWithdrawData({ amount: '' });
      setErrors((prev) => ({ ...prev, withdraw: '' }));
      setNotificationWithTimeout({ type: 'success', message: `Withdrew $${amount.toFixed(2)} successfully!` });
    } catch (err) {
      setErrors((prev) => ({ ...prev, withdraw: 'Failed to withdraw funds' }));
      setNotificationWithTimeout({ type: 'error', message: 'Failed to withdraw funds' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('betHistory');
      navigate('/login');
    }
  };

  return (
    <div className="profile-page container">
      <Header balance={user.balance} />
      {isLoading && (
        <div className="loading-spinner" aria-live="polite">
          Processing...
        </div>
      )}
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
          <p><strong>Balance:</strong> ${user.balance.toFixed(2)}</p>
          <div className="profile-button-group">
            <button
              onClick={() => setIsModalOpen(true)}
              className="update-profile-button"
              aria-label="Update profile"
              disabled={isLoading}
            >
              <FaUser />
            </button>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="deposit-button"
              aria-label="Deposit funds"
              disabled={isLoading}
            >
              <FaWallet />
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="withdraw-button"
              aria-label="Withdraw funds"
              disabled={isLoading || user.balance === 0}
            >
              <FaMoneyCheckAlt />
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
              disabled={isLoading}
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
        disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              {errors.profile && <p className="modal-error">{errors.profile}</p>}
              <button type="submit" className="modal-submit" disabled={isLoading}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Funds Modal */}
      {isDepositModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsDepositModalOpen(false);
                setErrors((prev) => ({ ...prev, deposit: '' }));
              }}
              className="modal-close"
              aria-label="Close modal"
            >
              ×
            </button>
            <h2>Deposit Funds</h2>
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label htmlFor="deposit-amount" className="modal-label">
                  Deposit Amount ($)
                </label>
                <input
                  id="deposit-amount"
                  type="number"
                  step="0.01"
                  min="3"
                  value={depositData.amount}
                  onChange={(e) =>
                    setDepositData({ ...depositData, amount: e.target.value })
                  }
                  className="modal-input"
                  placeholder="Enter deposit amount (min $3)"
                  disabled={isLoading}
                />
              </div>
              {errors.deposit && <p className="modal-error">{errors.deposit}</p>}
              <button type="submit" className="modal-submit" disabled={isLoading}>
                Deposit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {isWithdrawModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsWithdrawModalOpen(false);
                setIsWithdrawModalOpen(false);
                setErrors((prev) => ({ ...prev, withdraw: '' }));
              }}
              className="modal-close"
              aria-label="Close modal"
            >
              ×
            </button>
            <h2>Withdraw Funds</h2>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label htmlFor="withdraw-amount" className="modal-label">
                  Withdrawal Amount ($)
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
                  disabled={isLoading}
                />
              </div>
              {errors.withdraw && <p className="modal-error">{errors.withdraw}</p>}
              <button type="submit" className="modal-submit" disabled={isLoading}>
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