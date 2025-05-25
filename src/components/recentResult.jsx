// import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
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

// function RecentResults() {
//   const [recentRounds, setRecentRounds] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

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

//   useEffect(() => {
//     const fetchRecentRounds = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch('/api/rounds/recent', {
//           headers: {
//             'Content-Type': 'application/json',
//             // Include authentication headers if required
//             // 'Authorization': `Bearer ${yourAuthToken}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         // Limit to last 5 rounds
//         setRecentRounds(data.slice(0, 5));
//         setError(null);
//       } catch (err) {
//         console.error(`[${new Date().toISOString()}] Error fetching recent rounds:`, err.message);
//         setError('Failed to load recent results');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRecentRounds();
//   }, []);

//   const getBallImage = (number) => {
//     const ball = balls.find((b) => b.number === parseInt(number));
//     return ball ? ball.src : null;
//   };

//   return (
//     <div className="recent-results-container">
//       <h3>Last 5 Results</h3>
//       {isLoading && <p>Loading...</p>}
//       {error && <p className="error">{error}</p>}
//       {!isLoading && !error && recentRounds.length === 0 && <p>No results available.</p>}
//       {!isLoading && !error && recentRounds.length > 0 && (
//         <div className="results-balls">
//           {recentRounds.map((round, index) => {
//             const ballImage = getBallImage(round.result.number);
//             return (
//               <div
//                 key={round.period}
//                 className={`result-ball ball-${round.result.color.toLowerCase()}`}
//                 title={`Round ${round.period}: ${round.result.number} (${round.result.color})`}
//               >
//                 {ballImage ? (
//                   <img
//                     src={ballImage}
//                     alt={`Ball with number ${round.result.number}`}
//                     width="40"
//                     height="40"
//                   />
//                 ) : (
//                   <span>{round.result.number}</span>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// RecentResults.propTypes = {};

// export default RecentResults;

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
        const response = await fetch('/api/rounds/last-five', {
          headers: {
            'Content-Type': 'application/json',
            // Uncomment and add token if authentication is required
            // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
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
      <h3>Last 5 Results</h3>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && recentRounds.length === 0 && <p>No results available.</p>}
      {!isLoading && !error && recentRounds.length > 0 && (
        <div className="results-balls">
          {recentRounds.map((round, index) => {
            const ballImage = getBallImage(round.result.number);
            return (
              <div
                key={index} // Use index as key since period is not returned
                className={`result-ball ball-${round.result.color.toLowerCase()}`}
                title={`Number ${round.result.number} (${round.result.color})`}
              >
                {ballImage ? (
                  <img
                    src={ballImage}
                    alt={`Ball with number ${round.result.number}`}
                    width="40"
                    height="40"
                  />
                ) : (
                  <span>{round.result.number}</span>
                )}
              </div>
            );
          })}
        </div>
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
