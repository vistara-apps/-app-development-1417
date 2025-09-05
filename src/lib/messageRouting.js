import { dbHelpers } from './supabase';
import { FarcasterAPI } from './farcaster';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

// Message routing priorities
export const ROUTING_PRIORITY = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4
};

// Routing rule types
export const RULE_TYPES = {
  KEYWORD: 'keyword',
  SENDER: 'sender',
  NETWORK: 'network',
  TIME: 'time',
  CONTENT_TYPE: 'content_type'
};

// Target network types
export const TARGET_NETWORKS = {
  FARCASTER: 'farcaster',
  DISCORD: 'discord',
  TELEGRAM: 'telegram',
  SLACK: 'slack',
  EMAIL: 'email'
};

export class MessageRoutingService {
  constructor(userId) {
    this.userId = userId;
    this.routingRules = [];
    this.activeConnections = new Map();
  }

  // Initialize routing service
  async initialize() {
    try {
      await this.loadRoutingRules();
      await this.loadActiveConnections();
    } catch (error) {
      console.error('Error initializing routing service:', error);
    }
  }

  // Load user's routing rules
  async loadRoutingRules() {
    try {
      if (!dbHelpers.supabase) {
        // Use mock rules for development
        this.routingRules = this.getMockRoutingRules();
        return;
      }

      const { data, error } = await dbHelpers.supabase
        .from('routing_rules')
        .select('*')
        .eq('user_id', this.userId)
        .eq('active', true)
        .order('priority', { ascending: false });

      if (error) throw error;
      this.routingRules = data || [];
      
    } catch (error) {
      console.error('Error loading routing rules:', error);
      this.routingRules = this.getMockRoutingRules();
    }
  }

  // Load active network connections
  async loadActiveConnections() {
    try {
      const connections = await dbHelpers.getUserNetworks(this.userId);
      
      connections.forEach(conn => {
        this.activeConnections.set(conn.networks.name.toLowerCase(), {
          id: conn.connection_id,
          network: conn.networks,
          credentials: conn.credentials,
          active: conn.active
        });
      });
      
    } catch (error) {
      console.error('Error loading active connections:', error);
    }
  }

  // Create a new routing rule
  async createRoutingRule(ruleData) {
    try {
      const rule = {
        rule_id: uuidv4(),
        user_id: this.userId,
        name: ruleData.name,
        description: ruleData.description,
        rule_type: ruleData.type,
        conditions: ruleData.conditions,
        target_network: ruleData.targetNetwork,
        target_channel: ruleData.targetChannel,
        priority: ruleData.priority || ROUTING_PRIORITY.MEDIUM,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (dbHelpers.supabase) {
        const { data, error } = await dbHelpers.supabase
          .from('routing_rules')
          .insert([rule])
          .select()
          .single();

        if (error) throw error;
        this.routingRules.push(data);
        return data;
      } else {
        // Mock mode
        this.routingRules.push(rule);
        return rule;
      }
      
    } catch (error) {
      console.error('Error creating routing rule:', error);
      throw error;
    }
  }

  // Update routing rule
  async updateRoutingRule(ruleId, updates) {
    try {
      const updatedRule = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (dbHelpers.supabase) {
        const { data, error } = await dbHelpers.supabase
          .from('routing_rules')
          .update(updatedRule)
          .eq('rule_id', ruleId)
          .eq('user_id', this.userId)
          .select()
          .single();

        if (error) throw error;
        
        // Update local cache
        const index = this.routingRules.findIndex(r => r.rule_id === ruleId);
        if (index !== -1) {
          this.routingRules[index] = data;
        }
        
        return data;
      } else {
        // Mock mode
        const index = this.routingRules.findIndex(r => r.rule_id === ruleId);
        if (index !== -1) {
          this.routingRules[index] = { ...this.routingRules[index], ...updatedRule };
          return this.routingRules[index];
        }
      }
      
    } catch (error) {
      console.error('Error updating routing rule:', error);
      throw error;
    }
  }

  // Delete routing rule
  async deleteRoutingRule(ruleId) {
    try {
      if (dbHelpers.supabase) {
        const { error } = await dbHelpers.supabase
          .from('routing_rules')
          .delete()
          .eq('rule_id', ruleId)
          .eq('user_id', this.userId);

        if (error) throw error;
      }

      // Remove from local cache
      this.routingRules = this.routingRules.filter(r => r.rule_id !== ruleId);
      
    } catch (error) {
      console.error('Error deleting routing rule:', error);
      throw error;
    }
  }

  // Process incoming message and determine routing
  async processMessage(message) {
    try {
      const routingDecisions = [];
      
      // Sort rules by priority
      const sortedRules = [...this.routingRules].sort((a, b) => b.priority - a.priority);
      
      for (const rule of sortedRules) {
        if (this.evaluateRule(rule, message)) {
          const decision = {
            ruleId: rule.rule_id,
            ruleName: rule.name,
            targetNetwork: rule.target_network,
            targetChannel: rule.target_channel,
            priority: rule.priority,
            timestamp: new Date().toISOString()
          };
          
          routingDecisions.push(decision);
          
          // Execute routing if network is connected
          if (this.activeConnections.has(rule.target_network)) {
            await this.executeRouting(message, decision);
          }
        }
      }
      
      return routingDecisions;
      
    } catch (error) {
      console.error('Error processing message:', error);
      return [];
    }
  }

  // Evaluate if a rule matches a message
  evaluateRule(rule, message) {
    try {
      const conditions = rule.conditions;
      
      switch (rule.rule_type) {
        case RULE_TYPES.KEYWORD:
          return this.evaluateKeywordRule(conditions, message);
        case RULE_TYPES.SENDER:
          return this.evaluateSenderRule(conditions, message);
        case RULE_TYPES.NETWORK:
          return this.evaluateNetworkRule(conditions, message);
        case RULE_TYPES.TIME:
          return this.evaluateTimeRule(conditions, message);
        case RULE_TYPES.CONTENT_TYPE:
          return this.evaluateContentTypeRule(conditions, message);
        default:
          return false;
      }
      
    } catch (error) {
      console.error('Error evaluating rule:', error);
      return false;
    }
  }

  // Keyword-based rule evaluation
  evaluateKeywordRule(conditions, message) {
    const keywords = conditions.keywords || [];
    const content = message.content?.toLowerCase() || '';
    const matchType = conditions.matchType || 'any'; // 'any' or 'all'
    
    if (matchType === 'all') {
      return keywords.every(keyword => content.includes(keyword.toLowerCase()));
    } else {
      return keywords.some(keyword => content.includes(keyword.toLowerCase()));
    }
  }

  // Sender-based rule evaluation
  evaluateSenderRule(conditions, message) {
    const allowedSenders = conditions.senders || [];
    const sender = message.author?.username || message.author?.address || '';
    
    return allowedSenders.some(allowedSender => 
      sender.toLowerCase().includes(allowedSender.toLowerCase())
    );
  }

  // Network-based rule evaluation
  evaluateNetworkRule(conditions, message) {
    const allowedNetworks = conditions.networks || [];
    const sourceNetwork = message.sourceNetwork?.toLowerCase() || '';
    
    return allowedNetworks.some(network => 
      sourceNetwork.includes(network.toLowerCase())
    );
  }

  // Time-based rule evaluation
  evaluateTimeRule(conditions, message) {
    const now = new Date();
    const messageTime = new Date(message.timestamp);
    
    // Check time range
    if (conditions.timeRange) {
      const startTime = new Date(conditions.timeRange.start);
      const endTime = new Date(conditions.timeRange.end);
      
      if (messageTime < startTime || messageTime > endTime) {
        return false;
      }
    }
    
    // Check days of week
    if (conditions.daysOfWeek && conditions.daysOfWeek.length > 0) {
      const dayOfWeek = messageTime.getDay();
      if (!conditions.daysOfWeek.includes(dayOfWeek)) {
        return false;
      }
    }
    
    return true;
  }

  // Content type rule evaluation
  evaluateContentTypeRule(conditions, message) {
    const allowedTypes = conditions.contentTypes || [];
    const messageType = message.type || 'text';
    
    return allowedTypes.includes(messageType);
  }

  // Execute the routing decision
  async executeRouting(message, decision) {
    try {
      const connection = this.activeConnections.get(decision.targetNetwork);
      
      if (!connection) {
        console.warn(`No active connection for network: ${decision.targetNetwork}`);
        return false;
      }
      
      switch (decision.targetNetwork) {
        case TARGET_NETWORKS.FARCASTER:
          return await this.routeToFarcaster(message, decision, connection);
        case TARGET_NETWORKS.DISCORD:
          return await this.routeToDiscord(message, decision, connection);
        case TARGET_NETWORKS.TELEGRAM:
          return await this.routeToTelegram(message, decision, connection);
        case TARGET_NETWORKS.SLACK:
          return await this.routeToSlack(message, decision, connection);
        default:
          console.warn(`Unsupported target network: ${decision.targetNetwork}`);
          return false;
      }
      
    } catch (error) {
      console.error('Error executing routing:', error);
      return false;
    }
  }

  // Route message to Farcaster
  async routeToFarcaster(message, decision, connection) {
    try {
      // For MVP, we'll log the routing action
      console.log('Routing to Farcaster:', {
        message: message.content,
        channel: decision.targetChannel,
        rule: decision.ruleName
      });
      
      // In a real implementation, this would post to Farcaster
      // using the Neynar API or direct hub interaction
      
      return true;
    } catch (error) {
      console.error('Error routing to Farcaster:', error);
      return false;
    }
  }

  // Route message to Discord
  async routeToDiscord(message, decision, connection) {
    try {
      console.log('Routing to Discord:', {
        message: message.content,
        channel: decision.targetChannel,
        rule: decision.ruleName
      });
      
      // Discord webhook or bot API integration would go here
      
      return true;
    } catch (error) {
      console.error('Error routing to Discord:', error);
      return false;
    }
  }

  // Route message to Telegram
  async routeToTelegram(message, decision, connection) {
    try {
      console.log('Routing to Telegram:', {
        message: message.content,
        channel: decision.targetChannel,
        rule: decision.ruleName
      });
      
      // Telegram Bot API integration would go here
      
      return true;
    } catch (error) {
      console.error('Error routing to Telegram:', error);
      return false;
    }
  }

  // Route message to Slack
  async routeToSlack(message, decision, connection) {
    try {
      console.log('Routing to Slack:', {
        message: message.content,
        channel: decision.targetChannel,
        rule: decision.ruleName
      });
      
      // Slack webhook or API integration would go here
      
      return true;
    } catch (error) {
      console.error('Error routing to Slack:', error);
      return false;
    }
  }

  // Get mock routing rules for development
  getMockRoutingRules() {
    return [
      {
        rule_id: '1',
        user_id: this.userId,
        name: 'Base Protocol Updates',
        description: 'Route Base-related messages to Farcaster',
        rule_type: RULE_TYPES.KEYWORD,
        conditions: {
          keywords: ['base', 'protocol', 'update'],
          matchType: 'any'
        },
        target_network: TARGET_NETWORKS.FARCASTER,
        target_channel: 'base',
        priority: ROUTING_PRIORITY.HIGH,
        active: true
      },
      {
        rule_id: '2',
        user_id: this.userId,
        name: 'Important Announcements',
        description: 'Route critical messages from team members',
        rule_type: RULE_TYPES.SENDER,
        conditions: {
          senders: ['admin', 'team', 'announcement']
        },
        target_network: TARGET_NETWORKS.DISCORD,
        target_channel: 'general',
        priority: ROUTING_PRIORITY.CRITICAL,
        active: true
      }
    ];
  }

  // Get routing statistics
  getRoutingStats() {
    return {
      totalRules: this.routingRules.length,
      activeRules: this.routingRules.filter(r => r.active).length,
      connectedNetworks: this.activeConnections.size,
      rulesByPriority: {
        critical: this.routingRules.filter(r => r.priority === ROUTING_PRIORITY.CRITICAL).length,
        high: this.routingRules.filter(r => r.priority === ROUTING_PRIORITY.HIGH).length,
        medium: this.routingRules.filter(r => r.priority === ROUTING_PRIORITY.MEDIUM).length,
        low: this.routingRules.filter(r => r.priority === ROUTING_PRIORITY.LOW).length
      }
    };
  }
}
