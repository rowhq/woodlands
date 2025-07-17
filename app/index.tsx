import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Event } from '../lib/types/event';
import { getEventsByDay } from '../lib/api/events';
import { format, addDays, startOfDay } from 'date-fns';
import EventCard from '../lib/components/EventCard';
import WoodlandsTheme from '../lib/theme/woodlands-theme';

const TABS = ['Today', 'Tomorrow', 'This Week'];

export default function HomeScreen() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const groupEventsByDate = () => {
    const grouped: { [key: string]: Event[] } = {};
    events.forEach(event => {
      const dateKey = format(new Date(event.date), 'EEEE, MMM d');
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(event);
    });
    return grouped;
  };

  // Web version
  const WebLayout = () => {
    if (Platform.OS !== 'web') return null;
    
    const { Layout, Segmented, Typography, Spin } = require('antd');
    const { Content } = Layout;
    const { Title } = Typography;
    
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
            🌲 Woodlands Events
          </Title>
          
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <Segmented
              options={TABS}
              value={TABS[selectedTab]}
              onChange={(value: string) => setSelectedTab(TABS.indexOf(value))}
              size="large"
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
              <p style={{ marginTop: 16 }}>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>No events found</p>
            </div>
          ) : (
            Object.entries(groupEventsByDate()).map(([date, dateEvents]) => (
              <div key={date} style={{ marginBottom: 32 }}>
                <Title level={3} style={{ marginBottom: 16 }}>
                  {date}
                </Title>
                {dateEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onPress={() => handleEventPress(event.id)}
                  />
                ))}
              </div>
            ))
          )}
        </Content>
      </Layout>
    );
  };

  // Native version
  const NativeLayout = () => {
    if (Platform.OS === 'web') return null;
    
    const { TouchableOpacity } = require('react-native');
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Woodlands Events</Text>
          <View style={styles.tabContainer}>
            {TABS.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedTab === index && styles.activeTab]}
                onPress={() => setSelectedTab(index)}
              >
                <Text style={[styles.tabText, selectedTab === index && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <View style={styles.centered}>
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : events.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.noEventsText}>No events found</Text>
            </View>
          ) : (
            Object.entries(groupEventsByDate()).map(([date, dateEvents]) => (
              <View key={date} style={styles.dateSection}>
                <Text style={styles.dateHeader}>{date}</Text>
                {dateEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onPress={() => handleEventPress(event.id)}
                  />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      <WebLayout />
      <NativeLayout />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WoodlandsTheme.colors.background,
  },
  header: {
    backgroundColor: WoodlandsTheme.colors.surface,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: WoodlandsTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: WoodlandsTheme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: WoodlandsTheme.colors.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: WoodlandsTheme.colors.surfaceSecondary,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: WoodlandsTheme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: WoodlandsTheme.colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: WoodlandsTheme.colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: WoodlandsTheme.colors.primary,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  loadingText: {
    fontSize: 16,
    color: WoodlandsTheme.colors.textSecondary,
  },
  noEventsText: {
    fontSize: 16,
    color: WoodlandsTheme.colors.textSecondary,
  },
});