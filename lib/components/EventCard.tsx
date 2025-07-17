import React from 'react';
import { Platform } from 'react-native';
import { Event } from '../types/event';
import WoodlandsTheme from '../theme/woodlands-theme';

// Enhanced Web version with Ant Design best practices
const WebEventCard = ({ event, onPress }: { event: Event; onPress?: () => void }) => {
  if (Platform.OS !== 'web') return null;
  
  const { Card, Tag, Typography, Space, Divider, Badge } = require('antd');
  const { 
    ClockCircleOutlined, 
    EnvironmentOutlined, 
    DollarOutlined,
    CalendarOutlined,
    StarFilled,
    UserOutlined
  } = require('@ant-design/icons');
  const { Text, Paragraph } = Typography;
  
  const getCategoryConfig = (category: string) => {
    const configs = {
      music: { color: '#fa8c16', icon: '🎵', bgColor: '#fff7e6', label: 'Music' },
      food: { color: '#fa541c', icon: '🍽️', bgColor: '#fff2e8', label: 'Food & Drink' },
      family: { color: '#13c2c2', icon: '👨‍👩‍👧‍👦', bgColor: '#e6fffb', label: 'Family' },
      business: { color: '#1890ff', icon: '💼', bgColor: '#e6f7ff', label: 'Business' },
      community: { color: '#52c41a', icon: '🏘️', bgColor: '#f6ffed', label: 'Community' },
      sports: { color: '#2f54eb', icon: '⚽', bgColor: '#f0f5ff', label: 'Sports' },
      arts: { color: '#722ed1', icon: '🎨', bgColor: '#f9f0ff', label: 'Arts & Culture' }
    };
    return configs[category as keyof typeof configs] || { 
      color: '#8c8c8c', 
      icon: '📅', 
      bgColor: '#fafafa', 
      label: 'Event' 
    };
  };

  const getSourceBadge = (source: string) => {
    const badges = {
      township: { color: '#52c41a', text: 'Official' },
      pavilion: { color: '#fa8c16', text: 'Pavilion' },
      manual: { color: '#1890ff', text: 'Community' }
    };
    return badges[source as keyof typeof badges] || { color: '#8c8c8c', text: 'Event' };
  };

  const categoryConfig = getCategoryConfig(event.category);
  const sourceBadge = getSourceBadge(event.source);
  const isFree = event.price?.toLowerCase().includes('free');

  return (
    <Card
      hoverable
      style={{ 
        marginBottom: 0,
        borderRadius: '16px',
        border: '2px solid #f0f0f0',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'
      }}
      onClick={onPress}
      bodyStyle={{ padding: '20px' }}
    >
      {/* Header with category and source */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <Tag 
          color={categoryConfig.color}
          style={{ 
            margin: 0,
            padding: '4px 12px',
            borderRadius: '20px',
            fontWeight: '600',
            fontSize: '12px',
            border: 'none',
            background: categoryConfig.bgColor,
            color: categoryConfig.color
          }}
        >
          {categoryConfig.icon} {categoryConfig.label}
        </Tag>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isFree && (
            <Badge 
              count="FREE" 
              style={{ 
                backgroundColor: '#52c41a',
                fontSize: '10px',
                fontWeight: '700',
                padding: '0 6px',
                height: '20px',
                lineHeight: '20px',
                borderRadius: '10px'
              }} 
            />
          )}
          <Tag 
            color={sourceBadge.color}
            style={{
              margin: 0,
              fontSize: '10px',
              fontWeight: '600',
              borderRadius: '12px',
              padding: '2px 8px'
            }}
          >
            {sourceBadge.text}
          </Tag>
        </div>
      </div>

      {/* Event Title */}
      <Typography.Title 
        level={4} 
        style={{ 
          margin: '0 0 12px 0',
          fontSize: '18px',
          fontWeight: '700',
          lineHeight: '1.4',
          color: '#1f2937'
        }}
        ellipsis={{ rows: 2, tooltip: event.title }}
      >
        {event.title}
      </Typography.Title>

      {/* Description */}
      <Paragraph 
        style={{ 
          margin: '0 0 16px 0',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#6b7280'
        }}
        ellipsis={{ rows: 2, tooltip: event.description }}
      >
        {event.description}
      </Paragraph>

      <Divider style={{ margin: '16px 0', borderColor: '#f0f0f0' }} />

      {/* Event Details */}
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClockCircleOutlined style={{ color: '#1890ff', fontSize: '14px' }} />
          <Text style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            {event.startTime}
            {event.endTime && ` - ${event.endTime}`}
          </Text>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EnvironmentOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
          <Text 
            style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              flex: 1
            }}
            ellipsis={{ tooltip: event.venue.name }}
          >
            {event.venue.name}
          </Text>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarOutlined style={{ color: '#fa8c16', fontSize: '14px' }} />
            <Text style={{ 
              fontSize: '16px', 
              fontWeight: '700',
              color: isFree ? '#52c41a' : '#1f2937'
            }}>
              {event.price}
            </Text>
          </div>
          
          <Text style={{ 
            fontSize: '12px', 
            color: '#9ca3af',
            fontWeight: '500'
          }}>
            Click to view details
          </Text>
        </div>
      </Space>
    </Card>
  );
};

// Enhanced Native version with modern mobile design
const NativeEventCard = ({ event, onPress }: { event: Event; onPress?: () => void }) => {
  if (Platform.OS === 'web') return null;
  
  const { View, Text, TouchableOpacity } = require('react-native');
  
  // Only render native layout if styles are available
  if (!styles || Object.keys(styles).length === 0) return null;
  
  const getCategoryEmoji = (category: string) => {
    const emojis = {
      music: '🎵',
      food: '🍽️',
      family: '👨‍👩‍👧‍👦',
      business: '💼',
      community: '🏘️',
      sports: '⚽',
      arts: '🎨'
    };
    return emojis[category as keyof typeof emojis] || '📅';
  };

  const isFree = event.price?.toLowerCase().includes('free');

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {/* Header with category and price */}
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryEmoji}>{getCategoryEmoji(event.category)}</Text>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
        <View style={[styles.priceContainer, isFree && styles.freeContainer]}>
          <Text style={[styles.priceText, isFree && styles.freeText]}>
            {event.price}
          </Text>
        </View>
      </View>

      {/* Event Title */}
      <Text style={styles.title} numberOfLines={2}>
        {event.title}
      </Text>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {event.description}
      </Text>

      {/* Event Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeIcon}>🕐</Text>
          <Text style={styles.timeText}>{event.startTime}</Text>
        </View>
        
        <View style={styles.venueContainer}>
          <Text style={styles.venueIcon}>📍</Text>
          <Text style={styles.venueText} numberOfLines={1}>
            {event.venue.name}
          </Text>
        </View>
      </View>

      {/* Source Badge */}
      <View style={styles.sourceContainer}>
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceText}>
            {event.source === 'township' ? 'Official' : 
             event.source === 'pavilion' ? 'Pavilion' : 'Community'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// StyleSheet for native only
const { StyleSheet } = Platform.OS !== 'web' ? require('react-native') : { StyleSheet: null };

const styles = Platform.OS !== 'web' ? StyleSheet?.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#2B7F47',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f0f9f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B7F47',
    textTransform: 'capitalize',
  },
  priceContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  freeContainer: {
    backgroundColor: '#dcfce7',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374751',
  },
  freeText: {
    color: '#16a34a',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    paddingHorizontal: 20,
    marginBottom: 8,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    paddingHorizontal: 20,
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  venueText: {
    fontSize: 15,
    color: '#6b7280',
    flex: 1,
    fontWeight: '500',
  },
  sourceContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  sourceBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
}) : {};

export default function EventCard({ 
  event, 
  onPress 
}: { 
  event: Event; 
  onPress?: () => void;
}) {
  return (
    <>
      <WebEventCard event={event} onPress={onPress} />
      <NativeEventCard event={event} onPress={onPress} />
    </>
  );
}