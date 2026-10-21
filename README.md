# YourWeddingsDJ.com

Public website + client/admin portal for YourWeddingsDJ.com (a Directmix Entertainment company). Static files, no build step; deployed on Netlify from this repo. Data lives in Supabase.

| Path | What it is |
|---|---|
| `index.html`, `weddings.html`, `events.html`, `gallery.html`, `reviews.html`, `about.html`, `contact.html` | Public website |
| `assets/site.css`, `assets/site.js` | Website styles and behaviour (live packages, availability check, quote form) |
| `assets/content.js` | **Edit this** to add reviews, gallery photos and hero/section photos |
| `images/` | Put website photos here |
| `portal/index.html` | Client & admin portal (React + Supabase), served at `/portal/` |

Quote requests from `contact.html` are saved to `dj_leads` and appear in the portal's **Leads** tab. Packages and add-ons shown on the website come from the portal's **Packages** tab.

The Supabase key in the pages is the public `anon` key; access is controlled by row-level security policies.
