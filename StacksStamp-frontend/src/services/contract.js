import { openContractCall } from '@stacks/connect';
import {
  stringAsciiCV,
  uintCV,
  AnchorMode,
} from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME, NETWORK } from '../config/stacks';

export const contractService = {
  async createEvent(eventName, userSession) {
    const functionArgs = [stringAsciiCV(eventName)];

    const options = {
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-event',
      functionArgs,
      appDetails: {
        name: 'StackStamp',
        icon: window.location.origin + '/logo.svg',
      },
      onFinish: (data) => {
        console.log('Transaction:', data);
        return data;
      },
    };

    return await openContractCall(options);
  },

  async checkIn(eventId, userSession) {
    const functionArgs = [uintCV(eventId)];

    const options = {
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'check-in',
      functionArgs,
      appDetails: {
        name: 'StackStamp',
        icon: window.location.origin + '/logo.svg',
      },
      onFinish: (data) => {
        console.log('Transaction:', data);
        return data;
      },
    };

    return await openContractCall(options);
  },

  async closeEvent(eventId, userSession) {
    const functionArgs = [uintCV(eventId)];

    const options = {
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'close-event',
      functionArgs,
      appDetails: {
        name: 'StackStamp',
        icon: window.location.origin + '/logo.svg',
      },
      onFinish: (data) => {
        console.log('Transaction:', data);
        return data;
      },
    };

    return await openContractCall(options);
  },
};
