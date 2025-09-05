import { useState } from 'react';
import { Wifi, WifiOff, Settings, ExternalLink } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const NetworkCard = ({ network, variant = 'connected' }) => {
  const [isPaid, setIsPaid] = useState(false);
  const { createSession } = usePaymentContext();
  const isConnected = variant === 'connected' && network.connected;

  const handleUpgrade = async () => {
    try {
      await createSession();
      setIsPaid(true);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className={`glass-effect rounded-lg p-6 transition-all duration-200 hover:shadow-glow ${
      isConnected ? 'border-accent/20' : 'border-white/10'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-2xl">
            {network.icon}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{network.name}</h3>
            <p className="text-sm text-text-secondary capitalize">{network.type}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-5 h-5 text-accent" />
          ) : (
            <WifiOff className="w-5 h-5 text-text-secondary" />
          )}
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>
      
      {isConnected && (
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Channels</span>
            <span className="text-text-primary">{network.channels}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Active Users</span>
            <span className="text-text-primary">{network.activeUsers?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Last Activity</span>
            <span className="text-accent">{network.lastActivity}</span>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        {isConnected ? (
          <>
            <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
              Manage
            </button>
            {!isPaid && (
              <button
                onClick={handleUpgrade}
                className="px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg hover:bg-accent/20 transition-colors text-sm font-medium"
              >
                Upgrade ($0.01)
              </button>
            )}
          </>
        ) : (
          <button className="flex-1 bg-surface text-text-primary py-2 px-4 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium border border-white/10">
            Connect Network
          </button>
        )}
      </div>
    </div>
  );
};

export default NetworkCard;