import axios from 'axios';
import { BACKEND_API_URL } from '../config/stacks';

const api = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get all events
  async getAllEvents(offset = 0, limit = 50) {
    const response = await api.get(`/api/events?offset=${offset}&limit=${limit}`);
    return response.data;
  },

  // Get specific event
  async getEvent(eventId) {
    const response = await api.get(`/api/events/${eventId}`);
    return response.data;
  },

  // Get event check-ins
  async getEventCheckIns(eventId, limit = 100) {
    const response = await api.get(`/api/events/${eventId}/check-ins?limit=${limit}`);
    return response.data;
  },

  // Get events by creator
  async getEventsByCreator(address, limit = 50) {
    const response = await api.get(`/api/events/creator/${address}?limit=${limit}`);
    return response.data;
  },

  // Check attendance
  async checkAttendance(eventId, address) {
    const response = await api.get(`/api/attendance/${eventId}/${address}`);
    return response.data;
  },

  // Build create-event transaction
  async buildCreateEventTx(eventName, senderAddress) {
    const response = await api.post('/api/transactions/create-event', {
      eventName,
      senderAddress,
    });
    return response.data;
  },

  // Build check-in transaction
  async buildCheckInTx(eventId, senderAddress) {
    const response = await api.post('/api/transactions/check-in', {
      eventId,
      senderAddress,
    });
    return response.data;
  },

  // Build close-event transaction
  async buildCloseEventTx(eventId, senderAddress) {
    const response = await api.post('/api/transactions/close-event', {
      eventId,
      senderAddress,
    });
    return response.data;
  },
};

export default api;
