import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyResult } from '../utils/verifyResult';
import Header from '../components/header';
import '../styles/verify.css';

function Verify() {
  const [serverSeed, setServerSeed] = useState('');
  const [clientSeed, setClientSeed] = useState('');
  const [nonce, setNonce] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      alert('Access restricted to admins only.');
      navigate('/');
    }
  }, [navigate]);

  const handleVerify = () => {
    setError('');
    setResult('');
    try {
      const computedResult = verifyResult(serverSeed, clientSeed, nonce);
      setResult(computedResult);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="verify-page container">
      <Header />
      <h1>Admin: Verify Game Result</h1>
      <p>Enter the server seed, client seed, and nonce to verify game fairness.</p>
      <form className="verify-form" onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
        {error && <p className="verify-error" role="alert">{error}</p>}
        <div className="form-group">
          <label htmlFor="server-seed">Server Seed</label>
          <input
            id="server-seed"
            type="text"
            value={serverSeed}
            onChange={(e) => setServerSeed(e.target.value)}
            placeholder="Enter server seed"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="client-seed">Client Seed</label>
          <input
            id="client-seed"
            type="text"
            value={clientSeed}
            onChange={(e) => setClientSeed(e.target.value)}
            placeholder="Enter client seed"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nonce">Nonce</label>
          <input
            id="nonce"
            type="number"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            placeholder="Enter nonce"
            required
          />
        </div>
        <button type="submit" className="verify-button">Verify</button>
      </form>
      {result && (
        <p className={`verify-result ${result.toLowerCase()}`}>
          Computed Result: <strong>{result}</strong>
        </p>
      )}
    </div>
  );
}

export default Verify;