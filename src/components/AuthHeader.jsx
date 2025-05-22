// import { Link } from 'react-router-dom';
// import { FaPhone } from 'react-icons/fa';
// import '../styles/header.css';

// function AuthHeader() {
//     return (
//         <header className="header">
//             <div className="header-container">
//                 <Link to="/" className="header-logo" aria-label="BetFlix Home">
//                     BetFlix
//                 </Link>
//                 <Link to="/support" className="auth-help-link">
//                      <p>Support <FaPhone className='phone-icon' /></p>
//                 </Link>
//             </div>
//         </header>
//     );
// }

// export default AuthHeader;

import { FaUsers } from 'react-icons/fa';
import '../styles/header.css';

function AuthHeader() {
    const openCommunity = () => {
        window.open('https://discord.gg/your-community', '_blank'); // Example: Open Discord
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo" aria-label="BetFlix Home">
                    BetFlix
                </Link>
                <button
                    onClick={openCommunity}
                    className="auth-community-button"
                    aria-label="Join Community"
                >
                    <p>Join Community <FaUsers className='community-icon' /></p>
                </button>
            </div>
        </header>
    );
}

export default AuthHeader;
