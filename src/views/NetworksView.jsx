import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { mockNetworks } from '../data/mockData';
import NetworkCard from '../components/NetworkCard';

const NetworksView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredNetworks = mockNetworks.filter(network => {
    const matchesSearch = network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         network.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'connected' && network.connected) ||
                         (filterType === 'disconnected' && !network.connected) ||
                         network.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Networks' },
    { value: 'connected', label: 'Connected' },
    { value: 'disconnected', label: 'Disconnected' },
    { value: 'social', label: 'Social' },
    { value: 'chat', label: 'Chat' },
    { value: 'work', label: 'Work' },
    { value: 'messaging', label: 'Messaging' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Networks
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your communication networks
          </p>
        </div>
        
        <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          <span>Add Network</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search networks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-purple-500 focus:shadow-focus-ring"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-surface/50 border border-white/10 rounded-lg pl-10 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:shadow-focus-ring appearance-none"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-surface">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Networks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNetworks.map((network) => (
          <NetworkCard 
            key={network.networkId} 
            network={network} 
            variant={network.connected ? 'connected' : 'unconnected'} 
          />
        ))}
      </div>

      {filteredNetworks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No networks found</h3>
          <p className="text-text-secondary">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default NetworksView;