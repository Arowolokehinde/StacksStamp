const {
  fetchCallReadOnlyFunction,
  cvToJSON,
  stringAsciiCV,
  uintCV,
  principalCV,
  AnchorMode,
} = require('@stacks/transactions');
const config = require('../config/stacks');
const axios = require('axios');

class StacksService {
  /**
   * Get event details by event ID
   */
  async getEvent(eventId) {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: config.contractAddress,
        contractName: config.contractName,
        functionName: 'get-event',
        functionArgs: [uintCV(eventId)],
        network: config.network,
        senderAddress: config.contractAddress,
      });

      return cvToJSON(result);
    } catch (error) {
      throw new Error(`Failed to get event: ${error.message}`);
    }
  }

  /**
   * Check if a user attended an event
   */
  async didAttend(eventId, attendeeAddress) {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: config.contractAddress,
        contractName: config.contractName,
        functionName: 'did-attend',
        functionArgs: [uintCV(eventId), principalCV(attendeeAddress)],
        network: config.network,
        senderAddress: config.contractAddress,
      });

      return cvToJSON(result);
    } catch (error) {
      throw new Error(`Failed to check attendance: ${error.message}`);
    }
  }

  /**
   * Get attendance timestamp for a user at an event
   */
  async getAttendance(eventId, attendeeAddress) {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: config.contractAddress,
        contractName: config.contractName,
        functionName: 'get-attendance',
        functionArgs: [uintCV(eventId), principalCV(attendeeAddress)],
        network: config.network,
        senderAddress: config.contractAddress,
      });

      return cvToJSON(result);
    } catch (error) {
      throw new Error(`Failed to get attendance: ${error.message}`);
    }
  }

  /**
   * Get events created by parsing blockchain transactions
   * This queries the Stacks API for contract call transactions
   */
  async getEventsByCreator(creatorAddress, limit = 50) {
    try {
      const url = `${config.apiUrl}/extended/v1/address/${creatorAddress}/transactions?limit=${limit}`;
      const response = await axios.get(url);

      const events = [];
      for (const tx of response.data.results) {
        if (
          tx.tx_type === 'contract_call' &&
          tx.contract_call?.contract_id === `${config.contractAddress}.${config.contractName}` &&
          tx.contract_call?.function_name === 'create-event' &&
          tx.tx_status === 'success'
        ) {
          // Extract event details from tx events
          const printEvent = tx.tx_result?.events?.find(e => e.event_type === 'print_event');
          if (printEvent) {
            events.push({
              txId: tx.tx_id,
              eventData: printEvent.print_event,
              blockHeight: tx.block_height,
              timestamp: tx.burn_block_time,
            });
          }
        }
      }

      return events;
    } catch (error) {
      throw new Error(`Failed to get events by creator: ${error.message}`);
    }
  }

  /**
   * Get all events (paginated)
   */
  async getAllEvents(offset = 0, limit = 50) {
    try {
      const url = `${config.apiUrl}/extended/v1/contract/${config.contractAddress}.${config.contractName}/transactions?limit=${limit}&offset=${offset}`;
      const response = await axios.get(url);

      const events = [];
      for (const tx of response.data.results) {
        if (
          tx.tx_type === 'contract_call' &&
          tx.contract_call?.function_name === 'create-event' &&
          tx.tx_status === 'success'
        ) {
          const printEvent = tx.tx_result?.events?.find(e => e.event_type === 'print_event');
          if (printEvent) {
            events.push({
              txId: tx.tx_id,
              eventData: printEvent.print_event,
              blockHeight: tx.block_height,
              timestamp: tx.burn_block_time,
            });
          }
        }
      }

      return {
        events,
        total: response.data.total,
        offset,
        limit,
      };
    } catch (error) {
      throw new Error(`Failed to get all events: ${error.message}`);
    }
  }

  /**
   * Get check-ins for a specific event
   */
  async getEventCheckIns(eventId, limit = 100) {
    try {
      const url = `${config.apiUrl}/extended/v1/contract/${config.contractAddress}.${config.contractName}/transactions?limit=${limit}`;
      const response = await axios.get(url);

      const checkIns = [];
      for (const tx of response.data.results) {
        if (
          tx.tx_type === 'contract_call' &&
          tx.contract_call?.function_name === 'check-in' &&
          tx.tx_status === 'success'
        ) {
          const printEvent = tx.tx_result?.events?.find(e => e.event_type === 'print_event');
          if (printEvent && printEvent.print_event?.['event-id'] === eventId) {
            checkIns.push({
              txId: tx.tx_id,
              attendee: tx.sender_address,
              checkInData: printEvent.print_event,
              blockHeight: tx.block_height,
              timestamp: tx.burn_block_time,
            });
          }
        }
      }

      return checkIns;
    } catch (error) {
      throw new Error(`Failed to get event check-ins: ${error.message}`);
    }
  }

  /**
   * Build a create-event transaction
   * Note: Returns unsigned transaction - frontend should sign and broadcast
   */
  buildCreateEventTx(eventName, senderAddress) {
    try {
      const txOptions = {
        contractAddress: config.contractAddress,
        contractName: config.contractName,
        functionName: 'create-event',
        functionArgs: [stringAsciiCV(eventName)],
        senderKey: '', // Will be signed on frontend
        network: config.network,
        anchorMode: AnchorMode.Any,
      };

      return {
        contractAddress: config.contractAddress,
        contractName: config.contractName,
        functionName: 'create-event',
        functionArgs: [stringAsciiCV(eventName)],
        network: config.network.version,
      };
    } catch (error) {
      throw new Error(`Failed to build create-event transaction: ${error.message}`);
    }
  }

  /**
   * Build a check-in transaction
   */
  buildCheckInTx(eventId, senderAddress) {
    try {
      return {
        contractAddress: config.contractAddress,
        contractName: config.contractName,
        functionName: 'check-in',
        functionArgs: [uintCV(eventId)],
        network: config.network.version,
      };
    } catch (error) {
      throw new Error(`Failed to build check-in transaction: ${error.message}`);
    }
  }

  /**
   * Build a close-event transaction
   */
  buildCloseEventTx(eventId, senderAddress) {
    try {
      return {
        contractAddress: config.contractAddress,
        contractName: config.contractName,
        functionName: 'close-event',
        functionArgs: [uintCV(eventId)],
        network: config.network.version,
      };
    } catch (error) {
      throw new Error(`Failed to build close-event transaction: ${error.message}`);
    }
  }
}

module.exports = new StacksService();
