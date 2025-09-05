import { useState } from 'react';
import { Pin, ExternalLink, X, Calendar, User } from 'lucide-react';

const PinnedItem = ({ item, variant = 'message', onUnpin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isLink = variant === 'link' || item.type === 'link';
  const content = item.content;
  const isLongContent = content.length > 150;
  
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="glass-effect rounded-lg p-4 hover:shadow-glow transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            item.sourceNetwork === 'Farcaster' ? 'bg-purple-500/20 text-purple-400' :
            item.sourceNetwork === 'Discord' ? 'bg-blue-500/20 text-blue-400' :
            item.sourceNetwork === 'Telegram' ? 'bg-cyan-500/20 text-cyan-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {item.sourceNetwork === 'Farcaster' ? '🟣' :
             item.sourceNetwork === 'Discord' ? '💜' :
             item.sourceNetwork === 'Telegram' ? '🔵' : '💬'}
          </div>
          <span className="text-sm font-medium text-text-secondary">
            {item.sourceNetwork}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-text-secondary">
            {formatTimeAgo(item.timestamp)}
          </span>
          <button
            onClick={() => onUnpin?.(item.itemId)}
            className="p-1 hover:bg-white/5 rounded text-text-secondary hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        {isLink ? (
          <div className="space-y-2">
            <a
              href={content.includes('http') ? content : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors flex items-center space-x-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="break-all">{content}</span>
            </a>
          </div>
        ) : (
          <div>
            <p className="text-text-primary text-sm leading-relaxed">
              {isLongContent && !isExpanded ? (
                <>
                  {content.substring(0, 150)}...
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-accent hover:text-accent/80 ml-1"
                  >
                    Read more
                  </button>
                </>
              ) : (
                content
              )}
            </p>
            {isExpanded && isLongContent && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-accent hover:text-accent/80 text-sm mt-1"
              >
                Show less
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{item.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
        <Pin className="w-3 h-3 text-accent" />
      </div>
    </div>
  );
};

export default PinnedItem;