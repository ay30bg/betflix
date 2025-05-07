import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/signup.css';

function Signup() {
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize form data
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        referral: '',
    });

    // State for errors and loading
    const [errors, setErrors] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Extract referral from URL query parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ref = params.get('ref');
        if (ref) {
            setFormData((prev) => ({ ...prev, referral: decodeURIComponent(ref) }));
        }
    }, [location.search]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors('');
        setIsLoading(true);

        // Basic validation
        if (!formData.username.trim()) {
            setErrors('Username is required');
            setIsLoading(false);
            return;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setErrors('A valid email is required');
            setIsLoading(false);
            return;
        }
        if (formData.password.length < 6) {
            setErrors('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setErrors('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call for signup
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Save user to localStorage (mimicking Profile component)
            const newUser = {
                username: formData.username,
                email: formData.email,
                balance: 1000, // Default balance, matching Profile
            };
            localStorage.setItem('userProfile', JSON.stringify(newUser));

            // If referral is provided, log it (could be sent to an API)
            if (formData.referral) {
                console.log(`Referred by: ${formData.referral}`);
            }

            setNotification({ type: 'success', message: 'Signup successful! Redirecting to login...' });
            setFormData({ username: '', email: '', password: '', confirmPassword: '', referral: '' });

            // Redirect to login after a delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Signup failed:', error.message);
            setErrors('Signup failed. Please try again.');
            setNotification({ type: 'error', message: 'Signup failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

     // Handle back button click
  const handleBack = () => {
    navigate('/');
  };


    return (
        <div className="signup-page container">
            {isLoading && (
                <div className="loading-spinner" aria-live="polite">
                    Processing...
                </div>
            )}
            {notification && (
                <div className={`result ${notification.type}`} role="alert">
                    {notification.message}
                </div>
            )}
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
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="referral">Referral Code (Optional)</label>
                    <input
                        type="text"
                        id="referral"
                        name="referral"
                        value={formData.referral}
                        onChange={handleChange}
                        placeholder="Enter referral code"
                        disabled={isLoading}
                    />
                </div>
                {errors && <p className="signup-error">{errors}</p>}
                <button type="submit" className="signup-button" disabled={isLoading}>
                    Sign Up
                </button>
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
            <button 
            className='back-btn'
            onClick={handleBack}
            >
                Back to Home
            </button>
            {/* <a href="/" className="back-link">
        Back to Home
      </a> */}
        </div>
    );
}

export default Signup;
