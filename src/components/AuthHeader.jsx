import { Link } from 'react-router-dom';
import '../styles/header.css';

function AuthHeader() {
    const openCommunity = () => {
        window.open('https://t.me/betflix_vip', '_blank'); // Example: Open Discord
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo" aria-label="BetFlix Home">
                    BetFlix
                </Link>
                <button
                    onClick={openCommunity}
                    className="auth-telegram-button"
                    aria-label="Join Community"
                >
                    <p>Join Telegram</p>
                </button>
            </div>
        </header>
    );
}

export default AuthHeader;
