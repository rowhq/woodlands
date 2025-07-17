import { EventScraper, RawEvent } from './base-scraper';
import { EventSource } from '../types/event';

export class TownshipScraper extends EventScraper {
  readonly source: EventSource = 'township';
  readonly baseUrl = 'https://www.thewoodlandstownship-tx.gov';

  protected async fetchRawEvents(): Promise<RawEvent[]> {
    // For development, return sample events including today's events
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 5);
    
    const sampleEvents: RawEvent[] = [
      // TODAY'S EVENTS
      {
        title: 'Senior Services Information Session',
        description: 'Learn about available services for seniors in The Woodlands community including health resources, transportation, and social programs.',
        date: today.toISOString().split('T')[0],
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        venue: {
          name: 'The Woodlands Township Office',
          address: '2801 Technology Forest Blvd, The Woodlands, TX 77381',
        },
        price: 'Free',
        url: `${this.baseUrl}/senior-services`,
      },
      {
        title: 'Community Garden Workshop',
        description: 'Hands-on workshop about sustainable gardening practices and maintaining community green spaces.',
        date: today.toISOString().split('T')[0],
        startTime: '2:00 PM',
        endTime: '4:00 PM',
        venue: {
          name: 'Town Green Park',
          address: '2099 Lake Robbins Dr, The Woodlands, TX 77380',
        },
        price: 'Free',
        url: `${this.baseUrl}/community-garden`,
      },
      // TOMORROW'S EVENTS
      {
        title: 'Township Board of Directors Meeting',
        description: 'Regular monthly meeting of The Woodlands Township Board of Directors. Open to the public.',
        date: tomorrow.toISOString().split('T')[0],
        startTime: '6:00 PM',
        endTime: '8:00 PM',
        venue: {
          name: 'The Woodlands Township Office',
          address: '2801 Technology Forest Blvd, The Woodlands, TX 77381',
        },
        price: 'Free',
        url: `${this.baseUrl}/meetings`,
      },
      {
        title: 'Parks and Recreation Committee Meeting',
        description: 'Monthly committee meeting to discuss parks, recreation facilities, and programming.',
        date: dayAfter.toISOString().split('T')[0],
        startTime: '9:00 AM',
        endTime: '11:00 AM',
        venue: {
          name: 'The Woodlands Township Office',
          address: '2801 Technology Forest Blvd, The Woodlands, TX 77381',
        },
        price: 'Free',
        url: `${this.baseUrl}/committees/parks-recreation`,
      },
      {
        title: 'Community Emergency Response Team (CERT) Training',
        description: 'Free training program for residents to learn emergency response skills and disaster preparedness.',
        date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '9:00 AM',
        endTime: '4:00 PM',
        venue: {
          name: 'The Woodlands Fire Station 1',
          address: '9951 Grogan\'s Mill Rd, The Woodlands, TX 77380',
        },
        price: 'Free',
        url: `${this.baseUrl}/emergency-services/cert`,
      },
      {
        title: 'Household Hazardous Waste Collection',
        description: 'Monthly collection event for residents to safely dispose of household hazardous materials.',
        date: nextWeek.toISOString().split('T')[0],
        startTime: '8:00 AM',
        endTime: '2:00 PM',
        venue: {
          name: 'The Woodlands Township Warehouse',
          address: '1210 Lake Robbins Dr, The Woodlands, TX 77380',
        },
        price: 'Free',
        url: `${this.baseUrl}/environmental/hazardous-waste`,
      },
    ];

    return sampleEvents;
  }
}