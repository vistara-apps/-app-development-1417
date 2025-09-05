import { useState } from 'react';
import { Search, Filter, Bookmark } from 'lucide-react';
import { mockPinnedItems } from '../data/mockData';
import PinnedItem from '../components/PinnedItem';

const PinnedView = () => {
  const [pinnedItems, setPinnedItems] = useState(mockPinnedItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredItems = pinnedItems.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sourceNetwork.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         item.type === filterType ||
                         item.sourceNetwork.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleUnpin = (itemId) => {
    setPinnedItems(prev => prev.filter(item => item.itemId !== itemId));
  };

  const filterOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'message', label: 'Messages' },
    { value: 'link', label: 'Links' },
    { value: 'farcaster', label: 'Farcaster' },
    { value: 'discord', label: 'Discord' },
    { value: 'telegram', label: 'Telegram' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Pinned Items
          </h1>
          <p className="text-text-secondary mt-1">
            Your saved messages and links from across networks
          </p>
        </div>
        
        <div className="text-text-secondary text-sm">
          {filteredItems.length} of {pinnedItems.length} items
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search pinned items..."
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

      {/* Pinned Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <PinnedItem 
            key={item.itemId} 
            item={item} 
            onUnpin={handleUnpin}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {pinnedItems.length === 0 ? 'No pinned items yet' : 'No items found'}
          </h3>
          <p className="text-text-secondary">
            {pinnedItems.length === 0 
              ? 'Start pinning important messages and links from your networks'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default PinnedView;
