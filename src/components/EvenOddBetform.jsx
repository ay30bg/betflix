import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import crypto from 'crypto-js';
import '../styles/even-odd.css'; // Assuming the same stylesheet can be adapted

// Jackpot Animation Component for Even/Odd wins
function JackpotAnimation({ isActive }) {
  if (!isActive) return null;

  return (
    <div className="jackpot-animation">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: ['#FFD700', '#00FF00', '#1E90FF'][Math.floor(Math.random() * 3)],
          }}
        />
      ))}
      <div className="jackpot-text">Winner!</div>
    </div>
  );
}

function BetForm({ onSubmit, isLoading, balance, isDisabled, roundData, timeLeft, lastResult }) {
  const [selection, setSelection] = useState(null); // 'even' or 'odd'
  const [amount, setAmount] = useState('');
  const [clientSeed, setClientSeed] = useState(
    `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJackpot, setShowJackpot] = useState(false); // State for win animation
  const modalRef = useRef(null);
  const firstFocusableElementRef = useRef(null);
  const lastFocusableElementRef = useRef(null);

  // Payout multiplier for even/odd bets
  const PAYOUT_MULTIPLIER = 2.0;
  const suggestedAmounts = [100, 200, 500, 1000];

  // Trigger animation for winning bets
  useEffect(() => {
    if (lastResult && lastResult.won) {
      setShowJackpot(true);
      const timer = setTimeout(() => setShowJackpot(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastResult]);

  const handleChoiceSelect = (choice) => {
    setSelection(choice);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!selection) {
      onSubmit({ error: 'Please select Even or Odd' });
      setIsSubmitting(false);
      return;
    }

    const betAmount = parseFloat(amount);
    if (!betAmount || betAmount < 0.50 || Number.isNaN(betAmount)) {
      onSubmit({ error: 'Please enter a valid bet amount (minimum ₦0.50)' });
      setIsSubmitting(false);
      return;
    }

    if (betAmount > balance) {
      onSubmit({ error: 'Insufficient balance' });
      setIsSubmitting(false);
      return;
    }

    if (!['even', 'odd'].includes(selection)) {
      onSubmit({ error: 'Invalid choice selected' });
      setIsSubmitting(false);
      return;
    }

    const newClientSeed = `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`;
    const bet = {
      choice: selection,
      amount: betAmount,
      clientSeed: newClientSeed,
    };

    try {
      await onSubmit(bet);
      setIsModalOpen(false);
      setSelection(null);
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
    setSelection(null);
    setIsSubmitting(false);
  };

  // Accessibility for modal
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, input, [tabindex]:not([tabindex="-1"])'
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
      <JackpotAnimation isActive={showJackpot} />
      <form className="bet-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group choice-buttons">
          <div className="choice-button-group">
            <button
              type="button"
              className={`choice-button even ${selection === 'even' ? 'selected' : ''}`}
              onClick={() => handleChoiceSelect('even')}
              aria-pressed={selection === 'even'}
              aria-label="Bet on Even"
              disabled={isBettingDisabled}
            >
              Even
            </button>
            <button
              type="button"
              className={`choice-button odd ${selection === 'odd' ? 'selected' : ''}`}
              onClick={() => handleChoiceSelect('odd')}
              aria-pressed={selection === 'odd'}
              aria-label="Bet on Odd"
              disabled={isBettingDisabled}
            >
              Odd
            </button>
          </div>
        </div>
      </form>
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-labelledby="modal-title">
          <div className="modal-content" ref={modalRef}>
            <h2 id="modal-title">Bet on {selection.charAt(0).toUpperCase() + selection.slice(1)}</h2>
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
                <p>Payout Multiplier: {PAYOUT_MULTIPLIER.toFixed(2)}x</p>
                <p>
                  Potential Win: ₦
                  {(amount ? parseFloat(amount) * PAYOUT_MULTIPLIER : 0).toFixed(2)}
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
    choice: PropTypes.string,
    result: PropTypes.string,
  }),
};

export default BetForm;
