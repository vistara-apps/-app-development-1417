# Nexus Weaver

**Unify your communication, amplify your reach.**

A Base-native MiniApp that helps users map and centralize information across fragmented communication networks.

## 🌟 Features

### Core Features (MVP)
- **Unified Network Directory**: Automatically discover and list all active communication networks
- **Cross-Network Connectivity Insights**: Visualize how users and data flow between networks
- **Intelligent Message Routing**: Configure rules to route messages to preferred networks
- **Centralized Info Snippets**: Pin important messages and links from integrated networks

### Supported Networks
- 🟣 **Farcaster**: Decentralized social network integration
- 💜 **Discord**: Gaming and community chat platform
- 💬 **Slack**: Workplace communication platform  
- 🔵 **Telegram**: Cloud-based instant messaging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- A Base-compatible wallet (MetaMask, Coinbase Wallet, etc.)
- Supabase account (for database)
- Neynar API key (for Farcaster integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/-app-development-1417.git
   cd -app-development-1417
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Farcaster API (Neynar)
   VITE_NEYNAR_API_KEY=your_neynar_api_key
   
   # WalletConnect Project ID
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
   - Enable Row Level Security (RLS) policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS
- **Web3**: Wagmi, RainbowKit, Viem
- **Backend**: Supabase (PostgreSQL)
- **APIs**: Neynar (Farcaster), OpenAI (optional)
- **Payments**: Base network, USDC

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── data/              # Mock data and constants
├── hooks/             # Custom React hooks
├── lib/               # Core libraries and utilities
│   ├── supabase.js    # Database client and helpers
│   ├── farcaster.js   # Farcaster API integration
│   ├── payments.js    # Payment and subscription logic
│   └── messageRouting.js # Message routing engine
├── views/             # Main application views
└── main.jsx           # Application entry point
```

## 💰 Business Model

### Pricing Structure
- **Free Tier**: Up to 2 networks, basic discovery and mapping
- **Premium**: $0.01 per additional network per month
  - Intelligent message routing
  - Centralized information hub
  - Advanced analytics
  - Unlimited networks

### Payment Methods
- USDC on Base network
- Micro-transactions for scalable pricing
- Monthly billing cycle

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the database schema from `database/schema.sql`
3. Configure Row Level Security policies
4. Add your project URL and anon key to `.env`

### Farcaster Integration
1. Sign up for a Neynar API key at [neynar.com](https://neynar.com)
2. Add your API key to `.env`
3. Configure webhook endpoints for real-time updates (optional)

### WalletConnect Setup
1. Create a project at [walletconnect.com](https://walletconnect.com)
2. Add your project ID to `.env`
3. Configure allowed domains and networks

## 🔐 Security

### Data Protection
- Row Level Security (RLS) enabled on all tables
- Wallet-based authentication
- Encrypted credential storage
- HTTPS-only communication

### Privacy Features
- Local data processing where possible
- Minimal data collection
- User-controlled data retention
- Transparent privacy policies

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables
Ensure all production environment variables are set:
- Database URLs and keys
- API keys for external services
- WalletConnect project ID
- Base network configuration

## 🧪 Development

### Running Tests
```bash
npm run test
```

### Code Quality
```bash
npm run lint
npm run format
```

### Database Migrations
```bash
# Add new migration
supabase migration new migration_name

# Apply migrations
supabase db push
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- Network connection tracking
- Message routing statistics
- User engagement metrics
- Payment and subscription analytics

### External Integrations
- Supabase Analytics
- Custom event tracking
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for new components
- Write tests for critical functionality
- Update documentation for new features

## 📝 API Documentation

### Farcaster Integration
- User profile fetching
- Cast retrieval and filtering
- Channel discovery
- Real-time updates

### Database Schema
- Users and authentication
- Network connections
- Pinned items management
- Routing rules configuration
- Analytics and payments

## 🔍 Troubleshooting

### Common Issues

**Wallet Connection Issues**
- Ensure WalletConnect project ID is correct
- Check network configuration (Base mainnet)
- Verify wallet has sufficient funds for transactions

**Database Connection**
- Verify Supabase URL and keys
- Check RLS policies are properly configured
- Ensure database schema is up to date

**API Integration**
- Validate Neynar API key
- Check rate limits and quotas
- Verify network connectivity

### Support
- Create an issue on GitHub
- Check existing documentation
- Join our community Discord

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Base team for the MiniApp framework
- Neynar for Farcaster API access
- Supabase for backend infrastructure
- The open-source community

---

**Built with ❤️ for the Base ecosystem**
