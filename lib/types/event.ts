export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  startTime: string;
  endTime?: string;
  venue: {
    name: string;
    address: string;
    lat?: number;
    lng?: number;
  };
  category: EventCategory;
  price?: string;
  imageUrl?: string;
  sourceUrl: string;
  source: EventSource;
}

export type EventCategory = 
  | 'music'
  | 'sports'
  | 'family'
  | 'food'
  | 'arts'
  | 'community'
  | 'business'
  | 'other';

export type EventSource = 
  | 'eventbrite'
  | 'township'
  | 'marketstreet'
  | 'pavilion'
  | 'manual';