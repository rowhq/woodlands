import { Event } from '../types/event';
import { format } from 'date-fns';
import { kv } from '@vercel/kv';

// Switch between real scraped data and mock data
const USE_MOCK = false; // Set to true for testing, false for real data

export async function getEventsByDay(startDate: Date, endDate: Date): Promise<Event[]> {
  if (USE_MOCK) {
    return getMockEvents(startDate, endDate);
  }

  try {
    const events: Event[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dateKey = format(current, 'yyyy-MM-dd');
      const dayEvents = await kv.get<Event[]>(`events:${dateKey}`);
      if (dayEvents) {
        events.push(...dayEvents);
      }
      current.setDate(current.getDate() + 1);
    }
    
    return events.sort((a, b) => 
      new Date(a.date + ' ' + a.startTime).getTime() - 
      new Date(b.date + ' ' + b.startTime).getTime()
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return getMockEvents(startDate, endDate);
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  if (USE_MOCK) {
    return getMockEvents(new Date(), new Date()).find(e => e.id === id) || null;
  }

  try {
    return await kv.get<Event>(`event:${id}`);
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

// Mock data for development
function getMockEvents(startDate: Date, endDate: Date): Event[] {
  const today = format(startDate, 'yyyy-MM-dd');
  const tomorrow = format(new Date(startDate.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  
  const mockEvents: Event[] = [
    // Today's events
    {
      id: '1',
      title: 'Farmers Market',
      description: 'Fresh local produce, artisanal goods, and live music. Over 50 vendors featuring organic vegetables, handmade crafts, and delicious food trucks.',
      date: today,
      startTime: '9:00 AM',
      endTime: '1:00 PM',
      venue: {
        name: 'Market Street',
        address: '9595 Six Pines Dr, The Woodlands, TX 77380',
      },
      category: 'community',
      price: 'Free',
      source: 'marketstreet',
      sourceUrl: 'https://marketstreet-thewoodlands.com',
    },
    {
      id: '2',
      title: 'Coffee & Conversation',
      description: 'Weekly coffee meetup for professionals and entrepreneurs',
      date: today,
      startTime: '8:00 AM',
      endTime: '9:30 AM',
      venue: {
        name: 'Starbucks Market Street',
        address: '9595 Six Pines Dr, The Woodlands, TX 77380',
      },
      category: 'business',
      price: 'Free',
      source: 'meetup',
      sourceUrl: 'https://meetup.com',
    },
    {
      id: '3',
      title: 'Story Time for Kids',
      description: 'Interactive story time for children ages 3-7 featuring this week\'s theme: Ocean Adventures!',
      date: today,
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      venue: {
        name: 'South Regional Library',
        address: '2101 Lake Robbins Dr, The Woodlands, TX 77380',
      },
      category: 'family',
      price: 'Free',
      source: 'township',
      sourceUrl: 'https://thewoodlandstownship-tx.gov',
    },
    {
      id: '4',
      title: 'Live Music: Jazz Night',
      description: 'Enjoy smooth jazz under the stars with the David Miller Quartet',
      date: today,
      startTime: '7:30 PM',
      endTime: '10:00 PM',
      venue: {
        name: 'Cynthia Woods Mitchell Pavilion',
        address: '2005 Lake Robbins Dr, The Woodlands, TX 77380',
      },
      category: 'music',
      price: '$25-$75',
      source: 'pavilion',
      sourceUrl: 'https://woodlandscenter.org',
    },
    
    // Tomorrow's events
    {
      id: '5',
      title: 'Morning Yoga in the Park',
      description: 'Start your day with a peaceful yoga session in beautiful Riva Row Park',
      date: tomorrow,
      startTime: '7:00 AM',
      endTime: '8:00 AM',
      venue: {
        name: 'Riva Row Boat House',
        address: '2101 Riva Row, The Woodlands, TX 77380',
      },
      category: 'community',
      price: '$15',
      source: 'eventbrite',
      sourceUrl: 'https://eventbrite.com',
    },
    {
      id: '6',
      title: 'Food Truck Friday',
      description: 'Delicious food trucks gather every Friday with live music and family fun',
      date: tomorrow,
      startTime: '5:00 PM',
      endTime: '9:00 PM',
      venue: {
        name: 'Town Green Park',
        address: '2099 Lake Robbins Dr, The Woodlands, TX 77380',
      },
      category: 'food',
      price: 'Free Entry',
      source: 'township',
      sourceUrl: 'https://thewoodlandstownship-tx.gov',
    },
    {
      id: '7',
      title: 'Wine Tasting Event',
      description: 'Sample fine wines from local Texas vineyards with expert sommelier guidance',
      date: tomorrow,
      startTime: '6:30 PM',
      endTime: '8:30 PM',
      venue: {
        name: 'Market Street Wine Bar',
        address: '9595 Six Pines Dr, The Woodlands, TX 77380',
      },
      category: 'food',
      price: '$35',
      source: 'marketstreet',
      sourceUrl: 'https://marketstreet-thewoodlands.com',
    },
  ];

  return mockEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });
}