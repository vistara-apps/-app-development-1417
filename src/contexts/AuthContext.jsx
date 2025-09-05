import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { dbHelpers } from '../lib/supabase';
import { FarcasterAPI } from '../lib/farcaster';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [farcasterProfile, setFarcasterProfile] = useState(null);
  
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // Initialize user when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      initializeUser(address);
    } else {
      setUser(null);
      setFarcasterProfile(null);
      setLoading(false);
    }
  }, [isConnected, address]);

  const initializeUser = async (walletAddress) => {
    try {
      setLoading(true);
      
      // Check if user exists in database
      let userData = await dbHelpers.getUserByWallet(walletAddress);
      
      if (!userData) {
        // Create new user
        userData = await createNewUser(walletAddress);
      }
      
      setUser(userData);
      
      // Load Farcaster profile if connected
      if (userData.farcaster_id) {
        await loadFarcasterProfile(userData.farcaster_id);
      }
      
    } catch (error) {
      console.error('Error initializing user:', error);
      toast.error('Failed to initialize user profile');
    } finally {
      setLoading(false);
    }
  };

  const createNewUser = async (walletAddress) => {
    const newUser = {
      user_id: uuidv4(),
      wallet_address: walletAddress,
      farcaster_id: null,
      connected_networks: [],
      preferences: {
        theme: 'dark',
        notifications: true,
        autoRouting: false
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return await dbHelpers.createUser(newUser);
  };

  const connectFarcaster = async (username) => {
    try {
      if (!FarcasterAPI.isConfigured()) {
        toast.error('Farcaster API not configured');
        return false;
      }

      setLoading(true);
      
      // Get Farcaster user data
      const farcasterUser = await FarcasterAPI.getUserByUsername(username);
      
      if (!farcasterUser) {
        toast.error('Farcaster user not found');
        return false;
      }

      // Verify ownership through signature (simplified for MVP)
      const message = `Connect Farcaster account ${username} to Nexus Weaver`;
      await signMessageAsync({ message });

      // Update user with Farcaster ID
      const updatedUser = {
        ...user,
        farcaster_id: farcasterUser.fid,
        updated_at: new Date().toISOString()
      };

      // Update in database (if available)
      if (dbHelpers && dbHelpers.supabase) {
        await dbHelpers.supabase
          .from('users')
          .update({ 
            farcaster_id: farcasterUser.fid,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.user_id);
      }

      setUser(updatedUser);
      await loadFarcasterProfile(farcasterUser.fid);
      
      toast.success('Farcaster account connected successfully!');
      return true;
      
    } catch (error) {
      console.error('Error connecting Farcaster:', error);
      toast.error('Failed to connect Farcaster account');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loadFarcasterProfile = async (fid) => {
    try {
      if (!FarcasterAPI.isConfigured()) {
        return;
      }

      const networkData = await FarcasterAPI.getUserNetworkData(fid);
      setFarcasterProfile(networkData);
      
    } catch (error) {
      console.error('Error loading Farcaster profile:', error);
    }
  };

  const disconnectFarcaster = async () => {
    try {
      setLoading(true);
      
      const updatedUser = {
        ...user,
        farcaster_id: null,
        updated_at: new Date().toISOString()
      };

      // Update in database (if available)
      if (dbHelpers && dbHelpers.supabase) {
        await dbHelpers.supabase
          .from('users')
          .update({ 
            farcaster_id: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.user_id);
      }

      setUser(updatedUser);
      setFarcasterProfile(null);
      
      toast.success('Farcaster account disconnected');
      
    } catch (error) {
      console.error('Error disconnecting Farcaster:', error);
      toast.error('Failed to disconnect Farcaster account');
    } finally {
      setLoading(false);
    }
  };

  const updateUserPreferences = async (preferences) => {
    try {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences },
        updated_at: new Date().toISOString()
      };

      // Update in database (if available)
      if (dbHelpers && dbHelpers.supabase) {
        await dbHelpers.supabase
          .from('users')
          .update({ 
            preferences: updatedUser.preferences,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.user_id);
      }

      setUser(updatedUser);
      toast.success('Preferences updated');
      
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const value = {
    user,
    farcasterProfile,
    loading,
    isAuthenticated: !!user,
    connectFarcaster,
    disconnectFarcaster,
    updateUserPreferences,
    refreshFarcasterProfile: () => user?.farcaster_id && loadFarcasterProfile(user.farcaster_id)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
