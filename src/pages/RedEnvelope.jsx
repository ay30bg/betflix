// // betflix/src/pages/RedEnvelope.js
// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/red-envelope.css';

// const RedEnvelope = () => {
//   const { linkId } = useParams();
//   const [message, setMessage] = useState('');

//   const handleClaim = async () => {
//     try {
//       const token = localStorage.getItem('token'); // Adjust based on your auth
//       const response = await axios.post(
//         `https://betflix-backend.vercel.app/api/red-envelope/claim/${linkId}`,
//         { email: 'user@example.com' }, // Get email from auth context
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage(`Claimed $${response.data.amount}!`);
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'Claim failed');
//     }
//   };

//   return (
//     <div>
//       <h2>Claim Red Envelope</h2>
//       <button onClick={handleClaim}>Claim</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default RedEnvelope;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // Import jwt-decode
import '../styles/red-envelope.css';

const RedEnvelope = () => {
  const { linkId } = useParams(); // Get linkId from URL
  const navigate = useNavigate(); // For redirecting to login
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to claim the red envelope.');
      navigate('/login', { state: { from: `/red-envelope/${linkId}` } });
      return;
    }

    // Decode token to get user email
    let email;
    try {
      const decoded = jwtDecode(token); // Decode JWT token
      email = decoded.email; // Adjust based on your token's payload
      if (!email) {
        throw new Error('No email found in token');
      }
    } catch (error) {
      setMessage('Invalid login token. Please log in again.');
      localStorage.removeItem('token'); // Clear invalid token
      navigate('/login', { state: { from: `/red-envelope/${linkId}` } });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://betflix-backend.vercel.app/api/red-envelope/claim/${linkId}`,
        { email }, // Send decoded email
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`Claimed $${response.data.amount}!`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to claim. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="red-envelope-container">
      <h2>Claim Your Red Envelope</h2>
      <button
        onClick={handleClaim}
        disabled={isLoading}
        className="claim-button"
      >
        {isLoading ? 'Claiming...' : 'Claim'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RedEnvelope;
