// import PropTypes from 'prop-types';
// import '../styles/game.css';

// function HistoryTable({ bets }) {
//   const getNumberColor = (value) => {
//     if (value === undefined || value === null) return '';
//     return value % 2 === 0 ? 'Green' : 'Red';
//   };

//   const getBetDisplay = (bet) => {
//     if (bet.type === 'color') {
//       return { text: bet.value || 'Unknown', color: bet.value || '' };
//     }
//     return { text: `Number ${bet.value ?? 'Unknown'}`, color: getNumberColor(bet.value) };
//   };

//   const getResultDisplay = (bet) => {
//     if (bet.type === 'color') {
//       return { text: bet.result || 'Pending', color: bet.result || '' };
//     }
//     return { text: `Number ${bet.result ?? 'Pending'}`, color: getNumberColor(bet.result) };
//   };

//   return (
//     <div className="history-table-container">
//       {bets.length === 0 ? (
//         <p className="no-history">No bets placed yet.</p>
//       ) : (
//         <table className="history-table" aria-label="Bet History Table">
//           <thead>
//             <tr>
//               <th scope="col">Round</th>
//               <th scope="col">Bet</th>
//               <th scope="col">Amount</th>
//               <th scope="col">Result</th>
//               <th scope="col">Win/Loss</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bets.map((bet, index) => {
//               if (!bet || !bet.type || bet.value === undefined || bet.result === undefined) {
//                 return (
//                   <tr key={index}>
//                     <td data-label="Period">{bet?.period || 'Unknown'}</td>
//                     <td data-label="Error" colSpan="4">Invalid bet data</td>
//                   </tr>
//                 );
//               }

//               const betDisplay = getBetDisplay(bet);
//               const resultDisplay = getResultDisplay(bet);

//               return (
//                 <tr key={`${bet.period}-${index}`}>
//                   <td data-label="Period">{bet.period}</td>
//                   <td data-label="Bet" className={betDisplay.color ? `color-${betDisplay.color.toLowerCase()}` : ''}>
//                     {betDisplay.text}
//                   </td>
//                   <td data-label="Amount">${bet.amount.toFixed(2)}</td>
//                   <td data-label="Result" className={resultDisplay.color ? `color-${resultDisplay.color.toLowerCase()}` : ''}>
//                     {resultDisplay.text}
//                   </td>
//                   <td data-label="Win/Loss" className={bet.won ? 'won' : 'lost'}>
//                     {bet.won ? 'Won' : 'Lost'}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// HistoryTable.propTypes = {
//   bets: PropTypes.arrayOf(
//     PropTypes.shape({
//       period: PropTypes.string.isRequired,
//       type: PropTypes.oneOf(['color', 'number']).isRequired,
//       value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//       amount: PropTypes.number.isRequired,
//       result: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//       won: PropTypes.bool,
//     })
//   ).isRequired,
// };

// export default HistoryTable;

import PropTypes from 'prop-types';
import '../styles/game.css';

function HistoryTable({ bets }) {
  const getNumberColor = (value) => {
    if (value === undefined || value === null) return '';
    return value % 2 === 0 ? 'Green' : 'Red';
  };

  const getBetDisplay = (bet) => {
    if (bet.type === 'color') {
      return { text: bet.value || 'Unknown', color: bet.value || '' };
    }
    return { text: `Number ${bet.value ?? 'Unknown'}`, color: getNumberColor(bet.value) };
  };

  const getResultDisplay = (bet) => {
    if (typeof bet.result === 'undefined') {
      return { text: 'Pending', color: '' };
    }
    if (bet.type === 'color') {
      return { text: bet.result || 'Unknown', color: bet.result || '' };
    }
    return { text: `Number ${bet.result ?? 'Unknown'}`, color: getNumberColor(bet.result) };
  };

  // Filter out invalid bets
  const validBets = bets.filter(
    (bet) => bet && bet.type && bet.value !== undefined && bet.amount !== undefined
  );

  return (
    <div className="history-table-container">
      {validBets.length === 0 ? (
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
            {validBets.map((bet, index) => {
              if (!bet.period || !bet.type) {
                return (
                  <tr key={index}>
                    <td data-label="Period">{bet?.period || 'Unknown'}</td>
                    <td data-label="Error" colSpan="4">Invalid bet data</td>
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
                    className={betDisplay.color ? `color-${betDisplay.color.toLowerCase()}` : ''}
                  >
                    {betDisplay.text}
                  </td>
                  <td data-label="Amount">${bet.amount.toFixed(2)}</td>
                  <td
                    data-label="Result"
                    className={resultDisplay.color ? `color-${resultDisplay.color.toLowerCase()}` : ''}
                  >
                    {resultDisplay.text}
                  </td>
                  <td
                    data-label="Win/Loss"
                    className={
                      typeof bet.won === 'undefined' ? 'pending' : bet.won ? 'won' : 'lost'
                    }
                  >
                    {typeof bet.won === 'undefined' ? 'Pending' : bet.won ? 'Won' : 'Lost'}
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
      type: PropTypes.oneOf(['color', 'number']).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      amount: PropTypes.number.isRequired,
      result: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      won: PropTypes.bool,
    })
  ).isRequired,
};

export default HistoryTable;
