import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBalance } from '../context/BalanceContext';
import Header from '../components/header';
import '../styles/profile.css';
import { FaUser, FaCopy } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { QRCodeCanvas } from 'qrcode.react';
import TelegramLogo from '../assets/Telegram-logo.png';
import { Tooltip } from 'react-tooltip';
import { jwtDecode } from 'jwt-decode';
import TransactionLogo from '../assets/Transaction-logo.png';
import PaystackPop from '@paystack/inline-js'; // Import Paystack

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// Utility to check if token is expired
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

// API Functions (Existing)
const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const response = await fetch(`${API_URL}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    if (response.status === 401) throw new Error('Authentication required');
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
    if (response.status === 401) throw new Error('Authentication required');
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
    if (response.status === 401) throw new Error('Authentication required');
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
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(errorData || `Referral stats fetch failed: ${response.status}`);
  }
  return response.json();
};

const fetchTransactionHistory = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const response = await fetch(`${API_URL}/api/transactions/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Unknown error');
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(errorData || `Transaction history fetch failed: ${response.status}`);
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
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(errorData || `Profile update failed: ${response.status}`);
  }
  return response.json();
};

const initiateDeposit = async ({ amount, currency, cryptoCurrency, network }) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');
  const payload = { amount, currency };
  if (currency === 'crypto' && cryptoCurrency) {
    payload.cryptoCurrency = cryptoCurrency;
    if (cryptoCurrency === 'USDT') {
      payload.network = network;
    }
  }
  const endpoint = currency === 'crypto' ? '/api/transactions/crypto-deposit' : '/api/transactions/paystack-deposit';
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(errorData.error || `Deposit initiation failed: ${response.status}`);
  }
  return response.json();
};

const initiateWithdrawal = async ({ amount, currency, cryptoCurrency, walletAddress, bankCode, accountNumber, network, withdrawalPassword }) => {
  const token = localStorage.getItem('token');
  console.log('Token sent in withdrawal request:', token); // Debug
  if (!token) throw new Error('Authentication required. Please log in.');
  const payload = { amount, currency, withdrawalPassword };
  if (currency === 'crypto') {
    payload.cryptoCurrency = cryptoCurrency;
    payload.walletAddress = walletAddress;
    if (cryptoCurrency === 'USDT') {
      payload.network = network;
    }
  } else {
    payload.bankCode = bankCode;
    payload.accountNumber = accountNumber;
  }
  const endpoint = currency === 'crypto' ? '/api/transactions/crypto-withdrawal' : '/api/transactions/paystack-withdrawal';
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    if (response.status === 401) throw new Error('Authentication required');
    throw new Error(errorData.error || `Withdrawal initiation failed: ${response.status}`);
  }
  return response.json();
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
    if (response.status === 401) throw new Error('Authentication required');
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
    if (response.status === 401) throw new Error('Authentication required');
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
  const [isTransactionHistoryModalOpen, setIsTransactionHistoryModalOpen] = useState(false);
  const [depositResult, setDepositResult] = useState(null);
  const [formData, setFormData] = useState({ username: '' });
  const [depositData, setDepositData] = useState({
    amount: '',
    currency: 'crypto',
    cryptoCurrency: 'BTC',
    network: 'BEP20',
  });
  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    currency: 'crypto',
    cryptoCurrency: 'BTC',
    walletAddress: '',
    bankCode: '',
    accountNumber: '',
    network: 'BEP20',
    withdrawalPassword: '',
    showWithdrawalPassword: false,
  });
  const [withdrawalPasswordData, setWithdrawalPasswordData] = useState({
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
  });
  const [errors, setErrors] = useState({
    profile: '',
    deposit: '',
    withdraw: '',
    referralStats: '',
    withdrawalPassword: '',
    transactionHistory: '',
  });
  const [notification, setNotification] = useState(null);
  const [referralLink, setReferralLink] = useState('');
  const [bankCodes] = useState([
    { code: '044', name: 'Access Bank' },
    { code: '063', name: 'Diamond Bank (Access)' },
    { code: '050', name: 'Ecobank' },
    { code: '070', name: 'Fidelity Bank' },
    { code: '011', name: 'First Bank' },
    { code: '214', name: 'FCMB' },
    { code: '058', name: 'GTBank' },
    { code: '030', name: 'Heritage Bank' },
    { code: '301', name: 'Jaiz Bank' },
    { code: '082', name: 'Keystone Bank' },
    { code: '101', name: 'Providus Bank' },
    { code: '076', name: 'Polaris Bank' },
    { code: '221', name: 'Stanbic IBTC' },
    { code: '068', name: 'Standard Chartered' },
    { code: '232', name: 'Sterling Bank' },
    { code: '100', name: 'Suntrust Bank' },
    { code: '032', name: 'Union Bank' },
    { code: '033', name: 'UBA' },
    { code: '215', name: 'Unity Bank' },
    { code: '035', name: 'Wema Bank' },
    { code: '057', name: 'Zenith Bank' },
  ]);

  // Handle authentication errors
  const handleAuthError = () => {
    setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
    localStorage.removeItem('token');
    queryClient.clear();
    setBalance(0);
    setFormData({ username: '' });
    setDepositResult(null);
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  // Proactive token expiration check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      handleAuthError();
    }

    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken && isTokenExpired(currentToken)) {
        handleAuthError();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [handleAuthError]);

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
        handleAuthError();
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
        handleAuthError();
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
        handleAuthError();
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
        handleAuthError();
      }
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  // Fetch transaction history
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useQuery({
    queryKey: ['transactionHistory'],
    queryFn: fetchTransactionHistory,
    enabled: isTransactionHistoryModalOpen,
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setErrors((prev) => ({ ...prev, transactionHistory: errorMessage }));
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError();
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
        queryClient.clear();
        setBalance(0);
        setFormData({ username: '' });
        setDepositResult(null);
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
  }, [navigate, queryClient, setBalance]);

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
  if (depositData.currency === 'crypto') {
    if (depositData.cryptoCurrency === 'USDT' && !['BEP20', 'ARBITRUM', 'TON'].includes(depositData.network)) {
      setErrors((prev) => ({ ...prev, deposit: 'Please select a valid USDT network (BEP20, ARBITRUM, or TON)' }));
      return;
    }
    if (amount < 1000) { // Changed from 4500 to 1000
      setErrors((prev) => ({ ...prev, deposit: 'Minimum deposit amount is ₦1,000' }));
      return;
    }
    depositMutation.mutate({
      amount,
      currency: depositData.currency,
      cryptoCurrency: depositData.cryptoCurrency,
      network: depositData.cryptoCurrency === 'USDT' ? depositData.network : undefined,
    });
  } else {
    if (amount < 1000) { // Changed from 4500 to 1000
      setErrors((prev) => ({ ...prev, deposit: 'Minimum deposit amount is ₦1,000' }));
      return;
    }
    depositMutation.mutate(
      { amount, currency: 'NGN' },
      {
        onSuccess: (data) => {
          const paystack = new PaystackPop();
          paystack.newTransaction({
            key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
            email: user.email,
            amount: amount * 100, // Convert to kobo
            currency: 'NGN',
            reference: data.reference,
            onSuccess: () => {
              setNotification({ type: 'success', message: 'Deposit successful!' });
              queryClient.invalidateQueries(['userProfile']);
              queryClient.invalidateQueries(['transactionHistory']);
              setIsDepositModalOpen(false);
              setDepositData({ amount: '', currency: 'crypto', cryptoCurrency: 'BTC', network: 'BEP20' });
              setDepositResult(null);
            },
            onCancel: () => {
              setNotification({ type: 'info', message: 'Deposit cancelled.' });
              setIsDepositModalOpen(false);
              setDepositData({ amount: '', currency: 'crypto', cryptoCurrency: 'BTC', network: 'BEP20' });
              setDepositResult(null);
            },
          });
        },
      }
    );
  }
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
    if (amount < 1500) { // ~$10 at ₦1500/$
      setErrors((prev) => ({ ...prev, withdraw: 'Minimum withdrawal amount is ₦1,500' }));
      return;
    }
    if (withdrawData.currency === 'crypto') {
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
    } else {
      if (!withdrawData.bankCode || !/^\d{3}$/.test(withdrawData.bankCode)) {
        setErrors((prev) => ({ ...prev, withdraw: 'Please select a valid bank' }));
        return;
      }
      if (!withdrawData.accountNumber || !/^\d{10}$/.test(withdrawData.accountNumber)) {
        setErrors((prev) => ({ ...prev, withdraw: 'Please enter a valid 10-digit account number' }));
        return;
      }
    }
    if (!withdrawData.withdrawalPassword) {
      setErrors((prev) => ({ ...prev, withdraw: 'Please enter your withdrawal password' }));
      return;
    }
    withdrawMutation.mutate({
      amount,
      currency: withdrawData.currency,
      cryptoCurrency: withdrawData.currency === 'crypto' ? withdrawData.cryptoCurrency : undefined,
      walletAddress: withdrawData.currency === 'crypto' ? withdrawData.walletAddress : undefined,
      bankCode: withdrawData.currency === 'NGN' ? withdrawData.bankCode : undefined,
      accountNumber: withdrawData.currency === 'NGN' ? withdrawData.accountNumber : undefined,
      network: withdrawData.currency === 'crypto' && withdrawData.cryptoCurrency === 'USDT' ? withdrawData.network : undefined,
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
        queryClient.clear();
        setBalance(0);
        setFormData({ username: '' });
        setDepositResult(null);
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
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setErrors((prev) => ({ ...prev, profile: errorMessage }));
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError();
      }
    },
  });

  const depositMutation = useMutation({
    mutationFn: initiateDeposit,
    onSuccess: (data) => {
      if (depositData.currency === 'crypto') {
        setDepositResult(data);
      }
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
        handleAuthError();
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
      setWithdrawData({
        amount: '',
        currency: 'crypto',
        cryptoCurrency: 'BTC',
        walletAddress: '',
        bankCode: '',
        accountNumber: '',
        network: 'BEP20',
        withdrawalPassword: '',
        showWithdrawalPassword: false,
      });
      setErrors((prev) => ({ ...prev, withdraw: '' }));
      setNotification({ type: 'success', message: data.message || 'Withdrawal request submitted for admin review!' });
      queryClient.invalidateQueries(['transactionHistory']);
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setErrors((prev) => ({ ...prev, withdraw: errorMessage }));
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError();
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
      queryClient.invalidateQueries(['transactionHistory']);
    },
    onError: (err) => {
      const errorMessage = err.message.includes('Authentication required')
        ? 'Session expired. Please log in again.'
        : err.message;
      setNotification({ type: 'error', message: errorMessage });
      if (err.message.includes('Authentication required')) {
        handleAuthError();
      }
    },
  });

  const setWithdrawalPasswordMutation = useMutation({
    mutationFn: setWithdrawalPassword,
    onSuccess: () => {
      setIsWithdrawalPasswordModalOpen(false);
      setWithdrawalPasswordData({
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
      });
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
        handleAuthError();
      }
    },
  });

  // Render betting stats
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

  // Render referral stats modal content
  const renderReferralStats = () => {
    if (referralStatsLoading) return <div className="loading-spinner" aria-live="polite">Loading referral stats...</div>;
    if (referralStatsError) return <p className="error" role="alert">{errors.referralStats}</p>;

    return (
      <div className="referral-stats-content">
        <h3>Referral Statistics</h3>
        <p><strong>Total Referrals:</strong> {referralStats?.totalReferrals || 0}</p>
        <p><strong>Total Bonus Earned:</strong> ₦{(referralStats?.totalBonus || 0).toFixed(2)}</p>
        <p><strong>Available Bonus:</strong> ₦{(referralStats?.availableBonus || 0).toFixed(2)}</p>
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
                    <td>₦{(referral.bonusEarned || 0).toFixed(2)}</td>
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
          <p><strong>Balance:</strong> ₦{(balance ?? 0).toFixed(2)}</p>
          <div className="profile-button-group">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="crypto-deposit-button"
              aria-label="Deposit funds"
              disabled={depositMutation.isLoading}
            >
              Deposit
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="crypto-withdraw-button"
              aria-label="Withdraw funds"
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

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsDepositModalOpen(false);
                setErrors((prev) => ({ ...prev, deposit: '' }));
                setDepositData({ amount: '', currency: 'crypto', cryptoCurrency: 'BTC', network: 'BEP20' });
                setDepositResult(null);
              }}
              className="modal-close"
              aria-label="Close deposit modal"
            >
              ×
            </button>
            <h2>Deposit Funds</h2>
            {!depositResult ? (
              <form onSubmit={handleDeposit}>
                <div className="form-group">
                  <label htmlFor="deposit-amount" className="modal-label">
                    Amount (NGN)
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
                    placeholder="Enter amount in NGN"
                    disabled={depositMutation.isLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currency" className="modal-label">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={depositData.currency}
                    onChange={(e) =>
                      setDepositData({
                        ...depositData,
                        currency: e.target.value,
                        cryptoCurrency: e.target.value === 'crypto' ? 'BTC' : undefined,
                        network: e.target.value === 'crypto' ? 'BEP20' : undefined,
                      })
                    }
                    className="modal-input"
                    disabled={depositMutation.isLoading}
                  >
                    <option value="crypto">Cryptocurrency</option>
                    <option value="NGN">Naira (NGN)</option>
                  </select>
                </div>
                {depositData.currency === 'crypto' && (
                  <>
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
                  </>
                )}
                {errors.deposit && <p className="modal-error">{errors.deposit}</p>}
                <button
                  type="submit"
                  className="modal-submit"
                  disabled={depositMutation.isLoading}
                >
                  {depositData.currency === 'crypto' ? 'Get Deposit Address' : 'Proceed to Payment'}
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
                    setDepositData({ amount: '', currency: 'crypto', cryptoCurrency: 'BTC', network: 'BEP20' });
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

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsWithdrawModalOpen(false);
                setErrors((prev) => ({ ...prev, withdraw: '' }));
                setWithdrawData({
                  amount: '',
                  currency: 'crypto',
                  cryptoCurrency: 'BTC',
                  walletAddress: '',
                  bankCode: '',
                  accountNumber: '',
                  network: 'BEP20',
                  withdrawalPassword: '',
                  showWithdrawalPassword: false,
                });
              }}
              className="modal-close"
              aria-label="Close withdrawal modal"
            >
              ×
            </button>
            <h2>Withdraw Funds</h2>
            <p className="modal-note">
              Note: Your withdrawal request will be reviewed by an admin before processing.
            </p>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label htmlFor="withdraw-amount" className="modal-label">
                  Amount (NGN)
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
                  placeholder="Enter withdrawal amount in NGN"
                  disabled={withdrawMutation.isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="currency" className="modal-label">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={withdrawData.currency}
                  onChange={(e) =>
                    setWithdrawData({
                      ...withdrawData,
                      currency: e.target.value,
                      cryptoCurrency: e.target.value === 'crypto' ? 'BTC' : undefined,
                      network: e.target.value === 'crypto' ? 'BEP20' : undefined,
                      walletAddress: '',
                      bankCode: '',
                      accountNumber: '',
                    })
                  }
                  className="modal-input"
                  disabled={withdrawMutation.isLoading}
                >
                  <option value="crypto">Cryptocurrency</option>
                  <option value="NGN">Naira (NGN)</option>
                </select>
              </div>
              {withdrawData.currency === 'crypto' && (
                <>
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
                </>
              )}
              {withdrawData.currency === 'NGN' && (
                <>
                  <div className="form-group">
                    <label htmlFor="bank-code" className="modal-label">
                      Bank
                    </label>
                    <select
                      id="bank-code"
                      name="bankCode"
                      value={withdrawData.bankCode}
                      onChange={(e) =>
                        setWithdrawData({ ...withdrawData, bankCode: e.target.value })
                      }
                      className="modal-input"
                      disabled={withdrawMutation.isLoading}
                    >
                      <option value="">Select Bank</option>
                      {bankCodes.map((bank) => (
                        <option key={bank.code} value={bank.code}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="account-number" className="modal-label">
                      Account Number
                    </label>
                    <input
                      id="account-number"
                      type="text"
                      value={withdrawData.accountNumber}
                      onChange={(e) =>
                        setWithdrawData({ ...withdrawData, accountNumber: e.target.value })
                      }
                      className="modal-input"
                      placeholder="Enter 10-digit account number"
                      disabled={withdrawMutation.isLoading}
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label htmlFor="withdrawal-password" className="modal-label">
                  Withdrawal Password
                </label>
                <div className="password-wrapper">
                  <input
                    id="withdrawal-password"
                    type={withdrawData.showWithdrawalPassword ? 'text' : 'password'}
                    value={withdrawData.withdrawalPassword}
                    onChange={(e) =>
                      setWithdrawData({ ...withdrawData, withdrawalPassword: e.target.value })
                    }
                    className="modal-input password-input"
                    placeholder="Enter withdrawal password"
                    disabled={withdrawMutation.isLoading}
                  />
                  <span
                    className="eye-icon"
                    onClick={() =>
                      setWithdrawData({
                        ...withdrawData,
                        showWithdrawalPassword: !withdrawData.showWithdrawalPassword,
                      })
                    }
                    aria-label={withdrawData.showWithdrawalPassword ? 'Hide password' : 'Show password'}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      setWithdrawData({
                        ...withdrawData,
                        showWithdrawalPassword: !withdrawData.showWithdrawalPassword,
                      })
                    }
                  >
                    {withdrawData.showWithdrawalPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </div>
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

      {/* Withdrawal Password Modal */}
      {isWithdrawalPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsWithdrawalPasswordModalOpen(false);
                setErrors((prev) => ({ ...prev, withdrawalPassword: '' }));
                setWithdrawalPasswordData({
                  password: '',
                  confirmPassword: '',
                  showPassword: false,
                  showConfirmPassword: false,
                });
              }}
              className="modal-close"
              aria-label="Close withdrawal password modal"
            >
              ×
            </button>
            <h2>Set Withdrawal Password</h2>
            <p className="modal-note">
              Keep your withdrawal password in a safe place to avoid forgetting it.
            </p>
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
                <div className="password-wrapper">
                  <input
                    id="withdrawal-password"
                    type={withdrawalPasswordData.showPassword ? 'text' : 'password'}
                    value={withdrawalPasswordData.password}
                    onChange={(e) =>
                      setWithdrawalPasswordData({
                        ...withdrawalPasswordData,
                        password: e.target.value,
                      })
                    }
                    className="modal-input password-input"
                    placeholder="Enter withdrawal password"
                    disabled={setWithdrawalPasswordMutation.isLoading}
                  />
                  <span
                    className="eye-icon"
                    onClick={() =>
                      setWithdrawalPasswordData({
                        ...withdrawalPasswordData,
                        showPassword: !withdrawalPasswordData.showPassword,
                      })
                    }
                    aria-label={withdrawalPasswordData.showPassword ? 'Hide password' : 'Show password'}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      setWithdrawalPasswordData({
                        ...withdrawalPasswordData,
                        showPassword: !withdrawalPasswordData.showPassword,
                      })
                    }
                  >
                    {withdrawalPasswordData.showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirm-withdrawal-password" className="modal-label">
                  Confirm Password
                </label>
                <div className="password-wrapper">
                  <input
                    id="confirm-withdrawal-password"
                    type={withdrawalPasswordData.showConfirmPassword ? 'text' : 'password'}
                    value={withdrawalPasswordData.confirmPassword}
                    onChange={(e) =>
                      setWithdrawalPasswordData({
                        ...withdrawalPasswordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="modal-input password-input"
                    placeholder="Confirm withdrawal password"
                    disabled={setWithdrawalPasswordMutation.isLoading}
                  />
                  <span
                    className="eye-icon"
                    onClick={() =>
                      setWithdrawalPasswordData({
                        ...withdrawalPasswordData,
                        showConfirmPassword: !withdrawalPasswordData.showConfirmPassword,
                      })
                    }
                    aria-label={withdrawalPasswordData.showConfirmPassword ? 'Hide password' : 'Show password'}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      setWithdrawalPasswordData({
                        ...withdrawalPasswordData,
                        showConfirmPassword: !withdrawalPasswordData.showConfirmPassword,
                      })
                    }
                  >
                    {withdrawalPasswordData.showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </div>
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

      {/* Referral Stats Modal */}
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

      {/* Transaction History Modal */}
      {isTransactionHistoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => {
                setIsTransactionHistoryModalOpen(false);
                setErrors((prev) => ({ ...prev, transactionHistory: '' }));
              }}
              className="modal-close"
              aria-label="Close transaction history modal"
            >
              ×
            </button>
            <h2>Transaction History</h2>
            {transactionsLoading ? (
              <div className="loading-spinner" aria-live="polite">Loading transaction history...</div>
            ) : transactionsError ? (
              <p className="modal-error" role="alert">{errors.transactionHistory}</p>
            ) : transactions && transactions.length > 0 ? (
              <div className="transaction-table-container">
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Currency</th>
                      <th>Network</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                        <td>₦{transaction.amount.toFixed(2)}</td>
                        <td>{transaction.currency}</td>
                        <td>{transaction.network || 'N/A'}</td>
                        <td>{transaction.status}</td>
                        <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                        <td>
                          {transaction.type.includes('deposit') ? (
                            transaction.transactionId || 'N/A'
                          ) : transaction.type.includes('crypto') ? (
                            transaction.walletAddress || 'N/A'
                          ) : (
                            `${transaction.bankCode || 'N/A'}/${transaction.accountNumber || 'N/A'}`
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No transactions found.</p>
            )}
            <button
              onClick={() => queryClient.invalidateQueries(['transactionHistory'])}
              className="refresh-transactions-button"
              aria-label="Refresh transaction history"
              disabled={transactionsLoading}
            >
              Refresh Transactions
            </button>
          </div>
        </div>
      )}

      {/* Tooltips */}
      <Tooltip id="referral-tooltip" place="top" variant="dark" />
      <Tooltip id="network-tooltip" place="top" variant="dark" />
      <Tooltip id="pending-tooltip" place="top" variant="dark" />
      <Tooltip id="password-tooltip" place="top" variant="dark" />
      <Tooltip id="withdrawal-password-tooltip" place="top" variant="dark" />

      <button
        className="transaction-floating"
        onClick={() => setIsTransactionHistoryModalOpen(true)}
        aria-label="View transaction history"
      >
        <img
          src={TransactionLogo}
          alt="Transaction Logo"
          className="transaction-logo"
          loading="lazy"
        />
      </button>

      <a
        href="https://t.me/+UvOuNd3fzNRjOTk0"
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
