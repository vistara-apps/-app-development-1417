import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Network, MessageCircle, BookmarkCheck, TrendingUp, Users, Activity } from 'lucide-react';
import { mockNetworks, mockAnalyticsData } from '../data/mockData';
import NetworkCard from '../components/NetworkCard';
import ConnectionStatusIndicator from '../components/ConnectionStatusIndicator';

const Dashboard = () => {
  const connectedNetworks = mockNetworks.filter(n => n.connected);
  const totalChannels = connectedNetworks.reduce((sum, n) => sum + n.channels, 0);
  const totalUsers = connectedNetworks.reduce((sum, n) => sum + n.activeUsers, 0);

  const statsCards = [
    {
      title: 'Connected Networks',
      value: connectedNetworks.length,
      icon: Network,
      change: '+2 this week',
      color: 'text-purple-400'
    },
    {
      title: 'Total Channels',
      value: totalChannels,
      icon: MessageCircle,
      change: '+5 this week',
      color: 'text-blue-400'
    },
    {
      title: 'Active Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
      change: '+12% this week',
      color: 'text-green-400'
    },
    {
      title: 'Pinned Items',
      value: 12,
      icon: BookmarkCheck,
      change: '+3 today',
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-text-secondary mt-1">
            Unify your communication, amplify your reach
          </p>
        </div>
        <ConnectionStatusIndicator status="online" />
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Activity */}
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Network Activity</h2>
          <div className="h-64">
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
                <Bar dataKey="messages" fill="url(#purpleGradient)" />
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Trends */}
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Growth Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAnalyticsData}>
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
                <Line 
                  type="monotone" 
                  dataKey="growth" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Networks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">Active Networks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedNetworks.map((network) => (
            <NetworkCard key={network.networkId} network={network} variant="connected" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;