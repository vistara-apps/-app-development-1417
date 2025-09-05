-- Nexus Weaver Database Schema
-- Based on PRD Data Model Requirements

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    farcaster_id INTEGER UNIQUE,
    connected_networks JSONB DEFAULT '[]'::jsonb,
    preferences JSONB DEFAULT '{
        "theme": "dark",
        "notifications": true,
        "autoRouting": false
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Networks table (predefined network types)
CREATE TABLE networks (
    network_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'social', 'chat', 'work', 'messaging'
    api_url TEXT,
    icon TEXT,
    description TEXT,
    supported_features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Network connections table
CREATE TABLE network_connections (
    connection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    network_id UUID NOT NULL REFERENCES networks(network_id) ON DELETE CASCADE,
    credentials JSONB, -- Encrypted connection credentials
    active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, network_id)
);

-- Pinned items table
CREATE TABLE pinned_items (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    source_network TEXT NOT NULL,
    source_message_id TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'message', -- 'message', 'link', 'file'
    author TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routing rules table
CREATE TABLE routing_rules (
    rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    rule_type TEXT NOT NULL, -- 'keyword', 'sender', 'network', 'time', 'content_type'
    conditions JSONB NOT NULL,
    target_network TEXT NOT NULL,
    target_channel TEXT,
    priority INTEGER DEFAULT 2, -- 1=low, 2=medium, 3=high, 4=critical
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
    analytics_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'message_routed', 'network_connected', 'item_pinned'
    event_data JSONB NOT NULL,
    network_source TEXT,
    network_target TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(10, 6) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USDC',
    description TEXT,
    transaction_hash TEXT UNIQUE,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    network_count INTEGER,
    months INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Subscriptions table
CREATE TABLE subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'premium'
    networks_allowed INTEGER DEFAULT 2,
    features JSONB DEFAULT '["basic_discovery", "basic_mapping"]'::jsonb,
    expires_at TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_farcaster_id ON users(farcaster_id);
CREATE INDEX idx_network_connections_user_id ON network_connections(user_id);
CREATE INDEX idx_network_connections_active ON network_connections(user_id, active);
CREATE INDEX idx_pinned_items_user_id ON pinned_items(user_id);
CREATE INDEX idx_pinned_items_timestamp ON pinned_items(user_id, timestamp DESC);
CREATE INDEX idx_routing_rules_user_id ON routing_rules(user_id);
CREATE INDEX idx_routing_rules_active ON routing_rules(user_id, active);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_created_at ON analytics(user_id, created_at DESC);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE pinned_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Network connections policies
CREATE POLICY "Users can view own connections" ON network_connections
    FOR SELECT USING (user_id IN (
        SELECT user_id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

CREATE POLICY "Users can manage own connections" ON network_connections
    FOR ALL USING (user_id IN (
        SELECT user_id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

-- Pinned items policies
CREATE POLICY "Users can view own pinned items" ON pinned_items
    FOR SELECT USING (user_id IN (
        SELECT user_id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

CREATE POLICY "Users can manage own pinned items" ON pinned_items
    FOR ALL USING (user_id IN (
        SELECT user_id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

-- Routing rules policies
CREATE POLICY "Users can view own routing rules" ON routing_rules
    FOR SELECT USING (user_id IN (
        SELECT user_id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

CREATE POLICY "Users can manage own routing rules" ON routing_rules
    FOR ALL USING (user_id IN (
        SELECT user_id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON analytics
    FOR SELECT USING (user_id IN (
        SELECT user_id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

CREATE POLICY "Users can insert own analytics" ON analytics
    FOR INSERT WITH CHECK (user_id IN (
        SELECT user_id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (user_id IN (
        SELECT user_id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (user_id IN (
        SELECT user_id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    ));

-- Insert default networks
INSERT INTO networks (name, type, api_url, icon, description, supported_features) VALUES
('Farcaster', 'social', 'https://api.neynar.com/v2', '🟣', 'Decentralized social network', '["discovery", "messaging", "channels"]'),
('Discord', 'chat', 'https://discord.com/api', '💜', 'Gaming and community chat platform', '["messaging", "channels", "webhooks"]'),
('Slack', 'work', 'https://slack.com/api', '💬', 'Workplace communication platform', '["messaging", "channels", "webhooks"]'),
('Telegram', 'messaging', 'https://api.telegram.org', '🔵', 'Cloud-based instant messaging', '["messaging", "bots", "channels"]');

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_networks_updated_at BEFORE UPDATE ON networks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_connections_updated_at BEFORE UPDATE ON network_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routing_rules_updated_at BEFORE UPDATE ON routing_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
