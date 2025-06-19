import PropTypes from 'prop-types';
import '../styles/game.css';

function HistoryTable({ bets }) {
  const getNumberColor = (value) => {
    if (value === undefined || value === null) return '';
    const num = parseInt(value);
    if (num === 0 || num === 5) return 'Violet';
    return num % 2 === 0 ? 'Green' : 'Red';
  };

  const getBetDisplay = (bet) => {
    if (bet.type === 'color') {
      return { text: bet.value || 'Unknown', color: bet.value || '' };
    }
    return { text: `Number ${bet.value ?? 'Unknown'}`, color: getNumberColor(bet.value) };
  };

  const getResultDisplay = (bet) => {
    if (bet.status === 'pending') {
      return { text: 'Pending', color: '' };
    }
    if (bet.type === 'color') {
      return { text: bet.result || 'Unknown', color: bet.result || '' };
    }
    return { text: `Number ${bet.result ?? 'Unknown'}`, color: getNumberColor(bet.result) };
  };

  return (
    <div className="history-table-container">
      {bets.length === 0 ? (
        <p className="no-history">No bets placed yet.</p>
      ) : (
        <table className="history-table" aria-label="Bet History Table">
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
                  <td data-label="Period">{bet.period}</td>
                  <td
                    data-label="Bet"
                    className={
                      betDisplay.color ? `color-${betDisplay.color.toLowerCase()}` : ''
                    }
                  >
                    {betDisplay.text}
                  </td>
                  <td data-label="Amount">₦{bet.amount.toFixed(2)}</td>
                  <td
                    data-label="Result"
                    className={
                      resultDisplay.color
                        ? `color-${resultDisplay.color.toLowerCase()}`
                        : bet.status === 'pending'
                        ? 'pending'
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
                        ? 'pending'
                        : bet.won
                        ? 'won'
                        : 'lost'
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
      type: PropTypes.oneOf(['color', 'number']),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      amount: PropTypes.number.isRequired,
      result: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      won: PropTypes.bool,
      status: PropTypes.oneOf(['pending', 'finalized', 'invalid']).isRequired,
      roundStatus: PropTypes.string,
      roundExpiresAt: PropTypes.string,
    })
  ).isRequired,
};

export default HistoryTable;
