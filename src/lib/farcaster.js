import axios from 'axios';

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY;
const NEYNAR_BASE_URL = import.meta.env.VITE_NEYNAR_BASE_URL || 'https://api.neynar.com/v2';

// Create axios instance for Neynar API
const neynarApi = axios.create({
  baseURL: NEYNAR_BASE_URL,
  headers: {
    'accept': 'application/json',
    'api_key': NEYNAR_API_KEY,
  },
});

export class FarcasterAPI {
  static async getUserByFid(fid) {
    try {
      const response = await neynarApi.get(`/farcaster/user/bulk?fids=${fid}`);
      return response.data.users[0];
    } catch (error) {
      console.error('Error fetching user by FID:', error);
      throw error;
    }
  }

  static async getUserByUsername(username) {
    try {
      const response = await neynarApi.get(`/farcaster/user/by_username?username=${username}`);
      return response.data.user;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  static async getUserCasts(fid, limit = 25, cursor = null) {
    try {
      let url = `/farcaster/feed/user/casts?fid=${fid}&limit=${limit}`;
      if (cursor) url += `&cursor=${cursor}`;
      
      const response = await neynarApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching user casts:', error);
      throw error;
    }
  }

  static async getChannels(limit = 25) {
    try {
      const response = await neynarApi.get(`/farcaster/channel/list?limit=${limit}`);
      return response.data.channels;
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  }

  static async getChannelCasts(channelId, limit = 25, cursor = null) {
    try {
      let url = `/farcaster/feed/channels?channel_ids=${channelId}&limit=${limit}`;
      if (cursor) url += `&cursor=${cursor}`;
      
      const response = await neynarApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching channel casts:', error);
      throw error;
    }
  }

  static async getCastById(hash) {
    try {
      const response = await neynarApi.get(`/farcaster/cast?identifier=${hash}&type=hash`);
      return response.data.cast;
    } catch (error) {
      console.error('Error fetching cast by ID:', error);
      throw error;
    }
  }

  static async searchUsers(query, limit = 10) {
    try {
      const response = await neynarApi.get(`/farcaster/user/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data.result.users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  static async getUserFollowing(fid, limit = 25, cursor = null) {
    try {
      let url = `/farcaster/following?fid=${fid}&limit=${limit}`;
      if (cursor) url += `&cursor=${cursor}`;
      
      const response = await neynarApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching user following:', error);
      throw error;
    }
  }

  static async getUserFollowers(fid, limit = 25, cursor = null) {
    try {
      let url = `/farcaster/followers?fid=${fid}&limit=${limit}`;
      if (cursor) url += `&cursor=${cursor}`;
      
      const response = await neynarApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching user followers:', error);
      throw error;
    }
  }

  // Helper function to extract network data for Nexus Weaver
  static async getUserNetworkData(fid) {
    try {
      const [user, casts, following, followers] = await Promise.all([
        this.getUserByFid(fid),
        this.getUserCasts(fid, 10),
        this.getUserFollowing(fid, 100),
        this.getUserFollowers(fid, 100)
      ]);

      // Extract channels from user's casts
      const channels = new Set();
      casts.casts?.forEach(cast => {
        if (cast.channel) {
          channels.add(cast.channel.id);
        }
      });

      return {
        networkId: 'farcaster',
        name: 'Farcaster',
        type: 'social',
        connected: true,
        user: {
          fid: user.fid,
          username: user.username,
          displayName: user.display_name,
          pfpUrl: user.pfp_url,
          followerCount: user.follower_count,
          followingCount: user.following_count
        },
        channels: Array.from(channels).length,
        activeUsers: following.users?.length || 0,
        recentCasts: casts.casts?.slice(0, 5) || [],
        lastActivity: casts.casts?.[0]?.timestamp || null
      };
    } catch (error) {
      console.error('Error getting user network data:', error);
      throw error;
    }
  }

  // Validate if API is configured
  static isConfigured() {
    return !!NEYNAR_API_KEY;
  }
}

// Mock data fallback when API is not configured
export const mockFarcasterData = {
  user: {
    fid: 1,
    username: 'demo_user',
    displayName: 'Demo User',
    pfpUrl: 'https://via.placeholder.com/150',
    followerCount: 1234,
    followingCount: 567
  },
  channels: [
    { id: 'base', name: 'Base', description: 'Base blockchain discussion' },
    { id: 'farcaster', name: 'Farcaster', description: 'Farcaster protocol updates' },
    { id: 'crypto', name: 'Crypto', description: 'General crypto discussion' }
  ],
  casts: [
    {
      hash: '0x123',
      text: 'Excited about the new Base MiniApp features!',
      timestamp: new Date().toISOString(),
      author: { username: 'demo_user', display_name: 'Demo User' },
      channel: { id: 'base', name: 'Base' }
    }
  ]
};
