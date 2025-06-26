// src/App.js
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BalanceProvider } from './context/BalanceContext';
import Navbar from './components/navbar';
import FlingoGame from './pages/FlingoGame';
import EvenOdd from './pages/EvenOdd';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Game from './pages/Game';
import History from './pages/History';
import Verify from './pages/Verify';
import Signup from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import UserSupport from './pages/support';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RedEnvelope from './pages/RedEnvelope';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Layout() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/sign-up', '/forgot-password', '/reset-password', '/verify-email', '/red-envelope/:linkId'];

  return (
    <>
      {!hideNavbarPaths.some(path => location.pathname.startsWith(path.split('/:')[0])) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>} />
        <Route path="/game/flingo" element={<ProtectedRoute><FlingoGame /></ProtectedRoute>} />
        <Route path="/game/even-odd" element={<ProtectedRoute><EvenOdd /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/support" element={<UserSupport />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/red-envelope/:linkId" element={<ProtectedRoute><RedEnvelope /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BalanceProvider>
        <Router>
          <Layout />
        </Router>
      </BalanceProvider>
    </QueryClientProvider>
  );
}

export default App;
