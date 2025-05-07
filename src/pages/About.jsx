import Header from '../components/header';
import '../styles/about.css';

function About() {
  return (
    <div className="about-page container">
      <Header />
      <h1>About BetFlix</h1>
      <section className="about-section">
        <h2 className="section-title">How It Works</h2>
        <p>
          BetFlix is a thrilling color prediction game. Bet on Red and Green and see if your prediction matches the result. Each round is quick, exciting, and fair!
        </p>
        <div className="section-visual">
          <div className="color-icon red"></div>
          <div className="color-icon green"></div>
        </div>
      </section>
      <section className="about-section">
        <h2 className="section-title">Provably Fair</h2>
        <p>
          Our game uses a cryptographic algorithm to ensure fairness. Admins can verify results using server seed, client seed, and nonce.
        </p>
      </section>
      <section className="about-section">
        <h2 className="section-title">Terms and Conditions</h2>
        <p>
          By using BetFlix, you agree to our Terms and Conditions. These outline the rules for participation, betting, and account management. Please review them to understand your rights and responsibilities.
        </p>
        <a href="/terms" className="terms-link">Read Full Terms</a>
      </section>
      <a href="/game" className="about-button">Start Game</a>
    </div>
  );
}

export default About;
