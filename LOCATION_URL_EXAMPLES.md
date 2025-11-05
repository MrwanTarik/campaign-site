# Location Parameter - URL Examples

## Quick Reference

Use these URLs in your marketing campaigns to track both the platform source and the target location.

## URL Structure

```
https://jiwarproperties.com/?source={PLATFORM_CODE}&location={LOCATION}
```

### Parameters:

- **source**: Platform code (f=Facebook, i=Instagram, s=Snapchat, t=TikTok)
- **location**: Target location/country (any string, e.g., "egypt", "saudi", "uae")

---

## Facebook Campaigns

### Egypt
```
https://jiwarproperties.com/?source=f&location=egypt
```

### Saudi Arabia
```
https://jiwarproperties.com/?source=f&location=saudi
```

### UAE
```
https://jiwarproperties.com/?source=f&location=uae
```

### Kuwait
```
https://jiwarproperties.com/?source=f&location=kuwait
```

---

## Instagram Campaigns

### Egypt
```
https://jiwarproperties.com/?source=i&location=egypt
```

### Saudi Arabia
```
https://jiwarproperties.com/?source=i&location=saudi
```

### UAE
```
https://jiwarproperties.com/?source=i&location=uae
```

### Kuwait
```
https://jiwarproperties.com/?source=i&location=kuwait
```

---

## Snapchat Campaigns

### Egypt
```
https://jiwarproperties.com/?source=s&location=egypt
```

### Saudi Arabia
```
https://jiwarproperties.com/?source=s&location=saudi
```

### UAE
```
https://jiwarproperties.com/?source=s&location=uae
```

### Kuwait
```
https://jiwarproperties.com/?source=s&location=kuwait
```

---

## TikTok Campaigns

### Egypt
```
https://jiwarproperties.com/?source=t&location=egypt
```

### Saudi Arabia
```
https://jiwarproperties.com/?source=t&location=saudi
```

### UAE
```
https://jiwarproperties.com/?source=t&location=uae
```

### Kuwait
```
https://jiwarproperties.com/?source=t&location=kuwait
```

---

## Interest Page URLs

You can also use the location parameter when sending users directly to the interest page:

### Facebook → Interest Page (Egypt)
```
https://jiwarproperties.com/interest?source=f&location=egypt
```

### Instagram → Interest Page (Saudi)
```
https://jiwarproperties.com/interest?source=i&location=saudi
```

### TikTok → Interest Page (UAE)
```
https://jiwarproperties.com/interest?source=t&location=uae
```

---

## Notes

1. **Location values are flexible**: You can use any string for the location (e.g., "egypt", "مصر", "Cairo", etc.)
2. **Recommended format**: Use lowercase English names for consistency
3. **Common locations**: egypt, saudi, uae, kuwait, qatar, bahrain, oman, jordan, lebanon
4. **Optional parameter**: If you don't specify location, only IP-based country detection will be used
5. **Both parameters work independently**: You can use `source` without `location` or vice versa

---

## How to Check Results

1. Go to: `https://jiwarproperties.com/logs`
2. Login with admin credentials
3. Look for the 📍 location badge next to country names
4. Click on any session to see detailed view with both:
   - **البلد (IP)**: Country detected from IP address
   - **الموقع (من الرابط)**: Location from URL parameter

---

## Testing Example

To test, open this URL in your browser:
```
https://jiwarproperties.com/?source=t&location=egypt
```

Then:
1. Open browser console (F12)
2. You should see: "Location parameter captured: egypt"
3. Navigate around the site
4. Check the analytics dashboard to see the location tracked

