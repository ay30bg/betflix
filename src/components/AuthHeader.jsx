import { Link } from 'react-router-dom';
import { FaPhone } from 'react-icons/fa';
import '../styles/header.css';

function AuthHeader() {
    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo" aria-label="BetFlix Home">
                    BetFlix
                </Link>
                <Link to="/support" className="auth-help-link">
                     <p>Support <FaPhone className='phone-icon' /></p>
                </Link>
            </div>
        </header>
    );
}

export default AuthHeader;
