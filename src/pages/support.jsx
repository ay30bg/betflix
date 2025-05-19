// components/UserSupport/UserSupport.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import '../styles/support.css';

const UserSupport = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [replyText, setReplyText] = useState('');

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://betflix-backend.vercel.app/api/support', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://betflix-backend.vercel.app/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send message');
      const newMessage = await res.json();
      setMessages([newMessage, ...messages]);
      setFormData({ subject: '', message: '' });
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://betflix-backend.vercel.app/api/support/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: replyText }),
      });
      if (!res.ok) throw new Error('Failed to send reply');
      const updatedMessage = await res.json();
      setMessages(messages.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg)));
      setSelectedMessage(updatedMessage);
      setReplyText('');
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    }
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
      <Header />
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
                <p className="empty-state">No messages found.</p>
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
                      <label htmlFor="replyText">Your Reply</label>
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
