# Analytics & Tracking Improvements

## Overview

Comprehensive analytics system implemented across the Jiwar Timeshare website with detailed tracking of user behavior, engagement, and conversions.

## Key Features Implemented

### 1. Navigation & Menu Click Tracking ✅

- **Landing Page**: Tracks all navigation menu clicks (Features, Jiwar, Investment, FAQ)
- **Data Captured**:
  - Click timestamp
  - Link label
  - Target href
  - Stored in `navClicks` and `menuClicks` arrays

### 2. Section View Tracking ✅

- **Sections Monitored**:
  - Features section (#features)
  - Jiwar section (#jiwar)
  - Investment section (#investment)
  - FAQ section (#faq)
- **Implementation**: IntersectionObserver with 40% threshold
- **Data Captured**: Array of section IDs viewed by user

### 3. FAQ Interaction Tracking ✅

- **Tracks**: Which FAQ questions user opened
- **Data Captured**: Full question text in `faqOpened` array
- **Works with**: All 6 FAQ questions on the landing page

### 4. Interest Page Navigation Source Tracking ✅

Tracks HOW users arrived at the interest page:

- `header_cta` - From header button
- `hero_cta_primary` - From hero section main CTA
- `investment_section_cta` - From investment section
- `jiwar_card_برج جِوار ١` - From Jiwar Tower 1 card
- `jiwar_card_برج جِوار ٢` - From Jiwar Tower 2 card
- `direct` - Direct visit (typed URL or bookmark)

**Stored in**: `sessionStorage` as `jiwar_interest_source` with timestamp

### 5. Property Selection Tracking ✅

- **Tracks**: Which properties user selected in interest page
- **Data Captured**:
  - `selectedOptions`: All selected property IDs
  - `selectedJiwar1`: Jiwar 1 properties only (IDs starting with "j1-")
  - `selectedJiwar2`: Jiwar 2 properties only (IDs starting with "j2-")
- **Properties**:
  - Jiwar 1: `j1-studio-city`, `j1-1br-haram`, `j1-2br-kaba`
  - Jiwar 2: `j2-double`, `j2-three-twins`, `j2-family-studio`

### 6. Form Data Collection (Complete & Incomplete) ✅

- **Always Captured**: All form fields whether submitted or not
- **Fields Tracked**:
  - Name
  - Email
  - Country
  - Phone
  - Notes
- **Flags**:
  - `submitted`: true/false
  - `formHasData`: Boolean indicating if ANY field has data
- **When Captured**:
  - On form submission
  - On page unload (even if incomplete)

### 7. Per-Page Time Tracking ✅

- **Landing Page**: `pageName: "landing"`
- **Interest Page**: `pageName: "interest"`
- **Data Captured**:
  - `secondsOnPage`: Total time on page
  - `activeSecondsOnPage`: Only time when tab was active/visible

### 8. Active Tab Time Tracking ✅

**Problem Solved**: Previous system counted time even when tab was inactive/minimized

**Solution**: Visibility API implementation

- Tracks when tab becomes hidden/visible
- Only counts time when tab is active
- Pauses timer when user switches tabs
- Resumes when user returns

**Data Fields**:

- `secondsOnPage`: Total elapsed time (including inactive)
- `activeSecondsOnPage`: Only active/visible time

### 9. Session-Based Data Consolidation ✅

- **Session ID**: Unique per browser session
- **GUID**: Unique per browser (persistent across sessions)
- **File Naming**: `session-{sessionId}-{timestamp}.json`
- **Benefits**:
  - Easy to group all events from one session
  - Track user journey across pages
  - Identify returning users via GUID

## Data Structure

### Landing Page Payload

```json
{
  "guid": "user-unique-id",
  "sessionId": "session-unique-id",
  "ip": "x.x.x.x",
  "country": "Saudi Arabia",
  "secondsOnPage": 120,
  "activeSecondsOnPage": 95,
  "sectionsViewed": ["features", "jiwar", "faq"],
  "navClicks": [{
    "t": 1234567890,
    "label": "المزايا",
    "href": "#features"
  }],
  "menuClicks": [...],
  "faqOpened": ["ما المقصود بأسبوع ثابت؟"],
  "jiwarCardClicks": [],
  "ctaClicks": [],
  "events": [...],
  "path": "/",
  "ua": "Mozilla/5.0...",
  "lang": "ar",
  "pageName": "landing",
  "ts": "2025-10-21T..."
}
```

### Interest Page Payload

```json
{
  "type": "rooms_submit",
  "guid": "user-unique-id",
  "sessionId": "session-unique-id",
  "ip": "x.x.x.x",
  "country": "Saudi Arabia",
  "secondsOnPage": 240,
  "activeSecondsOnPage": 180,
  "selectedOptions": ["j1-2br-kaba", "j2-family-studio"],
  "selectedJiwar1": ["j1-2br-kaba"],
  "selectedJiwar2": ["j2-family-studio"],
  "form": {
    "name": "أحمد محمد",
    "email": "ahmad@example.com",
    "country": "Saudi Arabia",
    "phone": "+966501234567",
    "notes": "مهتم بالحجز المبكر"
  },
  "formHasData": true,
  "submitted": true,
  "interestSource": "jiwar_card_برج جِوار ١",
  "sourceTimestamp": "1729519200000",
  "pageName": "interest",
  "path": "/interest",
  "ua": "Mozilla/5.0...",
  "lang": "ar",
  "ts": "2025-10-21T..."
}
```

## Implementation Details

### Active Time Tracking Implementation

```javascript
// Track active time only (when tab is visible)
let activeTimeStart = Date.now();
let totalActiveTime = 0;
let isTabActive = !document.hidden;

const handleVisibilityChange = () => {
  if (document.hidden) {
    // Tab became inactive
    if (isTabActive) {
      totalActiveTime += Date.now() - activeTimeStart;
      isTabActive = false;
    }
  } else {
    // Tab became active
    if (!isTabActive) {
      activeTimeStart = Date.now();
      isTabActive = true;
    }
  }
};

document.addEventListener("visibilitychange", handleVisibilityChange);
```

### Interest Source Tracking

```javascript
// On CTA/Card click (landing page)
sessionStorage.setItem("jiwar_interest_source", "hero_cta_primary");
sessionStorage.setItem(
  "jiwar_interest_source_timestamp",
  Date.now().toString()
);

// On interest page load
const interestSource =
  sessionStorage.getItem("jiwar_interest_source") || "direct";
```

## Analytics Dashboard Integration

The logs page (`/logs`) now displays:

- Session-based grouping
- Active vs total time comparison
- Interest source breakdown
- Property selection analysis
- Form completion rates
- Page-to-page flow analysis

## Benefits

1. **User Journey Mapping**: Track complete user path from landing to conversion
2. **Engagement Metrics**: Accurate time tracking excludes inactive periods
3. **Conversion Attribution**: Know which CTAs/cards drive most interest
4. **A/B Testing Ready**: Data structure supports testing different approaches
5. **Incomplete Form Recovery**: Capture leads even if they don't submit
6. **Property Insights**: Understand which properties attract most interest
7. **Session Continuity**: Link landing page behavior to interest page actions

## Next Steps

1. **Dashboard Visualization**: Create charts showing:

   - Conversion funnel
   - Most clicked sections
   - Popular properties
   - Average active time per page
   - Source attribution breakdown

2. **Email Notifications**: Alert when high-value leads (e.g., selected 3 properties)

3. **Retargeting Data**: Export to marketing platforms

4. **A/B Testing**: Test different CTAs, layouts, pricing

5. **Heat Maps**: Add click/scroll tracking for visual analysis
