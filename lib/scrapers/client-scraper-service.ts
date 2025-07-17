import { TownshipScraper } from './township-scraper';
import { WoodlandsOnlineScraper } from './woodlands-online-scraper';
import { PavilionScraper } from './pavilion-scraper';
import { Event } from '../types/event';

// Simple in-memory storage for client-side use
class ClientStorage {
  private storage = new Map<string, any>();

  async set(key: string, value: any): Promise<void> {
    this.storage.set(key, value);
  }

  async get<T>(key: string): Promise<T | null> {
    return this.storage.get(key) || null;
  }

  keys(): string[] {
    return Array.from(this.storage.keys());
  }

  size(): number {
    return this.storage.size;
  }
}

export class ClientScraperService {
  private storage = new ClientStorage();
  private scrapers = [
    new TownshipScraper(),
    new WoodlandsOnlineScraper(),
    new PavilionScraper(),
  ];

  async scrapeAllSources(): Promise<{
    events: Event[];
    totalEvents: number;
    errors: string[];
    lastUpdated: Date;
  }> {
    const allEvents: Event[] = [];
    const allErrors: string[] = [];
    const lastUpdated = new Date();

    console.log('🔄 Starting client-side scraping...');

    // Run all scrapers in parallel for maximum speed
    const scrapePromises = this.scrapers.map(async (scraper) => {
      try {
        const result = await scraper.scrape();
        console.log(`✅ ${scraper.source}: ${result.events.length} events`);
        return { events: result.events, errors: result.errors };
      } catch (error) {
        const errorMsg = `Failed to scrape ${scraper.source}: ${error}`;
        console.error(errorMsg);
        return { events: [], errors: [errorMsg] };
      }
    });

    // Wait for all scrapers to complete
    const results = await Promise.all(scrapePromises);
    
    // Aggregate all results
    results.forEach(result => {
      allEvents.push(...result.events);
      allErrors.push(...result.errors);
    });

    // Remove duplicates
    const uniqueEvents = this.removeDuplicates(allEvents);

    // Store events by date for quick access
    await this.storeEventsByDate(uniqueEvents);

    console.log(`✅ Scraped ${uniqueEvents.length} unique events`);

    return {
      events: uniqueEvents,
      totalEvents: uniqueEvents.length,
      errors: allErrors,
      lastUpdated,
    };
  }

  async getEventsByDay(startDate: Date, endDate: Date): Promise<Event[]> {
    const events: Event[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dateKey = current.toISOString().split('T')[0];
      const dayEvents = await this.storage.get<Event[]>(`events:${dateKey}`) || [];
      events.push(...dayEvents);
      current.setDate(current.getDate() + 1);
    }
    
    return events.sort((a, b) => 
      new Date(a.date + ' ' + a.startTime).getTime() - 
      new Date(b.date + ' ' + b.startTime).getTime()
    );
  }

  private removeDuplicates(events: Event[]): Event[] {
    const uniqueEvents: Event[] = [];
    
    for (const event of events) {
      const isDuplicate = uniqueEvents.some(existing => 
        this.areEventsSimilar(event, existing)
      );
      
      if (!isDuplicate) {
        uniqueEvents.push(event);
      }
    }
    
    return uniqueEvents;
  }

  private areEventsSimilar(event1: Event, event2: Event): boolean {
    if (event1.date !== event2.date) return false;
    
    const titleSimilarity = this.calculateStringSimilarity(
      event1.title.toLowerCase(),
      event2.title.toLowerCase()
    );
    
    return titleSimilarity > 0.85;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private async storeEventsByDate(events: Event[]): Promise<void> {
    // Group events by date
    const eventsByDate: { [date: string]: Event[] } = {};
    
    events.forEach(event => {
      if (!eventsByDate[event.date]) {
        eventsByDate[event.date] = [];
      }
      eventsByDate[event.date].push(event);
    });

    // Store each date's events
    for (const [date, dateEvents] of Object.entries(eventsByDate)) {
      await this.storage.set(`events:${date}`, dateEvents);
    }
  }

  getStorageStats(): { totalKeys: number; sampleKeys: string[] } {
    const keys = this.storage.keys();
    return {
      totalKeys: this.storage.size(),
      sampleKeys: keys.slice(0, 5),
    };
  }
}

// Singleton instance
let clientScraperService: ClientScraperService | null = null;

export function getClientScraperService(): ClientScraperService {
  if (!clientScraperService) {
    clientScraperService = new ClientScraperService();
  }
  return clientScraperService;
}