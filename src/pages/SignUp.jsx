// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthHeader from '../components/AuthHeader';
// import '../styles/signup.css';

// function Signup() {
//   const navigate = useNavigate();
//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     referralCode: '',
//   });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.username || !formData.email || !formData.password) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/auth/signup`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Signup failed');
//       }

//       localStorage.setItem('token', data.token);
//       setFormData({ username: '', email: '', password: '', referralCode: '' });
//       navigate('/profile');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleBack = () => {
//     navigate('/');
//   };

//   return (
//     <div className="signup-page container">
//       <AuthHeader />
//       <h1 className="signup-header">Sign Up</h1>
//       <form onSubmit={handleSubmit} className="signup-form">
//         <div className="form-group">
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             placeholder="Enter your username"
//             required
//             disabled={isLoading}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//             required
//             disabled={isLoading}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Enter your password"
//             required
//             disabled={isLoading}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="referralCode">Referral Code (Optional)</label>
//           <input
//             type="text"
//             id="referralCode"
//             name="referralCode"
//             value={formData.referralCode}
//             onChange={handleChange}
//             placeholder="Enter referral code"
//             disabled={isLoading}
//           />
//         </div>
//         {error && <p className="error-message">{error}</p>}
//         <button type="submit" className="signup-button" disabled={isLoading}>
//           {isLoading ? 'Signing up...' : 'Sign Up'}
//         </button>
//         <p>
//           Already have an account? <a href="/login">Login</a>
//         </p>
//       </form>
//       <button className="back-btn" onClick={handleBack} disabled={isLoading}>
//         Back to Home
//       </button>
//     </div>
//   );
// }

// export default Signup;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';
import '../styles/signup.css';

function Signup() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: '',
    verificationCode: '', // New field for verification code
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false); // Track if verification code is sent

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  // Function to request a verification code
  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setError('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setIsCodeSent(true);
      setError('');
      alert('Verification code sent to your email');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!formData.verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      setFormData({ username: '', email: '', password: '', referralCode: '', verificationCode: '' });
      setIsCodeSent(false);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="signup-page container">
      <AuthHeader />
      <h1 className="signup-header">Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="email-input-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isLoading || isCodeSent}
            />
            {!isCodeSent && (
              <button
                type="button"
                className="send-code-btn"
                onClick={handleSendVerificationCode}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </button>
            )}
          </div>
        </div>
        {isCodeSent && (
          <div className="form-group">
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              placeholder="Enter verification code"
              required
              disabled={isLoading}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="referralCode">Referral Code (Optional)</label>
          <input
            type="text"
            id="referralCode"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Enter referral code"
            disabled={isLoading}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="signup-button" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
      <button className="back-btn" onClick={handleBack} disabled={isLoading}>
        Back to Home
      </button>
    </div>
  );
}

export default Signup;
