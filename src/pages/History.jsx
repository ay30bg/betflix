import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import HistoryTable from '../components/HistoryTable';
import '../styles/history.css';

function History() {
  const { isAuthenticated } = useAuth0();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['history', page],
    queryFn: async () => {
      const { data } = await api.get(`/api/history?page=${page}`);
      return data;
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <div className="text-center mt-10">Please log in to view history.</div>;
  }

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10">Error: {error.message}</div>;
  }

  return (
    <div className="history-page container">
      <h1>Bet History</h1>
      <HistoryTable bets={data?.bets || []} />
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={data?.bets.length < 50}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default History;