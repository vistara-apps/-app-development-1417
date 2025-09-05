import { Wifi, WifiOff, Clock } from 'lucide-react';

const ConnectionStatusIndicator = ({ status = 'online' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: Wifi,
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          label: 'Connected'
        };
      case 'offline':
        return {
          icon: WifiOff,
          color: 'text-red-400',
          bgColor: 'bg-red-400/10',
          label: 'Disconnected'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/10',
          label: 'Connecting'
        };
      default:
        return {
          icon: WifiOff,
          color: 'text-text-secondary',
          bgColor: 'bg-white/5',
          label: 'Unknown'
        };
    }
  };

  const { icon: Icon, color, bgColor, label } = getStatusConfig();

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${bgColor}`}>
      <Icon className={`w-4 h-4 ${color}`} />
      <span className={`text-sm font-medium ${color}`}>{label}</span>
    </div>
  );
};

export default ConnectionStatusIndicator;