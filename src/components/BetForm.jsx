// import { useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
// import crypto from 'crypto-js';
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

// function BetForm({ onSubmit, isLoading, balance, isDisabled, roundData, timeLeft }) {
//   const [selection, setSelection] = useState({ type: null, value: null });
//   const [amount, setAmount] = useState('');
//   const [clientSeed, setClientSeed] = useState(
//     `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`
//   );
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const modalRef = useRef(null);
//   const firstFocusableElementRef = useRef(null);
//   const lastFocusableElementRef = useRef(null);

//   // const suggestedAmounts = [10, 50, 100, 500];
//   const suggestedAmounts = [1, 5, 10, 50];
//   const EXACT_NUMBER_MULTIPLIER = 10;

//   const balls = [
//     { number: 0, src: ball0, color: 'Green' },
//     { number: 1, src: ball1, color: 'Red' },
//     { number: 2, src: ball2, color: 'Green' },
//     { number: 3, src: ball3, color: 'Red' },
//     { number: 4, src: ball4, color: 'Green' },
//     { number: 5, src: ball5, color: 'Red' },
//     { number: 6, src: ball6, color: 'Green' },
//     { number: 7, src: ball7, color: 'Red' },
//     { number: 8, src: ball8, color: 'Green' },
//     { number: 9, src: ball9, color: 'Red' },
//   ];

//   const getNumberColor = (number) => (number % 2 === 0 ? 'Green' : 'Red');

//   const handleColorSelect = (color) => {
//     setSelection({ type: 'color', value: color });
//     setIsModalOpen(true);
//   };

//   const handleNumberSelect = (number) => {
//     setSelection({ type: 'number', value: number });
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

//     const betAmount = Number(amount);
//     if (!betAmount || betAmount <= 0 || Number.isNaN(betAmount)) {
//       onSubmit({ error: 'Please enter a valid bet amount' });
//       setIsSubmitting(false);
//       return;
//     }

//     if (betAmount > balance) {
//       onSubmit({ error: 'Insufficient balance' });
//       setIsSubmitting(false);
//       return;
//     }

//     if (selection.type === 'color' && !['Green', 'Red'].includes(selection.value)) {
//       onSubmit({ error: 'Invalid color selected' });
//       setIsSubmitting(false);
//       return;
//     }

//     if (selection.type === 'number' && !/^\d$/.test(selection.value.toString())) {
//       onSubmit({ error: 'Invalid number selected' });
//       setIsSubmitting(false);
//       return;
//     }

//     const newClientSeed = `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`;
//     const bet = {
//       type: selection.type,
//       value: selection.value.toString(),
//       amount: betAmount,
//       clientSeed: newClientSeed,
//     };
//     if (selection.type === 'number') {
//       bet.color = getNumberColor(selection.value);
//       bet.exactMultiplier = EXACT_NUMBER_MULTIPLIER;
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
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSuggestedAmount = (suggestedAmount) => {
//     setAmount(suggestedAmount.toString());
//   };

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

//   const isBettingDisabled = isDisabled || timeLeft < 5;

//   return (
//     <div className="bet-form-container">
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
//                 className={`ball-button ${selection.type === 'number' && selection.value === ball.number ? 'selected' : ''} ball-${ball.color.toLowerCase()}`}
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
//                 className={`ball-button ${selection.type === 'number' && selection.value === ball.number ? 'selected' : ''} ball-${ball.color.toLowerCase()}`}
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

// {/*         <div className="period-timer-container">
//           <span className="period-text" aria-label="Round ID">
//            {roundData?.period || 'Loading...'}
//           </span>
//           <span className="timer-text" aria-live="polite">
//             Time Left: {timeLeft} seconds
//           </span>
//         </div> */}
//       </form>

//       {isModalOpen && (
//         <div className="modal-overlay" role="dialog" aria-labelledby="modal-title">
//           <div className="modal-content" ref={modalRef}>
//             <h2 id="modal-title">
//               {selection.type === 'color'
//                 ? `Bet on ${selection.value}`
//                 : `Bet on Number ${selection.value} (${getNumberColor(selection.value)})`}
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
//                   Bet Amount
//                 </label>
//                 <input
//                   id="bet-amount"
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="Enter amount"
//                   min="1"
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
// };

// export default BetForm;

// import { useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
// import crypto from 'crypto-js';
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

// function BetForm({ onSubmit, isLoading, balance, isDisabled, roundData, timeLeft }) {
//   const [selection, setSelection] = useState({ type: null, value: null });
//   const [amount, setAmount] = useState(''); // Keep as string to handle decimal input
//   const [clientSeed, setClientSeed] = useState(
//     `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`
//   );
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const modalRef = useRef(null);
//   const firstFocusableElementRef = useRef(null);
//   const lastFocusableElementRef = useRef(null);

//   // Updated suggested amounts to include decimals (optional)
//   const suggestedAmounts = [1, 5, 10, 50]; // You can add decimals like [0.1, 0.5, 1, 5]
//   const EXACT_NUMBER_MULTIPLIER = 10;

//   const balls = [
//     { number: 0, src: ball0, color: 'Green' },
//     { number: 1, src: ball1, color: 'Red' },
//     { number: 2, src: ball2, color: 'Green' },
//     { number: 3, src: ball3, color: 'Red' },
//     { number: 4, src: ball4, color: 'Green' },
//     { number: 5, src: ball5, color: 'Red' },
//     { number: 6, src: ball6, color: 'Green' },
//     { number: 7, src: ball7, color: 'Red' },
//     { number: 8, src: ball8, color: 'Green' },
//     { number: 9, src: ball9, color: 'Red' },
//   ];

//   const getNumberColor = (number) => (number % 2 === 0 ? 'Green' : 'Red');

//   const handleColorSelect = (color) => {
//     setSelection({ type: 'color', value: color });
//     setIsModalOpen(true);
//   };

//   const handleNumberSelect = (number) => {
//     setSelection({ type: 'number', value: number });
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

//     // Parse amount as a float to support decimals
//     const betAmount = parseFloat(amount);
//     if (!betAmount || betAmount <= 0 || Number.isNaN(betAmount)) {
//       onSubmit({ error: 'Please enter a valid bet amount' });
//       setIsSubmitting(false);
//       return;
//     }

//     // Check balance with decimal precision
//     if (betAmount > balance) {
//       onSubmit({ error: 'Insufficient balance' });
//       setIsSubmitting(false);
//       return;
//     }

//     if (selection.type === 'color' && !['Green', 'Red'].includes(selection.value)) {
//       onSubmit({ error: 'Invalid color selected' });
//       setIsSubmitting(false);
//       return;
//     }

//     if (selection.type === 'number' && !/^\d$/.test(selection.value.toString())) {
//       onSubmit({ error: 'Invalid number selected' });
//       setIsSubmitting(false);
//       return;
//     }

//     const newClientSeed = `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`;
//     const bet = {
//       type: selection.type,
//       value: selection.value.toString(),
//       amount: betAmount, // Use parsed float value
//       clientSeed: newClientSeed,
//     };
//     if (selection.type === 'number') {
//       bet.color = getNumberColor(selection.value);
//       bet.exactMultiplier = EXACT_NUMBER_MULTIPLIER;
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
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSuggestedAmount = (suggestedAmount) => {
//     // Format suggested amount to 2 decimal places for consistency
//     setAmount(suggestedAmount.toFixed(2));
//   };

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

//   const isBettingDisabled = isDisabled || timeLeft < 5;

//   return (
//     <div className="bet-form-container">
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
//                 className={`ball-button ${selection.type === 'number' && selection.value === ball.number ? 'selected' : ''} ball-${ball.color.toLowerCase()}`}
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
//                 className={`ball-button ${selection.type === 'number' && selection.value === ball.number ? 'selected' : ''} ball-${ball.color.toLowerCase()}`}
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

//       {isModalOpen && (
//         <div className="modal-overlay" role="dialog" aria-labelledby="modal-title">
//           <div className="modal-content" ref={modalRef}>
//             <h2 id="modal-title">
//               {selection.type === 'color'
//                 ? `Bet on ${selection.value}`
//                 : `Bet on Number ${selection.value} (${getNumberColor(selection.value)})`}
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
//                   Bet Amount
//                 </label>
//                 <input
//                   id="bet-amount"
//                   type="number"
//                   step="0.01" // Allow decimals with 2 places
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="Enter amount (e.g., 0.50)"
//                   min="0.01" // Minimum bet amount
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
//                     {suggestedAmount.toFixed(2)} {/* Display with 2 decimals */}
//                   </button>
//                 ))}
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
// };

// export default BetForm;

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import crypto from 'crypto-js';
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

function BetForm({ onSubmit, isLoading, balance, isDisabled, roundData, timeLeft }) {
  const [selection, setSelection] = useState({ type: null, value: null });
  const [amount, setAmount] = useState('');
  const [clientSeed, setClientSeed] = useState(
    `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);
  const firstFocusableElementRef = useRef(null);
  const lastFocusableElementRef = useRef(null);

  // Suggested amounts (excluding Max, which is handled separately)
  const suggestedAmounts = [1, 5, 10, 50];

  const EXACT_NUMBER_MULTIPLIER = 10;

  const balls = [
    { number: 0, src: ball0, color: 'Green' },
    { number: 1, src: ball1, color: 'Red' },
    { number: 2, src: ball2, color: 'Green' },
    { number: 3, src: ball3, color: 'Red' },
    { number: 4, src: ball4, color: 'Green' },
    { number: 5, src: ball5, color: 'Red' },
    { number: 6, src: ball6, color: 'Green' },
    { number: 7, src: ball7, color: 'Red' },
    { number: 8, src: ball8, color: 'Green' },
    { number: 9, src: ball9, color: 'Red' },
  ];

  const getNumberColor = (number) => (number % 2 === 0 ? 'Green' : 'Red');

  const handleColorSelect = (color) => {
    setSelection({ type: 'color', value: color });
    setIsModalOpen(true);
  };

  const handleNumberSelect = (number) => {
    setSelection({ type: 'number', value: number });
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
    if (!betAmount || betAmount <= 0 || Number.isNaN(betAmount)) {
      onSubmit({ error: 'Please enter a valid bet amount' });
      setIsSubmitting(false);
      return;
    }

    if (betAmount > balance) {
      onSubmit({ error: 'Insufficient balance' });
      setIsSubmitting(false);
      return;
    }

    if (selection.type === 'color' && !['Green', 'Red'].includes(selection.value)) {
      onSubmit({ error: 'Invalid color selected' });
      setIsSubmitting(false);
      return;
    }

    if (selection.type === 'number' && !/^\d$/.test(selection.value.toString())) {
      onSubmit({ error: 'Invalid number selected' });
      setIsSubmitting(false);
      return;
    }

    const newClientSeed = `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`;
    const bet = {
      type: selection.type,
      value: selection.value.toString(),
      amount: betAmount,
      clientSeed: newClientSeed,
    };
    if (selection.type === 'number') {
      bet.color = getNumberColor(selection.value);
      bet.exactMultiplier = EXACT_NUMBER_MULTIPLIER;
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestedAmount = (suggestedAmount) => {
    // Handle "Max" case by setting amount to balance
    if (suggestedAmount === 'max') {
      setAmount(balance.toFixed(2));
    } else {
      setAmount(suggestedAmount.toFixed(2));
    }
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

  const isBettingDisabled = isDisabled || timeLeft < 5;

  return (
    <div className="bet-form-container">
      <form className="bet-form" onSubmit={(e) => e.preventDefault()}>
        <div className="button-balls-container">
          <div className="form-group color-buttons">
            <div className="color-button-group">
              <button
                type="button"
                className={`color-button red ${selection.type === 'color' && selection.value === 'Red' ? 'selected' : ''}`}
                onClick={() => handleColorSelect('Red')}
                aria-pressed={selection.type === 'color' && selection.value === 'Red'}
                aria-label="Bet on Red"
                disabled={isBettingDisabled}
              >
                Red
              </button>
              <button
                type="button"
                className={`color-button green ${selection.type === 'color' && selection.value === 'Green' ? 'selected' : ''}`}
                onClick={() => handleColorSelect('Green')}
                aria-pressed={selection.type === 'color' && selection.value === 'Green'}
                aria-label="Bet on Green"
                disabled={isBettingDisabled}
              >
                Green
              </button>
            </div>
          </div>
          <div className="pick-balls">
            {balls.slice(0, 5).map((ball) => (
              <button
                key={ball.number}
                type="button"
                className={`ball-button ${selection.type === 'number' && selection.value === ball.number ? 'selected' : ''} ball-${ball.color.toLowerCase()}`}
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
          <div className="pick-balls">
            {balls.slice(5).map((ball) => (
              <button
                key={ball.number}
                type="button"
                className={`ball-button ${selection.type === 'number' && selection.value === ball.number ? 'selected' : ''} ball-${ball.color.toLowerCase()}`}
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

      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-labelledby="modal-title">
          <div className="modal-content" ref={modalRef}>
            <h2 id="modal-title">
              {selection.type === 'color'
                ? `Bet on ${selection.value}`
                : `Bet on Number ${selection.value} (${getNumberColor(selection.value)})`}
            </h2>
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label htmlFor="bet-amount" className="modal-label">
                  Bet Amount
                </label>
                <input
                  id="bet-amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (e.g., 0.50)"
                  min="0.01"
                  required
                  disabled={isBettingDisabled || isSubmitting}
                  className="modal-input"
                />
              </div>
              <div className="suggested-amounts">
                {suggestedAmounts.map((suggestedAmount) => (
                  <button
                    key={suggestedAmount}
                    type="button"
                    className="suggested-amount-button"
                    onClick={() => handleSuggestedAmount(suggestedAmount)}
                    disabled={isBettingDisabled || isSubmitting}
                  >
                    {suggestedAmount.toFixed(2)}
                  </button>
                ))}
                {/* Added Max button */}
                <button
                  type="button"
                  className="suggested-amount-button max-button"
                  onClick={() => handleSuggestedAmount('max')}
                  disabled={isBettingDisabled || isSubmitting || balance <= 0}
                  aria-label={`Bet maximum amount (${balance.toFixed(2)})`}
                >
                  Max ({balance.toFixed(2)})
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading || isBettingDisabled || isSubmitting}
                className="modal-submit"
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
};

export default BetForm;
