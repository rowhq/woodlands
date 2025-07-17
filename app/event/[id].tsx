import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card, WhiteSpace, WingBlank, Button, List } from '@ant-design/react-native';
import { Event } from '../../lib/types/event';
import { getEventById } from '../../lib/api/events';
import { format } from 'date-fns';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const eventData = await getEventById(id);
      setEvent(eventData);
    } catch (error) {
      console.error('Error loading event:', error);
    }
    setLoading(false);
  };

  const handleOpenMap = () => {
    if (!event) return;
    
    const address = encodeURIComponent(event.venue.address);
    const url = Platform.select({
      ios: `maps://app?address=${address}`,
      android: `geo:0,0?q=${address}`,
      default: `https://maps.google.com/?q=${address}`,
    });
    
    Linking.openURL(url);
  };

  const handleShare = () => {
    // In a real app, implement sharing functionality
    console.log('Share event:', event?.title);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <WingBlank>
          <Text style={styles.loadingText}>Loading event...</Text>
        </WingBlank>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <WingBlank>
          <Text style={styles.errorText}>Event not found</Text>
        </WingBlank>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <WingBlank>
        <WhiteSpace />
        
        <Card>
          <Card.Header
            title={event.title}
            extra={event.price || 'Free'}
          />
          <Card.Body>
            <Text style={styles.description}>{event.description}</Text>
          </Card.Body>
        </Card>

        <WhiteSpace />

        <List>
          <List.Item extra={format(new Date(event.date), 'EEEE, MMMM d, yyyy')}>
            Date
          </List.Item>
          <List.Item extra={`${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}`}>
            Time
          </List.Item>
          <List.Item 
            extra={event.venue.name}
            arrow="horizontal"
            onPress={handleOpenMap}
          >
            Venue
          </List.Item>
          <List.Item extra={event.category}>
            Category
          </List.Item>
        </List>

        <WhiteSpace size="lg" />

        <Button type="primary" onPress={handleOpenMap}>
          Get Directions
        </Button>
        
        <WhiteSpace />
        
        <Button onPress={() => Linking.openURL(event.sourceUrl)}>
          View on {event.source}
        </Button>

        <WhiteSpace size="lg" />
      </WingBlank>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#ff0000',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});