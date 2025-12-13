export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15';
export const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || 'StackStamp';
export const NETWORK = import.meta.env.VITE_NETWORK || 'mainnet';
export const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

export const STACKS_MAINNET = {
  url: 'https://api.mainnet.hiro.so',
  name: 'mainnet'
};

export const STACKS_TESTNET = {
  url: 'https://api.testnet.hiro.so',
  name: 'testnet'
};

export const getCurrentNetwork = () => {
  return NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
};
