import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

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

interface UserData {
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
  };
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

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
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData() as UserData;
        const address = userData.profile.stxAddress[network];

        setUserAddress(address);
        setIsConnected(true);

        // Persist to localStorage
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('walletConnected', 'true');
      } else {
        // Check localStorage for persisted connection
        const savedAddress = localStorage.getItem('walletAddress');
        const wasConnected = localStorage.getItem('walletConnected') === 'true';

        if (savedAddress && wasConnected) {
          setUserAddress(savedAddress);
          setIsConnected(true);
        }
      }
    };

    checkAuth();
  }, [network]);

  const connect = async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if wallet extension is installed
      if (typeof window !== 'undefined' && !window.StacksProvider) {
        throw new Error('Wallet extension not found. Please install Leather or Hiro wallet.');
      }

      await showConnect({
        appDetails: {
          name: 'StackStamp',
          icon: window.location.origin + '/vite.svg',
        },
        redirectTo: '/',
        onFinish: () => {
          setIsConnecting(false);

          const userData = userSession.loadUserData() as UserData;
          const address = userData.profile.stxAddress[network];

          setUserAddress(address);
          setIsConnected(true);

          // Persist to localStorage
          localStorage.setItem('walletAddress', address);
          localStorage.setItem('walletConnected', 'true');
        },
        onCancel: () => {
          setIsConnecting(false);
          setError('Connection cancelled by user');
        },
        userSession,
      });
    } catch (err) {
      setIsConnecting(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    }
  };

  const disconnect = () => {
    userSession.signUserOut();
    setUserAddress(null);
    setIsConnected(false);
    setError(null);

    // Clear localStorage
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletConnected');
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
