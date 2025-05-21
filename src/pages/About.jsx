import Header from '../components/header';
import '../styles/about.css';

function About() {
  return (
    <div className="about-page container">
      <Header />
      <h1>About BetFlix</h1>
      <section className="about-section">
        <h2 className="section-title">Provably Fair</h2>
        <p>
        BetFlix is a color prediction platform where users place bets on Red or Green colors, or directly on numbers (0-9), each round. Each number is either Green (even numbers) or Red (odd numbers).

Color-Numbers Breakdown:

Green (Even): 0, 2, 4, 6, 8

Red (Odd): 1, 3, 5, 7, 9

       </p>
        
      </section>
      <section className="about-section">
        <h2 className="section-title">How To Play</h2>
        <p>
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
      </section>
      <section className="about-section">
        <h2 className="section-title">Terms and Conditions</h2>
        <p>
          
        </p>
        <a href="/terms" className="terms-link">Read Full Terms</a>
      </section>
      <a href="/game" className="about-button">Start Game</a>
    </div>
  );
}

export default About;
