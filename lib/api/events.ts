import { Event } from '../types/event';
import { format } from 'date-fns';
import { kv } from '@vercel/kv';

// Switch to real KV now that it's configured
const USE_MOCK = false;

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
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Farmers Market',
      description: 'Fresh local produce, artisanal goods, and live music',
      date: format(startDate, 'yyyy-MM-dd'),
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
      title: 'Live Music: Jazz Night',
      description: 'Enjoy smooth jazz under the stars',
      date: format(startDate, 'yyyy-MM-dd'),
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
    {
      id: '3',
      title: 'Story Time for Kids',
      description: 'Interactive story time for children ages 3-7',
      date: format(startDate, 'yyyy-MM-dd'),
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
  ];

  return mockEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });
}