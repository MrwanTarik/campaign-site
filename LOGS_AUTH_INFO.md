# Logs Page Authentication

## Overview

The logs page (`/logs`) is now protected with authentication. Users must log in with valid credentials before accessing the analytics dashboard.

## Default Credentials

**Username:** `jiwar_admin`  
**Password:** `Jiwar@2025#Secure`

## How to Change Credentials

To change the login credentials, edit the following lines in `/app/logs/page.tsx`:

```typescript
// Static credentials - you can change these
const AUTH_USERNAME = "jiwar_admin";
const AUTH_PASSWORD = "Jiwar@2025#Secure";
```

Simply replace the values with your desired username and password.

## Features

### Login Page

- Clean, modern login form matching the Jiwar design system
- Error messages in Arabic for invalid credentials
- Displays default credentials (can be removed in production)
- Link to return to the home page

### Session Management

- Credentials are stored in browser's `localStorage` for persistent sessions
- Users remain logged in even after page refresh
- Logout button available in the header to clear the session

### Security Features

- Protected route - redirects to login if not authenticated
- Credentials are checked before displaying any data
- Clean session management with logout functionality
- No tracking on the login page

## User Experience

1. **First Visit**: User sees a login form with Jiwar branding
2. **Login**: Enter username and password, click "تسجيل الدخول"
3. **Success**: Redirected to full logs dashboard
4. **Logout**: Click "تسجيل الخروج" in the header to end session
5. **Return Visit**: Automatically logged in if session is active

## Removing Default Credentials Display

For production, you may want to remove the blue box showing the default credentials. Delete this section from `/app/logs/page.tsx`:

```typescript
{
  /* Credentials Info (Remove this in production) */
}
<div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
  <p className="text-xs text-blue-800 mb-2 font-semibold">
    بيانات الدخول الافتراضية:
  </p>
  <p className="text-xs text-blue-700 font-mono">Username: {AUTH_USERNAME}</p>
  <p className="text-xs text-blue-700 font-mono">Password: {AUTH_PASSWORD}</p>
  <p className="text-xs text-blue-600 mt-2">
    (يمكنك تغيير هذه البيانات من الكود)
  </p>
</div>;
```

## Technical Details

- Authentication state is managed using React `useState` and `useEffect`
- Credentials are base64 encoded before storage (basic security)
- Authentication check happens on component mount
- Loading state prevents flash of content before auth check completes
- All existing features (refresh, cleanup, etc.) work as before for authenticated users
