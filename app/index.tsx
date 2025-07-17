import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Event } from '../lib/types/event';
import { getEventsByDay, getCacheStats } from '../lib/api/events';
import { format, addDays, startOfDay, isToday, isTomorrow, parseISO } from 'date-fns';
import EventCard from '../lib/components/EventCard';
import WoodlandsTheme from '../lib/theme/woodlands-theme';

const TABS = [
  { key: 'today', label: 'Today', icon: '🌅', value: 0 },
  { key: 'tomorrow', label: 'Tomorrow', icon: '🌄', value: 1 },
  { key: 'week', label: 'This Week', icon: '📅', value: 2 }
];

export default function HomeScreen() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, [selectedTab]);

  const loadEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
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
      setError('Failed to load events. Please try again.');
    }
    
    setLoading(false);
    setRefreshing(false);
  }, [selectedTab]);

  const handleRefresh = useCallback(() => {
    loadEvents(true);
  }, [loadEvents]);

  const handleEventPress = useCallback((eventId: string) => {
    router.push(`/event/${eventId}`);
  }, [router]);

  const groupEventsByDate = useMemo(() => {
    const grouped: { [key: string]: Event[] } = {};
    events.forEach(event => {
      const eventDate = parseISO(event.date);
      let dateKey: string;
      
      if (isToday(eventDate)) {
        dateKey = '🌅 Today • ' + format(eventDate, 'EEEE, MMM d');
      } else if (isTomorrow(eventDate)) {
        dateKey = '🌄 Tomorrow • ' + format(eventDate, 'EEEE, MMM d');
      } else {
        dateKey = format(eventDate, 'EEEE, MMM d');
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  const eventStats = useMemo(() => {
    const stats = {
      total: events.length,
      byCategory: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      free: events.filter(e => e.price?.toLowerCase().includes('free')).length
    };
    
    events.forEach(event => {
      stats.byCategory[event.category] = (stats.byCategory[event.category] || 0) + 1;
      stats.bySource[event.source] = (stats.bySource[event.source] || 0) + 1;
    });
    
    return stats;
  }, [events]);

  // Web Layout Component
  const WebLayout = () => {
    if (Platform.OS !== 'web') return null;
    
    const { 
      Layout, 
      Segmented, 
      Typography, 
      Spin, 
      Alert, 
      Button, 
      Card, 
      Badge, 
      Statistic, 
      Row, 
      Col,
      Space,
      Divider,
      Empty,
      BackTop
    } = require('antd');
    
    const { Header, Content, Footer } = Layout;
    const { Title, Text, Paragraph } = Typography;
    
    const cacheStats = getCacheStats();
    
    return (
      <Layout style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)'
      }}>
        <Header style={{ 
          background: 'linear-gradient(135deg, #2B7F47 0%, #1e5a32 100%)',
          borderBottom: '3px solid #16A34A',
          boxShadow: '0 4px 20px rgba(43, 127, 71, 0.3)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          padding: '0 24px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            maxWidth: '1400px',
            margin: '0 auto',
            height: '64px'
          }}>
            <Space align="center" size="large">
              <Title level={1} style={{ 
                color: 'white', 
                margin: 0,
                fontSize: '32px',
                fontWeight: '800',
                letterSpacing: '-0.5px'
              }}>
                🌲 The Woodlands
              </Title>
              <Badge 
                count={eventStats.total} 
                style={{ backgroundColor: '#16A34A' }}
                overflowCount={999}
              />
            </Space>
            <div style={{ textAlign: 'right' }}>
              <Text style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '16px',
                display: 'block',
                fontWeight: '600'
              }}>
                Your community event hub
              </Text>
              <Text style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '12px'
              }}>
                {cacheStats.lastUpdated ? 
                  `Updated ${format(cacheStats.lastUpdated, 'h:mm a')}` : 
                  'Loading...'}
              </Text>
            </div>
          </div>
        </Header>
        
        <Content style={{ 
          padding: '40px 24px',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Quick Stats Dashboard */}
          <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={6}>
              <Card 
                size="small" 
                style={{ 
                  textAlign: 'center', 
                  borderRadius: '12px',
                  border: '2px solid #e8f5e8',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fdf9 100%)'
                }}
              >
                <Statistic 
                  title="Total Events" 
                  value={eventStats.total} 
                  prefix="🎉" 
                  valueStyle={{ color: '#2B7F47', fontSize: '24px', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card 
                size="small" 
                style={{ 
                  textAlign: 'center', 
                  borderRadius: '12px',
                  border: '2px solid #e8f5e8',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fdf9 100%)'
                }}
              >
                <Statistic 
                  title="Free Events" 
                  value={eventStats.free} 
                  prefix="💚" 
                  valueStyle={{ color: '#16A34A', fontSize: '24px', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card 
                size="small" 
                style={{ 
                  textAlign: 'center', 
                  borderRadius: '12px',
                  border: '2px solid #e8f5e8',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fdf9 100%)'
                }}
              >
                <Statistic 
                  title="Sources" 
                  value={Object.keys(eventStats.bySource).length} 
                  prefix="📊" 
                  valueStyle={{ color: '#059669', fontSize: '24px', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card 
                size="small" 
                style={{ 
                  textAlign: 'center', 
                  borderRadius: '12px',
                  border: '2px solid #e8f5e8',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fdf9 100%)'
                }}
              >
                <Statistic 
                  title="Categories" 
                  value={Object.keys(eventStats.byCategory).length} 
                  prefix="🏷️" 
                  valueStyle={{ color: '#0d9488', fontSize: '24px', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
          </Row>
          
          {/* Navigation Tabs */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <Segmented
              options={TABS.map((tab) => ({
                label: (
                  <div style={{ 
                    padding: '12px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    minWidth: '120px',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '20px' }}>{tab.icon}</span>
                    <span style={{ fontSize: '16px', fontWeight: '600' }}>{tab.label}</span>
                  </div>
                ),
                value: tab.value
              }))}
              value={selectedTab}
              onChange={setSelectedTab}
              size="large"
              style={{
                backgroundColor: 'white',
                border: '3px solid #2B7F47',
                borderRadius: '16px',
                padding: '6px',
                boxShadow: '0 6px 20px rgba(43, 127, 71, 0.15)'
              }}
            />
          </div>
          
          {/* Error State */}
          {error && (
            <Alert
              message="Unable to load events"
              description={error}
              type="error"
              action={
                <Button size="small" danger onClick={() => loadEvents()}>
                  Retry
                </Button>
              }
              style={{ 
                marginBottom: '24px', 
                borderRadius: '12px',
                border: '2px solid #fecaca'
              }}
              showIcon
            />
          )}
          
          {/* Loading State */}
          {loading && (
            <Card style={{ 
              textAlign: 'center', 
              padding: '60px 40px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f9fdf9 100%)',
              border: '2px solid #e8f5e8',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
            }}>
              <Spin size="large" style={{ color: '#2B7F47' }} />
              <Title level={3} style={{ 
                marginTop: '24px', 
                color: '#2B7F47',
                fontWeight: '600'
              }}>
                Loading amazing events...
              </Title>
              <Paragraph style={{ color: '#666', fontSize: '16px', margin: 0 }}>
                Gathering the best events from across The Woodlands
              </Paragraph>
            </Card>
          )}
          
          {/* Events Display */}
          {!loading && events.length > 0 && (
            <div>
              {Object.entries(groupEventsByDate).map(([date, dateEvents]) => (
                <div key={date} style={{ marginBottom: '48px' }}>
                  <Card
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '3px solid #e8f5e8',
                      boxShadow: '0 12px 40px rgba(43, 127, 71, 0.1)'
                    }}
                  >
                    <div style={{
                      background: 'linear-gradient(135deg, #2B7F47, #16A34A)',
                      padding: '20px 28px',
                      margin: '-24px -24px 24px -24px'
                    }}>
                      <Title level={2} style={{ 
                        color: 'white',
                        margin: 0,
                        fontSize: '28px',
                        fontWeight: '700',
                        letterSpacing: '-0.3px'
                      }}>
                        {date}
                      </Title>
                      <Text style={{ 
                        color: 'rgba(255,255,255,0.9)', 
                        fontSize: '16px',
                        fontWeight: '500'
                      }}>
                        {dateEvents.length} event{dateEvents.length !== 1 ? 's' : ''}
                      </Text>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
                      gap: '24px'
                    }}>
                      {dateEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => handleEventPress(event.id)}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'translateY(0)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.filter = 'drop-shadow(0 16px 40px rgba(43, 127, 71, 0.2))';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.filter = 'none';
                          }}
                        >
                          <EventCard event={event} />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!loading && events.length === 0 && (
            <Card style={{ 
              textAlign: 'center', 
              padding: '80px 40px',
              borderRadius: '20px',
              border: '3px dashed #d1d5db',
              background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)'
            }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{ height: 60 }}
                description={
                  <div>
                    <Title level={3} style={{ color: '#6b7280', marginBottom: '8px' }}>
                      No events found
                    </Title>
                    <Paragraph style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '24px' }}>
                      No events scheduled for the selected time period.
                    </Paragraph>
                  </div>
                }
              >
                <Button 
                  type="primary" 
                  size="large"
                  onClick={handleRefresh}
                  style={{
                    backgroundColor: '#2B7F47',
                    borderColor: '#2B7F47',
                    borderRadius: '12px',
                    fontWeight: '600',
                    height: '48px',
                    padding: '0 32px'
                  }}
                >
                  🔄 Refresh Events
                </Button>
              </Empty>
            </Card>
          )}
        </Content>
        
        <Footer style={{ 
          textAlign: 'center',
          background: 'transparent',
          padding: '24px 0'
        }}>
          <Text style={{ color: '#6b7280' }}>
            The Woodlands Events • Made with 💚 for our community
          </Text>
        </Footer>
        
        <BackTop 
          style={{
            right: 24,
            bottom: 24
          }}
        />
      </Layout>
    );
  };

  // Native Layout Component (simplified)
  const NativeLayout = () => {
    if (Platform.OS === 'web') return null;
    
    // For now, just show a simple message for native
    const { View, Text } = require('react-native');
    
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f0f9f0',
        padding: 40
      }}>
        <Text style={{ 
          fontSize: 32, 
          fontWeight: '800',
          color: '#2B7F47',
          marginBottom: 16,
          textAlign: 'center'
        }}>
          🌲 The Woodlands
        </Text>
        <Text style={{ 
          fontSize: 18, 
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: 24
        }}>
          Your community event hub
        </Text>
        <Text style={{ 
          fontSize: 16, 
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          Native mobile app coming soon!{'\n'}For now, please use the web version.
        </Text>
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