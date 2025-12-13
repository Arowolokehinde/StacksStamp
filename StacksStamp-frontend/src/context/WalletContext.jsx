import { createContext, useContext } from 'react';
import { Connect } from '@stacks/connect-react';
import { useConnect, useAuth } from '@stacks/connect-react';
import { NETWORK } from '../config/stacks';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  return (
    <Connect
      authOptions={{
        appDetails: {
          name: 'StackStamp',
          icon: window.location.origin + '/vite.svg',
        },
      }}
    >
      <WalletContextProvider>{children}</WalletContextProvider>
    </Connect>
  );
};

const WalletContextProvider = ({ children }) => {
  const { doOpenAuth } = useConnect();
  const { isSignedIn, signOut, userSession } = useAuth();

  const address = isSignedIn && userSession
    ? userSession.loadUserData()?.profile?.stxAddress?.[NETWORK]
    : null;

  const connectWallet = () => {
    doOpenAuth();
  };

  const disconnectWallet = () => {
    signOut();
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected: isSignedIn,
        userData: isSignedIn && userSession ? userSession.loadUserData() : null,
        address,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
