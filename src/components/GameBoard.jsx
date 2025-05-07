import '../styles/game.css';

function GameBoard({ result }) {
  return (
    <div className="game-board">
      <h2>Game Result</h2>
      {result ? (
        <p className={`result ${result.result.toLowerCase()} ${result.won ? 'won' : 'lost'}`}>
          Result: <strong>{result.result}</strong> - {result.won ? 'You Won!' : 'You Lost.'}
          <br />
          <small>Client Seed: {result.clientSeed}</small>
        </p>
      ) : (
        <p className="no-result">No results yet. Place a bet to start!</p>
      )}
    </div>
  );
}

export default GameBoard;