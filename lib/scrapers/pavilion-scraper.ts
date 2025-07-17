import { EventScraper } from './base-scraper';
import { Event, EventSource } from '../types/event';

export class PavilionScraper extends EventScraper {
  readonly source: EventSource = 'pavilion';
  readonly baseUrl = 'https://www.woodlandscenter.org';

  protected async fetchRawEvents(): Promise<any[]> {
    // In a production environment, this would scrape the actual website
    // For now, returning sample data based on the real concerts found
    const currentYear = new Date().getFullYear();
    const today = new Date();
    
    return [
      // TODAY'S EVENTS
      {
        title: "Open Mic Night",
        description: "Weekly open mic night featuring local musicians, poets, and performers. Come share your talent or enjoy the show!",
        date: today.toISOString().split('T')[0],
        startTime: "7:00 PM",
        endTime: "10:00 PM",
        venue: {
          name: "The Cynthia Woods Mitchell Pavilion",
          address: "2005 Lake Robbins Dr, The Woodlands, TX 77380",
        },
        price: "$10",
        url: `${this.baseUrl}/events/open-mic`,
        imageUrl: "https://example.com/open-mic.jpg",
      },
      {
        title: "I Want My 80's Tour: Rick Springfield, Wang Chung & Paul Young",
        description: "A nostalgic journey through the greatest hits of the 1980s featuring three legendary acts.",
        date: "2025-07-18",
        startTime: "7:00 PM",
        endTime: "12:00 AM",
        venue: {
          name: "The Cynthia Woods Mitchell Pavilion",
          address: "2005 Lake Robbins Dr, The Woodlands, TX 77380",
        },
        price: "$45-$125",
        url: `${this.baseUrl}/events/80s-tour`,
        imageUrl: "https://example.com/80s-tour.jpg",
      },
      {
        title: "Kansas with 38 Special and Dave Mason",
        description: "Classic rock legends Kansas headline with special guests 38 Special and Dave Mason.",
        date: "2025-07-19",
        startTime: "6:15 PM",
        endTime: "12:00 AM",
        venue: {
          name: "The Cynthia Woods Mitchell Pavilion",
          address: "2005 Lake Robbins Dr, The Woodlands, TX 77380",
        },
        price: "$55-$150",
        url: `${this.baseUrl}/events/kansas-concert`,
        imageUrl: "https://example.com/kansas.jpg",
      },
      {
        title: "The Music of Led Zeppelin - 2025 Performing Arts Season",
        description: "Experience the timeless music of Led Zeppelin performed by world-class musicians.",
        date: "2025-07-23",
        startTime: "7:00 PM",
        endTime: "12:00 AM",
        venue: {
          name: "The Cynthia Woods Mitchell Pavilion",
          address: "2005 Lake Robbins Dr, The Woodlands, TX 77380",
        },
        price: "$35-$95",
        url: `${this.baseUrl}/events/led-zeppelin-tribute`,
        imageUrl: "https://example.com/led-zeppelin.jpg",
      },
      {
        title: "Russ: Into The W!LD Tour with Big Sean and Sabrina Claudio",
        description: "Hip-hop sensation Russ brings his Into The W!LD Tour featuring special guests Big Sean and Sabrina Claudio.",
        date: "2025-07-29",
        startTime: "7:00 PM",
        endTime: "12:00 AM",
        venue: {
          name: "The Cynthia Woods Mitchell Pavilion",
          address: "2005 Lake Robbins Dr, The Woodlands, TX 77380",
        },
        price: "$65-$175",
        url: `${this.baseUrl}/events/russ-tour`,
        imageUrl: "https://example.com/russ.jpg",
      },
      {
        title: "Weird Al Yankovic: Bigger & Weirder 2025 Tour",
        description: "Comedy rock legend Weird Al Yankovic returns with his hilarious parodies and musical comedy.",
        date: "2025-08-01",
        startTime: "7:00 PM",
        endTime: "12:00 AM",
        venue: {
          name: "The Cynthia Woods Mitchell Pavilion",
          address: "2005 Lake Robbins Dr, The Woodlands, TX 77380",
        },
        price: "$40-$110",
        url: `${this.baseUrl}/events/weird-al`,
        imageUrl: "https://example.com/weird-al.jpg",
      },
      {
        title: "Jason Aldean: Full Throttle Tour 2025",
        description: "Country superstar Jason Aldean brings his high-energy Full Throttle Tour to The Woodlands.",
        date: "2025-08-15",
        startTime: "7:30 PM",
        endTime: "12:00 AM",
        venue: {
          name: "The Cynthia Woods Mitchell Pavilion",
          address: "2005 Lake Robbins Dr, The Woodlands, TX 77380",
        },
        price: "$75-$200",
        url: `${this.baseUrl}/events/jason-aldean`,
        imageUrl: "https://example.com/jason-aldean.jpg",
      },
      {
        title: "The Offspring: SUPERCHARGED Worldwide Tour",
        description: "Punk rock icons The Offspring perform their biggest hits on the SUPERCHARGED tour.",
        date: "2025-08-23",
        startTime: "7:00 PM",
        endTime: "12:00 AM",
        venue: {
          name: "The Cynthia Woods Mitchell Pavilion",
          address: "2005 Lake Robbins Dr, The Woodlands, TX 77380",
        },
        price: "$50-$140",
        url: `${this.baseUrl}/events/offspring`,
        imageUrl: "https://example.com/offspring.jpg",
      }
    ];
  }
}