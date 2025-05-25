// src/components/RecentResults.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/game.css';

function RecentResults({ balls }) {
  const [recentRounds, setRecentRounds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentRounds = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token'); // Adjust based on your auth method
        const apiUrl = process.env.REACT_APP_API_URL || '/api/bets'; // Use env var or fallback
        const response = await fetch(`${apiUrl}/api/bets/rounds/last-five`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[${new Date().toISOString()}] Fetch error:`, {
            status: response.status,
            statusText: response.statusText,
            responseText: errorText.slice(0, 100),
          });
          throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const errorText = await response.text();
          console.error(`[${new Date().toISOString()}] Invalid content type:`, {
            contentType,
            responseText: errorText.slice(0, 100),
          });
          throw new Error('Response is not JSON');
        }

        const data = await response.json();
        setRecentRounds(data.slice(0, 5)); // Ensure max 5 rounds
        setError(null);
      } catch (err) {
        console.error(`[${new Date().toISOString()}] Error fetching recent rounds:`, {
          message: err.message,
          stack: err.stack,
        });
        setError('Failed to load recent results. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentRounds();
  }, []);

  const getBallImage = (number) => {
    const ball = balls.find((b) => b.number === parseInt(number));
    return ball ? ball.src : null;
  };

  return (
    <div className="recent-results-container">
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && recentRounds.length === 0 && <p>No results available.</p>}
      {!isLoading && !error && recentRounds.length > 0 && (
        <>
{/*           <p>{recentRounds.length} recent {recentRounds.length === 1 ? 'result' : 'results'} available.</p> */}
          <div className="results-balls">
            {recentRounds.map((round, index) => {
              const ballImage = getBallImage(round.result.number);
              return (
                <div
                  key={index}
                  className={`result-ball ball-${round.result.color.toLowerCase()}`}
                  title={`Number ${round.result.number} (${round.result.color})`}
                >
                  {ballImage ? (
                    <img
                      src={ballImage}
                      alt={`Ball with number ${round.result.number}`}
                      width="20"
                      height="20"
                    />
                  ) : (
                    <span>{round.result.number}</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

RecentResults.propTypes = {
  balls: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecentResults;
