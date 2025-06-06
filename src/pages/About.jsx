// import Header from '../components/header';
// import '../styles/about.css';

// function About() {
//   return (
//     <div className="about-page container">
//       <Header />
//       <h1>About BetFlix</h1>
//       <section className="about-section">
//         <h2 className="section-title">Provably Fair</h2>
//         <p>
//           BetFlix is a color prediction platform where users place bets on Red or Green colors, or directly on numbers (0-9), each round. Each number is either Green (even numbers) or Red (odd numbers).
//           <br />
//           <strong>Color-Numbers Breakdown:</strong>
//           <br />
//           Green (Even): 0, 2, 4, 6, 8
//           <br />
//           Red (Odd): 1, 3, 5, 7, 9
//         </p>
//       </section>
//       <section className="about-section">
//         <h2 className="section-title">How To Play</h2>
//         <p>
//           Users may choose to bet on either a Color (Red/Green) or a specific Number.
//           <br />
//           Only one color or number can be selected per round.
//           <br />
//           Maximum of 2 bets per round is allowed.
//           <br />
//           <br />
//           <strong>Winning Rules</strong>
//           <br />
//           Color Bet Win: Returns x1.9 of staked amount
//           <br />
//           Number Bet Win: Returns x6.8 of staked amount
//           <br />
//           <br />
//           <strong>Minimum Bet per Round:</strong>
//           <br />
//           $0.50
//         </p>
//       </section>
//       <section className="about-section">
//         <h2 className="section-title">Terms and Conditions</h2>
//         <ol>
//           <li><strong>General Overview</strong>
//             <ul>
//               <li>BetFlix is a color prediction game where players bet on either Red or Green colors, or specific numbers (0-9) each round.</li>
//               <li>Numbers are categorized as follows:
//                 <ul>
//                   <li><strong>Green (Even Numbers):</strong> 0, 2, 4, 6, 8</li>
//                   <li><strong>Red (Odd Numbers):</strong> 1, 3, 5, 7, 9</li>
//                 </ul>
//               </li>
//               <li>By participating, users agree to abide by these Terms and Conditions.</li>
//             </ul>
//           </li>
//           <li><strong>Gameplay Rules</strong>
//             <ul>
//               <li>Players may bet on either a color (Red or Green) or a specific number (0-9) per round.</li>
//               <li>Only one selection (color or number) is permitted per round.</li>
//               <li>A maximum of two bets per round is allowed per user.</li>
//               <li><strong>Minimum Bet:</strong> $0.50.</li>
//             </ul>
//           </li>
//           <li><strong>Payout Structure</strong>
//             <ul>
//               <li><strong>Color Bet Win:</strong> Pays 1.9x the wagered amount.</li>
//               <li><strong>Number Bet Win:</strong> Pays 6.8x the wagered amount.</li>
//             </ul>
//           </li>
//           <li><strong>Deposits and Withdrawals</strong>
//             <ul>
//               <li><strong>Minimum Deposit:</strong> $10.50.</li>
//               <li><strong>Minimum Withdrawal:</strong> $10.00.</li>
//               <li>All deposits and withdrawals are final and non-refundable.</li>
//             </ul>
//           </li>
//           <li><strong>Referral Program</strong>
//             <ul>
//               <li>Referrers earn a <strong>30% bonus</strong> on the first deposit made by each referred user.</li>
//               <li>For subsequent deposits by referred users, referrers earn a <strong>10% bonus</strong>.</li>
//               <li><strong>Example:</strong>
//                 <ul>
//                   <li>Referred user deposits $10: Referrer earns $3 (first deposit).</li>
//                   <li>Referred user deposits another $10: Referrer earns $1.</li>
//                 </ul>
//               </li>
//             </ul>
//           </li>
//           <li><strong>Optional Betting Strategy (Martingale System)</strong>
//             <ul>
//               <li>Players may opt to use the Martingale strategy, tripling their bet after each loss to potentially recover losses and gain profit upon winning.</li>
//               <li><strong>Example Progression:</strong>
//                 <ul>
//                   <li>Round 1: Bet $0.50</li>
//                   <li>Round 2: If lost, bet $1.50 ($0.50 × 3)</li>
//                   <li>Round 3: If lost, bet $4.50 ($0.50 × 9)</li>
//                   <li>Round 4: If lost, bet $13.50 ($0.50 × 27)</li>
//                   <li>Round 5: If lost, bet $40.50 ($0.50 × 81)</li>
//                 </ul>
//               </li>
//               <li>Use of this strategy is optional, and players are solely responsible for managing their funds and understanding associated risks.</li>
//             </ul>
//           </li>
//           <li><strong>Player Eligibility and Responsibilities</strong>
//             <ul>
//               <li>Players must be at least 18 years old to participate.</li>
//               <li>All bets and deposits are final, and no refunds will be issued.</li>
//               <li>BetFlix is not liable for any financial losses incurred through gameplay or betting strategies.</li>
//               <li>Players are expected to engage in responsible gaming and understand the inherent risks of gambling.</li>
//             </ul>
//           </li>
//           <li><strong>Fair Play and Account Integrity</strong>
//             <ul>
//               <li>A maximum of two bets per round per user is strictly enforced.</li>
//               <li>Any attempt to manipulate game outcomes or exploit the platform will result in immediate account suspension and forfeiture of all funds.</li>
//             </ul>
//           </li>
//           <li><strong>Support and Inquiries</strong>
//             <ul>
//               <li>For assistance, contact the BetFlix support team via the profile dashboard or the official BetFlix helpdesk.</li>
//             </ul>
//           </li>
//           <li><strong>Acceptance of Terms</strong>
//             <ul>
//               <li>By participating in BetFlix, users acknowledge and agree to comply with these Terms and Conditions.</li>
//               <li>BetFlix reserves the right to modify these terms at any time, with changes effective upon posting.</li>
//             </ul>
//           </li>
//         </ol>
//         <p><em>Last Updated: May 21, 2025</em></p>
//       </section>
//       <a href="/game" className="about-button">Start Game</a>
//     </div>
//   );
// }

// export default About;


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
          <br />
          <strong>Color-Numbers Breakdown:</strong>
          <br />
          Green (Even): 0, 2, 4, 6, 8
          <br />
          Red (Odd): 1, 3, 5, 7, 9
        </p>
      </section>
      <section className="about-section">
        <h2 className="section-title">How To Play</h2>
        <p>
          Users may choose to bet on either a Color (Red/Green) or a specific Number.
          <br />
          Only one color or number can be selected per round.
          <br />
          Maximum of 2 bets per round is allowed.
          <br />
          <br />
          <strong>Winning Rules</strong>
          <br />
          Color Bet Win: Returns x1.9 of staked amount
          <br />
          Number Bet Win: Returns x6.8 of staked amount
          <br />
          <br />
          <strong>Minimum Bet per Round:</strong>
          <br />
          $0.50
        </p>
      </section>
      <section className="about-section">
        <h2 className="section-title">Terms and Conditions</h2>
        <ol>
          <li><strong>General Overview</strong>
            <ul>
              <li>BetFlix is a color prediction game where players bet on either Red or Green colors, or specific numbers (0-9) each round.</li>
              <li>Numbers are categorized as follows:
                <ul>
                  <li><strong>Green (Even Numbers):</strong> 0, 2, 4, 6, 8</li>
                  <li><strong>Red (Odd Numbers):</strong> 1, 3, 5, 7, 9</li>
                </ul>
              </li>
              <li>By participating, users agree to abide by these Terms and Conditions.</li>
            </ul>
          </li>
          <li><strong>Gameplay Rules</strong>
            <ul>
              <li>Players may bet on either a color (Red or Green) or a specific number (0-9) per round.</li>
              <li>Only one selection (color or number) is permitted per round.</li>
              <li>A maximum of two bets per round is allowed per user.</li>
              <li><strong>Minimum Bet:</strong> $0.50.</li>
            </ul>
          </li>
          <li><strong>Payout Structure</strong>
            <ul>
              <li><strong>Color Bet Win:</strong> Pays 1.9x the wagered amount.</li>
              <li><strong>Number Bet Win:</strong> Pays 6.8x the wagered amount.</li>
            </ul>
          </li>
          <li><strong>Deposits and Withdrawals</strong>
            <ul>
              <li><strong>Minimum Deposit:</strong> $10.50.</li>
              <li><strong>Minimum Withdrawal:</strong> $10.00.</li>
              <li>All deposits and withdrawals are final and non-refundable.</li>
            </ul>
          </li>
          <li><strong>Referral Program</strong>
            <ul>
              <li>Referrers earn a <strong>30% bonus</strong> on the first deposit made by each referred user.</li>
              <li>For subsequent deposits by referred users, referrers earn a <strong>10% bonus</strong>.</li>
              <li><strong>Example:</strong>
                <ul>
                  <li>Referred user deposits $10: Referrer earns $3 (first deposit).</li>
                  <li>Referred user deposits another $10: Referrer earns $1.</li>
                </ul>
              </li>
            </ul>
          </li>
          <li><strong>Optional Betting Strategy (Martingale System)</strong>
            <ul>
              <li>Players may opt to use the Martingale strategy, tripling their bet after each loss to potentially recover losses and gain profit upon winning.</li>
              <li><strong>Example Progression:</strong>
                <ul>
                  <li>Round 1: Bet $0.50</li>
                  <li>Round 2: If lost, bet $1.50 ($0.50 × 3)</li>
                  <li>Round 3: If lost, bet $4.50 ($0.50 × 9)</li>
                  <li>Round 4: If lost, bet $13.50 ($0.50 × 27)</li>
                  <li>Round 5: If lost, bet $40.50 ($0.50 × 81)</li>
                </ul>
              </li>
              <li>Use of this strategy is optional, and players are solely responsible for managing their funds and understanding associated risks.</li>
            </ul>
          </li>
          <li><strong>Player Eligibility and Responsibilities</strong>
            <ul>
              <li>Players must be at least 18 years old to participate.</li>
              <li>All bets and deposits are final, and no refunds will be issued.</li>
              <li>BetFlix is not liable for any financial losses incurred through gameplay or betting strategies.</li>
              <li>Players are expected to engage in responsible gaming and understand the inherent risks of gambling.</li>
            </ul>
          </li>
          <li><strong>Responsible Gambling</strong>
            <ul>
              <li>BetFlix encourages responsible gambling and provides resources for players to manage their gaming habits.</li>
              <li>Users may request self-exclusion or set betting limits through their account settings.</li>
              <li>For support with gambling-related issues, users can contact the National Problem Gambling Helpline at 1-800-522-4700 or visit [Insert Responsible Gambling Resource URL].</li>
            </ul>
          </li>
          <li><strong>Fair Play and Account Integrity</strong>
            <ul>
              <li>A maximum of two bets per round per user is strictly enforced.</li>
              <li>Any attempt to manipulate game outcomes or exploit the platform will result in immediate account suspension and forfeiture of all funds.</li>
              <li>Engaging in malicious activities, such as hacking, fraud, or any attempt to disrupt platform operations, will result in immediate account banning and forfeiture of all funds.</li>
              <li>Prohibited activities include, but are not limited to, creating multiple accounts, using automated systems or bots, colluding with other players, or engaging in any form of cheating.</li>
            </ul>
          </li>
          <li><strong>Support and Inquiries</strong>
            <ul>
              <li>For assistance, contact the BetFlix support team via the profile dashboard or the official BetFlix helpdesk.</li>
            </ul>
          </li>
          <li><strong>Acceptance of Terms</strong>
            <ul>
              <li>By participating in BetFlix, users acknowledge and agree to comply with these Terms and Conditions.</li>
              <li>BetFlix reserves the right to modify these terms at any time, with changes effective upon posting.</li>
            </ul>
          </li>
        </ol>
        <p><em>Last Updated: May 21, 2025</em></p>
      </section>
      <a href="/game" className="about-button">Start Game</a>
    </div>
  );
}

export default About;
