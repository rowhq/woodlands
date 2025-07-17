import { Event, EventSource } from '../types/event';

export interface RawEvent {
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  venue: {
    name: string;
    address: string;
  };
  price?: string;
  url: string;
  imageUrl?: string;
}

export interface ScrapingResult {
  events: Event[];
  errors: string[];
  scrapedAt: Date;
  source: EventSource;
}

export abstract class EventScraper {
  abstract readonly source: EventSource;
  abstract readonly baseUrl: string;
  
  protected maxRetries = 2; // Reduced for faster execution
  protected retryDelay = 500; // Reduced to 500ms

  async scrape(): Promise<ScrapingResult> {
    const startTime = new Date();
    const errors: string[] = [];
    let events: Event[] = [];

    try {
      console.log(`🔍 Starting scrape for ${this.source}...`);
      
      const rawEvents = await this.fetchRawEvents();
      console.log(`📊 Found ${rawEvents.length} raw events from ${this.source}`);
      
      for (const rawEvent of rawEvents) {
        try {
          if (this.validate(rawEvent)) {
            const normalizedEvent = this.normalize(rawEvent);
            events.push(normalizedEvent);
          } else {
            errors.push(`Invalid event: ${rawEvent.title}`);
          }
        } catch (error) {
          const errorMsg = `Failed to process event "${rawEvent.title}": ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      console.log(`✅ Successfully processed ${events.length} events from ${this.source}`);
      
    } catch (error) {
      const errorMsg = `Critical error scraping ${this.source}: ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    return {
      events,
      errors,
      scrapedAt: startTime,
      source: this.source
    };
  }

  protected abstract fetchRawEvents(): Promise<RawEvent[]>;

  protected validate(event: RawEvent): boolean {
    if (!event.title || event.title.trim().length < 3) {
      return false;
    }
    
    if (!event.date) {
      return false;
    }
    
    if (!event.venue?.name) {
      return false;
    }

    // Check if event is in the future (or today)
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return eventDate >= today;
  }

  protected normalize(rawEvent: RawEvent): Event {
    return {
      id: this.generateEventId(rawEvent),
      title: this.cleanTitle(rawEvent.title),
      description: this.cleanDescription(rawEvent.description),
      date: this.parseDate(rawEvent.date),
      startTime: this.parseTime(rawEvent.startTime || ''),
      endTime: this.parseTime(rawEvent.endTime || ''),
      venue: {
        name: this.cleanVenueName(rawEvent.venue.name),
        address: this.cleanAddress(rawEvent.venue.address),
      },
      category: this.categorizeEvent(rawEvent.title, rawEvent.description),
      price: this.normalizePrice(rawEvent.price),
      imageUrl: rawEvent.imageUrl,
      source: this.source,
      sourceUrl: rawEvent.url,
    };
  }

  protected generateEventId(rawEvent: RawEvent): string {
    const titleSlug = rawEvent.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const dateSlug = rawEvent.date.replace(/[^0-9]/g, '');
    
    return `${this.source}-${dateSlug}-${titleSlug}`;
  }

  protected cleanTitle(title: string): string {
    return title
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-\.'&]/g, '');
  }

  protected cleanDescription(description: string): string {
    return description
      .trim()
      .replace(/\s+/g, ' ')
      .substring(0, 500); // Limit description length
  }

  protected parseDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }

  protected parseTime(timeStr: string): string {
    if (!timeStr) return '';
    
    // Common time formats: "2:00 PM", "14:00", "2 PM", etc.
    const timeRegex = /(\d{1,2}):?(\d{0,2})\s*(AM|PM)?/i;
    const match = timeStr.match(timeRegex);
    
    if (!match) return timeStr.trim();
    
    let hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const ampm = match[3]?.toUpperCase();
    
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  protected cleanVenueName(name: string): string {
    return name
      .trim()
      .replace(/\s+/g, ' ');
  }

  protected cleanAddress(address: string): string {
    return address
      .trim()
      .replace(/\s+/g, ' ');
  }

  protected categorizeEvent(title: string, description: string): Event['category'] {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('music') || text.includes('concert') || text.includes('band')) {
      return 'music';
    }
    if (text.includes('food') || text.includes('restaurant') || text.includes('dining')) {
      return 'food';
    }
    if (text.includes('family') || text.includes('kids') || text.includes('children')) {
      return 'family';
    }
    if (text.includes('business') || text.includes('networking') || text.includes('professional')) {
      return 'business';
    }
    if (text.includes('art') || text.includes('gallery') || text.includes('exhibition')) {
      return 'arts';
    }
    if (text.includes('sport') || text.includes('fitness') || text.includes('game')) {
      return 'sports';
    }
    
    return 'community';
  }

  protected normalizePrice(price?: string): string {
    if (!price) return 'Free';
    
    const cleanPrice = price.trim().toLowerCase();
    
    if (cleanPrice.includes('free') || cleanPrice === '0' || cleanPrice === '$0') {
      return 'Free';
    }
    
    return price.trim();
  }

  protected async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected async retryOperation<T>(
    operation: () => Promise<T>, 
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt); // Exponential backoff
          console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }
    
    throw lastError!;
  }
}