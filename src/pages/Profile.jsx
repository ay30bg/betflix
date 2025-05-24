// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useBalance } from '../context/BalanceContext';
// import Header from '../components/header';
// import '../styles/profile.css';
// import { FaUser, FaCopy } from 'react-icons/fa';
// import { QRCodeCanvas } from 'qrcode.react';
// import TelegramLogo from '../assets/Telegram-logo.png';
// import { Tooltip } from 'react-tooltip';

// const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// // API Functions
// const fetchUserProfile = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required. Please log in.');
//   const response = await fetch(`${API_URL}/api/user/profile`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     throw new Error(errorData || `Profile fetch failed: ${response.status}`);
//   }
//   return response.json();
// };

// const fetchStats = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required. Please log in.');
//   const response = await fetch(`${API_URL}/api/bets/stats`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     throw new Error(errorData || `Stats fetch failed: ${response.status}`);
//   }
//   const stats = await response.json();
//   return {
//     totalBets: stats.totalBets || 0,
//     wins: stats.wins || 0,
//     losses: stats.losses || 0,
//     pendingBets: stats.pendingBets || 0,
//   };
// };

// const fetchReferralLink = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required. Please log in.');
//   const response = await fetch(`${API_URL}/api/referral/link`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     throw new Error(errorData || `Referral fetch failed: ${response.status}`);
//   }
//   return response.json();
// };

// const fetchReferralStats = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required. Please log in.');
//   const response = await fetch(`${API_URL}/api/referral/stats`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     throw new Error(errorData || `Referral stats fetch failed: ${response.status}`);
//   }
//   return response.json();
// };

// const updateProfile = async ({ username }) => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required. Please log in.');
//   const response = await fetch(`${API_URL}/api/user/profile`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ username }),
//   });
//   if (!response.ok) {
//     const errorData = await response.text().catch(() => 'Unknown error');
//     throw new Error(errorData || `Profile update failed: ${response.status}`);
//   }
//   return response.json();
// };

// const initiateDeposit = async ({ amount, cryptoCurrency, network }) => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required. Please log in.');
//   const payload = { amount, cryptoCurrency };
//   if (cryptoCurrency === 'USDT') {
//     payload.network = network;
//   }
//   const response = await fetch(`${API_URL}/api/transactions/crypto-deposit`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(payload),
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//     throw new Error(errorData.error || `Deposit initiation failed: ${response.status}`);
//   }
//   return response.json();
// };

// const initiateWithdrawal = async ({ amount, cryptoCurrency, walletAddress, network, withdrawalPassword }) => {
//   const token = localStorage.getItem('token');
//   console.log('JWT Token:', token);
//   if (!token) {
//     console.error('No token found in localStorage');
//     throw new Error('Authentication required. Please log in.');
//   }

//   const payload = { amount, cryptoCurrency, walletAddress, withdrawalPassword };
//   if (cryptoCurrency === 'USDT') {
//     payload.network = network;
//   }

//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//   };
//   console.log('Request Headers:', headers);
//   console.log('Request Payload:', payload);
//   console.log('API URL:', `${API_URL}/api/transactions/crypto-withdrawal`);

//   try {
//     const response = await fetch(`${API_URL}/api/transactions/crypto-withdrawal`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify(payload),
//     });

//     console.log('Response Status:', response.status);
//     console.log('Response Headers:', Object.fromEntries(response.headers));

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//       console.error('Withdrawal Error Response:', errorData);
//       throw new Error(errorData.error || `Withdrawal initiation failed: ${response.status}`);
//     }

//     return response.json();
//   } catch (error) {
//     console.error('Fetch Error:', error.message);
//     throw error;
//   }
// };

// const withdrawReferralBonus = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required. Please log in.');
//   const response = await fetch(`${API_URL}/api/referral/withdraw-bonus`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//     throw new Error(errorData.error || `Bonus withdrawal failed: ${response.status}`);
//   }
//   return response.json();
// };

// const setWithdrawalPassword = async ({ password, confirmPassword }) => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required. Please log in.');
//   if (password !== confirmPassword) throw new Error('Passwords do not match');
//   const response = await fetch(`${API_URL}/api/user/set-withdrawal-password`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ withdrawalPassword: password, confirmPassword }),
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//     throw new Error(errorData.error || `Setting withdrawal password failed: ${response.status}`);
//   }
//   return response.json();
// };

// function Profile() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { balance, setBalance, isLoading: balanceLoading, error: balanceError } = useBalance();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
//   const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
//   const [isReferralStatsModalOpen, setIsReferralStatsModalOpen] = useState(false);
//   const [isWithdrawalPasswordModalOpen, setIsWithdrawalPasswordModalOpen] = useState(false);
//   const [depositResult, setDepositResult] = useState(null);
//   const [formData, setFormData] = useState({ username: '' });
//   const [depositData, setDepositData] = useState({ amount: '', cryptoCurrency: 'BTC', network: 'BEP20' });
//   const [withdrawData, setWithdrawData] = useState({
//     amount: '',
//     cryptoCurrency: 'BTC',
//     walletAddress: '',
//     network: 'BEP20',
//     withdrawalPassword: '',
//   });
//   const [withdrawalPasswordData, setWithdrawalPasswordData] = useState({
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState({
//     profile: '',
//     deposit: '',
//     withdraw: '',
//     referralStats: '',
//     withdrawalPassword: '',
//   });
//   const [notification, setNotification] = useState(null);
//   const [referralLink, setReferralLink] = useState('');

//   // Handle authentication errors with notification and redirect
//   const handleAuthError = (message) => {
//     setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
//     localStorage.removeItem('token');
//     setTimeout(() => {
//       navigate('/login');
//     }, 3000);
//   };

//   // Fetch user profile
//   const { data: user, isLoading: userLoading, error: userError } = useQuery({
//     queryKey: ['userProfile'],
//     queryFn: fetchUserProfile,
//     onSuccess: (data) => {
//       setFormData({ username: data.username || '' });
//     },
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setNotification({ type: 'error', message: errorMessage });
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//   });

//   // Fetch stats
//   const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
//     queryKey: ['stats'],
//     queryFn: fetchStats,
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setNotification({ type: 'error', message: errorMessage });
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//   });

//   // Fetch referral link
//   const { data: referralData, isLoading: referralLoading, error: referralError } = useQuery({
//     queryKey: ['referralLink'],
//     queryFn: fetchReferralLink,
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setNotification({ type: 'error', message: errorMessage });
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//   });

//   // Fetch referral stats
//   const { data: referralStats, isLoading: referralStatsLoading, error: referralStatsError } = useQuery({
//     queryKey: ['referralStats'],
//     queryFn: fetchReferralStats,
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setErrors((prev) => ({ ...prev, referralStats: errorMessage }));
//       setNotification({ type: 'error', message: errorMessage });
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//   });

//   useEffect(() => {
//     if (referralData?.referralLink) {
//       setReferralLink(referralData.referralLink);
//     }
//   }, [referralData]);

//   // Session Timeout
//   useEffect(() => {
//     let timeout;
//     const resetTimeout = () => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         setNotification({ type: 'info', message: 'Session expired. Please log in again.' });
//         localStorage.removeItem('token');
//         navigate('/login');
//       }, 30 * 60 * 1000); // 30 minutes
//     };

//     window.addEventListener('mousemove', resetTimeout);
//     window.addEventListener('keypress', resetTimeout);
//     window.addEventListener('click', resetTimeout);
//     resetTimeout();

//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener('mousemove', resetTimeout);
//       window.removeEventListener('keypress', resetTimeout);
//       window.removeEventListener('click', resetTimeout);
//     };
//   }, [navigate]);

//   // Notification timeout
//   useEffect(() => {
//     if (notification) {
//       const timeout = setTimeout(() => setNotification(null), 3000);
//       return () => clearTimeout(timeout);
//     }
//   }, [notification]);

//   const handleCopyReferralLink = async () => {
//     try {
//       if (!referralLink) throw new Error('No referral link available');
//       await navigator.clipboard.writeText(referralLink);
//       setNotification({ type: 'success', message: 'Referral link copied to clipboard!' });
//     } catch (err) {
//       setNotification({ type: 'error', message: err.message });
//     }
//   };

//   const handleUpdateProfile = (e) => {
//     e.preventDefault();
//     if (!formData.username.trim()) {
//       setErrors((prev) => ({ ...prev, profile: 'Username cannot be empty' }));
//       return;
//     }
//     updateProfileMutation.mutate({ username: formData.username });
//   };

//   const handleDeposit = (e) => {
//     e.preventDefault();
//     const amount = parseFloat(depositData.amount);
//     if (isNaN(amount) || amount <= 0) {
//       setErrors((prev) => ({ ...prev, deposit: 'Please enter a valid deposit amount greater than 0' }));
//       return;
//     }
//     if (depositData.cryptoCurrency === 'USDT' && !['BEP20', 'TRC20', 'TON'].includes(depositData.network)) {
//       setErrors((prev) => ({ ...prev, deposit: 'Please select a valid USDT network (BEP20, TRC20, or TON)' }));
//       return;
//     }
//     depositMutation.mutate({
//       amount,
//       cryptoCurrency: depositData.cryptoCurrency,
//       network: depositData.cryptoCurrency === 'USDT' ? depositData.network : undefined,
//     });
//   };

//   const handleWithdraw = (e) => {
//     e.preventDefault();
//     const amount = parseFloat(withdrawData.amount);
//     if (isNaN(amount) || amount <= 0) {
//       setErrors((prev) => ({ ...prev, withdraw: 'Please enter a valid withdrawal amount greater than 0' }));
//       return;
//     }
//     if (amount > (balance ?? 0)) {
//       setErrors((prev) => ({ ...prev, withdraw: 'Insufficient balance for withdrawal' }));
//       return;
//     }
//     if (!withdrawData.walletAddress || !/^[a-zA-Z0-9]{26,42}$/.test(withdrawData.walletAddress)) {
//       setErrors((prev) => ({ ...prev, withdraw: 'Please enter a valid wallet address' }));
//       return;
//     }
//     if (withdrawData.cryptoCurrency === 'USDT' && !['BEP20', 'TRC20', 'TON'].includes(withdrawData.network)) {
//       setErrors((prev) => ({ ...prev, withdraw: 'Please select a valid USDT network (BEP20, TRC20, or TON)' }));
//       return;
//     }
//     if (!withdrawData.withdrawalPassword) {
//       setErrors((prev) => ({ ...prev, withdraw: 'Please enter your withdrawal password' }));
//       return;
//     }
//     withdrawMutation.mutate({
//       amount,
//       cryptoCurrency: withdrawData.cryptoCurrency,
//       walletAddress: withdrawData.walletAddress,
//       network: withdrawData.cryptoCurrency === 'USDT' ? withdrawData.network : undefined,
//       withdrawalPassword: withdrawData.withdrawalPassword,
//     });
//   };

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
//         setNotification({ type: 'error', message: 'Failed to log out' });
//       }
//     }
//   };

//   // Mutations
//   const updateProfileMutation = useMutation({
//     mutationFn: updateProfile,
//     onSuccess: (data) => {
//       queryClient.setQueryData(['userProfile'], data.user);
//       setIsModalOpen(false);
//       setErrors((prev) => ({ ...prev, profile: '' }));
//       setNotification({ type: 'success', message: 'Profile updated successfully!' });
//     },
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setErrors((prev) => ({ ...prev, profile: errorMessage }));
//       setNotification({ type: 'error', message: errorMessage });
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//   });

//   const depositMutation = useMutation({
//     mutationFn: initiateDeposit,
//     onSuccess: (data) => {
//       setDepositResult(data);
//       setErrors((prev) => ({ ...prev, deposit: '' }));
//       queryClient.invalidateQueries(['userProfile']);
//     },
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setErrors((prev) => ({ ...prev, deposit: errorMessage }));
//       setNotification({ type: 'error', message: errorMessage });
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//   });

//   const withdrawMutation = useMutation({
//     mutationFn: initiateWithdrawal,
//     onSuccess: (data) => {
//       if (typeof data.balance === 'number') {
//         setBalance(data.balance);
//       }
//       queryClient.setQueryData(['userProfile'], (old) => ({ ...old, balance: data.balance ?? 0 }));
//       setIsWithdrawModalOpen(false);
//       setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '', network: 'BEP20', withdrawalPassword: '' });
//       setErrors((prev) => ({ ...prev, withdraw: '' }));
//       setNotification({ type: 'success', message: data.message || 'Withdrawal request submitted for admin review!' });
//     },
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setErrors((prev) => ({ ...prev, withdraw: errorMessage }));
//       setNotification({ type: 'error', message: errorMessage });
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//   });

//   const withdrawBonusMutation = useMutation({
//     mutationFn: withdrawReferralBonus,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(['referralStats']);
//       queryClient.invalidateQueries(['userProfile']);
//       if (typeof data.balance === 'number') {
//         setBalance(data.balance);
//       }
//       setNotification({ type: 'success', message: data.message || 'Referral bonus withdrawn successfully!' });
//     },
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setNotification({ type: 'error', message: errorMessage });
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//   });

//   const setWithdrawalPasswordMutation = useMutation({
//     mutationFn: setWithdrawalPassword,
//     onSuccess: () => {
//       setIsWithdrawalPasswordModalOpen(false);
//       setWithdrawalPasswordData({ password: '', confirmPassword: '' });
//       setErrors((prev) => ({ ...prev, withdrawalPassword: '' }));
//       setNotification({ type: 'success', message: 'Withdrawal password set successfully!' });
//     },
//     onError: (err) => {
//       const errorMessage = err.message.includes('Authentication required')
//         ? 'Session expired. Please log in again.'
//         : err.message;
//       setErrors((prev) => ({ ...prev, withdrawalPassword: errorMessage }));
//       setNotification({ type: 'error', message: errorMessage });
//       if (err.message.includes('Authentication required')) {
//         handleAuthError(errorMessage);
//       }
//     },
//   });

//   // Render betting stats
//   const renderBettingStats = () => {
//     if (statsLoading) return <div className="loading-spinner" aria-live="polite">Loading stats...</div>;
//     if (statsError) return <p className="error" role="alert">{statsError.message}</p>;

//     return (
//       <div className="betting-stats">
//         <h2>Betting Statistics</h2>
//         <p><strong>Total Finalized Bets:</strong> {stats?.totalBets || 0}</p>
//         <p><strong>Wins:</strong> {stats?.wins || 0}</p>
//         <p><strong>Losses:</strong> {stats?.losses || 0}</p>
//         {stats?.pendingBets > 0 && (
//           <p>
//             <strong>Pending Bets:</strong> {stats.pendingBets}
//             <span
//               data-tooltip-id="pending-tooltip"
//               data-tooltip-content="Bets placed in rounds that have not yet concluded."
//               className="help-icon"
//             >
//               ?
//             </span>
//           </p>
//         )}
//         <p>
//           <strong>Win Rate:</strong>{' '}
//           {stats?.totalBets > 0
//             ? ((stats.wins / stats.totalBets) * 100).toFixed(1)
//             : 0}
//           %
//         </p>
//         <button
//           onClick={() => queryClient.invalidateQueries(['stats'])}
//           className="refresh-stats-button"
//           aria-label="Refresh betting statistics"
//           disabled={statsLoading}
//         >
//           Refresh Stats
//         </button>
//       </div>
//     );
//   };

//   // Render referral stats modal content
//   const renderReferralStats = () => {
//     if (referralStatsLoading) return <div className="loading-spinner" aria-live="polite">Loading referral stats...</div>;
//     if (referralStatsError) return <p className="error" role="alert">{errors.referralStats}</p>;

//     return (
//       <div className="referral-stats-content">
//         <h3>Referral Statistics</h3>
//         <p><strong>Total Referrals:</strong> {referralStats?.totalReferrals || 0}</p>
//         <p><strong>Total Bonus Earned:</strong> ${(referralStats?.totalBonus || 0).toFixed(2)}</p>
//         <p><strong>Available Bonus:</strong> ${(referralStats?.availableBonus || 0).toFixed(2)}</p>
//         {referralStats?.referrals?.length > 0 ? (
//           <div className="referral-table-container">
//             <table className="referral-table">
//               <thead>
//                 <tr>
//                   <th>Username</th>
//                   <th>Sign-Up Date</th>
//                   <th>Bonus Earned</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {referralStats.referrals.map((referral) => (
//                   <tr key={referral.id}>
//                     <td>{referral.username || 'N/A'}</td>
//                     <td>{new Date(referral.signupDate).toLocaleDateString()}</td>
//                     <td>${(referral.bonusEarned || 0).toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p>No referrals yet.</p>
//         )}
//         <button
//           onClick={() => withdrawBonusMutation.mutate()}
//           className="withdraw-bonus-button"
//           disabled={withdrawBonusMutation.isLoading || (referralStats?.availableBonus || 0) <= 0}
//           aria-label="Withdraw referral bonus"
//         >
//           Withdraw Bonus
//         </button>
//       </div>
//     );
//   };

//   // Render loading state
//   if (balanceLoading || userLoading || statsLoading || referralLoading) {
//     return (
//       <div className="profile-page container">
//         <Header />
//         <div className="loading-spinner" aria-live="polite">Loading...</div>
//       </div>
//     );
//   }

//   // Render main UI
//   return (
//     <div className="profile-page container">
//       <Header />
//       {notification && (
//         <div className={`result ${notification.type}`} role="alert" aria-live="polite">
//           {notification.message}
//         </div>
//       )}
//       <h1>Profile</h1>
//       <div className="profile-container">
//         <div className="profile-info">
//           <h2>User Information</h2>
//           <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
//           <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
//           <p><strong>Balance:</strong> ${(balance ?? 0).toFixed(2)}</p>
//           <div className="profile-button-group">
//             <button
//               onClick={() => setIsDepositModalOpen(true)}
//               className="crypto-deposit-button"
//               aria-label="Deposit crypto"
//               disabled={depositMutation.isLoading}
//             >
//               Deposit
//             </button>
//             <button
//               onClick={() => setIsWithdrawModalOpen(true)}
//               className="crypto-withdraw-button"
//               aria-label="Withdraw crypto"
//               disabled={withdrawMutation.isLoading || (balance ?? 0) === 0}
//             >
//               Withdraw
//             </button>
//           </div>
//         </div>
//         <div className="referral-section">
//           <h2>
//             Referral Program
//             <span
//               data-tooltip-id="referral-tooltip"
//               data-tooltip-content="Invite friends using your unique referral link to earn rewards when they sign up and place bets."
//               className="help-icon"
//             >
//               ?
//             </span>
//           </h2>
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
//               disabled={!referralLink}
//             >
//               Copy Link <FaCopy style={{ marginLeft: '0.5rem' }} />
//             </button>
//           </div>
//           <button
//             onClick={() => setIsReferralStatsModalOpen(true)}
//             className="view-referral-stats-button"
//             aria-label="View referral statistics"
//             disabled={referralStatsLoading}
//           >
//             View Referral Stats
//           </button>
//         </div>
//         <div className="withdrawal-password-section">
//           <h2>
//             Withdrawal Password
//             <span
//               data-tooltip-id="withdrawal-password-tooltip"
//               data-tooltip-content="Set a secure password to protect your withdrawals. Required for all withdrawal transactions."
//               className="help-icon"
//             >
//               ?
//             </span>
//           </h2>
//           <p>Set or update your withdrawal password to secure your transactions.</p>
//           <button
//             onClick={() => setIsWithdrawalPasswordModalOpen(true)}
//             className="set-password-button"
//             aria-label="Set or update withdrawal password"
//             disabled={setWithdrawalPasswordMutation.isLoading}
//           >
//             Set Withdrawal Password
//           </button>
//         </div>
//         {renderBettingStats()}
//       </div>
//       <button
//         onClick={handleLogout}
//         className="logout-button"
//         aria-label="Log out"
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
//               aria-label="Close update profile modal"
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
//                   disabled={updateProfileMutation.isLoading}
//                 />
//               </div>
//               {errors.profile && <p className="modal-error">{errors.profile}</p>}
//               <button
//                 type="submit"
//                 className="modal-submit"
//                 disabled={updateProfileMutation.isLoading}
//               >
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Deposit Crypto Modal */}
//       {isDepositModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button
//               onClick={() => {
//                 setIsDepositModalOpen(false);
//                 setErrors((prev) => ({ ...prev, deposit: '' }));
//                 setDepositData({ amount: '', cryptoCurrency: 'BTC', network: 'BEP20' });
//                 setDepositResult(null);
//               }}
//               className="modal-close"
//               aria-label="Close deposit modal"
//             >
//               ×
//             </button>
//             <h2>Deposit Crypto</h2>
//             {!depositResult ? (
//               <form onSubmit={handleDeposit}>
//                 <div className="form-group">
//                   <label htmlFor="deposit-amount" className="modal-label">
//                     Amount (USD)
//                   </label>
//                   <input
//                     id="deposit-amount"
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     value={depositData.amount}
//                     onChange={(e) =>
//                       setDepositData({ ...depositData, amount: e.target.value })
//                     }
//                     className="modal-input"
//                     placeholder="Enter amount in USD"
//                     disabled={depositMutation.isLoading}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="crypto-currency" className="modal-label">
//                     Cryptocurrency
//                   </label>
//                   <select
//                     id="crypto-currency"
//                     name="cryptoCurrency"
//                     value={depositData.cryptoCurrency}
//                     onChange={(e) =>
//                       setDepositData({
//                         ...depositData,
//                         cryptoCurrency: e.target.value,
//                         network: e.target.value === 'USDT' ? 'BEP20' : 'BEP20',
//                       })
//                     }
//                     className="modal-input"
//                     disabled={depositMutation.isLoading}
//                   >
//                     <option value="BTC">Bitcoin (BTC)</option>
//                     <option value="ETH">Ethereum (ETH)</option>
//                     <option value="USDT">Tether (USDT)</option>
//                   </select>
//                 </div>
//                 {depositData.cryptoCurrency === 'USDT' && (
//                   <div className="form-group">
//                     <label htmlFor="network" className="modal-label">
//                       Network
//                       <span
//                         data-tooltip-id="network-tooltip"
//                         data-tooltip-content="Select the blockchain network for USDT deposits (BEP20 for Binance Smart Chain, TRC20 for TRON, TON for The Open Network)."
//                         className="help-icon"
//                       >
//                         ?
//                       </span>
//                     </label>
//                     <select
//                       id="network"
//                       name="network"
//                       value={depositData.network}
//                       onChange={(e) =>
//                         setDepositData({ ...depositData, network: e.target.value })
//                       }
//                       className="modal-input"
//                       disabled={depositMutation.isLoading}
//                     >
//                       <option value="BEP20">BEP20 (Binance Smart Chain)</option>
//                       <option value="TRC20">TRC20 (TRON)</option>
//                       <option value="TON">TON (The Open Network)</option>
//                     </select>
//                   </div>
//                 )}
//                 {errors.deposit && <p className="modal-error">{errors.deposit}</p>}
//                 <button
//                   type="submit"
//                   className="modal-submit"
//                   disabled={depositMutation.isLoading}
//                 >
//                   Get Deposit Address
//                 </button>
//               </form>
//             ) : (
//               <div className="deposit-result">
//                 <p>
//                   Send {depositResult.payAmount} {depositData.cryptoCurrency}{' '}
//                   {depositData.cryptoCurrency === 'USDT' ? `(${depositData.network})` : ''} to:
//                 </p>
//                 <p className="deposit-address">{depositResult.payAddress}</p>
//                 <button
//                   onClick={() => navigator.clipboard.writeText(depositResult.payAddress)}
//                   className="copy-button"
//                   aria-label="Copy deposit address"
//                 >
//                   Copy Address
//                 </button>
//                 <div
//                   className="qr-code"
//                   aria-label={`QR code for ${depositData.cryptoCurrency} deposit to ${depositResult.payAddress}`}
//                 >
//                   <QRCodeCanvas
//                     value={
//                       depositData.cryptoCurrency === 'USDT'
//                         ? `tether:${depositResult.payAddress}?amount=${depositResult.payAmount}&network=${depositData.network}`
//                         : `${depositData.cryptoCurrency.toLowerCase()}:${depositResult.payAddress}?amount=${depositResult.payAmount}`
//                     }
//                   />
//                 </div>
//                 <button
//                   onClick={() => {
//                     setDepositResult(null);
//                     setDepositData({ amount: '', cryptoCurrency: 'BTC', network: 'BEP20' });
//                   }}
//                   className="modal-submit"
//                 >
//                   New Deposit
//                 </button>
//                 <p>
//                   Or use the payment link:{' '}
//                   <a
//                     href={depositResult.paymentUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     Pay Now
//                   </a>
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Withdraw Crypto Modal */}
//       {isWithdrawModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button
//               onClick={() => {
//                 setIsWithdrawModalOpen(false);
//                 setErrors((prev) => ({ ...prev, withdraw: '' }));
//                 setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '', network: 'BEP20', withdrawalPassword: '' });
//               }}
//               className="modal-close"
//               aria-label="Close withdrawal modal"
//             >
//               ×
//             </button>
//             <h2>Withdraw Crypto</h2>
//             <p className="modal-note">
//               Note: Your withdrawal request will be reviewed by an admin before processing.
//             </p>
//             <form onSubmit={handleWithdraw}>
//               <div className="form-group">
//                 <label htmlFor="withdraw-amount" className="modal-label">
//                   Amount (USD)
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
//                   disabled={withdrawMutation.isLoading}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="crypto-currency" className="modal-label">
//                   Cryptocurrency
//                 </label>
//                 <select
//                   id="crypto-currency"
//                   name="cryptoCurrency"
//                   value={withdrawData.cryptoCurrency}
//                   onChange={(e) =>
//                     setWithdrawData({
//                       ...withdrawData,
//                       cryptoCurrency: e.target.value,
//                       network: e.target.value === 'USDT' ? 'BEP20' : 'BEP20',
//                     })
//                   }
//                   className="modal-input"
//                   disabled={withdrawMutation.isLoading}
//                 >
//                   <option value="BTC">Bitcoin (BTC)</option>
//                   <option value="ETH">Ethereum (ETH)</option>
//                   <option value="USDT">Tether (USDT)</option>
//                 </select>
//               </div>
//               {withdrawData.cryptoCurrency === 'USDT' && (
//                 <div className="form-group">
//                   <label htmlFor="withdraw-network" className="modal-label">
//                     Network
//                     <span
//                       data-tooltip-id="network-tooltip"
//                       data-tooltip-content="Select the blockchain network for USDT withdrawals (BEP20 for Binance Smart Chain, TRC20 for TRON, TON for The Open Network)."
//                       className="help-icon"
//                     >
//                       ?
//                     </span>
//                   </label>
//                   <select
//                     id="withdraw-network"
//                     name="network"
//                     value={withdrawData.network}
//                     onChange={(e) =>
//                       setWithdrawData({ ...withdrawData, network: e.target.value })
//                     }
//                     className="modal-input"
//                     disabled={withdrawMutation.isLoading}
//                   >
//                     <option value="BEP20">BEP20 (Binance Smart Chain)</option>
//                     <option value="TRC20">TRC20 (TRON)</option>
//                     <option value="TON">TON (The Open Network)</option>
//                   </select>
//                 </div>
//               )}
//               <div className="form-group">
//                 <label htmlFor="wallet-address" className="modal-label">
//                   Wallet Address
//                 </label>
//                 <input
//                   id="wallet-address"
//                   type="text"
//                   value={withdrawData.walletAddress}
//                   onChange={(e) =>
//                     setWithdrawData({ ...withdrawData, walletAddress: e.target.value })
//                   }
//                   className="modal-input"
//                   placeholder="Enter your wallet address"
//                   disabled={withdrawMutation.isLoading}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="withdrawal-password" className="modal-label">
//                   Withdrawal Password
//                 </label>
//                 <input
//                   id="withdrawal-password"
//                   type="password"
//                   value={withdrawData.withdrawalPassword}
//                   onChange={(e) =>
//                     setWithdrawData({ ...withdrawData, withdrawalPassword: e.target.value })
//                   }
//                   className="modal-input"
//                   placeholder="Enter withdrawal password"
//                   disabled={withdrawMutation.isLoading}
//                 />
//               </div>
//               {errors.withdraw && <p className="modal-error">{errors.withdraw}</p>}
//               <button
//                 type="submit"
//                 className="modal-submit"
//                 disabled={withdrawMutation.isLoading}
//               >
//                 Withdraw
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Withdrawal Password Modal */}
//       {isWithdrawalPasswordModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button
//               onClick={() => {
//                 setIsWithdrawalPasswordModalOpen(false);
//                 setErrors((prev) => ({ ...prev, withdrawalPassword: '' }));
//                 setWithdrawalPasswordData({ password: '', confirmPassword: '' });
//               }}
//               className="modal-close"
//               aria-label="Close withdrawal password modal"
//             >
//               ×
//             </button>
//             <h2>Set Withdrawal Password</h2>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 if (!withdrawalPasswordData.password || withdrawalPasswordData.password.length < 6) {
//                   setErrors((prev) => ({
//                     ...prev,
//                     withdrawalPassword: 'Password must be at least 6 characters long',
//                   }));
//                   return;
//                 }
//                 setWithdrawalPasswordMutation.mutate({
//                   password: withdrawalPasswordData.password,
//                   confirmPassword: withdrawalPasswordData.confirmPassword,
//                 });
//               }}
//             >
//               <div className="form-group">
//                 <label htmlFor="withdrawal-password" className="modal-label">
//                   Password
//                   <span
//                     data-tooltip-id="password-tooltip"
//                     data-tooltip-content="Password must be at least 6 characters long."
//                     className="help-icon"
//                   >
//                     ?
//                   </span>
//                 </label>
//                 <input
//                   id="withdrawal-password"
//                   type="password"
//                   value={withdrawalPasswordData.password}
//                   onChange={(e) =>
//                     setWithdrawalPasswordData({
//                       ...withdrawalPasswordData,
//                       password: e.target.value,
//                     })
//                   }
//                   className="modal-input"
//                   placeholder="Enter withdrawal password"
//                   disabled={setWithdrawalPasswordMutation.isLoading}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="confirm-withdrawal-password" className="modal-label">
//                   Confirm Password
//                 </label>
//                 <input
//                   id="confirm-withdrawal-password"
//                   type="password"
//                   value={withdrawalPasswordData.confirmPassword}
//                   onChange={(e) =>
//                     setWithdrawalPasswordData({
//                       ...withdrawalPasswordData,
//                       confirmPassword: e.target.value,
//                     })
//                   }
//                   className="modal-input"
//                   placeholder="Confirm withdrawal password"
//                   disabled={setWithdrawalPasswordMutation.isLoading}
//                 />
//               </div>
//               {errors.withdrawalPassword && (
//                 <p className="modal-error">{errors.withdrawalPassword}</p>
//               )}
//               <button
//                 type="submit"
//                 className="modal-submit"
//                 disabled={setWithdrawalPasswordMutation.isLoading}
//               >
//                 Set Password
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Referral Stats Modal */}
//       {isReferralStatsModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button
//               onClick={() => {
//                 setIsReferralStatsModalOpen(false);
//                 setErrors((prev) => ({ ...prev, referralStats: '' }));
//               }}
//               className="modal-close"
//               aria-label="Close referral stats modal"
//             >
//               ×
//             </button>
//             {renderReferralStats()}
//           </div>
//         </div>
//       )}

//       {/* Tooltips */}
//       <Tooltip id="referral-tooltip" place="top" variant="dark" />
//       <Tooltip id="network-tooltip" place="top" variant="dark" />
//       <Tooltip id="pending-tooltip" place="top" variant="dark" />
//       <Tooltip id="password-tooltip" place="top" variant="dark" />
//       <Tooltip id="withdrawal-password-tooltip" place="top" variant="dark" />

//       <a
//         href="https://t.me/+gqAMTbDYX6cxOGY0"
//         className="telegram-floating"
//         target="_blank"
//         rel="noopener noreferrer"
//         aria-label="Join our Telegram community"
//       >
//         <img
//           src={TelegramLogo}
//           alt="Telegram Logo"
//           className="telegram-logo"
//           loading="lazy"
//         />
//       </a>
//     </div>
//   );
// }

// export default Profile;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBalance } from '../context/BalanceContext';
import Header from '../components/header';
import '../styles/profile.css';
import { FaUser, FaCopy } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import TelegramLogo from '../assets/Telegram-logo.png';
import { Tooltip } from 'react-tooltip';

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// API Functions (unchanged)
const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const response = await fetch(`${API_URL}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    throw new Error(errorData || `Profile fetch failed: ${response.status}`);
  }
  return response.json();
};

const fetchStats = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const response = await fetch(`${API_URL}/api/bets/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    throw new Error(errorData || `Stats fetch failed: ${response.status}`);
  }
  const stats = await response.json();
  return {
    totalBets: stats.totalBets || 0,
    wins: stats.wins || 0,
    losses: stats.losses || 0,
    pendingBets: stats.pendingBets || 0,
  };
};

const fetchReferralLink = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const response = await fetch(`${API_URL}/api/referral/link`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    throw new Error(errorData || `Referral fetch failed: ${response.status}`);
  }
  return response.json();
};

const fetchReferralStats = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const response = await fetch(`${API_URL}/api/referral/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    throw new Error(errorData || `Referral stats fetch failed: ${response.status}`);
  }
  return response.json();
};

const updateProfile = async ({ username }) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const response = await fetch(`${API_URL}/api/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    throw new Error(errorData || `Profile update failed: ${response.status}`);
  }
  return response.json();
};

const initiateDeposit = async ({ amount, cryptoCurrency, network }) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const payload = { amount, cryptoCurrency };
  if (cryptoCurrency === 'USDT') {
    payload.network = network;
  }
  const response = await fetch(`${API_URL}/api/transactions/crypto-deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Deposit initiation failed: ${response.status}`);
  }
  return response.json();
};

const initiateWithdrawal = async ({ amount, cryptoCurrency, walletAddress, network, withdrawalPassword }) => {
  const token = localStorage.getItem('token');
  console.log('JWT Token:', token);
  if (!token) {
    console.error('No token found in localStorage');
    throw new Error('Authentication required. Please log in.');
  }

  const payload = { amount, cryptoCurrency, walletAddress, withdrawalPassword };
  if (cryptoCurrency === 'USDT') {
    payload.network = network;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  console.log('Request Headers:', headers);
  console.log('Request Payload:', payload);
  console.log('API URL:', `${API_URL}/api/transactions/crypto-withdrawal`);

  try {
    const response = await fetch(`${API_URL}/api/transactions/crypto-withdrawal`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Withdrawal Error Response:', errorData);
      throw new Error(errorData.error || `Withdrawal initiation failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch Error:', error.message);
    throw error;
  }
};

const withdrawReferralBonus = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const response = await fetch(`${API_URL}/api/referral/withdraw-bonus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Bonus withdrawal failed: ${response.status}`);
  }
  return response.json();
};

const setWithdrawalPassword = async ({ password, confirmPassword }) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  if (password !== confirmPassword) throw new Error('Passwords do not match');
  const response = await fetch(`${API_URL}/api/user/set-withdrawal-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ withdrawalPassword: password, confirmPassword }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Setting withdrawal password failed: ${response.status}`);
  }
  return response.json();
};

function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { balance, setBalance, isLoading: balanceLoading, error: balanceError } = useBalance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isReferralStatsModalOpen, setIsReferralStatsModalOpen] = useState(false);
  const [isWithdrawalPasswordModalOpen, setIsWithdrawalPasswordModalOpen] = useState(false);
  const [depositResult, setDepositResult] = useState(null);
  const [formData, setFormData] = useState({ username: '' });
  const [depositData, setDepositData] = useState({ amount: '', cryptoCurrency: 'BTC', network: 'BEP20' });
  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    cryptoCurrency: 'BTC',
    walletAddress: '',
    network: 'BEP20',
    withdrawalPassword: '',
  });
  const [withdrawalPasswordData, setWithdrawalPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    profile: '',
    deposit: '',
    withdraw: '',
    referralStats: '',
    withdrawalPassword: '',
  });
  const [notification, setNotification] = useState(null);
  const [referralLink, setReferralLink] = useState('');

  // Handle authentication errors with notification and redirect
  const handleAuthError = (message) => {
    setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
    localStorage.removeItem('token');
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  // Fetch user profile
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    onSuccess: (data) => {
      setFormData({ username: data.username || '' });
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  // Fetch referral link
  const { data: referralData, isLoading: referralLoading, error: referralError } = useQuery({
    queryKey: ['referralLink'],
    queryFn: fetchReferralLink,
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  // Fetch referral stats
  const { data: referralStats, isLoading: referralStatsLoading, error: referralStatsError } = useQuery({
    queryKey: ['referralStats'],
    queryFn: fetchReferralStats,
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setErrors((prev) => ({ ...prev, referralStats: errorMessage }));
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  useEffect(() => {
    if (referralData?.referralLink) {
      setReferralLink(referralData.referralLink);
    }
  }, [referralData]);

  // Session Timeout
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setNotification({ type: 'info', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('token');
        navigate('/login');
      }, 30 * 60 * 1000); // 30 minutes
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    window.addEventListener('click', resetTimeout);
    resetTimeout();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
      window.removeEventListener('click', resetTimeout);
    };
  }, [navigate]);

  // Notification timeout
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const handleCopyReferralLink = async () => {
    try {
      if (!referralLink) throw new Error('No referral link available');
      await navigator.clipboard.writeText(referralLink);
      setNotification({ type: 'success', message: 'Referral link copied to clipboard!' });
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
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
    if (depositData.cryptoCurrency === 'USDT' && !['BEP20', 'ARBITRUM', 'TON'].includes(depositData.network)) {
      setErrors((prev) => ({ ...prev, deposit: 'Please select a valid USDT network (BEP20, ARBITRUM, or TON)' }));
      return;
    }
    depositMutation.mutate({
      amount,
      cryptoCurrency: depositData.cryptoCurrency,
      network: depositData.cryptoCurrency === 'USDT' ? depositData.network : undefined,
    });
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please enter a valid withdrawal amount greater than 0' }));
      return;
    }
    if (amount > (balance ?? 0)) {
      setErrors((prev) => ({ ...prev, withdraw: 'Insufficient balance for withdrawal' }));
      return;
    }
    if (amount < 10) {
      setErrors((prev) => ({ ...prev, withdraw: 'Minimum withdrawal amount is 10 USD' }));
      return;
    }
    if (!withdrawData.walletAddress) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please enter a wallet address' }));
      return;
    }
    if (withdrawData.cryptoCurrency === 'USDT' && withdrawData.network === 'ARBITRUM') {
      if (!/^0x[a-fA-F0-9]{40}$/.test(withdrawData.walletAddress)) {
        setErrors((prev) => ({ ...prev, withdraw: 'Invalid Arbitrum wallet address (must be 42 characters starting with 0x)' }));
        return;
      }
    } else if (!/^[a-zA-Z0-9]{26,48}$/.test(withdrawData.walletAddress)) {
      setErrors((prev) => ({ ...prev, withdraw: 'Invalid wallet address (26-48 characters)' }));
      return;
    }
    if (withdrawData.cryptoCurrency === 'USDT' && !['BEP20', 'ARBITRUM', 'TON'].includes(withdrawData.network)) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please select a valid USDT network (BEP20, ARBITRUM, or TON)' }));
      return;
    }
    if (!withdrawData.withdrawalPassword) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please enter your withdrawal password' }));
      return;
    }
    withdrawMutation.mutate({
      amount,
      cryptoCurrency: withdrawData.cryptoCurrency,
      walletAddress: withdrawData.walletAddress,
      network: withdrawData.cryptoCurrency === 'USDT' ? withdrawData.network : undefined,
      withdrawalPassword: withdrawData.withdrawalPassword,
    });
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

  // Mutations (unchanged)
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data.user);
      setIsModalOpen(false);
      setErrors((prev) => ({ ...prev, profile: '' }));
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setErrors((prev) => ({ ...prev, profile: errorMessage }));
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
  });

  const depositMutation = useMutation({
    mutationFn: initiateDeposit,
    onSuccess: (data) => {
      setDepositResult(data);
      setErrors((prev) => ({ ...prev, deposit: '' }));
      queryClient.invalidateQueries(['userProfile']);
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setErrors((prev) => ({ ...prev, deposit: errorMessage }));
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: initiateWithdrawal,
    onSuccess: (data) => {
      if (typeof data.balance === 'number') {
        setBalance(data.balance);
      }
      queryClient.setQueryData(['userProfile'], (old) => ({ ...old, balance: data.balance ?? 0 }));
      setIsWithdrawModalOpen(false);
      setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '', network: 'BEP20', withdrawalPassword: '' });
      setErrors((prev) => ({ ...prev, withdraw: '' }));
      setNotification({ type: 'success', message: data.message || 'Withdrawal request submitted for admin review!' });
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setErrors((prev) => ({ ...prev, withdraw: errorMessage }));
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
  });

  const withdrawBonusMutation = useMutation({
    mutationFn: withdrawReferralBonus,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['referralStats']);
      queryClient.invalidateQueries(['userProfile']);
      if (typeof data.balance === 'number') {
        setBalance(data.balance);
      }
      setNotification({ type: 'success', message: data.message || 'Referral bonus withdrawn successfully!' });
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
  });

  const setWithdrawalPasswordMutation = useMutation({
    mutationFn: setWithdrawalPassword,
    onSuccess: () => {
      setIsWithdrawalPasswordModalOpen(false);
      setWithdrawalPasswordData({ password: '', confirmPassword: '' });
      setErrors((prev) => ({ ...prev, withdrawalPassword: '' }));
      setNotification({ type: 'success', message: 'Withdrawal password set successfully!' });
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setErrors((prev) => ({ ...prev, withdrawalPassword: errorMessage }));
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError(errorMessage);
      }
    },
  });

  // Render betting stats (unchanged)
  const renderBettingStats = () => {
    if (statsLoading) return <div className="loading-spinner" aria-live="polite">Loading stats...</div>;
    if (statsError) return <p className="error" role="alert">{statsError.message}</p>;

    return (
      <div className="betting-stats">
        <h2>Betting Statistics</h2>
        <p><strong>Total Finalized Bets:</strong> {stats?.totalBets || 0}</p>
        <p><strong>Wins:</strong> {stats?.wins || 0}</p>
        <p><strong>Losses:</strong> {stats?.losses || 0}</p>
        {stats?.pendingBets > 0 && (
          <p>
            <strong>Pending Bets:</strong> {stats.pendingBets}
            <span
              data-tooltip-id="pending-tooltip"
              data-tooltip-content="Bets placed in rounds that have not yet concluded."
              className="help-icon"
            >
              ?
            </span>
          </p>
        )}
        <p>
          <strong>Win Rate:</strong>{' '}
          {stats?.totalBets > 0
            ? ((stats.wins / stats.totalBets) * 100).toFixed(1)
            : 0}
          %
        </p>
        <button
          onClick={() => queryClient.invalidateQueries(['stats'])}
          className="refresh-stats-button"
          aria-label="Refresh betting statistics"
          disabled={statsLoading}
        >
          Refresh Stats
        </button>
      </div>
    );
  };

  // Render referral stats modal content (unchanged)
  const renderReferralStats = () => {
    if (referralStatsLoading) return <div className="loading-spinner" aria-live="polite">Loading referral stats...</div>;
    if (referralStatsError) return <p className="error" role="alert">{errors.referralStats}</p>;

    return (
      <div className="referral-stats-content">
        <h3>Referral Statistics</h3>
        <p><strong>Total Referrals:</strong> {referralStats?.totalReferrals || 0}</p>
        <p><strong>Total Bonus Earned:</strong> ${(referralStats?.totalBonus || 0).toFixed(2)}</p>
        <p><strong>Available Bonus:</strong> ${(referralStats?.availableBonus || 0).toFixed(2)}</p>
        {referralStats?.referrals?.length > 0 ? (
          <div className="referral-table-container">
            <table className="referral-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Sign-Up Date</th>
                  <th>Bonus Earned</th>
                </tr>
              </thead>
              <tbody>
                {referralStats.referrals.map((referral) => (
                  <tr key={referral.id}>
                    <td>{referral.username || 'N/A'}</td>
                    <td>{new Date(referral.signupDate).toLocaleDateString()}</td>
                    <td>${(referral.bonusEarned || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No referrals yet.</p>
        )}
        <button
          onClick={() => withdrawBonusMutation.mutate()}
          className="withdraw-bonus-button"
          disabled={withdrawBonusMutation.isLoading || (referralStats?.availableBonus || 0) <= 0}
          aria-label="Withdraw referral bonus"
        >
          Withdraw Bonus
        </button>
      </div>
    );
  };

  // Render loading state
  if (balanceLoading || userLoading || statsLoading || referralLoading) {
    return (
      <div className="profile-page container">
        <Header />
        <div className="loading-spinner" aria-live="polite">Loading...</div>
      </div>
    );
  }

  // Render main UI
  return (
    <div className="profile-page container">
      <Header />
      {notification && (
        <div className={`result ${notification.type}`} role="alert" aria-live="polite">
          {notification.message}
        </div>
      )}
      <h1>Profile</h1>
      <div className="profile-container">
        <div className="profile-info">
          <h2>User Information</h2>
          <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
          <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
          <p><strong>Balance:</strong> ${(balance ?? 0).toFixed(2)}</p>
          <div className="profile-button-group">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="crypto-deposit-button"
              aria-label="Deposit crypto"
              disabled={depositMutation.isLoading}
            >
              Deposit
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="crypto-withdraw-button"
              aria-label="Withdraw crypto"
              disabled={withdrawMutation.isLoading || (balance ?? 0) === 0}
            >
              Withdraw
            </button>
          </div>
        </div>
        <div className="referral-section">
          <h2>
            Referral Program
            <span
              data-tooltip-id="referral-tooltip"
              data-tooltip-content="Invite friends using your unique referral link to earn rewards when they sign up and place bets."
              className="help-icon"
            >
              ?
            </span>
          </h2>
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
              disabled={!referralLink}
            >
              Copy Link <FaCopy style={{ marginLeft: '0.5rem' }} />
            </button>
          </div>
          <button
            onClick={() => setIsReferralStatsModalOpen(true)}
            className="view-referral-stats-button"
            aria-label="View referral statistics"
            disabled={referralStatsLoading}
          >
            View Referral Stats
          </button>
        </div>
        <div className="withdrawal-password-section">
          <h2>
            Withdrawal Password
            <span
              data-tooltip-id="withdrawal-password-tooltip"
              data-tooltip-content="Set a secure password to protect your withdrawals. Required for all withdrawal transactions."
              className="help-icon"
            >
              ?
            </span>
          </h2>
          <p>Set or update your withdrawal password to secure your transactions.</p>
          <button
            onClick={() => setIsWithdrawalPasswordModalOpen(true)}
            className="set-password-button"
            aria-label="Set or update withdrawal password"
            disabled={setWithdrawalPasswordMutation.isLoading}
          >
            Set Withdrawal Password
          </button>
        </div>
        {renderBettingStats()}
      </div>
      <button
        onClick={handleLogout}
        className="logout-button"
        aria-label="Log out"
      >
        Log Out
      </button>

      {/* Update Profile Modal (unchanged) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setErrors((prev) => ({ ...prev, profile: '' }));
              }}
              className="modal-close"
              aria-label="Close update profile modal"
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
                setDepositData({ amount: '', cryptoCurrency: 'BTC', network: 'BEP20' });
                setDepositResult(null);
              }}
              className="modal-close"
              aria-label="Close deposit modal"
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
                      setDepositData({
                        ...depositData,
                        cryptoCurrency: e.target.value,
                        network: e.target.value === 'USDT' ? 'BEP20' : 'BEP20',
                      })
                    }
                    className="modal-input"
                    disabled={depositMutation.isLoading}
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                  </select>
                </div>
                {depositData.cryptoCurrency === 'USDT' && (
                  <div className="form-group">
                    <label htmlFor="network" className="modal-label">
                      Network
                      <span
                        data-tooltip-id="network-tooltip"
                        data-tooltip-content="Select the blockchain network for USDT deposits (BEP20 for Binance Smart Chain, ARBITRUM for Arbitrum, TON for The Open Network)."
                        className="help-icon"
                      >
                        ?
                      </span>
                    </label>
                    <select
                      id="network"
                      name="network"
                      value={depositData.network}
                      onChange={(e) =>
                        setDepositData({ ...depositData, network: e.target.value })
                      }
                      className="modal-input"
                      disabled={depositMutation.isLoading}
                    >
                      <option value="BEP20">BEP20 (Binance Smart Chain)</option>
                      <option value="ARBITRUM">ARBITRUM (Arbitrum)</option>
                      <option value="TON">TON (The Open Network)</option>
                    </select>
                  </div>
                )}
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
                  Send {depositResult.payAmount} {depositData.cryptoCurrency}{' '}
                  {depositData.cryptoCurrency === 'USDT' ? `(${depositData.network})` : ''} to:
                </p>
                <p className="deposit-address">{depositResult.payAddress}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(depositResult.payAddress)}
                  className="copy-button"
                  aria-label="Copy deposit address"
                >
                  Copy Address
                </button>
                <div
                  className="qr-code"
                  aria-label={`QR code for ${depositData.cryptoCurrency} deposit to ${depositResult.payAddress}`}
                >
                  <QRCodeCanvas
                    value={
                      depositData.cryptoCurrency === 'USDT'
                        ? `tether:${depositResult.payAddress}?amount=${depositResult.payAmount}&network=${depositData.network}`
                        : `${depositData.cryptoCurrency.toLowerCase()}:${depositResult.payAddress}?amount=${depositResult.payAmount}`
                    }
                  />
                </div>
                <button
                  onClick={() => {
                    setDepositResult(null);
                    setDepositData({ amount: '', cryptoCurrency: 'BTC', network: 'BEP20' });
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
                setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '', network: 'BEP20', withdrawalPassword: '' });
              }}
              className="modal-close"
              aria-label="Close withdrawal modal"
            >
              ×
            </button>
            <h2>Withdraw Crypto</h2>
            <p className="modal-note">
              Note: Your withdrawal request will be reviewed by an admin before processing.
            </p>
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
                    setWithdrawData({
                      ...withdrawData,
                      cryptoCurrency: e.target.value,
                      network: e.target.value === 'USDT' ? 'BEP20' : 'BEP20',
                    })
                  }
                  className="modal-input"
                  disabled={withdrawMutation.isLoading}
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                </select>
              </div>
              {withdrawData.cryptoCurrency === 'USDT' && (
                <div className="form-group">
                  <label htmlFor="withdraw-network" className="modal-label">
                    Network
                    <span
                      data-tooltip-id="network-tooltip"
                      data-tooltip-content="Select the blockchain network for USDT withdrawals (BEP20 for Binance Smart Chain, ARBITRUM for Arbitrum, TON for The Open Network)."
                      className="help-icon"
                    >
                      ?
                    </span>
                  </label>
                  <select
                    id="withdraw-network"
                    name="network"
                    value={withdrawData.network}
                    onChange={(e) =>
                      setWithdrawData({ ...withdrawData, network: e.target.value })
                    }
                    className="modal-input"
                    disabled={withdrawMutation.isLoading}
                  >
                    <option value="BEP20">BEP20 (Binance Smart Chain)</option>
                    <option value="ARBITRUM">ARBITRUM (Arbitrum)</option>
                    <option value="TON">TON (The Open Network)</option>
                  </select>
                </div>
              )}
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
              <div className="form-group">
                <label htmlFor="withdrawal-password" className="modal-label">
                  Withdrawal Password
                </label>
                <input
                  id="withdrawal-password"
                  type="password"
                  value={withdrawData.withdrawalPassword}
                  onChange={(e) =>
                    setWithdrawData({ ...withdrawData, withdrawalPassword: e.target.value })
                  }
                  className="modal-input"
                  placeholder="Enter withdrawal password"
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

      {/* Withdrawal Password Modal (unchanged) */}
      {isWithdrawalPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsWithdrawalPasswordModalOpen(false);
                setErrors((prev) => ({ ...prev, withdrawalPassword: '' }));
                setWithdrawalPasswordData({ password: '', confirmPassword: '' });
              }}
              className="modal-close"
              aria-label="Close withdrawal password modal"
            >
              ×
            </button>
            <h2>Set Withdrawal Password</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!withdrawalPasswordData.password || withdrawalPasswordData.password.length < 6) {
                  setErrors((prev) => ({
                    ...prev,
                    withdrawalPassword: 'Password must be at least 6 characters long',
                  }));
                  return;
                }
                setWithdrawalPasswordMutation.mutate({
                  password: withdrawalPasswordData.password,
                  confirmPassword: withdrawalPasswordData.confirmPassword,
                });
              }}
            >
              <div className="form-group">
                <label htmlFor="withdrawal-password" className="modal-label">
                  Password
                  <span
                    data-tooltip-id="password-tooltip"
                    data-tooltip-content="Password must be at least 6 characters long."
                    className="help-icon"
                  >
                    ?
                  </span>
                </label>
                <input
                  id="withdrawal-password"
                  type="password"
                  value={withdrawalPasswordData.password}
                  onChange={(e) =>
                    setWithdrawalPasswordData({
                      ...withdrawalPasswordData,
                      password: e.target.value,
                    })
                  }
                  className="modal-input"
                  placeholder="Enter withdrawal password"
                  disabled={setWithdrawalPasswordMutation.isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-withdrawal-password" className="modal-label">
                  Confirm Password
                </label>
                <input
                  id="confirm-withdrawal-password"
                  type="password"
                  value={withdrawalPasswordData.confirmPassword}
                  onChange={(e) =>
                    setWithdrawalPasswordData({
                      ...withdrawalPasswordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="modal-input"
                  placeholder="Confirm withdrawal password"
                  disabled={setWithdrawalPasswordMutation.isLoading}
                />
              </div>
              {errors.withdrawalPassword && (
                <p className="modal-error">{errors.withdrawalPassword}</p>
              )}
              <button
                type="submit"
                className="modal-submit"
                disabled={setWithdrawalPasswordMutation.isLoading}
              >
                Set Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Referral Stats Modal (unchanged) */}
      {isReferralStatsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsReferralStatsModalOpen(false);
                setErrors((prev) => ({ ...prev, referralStats: '' }));
              }}
              className="modal-close"
              aria-label="Close referral stats modal"
            >
              ×
            </button>
            {renderReferralStats()}
          </div>
        </div>
      )}

      {/* Tooltips */}
      <Tooltip id="referral-tooltip" place="top" variant="dark" />
      <Tooltip id="network-tooltip" place="top" variant="dark" />
      <Tooltip id="pending-tooltip" place="top" variant="dark" />
      <Tooltip id="password-tooltip" place="top" variant="dark" />
      <Tooltip id="withdrawal-password-tooltip" place="top" variant="dark" />

      <a
        href="https://t.me/+gqAMTbDYX6cxOGY0"
        className="telegram-floating"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our Telegram community"
      >
        <img
          src={TelegramLogo}
          alt="Telegram Logo"
          className="telegram-logo"
          loading="lazy"
        />
      </a>
    </div>
  );
}

export default Profile;
