import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { contractService } from '../services/contract';

export default function CreateEvent({ onEventCreated }) {
  const { isConnected, address, userSession } = useWallet();
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!eventName.trim()) {
      setError('Event name is required');
      return;
    }

    if (eventName.length > 100) {
      setError('Event name must be 100 characters or less');
      return;
    }

    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);

    try {
      await contractService.createEvent(eventName, userSession);
      setSuccess(`Event "${eventName}" creation initiated! Check your wallet for confirmation.`);
      setEventName('');
      if (onEventCreated) {
        setTimeout(() => onEventCreated(), 2000);
      }
    } catch (err) {
      console.error('Create event error:', err);
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-card">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-group">
          <label htmlFor="eventName">Event Name</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name (max 100 characters)"
            maxLength={100}
            disabled={loading || !isConnected}
            className="input"
          />
          <small>{eventName.length}/100 characters</small>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button
          type="submit"
          disabled={loading || !isConnected}
          className="btn btn-primary"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>

        {!isConnected && (
          <p className="warning">Please connect your wallet to create events</p>
        )}
      </form>
    </div>
  );
}
