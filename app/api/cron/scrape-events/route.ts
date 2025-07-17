import { NextRequest, NextResponse } from 'next/server';
import { ScraperService } from '../../../../lib/scrapers/scraper-service';

// This API route will be called by Vercel Cron Jobs
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (optional but recommended)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting scheduled event scraping...');
    
    const scraperService = new ScraperService();
    const result = await scraperService.scrapeAllSources();
    
    console.log(`✅ Scraping completed: ${result.totalEvents} events, ${result.errors.length} errors`);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalEvents: result.totalEvents,
      sources: result.results.map(r => ({
        source: r.source,
        events: r.events.length,
        errors: r.errors.length,
        scrapedAt: r.scrapedAt,
      })),
      errors: result.errors,
    });
    
  } catch (error) {
    console.error('💥 Error in scrape-events cron job:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Also allow manual triggering via POST for testing
export async function POST(request: NextRequest) {
  return GET(request);
}