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
//           <li><strong>Withdrawal Policy – Turnover Requirement</strong>
//             <ul>
//               <li>To make a withdrawal, players must place bets equal to the amount of their most recent deposit.</li>
//               <li><strong>Example:</strong> If you deposit $10, you must play $10 worth of games (on settled results) before you can withdraw.</li>
//               <li>Only games with a final result (win or lose) count toward the playthrough requirement.</li>
//               <li>This requirement helps maintain a fair, safe, and enjoyable platform for all users.</li>
//               <li>Players can track their progress toward meeting the turnover requirement in their bet history.</li>
//               <li>Once the turnover requirement is met, withdrawals will be available automatically.</li>
//               <li>For assistance, contact the BetFlix support team via the profile dashboard or the official BetFlix helpdesk.</li>
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
//               <li><strong>Referral Bonus Terms</strong>
//                 <ul>
//                   <li>Referral bonuses must be wagered before they can be withdrawn.</li>
//                   <li>Players must place bets totaling at least 2x the bonus amount to unlock it for withdrawal.</li>
//                   <li>This requirement ensures bonuses are used for betting on the platform, preventing misuse and supporting ongoing rewards.</li>
//                   <li>Specific details, such as eligible bet types and wagering requirements, will be provided when claiming the bonus.</li>
//                   <li>Players should review these details carefully to understand how to unlock the bonus for withdrawal.</li>
//                   <li>For questions, contact the BetFlix support team via live chat, email, or Telegram.</li>
//                   <li>Referral bonuses are promotional and subject to the general Terms and Conditions.</li>
//                   <li>BetFlix reserves the right to modify or cancel the referral program at any time.</li>
//                   <li>All bonuses must comply with applicable local laws and regulations.</li>
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
//           <li><strong>Responsible Gambling</strong>
//             <ul>
//               <li>BetFlix encourages responsible gambling and provides resources for players to manage their gaming habits.</li>
//               <li>Users may request self-exclusion or set betting limits through their account settings.</li>
//               <li>For support with gambling-related issues, users can contact the National Problem Gambling Helpline at 1-800-522-4700 or visit [Insert Responsible Gambling Resource URL].</li>
//             </ul>
//           </li>
//           <li><strong>Fair Play and Account Integrity</strong>
//             <ul>
//               <li>A maximum of two bets per round per user is strictly enforced.</li>
//               <li>Any attempt to manipulate game outcomes or exploit the platform will result in immediate account suspension and forfeiture of all funds.</li>
//               <li>Engaging in malicious activities, such as hacking, fraud, or any attempt to disrupt platform operations, will result in immediate account banning and forfeiture of all funds.</li>
//               <li>Prohibited activities include, but are not limited to, creating multiple accounts, using automated systems or bots, colluding with other players, or engaging in any form of cheating.</li>
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
//           <li><strong>Multiple Account Policy</strong>
//             <ul>
//               <li><strong>Single Account Requirement</strong>
//                 <ul>
//                   <li>Each user is permitted to operate only one (1) active account on the BetFlix VIP platform. Creating or operating multiple accounts, whether directly or indirectly, is strictly prohibited and constitutes a breach of these Terms and Conditions.</li>
//                 </ul>
//               </li>
//               <li><strong>Definition of Multiple Accounts</strong>
//                 <ul>
//                   <li>Multiple accounts refer to any secondary, duplicate, or otherwise related accounts created by the same individual or group, including but not limited to:</li>
//                   <li>Use of different email addresses or identities;</li>
//                   <li>Accounts operated from the same IP address or device;</li>
//                   <li>Accounts linked via payment methods or personal data;</li>
//                   <li>Any circumvention of account creation limits intended to exploit promotions, bonuses, or platform functionality.</li>
//                 </ul>
//               </li>
//               <li><strong>Consequences of Breach</strong>
//                 <ul>
//                   <li>If BetFlix VIP determines, in its sole discretion, that a user has created or is operating multiple accounts, the following actions may be taken without prior notice:</li>
//                   <li>Immediate suspension and/or permanent termination of all related accounts;</li>
//                   <li>Forfeiture of winnings, promotional credits, or bonuses obtained through such accounts;</li>
//                   <li>Restriction from accessing future promotions or offers;</li>
//                   <li>Permanent ban from the BetFlix VIP platform.</li>
//                 </ul>
//               </li>
//               <li><strong>Account Linking and Detection</strong>
//                 <ul>
//                   <li>BetFlix VIP uses advanced detection tools, including IP tracking and other data-matching techniques to identify and prevent multiple account activity. By using the platform, users expressly consent to the use of such monitoring tools.</li>
//                 </ul>
//               </li>
//               <li><strong>No Right to Appeal</strong>
//                 <ul>
//                   <li>Due to the deliberate nature of this breach, users found in violation of this policy shall not be entitled to an appeal or review process. All decisions made by BetFlix VIP regarding multiple accounts are final.</li>
//                 </ul>
//               </li>
//               <li><strong>User Responsibility</strong>
//                 <ul>
//                   <li>Users are solely responsible for maintaining the integrity of their account. Allowing others to access your account or attempting to create multiple identities on the platform will be treated as a violation of these Terms.</li>
//                 </ul>
//               </li>
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
          BetFlix is a color prediction platform where users place bets on Red, Green, or Violet colors, or directly on numbers (0-9), each round. Each number is associated with a color as follows:
          <br />
          <strong>Color-Numbers Breakdown:</strong>
          <br />
          Green (Even): 2, 4, 6, 8
          <br />
          Red (Odd): 1, 3, 7, 9
          <br />
          Violet: 0, 5
        </p>
      </section>
      <section className="about-section">
        <h2 className="section-title">How To Play</h2>
        <p>
          Users may choose to bet on either a Color (Red, Green, or Violet) or a specific Number (0-9).
          <br />
          Only one color or number can be selected per bet.
          <br />
          Maximum of 2 bets per round is allowed.
          <br />
          <br />
          <strong>Winning Rules</strong>
          <br />
          Red or Green Color Bet Win: Returns x1.85 of staked amount
          <br />
          Violet Color Bet Win: Returns x2.5 of staked amount
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
              <li>BetFlix is a color prediction game where players bet on either Red, Green, or Violet colors, or specific numbers (0-9) each round.</li>
              <li>Numbers are categorized as follows:
                <ul>
                  <li><strong>Green (Even Numbers):</strong> 2, 4, 6, 8</li>
                  <li><strong>Red (Odd Numbers):</strong> 1, 3, 7, 9</li>
                  <li><strong>Violet:</strong> 0, 5</li>
                </ul>
              </li>
              <li>By participating, users agree to abide by these Terms and Conditions.</li>
            </ul>
          </li>
          <li><strong>Gameplay Rules</strong>
            <ul>
              <li>Players may bet on either a color (Red, Green, or Violet) or a specific number (0-9) per bet.</li>
              <li>Only one selection (color or number) is permitted per bet.</li>
              <li>A maximum of two bets per round is allowed per user.</li>
              <li><strong>Minimum Bet:</strong> $0.50.</li>
            </ul>
          </li>
          <li><strong>Payout Structure</strong>
            <ul>
              <li><strong>Red or Green Color Bet Win:</strong> Pays 1.85x the wagered amount.</li>
              <li><strong>Violet Color Bet Win:</strong> Pays 2.5x the wagered amount.</li>
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
          <li><strong>Withdrawal Policy – Turnover Requirement</strong>
            <ul>
              <li>To make a withdrawal, players must place bets equal to the amount of their most recent deposit.</li>
              <li><strong>Example:</strong> If you deposit $10, you must play $10 worth of games (on settled results) before you can withdraw.</li>
              <li>Only games with a final result (win or lose) count toward the playthrough requirement.</li>
              <li>This requirement helps maintain a fair, safe, and enjoyable platform for all users.</li>
              <li>Players can track their progress toward meeting the turnover requirement in their bet history.</li>
              <li>Once the turnover requirement is met, withdrawals will be available automatically.</li>
              <li>For assistance, contact the BetFlix support team via the profile dashboard or the official BetFlix helpdesk.</li>
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
              <li><strong>Referral Bonus Terms</strong>
                <ul>
                  <li>Referral bonuses must be wagered before they can be withdrawn.</li>
                  <li>Players must place bets totaling at least 2x the bonus amount to unlock it for withdrawal.</li>
                  <li>This requirement ensures bonuses are used for betting on the platform, preventing misuse and supporting ongoing rewards.</li>
                  <li>Specific details, such as eligible bet types and wagering requirements, will be provided when claiming the bonus.</li>
                  <li>Players should review these details carefully to understand how to unlock the bonus for withdrawal.</li>
                  <li>Users can contact the BetFlix support team via live chat, email, or Telegram for questions.</li>
                  <li>Referral bonuses are promotional and subject to the general Terms and Conditions.</li>
                  <li>BetF......
                  <li>BetFlix reserves the right to modify or cancel the referral program at any time.</li>
                  <li>All bonuses must comply with applicable local laws and regulations.</li>
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
          <li><strong>Multiple Account Policy</strong>
            <ul>
              <li><strong>Single Account Requirement</strong>
                <ul>
                  <li>Each user is permitted to operate only one (1) active account on the BetFlix VIP platform. Creating or operating multiple accounts, whether directly or indirectly, is strictly prohibited and constitutes a breach of these Terms and Conditions.</li>
                </ul>
              </li>
              <li><strong>Definition of Multiple Accounts</strong>
                <ul>
                  <li>Multiple accounts refer to any secondary, duplicate, or otherwise related accounts created by the same individual or group, including but not limited to:</li>
                  <li>Use of different email addresses or identities;</li>
                  <li>Accounts operated from the same IP address or device;</li>
                  <li>Accounts linked via payment methods or personal data;</li>
                  <li>Any circumvention of account creation limits intended to exploit promotions, bonuses, or platform functionality.</li>
                </ul>
              </li>
              <li><strong>Consequences of Breach</strong>
                <ul>
                  <li>If BetFlix VIP determines, in its sole discretion, that a user has created or is operating multiple accounts, the following actions may be taken without prior notice:</li>
                  <li>Immediate suspension and/or permanent termination of all related accounts;</li>
                  <li>Forfeiture of winnings, promotional credits, or bonuses obtained through such accounts;</li>
                  <li>Restriction from accessing future promotions or offers;</li>
                  <li>Permanent ban from the BetFlix VIP platform.</li>
                </ul>
              </li>
              <li><strong>Account Linking and Detection</strong>
                <ul>
                  <li>BetFlix VIP uses advanced detection tools, including IP tracking and other data-matching techniques to identify and prevent multiple account activity. By using the platform, users expressly consent to the use of such monitoring tools.</li>
                </ul>
              </li>
              <li><strong>No Right to Appeal</strong>
                <ul>
                  <li>Due to the deliberate nature of this breach, users found in violation of this policy shall not be entitled to an appeal or review process. All decisions made by BetFlix VIP regarding multiple accounts are final.</li>
                </ul>
              </li>
              <li><strong>User Responsibility</strong>
                <ul>
                  <li>Users are solely responsible for maintaining the integrity of their account. Allowing others to access your account or entering multiple identities on the platform will be treated as a violation of these Terms.</li>
                </ul>
              </li>
            </ul>
          </li>
        </ol>
        <p><em>Last Updated: June 9, 2025</em></p>
      </section>
      <a href="/game" className="about-button">Start Game</a>
    </div>
  );
}

export default About;
