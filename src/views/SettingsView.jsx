import { useState } from 'react';
import { Bell, Lock, Palette, Globe, Database, CreditCard } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const SettingsView = () => {
  const [notifications, setNotifications] = useState({
    newConnections: true,
    messageRouting: true,
    weeklyDigest: false,
    securityAlerts: true
  });

  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [isPaid, setIsPaid] = useState(false);
  const { createSession } = usePaymentContext();

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleUpgradeAccount = async () => {
    try {
      await createSession();
      setIsPaid(true);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const settingSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { key: 'newConnections', label: 'New network connections', description: 'Get notified when new networks are detected' },
        { key: 'messageRouting', label: 'Message routing alerts', description: 'Notifications when messages are routed' },
        { key: 'weeklyDigest', label: 'Weekly activity digest', description: 'Summary of your network activity' },
        { key: 'securityAlerts', label: 'Security alerts', description: 'Important security notifications' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-text-secondary mt-1">
          Manage your preferences and account settings
        </p>
      </div>

      {/* Account Status */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-accent" />
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Account Status</h2>
              <p className="text-text-secondary">
                {isPaid ? 'Premium Account' : 'Free Tier'}
              </p>
            </div>
          </div>
          {!isPaid && (
            <button
              onClick={handleUpgradeAccount}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Upgrade ($0.01/network)
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface/30 rounded-lg p-4">
            <h3 className="font-medium text-text-primary mb-1">Networks</h3>
            <p className="text-2xl font-bold text-accent">3</p>
            <p className="text-sm text-text-secondary">Connected</p>
          </div>
          <div className="bg-surface/30 rounded-lg p-4">
            <h3 className="font-medium text-text-primary mb-1">Messages</h3>
            <p className="text-2xl font-bold text-accent">135</p>
            <p className="text-sm text-text-secondary">This month</p>
          </div>
          <div className="bg-surface/30 rounded-lg p-4">
            <h3 className="font-medium text-text-primary mb-1">Storage</h3>
            <p className="text-2xl font-bold text-accent">2.1GB</p>
            <p className="text-sm text-text-secondary">Used</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {settingSections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.title} className="glass-effect rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-semibold text-text-primary">{section.title}</h2>
            </div>
            
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-text-primary mb-1">{item.label}</h3>
                    <p className="text-sm text-text-secondary">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => handleNotificationChange(item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Appearance */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-text-primary">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-primary mb-1">Theme</h3>
              <p className="text-sm text-text-secondary">Choose your preferred color scheme</p>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-purple-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-text-primary">Language & Region</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-primary mb-1">Language</h3>
              <p className="text-sm text-text-secondary">Select your preferred language</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-purple-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lock className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-text-primary">Privacy & Security</h2>
        </div>
        
        <div className="space-y-4">
          <button className="w-full text-left bg-surface/30 rounded-lg p-4 hover:bg-surface/50 transition-colors">
            <h3 className="font-medium text-text-primary mb-1">Change Password</h3>
            <p className="text-sm text-text-secondary">Update your account password</p>
          </button>
          
          <button className="w-full text-left bg-surface/30 rounded-lg p-4 hover:bg-surface/50 transition-colors">
            <h3 className="font-medium text-text-primary mb-1">Two-Factor Authentication</h3>
            <p className="text-sm text-text-secondary">Add an extra layer of security</p>
          </button>
          
          <button className="w-full text-left bg-surface/30 rounded-lg p-4 hover:bg-surface/50 transition-colors">
            <h3 className="font-medium text-text-primary mb-1">Export Data</h3>
            <p className="text-sm text-text-secondary">Download your data and settings</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;