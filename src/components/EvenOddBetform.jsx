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

// Jackpot Animation Component
function JackpotAnimation({ isActive }) {
  if (!isActive) return null;

  return (
    <div className="jackpot-animation">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: ['#FFD700', '#FF4500', '#00FF00', '#1E90FF'][Math.floor(Math.random() * 4)],
          }}
        />
      ))}
      <div className="jackpot-text">Jackpot!</div>
    </div>
  );
}

function BetForm({ onSubmit, isLoading, balance, isDisabled, roundData, timeLeft, lastResult }) {
  const [selection, setSelection] = useState({ type: 'parity', value: null });
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

  // Payout multiplier for even/odd bets
  const PARITY_MULTIPLIER = 1.9;
  const suggestedAmounts = [100, 200, 500, 1000];

  const balls = [
    { number: 0, src: ball0, parity: 'Even' },
    { number: 1, src: ball1, parity: 'Odd' },
    { number: 2, src: ball2, parity: 'Even' },
    { number: 3, src: ball3, parity: 'Odd' },
    { number: 4, src: ball4, parity: 'Even' },
    { number: 5, src: ball5, parity: 'Odd' },
    { number: 6, src: ball6, parity: 'Even' },
    { number: 7, src: ball7, parity: 'Odd' },
    { number: 8, src: ball8, parity: 'Even' },
    { number: 9, src: ball9, parity: 'Odd' },
  ];

  const getNumberParity = (number) => {
    return number % 2 === 0 ? 'Even' : 'Odd';
  };

  const getPayoutMultiplier = () => {
    return PARITY_MULTIPLIER;
  };

  // Check for win and trigger jackpot animation
  useEffect(() => {
    if (lastResult && lastResult.won && lastResult.betType === 'parity') {
      setShowJackpot(true);
      const timer = setTimeout(() => setShowJackpot(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastResult]);

  const handleParitySelect = (parity) => {
    setSelection({ type: 'parity', value: parity });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!selection.value) {
      onSubmit({ error: 'Please select Even or Odd' });
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

    if (!['Even', 'Odd'].includes(selection.value)) {
      onSubmit({ error: 'Invalid selection' });
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

    try {
      await onSubmit(bet);
      setIsModalOpen(false);
      setSelection({ type: 'parity', value: null });
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
    setSelection({ type: 'parity', value: null });
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
    <div className="bet-form-container">
      <JackpotAnimation isActive={showJackpot} />
      <RecentResults balls={balls} />
      <form className="bet-form" onSubmit={(e) => e.preventDefault()}>
        <div className="button-balls-container">
          <div className="form-group parity-buttons">
            <div className="parity-button-group">
              <button
                type="button"
                className={`parity-button even ${selection.type === 'parity' && selection.value === 'Even' ? 'selected' : ''}`}
                onClick={() => handleParitySelect('Even')}
                aria-pressed={selection.type === 'parity' && selection.value === 'Even'}
                aria-label="Bet on Even"
                disabled={isBettingDisabled}
              >
                Even
              </button>
              <button
                type="button"
                className={`parity-button odd ${selection.type === 'parity' && selection.value === 'Odd' ? 'selected' : ''}`}
                onClick={() => handleParitySelect('Odd')}
                aria-pressed={selection.type === 'parity' && selection.value === 'Odd'}
                aria-label="Bet on Odd"
                disabled={isBettingDisabled}
              >
                Odd
              </button>
            </div>
          </div>
        </div>
      </form>
      <OnlineUsers />
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-labelledby="modal-title">
          <div className="modal-content" ref={modalRef}>
            <h2 id="modal-title">Bet on {selection.value}</h2>
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
                  Bet Amount (₦)
                </label>
                <input
                  id="bet-amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (e.g., ₦100)"
                  min="100"
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
                    {suggestedAmount}
                  </button>
                ))}
              </div>
              <div className="modal-payout-info">
                <p>Payout Multiplier: {getPayoutMultiplier().toFixed(2)}x</p>
                <p>
                  Potential Win: ₦
                  {(amount ? parseFloat(amount) * getPayoutMultiplier() : 0).toFixed(2)}
                </p>
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
  lastResult: PropTypes.shape({
    won: PropTypes.bool,
    betType: PropTypes.string,
    value: PropTypes.string,
  }),
};

export default BetForm;
