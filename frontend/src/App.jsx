import React, { useEffect, useState } from 'react';

export default function App() {
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({ name: '', country: '', description: '', price: '' });
  const [error, setError] = useState('');

  const fetchDestinations = async () => {
    try {
      const res = await fetch('/api/destinations');
      if (!res.ok) throw new Error('API unreachable');
      const data = await res.json();
      setDestinations(data);
      setError('');
    } catch (err) {
      setError('Could not load destinations. Check backend & database connection.');
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: '', country: '', description: '', price: '' });
        fetchDestinations();
      }
    } catch (err) {
      setError('Failed to add destination.');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
    fetchDestinations();
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#38bdf8' }}>TravelVerse</h1>
        <p style={{ margin: '0.5rem 0 0', color: '#94a3b8' }}>
          Cloud-Native 3-Tier Demo — Running on Kubernetes (Kind) + ArgoCD GitOps
        </p>
      </header>

      {error && (
        <div style={{ background: '#7f1d1d', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem', background: '#1e293b', padding: '1.25rem', borderRadius: 10, marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Add a Destination</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '0.75rem' }}>
          <input placeholder="City / Place" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
          <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required style={inputStyle} />
          <input type="number" placeholder="Price ($)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required style={inputStyle} />
        </div>
        <input placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required style={inputStyle} />
        <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 6, cursor: 'pointer', fontWeight: 600, width: 'fit-content' }}>
          + Add Destination
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {destinations.map((d) => (
          <div key={d.id} style={{ background: '#1e293b', padding: '1.25rem', borderRadius: 10, border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{d.name}</h3>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>${d.price}</span>
              </div>
              <p style={{ margin: '0.25rem 0 0.75rem', fontSize: '0.85rem', color: '#94a3b8' }}>{d.country}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.4 }}>{d.description}</p>
            </div>
            <button onClick={() => handleDelete(d.id)} style={{ marginTop: '1rem', background: 'transparent', color: '#f87171', border: '1px solid #7f1d1d', padding: '0.35rem 0.75rem', borderRadius: 6, cursor: 'pointer', alignSelf: 'flex-start' }}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.6rem',
  borderRadius: 6,
  border: '1px solid #475569',
  background: '#0f172a',
  color: '#f8fafc',
};
