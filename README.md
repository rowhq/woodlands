# Woodlands Events Superapp

A unified mobile and web app for discovering events in The Woodlands, Texas.

## Features 1

- 📅 Daily event view (Today, Tomorrow, This Week)
- 📱 Works on iOS, Android, and Web
- 🎨 Ant Design UI (web) and Ant Design Mobile RN (native)
- 📍 Event details with map integration
- 🔄 Event aggregation from multiple sources (coming soon)

## Tech Stack

- **Frontend**: Expo (React Native + Web)
- **UI Libraries**: 
  - Web: Ant Design
  - Native: Ant Design Mobile RN
- **Database**: Vercel KV (Redis)
- **Deployment**: Vercel (web), EAS (mobile)
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation
```bash
npm install
```

### Running the App

**Web:**
```bash
npm run web
```

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

### Development
```bash
npm start
```
Then press:
- `w` for web
- `i` for iOS
- `a` for Android

## Project Structure

```
woodlands/
├── app/                  # Expo Router screens
│   ├── _layout.tsx      # Root layout
│   ├── index.tsx        # Home screen (event list)
│   └── event/
│       └── [id].tsx     # Event detail screen
├── lib/
│   ├── api/             # API and data fetching
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilities
│   └── scrapers/        # Event scraping (WIP)
└── assets/              # Images and icons
```

## Environment Setup

1. Create a Vercel account
2. Set up Vercel KV database
3. Add environment variables:

```bash
# .env.local
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
```

## Deployment

### Web (Vercel)
```bash
vercel
```

### Mobile (App Stores)
```bash
# Build for production
eas build --platform all

# Submit to stores
eas submit
```

## Data Sources (Planned)

- Eventbrite API
- The Woodlands Township Calendar
- Market Street Events
- Cynthia Woods Mitchell Pavilion
- Local business calendars

## Contributing

See [lib/scrapers/README.md](lib/scrapers/README.md) for scraper development guide.

## License

MIT