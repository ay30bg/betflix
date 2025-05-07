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
import Timer from './Timer';

function BetForm({ onSubmit, isLoading, balance, isDisabled }) {
  const [selection, setSelection] = useState({ type: null, value: null });
  const [amount, setAmount] = useState('');
  const [clientSeed, setClientSeed] = useState(
    `${crypto.lib.WordArray.random(16).toString()}-${Date.now()}`
  );
  const [error, setError] = useState('');
  const [pendingBets, setPendingBets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isProcessingRef = useRef(false);
  const modalRef = useRef(null);
  const firstFocusableElementRef = useRef(null);
  const lastFocusableElementRef = useRef(null);

  const suggestedAmounts = [10, 50, 100, 500];
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
    setError('');
  };

  const handleNumberSelect = (number) => {
    setSelection({ type: 'number', value: number });
    setIsModalOpen(true);
    setError('');
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    const betAmount = Number(amount);
    if (!betAmount || betAmount <= 0) {
      setError('Please enter a valid bet amount');
      setIsSubmitting(false);
      return;
    }
    if (betAmount > balance) {
      setError('Insufficient balance');
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
      bet.color = getNumberColor(selection.value);
      bet.exactMultiplier = EXACT_NUMBER_MULTIPLIER;
    }
    console.log('Adding bet with clientSeed:', newClientSeed);
    setPendingBets((prev) => [...prev, bet]);
    setIsModalOpen(false);
    setSelection({ type: null, value: null });
    setAmount('');
    setClientSeed(newClientSeed);
    setIsSubmitting(false);
  };

  const handleTimerEnd = async () => {
    if (pendingBets.length === 0) return;
    if (isProcessingRef.current) {
      console.log('Skipping handleTimerEnd: already processing');
      return;
    }
    isProcessingRef.current = true;

    const betsToSubmit = [...pendingBets];
    setPendingBets([]);
    console.log('Submitting bets:', betsToSubmit);
    try {
      for (const bet of betsToSubmit) {
        await onSubmit(bet);
      }
    } catch (err) {
      setError(`Failed to submit bets: ${err.message}`);
      setPendingBets(betsToSubmit);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleSuggestedAmount = (suggestedAmount) => {
    setAmount(suggestedAmount.toString());
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setError('');
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

  return (
    <div className="bet-form-container">
      <form className="bet-form" onSubmit={(e) => e.preventDefault()}>
        {error && <p className="bet-error" role="alert">{error}</p>}
        <div className="button-balls-container">
          <div className="form-group color-buttons">
            <div className="color-button-group">
              <button
                type="button"
                className={`color-button red ${selection.type === 'color' && selection.value === 'Red' ? 'selected' : ''}`}
                onClick={() => handleColorSelect('Red')}
                aria-pressed={selection.type === 'color' && selection.value === 'Red'}
                aria-label="Bet on Red"
                disabled={isDisabled}
              >
               Red
              </button>
              <button
                type="button"
                className={`color-button green ${selection.type === 'color' && selection.value === 'Green' ? 'selected' : ''}`}
                onClick={() => handleColorSelect('Green')}
                aria-pressed={selection.type === 'color' && selection.value === 'Green'}
                aria-label="Bet on Green"
                disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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

        <div className="period-timer-container">
          <span className="period-text" aria-label="Period ID">
            Period: {clientSeed.slice(0, 8)}
          </span>
          <span className="timer-text" aria-live="polite">
            <Timer onTimerEnd={handleTimerEnd} />
          </span>
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  required
                  disabled={isDisabled || isSubmitting}
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
                    disabled={isDisabled || isSubmitting}
                  >
                    {suggestedAmount}
                  </button>
                ))}
              </div>
              {error && <p className="modal-error" role="alert">{error}</p>}
              <button
                type="submit"
                disabled={isLoading || isDisabled || isSubmitting}
                className="modal-submit"
                aria-disabled={isLoading || isDisabled || isSubmitting}
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
};

export default BetForm;