// // src/components/Header.jsx
// import { Link } from 'react-router-dom';
// import { useBalance } from '../context/BalanceContext';
// import { FaWallet } from 'react-icons/fa';
// import '../styles/header.css';

// function Header() {
//   const { balance } = useBalance();

//   return (
//     <header className="header">
//       <div className="header-container">
//         <Link to="/" className="header-logo" aria-label="BetFlix Home">
//           BetFlix
//         </Link>
//         <div className="header-balance">
//           <div className="balance-card" aria-live="polite">
//             <span className="balance-label" aria-label="Wallet">
//               <FaWallet />
//             </span>
//             <strong className="balance-amount">
//               {balance !== null ? `$${balance.toFixed(2)}` : 'Loading...'}
//             </strong>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;


import { Link } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext';
import { FaWallet, FaSpinner } from 'react-icons/fa';
import '../styles/header.css';
import { memo } from 'react';

function Header() {
  const { balance, isLoading, error } = useBalance();

  return (
    <header className="header" role="navigation">
      <div className="header-container">
        <Link to="/" className="header-logo" aria-label="BetFlix Home">
          BetFlix
        </Link>
        <div className="header-balance">
          <div className="balance-card" aria-live="polite">
            <span className="balance-label" aria-label="Wallet">
              <FaWallet />
            </span>
            <strong className="balance-amount">
              {error ? (
                '$0.00'
              ) : isLoading ? (
                <FaSpinner className="spinner" aria-label="Loading balance" />
              ) : (
                `$${(balance ?? 0).toFixed(2)}`
              )}
            </strong>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
