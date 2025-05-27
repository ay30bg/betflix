import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BalanceProvider } from './context/BalanceContext';
import Navbar from './components/navbar';
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

// Component to conditionally render Navbar
function Layout() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/sign-up', '/forgot-password', '/reset-password', '/verify-email'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/history" element={<History />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/support" element={<UserSupport />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/red-envelope/:linkId" element={<RedEnvelope />} />
        
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

