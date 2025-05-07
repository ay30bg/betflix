import { Link } from 'react-router-dom';
import Header from '../components/header';
import Banner from '../assets/betflix_banner.png';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
const navigate = useNavigate(); // Hook for navigation

const handleSignUp = () => {
  navigate('/sign-up');
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
    </div>
  );
}

export default Home;
