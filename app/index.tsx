import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { List, WhiteSpace, WingBlank, SegmentedControl } from '@ant-design/react-native';
import { Link } from 'expo-router';
import { Event } from '../lib/types/event';
import { getEventsByDay } from '../lib/api/events';
import { format, addDays, startOfDay } from 'date-fns';

const TABS = ['Today', 'Tomorrow', 'This Week'];

export default function HomeScreen() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [selectedTab]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      let startDate = startOfDay(new Date());
      let endDate = startDate;

      if (selectedTab === 1) {
        startDate = addDays(startDate, 1);
        endDate = startDate;
      } else if (selectedTab === 2) {
        endDate = addDays(startDate, 7);
      }

      const eventsData = await getEventsByDay(startDate, endDate);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    }
    setLoading(false);
  };

  const renderEvent = (event: Event) => (
    <Link href={`/event/${event.id}`} key={event.id} asChild>
      <TouchableOpacity>
        <List.Item
          thumb={event.imageUrl}
          extra={event.startTime}
        >
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventVenue}>📍 {event.venue.name}</Text>
        </List.Item>
      </TouchableOpacity>
    </Link>
  );

  const groupEventsByDate = () => {
    const grouped: { [key: string]: Event[] } = {};
    events.forEach(event => {
      const dateKey = format(new Date(event.date), 'EEEE, MMM d');
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(event);
    });
    return grouped;
  };

  return (
    <View style={styles.container}>
      <WingBlank>
        <WhiteSpace />
        <SegmentedControl
          values={TABS}
          selectedIndex={selectedTab}
          onChange={(e) => setSelectedTab(e.nativeEvent.selectedSegmentIndex)}
        />
        <WhiteSpace />
      </WingBlank>

      <ScrollView style={styles.scrollView}>
        {loading ? (
          <WingBlank>
            <Text style={styles.loadingText}>Loading events...</Text>
          </WingBlank>
        ) : events.length === 0 ? (
          <WingBlank>
            <Text style={styles.noEventsText}>No events found</Text>
          </WingBlank>
        ) : (
          Object.entries(groupEventsByDate()).map(([date, dateEvents]) => (
            <View key={date}>
              <WingBlank>
                <Text style={styles.dateHeader}>{date}</Text>
              </WingBlank>
              <List>
                {dateEvents.map(renderEvent)}
              </List>
              <WhiteSpace />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  eventVenue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});