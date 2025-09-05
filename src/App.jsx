import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import NetworksView from './views/NetworksView';
import RoutingView from './views/RoutingView';
import PinnedView from './views/PinnedView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'networks':
        return <NetworksView />;
      case 'routing':
        return <RoutingView />;
      case 'pinned':
        return <PinnedView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-purple-900/10 text-text-primary">
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-6 max-w-screen-2xl mx-auto w-full">
            {renderView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;