import { NextRequest, NextResponse } from 'next/server';
import { ScraperService } from '../../../lib/scrapers/scraper-service';

// Manual trigger for testing scrapers
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Manual scraping triggered...');
    
    const scraperService = new ScraperService();
    const result = await scraperService.scrapeAllSources();
    
    console.log(`✅ Manual scraping completed: ${result.totalEvents} events`);
    
    return NextResponse.json({
      success: true,
      message: 'Scraping completed successfully',
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
    console.error('💥 Error in manual scraping:', error);
    
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

// Get scraping stats
export async function GET() {
  try {
    const scraperService = new ScraperService();
    const stats = await scraperService.getScrapingStats();
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('💥 Error getting scraping stats:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}