import { createContext, useContext, useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { NETWORK } from '../config/stacks';

const WalletContext = createContext();

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export const WalletProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      setUserData(data);
      setIsConnected(true);
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((data) => {
        setUserData(data);
        setIsConnected(true);
      });
    }
  }, []);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'StackStamp',
        icon: window.location.origin + '/logo.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        const data = userSession.loadUserData();
        setUserData(data);
        setIsConnected(true);
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(null);
    setIsConnected(false);
  };

  const getAddress = () => {
    if (!userData) return null;
    return NETWORK === 'mainnet'
      ? userData.profile.stxAddress.mainnet
      : userData.profile.stxAddress.testnet;
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        userData,
        address: getAddress(),
        connectWallet,
        disconnectWallet,
        userSession,
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
