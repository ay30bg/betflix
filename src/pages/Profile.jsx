// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/header';
// import '../styles/profile.css';
// import { FaUser, FaWallet, FaMoneyCheckAlt, FaCopy } from 'react-icons/fa';

// function Profile() {
//   const navigate = useNavigate();
//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   // State for user data, stats, and referral link
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState({ totalBets: 0, wins: 0, losses: 0 });
//   const [referralLink, setReferralLink] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
//   const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ username: '' });
//   const [depositData, setDepositData] = useState({ amount: '' });
//   const [withdrawData, setWithdrawData] = useState({ amount: '' });
//   const [errors, setErrors] = useState({ profile: '', deposit: '', withdraw: '' });
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState(null);
//   let notificationTimeout;

//   // Clear notification timeout
//   const setNotificationWithTimeout = (notification) => {
//     clearTimeout(notificationTimeout);
//     setNotification(notification);
//     notificationTimeout = setTimeout(() => setNotification(null), 3000);
//   };

//   // Fetch initial data on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       setIsLoading(true);
//       try {
//         const [userResponse, statsResponse, referralResponse] = await Promise.all([
//           fetch(`${API_URL}/api/user/profile`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${API_URL}/api/bets/stats`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${API_URL}/api/referral/link`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         const userData = await userResponse.json();
//         const statsData = await statsResponse.json();
//         const referralData = await referralResponse.json();

//         if (!userResponse.ok) throw new Error(userData.error || 'Failed to fetch profile');
//         if (!statsResponse.ok) throw new Error(statsData.error || 'Failed to fetch stats');
//         if (!referralResponse.ok) throw new Error(referralData.error || 'Failed to fetch referral link');

//         setUser(userData);
//         setFormData({ username: userData.username });
//         setStats(statsData);
//         setReferralLink(referralData.referralLink);
//       } catch (err) {
//         setNotificationWithTimeout({ type: 'error', message: err.message });
//         if (err.message.includes('Invalid or expired token')) {
//           localStorage.removeItem('token');
//           navigate('/login');
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   // Handle copy referral link
//   const handleCopyReferralLink = async () => {
//     try {
//       await navigator.clipboard.writeText(referralLink);
//       setNotificationWithTimeout({ type: 'success', message: 'Referral link copied to clipboard!' });
//     } catch (err) {
//       console.error('Failed to copy referral link:', err);
//       setNotificationWithTimeout({ type: 'error', message: 'Failed to copy referral link' });
//     }
//   };

//   // Handle profile update
//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     if (!formData.username.trim()) {
//       setErrors((prev) => ({ ...prev, profile: 'Username cannot be empty' }));
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/user/profile`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ username: formData.username }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update profile');
//       }

//       setUser(data.user);
//       setIsModalOpen(false);
//       setErrors((prev) => ({ ...prev, profile: '' }));
//       setNotificationWithTimeout({ type: 'success', message: 'Profile updated successfully!' });
//     } catch (err) {
//       setErrors((prev) => ({ ...prev, profile: err.message }));
//       setNotificationWithTimeout({ type: 'error', message: err.message });
//       if (err.message.includes('Invalid or expired token')) {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle deposit funds
//   const handleDeposit = async (e) => {
//     e.preventDefault();
//     const amount = parseFloat(depositData.amount);
//     if (isNaN(amount) || amount <= 0) {
//       setErrors((prev) => ({ ...prev, deposit: 'Please enter a valid deposit amount greater than 0' }));
//       return;
//     }
//     if (amount < 3) {
//       setErrors((prev) => ({ ...prev, deposit: 'Minimum deposit amount is $3' }));
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/transactions/deposit`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ amount }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to deposit funds');
//       }

//       setUser((prev) => ({ ...prev, balance: data.balance }));
//       setIsDepositModalOpen(false);
//       setDepositData({ amount: '' });
//       setErrors((prev) => ({ ...prev, deposit: '' }));
//       setNotificationWithTimeout({ type: 'success', message: data.message });
//     } catch (err) {
//       setErrors((prev) => ({ ...prev, deposit: err.message }));
//       setNotificationWithTimeout({ type: 'error', message: err.message });
//       if (err.message.includes('Invalid or expired token')) {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle withdraw funds
//   const handleWithdraw = async (e) => {
//     e.preventDefault();
//     const amount = parseFloat(withdrawData.amount);
//     if (isNaN(amount) || amount <= 0) {
//       setErrors((prev) => ({ ...prev, withdraw: 'Please enter a valid withdrawal amount greater than 0' }));
//       return;
//     }
//     if (amount > user.balance) {
//       setErrors((prev) => ({ ...prev, withdraw: 'Insufficient balance for withdrawal' }));
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/transactions/withdraw`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ amount }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to withdraw funds');
//       }

//       setUser((prev) => ({ ...prev, balance: data.balance }));
//       setIsWithdrawModalOpen(false);
//       setWithdrawData({ amount: '' });
//       setErrors((prev) => ({ ...prev, withdraw: '' }));
//       setNotificationWithTimeout({ type: 'success', message: data.message });
//     } catch (err) {
//       setErrors((prev) => ({ ...prev, withdraw: err.message }));
//       setNotificationWithTimeout({ type: 'error', message: err.message });
//       if (err.message.includes('Invalid or expired token')) {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle logout
//   const handleLogout = async () => {
//     if (window.confirm('Are you sure you want to log out?')) {
//       try {
//         await fetch(`${API_URL}/api/auth/logout`, {
//           method: 'POST',
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         localStorage.removeItem('token');
//         navigate('/login');
//       } catch (err) {
//         console.error('Logout failed:', err);
//         setNotificationWithTimeout({ type: 'error', message: 'Failed to log out' });
//       }
//     }
//   };

//   // Render loading state if user data is not yet fetched
//   if (!user) {
//     return (
//       <div className="profile-page container">
//         <div className="loading-spinner" aria-live="polite">
//           Loading...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page container">
//       <Header balance={user.balance} />
//       {isLoading && (
//         <div className="loading-spinner" aria-live="polite">
//           Processing...
//         </div>
//       )}
//       {notification && (
//         <div className={`result ${notification.type}`} role="alert">
//           {notification.message}
//         </div>
//       )}
//       <h1>Profile</h1>
//       <div className="profile-container">
//         <div className="profile-info">
//           <h2>User Information</h2>
//           <p><strong>Username:</strong> {user.username}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Balance:</strong> ${user.balance.toFixed(2)}</p>
//           <div className="profile-button-group">
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="update-profile-button"
//               aria-label="Update profile"
//               disabled={isLoading}
//             >
//               <FaUser />
//             </button>
//             <button
//               onClick={() => setIsDepositModalOpen(true)}
//               className="deposit-button"
//               aria-label="Deposit funds"
//               disabled={isLoading}
//             >
//               <FaWallet />
//             </button>
//             <button
//               onClick={() => setIsWithdrawModalOpen(true)}
//               className="withdraw-button"
//               aria-label="Withdraw funds"
//               disabled={isLoading || user.balance === 0}
//             >
//               <FaMoneyCheckAlt />
//             </button>
//           </div>
//         </div>
//         <div className="referral-section">
//           <h2>Referral Link</h2>
//           <p>Share your referral link to invite friends!</p>
//           <div className="referral-link-container">
//             <input
//               type="text"
//               value={referralLink}
//               readOnly
//               className="referral-input"
//               aria-label="Referral link"
//             />
//             <button
//               onClick={handleCopyReferralLink}
//               className="copy-referral-button"
//               aria-label="Copy referral link"
//               disabled={isLoading}
//             >
//               Copy Link <FaCopy style={{ marginLeft: '0.5rem' }} />
//             </button>
//           </div>
//         </div>
//         <div className="betting-stats">
//           <h2>Betting Statistics</h2>
//           <p><strong>Total Bets:</strong> {stats.totalBets}</p>
//           <p><strong>Wins:</strong> {stats.wins}</p>
//           <p><strong>Losses:</strong> {stats.losses}</p>
//           <p>
//             <strong>Win Rate:</strong>{' '}
//             {stats.totalBets > 0
//               ? ((stats.wins / stats.totalBets) * 100).toFixed(1)
//               : 0}
//             %
//           </p>
//         </div>
//       </div>
//       <button
//         onClick={handleLogout}
//         className="logout-button"
//         aria-label="Log out"
//         disabled={isLoading}
//       >
//         Log Out
//       </button>

//       {/* Update Profile Modal */}
//       {isModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button
//               onClick={() => {
//                 setIsModalOpen(false);
//                 setErrors((prev) => ({ ...prev, profile: '' }));
//               }}
//               className="modal-close"
//               aria-label="Close modal"
//             >
//               ×
//             </button>
//             <h2>Update Profile</h2>
//             <form onSubmit={handleUpdateProfile}>
//               <div className="form-group">
//                 <label htmlFor="username" className="modal-label">
//                   Username
//                 </label>
//                 <input
//                   id="username"
//                   type="text"
//                   value={formData.username}
//                   onChange={(e) =>
//                     setFormData({ ...formData, username: e.target.value })
//                   }
//                   className="modal-input"
//                   placeholder="Enter new username"
//                   disabled={isLoading}
//                 />
//               </div>
//               {errors.profile && <p className="modal-error">{errors.profile}</p>}
//               <button type="submit" className="modal-submit" disabled={isLoading}>
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Deposit Funds Modal */}
//       {isDepositModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button
//               onClick={() => {
//                 setIsDepositModalOpen(false);
//                 setErrors((prev) => ({ ...prev, deposit: '' }));
//               }}
//               className="modal-close"
//               aria-label="Close modal"
//             >
//               ×
//             </button>
//             <h2>Deposit Funds</h2>
//             <form onSubmit={handleDeposit}>
//               <div className="form-group">
//                 <label htmlFor="deposit-amount" className="modal-label">
//                   Deposit Amount ($)
//                 </label>
//                 <input
//                   id="deposit-amount"
//                   type="number"
//                   step="0.01"
//                   min="3"
//                   value={depositData.amount}
//                   onChange={(e) =>
//                     setDepositData({ ...depositData, amount: e.target.value })
//                   }
//                   className="modal-input"
//                   placeholder="Enter deposit amount (min $3)"
//                   disabled={isLoading}
//                 />
//               </div>
//               {errors.deposit && <p className="modal-error">{errors.deposit}</p>}
//               <button type="submit" className="modal-submit" disabled={isLoading}>
//                 Deposit
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Withdraw Funds Modal */}
//       {isWithdrawModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button
//               onClick={() => {
//                 setIsWithdrawModalOpen(false);
//                 setErrors((prev) => ({ ...prev, withdraw: '' }));
//               }}
//               className="modal-close"
//               aria-label="Close modal"
//             >
//               ×
//             </button>
//             <h2>Withdraw Funds</h2>
//             <form onSubmit={handleWithdraw}>
//               <div className="form-group">
//                 <label htmlFor="withdraw-amount" className="modal-label">
//                   Withdrawal Amount ($)
//                 </label>
//                 <input
//                   id="withdraw-amount"
//                   type="number"
//                   step="0.01"
//                   min="0.01"
//                   value={withdrawData.amount}
//                   onChange={(e) =>
//                     setWithdrawData({ ...withdrawData, amount: e.target.value })
//                   }
//                   className="modal-input"
//                   placeholder="Enter withdrawal amount"
//                   disabled={isLoading}
//                 />
//               </div>
//               {errors.withdraw && <p className="modal-error">{errors.withdraw}</p>}
//               <button type="submit" className="modal-submit" disabled={isLoading}>
//                 Withdraw
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Profile;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../styles/profile.css';
import { FaUser, FaBitcoin, FaCopy } from 'react-icons/fa';
import QRCode from 'qrcode.react';

function Profile() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalBets: 0, wins: 0, losses: 0 });
  const [referralLink, setReferralLink] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [depositResult, setDepositResult] = useState(null);
  const [formData, setFormData] = useState({ username: '' });
  const [depositData, setDepositData] = useState({ amount: '', cryptoCurrency: 'BTC' });
  const [withdrawData, setWithdrawData] = useState({ amount: '', cryptoCurrency: 'BTC', walletAddress: '' });
  const [errors, setErrors] = useState({ profile: '', deposit: '', withdraw: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  let notificationTimeout;

  const setNotificationWithTimeout = (notification) => {
    clearTimeout(notificationTimeout);
    setNotification(notification);
    notificationTimeout = setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        const [userResponse, statsResponse, referralResponse] = await Promise.all([
          fetch(`${API_URL}/api/user/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/bets/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/referral/link`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const userData = await userResponse.json();
        const statsData = await statsResponse.json();
        const referralData = await referralResponse.json();

        if (!userResponse.ok) throw new Error(userData.error || 'Failed to fetch profile');
        if (!statsResponse.ok) throw new Error(statsData.error || 'Failed to fetch stats');
        if (!referralResponse.ok) throw new Error(referralData.error || 'Failed to fetch referral link');

        setUser(userData);
        setFormData({ username: userData.username });
        setStats(statsData);
        setReferralLink(referralData.referralLink);
      } catch (err) {
        setNotificationWithTimeout({ type: 'error', message: err.message });
        if (err.message.includes('Invalid or expired token')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setNotificationWithTimeout({ type: 'success', message: 'Referral link copied to clipboard!' });
    } catch (err) {
      console.error('Failed to copy referral link:', err);
      setNotificationWithTimeout({ type: 'error', message: 'Failed to copy referral link' });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setErrors((prev) => ({ ...prev, profile: 'Username cannot be empty' }));
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ username: formData.username }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUser(data.user);
      setIsModalOpen(false);
      setErrors((prev) => ({ ...prev, profile: '' }));
      setNotificationWithTimeout({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setErrors((prev) => ({ ...prev, profile: err.message }));
      setNotificationWithTimeout({ type: 'error', message: err.message });
      if (err.message.includes('Invalid or expired token')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors((prev) => ({ ...prev, deposit: 'Please enter a valid deposit amount greater than 0' }));
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/transactions/crypto-deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount,
          cryptoCurrency: depositData.cryptoCurrency,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate crypto deposit');
      }

      setDepositResult(data);
      setErrors((prev) => ({ ...prev, deposit: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, deposit: err.message }));
      setNotificationWithTimeout({ type: 'error', message: err.message });
      if (err.message.includes('Invalid or expired token')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!withdrawData.walletAddress || !/^[a-zA-Z0-9]{26,42}$/.test(withdrawData.walletAddress)) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please enter a valid wallet address' }));
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/transactions/crypto-withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount,
          cryptoCurrency: withdrawData.cryptoCurrency,
          walletAddress: withdrawData.walletAddress,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate crypto withdrawal');
      }

      setUser((prev) => ({ ...prev, balance: data.balance }));
      setIsWithdrawModalOpen(false);
      setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '' });
      setErrors((prev) => ({ ...prev, withdraw: '' }));
      setNotificationWithTimeout({ type: 'success', message: data.message });
    } catch (err) {
      setErrors((prev) => ({ ...prev, withdraw: err.message }));
      setNotificationWithTimeout({ type: 'error', message: err.message });
      if (err.message.includes('Invalid or expired token')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
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
        console.error('Logout failed:', err);
        setNotificationWithTimeout({ type: 'error', message: 'Failed to log out' });
      }
    }
  };

  if (!user) {
    return (
      <div className="profile-page container">
        <div className="loading-spinner" aria-live="polite">
          Loading...
        </div>
      </div>
    );
  }

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
              className="crypto-deposit-button"
              aria-label="Deposit crypto"
              disabled={isLoading}
            >
              <FaBitcoin />
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="crypto-withdraw-button"
              aria-label="Withdraw crypto"
              disabled={isLoading || user.balance === 0}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                  </select>
                </div>
                {errors.deposit && <p className="modal-error">{errors.deposit}</p>}
                <button type="submit" className="modal-submit" disabled={isLoading}>
                  Get Deposit Address
                </button>
              </form>
            ) : (
              <div className="deposit-result">
                <p>Send {depositResult.payAmount} {depositData.cryptoCurrency} to:</p>
                <p className="deposit-address">{depositResult.payAddress}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(depositResult.payAddress)}
                  className="copy-button"
                >
                  Copy Address
                </button>
                <div className="qr-code">
                  <QRCode value={`${depositData.cryptoCurrency.toLowerCase()}:${depositResult.payAddress}?amount=${depositResult.payAmount}`} />
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
                  Or use the payment link: <a href={depositResult.paymentUrl} target="_blank" rel="noopener noreferrer">Pay Now</a>
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
