import { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';
import { TownshipScraper } from '../../lib/scrapers/township-scraper';
import { WoodlandsOnlineScraper } from '../../lib/scrapers/woodlands-online-scraper';
import { PavilionScraper } from '../../lib/scrapers/pavilion-scraper';
import { Event } from '../../lib/types/event';

export const runtime = 'edge';

// Vercel Cron job to refresh events every hour
export default async function handler(req: NextRequest) {
  // Verify this is a valid cron request
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('🔄 Starting scheduled event refresh...');
  
  try {
    const scrapers = [
      new TownshipScraper(),
      new WoodlandsOnlineScraper(),
      new PavilionScraper(),
    ];

    const allEvents: Event[] = [];
    const allErrors: string[] = [];
    let totalEvents = 0;

    // Scrape from all sources
    for (const scraper of scrapers) {
      try {
        console.log(`📡 Scraping ${scraper.source}...`);
        const result = await scraper.scrape();
        
        allEvents.push(...result.events);
        allErrors.push(...result.errors);
        totalEvents += result.events.length;
        
        console.log(`✅ ${scraper.source}: ${result.events.length} events`);
      } catch (error) {
        const errorMsg = `Failed to scrape ${scraper.source}: ${error}`;
        console.error(errorMsg);
        allErrors.push(errorMsg);
      }
    }

    // Remove duplicates
    const uniqueEvents = removeDuplicates(allEvents);
    console.log(`🔧 Deduplicated: ${uniqueEvents.length} unique events from ${totalEvents} total`);

    // Store events by date in KV
    await storeEventsByDate(uniqueEvents);

    // Store metadata
    await kv.set('events:meta', {
      totalEvents: uniqueEvents.length,
      lastUpdated: new Date().toISOString(),
      sources: scrapers.map(s => s.source),
      errors: allErrors
    });

    console.log(`✅ Successfully updated ${uniqueEvents.length} events`);

    return Response.json({
      success: true,
      totalEvents: uniqueEvents.length,
      errors: allErrors,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Failed to refresh events:', error);
    
    return Response.json({
      success: false,
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function removeDuplicates(events: Event[]): Event[] {
  const uniqueEvents: Event[] = [];
  
  for (const event of events) {
    const isDuplicate = uniqueEvents.some(existing => 
      areEventsSimilar(event, existing)
    );
    
    if (!isDuplicate) {
      uniqueEvents.push(event);
    } else {
      console.log(`🔄 Removing duplicate: "${event.title}" on ${event.date} (${event.source})`);
    }
  }
  
  return uniqueEvents;
}

function areEventsSimilar(event1: Event, event2: Event): boolean {
  if (event1.date !== event2.date) return false;
  
  const titleSimilarity = calculateStringSimilarity(
    event1.title.toLowerCase(),
    event2.title.toLowerCase()
  );
  
  const venueSimilarity = calculateStringSimilarity(
    event1.venue.name.toLowerCase(),
    event2.venue.name.toLowerCase()
  );
  
  return (
    titleSimilarity > 0.85 ||
    (titleSimilarity > 0.60 && venueSimilarity > 0.80)
  );
}

function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
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

async function storeEventsByDate(events: Event[]): Promise<void> {
  // Group events by date
  const eventsByDate: { [date: string]: Event[] } = {};
  
  events.forEach(event => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  // Store each date's events
  const promises = [];
  for (const [date, dateEvents] of Object.entries(eventsByDate)) {
    promises.push(kv.set(`events:${date}`, dateEvents));
  }
  
  await Promise.all(promises);
  console.log(`💾 Stored events for ${Object.keys(eventsByDate).length} dates`);
}