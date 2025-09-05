# Nexus Weaver - Production Deployment Guide

This guide covers the complete deployment process for Nexus Weaver from development to production.

## 🚀 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Supabase project created and configured
- [ ] Database schema deployed (`database/schema.sql`)
- [ ] Row Level Security (RLS) policies enabled
- [ ] Neynar API key obtained
- [ ] WalletConnect project configured
- [ ] All environment variables documented

### 2. Code Quality
- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] No console errors in production build
- [ ] Performance optimizations applied
- [ ] Security headers configured

### 3. API Integrations
- [ ] Farcaster API integration tested
- [ ] Supabase connection verified
- [ ] Payment system tested (testnet)
- [ ] Error handling implemented

## 🏗️ Infrastructure Setup

### Supabase Configuration

1. **Create Production Database**
   ```sql
   -- Run the complete schema from database/schema.sql
   -- Ensure all tables, indexes, and policies are created
   ```

2. **Configure Environment Variables**
   ```bash
   # Production Supabase
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   
   # API Keys
   VITE_NEYNAR_API_KEY=your-production-neynar-key
   VITE_WALLETCONNECT_PROJECT_ID=your-walletconnect-id
   
   # Base Network (Mainnet)
   VITE_BASE_CHAIN_ID=8453
   VITE_BASE_RPC_URL=https://mainnet.base.org
   ```

3. **Security Configuration**
   - Enable RLS on all tables
   - Configure JWT settings
   - Set up API rate limiting
   - Enable audit logging

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login and link project
   vercel login
   vercel link
   ```

2. **Configure Environment Variables**
   ```bash
   # Set production environment variables
   vercel env add VITE_SUPABASE_URL production
   vercel env add VITE_SUPABASE_ANON_KEY production
   vercel env add VITE_NEYNAR_API_KEY production
   vercel env add VITE_WALLETCONNECT_PROJECT_ID production
   ```

3. **Deploy to Production**
   ```bash
   # Deploy to production
   vercel --prod
   ```

## 🔐 Security Configuration

### 1. Content Security Policy
```javascript
// Already configured in vercel.json
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss:; frame-src 'self' https:;"
```

### 2. Environment Variables Security
- Never commit `.env` files
- Use Vercel's environment variable system
- Rotate API keys regularly
- Monitor for exposed secrets

### 3. Database Security
- Enable RLS on all tables
- Use service role key only for admin operations
- Implement proper JWT validation
- Regular security audits

## 📊 Monitoring & Analytics

### 1. Application Monitoring
```javascript
// Add to production build
import { analytics } from './lib/analytics';

// Track key events
analytics.track('user_connected_wallet', { address });
analytics.track('network_connected', { network, userId });
analytics.track('message_routed', { ruleId, targetNetwork });
```

### 2. Error Tracking
```javascript
// Add error boundary and reporting
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_ENVIRONMENT,
});
```

### 3. Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Database query performance
- User engagement metrics

## 🧪 Testing Strategy

### 1. Pre-Production Testing
```bash
# Run full test suite
npm run test

# Build and test production bundle
npm run build
npm run preview

# Test with production APIs (staging)
VITE_ENVIRONMENT=staging npm run dev
```

### 2. Integration Testing
- Wallet connection flow
- Farcaster API integration
- Database operations
- Payment processing (testnet)
- Message routing logic

### 3. User Acceptance Testing
- Complete user journey testing
- Cross-browser compatibility
- Mobile responsiveness
- Performance on various devices

## 🚀 Deployment Process

### 1. Staging Deployment
```bash
# Deploy to staging
vercel --target staging

# Run integration tests
npm run test:integration

# Performance testing
npm run test:performance
```

### 2. Production Deployment
```bash
# Final checks
npm run lint
npm run build
npm run test

# Deploy to production
vercel --prod

# Verify deployment
curl -I https://nexus-weaver.vercel.app
```

### 3. Post-Deployment Verification
- [ ] Application loads correctly
- [ ] Wallet connection works
- [ ] Database queries execute
- [ ] API integrations functional
- [ ] Payment system operational
- [ ] Analytics tracking active

## 📈 Scaling Considerations

### 1. Database Optimization
- Index optimization for query performance
- Connection pooling configuration
- Read replicas for analytics queries
- Automated backups and recovery

### 2. API Rate Limiting
```javascript
// Implement rate limiting for external APIs
const rateLimiter = {
  neynar: new RateLimit(100, '1m'), // 100 requests per minute
  supabase: new RateLimit(1000, '1m'), // 1000 requests per minute
};
```

### 3. Caching Strategy
- Static asset caching (CDN)
- API response caching
- Database query result caching
- User session caching

## 🔄 Maintenance & Updates

### 1. Regular Updates
- Dependency updates (monthly)
- Security patches (immediate)
- Feature releases (bi-weekly)
- Database maintenance (weekly)

### 2. Monitoring Alerts
```javascript
// Set up alerts for:
// - API failures
// - Database connection issues
// - High error rates
// - Performance degradation
```

### 3. Backup Strategy
- Daily database backups
- Code repository backups
- Environment configuration backups
- Disaster recovery procedures

## 🐛 Troubleshooting

### Common Production Issues

1. **Wallet Connection Failures**
   - Check WalletConnect configuration
   - Verify network settings
   - Test with different wallets

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check RLS policies
   - Monitor connection limits

3. **API Integration Problems**
   - Validate API keys
   - Check rate limits
   - Monitor error responses

4. **Performance Issues**
   - Analyze bundle size
   - Check database query performance
   - Monitor API response times

### Emergency Procedures
1. Rollback deployment if critical issues
2. Enable maintenance mode if needed
3. Contact support channels
4. Document incidents for post-mortem

## 📞 Support & Contacts

### Development Team
- **Lead Developer**: [Contact Info]
- **DevOps Engineer**: [Contact Info]
- **Product Manager**: [Contact Info]

### External Services
- **Supabase Support**: support@supabase.io
- **Neynar Support**: support@neynar.com
- **Vercel Support**: support@vercel.com

### Emergency Contacts
- **On-call Engineer**: [Phone/Slack]
- **Technical Lead**: [Phone/Slack]
- **Product Owner**: [Phone/Slack]

---

## 🎯 Success Metrics

### Key Performance Indicators
- Application uptime > 99.9%
- Page load time < 2 seconds
- API response time < 500ms
- Error rate < 0.1%
- User satisfaction > 4.5/5

### Business Metrics
- Daily active users
- Network connections per user
- Message routing success rate
- Payment conversion rate
- User retention rate

---

**Remember**: Always test thoroughly in staging before deploying to production!
