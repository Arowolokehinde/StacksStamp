import { useWallet } from '../context/WalletContext';

export default function ConnectWallet() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="connect-wallet">
      {!isConnected ? (
        <button onClick={connectWallet} className="btn btn-primary">
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-connected">
          <span className="address">{shortenAddress(address)}</span>
          <button onClick={disconnectWallet} className="btn btn-secondary">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
