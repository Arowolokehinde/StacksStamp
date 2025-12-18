export interface WalletContextType {
  userAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  network: 'mainnet' | 'testnet';
  connect: () => Promise<void>;
  disconnect: () => void;
}

export interface UserData {
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
  };
}
