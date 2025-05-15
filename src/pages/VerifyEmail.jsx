// import { useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import AuthHeader from '../components/AuthHeader';
// import '../styles/verify-email.css'; // Create this CSS file for styling

// function VerifyEmail() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const email = searchParams.get('email') || '';
//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   const [verificationCode, setVerificationCode] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!verificationCode) {
//       setError('Please enter the verification code');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/auth/verify-email`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ email, code: verificationCode }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Verification failed');
//       }

//       // Verification successful, redirect to profile
//       navigate('/profile');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendCode = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to resend code');
//       }
//       setError('');
//       alert('Verification code resent to your email');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="verify-email-page container">
//       <AuthHeader />
//       <h1 className="verify-header">Verify Your Email</h1>
//       <p>A verification code has been sent to {email}</p>
//       <form onSubmit={handleSubmit} className="verify-form">
//         <div className="form-group">
//           <label htmlFor="verificationCode">Verification Code</label>
//           <input
//             type="text"
//             id="verificationCode"
//             name="verificationCode"
//             value={verificationCode}
//             onChange={(e) => setVerificationCode(e.target.value)}
//             placeholder="Enter verification code"
//             required
//             disabled={isLoading}
//           />
//         </div>
//         {error && <p className="error-message">{error}</p>}
//         <button type="submit" className="verify-button" disabled={isLoading}>
//           {isLoading ? 'Verifying...' : 'Verify Email'}
//         </button>
//         <p>
//           Didn't receive the code?{' '}
//           <button
//             type="button"
//             className="resend-link"
//             onClick={handleResendCode}
//             disabled={isLoading}
//           >
//             Resend Code
//           </button>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default VerifyEmail;

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';
import '../styles/verify-email.css';

function VerifyEmail() {
  const   const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Response error:', response.status, text);
        throw new Error(`Verification failed: ${text}`);
      }

      const data = await response.json();
      setVerificationCode('');
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Resend error:', response.status, text);
        throw new Error(`Failed to resend code: ${text}`);
      }

      setError('');
      alert('Verification code resent to your email');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-email-page container">
      <AuthHeader />
      <h1 className="verify-header">Verify Your Email</h1>
      <p>A verification code has been sent to {email}</p>
      <form onSubmit={handleSubmit} className="verify-form">
        <div className="form-group">
          <label htmlFor="verificationCode">Verification Code</label>
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            required
            disabled={isLoading}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="verify-button" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
        <p>
          Didn't receive the code?{' '}
          <button
            type="button"
            className="resend-link"
            onClick={handleResendCode}
            disabled={isLoading}
          >
            Resend Code
          </button>
        </p>
      </form>
    </div>
  );
}

export default VerifyEmail;
