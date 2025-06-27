// import { useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
// import crypto from 'crypto-js';
// import RecentResults from './recentResult';
// import OnlineUsers from './OnlineUsers';
// import '../styles/game.css';
// import ball0 from '../assets/ball-0.svg';
// import ball1 from '../assets/ball1.svg';
// import ball2 from '../assets/ball2.svg';
// import ball3 from '../assets/ball3.svg';
// import ball4 from '../assets/ball4.svg';
// import ball5 from '../assets/ball5.svg';
// import ball6 from '../assets/ball6.svg';
// import ball7 from '../assets/ball7.svg';
// import ball8 from '../assets/ball8.svg';
// import ball9 from '../assets/ball9.svg';

// // New Jackpot Animation Component
// function JackpotAnimation({ isActive }) {
//   if (!isActive) return null;

//   return (
//     <div className="jackpot-animation">
//       {[...Array(30)].map((_, i) => (
//         <div
//           key={i}
//           className="confetti-particle"
//           style={{
//             left: `${Math.random() * 100}%`,
//             animationDelay: `${Math.random() * 0.5}s`,
//             backgroundColor: ['#FFD700', '#FF4500', '#00FF00', '#1E90FF'][Math.floor(Math.random() * 4)],
//           }}
//         />
//       ))}
//       <div className="jackpot-text">Jackpot!</div>
//     </div>
//   );
// }

// function BetForm({ onSubmit, isLoading, balance, isDisabled, roundData, timeLeft, lastResult }) {
//   const [selection, setSelection] = useState({ type: null, value: null });
//   const [amount, setAmount] = useState('');
//   const [clientSeed, setClientSeed] = useState(
//     `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`
//   );
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showJackpot, setShowJackpot] = useState(false); // State for jackpot animation
//   const modalRef = useRef(null);
//   const firstFocusableElementRef = useRef(null);
//   const lastFocusableElementRef = useRef(null);

//   // Payout multipliers
//   const COLOR_MULTIPLIERS = {
//     Red: 1.85,
//     Green: 1.85,
//     Violet: 2.5,
//   };
//   const NUMBER_MULTIPLIER = 6.8;
//   const suggestedAmounts = [100, 200, 500, 1000];

//   const balls = [
//     { number: 0, src: ball0, color: 'Violet' },
//     { number: 1, src: ball1, color: 'Red' },
//     { number: 2, src: ball2, color: 'Green' },
//     { number: 3, src: ball3, color: 'Red' },
//     { number: 4, src: ball4, color: 'Green' },
//     { number: 5, src: ball5, color: 'Violet' },
//     { number: 6, src: ball6, color: 'Green' },
//     { number: 7, src: ball7, color: 'Red' },
//     { number: 8, src: ball8, color: 'Green' },
//     { number: 9, src: ball9, color: 'Red' },
//   ];

//   const getNumberColor = (number) => {
//     if (number === 0 || number === 5) return 'Violet';
//     return number % 2 === 0 ? 'Green' : 'Red';
//   };

//   const getPayoutMultiplier = () => {
//     if (selection.type === 'color') {
//       return COLOR_MULTIPLIERS[selection.value] || 1;
//     }
//     return NUMBER_MULTIPLIER;
//   };

//   // Check for number bet win and trigger animation
//   useEffect(() => {
//     if (lastResult && lastResult.won && lastResult.betType === 'number') {
//       setShowJackpot(true);
//       // Hide animation after 3 seconds
//       const timer = setTimeout(() => setShowJackpot(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [lastResult]);

//   const handleColorSelect = (color) => {
//     setSelection({ type: 'color', value: color });
//     setIsModalOpen(true);
//   };

//   const handleNumberSelect = (number) => {
//     setSelection({ type: 'number', value: number.toString() });
//     setIsModalOpen(true);
//   };

//   const handleModalSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;
//     setIsSubmitting(true);

//     if (!selection.type || !selection.value) {
//       onSubmit({ error: 'Please select a bet type and value' });
//       setIsSubmitting(false);
//       return;
//     }

//     const betAmount = parseFloat(amount);
//     if (!betAmount || betAmount < 0.50 || Number.isNaN(betAmount)) {
//       onSubmit({ error: 'Please enter a valid bet amount (minimum $0.50)' });
//       setIsSubmitting(false);
//       return;
//     }

//     if (betAmount > balance) {
//       onSubmit({ error: 'Insufficient balance' });
//       setIsSubmitting(false);
//       return;
//     }

//     if (selection.type === 'color' && !['Red', 'Green', 'Violet'].includes(selection.value)) {
//       onSubmit({ error: 'Invalid color selected' });
//       setIsSubmitting(false);
//       return;
//     }

//     if (selection.type === 'number' && !/^\d$/.test(selection.value)) {
//       onSubmit({ error: 'Invalid number selected' });
//       setIsSubmitting(false);
//       return;
//     }

//     const newClientSeed = `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`;
//     const bet = {
//       type: selection.type,
//       value: selection.value,
//       amount: betAmount,
//       clientSeed: newClientSeed,
//     };
//     if (selection.type === 'number') {
//       bet.color = getNumberColor(parseInt(selection.value));
//     }
//     console.log('Submitting bet:', bet);
//     try {
//       await onSubmit(bet);
//       setIsModalOpen(false);
//       setSelection({ type: null, value: null });
//       setAmount('');
//       setClientSeed(newClientSeed);
//     } catch (err) {
//       onSubmit({ error: `Failed to place bet: ${err.message}` });
//       setIsSubmitting(false);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

// const handleSuggestedAmount = (suggestedAmount) => {
//     setAmount(suggestedAmount);
// };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setAmount('');
//     setSelection({ type: null, value: null });
//     setIsSubmitting(false);
//   };

//   useEffect(() => {
//     if (isModalOpen && modalRef.current) {
//       const focusableElements = modalRef.current.querySelectorAll(
//         'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
//       );
//       firstFocusableElementRef.current = focusableElements[0];
//       lastFocusableElementRef.current = focusableElements[focusableElements.length - 1];
//       firstFocusableElementRef.current?.focus();

//       const handleKeyDown = (e) => {
//         if (e.key === 'Escape') {
//           closeModal();
//         } else if (e.key === 'Tab') {
//           if (e.shiftKey && document.activeElement === firstFocusableElementRef.current) {
//             e.preventDefault();
//             lastFocusableElementRef.current?.focus();
//           } else if (!e.shiftKey && document.activeElement === lastFocusableElementRef.current) {
//             e.preventDefault();
//             firstFocusableElementRef.current?.focus();
//           }
//         }
//       };
//       document.addEventListener('keydown', handleKeyDown);
//       return () => document.removeEventListener('keydown', handleKeyDown);
//     }
//   }, [isModalOpen]);

//   const isBettingDisabled = isDisabled || timeLeft < 15;

//   return (
//     <div className="bet-form-container">
//       <JackpotAnimation isActive={showJackpot} />
//       <RecentResults balls={balls} />
//       <form className="bet-form" onSubmit={(e) => e.preventDefault()}>
//         <div className="button-balls-container">
//           <div className="form-group color-buttons">
//             <div className="color-button-group">
//               <button
//                 type="button"
//                 className={`color-button red ${selection.type === 'color' && selection.value === 'Red' ? 'selected' : ''}`}
//                 onClick={() => handleColorSelect('Red')}
//                 aria-pressed={selection.type === 'color' && selection.value === 'Red'}
//                 aria-label="Bet on Red"
//                 disabled={isBettingDisabled}
//               >
//                 Red
//               </button>
//               <button
//                 type="button"
//                 className={`color-button violet ${selection.type === 'color' && selection.value === 'Violet' ? 'selected' : ''}`}
//                 onClick={() => handleColorSelect('Violet')}
//                 aria-pressed={selection.type === 'color' && selection.value === 'Violet'}
//                 aria-label="Bet on Violet"
//                 disabled={isBettingDisabled}
//               >
//                 Violet
//               </button>
//               <button
//                 type="button"
//                 className={`color-button green ${selection.type === 'color' && selection.value === 'Green' ? 'selected' : ''}`}
//                 onClick={() => handleColorSelect('Green')}
//                 aria-pressed={selection.type === 'color' && selection.value === 'Green'}
//                 aria-label="Bet on Green"
//                 disabled={isBettingDisabled}
//               >
//                 Green
//               </button>
//             </div>
//           </div>
//           <div className="pick-balls">
//             {balls.slice(0, 5).map((ball) => (
//               <button
//                 key={ball.number}
//                 type="button"
//                 className={`ball-button ${selection.type === 'number' && selection.value === ball.number.toString() ? 'selected' : ''} ball-${ball.color.toLowerCase()}`}
//                 onClick={() => handleNumberSelect(ball.number)}
//                 aria-label={`Bet on number ${ball.number} (${ball.color})`}
//                 disabled={isBettingDisabled}
//               >
//                 <img
//                   src={ball.src}
//                   alt={`Ball with number ${ball.number}`}
//                   width="40"
//                   height="40"
//                 />
//               </button>
//             ))}
//           </div>
//           <div className="pick-balls">
//             {balls.slice(5).map((ball) => (
//               <button
//                 key={ball.number}
//                 type="button"
//                 className={`ball-button ${selection.type === 'number' && selection.value === ball.number.toString() ? 'selected' : ''} ball-${ball.color.toLowerCase()}`}
//                 onClick={() => handleNumberSelect(ball.number)}
//                 aria-label={`Bet on number ${ball.number} (${ball.color})`}
//                 disabled={isBettingDisabled}
//               >
//                 <img
//                   src={ball.src}
//                   alt={`Ball with number ${ball.number}`}
//                   width="40"
//                   height="40"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>
//       </form>
//       <OnlineUsers />
//       {isModalOpen && (
//         <div className="modal-overlay" role="dialog" aria-labelledby="modal-title">
//           <div className="modal-content" ref={modalRef}>
//             <h2 id="modal-title">
//               {selection.type === 'color'
//                 ? `Bet on ${selection.value}`
//                 : `Bet on Number ${selection.value} (${getNumberColor(parseInt(selection.value))})`}
//             </h2>
//             <button
//               className="modal-close"
//               onClick={closeModal}
//               aria-label="Close modal"
//             >
//               ×
//             </button>
//             <form onSubmit={handleModalSubmit}>
//               <div className="form-group">
//                 <label htmlFor="bet-amount" className="modal-label">
//                   Bet Amount (₦)
//                 </label>
//                 <input
//                   id="bet-amount"
//                   type="number"
//                   step="0.01"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="Enter amount (e.g., ₦100)"
//                   min="100"
//                   required
//                   disabled={isBettingDisabled || isSubmitting}
//                   className="modal-input"
//                 />
//               </div>
//               <div className="suggested-amounts">
//                 {suggestedAmounts.map((suggestedAmount) => (
//                   <button
//                     key={suggestedAmount}
//                     type="button"
//                     className="suggested-amount-button"
//                     onClick={() => handleSuggestedAmount(suggestedAmount)}
//                     disabled={isBettingDisabled || isSubmitting}
//                   >
//                     {suggestedAmount}
//                   </button>
//                 ))}
//               </div>
//               <div className="modal-payout-info">
//                 <p>
//                   Payout Multiplier: {getPayoutMultiplier().toFixed(2)}x
//                 </p>
//                 <p>
//                   Potential Win: ₦
//                  {(amount && selection.type
//                     ? parseFloat(amount) * getPayoutMultiplier()
//                     : 0).toFixed(2)}
//                 </p>
//               </div>
//               <button
//                 type="submit"
//                 disabled={isLoading || isBettingDisabled || isSubmitting}
//                 className="modal-submit"
//                 aria-disabled={isLoading || isBettingDisabled || isSubmitting}
//               >
//                 {isSubmitting ? 'Placing Bet...' : 'Place Bet'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// BetForm.propTypes = {
//   onSubmit: PropTypes.func.isRequired,
//   isLoading: PropTypes.bool.isRequired,
//   balance: PropTypes.number.isRequired,
//   isDisabled: PropTypes.bool.isRequired,
//   roundData: PropTypes.shape({
//     period: PropTypes.string,
//     expiresAt: PropTypes.string,
//   }),
//   timeLeft: PropTypes.number.isRequired,
//   lastResult: PropTypes.shape({
//     won: PropTypes.bool,
//     betType: PropTypes.string,
//     value: PropTypes.string,
//   }),
// };

// export default BetForm;


import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import crypto from 'crypto-js';
import RecentResults from './recentResult';
import OnlineUsers from './OnlineUsers';
import '../styles/game.css';
import ball0 from '../assets/ball-0.svg';
import ball1 from '../assets/ball1.svg';
import ball2 from '../assets/ball2.svg';
import ball3 from '../assets/ball3.svg';
import ball4 from '../assets/ball4.svg';
import ball5 from '../assets/ball5.svg';
import ball6 from '../assets/ball6.svg';
import ball7 from '../assets/ball7.svg';
import ball8 from '../assets/ball8.svg';
import ball9 from '../assets/ball9.svg';

// New Jackpot Animation Component
function JackpotAnimation({ isActive }) {
  if (!isActive) return null;

  return (
    <div className="bf-jackpot-animation">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="bf-confetti-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: ['#FFD700', '#FF4500', '#00FF00', '#1E90FF'][Math.floor(Math.random() * 4)],
          }}
        />
      ))}
      <div className="bf-jackpot-text">Jackpot!</div>
    </div>
  );
}

function BetForm({ onSubmit, isLoading, balance, isDisabled, roundData, timeLeft, lastResult }) {
  const [selection, setSelection] = useState({ type: null, value: null });
  const [amount, setAmount] = useState('');
  const [clientSeed, setClientSeed] = useState(
    `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJackpot, setShowJackpot] = useState(false);
  const modalRef = useRef(null);
  const firstFocusableElementRef = useRef(null);
  const lastFocusableElementRef = useRef(null);

  // Payout multipliers
  const COLOR_MULTIPLIERS = {
    Red: 1.85,
    Green: 1.85,
    Violet: 2.5,
  };
  const NUMBER_MULTIPLIER = 6.8;
  const suggestedAmounts = [100, 200, 500, 1000];

  const balls = [
    { number: 0, src: ball0, color: 'Violet' },
    { number: 1, src: ball1, color: 'Red' },
    { number: 2, src: ball2, color: 'Green' },
    { number: 3, src: ball3, color: 'Red' },
    { number: 4, src: ball4, color: 'Green' },
    { number: 5, src: ball5, color: 'Violet' },
    { number: 6, src: ball6, color: 'Green' },
    { number: 7, src: ball7, color: 'Red' },
    { number: 8, src: ball8, color: 'Green' },
    { number: 9, src: ball9, color: 'Red' },
  ];

  const getNumberColor = (number) => {
    if (number === 0 || number === 5) return 'Violet';
    return number % 2 === 0 ? 'Green' : 'Red';
  };

  const getPayoutMultiplier = () => {
    if (selection.type === 'color') {
      return COLOR_MULTIPLIERS[selection.value] || 1;
    }
    return NUMBER_MULTIPLIER;
  };

  useEffect(() => {
    if (lastResult && lastResult.won && lastResult.betType === 'number') {
      setShowJackpot(true);
      const timer = setTimeout(() => setShowJackpot(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastResult]);

  const handleColorSelect = (color) => {
    setSelection({ type: 'color', value: color });
    setIsModalOpen(true);
  };

  const handleNumberSelect = (number) => {
    setSelection({ type: 'number', value: number.toString() });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!selection.type || !selection.value) {
      onSubmit({ error: 'Please select a bet type and value' });
      setIsSubmitting(false);
      return;
    }

    const betAmount = parseFloat(amount);
    if (!betAmount || betAmount < 0.50 || Number.isNaN(betAmount)) {
      onSubmit({ error: 'Please enter a valid bet amount (minimum $0.50)' });
      setIsSubmitting(false);
      return;
    }

    if (betAmount > balance) {
      onSubmit({ error: 'Insufficient balance' });
      setIsSubmitting(false);
      return;
    }

    if (selection.type === 'color' && !['Red', 'Green', 'Violet'].includes(selection.value)) {
      onSubmit({ error: 'Invalid color selected' });
      setIsSubmitting(false);
      return;
    }

    if (selection.type === 'number' && !/^\d$/.test(selection.value)) {
      onSubmit({ error: 'Invalid number selected' });
      setIsSubmitting(false);
      return;
    }

    const newClientSeed = `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`;
    const bet = {
      type: selection.type,
      value: selection.value,
      amount: betAmount,
      clientSeed: newClientSeed,
    };
    if (selection.type === 'number') {
      bet.color = getNumberColor(parseInt(selection.value));
    }
    console.log('Submitting bet:', bet);
    try {
      await onSubmit(bet);
      setIsModalOpen(false);
      setSelection({ type: null, value: null });
      setAmount('');
      setClientSeed(newClientSeed);
    } catch (err) {
      onSubmit({ error: `Failed to place bet: ${err.message}` });
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestedAmount = (suggestedAmount) => {
    setAmount(suggestedAmount);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setSelection({ type: null, value: null });
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusableElementRef.current = focusableElements[0];
      lastFocusableElementRef.current = focusableElements[focusableElements.length - 1];
      firstFocusableElementRef.current?.focus();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstFocusableElementRef.current) {
            e.preventDefault();
            lastFocusableElementRef.current?.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusableElementRef.current) {
            e.preventDefault();
            firstFocusableElementRef.current?.focus();
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen]);

  const isBettingDisabled = isDisabled || timeLeft < 15;

  return (
    <div className="bf-bet-form-container">
      <JackpotAnimation isActive={showJackpot} />
      <RecentResults balls={balls} />
      <form className="bf-bet-form" onSubmit={(e) => e.preventDefault()}>
        <div className="bf-button-balls-container">
          <div className="bf-form-group bf-color-buttons">
            <div className="bf-color-button-group">
              <button
                type="button"
                className={`bf-color-button bf-red ${selection.type === 'color' && selection.value === 'Red' ? 'bf-selected' : ''}`}
                onClick={() => handleColorSelect('Red')}
                aria-pressed={selection.type === 'color' && selection.value === 'Red'}
                aria-label="Bet on Red"
                disabled={isBettingDisabled}
              >
                Red
              </button>
              <button
                type="button"
                className={`bf-color-button bf-violet ${selection.type === 'color' && selection.value === 'Violet' ? 'bf-selected' : ''}`}
                onClick={() => handleColorSelect('Violet')}
                aria-pressed={selection.type === 'color' && selection.value === 'Violet'}
                aria-label="Bet on Violet"
                disabled={isBettingDisabled}
              >
                Violet
              </button>
              <button
                type="button"
                className={`bf-color-button bf-green ${selection.type === 'color' && selection.value === 'Green' ? 'bf-selected' : ''}`}
                onClick={() => handleColorSelect('Green')}
                aria-pressed={selection.type === 'color' && selection.value === 'Green'}
                aria-label="Bet on Green"
                disabled={isBettingDisabled}
              >
                Green
              </button>
            </div>
          </div>
          <div className="bf-pick-balls">
            {balls.slice(0, 5).map((ball) => (
              <button
                key={ball.number}
                type="button"
                className={`bf-ball-button ${selection.type === 'number' && selection.value === ball.number.toString() ? 'bf-selected' : ''} bf-ball-${ball.color.toLowerCase()}`}
                onClick={() => handleNumberSelect(ball.number)}
                aria-label={`Bet on number ${ball.number} (${ball.color})`}
                disabled={isBettingDisabled}
              >
                <img
                  src={ball.src}
                  alt={`Ball with number ${ball.number}`}
                  width="40"
                  height="40"
                />
              </button>
            ))}
          </div>
          <div className="bf-pick-balls">
            {balls.slice(5).map((ball) => (
              <button
                key={ball.number}
                type="button"
                className={`bf-ball-button ${selection.type === 'number' && selection.value === ball.number.toString() ? 'bf-selected' : ''} bf-ball-${ball.color.toLowerCase()}`}
                onClick={() => handleNumberSelect(ball.number)}
                aria-label={`Bet on number ${ball.number} (${ball.color})`}
                disabled={isBettingDisabled}
              >
                <img
                  src={ball.src}
                  alt={`Ball with number ${ball.number}`}
                  width="40"
                  height="40"
                />
              </button>
            ))}
          </div>
        </div>
      </form>
      <OnlineUsers />
      {isModalOpen && (
        <div className="bf-modal-overlay" role="dialog" aria-labelledby="bf-modal-title">
          <div className="bf-modal-content" ref={modalRef}>
            <h2 id="bf-modal-title">
              {selection.type === 'color'
                ? `Bet on ${selection.value}`
                : `Bet on Number ${selection.value} (${getNumberColor(parseInt(selection.value))})`}
            </h2>
            <button
              className="bf-modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <form onSubmit={handleModalSubmit}>
              <div className="bf-form-group">
                <label htmlFor="bf-bet-amount" className="bf-modal-label">
                  Bet Amount (₦)
                </label>
                <input
                  id="bf-bet-amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (e.g., ₦100)"
                  min="100"
                  required
                  disabled={isBettingDisabled || isSubmitting}
                  className="bf-modal-input"
                />
              </div>
              <div className="bf-suggested-amounts">
                {suggestedAmounts.map((suggestedAmount) => (
                  <button
                    key={suggestedAmount}
                    type="button"
                    className="bf-suggested-amount-button"
                    onClick={() => handleSuggestedAmount(suggestedAmount)}
                    disabled={isBettingDisabled || isSubmitting}
                  >
                    {suggestedAmount}
                  </button>
                ))}
              </div>
              <div className="bf-modal-payout-info">
                <p>
                  Payout Multiplier: {getPayoutMultiplier().toFixed(2)}x
                </p>
                <p>
                  Potential Win: ₦
                 {(amount && selection.type
                    ? parseFloat(amount) * getPayoutMultiplier()
                    : 0).toFixed(2)}
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading || isBettingDisabled || isSubmitting}
                className="bf-modal-submit"
                aria-disabled={isLoading || isBettingDisabled || isSubmitting}
              >
                {isSubmitting ? 'Placing Bet...' : 'Place Bet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

BetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  balance: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  roundData: PropTypes.shape({
    period: PropTypes.string,
    expiresAt: PropTypes.string,
  }),
  timeLeft: PropTypes.number.isRequired,
  lastResult: PropTypes.shape({
    won: PropTypes.bool,
    betType: PropTypes.string,
    value: PropTypes.string,
  }),
};

export default BetForm;
