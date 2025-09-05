import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Using mock data mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database schema types based on PRD data model
export const TABLES = {
  USERS: 'users',
  NETWORKS: 'networks', 
  NETWORK_CONNECTIONS: 'network_connections',
  PINNED_ITEMS: 'pinned_items',
  ROUTING_RULES: 'routing_rules',
  ANALYTICS: 'analytics'
};

// Helper functions for database operations
export const dbHelpers = {
  // User operations
  async createUser(userData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByWallet(walletAddress) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Network connection operations
  async getUserNetworks(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from(TABLES.NETWORK_CONNECTIONS)
      .select(`
        *,
        networks (*)
      `)
      .eq('user_id', userId)
      .eq('active', true);
    
    if (error) throw error;
    return data || [];
  },

  async createNetworkConnection(connectionData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from(TABLES.NETWORK_CONNECTIONS)
      .insert([connectionData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Pinned items operations
  async getUserPinnedItems(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from(TABLES.PINNED_ITEMS)
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createPinnedItem(itemData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from(TABLES.PINNED_ITEMS)
      .insert([itemData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletePinnedItem(itemId, userId) {
    if (!supabase) return null;
    const { error } = await supabase
      .from(TABLES.PINNED_ITEMS)
      .delete()
      .eq('item_id', itemId)
      .eq('user_id', userId);
    
    if (error) throw error;
    return true;
  },

  // Analytics operations
  async recordAnalytics(analyticsData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from(TABLES.ANALYTICS)
      .insert([analyticsData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAnalytics(userId, timeRange = '7d') {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from(TABLES.ANALYTICS)
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - (timeRange === '7d' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};
