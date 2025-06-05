import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/header';
import Banner from '../assets/betflix_new_banner.png';
import TelegramLogo from '../assets/Telegram-logo.png';
import SupportLogo from '../assets/Support-logo.png';
import { jwtDecode } from 'jwt-decode'; // Named import for jwt-decode
import '../styles/home.css';

function Home() {
  const navigate = useNavigate(); // Hook for navigation
  const [notification, setNotification] = useState(null); // State for notifications

  // Utility to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); 
      return decoded.exp < currentTime;
    } catch (err) {
      console.error('Error decoding token:', err);
      return true; // Treat invalid tokens as expired
    }
  };

  // Handle automatic logout
  const handleAuthError = () => {
    setNotification({ type: 'error', message: 'Session expired. Please log in again.' });
    localStorage.removeItem('token');
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
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [navigate]);

  // Notification timeout
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  const handleSupport = () => {
    navigate('/support');
  };

  return (
    <div className="home-page">
      <Header />
      {notification && (
        <div className={`result ${notification.type}`} role="alert" aria-live="polite">
          {notification.message}
        </div>
      )}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Welcome to BetFlix</h1>
          <p className="hero-description">
            Predict between Red & Green to win big in our exciting color prediction game!
          </p>
          <div className="hero-actions">
            <Link to="/game" className="hero-button" aria-label="Start playing BetFlix">
              Start Game
            </Link>
            <Link to="/about" className="hero-button" aria-label="Learn more about BetFlix">
              Learn More
            </Link>
          </div>
        </div>
      </section>
      <div className="banner-container">
        <img
          src={Banner}
          alt="BetFlix game preview"
          className="banner-img"
          loading="lazy"
          onClick={handleSignUp}
        />
      </div>
      <button
        onClick={handleSupport}
        className="support-floating"
        aria-label="Contact support"
      >
        <img
          src={SupportLogo}
          alt="Support Logo"
          className="support-logo"
          loading="lazy"
        />
      </button>
      <a
        href="https://t.me/+xtsG3E8obfllM2M0"
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

export default Home;
