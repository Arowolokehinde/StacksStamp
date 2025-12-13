import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { contractService } from '../services/contract';
import { apiService } from '../services/api';

export default function CheckIn({ onCheckInComplete }) {
  const { isConnected, address, userSession } = useWallet();
  const [eventId, setEventId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checking, setChecking] = useState(false);

  const checkAttendanceStatus = async (id) => {
    if (!address || !id) return;

    setChecking(true);
    try {
      const result = await apiService.checkAttendance(id, address);
      if (result.success && result.data.didAttend?.value) {
        setError('You have already checked into this event');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Check attendance error:', err);
      return true; // Allow check-in if we can't verify
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!eventId.trim()) {
      setError('Event ID is required');
      return;
    }

    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    // Check if already attended
    const canCheckIn = await checkAttendanceStatus(eventId);
    if (!canCheckIn) {
      return;
    }

    setLoading(true);

    try {
      await contractService.checkIn(parseInt(eventId), userSession);
      setSuccess(`Check-in to Event #${eventId} initiated! Check your wallet for confirmation.`);
      setEventId('');
      if (onCheckInComplete) {
        setTimeout(() => onCheckInComplete(), 2000);
      }
    } catch (err) {
      console.error('Check-in error:', err);
      setError(err.message || 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-in-card">
      <h2>Check Into Event</h2>
      <form onSubmit={handleSubmit} className="check-in-form">
        <div className="form-group">
          <label htmlFor="eventId">Event ID</label>
          <input
            type="number"
            id="eventId"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="Enter event ID"
            min="0"
            disabled={loading || !isConnected || checking}
            className="input"
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button
          type="submit"
          disabled={loading || !isConnected || checking}
          className="btn btn-primary"
        >
          {loading ? 'Checking In...' : checking ? 'Verifying...' : 'Check In'}
        </button>

        {!isConnected && (
          <p className="warning">Please connect your wallet to check in</p>
        )}
      </form>
    </div>
  );
}
