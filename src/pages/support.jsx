// components/UserSupport/UserSupport.jsx
import React, { useState } from 'react';
import AuthHeader from '../components/AuthHeader';
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
      <AuthHeader />
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
      <button className="back-btn" onClick={() => window.history.back()}>
       Back
     </button>
    </div>
  );
};

export default UserSupport;
