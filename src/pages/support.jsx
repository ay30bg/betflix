// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaSearch } from 'react-icons/fa';
// import AuthHeader from '../components/AuthHeader';
// import '../styles/support.css';

// function Support() {
//   const [activeTab, setActiveTab] = useState('faqs');
//   const [search, setSearch] = useState('');

//   // FAQ data
//   const faqs = [
//     {
//       question: 'How do I register for an account?',
//       answer:
//         'Navigate to the Sign Up page via the "Sign Up" link. Provide a valid email and a strong password, then verify your account through the email link sent to you.',
//     },
//     {
//       question: 'What if I can’t log in?',
//       answer:
//         'Check your email and password on the Login page. If you’ve forgotten your password, use the "Forgot Password?" link to reset it. Contact support if issues persist.',
//     },
//     {
//       question: 'How do I add funds to my betting account?',
//       answer:
//         'Visit the Profile page, click "Deposit," and select a payment option (e.g., card, PayPal). Follow the secure checkout process to fund your account.',
//     },
//     {
//       question: 'Are my bets and personal data safe?',
//       answer:
//         'We use industry-standard encryption and comply with data protection regulations. Review our Privacy Policy for details on how we secure your information.',
//     },
//     {
//       question: 'How do I place a bet on an event?',
//       answer:
//         'Go to the Game page, select an event, choose your bet type (e.g., moneyline, spread), enter your stake, and submit. View your bets on the History page.',
//     },
//   ];

//   // Filter FAQs based on search
//   const filteredFaqs = faqs.filter((faq) =>
//     faq.question.toLowerCase().includes(search.toLowerCase())
//   );

//   // Tab content
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'faqs':
//         return (
//           <div id="faqs-panel" className="faq-tab" role="tabpanel" aria-labelledby="faqs-tab">
//             <div className="search-bar">
//               <FaSearch className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search FAQs..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 aria-label="Search FAQs"
//               />
//             </div>
//             <div className="faq-list">
//               {filteredFaqs.length > 0 ? (
//                 filteredFaqs.map((faq, index) => (
//                   <div key={index} className="faq-item">
//                     <h3>{faq.question}</h3>
//                     <p>{faq.answer}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No FAQs match your search.</p>
//               )}
//             </div>
//           </div>
//         );
//       case 'contact':
//         return (
//           <div
//             id="contact-panel"
//             className="contact-tab"
//             role="tabpanel"
//             aria-labelledby="contact-tab"
//           >
//             <p>Get in touch with our support team for personalized assistance.</p>
//             <ul className="contact-options">
//               <li>
//                 <strong>Email:</strong>{' '}
//                 <a href="mailto:betflix.bets@gmail.com">betflix.bets@gmail.com</a>
//               </li>
//               <li>
//                 <strong>Phone:</strong> <a href="tel:+1234567890">+1 (234) 567-890</a>
//               </li>
//               <li>
//                 <strong>Live Chat:</strong>{' '}
//                 <button className="live-chat-btn" disabled>
//                   Chat Coming Soon
//                 </button>
//               </li>
//               <li>
//                 <strong>Support Hours:</strong> 24/7
//               </li>
//             </ul>
//           </div>
//         );
//       case 'guides':
//         return (
//           <div
//             id="guides-panel"
//             className="guides-tab"
//             role="tabpanel"
//             aria-labelledby="guides-tab"
//           >
//             <p>Explore our guides to enhance your betting experience:</p>
//             <ul className="guide-links">
//               <li>
//                 <Link to="/support/guides/betting-101">Betting 101</Link> (Coming Soon)
//               </li>
//               <li>
//                 <Link to="/support/guides/odds">How Odds Work</Link> (Coming Soon)
//               </li>
//               <li>
//                 <Link to="/support/guides/responsible-gambling">
//                   Responsible Gambling
//                 </Link>{' '}
//                 (Coming Soon)
//               </li>
//             </ul>
//             <div className="responsible-gambling">
//               <h3>Responsible Gambling</h3>
//               <p>
//                 Betting should be fun and safe. If you need help, visit these resources:
//               </p>
//               <ul>
//                 <li>
//                   <a
//                     href="https://www.begambleaware.org"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     BeGambleAware
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="https://www.gamcare.org.uk"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     GamCare
//                   </a>
//                 </li>
//                 <li>
//                   <Link to="/profile/self-exclusion">Self-Exclusion Options</Link> (Coming
//                   Soon)
//                 </li>
//               </ul>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="support-page container" id="main-content">
//       <AuthHeader />
//       <h1 className="support-header">Support Center</h1>
//       <section className="support-intro">
//         <p>
//           Welcome to Betflix Support Center. Whether you’re new to betting or need help
//           with your account, we’re here to assist you 24/7.
//         </p>
//       </section>

//       <section className="support-tabs">
//         <div className="tab-buttons" role="tablist" aria-label="Support sections">
//           <button
//             id="faqs-tab"
//             className={`tab-button ${activeTab === 'faqs' ? 'active' : ''}`}
//             role="tab"
//             aria-selected={activeTab === 'faqs'}
//             aria-controls="faqs-panel"
//             onClick={() => {
//               setActiveTab('faqs');
//               setSearch('');
//             }}
//             tabIndex={activeTab === 'faqs' ? 0 : -1}
//           >
//             FAQs
//           </button>
//           <button
//             id="contact-tab"
//             className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
//             role="tab"
//             aria-selected={activeTab === 'contact'}
//             aria-controls="contact-panel"
//             onClick={() => setActiveTab('contact')}
//             tabIndex={activeTab === 'contact' ? 0 : -1}
//           >
//             Contact Us
//           </button>
//           <button
//             id="guides-tab"
//             className={`tab-button ${activeTab === 'guides' ? 'active' : ''}`}
//             role="tab"
//             aria-selected={activeTab === 'guides'}
//             aria-controls="guides-panel"
//             onClick={() => setActiveTab('guides')}
//             tabIndex={activeTab === 'guides' ? 0 : -1}
//           >
//             Guides & Resources
//           </button>
//         </div>
//         <div className="tab-content">{renderTabContent()}</div>
//       </section>

//       <button className="back-btn" onClick={() => window.history.back()}>
//         Back
//       </button>
//     </div>
//   );
// }

// export default Support;

// components/UserSupport/UserSupport.jsx
import React, { useState } from 'react';
import '../styles/support.css';

// Mock user messages data (filtered for the logged-in user)
const initialMessages = [
  {
    id: 1,
    userId: 'user123',
    username: 'John Doe',
    subject: 'Login Problem',
    message: 'I can’t log into my account. It says invalid credentials.',
    timestamp: '2025-05-18T10:30:00Z',
    status: 'Open',
    replies: [
      {
        id: 1,
        sender: 'admin',
        message: 'Please try resetting your password using the "Forgot Password" link.',
        timestamp: '2025-05-18T11:00:00Z',
      },
    ],
  },
  {
    id: 2,
    userId: 'user123',
    username: 'John Doe',
    subject: 'Feature Request',
    message: 'Can you add a dark mode option to the app?',
    timestamp: '2025-05-17T14:20:00Z',
    status: 'Open',
    replies: [],
  },
];

const UserSupport = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [replyText, setReplyText] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      userId: 'user123', // Replace with actual user ID from auth
      username: 'John Doe', // Replace with actual username
      subject: formData.subject,
      message: formData.message,
      timestamp: new Date().toISOString(),
      status: 'Open',
      replies: [],
    };

    setMessages([newMessage, ...messages]);
    setFormData({ subject: '', message: '' });
    alert('Message sent successfully!');
  };

  // Handle reply submission
  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const updatedMessages = messages.map((msg) =>
      msg.id === selectedMessage.id
        ? {
            ...msg,
            replies: [
              ...msg.replies,
              {
                id: msg.replies.length + 1,
                sender: 'user',
                message: replyText,
                timestamp: new Date().toISOString(),
              },
            ],
            status: 'Open', // Reopens the thread
          }
        : msg
    );

    setMessages(updatedMessages);
    setSelectedMessage({
      ...selectedMessage,
      replies: [
        ...selectedMessage.replies,
        {
          id: selectedMessage.replies.length + 1,
          sender: 'user',
          message: replyText,
          timestamp: new Date().toISOString(),
        },
      ],
      status: 'Open',
    });
    setReplyText('');
    alert('Reply sent successfully!');
  };

  // Select a message to view
  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setReplyText('');
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className="support-container">
      <h1>Support Center</h1>

      <div className="support-layout">
        {/* New Message Form */}
        <section className="new-message">
          <h2>Send a New Message</h2>
          <form onSubmit={handleSubmit} className="message-form">
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What’s the issue?"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe your issue or question..."
                required
                rows="4"
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </section>

        {/* Message List and Details */}
        <section className="messages-section">
          <h2>Your Messages</h2>
          <div className="messages-layout">
            {/* Message List */}
            <div className="message-list">
              {messages.length === 0 ? (
                <p className="empty-state">You haven’t sent any messages yet.</p>
              ) : (
                <ul>
                  {messages.map((message) => (
                    <li
                      key={message.id}
                      className={`message-item ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                      onClick={() => handleSelectMessage(message)}
                    >
                      <div className="message-header">
                        <span className="message-subject">{message.subject}</span>
                        <span className={`message-status ${message.status.toLowerCase()}`}>
                          {message.status}
                        </span>
                      </div>
                      <div className="message-snippet">{message.message.slice(0, 50)}...</div>
                      <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Message Details */}
            <div className="message-details">
              {selectedMessage ? (
                <>
                  <div className="message-content">
                    <div className="message-meta">
                      <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                      <p><strong>Date:</strong> {formatTimestamp(selectedMessage.timestamp)}</p>
                      <p><strong>Status:</strong> {selectedMessage.status}</p>
                    </div>
                    <div className="message-body">
                      <p>{selectedMessage.message}</p>
                    </div>
                    {selectedMessage.replies.length > 0 && (
                      <div className="replies">
                        <h3>Conversation</h3>
                        {selectedMessage.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className={`reply ${reply.sender === 'admin' ? 'reply-admin' : 'reply-user'}`}
                          >
                            <p>
                              <strong>{reply.sender === 'admin' ? 'Support Team' : 'You'}:</strong>{' '}
                              {reply.message}
                            </p>
                            <p className="reply-timestamp">{formatTimestamp(reply.timestamp)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleReplySubmit} className="reply-form">
                    <div className="form-group">
                      <textarea
                        id="replyText"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        required
                        rows="3"
                      ></textarea>
                    </div>
                    <button type="submit" className="submit-button">
                      Send Reply
                    </button>
                  </form>
                </>
              ) : (
                <p className="empty-state">Select a message to view the conversation.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserSupport;
