# Project Requirements: Tracking & Analytics Setup

## 1. Source Parameter Setup

We need to add a URL parameter called `source` to identify the platform or channel users are coming from.

for example if in facebook, it will be https://jiwarproperties.com?source=facebook
and so on, so on the tracking part we can identify how many number per each platform
**Example link format:**
https://jiwarproperties.com?source=

Each marketing platform will have its own value for the `source` parameter:

- facebook
- twitter
- snapchat
- tiktok
- instagram

When a visitor lands on the page using one of these links, the system should:

- Capture the `source` parameter value.
- Store it for tracking and analytics purposes (e.g., in cookies, local storage, or the database). we are already linked to blob vercel
- Use this data to identify which platform each visitor originated from.

---

## 2. Analytics Dashboard

We need to build an Analytics Dashboard to monitor and analyze visitor data and performance metrics. build it in the /logs page downside at its end start implementing those use charts if you want

The dashboard should include the following metrics:

1. Total number of visitors – the total count of users who visited the page.
2. Average session time – the average duration each user spends on the website.
3. Total number of sessions – total number of visits (including repeat visits).
4. Users by country – distribution of visitors based on their country of origin.
5. Users by platform – a breakdown showing how many users came from each source:
   - Facebook
   - Twitter (X)
   - Snapchat
   - TikTok
   - Instagram
6. Registered users by platform – showing how many users completed registration from each platform (Facebook, Twitter, Snapchat, TikTok, Instagram).
