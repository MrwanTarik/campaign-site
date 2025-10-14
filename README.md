# جِوار تايم شير - Jiwar Timeshare Landing Page

A beautiful Arabic RTL landing page for Jiwar Timeshare with comprehensive analytics tracking and visitor logs.

## Features

- **Arabic RTL Design**: Beautiful, responsive design optimized for Arabic content
- **Analytics Tracking**: Comprehensive visitor behavior tracking including:
  - Time spent on page
  - Sections viewed
  - Menu clicks
  - FAQ interactions
  - IP and country detection
- **Visitor Logs**: Admin dashboard to view all visitor analytics
- **Vercel Blob Storage**: Persistent data storage for analytics
- **Interest Form**: Lead capture form for early bookings

## Pages

1. **Landing Page** (`/`) - Main timeshare landing page
2. **Interest Page** (`/interest`) - Early booking form
3. **Logs Page** (`/logs`) - Analytics dashboard

## Analytics Data Structure

The analytics system tracks:

```json
{
  "guid": "unique-visitor-id",
  "sessionId": "session-id",
  "ip": "visitor-ip",
  "country": "visitor-country",
  "secondsOnPage": 120,
  "sectionsViewed": ["features", "jiwar", "investment"],
  "menuClicks": [{ "t": 1234567890, "label": "المزايا", "href": "#features" }],
  "faqOpened": ["ما هو نظام التايم شير؟"],
  "events": [{ "t": 1234567890, "type": "page_view" }],
  "path": "/",
  "ua": "user-agent-string",
  "ts": "2025-01-09T10:30:00.000Z"
}
```

## Deployment to Vercel

### Prerequisites

1. Vercel account
2. Vercel CLI installed (`npm i -g vercel`)

### Steps

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up Vercel Blob Storage**:

   - Go to your Vercel dashboard
   - Navigate to Storage tab
   - Create a new Blob store
   - Copy the environment variables

3. **Deploy to Vercel**:

   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   In your Vercel dashboard, add:
   - `BLOB_READ_WRITE_TOKEN` - Your Vercel blob storage token

### Environment Variables Required

- `BLOB_READ_WRITE_TOKEN`: Vercel blob storage read/write token

## Local Development

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create `.env.local`:

   ```
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

3. **Run development server**:

   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Main page: http://localhost:3000
   - Logs page: http://localhost:3000/logs
   - Interest page: http://localhost:3000/interest

## API Endpoints

- `POST /api/track` - Store analytics data
- `GET /api/logs` - Retrieve analytics logs

## Debug Mode

Add `?debug=1` to any URL to enable debug mode, which shows a download link for analytics data.

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Vercel Blob Storage
- Arabic RTL support

## License

© 2025 جِوار تايم شير — جميع الحقوق محفوظة
