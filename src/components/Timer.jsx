import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/game.css';

function Timer({ onTimerEnd }) {
  const initialTime = 30;
  const [seconds, setSeconds] = useState(initialTime);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    console.log('Setting up timer interval');
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            console.log('Triggering onTimerEnd');
            onTimerEnd();
          }
          return initialTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log('Cleaning up timer interval');
      clearInterval(timer);
      hasTriggeredRef.current = false;
    };
  }, [onTimerEnd]);

  useEffect(() => {
    if (seconds === initialTime) {
      hasTriggeredRef.current = false;
    }
  }, [seconds]);

  return (
    <div className={`timer ${seconds <= 10 ? 'warning' : ''}`} aria-live="polite">
      Time Left: <strong>{seconds}s</strong>
    </div>
  );
}

Timer.propTypes = {
  onTimerEnd: PropTypes.func.isRequired,
};

export default Timer;