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
          1. General Overview
BetFlix is a color prediction game where players bet on either Red or Green colors, or specific numbers (0-9) each round. Numbers are categorized as follows:  
Green (Even Numbers): 0, 2, 4, 6, 8  

Red (Odd Numbers): 1, 3, 5, 7, 9

By participating, users agree to abide by these Terms and Conditions.
2. Gameplay Rules  
Players may bet on either a color (Red or Green) or a specific number (0-9) per round.  

Only one selection (color or number) is permitted per round.  

A maximum of two bets per round is allowed per user.  

The game operates using in-game currency, where $1 = 100 in-game currency units.  

Minimum Bet: 50 in-game currency units ($0.50).

3. Payout Structure  
Color Bet Win: Pays 1.9x the wagered amount.  

Number Bet Win: Pays 6.8x the wagered amount.

4. Deposits and Withdrawals  
Minimum Deposit: $10.50 (1,050 in-game currency units).  

Minimum Withdrawal: $10 (1,000 in-game currency units).  

Withdrawals are processed at an exchange rate of 100 in-game currency units = $1.  

All deposits and withdrawals are final and non-refundable.

5. Referral Program  
Referrers earn a 30% bonus on the first deposit made by each referred user.  

For subsequent deposits by referred users, referrers earn a 10% bonus.  

Example:  
Referred user deposits $10: Referrer earns $3 (first deposit).  

Referred user deposits another $10: Referrer earns $1.

6. Optional Betting Strategy (Martingale System)  
Players may opt to use the Martingale strategy, tripling their bet after each loss to potentially recover losses and gain Communal Assistant: profit upon winning.  

Example Progression:  
Round 1: Bet 50 units  

Round 2: If lost, bet 150 units (50 × 3)  

Round 3: If lost, bet 450 units (50 × 9)  

Round 4: If lost, bet 1,350 units (50 × 27)  

Round 5: If lost, bet 4,050 units (50 × 81)

Use of this strategy is optional, and players are solely responsible for managing their funds and understanding associated risks.

7. Player Eligibility and Responsibilities  
Players must be at least 18 years old to participate.  

All bets and deposits are final, and no refunds will be issued.  

BetFlix is not liable for any financial losses incurred through gameplay or betting strategies.  

Players are expected to engage in responsible gaming and understand the inherent risks of gambling.

8. Fair Play and Account Integrity  
A maximum of two bets per round per user is strictly enforced.  

Any attempt to manipulate game outcomes or exploit the platform will result in immediate account suspension and forfeiture of all funds.

9. Support and Inquiries  
For assistance, contact the BetFlix support team via the profile dashboard or the official BetFlix helpdesk.

10. Acceptance of Terms
By participating in BetFlix, users acknowledge and agree to comply with these Terms and Conditions. BetFlix reserves the right to modify these terms at any time, with changes effective upon posting.  


        </p>
        <a href="/terms" className="terms-link">Read Full Terms</a>
      </section>
      <a href="/game" className="about-button">Start Game</a>
    </div>
  );
}

export default About;
