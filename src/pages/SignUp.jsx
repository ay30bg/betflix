// import { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
// import AuthHeader from '../components/AuthHeader';
// import '../styles/signup.css';

// function Signup() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams(); // Get query parameters
//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   // Initialize formData with referralCode from URL
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     referralCode: searchParams.get('ref') || '', // Prefill with ref parameter
//   });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // Optional: Log the referral code for debugging
//   useEffect(() => {
//     const refCode = searchParams.get('ref');
//     if (refCode) {
//       console.log('Referral code from URL:', refCode);
//     }
//   }, [searchParams]);

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
//           <div className="password-wrapper">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               required
//               disabled={isLoading}
//               className="password-input"
//             />
//             <span
//               className="eye-icon"
//               onClick={() => setShowPassword(!showPassword)}
//               aria-label={showPassword ? 'Hide password' : 'Show password'}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
//             >
//               {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
//             </span>
//           </div>
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

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import AuthHeader from '../components/AuthHeader';
import '../styles/signup.css';

function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: searchParams.get('ref') || '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      console.log('Referral code from URL:', refCode);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
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

      // Store JWT token
      localStorage.setItem('token', data.token);
      // Clear form
      setFormData({ username: '', email: '', password: '', referralCode: searchParams.get('ref') || '' });
      // Redirect to verify-email with email query param
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
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
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="password-input"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
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
