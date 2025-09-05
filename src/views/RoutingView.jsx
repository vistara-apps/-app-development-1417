import { useState } from 'react';
import { MessageCircle, ArrowRight, Settings, Plus } from 'lucide-react';
import { mockNetworks } from '../data/mockData';

const RoutingView = () => {
  const [routingRules, setRoutingRules] = useState([
    {
      id: '1',
      name: 'High Priority to Discord',
      source: 'Farcaster',
      target: 'Discord',
      condition: 'mentions @me',
      active: true
    },
    {
      id: '2',
      name: 'Work Messages to Slack',
      source: 'Telegram',
      target: 'Slack',
      condition: 'contains "work" or "project"',
      active: false
    }
  ]);

  const connectedNetworks = mockNetworks.filter(n => n.connected);

  const toggleRule = (ruleId) => {
    setRoutingRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Message Routing
          </h1>
          <p className="text-text-secondary mt-1">
            Configure intelligent message routing between networks
          </p>
        </div>
        
        <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Routing Rules */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">Active Routing Rules</h2>
        
        {routingRules.map((rule) => (
          <div key={rule.id} className="glass-effect rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">{rule.name}</h3>
              <div className="flex items-center space-x-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.active}
                    onChange={() => toggleRule(rule.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Settings className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  {mockNetworks.find(n => n.name === rule.source)?.icon || '📱'}
                </div>
                <span className="text-text-primary font-medium">{rule.source}</span>
              </div>
              
              <ArrowRight className={`w-5 h-5 ${rule.active ? 'text-accent' : 'text-text-secondary'}`} />
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  {mockNetworks.find(n => n.name === rule.target)?.icon || '📱'}
                </div>
                <span className="text-text-primary font-medium">{rule.target}</span>
              </div>
            </div>
            
            <div className="bg-surface/30 rounded-lg p-3">
              <span className="text-sm text-text-secondary">Condition: </span>
              <span className="text-sm text-text-primary font-mono">{rule.condition}</span>
            </div>
          </div>
        ))}
        
        {routingRules.length === 0 && (
          <div className="text-center py-12 glass-effect rounded-lg">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No routing rules configured</h3>
            <p className="text-text-secondary mb-4">Create your first routing rule to start intelligently managing messages</p>
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Create First Rule
            </button>
          </div>
        )}
      </div>

      {/* Quick Setup */}
      <div className="glass-effect rounded-lg p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectedNetworks.map((network, index) => (
            <div key={network.networkId} className="bg-surface/30 rounded-lg p-4 hover:bg-surface/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                  {network.icon}
                </div>
                <span className="font-medium text-text-primary">{network.name}</span>
              </div>
              <p className="text-sm text-text-secondary">
                Route {network.channels} channels to your preferred network
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutingView;