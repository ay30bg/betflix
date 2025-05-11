// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useBalance } from '../context/BalanceContext';
// import Header from '../components/header';
// import '../styles/profile.css';
// import { FaUser, FaCopy } from 'react-icons/fa';
// import { QRCodeCanvas } from 'qrcode.react';

// const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// // Fetch user profile (excluding balance, as it's handled by BalanceContext)
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

// // Fetch stats
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
//   return response.json();
// };

// // Fetch referral link
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

// // Update profile
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

// // Initiate deposit
// const initiateDeposit = async ({ amount, cryptoCurrency, network }) => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required. Please log in.');
//   const payload = { amount, cryptoCurrency };
//   if (cryptoCurrency === 'USDT') {
//     payload.network = network; // Include network for USDT
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

// // Initiate withdrawal
// const initiateWithdrawal = async ({ amount, cryptoCurrency, walletAddress, network }) => {
//   const token = localStorage.getItem('token');
//   if (!token) throw new Error('Authentication required. Please log in.');
//   const payload = { amount, cryptoCurrency, walletAddress };
//   if (cryptoCurrency === 'USDT') {
//     payload.network = network; // Include network for USDT
//   }
//   const response = await fetch(`${API_URL}/api/transactions/crypto-withdrawal`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(payload),
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//     throw new Error(errorData.error || `Withdrawal initiation failed: ${response.status}`);
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
//   const [depositResult, setDepositResult] = useState(null);
//   const [formData, setFormData] = useState({ username: '' });
//   const [depositData, setDepositData] = useState({ amount: '', cryptoCurrency: 'BTC', network: 'ERC20' });
//   const [withdrawData, setWithdrawData] = useState({ amount: '', cryptoCurrency: 'BTC', walletAddress: '', network: 'ERC20' });
//   const [errors, setErrors] = useState({ profile: '', deposit: '', withdraw: '' });
//   const [notification, setNotification] = useState(null);

//   // Fetch user profile (for username, email, etc.)
//   const { data: user, isLoading: userLoading, error: userError } = useQuery({
//     queryKey: ['userProfile'],
//     queryFn: fetchUserProfile,
//     onSuccess: (data) => {
//       setFormData({ username: data.username || '' });
//     },
//     onError: (err) => {
//       setNotification({ type: 'error', message: err.message });
//       if (err.message.includes('log in')) {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('log in'),
//   });

//   // Fetch stats
//   const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
//     queryKey: ['stats'],
//     queryFn: fetchStats,
//     onError: (err) => {
//       setNotification({ type: 'error', message: err.message });
//       if (err.message.includes('log in')) {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('log in'),
//   });

//   // Fetch referral link
//   const { data: referralData, isLoading: referralLoading, error: referralError } = useQuery({
//     queryKey: ['referralLink'],
//     queryFn: fetchReferralLink,
//     onError: (err) => {
//       setNotification({ type: 'error', message: err.message });
//       if (err.message.includes('log in')) {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('log in'),
//   });

//   const [referralLink, setReferralLink] = useState('');

//   useEffect(() => {
//     if (referralData?.referralLink) {
//       setReferralLink(referralData.referralLink);
//     }
//   }, [referralData]);

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
//       setErrors((prev) => ({ ...prev, profile: err.message }));
//       setNotification({ type: 'error', message: err.message });
//       if (err.message.includes('log in')) {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     },
//   });

//   const depositMutation = useMutation({
//     mutationFn: initiateDeposit,
//     onSuccess: (data) => {
//       setDepositResult(data);
//       setErrors((prev) => ({ ...prev, deposit: '' }));
//       // Optionally refetch balance after deposit
//       queryClient.invalidateQueries(['userProfile']);
//     },
//     onError: (err) => {
//       setErrors((prev) => ({ ...prev, deposit: err.message }));
//       setNotification({ type: 'error', message: err.message });
//       if (err.message.includes('log in')) {
//         localStorage.removeItem('token');
//         navigate('/login');
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
//       setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '', network: 'ERC20' });
//       setErrors((prev) => ({ ...prev, withdraw: '' }));
//       setNotification({ type: 'success', message: data.message || 'Withdrawal initiated!' });
//     },
//     onError: (err) => {
//       setErrors((prev) => ({ ...prev, withdraw: err.message }));
//       setNotification({ type: 'error', message: err.message });
//       if (err.message.includes('log in')) {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     },
//   });

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
//     if (depositData.cryptoCurrency === 'USDT' && !['ERC20', 'TRC20'].includes(depositData.network)) {
//       setErrors((prev) => ({ ...prev, deposit: 'Please select a valid USDT network (ERC20 or TRC20)' }));
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
//     if (withdrawData.cryptoCurrency === 'USDT' && !['ERC20', 'TRC20'].includes(withdrawData.network)) {
//       setErrors((prev) => ({ ...prev, withdraw: 'Please select a valid USDT network (ERC20 or TRC20)' }));
//       return;
//     }
//     withdrawMutation.mutate({
//       amount,
//       cryptoCurrency: withdrawData.cryptoCurrency,
//       walletAddress: withdrawData.walletAddress,
//       network: withdrawData.cryptoCurrency === 'USDT' ? withdrawData.network : undefined,
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

//   if (balanceLoading || userLoading || statsLoading || referralLoading) {
//     return (
//       <div className="profile-page container">
//         <Header />
//         <div className="loading-spinner" aria-live="polite">Loading...</div>
//       </div>
//     );
//   }

//   if (balanceError || userError || statsError || referralError) {
//     return (
//       <div className="profile-page container">
//         <Header />
//         <p className="profile-error" role="alert">
//           {notification?.message || balanceError?.message || userError?.message || statsError?.message || referralError?.message || 'Failed to load profile data. Please try again or log in.'}
//         </p>
//         <button
//           onClick={() => navigate('/login')}
//           className="login-button"
//           aria-label="Log In"
//         >
//           Log In
//         </button>
//       </div>
//     );
//   }

//   if (!user || !stats) {
//     return (
//       <div className="profile-page container">
//         <Header />
//         <p className="profile-error" role="alert">
//           No data available. Please log in or try again.
//         </p>
//         <button
//           onClick={() => navigate('/login')}
//           className="login-button"
//           aria-label="Log In"
//         >
//           Log In
//         </button>
//       </div>
//     );
//   }

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
//           <p><strong>Username:</strong> {user.username || 'N/A'}</p>
//           <p><strong>Email:</strong> {user.email || 'N/A'}</p>
//           <p><strong>Balance:</strong> ${(balance ?? 0).toFixed(2)}</p>
//           <div className="profile-button-group">
// {/*             <button
//               onClick={() => setIsModalOpen(true)}
//               className="update-profile-button"
//               aria-label="Update profile"
//               disabled={updateProfileMutation.isLoading}
//             >
//               <FaUser />
//             </button> */}
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
//               disabled={!referralLink}
//             >
//               Copy Link <FaCopy style={{ marginLeft: '0.5rem' }} />
//             </button>
//           </div>
//         </div>
//         <div className="betting-stats">
//           <h2>Betting Statistics</h2>
//           <p><strong>Total Bets:</strong> {stats.totalBets || 0}</p>
//           <p><strong>Wins:</strong> {stats.wins || 0}</p>
//           <p><strong>Losses:</strong> {stats.losses || 0}</p>
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
//                 setDepositData({ amount: '', cryptoCurrency: 'BTC', network: 'ERC20' });
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
//                         network: e.target.value === 'USDT' ? 'ERC20' : 'ERC20',
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
//                       <option value="ERC20">ERC20 (Ethereum)</option>
//                       <option value="TRC20">TRC20 (TRON)</option>
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
//                     setDepositData({ amount: '', cryptoCurrency: 'BTC', network: 'ERC20' });
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
//                 setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '', network: 'ERC20' });
//               }}
//               className="modal-close"
//               aria-label="Close withdrawal modal"
//             >
//               ×
//             </button>
//             <h2>Withdraw Crypto</h2>
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
//                       network: e.target.value === 'USDT' ? 'ERC20' : 'ERC20',
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
//                     <option value="ERC20">ERC20 (Ethereum)</option>
//                     <option value="TRC20">TRC20 (TRON)</option>
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
import { Tooltip } from 'react-tooltip'; // Use named import for react-tooltip v5

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// Fetch user profile
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

// Fetch stats
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
  return response.json();
};

// Fetch referral link
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

// Update profile
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

// Initiate deposit
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

// Initiate withdrawal
const initiateWithdrawal = async ({ amount, cryptoCurrency, walletAddress, network }) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const payload = { amount, cryptoCurrency, walletAddress };
  if (cryptoCurrency === 'USDT') {
    payload.network = network;
  }
  const response = await fetch(`${API_URL}/api/transactions/crypto-withdrawal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Withdrawal initiation failed: ${response.status}`);
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
  const [depositResult, setDepositResult] = useState(null);
  const [formData, setFormData] = useState({ username: '' });
  const [depositData, setDepositData] = useState({ amount: '', cryptoCurrency: 'BTC', network: 'ERC20' });
  const [withdrawData, setWithdrawData] = useState({ amount: '', cryptoCurrency: 'BTC', walletAddress: '', network: 'ERC20' });
  const [errors, setErrors] = useState({ profile: '', deposit: '', withdraw: '' });
  const [notification, setNotification] = useState(null);
  const [referralLink, setReferralLink] = useState('');

  // Fetch user profile
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    onSuccess: (data) => {
      setFormData({ username: data.username || '' });
    },
    onError: (err) => {
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('log in'),
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    onError: (err) => {
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('log in'),
  });

  // Fetch referral link
  const { data: referralData, isLoading: referralLoading, error: referralError } = useQuery({
    queryKey: ['referralLink'],
    queryFn: fetchReferralLink,
    onError: (err) => {
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('log in'),
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
    if (depositData.cryptoCurrency === 'USDT' && !['ERC20', 'TRC20'].includes(depositData.network)) {
      setErrors((prev) => ({ ...prev, deposit: 'Please select a valid USDT network (ERC20 or TRC20)' }));
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
    if (!withdrawData.walletAddress || !/^[a-zA-Z0-9]{26,42}$/.test(withdrawData.walletAddress)) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please enter a valid wallet address' }));
      return;
    }
    if (withdrawData.cryptoCurrency === 'USDT' && !['ERC20', 'TRC20'].includes(withdrawData.network)) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please select a valid USDT network (ERC20 or TRC20)' }));
      return;
    }
    withdrawMutation.mutate({
      amount,
      cryptoCurrency: withdrawData.cryptoCurrency,
      walletAddress: withdrawData.walletAddress,
      network: withdrawData.cryptoCurrency === 'USDT' ? withdrawData.network : undefined,
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
      if (err.message.includes('log in')) {
        localStorage.removeItem('token');
        navigate('/login');
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
      setErrors((prev) => ({ ...prev, deposit: err.message }));
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) {
        localStorage.removeItem('token');
        navigate('/login');
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
      setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '', network: 'ERC20' });
      setErrors((prev) => ({ ...prev, withdraw: '' }));
      setNotification({ type: 'success', message: data.message || 'Withdrawal initiated!' });
    },
    onError: (err) => {
      setErrors((prev) => ({ ...prev, withdraw: err.message }));
      setNotification({ type: 'error', message: err.message });
      if (err.message.includes('log in')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    },
  });

  if (balanceLoading || userLoading || statsLoading || referralLoading) {
    return (
      <div className="profile-page container">
        <Header />
        <div className="loading-spinner" aria-live="polite">Loading...</div>
      </div>
    );
  }

  if (balanceError || userError || statsError || referralError) {
    return (
      <div className="profile-page container">
        <Header />
        <p className="profile-error" role="alert">
          {notification?.message || balanceError?.message || userError?.message || statsError?.message || referralError?.message || 'Failed to load profile data. Please try again or log in.'}
        </p>
        <button
          onClick={() => navigate('/login')}
          className="login-button"
          aria-label="Log In"
        >
          Log In
        </button>
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <div className="profile-page container">
        <Header />
        <p className="profile-error" role="alert">
          No data available. Please log in or try again.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="login-button"
          aria-label="Log In"
        >
          Log In
        </button>
      </div>
    );
  }

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
          <p><strong>Username:</strong> {user.username || 'N/A'}</p>
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
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
        </div>
        <div className="betting-stats">
          <h2>Betting Statistics</h2>
          <p><strong>Total Bets:</strong> {stats.totalBets || 0}</p>
          <p><strong>Wins:</strong> {stats.wins || 0}</p>
          <p><strong>Losses:</strong> {stats.losses || 0}</p>
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
                setDepositData({ amount: '', cryptoCurrency: 'BTC', network: 'ERC20' });
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
                        network: e.target.value === 'USDT' ? 'ERC20' : 'ERC20',
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
                        data-tooltip-content="Select the blockchain network for USDT deposits (ERC20 for Ethereum, TRC20 for TRON)."
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
                      <option value="ERC20">ERC20 (Ethereum)</option>
                      <option value="TRC20">TRC20 (TRON)</option>
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
                    setDepositData({ amount: '', cryptoCurrency: 'BTC', network: 'ERC20' });
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
                setWithdrawData({ amount: '', cryptoCurrency: 'BTC', walletAddress: '', network: 'ERC20' });
              }}
              className="modal-close"
              aria-label="Close withdrawal modal"
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
                    setWithdrawData({
                      ...withdrawData,
                      cryptoCurrency: e.target.value,
                      network: e.target.value === 'USDT' ? 'ERC20' : 'ERC20',
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
                      data-tooltip-content="Select the blockchain network for USDT withdrawals (ERC20 for Ethereum, TRC20 for TRON)."
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
                    <option value="ERC20">ERC20 (Ethereum)</option>
                    <option value="TRC20">TRC20 (TRON)</option>
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

      {/* Tooltips */}
      <Tooltip id="referral-tooltip" place="top" variant="dark" />
      <Tooltip id="network-tooltip" place="top" variant="dark" />
    </div>
  );
}

export default Profile;
