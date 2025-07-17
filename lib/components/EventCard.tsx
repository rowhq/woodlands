import React from 'react';
import { Platform } from 'react-native';
import { Event } from '../types/event';
import WoodlandsTheme from '../theme/woodlands-theme';

// Web version using Ant Design
const WebEventCard = ({ event, onPress }: { event: Event; onPress: () => void }) => {
  if (Platform.OS !== 'web') return null;
  
  const { Card, Tag } = require('antd');
  const { ClockCircleOutlined, EnvironmentOutlined } = require('@ant-design/icons');
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music': return 'orange';
      case 'food': return 'volcano';
      case 'family': return 'cyan';
      case 'business': return 'geekblue';
      case 'community': return 'green';
      case 'sports': return 'blue';
      case 'arts': return 'purple';
      default: return 'default';
    }
  };

  return (
    <Card
      hoverable
      style={{ marginBottom: 16, cursor: 'pointer' }}
      onClick={onPress}
      actions={[
        <div key="time" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {event.startTime}
        </div>,
        <div key="venue" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EnvironmentOutlined style={{ marginRight: 4 }} />
          {event.venue.name}
        </div>
      ]}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span>{event.title}</span>
            <Tag color={getCategoryColor(event.category)} style={{ textTransform: 'capitalize' }}>
              {event.category}
            </Tag>
          </div>
        }
        description={
          <div>
            <p style={{ margin: 0, marginBottom: 8, lineHeight: '1.5' }}>
              {event.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '16px' }}>{event.price}</strong>
            </div>
          </div>
        }
      />
    </Card>
  );
};

// Native version using React Native components
const NativeEventCard = ({ event, onPress }: { event: Event; onPress: () => void }) => {
  if (Platform.OS === 'web') return null;
  
  const { View, Text, TouchableOpacity, StyleSheet } = require('react-native');
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.time}>{event.startTime}</Text>
      </View>
      <Text style={styles.description}>{event.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.venue}>📍 {event.venue.name}</Text>
        <Text style={styles.price}>{event.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 14,
    color: '#1890ff',
    fontWeight: '500' as const,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  venue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1890ff',
  },
};

export default function EventCard({ event, onPress }: { event: Event; onPress: () => void }) {
  return (
    <>
      <WebEventCard event={event} onPress={onPress} />
      <NativeEventCard event={event} onPress={onPress} />
    </>
  );
}