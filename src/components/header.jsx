// import { Link } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { FaWallet } from 'react-icons/fa';
// import '../styles/header.css';

// function Header({ balance: propBalance }) {
//   // Initialize balance from localStorage or propBalance, default to 0
//   const [balance, setBalance] = useState(() => {
//     try {
//       const savedUser = localStorage.getItem('userProfile');
//       if (savedUser) {
//         const userBalance = JSON.parse(savedUser).balance;
//         return userBalance !== undefined && typeof userBalance === 'number' ? userBalance : 0;
//       }
//       return propBalance !== undefined && typeof propBalance === 'number' ? propBalance : 0;
//     } catch (err) {
//       console.error('Error parsing userProfile from localStorage:', err);
//       return propBalance !== undefined && typeof propBalance === 'number' ? propBalance : 0;
//     }
//   });

//   // Sync balance with propBalance or localStorage
//   useEffect(() => {
//     if (propBalance !== undefined && typeof propBalance === 'number') {
//       setBalance(propBalance);
//     } else {
//       try {
//         const savedUser = localStorage.getItem('userProfile');
//         if (savedUser) {
//           const userBalance = JSON.parse(savedUser).balance;
//           setBalance(
//             userBalance !== undefined && typeof userBalance === 'number' ? userBalance : 0
//           );
//         }
//       } catch (err) {
//         console.error('Error parsing userProfile from localStorage:', err);
//         setBalance(0);
//       }
//     }
//   }, [propBalance]);

//   // Optional: Sync balance across tabs
//   useEffect(() => {
//     const handleStorageChange = () => {
//       try {
//         const savedUser = localStorage.getItem('userProfile');
//         if (savedUser) {
//           const userBalance = JSON.parse(savedUser).balance;
//           setBalance(
//             userBalance !== undefined && typeof userBalance === 'number' ? userBalance : 0
//           );
//         }
//       } catch (err) {
//         console.error('Error parsing userProfile from localStorage:', err);
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

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
//             <strong className="balance-amount">${balance.toFixed(2)}</strong>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

// src/components/Header.jsx
import { Link } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext';
import { FaWallet } from 'react-icons/fa';
import '../styles/header.css';

function Header() {
  const { balance } = useBalance();

  return (
    <header className="header">
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
              {balance !== null ? `$${balance.toFixed(2)}` : 'Loading...'}
            </strong>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
