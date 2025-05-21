import Header from '../components/header';
import '../styles/about.css';

function About() {
  return (
    <div className="about-page container">
      <Header />
      <h1>About BetFlix</h1>
      <section className="about-section">
        <h2 className="section-title">How To Play</h2>
        <p>
         How to Play

         Users may choose to bet on either Color (Red/Green) or a specific Number.

         Only one color or number can be selected per round.

         Maximum of 2 plays per round is allowed.

        The game uses an in-game currency system:
        $1 = 100 in-game currency units

        Winning Rules

Color Bet Win: Returns x1.9 of staked amount

Number Bet Win: Returns x6.8 of staked amount


Minimum Bet per Round:

50 in-game currency units (equivalent to $0.50)

  
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
