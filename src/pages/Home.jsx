import { Link } from 'react-router-dom';
import Header from '../components/header';
import Banner from '../assets/betflix_banner.png';
import TelegramLogo from '../assets/Telegram-logo.png'; 
import SupportLogo from '../assets/Support-logo.png'; 
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate(); // Hook for navigation

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  const handleSupport = () => {
    navigate('/support');
  };

  return (
    <div className="home-page">
      <Header />
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
        onclick={handleSupport}
        className="support-floating"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our Telegram community"
      >
      <img
          src={SupportLogo}
          alt="Support Logo"
          className="support-logo"
          loading="lazy"
        />
      </button>
      
      <a
        href="https://t.me/your-telegram-link" // Replace with your Telegram link
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
