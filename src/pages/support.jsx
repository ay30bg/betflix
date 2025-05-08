import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import AuthHeader from '../components/AuthHeader';
import '../styles/support.css';

function Support() {
  const [activeTab, setActiveTab] = useState('faqs');
  const [search, setSearch] = useState('');

  // FAQ data
  const faqs = [
    {
      question: 'How do I register for an account?',
      answer:
        'Navigate to the Sign Up page via the "Sign Up" link. Provide a valid email and a strong password, then verify your account through the email link sent to you.',
    },
    {
      question: 'What if I can’t log in?',
      answer:
        'Check your email and password on the Login page. If you’ve forgotten your password, use the "Forgot Password?" link to reset it. Contact support if issues persist.',
    },
    {
      question: 'How do I add funds to my betting account?',
      answer:
        'Visit the Profile page, click "Deposit," and select a payment option (e.g., card, PayPal). Follow the secure checkout process to fund your account.',
    },
    {
      question: 'Are my bets and personal data safe?',
      answer:
        'We use industry-standard encryption and comply with data protection regulations. Review our Privacy Policy for details on how we secure your information.',
    },
    {
      question: 'How do I place a bet on an event?',
      answer:
        'Go to the Game page, select an event, choose your bet type (e.g., moneyline, spread), enter your stake, and submit. View your bets on the History page.',
    },
  ];

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  // Tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'faqs':
        return (
          <div id="faqs-panel" className="faq-tab" role="tabpanel" aria-labelledby="faqs-tab">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search FAQs"
              />
            </div>
            <div className="faq-list">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))
              ) : (
                <p>No FAQs match your search.</p>
              )}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div
            id="contact-panel"
            className="contact-tab"
            role="tabpanel"
            aria-labelledby="contact-tab"
          >
            <p>Get in touch with our support team for personalized assistance.</p>
            <ul className="contact-options">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:betflix.bets@gmail.com">betflix.bets@gmail.com</a>
              </li>
              <li>
                <strong>Phone:</strong> <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
              <li>
                <strong>Live Chat:</strong>{' '}
                <button className="live-chat-btn" disabled>
                  Chat Coming Soon
                </button>
              </li>
              <li>
                <strong>Support Hours:</strong> 24/7
              </li>
            </ul>
          </div>
        );
      case 'guides':
        return (
          <div
            id="guides-panel"
            className="guides-tab"
            role="tabpanel"
            aria-labelledby="guides-tab"
          >
            <p>Explore our guides to enhance your betting experience:</p>
            <ul className="guide-links">
              <li>
                <Link to="/support/guides/betting-101">Betting 101</Link> (Coming Soon)
              </li>
              <li>
                <Link to="/support/guides/odds">How Odds Work</Link> (Coming Soon)
              </li>
              <li>
                <Link to="/support/guides/responsible-gambling">
                  Responsible Gambling
                </Link>{' '}
                (Coming Soon)
              </li>
            </ul>
            <div className="responsible-gambling">
              <h3>Responsible Gambling</h3>
              <p>
                Betting should be fun and safe. If you need help, visit these resources:
              </p>
              <ul>
                <li>
                  <a
                    href="https://www.begambleaware.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BeGambleAware
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.gamcare.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GamCare
                  </a>
                </li>
                <li>
                  <Link to="/profile/self-exclusion">Self-Exclusion Options</Link> (Coming
                  Soon)
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="support-page container" id="main-content">
      <AuthHeader />
      <h1 className="support-header">Support Center</h1>
      <section className="support-intro">
        <p>
          Welcome to Betflix Support Center. Whether you’re new to betting or need help
          with your account, we’re here to assist you 24/7.
        </p>
      </section>

      <section className="support-tabs">
        <div className="tab-buttons" role="tablist" aria-label="Support sections">
          <button
            id="faqs-tab"
            className={`tab-button ${activeTab === 'faqs' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'faqs'}
            aria-controls="faqs-panel"
            onClick={() => {
              setActiveTab('faqs');
              setSearch('');
            }}
            tabIndex={activeTab === 'faqs' ? 0 : -1}
          >
            FAQs
          </button>
          <button
            id="contact-tab"
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'contact'}
            aria-controls="contact-panel"
            onClick={() => setActiveTab('contact')}
            tabIndex={activeTab === 'contact' ? 0 : -1}
          >
            Contact Us
          </button>
          <button
            id="guides-tab"
            className={`tab-button ${activeTab === 'guides' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'guides'}
            aria-controls="guides-panel"
            onClick={() => setActiveTab('guides')}
            tabIndex={activeTab === 'guides' ? 0 : -1}
          >
            Guides & Resources
          </button>
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </section>

      <button className="back-btn" onClick={() => window.history.back()}>
        Back
      </button>
    </div>
  );
}

export default Support;
