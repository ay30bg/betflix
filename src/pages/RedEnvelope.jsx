// import React, { useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useMutation } from '@tanstack/react-query';
// import axios from 'axios';
// import { useBalance } from '../context/BalanceContext'; // Import useBalance instead

// const RedEnvelope = () => {
//   const { linkId } = useParams();
//   const navigate = useNavigate();
//   const { setBalance } = useBalance(); // Use useBalance hook to get setBalance
//   const { mutate, isPending, error, data } = useMutation({
//     mutationFn: async () => {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Please log in to claim the red envelope');
//       const response = await axios.post(
//         `https://betflix-backend.vercel.app/api/red-envelope/claim/${linkId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data;
//     },
//     onSuccess: (data) => {
//       // Update balance in context
//       setBalance((prev) => prev + data.amount); // Use setBalance from useBalance
//     },
//     onError: (err) => {
//       if (err.message === 'Please log in to claim the red envelope') {
//         navigate('/login');
//       }
//     },
//   });

//   // Auto-claim on component mount
//   React.useEffect(() => {
//     mutate();
//   }, [mutate]);

//   return (
//     <div style={{ textAlign: 'center', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
//       <h1>Red Envelope Claim</h1>
//       {isPending && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>{error.response?.data?.error || error.message}</p>}
//       {data && (
//         <div>
//           <p style={{ color: 'green' }}>{data.message}</p>
//           <p>You claimed ${data.amount.toFixed(2)}!</p>
//           <button onClick={() => navigate('/profile')} style={{ marginTop: '10px' }}>
//             View Profile
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RedEnvelope;

import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useBalance } from '../context/BalanceContext';
import '../styles/red-envelope.css'; 

const RedEnvelope = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { setBalance } = useBalance();
  const { mutate, isPending, error, data } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to claim the red envelope');
      const response = await axios.post(
        `https://betflix-backend.vercel.app/api/red-envelope/claim/${linkId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setBalance((prev) => prev + data.amount);
    },
    onError: (err) => {
      if (err.message === 'Please log in to claim the red envelope') {
        navigate('/login');
      }
    },
  });

  React.useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <div className="red-envelope-container">
      <h1>Red Envelope Claim</h1>
      {isPending && <p className="loading">Loading...</p>}
      {error && <p className="error">{error.response?.data?.error || error.message}</p>}
      {data && (
        <div className="success-container">
          <p className="success">{data.message}</p>
          <p className="amount">You claimed ${data.amount.toFixed(2)}!</p>
          <button onClick={() => navigate('/profile')}>
            View Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default RedEnvelope;
