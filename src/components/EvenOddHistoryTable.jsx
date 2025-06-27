import PropTypes from 'prop-types';
import '../styles/even-odd.css'; // Assuming similar styling as BetForm

function HistoryTable({ bets }) {
  // Function to determine the display text and color for the bet
  const getBetDisplay = (bet) => {
    if (!bet.choice) {
      return { text: 'Unknown', color: '' };
    }
    return {
      text: bet.choice.charAt(0).toUpperCase() + bet.choice.slice(1), // Capitalize Even/Odd
      color: bet.choice === 'even' ? 'Green' : 'Red',
    };
  };

  // Function to determine the display text and color for the result
  const getResultDisplay = (bet) => {
    if (bet.status === 'pending') {
      return { text: 'Pending', color: '' };
    }
    if (!bet.result) {
      return { text: 'Unknown', color: '' };
    }
    return {
      text: bet.result.charAt(0).toUpperCase() + bet.result.slice(1), // Capitalize Even/Odd
      color: bet.result === 'even' ? 'Green' : 'Red',
    };
  };

  return (
    <div className="eo-history-table-container">
      {bets.length === 0 ? (
        <p className="eo-no-history">No bets placed yet.</p>
      ) : (
        <table className="eo-history-table" aria-label="Even/Odd Bet History Table">
          <thead>
            <tr>
              <th scope="col">Round</th>
              <th scope="col">Bet</th>
              <th scope="col">Amount</th>
              <th scope="col">Result</th>
              <th scope="col">Win/Loss</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((bet, index) => {
              // Handle invalid bets
              if (bet.status === 'invalid') {
                return (
                  <tr key={`${bet.period || index}-${index}`}>
                    <td data-label="Period">{bet.period || 'Unknown'}</td>
                    <td data-label="Error" colSpan="4">
                      Invalid bet data
                    </td>
                  </tr>
                );
              }

              const betDisplay = getBetDisplay(bet);
              const resultDisplay = getResultDisplay(bet);

              return (
                <tr key={`${bet.period}-${index}`}>
                  <td data-label="Period">{bet.period || 'Unknown'}</td>
                  <td
                    data-label="Bet"
                    className={
                      betDisplay.color ? `eo-color-${betDisplay.color.toLowerCase()}` : ''
                    }
                  >
                    {betDisplay.text}
                  </td>
                  <td data-label="Amount">₦{bet.amount.toFixed(2)}</td>
                  <td
                    data-label="Result"
                    className={
                      resultDisplay.color
                        ? `eo-color-${resultDisplay.color.toLowerCase()}`
                        : bet.status === 'pending'
                        ? 'eo-pending'
                        : ''
                    }
                  >
                    {resultDisplay.text}
                    {bet.status === 'pending' && bet.roundExpiresAt && (
                      <span>
                        {' '}
                        (Ends at {new Date(bet.roundExpiresAt).toLocaleTimeString()})
                      </span>
                    )}
                  </td>
                  <td
                    data-label="Win/Loss"
                    className={
                      bet.status === 'pending'
                        ? 'eo-pending'
                        : bet.won
                        ? 'eo-won'
                        : 'eo-lost'
                    }
                  >
                    {bet.status === 'pending' ? 'Pending' : bet.won ? 'Won' : 'Lost'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

HistoryTable.propTypes = {
  bets: PropTypes.arrayOf(
    PropTypes.shape({
      period: PropTypes.string.isRequired,
      choice: PropTypes.oneOf(['even', 'odd']),
      amount: PropTypes.number.isRequired,
      result: PropTypes.oneOf(['even', 'odd']),
      won: PropTypes.bool,
      status: PropTypes.oneOf(['pending', 'finalized', 'invalid']).isRequired,
      roundExpiresAt: PropTypes.string,
    })
  ).isRequired,
};

export default HistoryTable;
