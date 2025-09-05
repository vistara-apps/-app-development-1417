export const mockNetworks = [
  {
    networkId: '1',
    name: 'Farcaster',
    type: 'social',
    apiUrl: 'https://api.farcaster.xyz',
    connected: true,
    channels: 15,
    activeUsers: 2340,
    lastActivity: '2 min ago',
    icon: '🟣'
  },
  {
    networkId: '2',
    name: 'Discord',
    type: 'chat',
    apiUrl: 'https://discord.com/api',
    connected: true,
    channels: 8,
    activeUsers: 156,
    lastActivity: '5 min ago',
    icon: '💜'
  },
  {
    networkId: '3',
    name: 'Slack',
    type: 'work',
    apiUrl: 'https://slack.com/api',
    connected: false,
    channels: 0,
    activeUsers: 0,
    lastActivity: 'Never',
    icon: '💬'
  },
  {
    networkId: '4',
    name: 'Telegram',
    type: 'messaging',
    apiUrl: 'https://api.telegram.org',
    connected: true,
    channels: 23,
    activeUsers: 890,
    lastActivity: '1 min ago',
    icon: '🔵'
  }
];

export const mockPinnedItems = [
  {
    itemId: '1',
    userId: 'user1',
    sourceNetwork: 'Farcaster',
    sourceMessageId: 'cast123',
    content: 'Important announcement about Base L2 integration coming next week!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'message',
    author: 'baseprotocol'
  },
  {
    itemId: '2',
    userId: 'user1',
    sourceNetwork: 'Discord',
    sourceMessageId: 'msg456',
    content: 'https://docs.base.org/miniapps - New MiniApp documentation is live',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: 'link',
    author: 'devrel_jane'
  },
  {
    itemId: '3',
    userId: 'user1',
    sourceNetwork: 'Telegram',
    sourceMessageId: 'tg789',
    content: 'Weekly community call scheduled for Friday 3PM UTC. Topics include network routing updates.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    type: 'message',
    author: 'community_lead'
  }
];

export const mockAnalyticsData = [
  { name: 'Farcaster', messages: 45, connections: 12, growth: 15 },
  { name: 'Discord', messages: 23, connections: 8, growth: 8 },
  { name: 'Telegram', messages: 67, connections: 23, growth: 25 },
  { name: 'Slack', messages: 0, connections: 0, growth: 0 }
];

export const mockConnectivityData = [
  { source: 'Farcaster', target: 'Discord', strength: 8 },
  { source: 'Farcaster', target: 'Telegram', strength: 12 },
  { source: 'Discord', target: 'Slack', strength: 3 },
  { source: 'Telegram', target: 'Discord', strength: 5 }
];