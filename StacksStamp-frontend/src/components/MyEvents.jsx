import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useWallet } from '../context/WalletContext';

export default function MyEvents({ refresh }) {
  const { address, isConnected } = useWallet();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (address) {
      fetchMyEvents();
    }
  }, [address, refresh]);

  const fetchMyEvents = async () => {
    if (!address) return;

    setLoading(true);
    setError('');
    try {
      const result = await apiService.getEventsByCreator(address);
      if (result.success) {
        setMyEvents(result.data || []);
      }
    } catch (err) {
      console.error('Fetch my events error:', err);
      setError('Failed to load your events');
      setMyEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!isConnected) {
    return (
      <div className="my-events-container">
        <h2>My Events</h2>
        <p className="warning">Connect your wallet to view your events</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading your events...</div>;
  }

  return (
    <div className="my-events-container">
      <h2>My Events</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {myEvents.length === 0 ? (
        <p className="no-events">You haven't created any events yet</p>
      ) : (
        <div className="events-grid">
          {myEvents.map((event, index) => (
            <div key={index} className="event-card my-event">
              <div className="event-header">
                <h3>{event.eventData?.name || 'Unnamed Event'}</h3>
                <span className="event-id">ID: {event.eventData?.['event-id']}</span>
              </div>

              <div className="event-details">
                <p><strong>Created:</strong> {formatTimestamp(event.timestamp)}</p>
                <p><strong>Block:</strong> {event.blockHeight}</p>
                <p><strong>Tx:</strong> {event.txId?.slice(0, 10)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
