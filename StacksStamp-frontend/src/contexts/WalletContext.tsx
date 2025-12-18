import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  connect as connectWallet,
  disconnect as disconnectWallet,
  isConnected as checkConnection,
  getLocalStorage
} from '@stacks/connect';

// Define all types inline to avoid module resolution issues
interface WalletContextType {
  userAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  network: 'mainnet' | 'testnet';
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const network: 'mainnet' | 'testnet' = 'mainnet';

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      if (checkConnection()) {
        const data = getLocalStorage();
        // Get the first Stacks address from the stx array
        const stxAddress = data?.addresses?.stx?.[0]?.address;

        if (stxAddress) {
          setUserAddress(stxAddress);
          setIsConnected(true);
        }
      }
    };

    checkAuth();
  }, []);

  const connect = async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if wallet extension is installed
      if (typeof window !== 'undefined' && !window.StacksProvider) {
        throw new Error('Wallet extension not found. Please install Leather or Hiro wallet.');
      }

      const response = await connectWallet();
      // addresses is a flat array - find the Stacks address (starts with SP or ST)
      const stxAddress = response?.addresses?.find((addr: any) =>
        addr.address?.startsWith('SP') || addr.address?.startsWith('ST')
      )?.address;

      if (stxAddress) {
        setUserAddress(stxAddress);
        setIsConnected(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    disconnectWallet();
    setUserAddress(null);
    setIsConnected(false);
    setError(null);
  };

  const value: WalletContextType = {
    userAddress,
    isConnected,
    isConnecting,
    error,
    network,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
