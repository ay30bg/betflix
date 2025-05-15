// import { useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import AuthHeader from '../components/AuthHeader';
// import '../styles/verify-email.css';

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

//       if (!response.ok) {
//         const text = await response.text();
//         console.error('Response error:', response.status, text);
//         throw new Error(`Verification failed: ${text}`);
//       }

//       const data = await response.json();
//       setVerificationCode('');
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

//       if (!response.ok) {
//         const text = await response.text();
//         console.error('Resend error:', response.status, text);
//         throw new Error(`Failed to resend code: ${text}`);
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

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';
import '../styles/verify-email.css';

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

  const [verificationCode, setVerificationCode] = useState('');
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Notification timeout
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setNotification({ type: 'error', message: 'Please enter the verification code' });
      return;
    }
    if (!/^\d{6}$/.test(verificationCode)) {
      setNotification({ type: 'error', message: 'Verification code must be 6 digits' });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({ type: 'error', message: 'Please log in to verify your email' });
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Verification failed';
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      setVerificationCode('');
      setNotification({ type: 'success', message: 'Email verified successfully!' });
      setTimeout(() => navigate('/profile'), 3000);
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({ type: 'error', message: 'Please log in to resend the code' });
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to resend code';
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      setNotification({ type: 'success', message: 'Verification code resent to your email' });
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-email-page container">
      <AuthHeader />
      {notification && (
        <div className={`result ${notification.type}`} role="alert" aria-live="polite">
          {notification.message}
        </div>
      )}
      <h1>Verify Your Email</h1>
      <div className="verify-email-container">
        <div className="verify-email-form">
          <p>A verification code has been sent to {email}</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="verificationCode" className="verify-label">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="verify-input"
                placeholder="Enter 6-digit code"
                required
                disabled={isLoading}
                maxLength="6"
              />
            </div>
            <button
              type="submit"
              className="verify-button"
              disabled={isLoading}
              aria-label="Verify email"
            >
              {isLoading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Verifying...
                </span>
              ) : (
                'Verify Email'
              )}
            </button>
            <p className="resend-text">
              Didn't receive the code?{' '}
              <button
                type="button"
                className="resend-button"
                onClick={handleResendCode}
                disabled={isLoading}
                aria-label="Resend verification code"
              >
                Resend Code
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
