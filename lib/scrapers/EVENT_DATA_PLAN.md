# Woodlands Events Data Aggregation Plan

## Research Summary

After researching available data sources, here's what I found:

### ❌ **Challenging Sources:**
- **Eventbrite API**: Public search API was deprecated in 2019
- **Township Official Calendar**: No RSS/API found, uses complex server-side rendering

### ✅ **Viable Sources for MVP:**

## **Source 1: The Woodlands Township (Web Scraping)**
- **URL**: `https://www.thewoodlandstownship-tx.gov/Events-directory`
- **Method**: Web scraping with Playwright/Puppeteer
- **Data Quality**: High (official source)
- **Event Types**: Township meetings, community events, festivals
- **Update Frequency**: Daily
- **Challenges**: Dynamic content, anti-scraping measures

## **Source 2: Woodlands Online Events**
- **URL**: `https://www.woodlandsonline.com/evps/`
- **Method**: Web scraping + potential RSS
- **Data Quality**: Good (community source)
- **Event Types**: Local businesses, community events
- **Update Frequency**: Daily
- **Challenges**: HTML parsing required

## Architecture Design

### **1. Data Collection Layer**
```typescript
interface EventScraper {
  source: EventSource;
  scrape(): Promise<RawEvent[]>;
  validate(event: RawEvent): boolean;
  transform(event: RawEvent): Event;
}
```

### **2. Processing Pipeline**
```
Raw Events → Validation → Normalization → Deduplication → Storage
```

### **3. Storage Strategy**
```typescript
// Vercel KV Keys:
"events:{YYYY-MM-DD}"     → Event[]     // Events by date
"event:{source}:{id}"     → Event       // Individual events  
"scrape:last:{source}"    → timestamp   // Last scrape time
"scrape:errors:{source}"  → Error[]     // Error tracking
```

### **4. Deduplication Logic**
```typescript
function isDuplicate(event1: Event, event2: Event): boolean {
  return (
    similarity(event1.title, event2.title) > 0.85 &&
    isSameDay(event1.date, event2.date) &&
    similarity(event1.venue.name, event2.venue.name) > 0.8
  );
}
```

## Implementation Plan

### **Phase 1: Township Scraper (Week 1)**
1. Set up Playwright for dynamic content
2. Create Township event scraper
3. Implement data normalization
4. Add error handling and retries

### **Phase 2: Woodlands Online Scraper (Week 2)**  
1. Analyze HTML structure
2. Create secondary scraper
3. Implement deduplication
4. Add data validation

### **Phase 3: Automation (Week 3)**
1. Vercel Cron Jobs (every 4 hours)
2. Error monitoring and alerts
3. Data quality metrics
4. Admin dashboard for monitoring

## Technical Implementation

### **1. Scraper Base Class**
```typescript
abstract class EventScraper {
  abstract source: EventSource;
  abstract scrapeUrl: string;
  
  async scrape(): Promise<Event[]> {
    try {
      const rawEvents = await this.fetchRawEvents();
      const validEvents = rawEvents.filter(this.validate);
      const normalizedEvents = validEvents.map(this.normalize);
      return this.deduplicate(normalizedEvents);
    } catch (error) {
      await this.logError(error);
      throw error;
    }
  }
  
  protected abstract fetchRawEvents(): Promise<RawEvent[]>;
  protected abstract normalize(raw: RawEvent): Event;
}
```

### **2. Vercel Cron Job**
```typescript
// app/api/cron/scrape-events/route.ts
export async function GET() {
  const scrapers = [
    new TownshipScraper(),
    new WoodlandsOnlineScraper()
  ];
  
  for (const scraper of scrapers) {
    try {
      const events = await scraper.scrape();
      await storeEvents(events);
      await updateLastScrapeTime(scraper.source);
    } catch (error) {
      await logScrapingError(scraper.source, error);
    }
  }
  
  return Response.json({ success: true });
}
```

### **3. Data Normalization**
```typescript
function normalizeEvent(raw: RawEvent, source: EventSource): Event {
  return {
    id: generateEventId(raw, source),
    title: cleanTitle(raw.title),
    description: cleanDescription(raw.description),
    date: parseDate(raw.date),
    startTime: parseTime(raw.startTime),
    endTime: parseTime(raw.endTime),
    venue: normalizeVenue(raw.venue),
    category: categorizeEvent(raw.title, raw.description),
    price: normalizePrice(raw.price),
    source,
    sourceUrl: raw.url,
    lastUpdated: new Date().toISOString()
  };
}
```

## Future Data Sources (Phase 4+)

### **Potential Additional Sources:**
1. **Facebook Events** (via Graph API - requires app review)
2. **Market Street Events** (web scraping)
3. **Local Business Websites** (individual scrapers)
4. **Community Groups** (Meetup, Nextdoor)
5. **Manual Event Submission** (admin interface)

## Monitoring & Quality

### **Data Quality Metrics:**
- Events scraped per source
- Duplicate detection rate  
- Scraping error rate
- Data freshness (time since last update)

### **Error Handling:**
- Retry logic with exponential backoff
- Circuit breaker for failing sources
- Slack/email alerts for critical failures
- Graceful degradation (use cached data)

## Compliance & Ethics

### **Web Scraping Best Practices:**
- Respect robots.txt
- Reasonable request intervals (1-2 seconds between requests)
- User-Agent identification
- Monitor for rate limiting
- Cache responses to minimize requests

### **Data Handling:**
- Only scrape publicly available event information
- No personal data collection
- Clear attribution to original sources
- Regular data cleanup (remove old events)

## Success Metrics

### **MVP Goals (First Month):**
- 50+ events per day aggregated
- <5% duplicate rate
- 99% uptime for scraping jobs
- <10 minutes from source update to app

### **Long-term Goals:**
- 200+ events per day
- 5+ data sources
- Real-time event updates
- Community event submission portal

This plan prioritizes reliable, legal data collection while building a scalable foundation for future expansion.