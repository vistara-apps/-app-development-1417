import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MessageCircle, Network } from 'lucide-react';
import { mockAnalyticsData, mockConnectivityData } from '../data/mockData';

const AnalyticsView = () => {
  const pieData = mockAnalyticsData.map(item => ({
    name: item.name,
    value: item.messages,
    color: item.name === 'Farcaster' ? '#a855f7' : 
           item.name === 'Discord' ? '#3b82f6' : 
           item.name === 'Telegram' ? '#06b6d4' : '#6b7280'
  }));

  const weeklyData = [
    { day: 'Mon', messages: 45, connections: 12 },
    { day: 'Tue', messages: 52, connections: 15 },
    { day: 'Wed', messages: 38, connections: 10 },
    { day: 'Thu', messages: 67, connections: 18 },
    { day: 'Fri', messages: 73, connections: 22 },
    { day: 'Sat', messages: 41, connections: 14 },
    { day: 'Sun', messages: 35, connections: 9 }
  ];

  const totalMessages = mockAnalyticsData.reduce((sum, item) => sum + item.messages, 0);
  const totalConnections = mockAnalyticsData.reduce((sum, item) => sum + item.connections, 0);
  const avgGrowth = mockAnalyticsData.reduce((sum, item) => sum + item.growth, 0) / mockAnalyticsData.length;

  const statsCards = [
    {
      title: 'Total Messages',
      value: totalMessages,
      icon: MessageCircle,
      change: '+15% this week',
      color: 'text-purple-400'
    },
    {
      title: 'Network Connections',
      value: totalConnections,
      icon: Network,
      change: '+8% this week',
      color: 'text-blue-400'
    },
    {
      title: 'Average Growth',
      value: `${avgGrowth.toFixed(1)}%`,
      icon: TrendingUp,
      change: '+3.2% this week',
      color: 'text-green-400'
    },
    {
      title: 'Active Networks',
      value: mockAnalyticsData.filter(item => item.messages > 0).length,
      icon: Users,
      change: 'All connected',
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Analytics
        </h1>
        <p className="text-text-secondary mt-1">
          Insights into your network activity and connectivity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-effect rounded-lg p-6 hover:shadow-glow transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-1">{stat.value}</h3>
              <p className="text-sm text-text-secondary mb-2">{stat.title}</p>
              <p className="text-xs text-accent">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages by Network */}
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Messages by Network</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(230 20% 16%)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'hsl(230 10% 95%)'
                  }} 
                />
                <Bar dataKey="messages" fill="url(#barGradient)" />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Message Distribution */}
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Message Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(230 20% 16%)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'hsl(230 10% 95%)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="glass-effect rounded-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Weekly Activity Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(230 20% 16%)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'hsl(230 10% 95%)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                  name="Messages"
                />
                <Line 
                  type="monotone" 
                  dataKey="connections" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Connections"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Network Performance */}
      <div className="glass-effect rounded-lg p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Network Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Network</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Messages</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Connections</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Growth</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAnalyticsData.map((network, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                        {network.name === 'Farcaster' ? '🟣' :
                         network.name === 'Discord' ? '💜' :
                         network.name === 'Telegram' ? '🔵' : '💬'}
                      </div>
                      <span className="text-text-primary font-medium">{network.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-primary">{network.messages}</td>
                  <td className="py-3 px-4 text-text-primary">{network.connections}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${
                      network.growth > 0 ? 'text-green-400' : 
                      network.growth < 0 ? 'text-red-400' : 'text-text-secondary'
                    }`}>
                      {network.growth > 0 ? '+' : ''}{network.growth}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      network.messages > 0 
                        ? 'bg-green-400/10 text-green-400' 
                        : 'bg-red-400/10 text-red-400'
                    }`}>
                      {network.messages > 0 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;