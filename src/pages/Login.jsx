import '../styles/login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Hook for navigation

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication (replace with your actual API call)
    try {
      // Example: Call your authentication API
      // const response = await authLogin(formData.email, formData.password);
      // if (response.success) {
      console.log('Login successful:', formData);
      setFormData({ email: '', password: '' }); // Reset form
      navigate('/'); // Navigate to home page
      // } else {
      // throw new Error('Invalid credentials');
      // }
    } catch (error) {
      console.error('Login failed:', error.message);
      // Optionally, display error to user
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page container">
      <h1 className='login-header'>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email or Username</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email or username"
            required
          />
        </div>
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
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
      <a href="/" className="back-link">
        Back to Home
      </a>
    </div>
  );
}

export default Login;