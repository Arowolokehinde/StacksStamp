import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useWallet } from '../context/WalletContext';

export default function EventList({ refresh }) {
  const { address } = useWallet();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [refresh]);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiService.getAllEvents(0, 20);
      if (result.success) {
        setEvents(result.data.events || []);
      }
    } catch (err) {
      console.error('Fetch events error:', err);
      setError('No events found or failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckIns = async (eventId) => {
    try {
      const result = await apiService.getEventCheckIns(eventId);
      if (result.success) {
        setCheckIns(result.data || []);
        setSelectedEvent(eventId);
      }
    } catch (err) {
      console.error('Fetch check-ins error:', err);
      setCheckIns([]);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="event-list-container">
      <h2>All Events</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {events.length === 0 ? (
        <p className="no-events">No events created yet. Be the first to create one!</p>
      ) : (
        <div className="events-grid">
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <div className="event-header">
                <h3>{event.eventData?.name || 'Unnamed Event'}</h3>
                <span className="event-id">ID: {event.eventData?.['event-id']}</span>
              </div>

              <div className="event-details">
                <p><strong>Creator:</strong> {shortenAddress(event.eventData?.creator)}</p>
                <p><strong>Created:</strong> {formatTimestamp(event.timestamp)}</p>
                <p><strong>Block:</strong> {event.blockHeight}</p>
              </div>

              <button
                onClick={() => fetchCheckIns(event.eventData?.['event-id'])}
                className="btn btn-secondary btn-small"
              >
                View Attendees
              </button>

              {selectedEvent === event.eventData?.['event-id'] && (
                <div className="check-ins-list">
                  <h4>Attendees ({checkIns.length})</h4>
                  {checkIns.length === 0 ? (
                    <p>No check-ins yet</p>
                  ) : (
                    <ul>
                      {checkIns.map((checkIn, idx) => (
                        <li key={idx}>
                          <span>{shortenAddress(checkIn.attendee)}</span>
                          <span className="timestamp">{formatTimestamp(checkIn.timestamp)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
