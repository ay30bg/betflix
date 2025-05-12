// src/components/BalanceNavigator.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext';

function BalanceNavigator() {
  const navigate = useNavigate();
  const { notification } = useBalance();

  useEffect(() => {
    if (notification?.type === 'error' && notification?.message.includes('Session expired')) {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [notification, navigate]);

  return null; // This component doesn't render anything
}

export default BalanceNavigator;
