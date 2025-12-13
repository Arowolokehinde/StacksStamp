import { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import ConnectWallet from './components/ConnectWallet';
import CreateEvent from './components/CreateEvent';
import CheckIn from './components/CheckIn';
import EventList from './components/EventList';
import MyEvents from './components/MyEvents';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('events');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <WalletProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>StackStamp</h1>
            <p className="tagline">On-Chain Attendance Verification</p>
          </div>
          <ConnectWallet />
        </header>

        <nav className="tabs">
          <button
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            All Events
          </button>
          <button
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Event
          </button>
          <button
            className={`tab ${activeTab === 'checkin' ? 'active' : ''}`}
            onClick={() => setActiveTab('checkin')}
          >
            Check In
          </button>
          <button
            className={`tab ${activeTab === 'myevents' ? 'active' : ''}`}
            onClick={() => setActiveTab('myevents')}
          >
            My Events
          </button>
        </nav>

        <main className="app-main">
          {activeTab === 'events' && <EventList refresh={refreshKey} />}
          {activeTab === 'create' && <CreateEvent onEventCreated={handleRefresh} />}
          {activeTab === 'checkin' && <CheckIn onCheckInComplete={handleRefresh} />}
          {activeTab === 'myevents' && <MyEvents refresh={refreshKey} />}
        </main>

        <footer className="app-footer">
          <p>Built on Stacks • Mainnet</p>
          <p className="contract-info">
            Contract: {import.meta.env.VITE_CONTRACT_ADDRESS}
          </p>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
