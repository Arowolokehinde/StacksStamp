require('dotenv').config();
const { StacksMainnet, StacksTestnet } = require('@stacks/network');

const isMainnet = process.env.NETWORK === 'mainnet';

const network = isMainnet ? new StacksMainnet() : new StacksTestnet();

const config = {
  network,
  contractAddress: process.env.CONTRACT_ADDRESS || 'SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15',
  contractName: process.env.CONTRACT_NAME || 'StackStamp',
  apiUrl: process.env.STACKS_API_URL || 'https://api.hiro.so',
};

module.exports = config;
