# Location Parameter Implementation

## Overview

This document describes the implementation of the `location` URL parameter for tracking user locations alongside the existing `source` parameter. This addresses the issue where IP-based country detection sometimes returns "غير محدد" (undefined).

## Problem

When users visit the site, the country is detected from their IP address using the ipapi.co service. However, sometimes the IP address returns the country as "غير محدد" (undefined). To solve this, we now accept a `location` parameter in the URL to explicitly specify the user's location.

## Solution

We've added a new `location` parameter that can be passed in the URL alongside the `source` parameter.

### URL Format Examples

**Before:**
```
https://jiwarproperties.com/?source=t
```

**After:**
```
https://jiwarproperties.com/?source=f&location=egypt
https://jiwarproperties.com/?source=i&location=egypt
https://jiwarproperties.com/?source=s&location=egypt
https://jiwarproperties.com/?source=t&location=egypt
```

## Implementation Details

### 1. Landing Page (`app/page.tsx`)

**Changes made:**
- Added capture of `location` parameter from URL
- Store location in localStorage with timestamp
- Include location in analytics payload sent to tracking API

**Code added:**
```typescript
const locationParam = urlParams.get("location");

// Store location parameter
if (locationParam) {
  localStorage.setItem("jiwar_location", locationParam);
  localStorage.setItem("jiwar_location_timestamp", Date.now().toString());
  console.log("Location parameter captured:", locationParam);
}

// Added to tracking context
location: storedLocation || null,
locationTimestamp: locationTimestamp || null,
```

### 2. Interest Page (`app/interest/page.tsx`)

**Changes made:**
- Added capture of `location` parameter from URL
- Store location in localStorage with timestamp
- Include location in form submission payload

**Code added:**
```typescript
const locationParam = urlParams.get("location");

// Store location parameter
if (locationParam) {
  localStorage.setItem("jiwar_location", locationParam);
  localStorage.setItem("jiwar_location_timestamp", Date.now().toString());
  console.log("Location parameter captured:", locationParam);
}

// Added to submission payload
location: urlLocation || null,
locationTimestamp: urlLocationTimestamp || null,
```

### 3. API Route (`app/api/track/route.ts`)

**Changes made:**
- Accept and store `location` and `locationTimestamp` fields
- Include in session merge logic
- Store in both first-time records and merged records

**Code added:**
```typescript
// In merge scenario
location: existingData.location || body.location,
locationTimestamp: existingData.locationTimestamp || body.locationTimestamp,

// In first record scenario
location: body.location,
locationTimestamp: body.locationTimestamp,

// In interest page data
location: body.location || existingData.interestPage?.location,
locationTimestamp: body.locationTimestamp || existingData.interestPage?.locationTimestamp,
```

### 4. Analytics/Logs Page (`app/logs/page.tsx`)

**Changes made:**
- Added `location` and `locationTimestamp` to `AnalyticsData` interface
- Display location in session list with a green badge (📍 emoji)
- Show location in detailed modal view
- Display location in visitor information section

**Visual indicators:**
- **Session list**: Shows location as a green badge next to country name
- **Modal header**: Shows location in parentheses next to country
- **Visitor info section**: Separate row showing "الموقع (من الرابط)" with the location value

**Code added:**
```typescript
// Interface update
interface AnalyticsData {
  location?: string | null;
  locationTimestamp?: string | null;
  // ... other fields
}

// Display in session list
{log.location && (
  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#1c9a6f]/10 text-[#1c9a6f]">
    📍 {log.location}
  </span>
)}

// Display in modal
{selectedLog.location && (
  <div className="flex justify-between items-center py-2 border-b border-[#1c9a6f]/10">
    <span className="text-sm text-[#0b3d2e]/60">
      الموقع (من الرابط)
    </span>
    <span className="font-semibold text-[#1c9a6f]">
      {selectedLog.location}
    </span>
  </div>
)}
```

## How It Works

1. **User visits with location parameter**: 
   - URL: `https://jiwarproperties.com/?source=t&location=egypt`

2. **Parameter capture**:
   - JavaScript extracts the `location` parameter
   - Stores in localStorage: `jiwar_location` = "egypt"
   - Also stores timestamp

3. **Data persistence**:
   - Location persists across page navigation within the session
   - Included in all tracking payloads

4. **API storage**:
   - Backend receives location with analytics data
   - Stores in Vercel Blob storage
   - Merges with existing session data

5. **Analytics display**:
   - Shows both IP-based country (from ipapi.co)
   - Shows URL parameter location (from query string)
   - Distinguished in UI:
     - Country labeled as "البلد (IP)"
     - Location labeled as "الموقع (من الرابط)"

## Benefits

1. **Fallback mechanism**: When IP detection fails, we still have location data
2. **Marketing accuracy**: Know exactly where traffic is coming from based on campaign
3. **Data comparison**: Can compare IP-based country vs. campaign-specified location
4. **Better targeting**: Understand which locations campaigns are targeting

## Testing

To test the implementation:

1. Visit: `https://jiwarproperties.com/?source=f&location=egypt`
2. Check browser console for: "Location parameter captured: egypt"
3. Navigate to interest page
4. Submit form
5. Check analytics dashboard at `/logs`
6. Verify location appears in:
   - Session list (green badge)
   - Detail modal (in header and visitor info section)

## Notes

- Location parameter is optional
- If not provided, only IP-based country is shown
- Location parameter is case-sensitive (recommended: lowercase)
- Can be any string value (e.g., "egypt", "saudi arabia", "uae", etc.)
- Stored separately from source parameter
- Both have independent timestamps

## Files Modified

1. `/app/page.tsx` - Landing page tracking
2. `/app/interest/page.tsx` - Interest page tracking
3. `/app/api/track/route.ts` - API endpoint for storing data
4. `/app/logs/page.tsx` - Analytics dashboard display

## Backward Compatibility

- All changes are backward compatible
- Existing tracking without location parameter continues to work
- Old analytics data without location will show only country
- No breaking changes to existing functionality

