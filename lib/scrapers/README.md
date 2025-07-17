# Event Scraper Architecture

## Overview
The scraper system aggregates events from multiple sources into Vercel KV for the Woodlands Events app.

## Data Sources

### 1. Eventbrite API (Easiest)
- **URL**: https://www.eventbriteapi.com/v3/
- **Method**: REST API with OAuth
- **Data**: Structured JSON
- **Rate Limits**: 1000 requests/hour
- **Fields**: Title, date, time, venue, description, price, images

### 2. The Woodlands Township
- **URL**: https://www.thewoodlandstownship-tx.gov/calendar
- **Method**: RSS feed or web scraping
- **Data**: Semi-structured
- **Challenge**: Multiple event types (meetings, activities, classes)

### 3. Market Street
- **URL**: https://marketstreet-thewoodlands.com/events
- **Method**: Web scraping
- **Data**: HTML parsing required
- **Challenge**: Dynamic content loading

### 4. Cynthia Woods Mitchell Pavilion
- **URL**: https://www.woodlandscenter.org/events
- **Method**: Web scraping or Ticketmaster API
- **Data**: Concert/show listings
- **Challenge**: Ticket links, seating info

## Scraping Strategy

### Phase 1: Manual Testing
1. Use Playwright/Puppeteer to analyze each site
2. Identify selectors and data patterns
3. Handle dynamic content loading
4. Document rate limits and anti-scraping measures

### Phase 2: Implementation
```typescript
interface Scraper {
  source: EventSource;
  scrape(): Promise<Event[]>;
  validate(event: Partial<Event>): boolean;
}
```

### Phase 3: Scheduling
- Vercel Cron: Every 4 hours
- Stagger scrapers to avoid overload
- Store last scrape timestamp
- Implement retry logic

## Data Normalization

### Common Issues:
- Different date/time formats
- Venue name variations
- Duplicate events across sources
- Missing required fields

### Solutions:
```typescript
// Deduplication by fuzzy matching
- Title similarity (>80%)
- Same date
- Similar venue

// Venue normalization
- Map common variations
- Geocode addresses
- Store canonical names

// Date parsing
- Handle "Every Tuesday"
- Multi-day events
- Time zones (CST)
```

## Storage Schema

```typescript
// KV Keys:
"events:2024-01-18" → Event[] // Events by date
"event:{id}" → Event // Individual event
"venues:{normalized_name}" → Venue // Venue cache
"scrape:last:{source}" → timestamp // Last scrape time
```

## Error Handling

1. **Network Errors**: Exponential backoff
2. **Parse Errors**: Log and skip event
3. **Rate Limits**: Respect and queue
4. **Site Changes**: Alert monitoring

## Next Steps

1. Build Eventbrite integration first (cleanest API)
2. Create scraper testing tool
3. Implement deduplication logic
4. Add admin dashboard for monitoring