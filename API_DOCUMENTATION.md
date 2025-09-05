# Nexus Weaver - API Documentation

Complete API documentation for Nexus Weaver's backend integrations and services.

## 🏗️ Architecture Overview

Nexus Weaver integrates with multiple APIs and services:
- **Supabase**: Database and authentication
- **Neynar**: Farcaster protocol integration
- **Base Network**: Blockchain and payments
- **OpenAI**: AI-powered features (optional)

## 🔐 Authentication

### Wallet-Based Authentication
```javascript
// User authentication via wallet signature
const { signMessageAsync } = useSignMessage();

const authenticateUser = async (walletAddress) => {
  const message = `Sign in to Nexus Weaver: ${Date.now()}`;
  const signature = await signMessageAsync({ message });
  
  // Verify signature and create/update user
  return await authService.verifyAndCreateUser(walletAddress, signature);
};
```

### Supabase RLS Policies
All database operations are secured with Row Level Security:
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');
```

## 📊 Database API (Supabase)

### User Management

#### Create User
```javascript
const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      user_id: uuidv4(),
      wallet_address: userData.walletAddress,
      farcaster_id: userData.farcasterId,
      preferences: userData.preferences || defaultPreferences
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
```

#### Get User by Wallet
```javascript
const getUserByWallet = async (walletAddress) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};
```

### Network Connections

#### Get User Networks
```javascript
const getUserNetworks = async (userId) => {
  const { data, error } = await supabase
    .from('network_connections')
    .select(`
      *,
      networks (*)
    `)
    .eq('user_id', userId)
    .eq('active', true);
    
  if (error) throw error;
  return data || [];
};
```

#### Create Network Connection
```javascript
const createNetworkConnection = async (connectionData) => {
  const { data, error } = await supabase
    .from('network_connections')
    .insert([{
      connection_id: uuidv4(),
      user_id: connectionData.userId,
      network_id: connectionData.networkId,
      credentials: connectionData.credentials, // Encrypted
      active: true,
      metadata: connectionData.metadata || {}
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
```

### Pinned Items

#### Get User Pinned Items
```javascript
const getUserPinnedItems = async (userId) => {
  const { data, error } = await supabase
    .from('pinned_items')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });
    
  if (error) throw error;
  return data || [];
};
```

#### Create Pinned Item
```javascript
const createPinnedItem = async (itemData) => {
  const { data, error } = await supabase
    .from('pinned_items')
    .insert([{
      item_id: uuidv4(),
      user_id: itemData.userId,
      source_network: itemData.sourceNetwork,
      source_message_id: itemData.sourceMessageId,
      content: itemData.content,
      type: itemData.type || 'message',
      author: itemData.author,
      metadata: itemData.metadata || {}
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
```

### Routing Rules

#### Get User Routing Rules
```javascript
const getUserRoutingRules = async (userId) => {
  const { data, error } = await supabase
    .from('routing_rules')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .order('priority', { ascending: false });
    
  if (error) throw error;
  return data || [];
};
```

#### Create Routing Rule
```javascript
const createRoutingRule = async (ruleData) => {
  const { data, error } = await supabase
    .from('routing_rules')
    .insert([{
      rule_id: uuidv4(),
      user_id: ruleData.userId,
      name: ruleData.name,
      description: ruleData.description,
      rule_type: ruleData.type,
      conditions: ruleData.conditions,
      target_network: ruleData.targetNetwork,
      target_channel: ruleData.targetChannel,
      priority: ruleData.priority || 2,
      active: true
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
```

## 🟣 Farcaster API (Neynar)

### Configuration
```javascript
const neynarApi = axios.create({
  baseURL: 'https://api.neynar.com/v2',
  headers: {
    'accept': 'application/json',
    'api_key': process.env.VITE_NEYNAR_API_KEY,
  },
});
```

### User Operations

#### Get User by FID
```javascript
const getUserByFid = async (fid) => {
  try {
    const response = await neynarApi.get(`/farcaster/user/bulk?fids=${fid}`);
    return response.data.users[0];
  } catch (error) {
    console.error('Error fetching user by FID:', error);
    throw error;
  }
};
```

#### Get User by Username
```javascript
const getUserByUsername = async (username) => {
  try {
    const response = await neynarApi.get(`/farcaster/user/by_username?username=${username}`);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
};
```

### Cast Operations

#### Get User Casts
```javascript
const getUserCasts = async (fid, limit = 25, cursor = null) => {
  try {
    let url = `/farcaster/feed/user/casts?fid=${fid}&limit=${limit}`;
    if (cursor) url += `&cursor=${cursor}`;
    
    const response = await neynarApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching user casts:', error);
    throw error;
  }
};
```

#### Get Cast by Hash
```javascript
const getCastById = async (hash) => {
  try {
    const response = await neynarApi.get(`/farcaster/cast?identifier=${hash}&type=hash`);
    return response.data.cast;
  } catch (error) {
    console.error('Error fetching cast by ID:', error);
    throw error;
  }
};
```

### Channel Operations

#### Get Channels
```javascript
const getChannels = async (limit = 25) => {
  try {
    const response = await neynarApi.get(`/farcaster/channel/list?limit=${limit}`);
    return response.data.channels;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};
```

#### Get Channel Casts
```javascript
const getChannelCasts = async (channelId, limit = 25, cursor = null) => {
  try {
    let url = `/farcaster/feed/channels?channel_ids=${channelId}&limit=${limit}`;
    if (cursor) url += `&cursor=${cursor}`;
    
    const response = await neynarApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel casts:', error);
    throw error;
  }
};
```

### Social Graph

#### Get User Following
```javascript
const getUserFollowing = async (fid, limit = 25, cursor = null) => {
  try {
    let url = `/farcaster/following?fid=${fid}&limit=${limit}`;
    if (cursor) url += `&cursor=${cursor}`;
    
    const response = await neynarApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching user following:', error);
    throw error;
  }
};
```

#### Get User Followers
```javascript
const getUserFollowers = async (fid, limit = 25, cursor = null) => {
  try {
    let url = `/farcaster/followers?fid=${fid}&limit=${limit}`;
    if (cursor) url += `&cursor=${cursor}`;
    
    const response = await neynarApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching user followers:', error);
    throw error;
  }
};
```

## 💰 Payment API (Base Network)

### Configuration
```javascript
const BASE_CHAIN_ID = 8453;
const PAYMENT_TOKEN_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // USDC on Base

const PRICING = {
  FREE_TIER: {
    networks: 2,
    features: ['basic_discovery', 'basic_mapping'],
    price: 0
  },
  MICRO_TRANSACTION: {
    per_network: 0.01, // $0.01 per network per month
    features: ['intelligent_routing', 'centralized_hub', 'advanced_analytics'],
    currency: 'USDC'
  }
};
```

### Payment Operations

#### Calculate Monthly Cost
```javascript
const calculateMonthlyCost = (connectedNetworks) => {
  const freeNetworks = PRICING.FREE_TIER.networks;
  const paidNetworks = Math.max(0, connectedNetworks - freeNetworks);
  return paidNetworks * PRICING.MICRO_TRANSACTION.per_network;
};
```

#### Create Payment Transaction
```javascript
const createNetworkPayment = async (userAddress, networkCount, months = 1) => {
  try {
    const monthlyCost = calculateMonthlyCost(networkCount);
    const totalCost = monthlyCost * months;
    
    if (totalCost === 0) {
      return { success: true, free: true };
    }

    // Convert to wei (USDC has 6 decimals)
    const amountInWei = parseEther(totalCost.toString());
    
    // Create payment transaction
    const paymentData = {
      from: userAddress,
      to: PAYMENT_TOKEN_ADDRESS,
      amount: amountInWei,
      currency: 'USDC',
      description: `Nexus Weaver - ${networkCount} networks for ${months} month(s)`,
      timestamp: new Date().toISOString()
    };

    // Process payment (implementation depends on wallet integration)
    const result = await processPayment(paymentData);
    
    return {
      success: true,
      transactionHash: result.hash,
      amount: totalCost,
      currency: 'USDC',
      ...paymentData
    };
    
  } catch (error) {
    console.error('Payment error:', error);
    throw new Error('Payment failed');
  }
};
```

#### Validate Payment
```javascript
const validatePayment = async (transactionHash) => {
  try {
    // Check transaction on Base network
    const receipt = await publicClient.getTransactionReceipt({
      hash: transactionHash
    });
    
    return {
      valid: receipt.status === 'success',
      confirmed: receipt.blockNumber > 0,
      blockNumber: receipt.blockNumber,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Payment validation error:', error);
    return { valid: false, error: error.message };
  }
};
```

### Subscription Management

#### Get Subscription Status
```javascript
const getSubscriptionStatus = async (userAddress) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userAddress)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    return data || { active: false, plan: 'free' };
    
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return { active: false };
  }
};
```

## 🤖 Message Routing API

### Routing Engine

#### Process Message
```javascript
const processMessage = async (message, userId) => {
  try {
    const routingService = new MessageRoutingService(userId);
    await routingService.initialize();
    
    const routingDecisions = await routingService.processMessage(message);
    
    // Log routing analytics
    for (const decision of routingDecisions) {
      await recordAnalytics({
        user_id: userId,
        event_type: 'message_routed',
        event_data: {
          ruleId: decision.ruleId,
          targetNetwork: decision.targetNetwork,
          priority: decision.priority
        },
        network_source: message.sourceNetwork,
        network_target: decision.targetNetwork
      });
    }
    
    return routingDecisions;
    
  } catch (error) {
    console.error('Error processing message:', error);
    return [];
  }
};
```

#### Create Routing Rule
```javascript
const createRoutingRule = async (userId, ruleData) => {
  try {
    const routingService = new MessageRoutingService(userId);
    const rule = await routingService.createRoutingRule({
      name: ruleData.name,
      description: ruleData.description,
      type: ruleData.type, // 'keyword', 'sender', 'network', 'time', 'content_type'
      conditions: ruleData.conditions,
      targetNetwork: ruleData.targetNetwork,
      targetChannel: ruleData.targetChannel,
      priority: ruleData.priority
    });
    
    return rule;
    
  } catch (error) {
    console.error('Error creating routing rule:', error);
    throw error;
  }
};
```

## 📊 Analytics API

### Event Tracking

#### Record Analytics Event
```javascript
const recordAnalytics = async (analyticsData) => {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .insert([{
        analytics_id: uuidv4(),
        user_id: analyticsData.user_id,
        event_type: analyticsData.event_type,
        event_data: analyticsData.event_data,
        network_source: analyticsData.network_source,
        network_target: analyticsData.network_target
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error('Error recording analytics:', error);
    throw error;
  }
};
```

#### Get Analytics Data
```javascript
const getAnalytics = async (userId, timeRange = '7d') => {
  try {
    const days = timeRange === '7d' ? 7 : 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return [];
  }
};
```

## 🔧 Error Handling

### Standard Error Response Format
```javascript
{
  "error": {
    "code": "NETWORK_CONNECTION_FAILED",
    "message": "Failed to connect to Farcaster network",
    "details": {
      "network": "farcaster",
      "timestamp": "2024-01-15T10:30:00Z",
      "retryable": true
    }
  }
}
```

### Common Error Codes
- `WALLET_NOT_CONNECTED`: User wallet not connected
- `INSUFFICIENT_FUNDS`: Not enough funds for payment
- `API_RATE_LIMIT`: External API rate limit exceeded
- `NETWORK_CONNECTION_FAILED`: Network connection error
- `INVALID_CREDENTIALS`: Invalid API credentials
- `DATABASE_ERROR`: Database operation failed
- `ROUTING_RULE_INVALID`: Invalid routing rule configuration

## 🚀 Rate Limiting

### API Rate Limits
- **Neynar API**: 100 requests per minute
- **Supabase**: 1000 requests per minute
- **Internal APIs**: 500 requests per minute per user

### Rate Limiting Implementation
```javascript
const rateLimiter = {
  neynar: new RateLimit(100, '1m'),
  supabase: new RateLimit(1000, '1m'),
  internal: new RateLimit(500, '1m')
};

const checkRateLimit = async (service, userId) => {
  const allowed = await rateLimiter[service].check(userId);
  if (!allowed) {
    throw new Error(`Rate limit exceeded for ${service}`);
  }
};
```

## 📝 Testing

### API Testing Examples
```javascript
// Test user creation
describe('User API', () => {
  test('should create new user', async () => {
    const userData = {
      walletAddress: '0x123...',
      farcasterId: 12345,
      preferences: { theme: 'dark' }
    };
    
    const user = await createUser(userData);
    expect(user.wallet_address).toBe(userData.walletAddress);
  });
});

// Test Farcaster integration
describe('Farcaster API', () => {
  test('should fetch user by FID', async () => {
    const user = await FarcasterAPI.getUserByFid(1);
    expect(user).toBeDefined();
    expect(user.fid).toBe(1);
  });
});
```

---

## 📞 Support

For API support and questions:
- **Documentation**: Check this file and README.md
- **Issues**: Create a GitHub issue
- **Community**: Join our Discord server

---

**Last Updated**: January 2024
**API Version**: 1.0.0
