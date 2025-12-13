import * as stacksConnect from '@stacks/connect';
import {
  stringAsciiCV,
  uintCV,
  AnchorMode,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/stacks';

const { openContractCall } = stacksConnect;
const network = new StacksMainnet();

export const contractService = {
  async createEvent(eventName) {
    const functionArgs = [stringAsciiCV(eventName)];

    const options = {
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-event',
      functionArgs,
      appDetails: {
        name: 'StackStamp',
        icon: window.location.origin + '/vite.svg',
      },
      onFinish: (data) => {
        console.log('Create event transaction:', data);
        alert('Transaction submitted! Check your wallet for confirmation.');
        return data;
      },
      onCancel: () => {
        console.log('Transaction cancelled');
      },
    };

    return await openContractCall(options);
  },

  async checkIn(eventId) {
    const functionArgs = [uintCV(eventId)];

    const options = {
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'check-in',
      functionArgs,
      appDetails: {
        name: 'StackStamp',
        icon: window.location.origin + '/vite.svg',
      },
      onFinish: (data) => {
        console.log('Check-in transaction:', data);
        alert('Transaction submitted! Check your wallet for confirmation.');
        return data;
      },
      onCancel: () => {
        console.log('Transaction cancelled');
      },
    };

    return await openContractCall(options);
  },

  async closeEvent(eventId) {
    const functionArgs = [uintCV(eventId)];

    const options = {
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'close-event',
      functionArgs,
      appDetails: {
        name: 'StackStamp',
        icon: window.location.origin + '/vite.svg',
      },
      onFinish: (data) => {
        console.log('Close event transaction:', data);
        alert('Transaction submitted! Check your wallet for confirmation.');
        return data;
      },
      onCancel: () => {
        console.log('Transaction cancelled');
      },
    };

    return await openContractCall(options);
  },
};
