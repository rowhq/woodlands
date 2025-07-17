import { kv } from '@vercel/kv';
import { Event, EventSource } from '../types/event';
import { EventScraper, ScrapingResult } from './base-scraper';
import { TownshipScraper } from './township-scraper';
import { WoodlandsOnlineScraper } from './woodlands-online-scraper';
import { format } from 'date-fns';

export class ScraperService {
  private scrapers: EventScraper[] = [
    new TownshipScraper(),
    new WoodlandsOnlineScraper(),
  ];

  async scrapeAllSources(): Promise<{
    totalEvents: number;
    results: ScrapingResult[];
    errors: string[];
  }> {
    const results: ScrapingResult[] = [];
    const allErrors: string[] = [];
    let totalEvents = 0;

    console.log(`🚀 Starting scrape of ${this.scrapers.length} sources...`);

    for (const scraper of this.scrapers) {
      try {
        console.log(`📡 Scraping ${scraper.source}...`);
        const result = await scraper.scrape();
        
        results.push(result);
        totalEvents += result.events.length;
        
        if (result.errors.length > 0) {
          allErrors.push(...result.errors);
        }

        // Store events in KV
        await this.storeEvents(result.events);
        
        // Update last scrape time
        await this.updateLastScrapeTime(scraper.source);
        
        console.log(`✅ Completed ${scraper.source}: ${result.events.length} events, ${result.errors.length} errors`);
        
      } catch (error) {
        const errorMsg = `💥 Critical error in ${scraper.source}: ${error}`;
        console.error(errorMsg);
        allErrors.push(errorMsg);
        
        // Store error for monitoring
        await this.logScrapingError(scraper.source, error as Error);
      }
    }

    // Remove duplicates across all sources
    const deduplicatedEvents = await this.removeDuplicates(
      results.flatMap(r => r.events)
    );

    // Store deduplicated events
    await this.storeEventsByDate(deduplicatedEvents);

    console.log(`🏁 Scraping complete: ${deduplicatedEvents.length} unique events from ${totalEvents} total`);

    return {
      totalEvents: deduplicatedEvents.length,
      results,
      errors: allErrors,
    };
  }

  private async storeEvents(events: Event[]): Promise<void> {
    for (const event of events) {
      const key = `event:${event.source}:${event.id}`;
      await kv.set(key, event, { ex: 60 * 60 * 24 * 30 }); // 30 days TTL
    }
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
      const key = `events:${date}`;
      await kv.set(key, dateEvents, { ex: 60 * 60 * 24 * 30 }); // 30 days TTL
    }
  }

  private async removeDuplicates(events: Event[]): Promise<Event[]> {
    const uniqueEvents: Event[] = [];
    
    for (const event of events) {
      const isDuplicate = uniqueEvents.some(existing => 
        this.areEventsSimilar(event, existing)
      );
      
      if (!isDuplicate) {
        uniqueEvents.push(event);
      } else {
        console.log(`🔄 Removing duplicate: ${event.title} on ${event.date}`);
      }
    }
    
    return uniqueEvents;
  }

  private areEventsSimilar(event1: Event, event2: Event): boolean {
    // Check if events are on the same date
    if (event1.date !== event2.date) {
      return false;
    }

    // Calculate title similarity
    const titleSimilarity = this.calculateStringSimilarity(
      event1.title.toLowerCase(),
      event2.title.toLowerCase()
    );

    // Calculate venue similarity
    const venueSimilarity = this.calculateStringSimilarity(
      event1.venue.name.toLowerCase(),
      event2.venue.name.toLowerCase()
    );

    // Events are considered similar if:
    // - Titles are >85% similar OR
    // - Titles are >60% similar AND venues are >80% similar
    return (
      titleSimilarity > 0.85 ||
      (titleSimilarity > 0.60 && venueSimilarity > 0.80)
    );
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    // Simple Levenshtein distance-based similarity
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
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private async updateLastScrapeTime(source: EventSource): Promise<void> {
    const key = `scrape:last:${source}`;
    await kv.set(key, new Date().toISOString());
  }

  private async logScrapingError(source: EventSource, error: Error): Promise<void> {
    const key = `scrape:errors:${source}`;
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
    };
    
    // Get existing errors
    const existingErrors = await kv.get<any[]>(key) || [];
    
    // Keep only the last 10 errors
    const updatedErrors = [errorLog, ...existingErrors].slice(0, 10);
    
    await kv.set(key, updatedErrors, { ex: 60 * 60 * 24 * 7 }); // 7 days TTL
  }

  async getLastScrapeTime(source: EventSource): Promise<Date | null> {
    const key = `scrape:last:${source}`;
    const timestamp = await kv.get<string>(key);
    return timestamp ? new Date(timestamp) : null;
  }

  async getScrapingErrors(source: EventSource): Promise<any[]> {
    const key = `scrape:errors:${source}`;
    return await kv.get<any[]>(key) || [];
  }

  async getScrapingStats(): Promise<{
    sources: { source: EventSource; lastScrape: Date | null; errorCount: number }[];
    totalEvents: number;
  }> {
    const sources = await Promise.all(
      this.scrapers.map(async scraper => ({
        source: scraper.source,
        lastScrape: await this.getLastScrapeTime(scraper.source),
        errorCount: (await this.getScrapingErrors(scraper.source)).length,
      }))
    );

    // Count total events (rough estimate by checking a few recent dates)
    const today = new Date();
    let totalEvents = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const events = await kv.get<Event[]>(`events:${dateKey}`) || [];
      totalEvents += events.length;
    }

    return { sources, totalEvents };
  }
}