import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('/api/get_summary');
        if (!res.ok) {
          throw new Error('Failed to fetch summary data');
        }
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '20px' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Total Items</h2>
          <p style={{ fontSize: '1.5rem' }}>{summary.total}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Completed</h2>
          <p style={{ fontSize: '1.5rem', color: 'green' }}>{summary.completed}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Pending</h2>
          <p style={{ fontSize: '1.5rem', color: 'orange' }}>{summary.pending}</p>
        </div>
      </div>
    </div>
  );
}
