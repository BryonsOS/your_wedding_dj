# YourWeddingsDJ.com

Public website + client/admin portal for YourWeddingsDJ.com (a Directmix Entertainment company). Static files, no build step; deployed on Netlify from this repo. Data lives in Supabase.

| Path | What it is |
|---|---|
| `index.html`, `weddings.html`, `events.html`, `gallery.html`, `reviews.html`, `about.html`, `contact.html` | Public website |
| `assets/site.css`, `assets/site.js` | Website styles and behaviour (live packages, availability check, quote form) |
| `assets/content.js` | **Edit this** to add reviews, gallery photos and hero/section photos |
| `images/` | Put website photos here |
| `images/logo/` | Logo files (see below) |
| `portal/index.html` | Client & admin portal (React + Supabase), served at `/portal/` |

Quote requests from `contact.html` are saved to `dj_leads` and appear in the portal's **Leads** tab. Packages and add-ons shown on the website come from the portal's **Packages** tab.

The Supabase key in the pages is the public `anon` key; access is controlled by row-level security policies.

## Logo files (`images/logo/`)

Text is converted to outlines, so the files look the same everywhere without the font installed. `-white` is for dark backgrounds, `-black` for light ones. Each comes as SVG (any size, for web and print) and a 2000px PNG.

| File | Use |
|---|---|
| `wordmark-*` | Main logo: website header, social banners |
| `lockup-*` | Wordmark with "A Directmix Entertainment company" underneath: contracts, flyers, signage |
| `horizontal-*` | YW monogram, rule and wordmark side by side: wide banners, email signature |
| `monogram-*` | YW mark on its own: booth facade, watermark, small spaces |
| `icon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` | Browser tab and phone home-screen icons |
| `profile-1080.png` | Profile picture for Instagram, Facebook, Google Business and The Knot |
