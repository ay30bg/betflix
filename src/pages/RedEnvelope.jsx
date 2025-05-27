// betflix/src/pages/RedEnvelope.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/red-envelope.css';

const RedEnvelope = () => {
  const { linkId } = useParams();
  const [message, setMessage] = useState('');

  const handleClaim = async () => {
    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth
      const response = await axios.post(
        `https://betflix-backend.vercel.app/api/red-envelope/claim/${linkId}`,
        { email: 'user@example.com' }, // Get email from auth context
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Claimed $${response.data.amount}!`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Claim failed');
    }
  };

  return (
    <div>
      <h2>Claim Red Envelope</h2>
      <button onClick={handleClaim}>Claim</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RedEnvelope;

