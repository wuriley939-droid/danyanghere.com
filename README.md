# Danyang Wu — Visual Archive

Personal website at [danyanghere.com](https://danyanghere.com).  
Pure HTML + CSS. No JavaScript. Hosted on GitHub Pages.

---

## Site Structure

```
danyang-wu-site/
├── index.html                          ← Homepage
├── rock/
│   ├── index.html                      ← Photography index
│   └── rock-temporarily/
│       └── index.html                  ← Project page
├── clay/
│   └── index.html                      ← Ceramics
├── moving/
│   └── index.html                      ← Short videos
├── collected/
│   └── index.html                      ← Fruit archive
├── about/
│   └── index.html                      ← About
├── css/
│   └── style.css                       ← All styles
├── assets/
│   ├── images/
│   │   ├── photography/                ← Photograph files
│   │   ├── ceramics/                   ← Ceramic piece photos
│   │   ├── videos/                     ← Video poster frames
│   │   ├── fruit/                      ← Fruit photos
│   │   ├── about/                      ← Portrait photo
│   │   ├── placeholder-landscape.svg   ← Placeholder (remove later)
│   │   ├── placeholder-portrait.svg
│   │   ├── placeholder-square.svg
│   │   └── placeholder-video.svg
│   └── videos/                         ← Video .mp4 files
├── CNAME                               ← Custom domain
└── README.md                           ← This file
```

---

## How to Add Content

All content lives directly in HTML files. No build step, no JavaScript, no CMS.  
Each section has a **copy-paste template** in the HTML comments.

### Add a photograph to a project

1. Place your image in `assets/images/photography/`
2. Open the project page (e.g., `rock/rock-temporarily/index.html`)
3. Copy a `<figure class="gallery-item ...">` block
4. Paste it in the position where you want it in the sequence
5. Update `src`, `alt`, `width`, `height`, and `figcaption`

**Layout classes** control image size and position:

| Class | Effect |
|-------|--------|
| `gallery-item--full` | 100% width |
| `gallery-item--center` | ~65% width, centered |
| `gallery-item--left` | ~55% width, left-aligned |
| `gallery-item--right` | ~55% width, right-aligned |
| `gallery-item--small` | ~38% width, centered |

For **pairs**, wrap two `gallery-item` figures in a `<div class="gallery-pair">`.

**Image order = scroll order.** The position in the HTML file determines viewing sequence.

### Add a new photography project

1. Create a folder: `rock/your-project-name/`
2. Copy `rock/rock-temporarily/index.html` into it
3. Update the title, year, statement, and images
4. Add a project card to `rock/index.html` linking to the new page

### Add a ceramic piece

1. Place the photo in `assets/images/ceramics/`
2. Open `clay/index.html`
3. Copy an `<article class="ceramic-piece">` block
4. Update `src`, `alt`, title, and metadata (year, material, dimensions)

### Add a short video

1. Place the `.mp4` in `assets/videos/`
2. Create a poster image (screenshot) in `assets/images/videos/`
3. Open `moving/index.html`
4. Copy an `<article class="video-item">` block
5. Uncomment and update the `<source>` tag
6. Update poster, title, location, year, and duration

### Add a fruit entry

1. Place the photo in `assets/images/fruit/`
2. Open `collected/index.html`
3. Copy an `<article class="fruit-entry">` block
4. Update `src`, `alt`, fruit name, place, and year

### Update featured items on the homepage

1. Open `index.html`
2. Each `<div class="home-item ...">` is one featured item
3. Update the `src` and link `href` to point to the work you want featured
4. Use size classes (`home-item--large`, `--medium`, `--small`) and position classes (`--left`, `--right`, `--center`) to control the layout

---

## Image Guidelines

- **Preserve original aspect ratios** — set correct `width` and `height` attributes
- **Optimize for web** — export at reasonable sizes:
  - Full-width photos: ~2000px wide, JPEG quality 80–85
  - Smaller display photos: ~1200px wide
  - Fruit grid photos: ~800px wide
  - Video posters: match video dimensions
- **Use descriptive alt text** — describe what is visible in the image
- **Use `loading="lazy"`** on all images except the first visible one on each page
- **Use `loading="eager"` + `fetchpriority="high"`** only on the first/hero image of each page

---

## Video Guidelines

- Export short videos as `.mp4` (H.264)
- Keep file sizes small — these are 5–15 second clips
- Recommended: 720p or 1080p, reasonable bitrate
- Always create a poster image for each video
- Videos use native `<video controls>` — no JavaScript player

---

## Deployment

### GitHub Pages Setup

1. Create a GitHub repository (e.g., `danyanghere.com` or `danyang-wu-site`)
2. Push this entire folder to the `main` branch
3. Go to **Settings → Pages**
4. Set Source to **Deploy from a branch**
5. Select **main** branch, root folder (`/`)
6. The CNAME file is already included

### Cloudflare DNS Setup

In your Cloudflare dashboard for `danyanghere.com`:

1. Go to **DNS → Records**
2. Add these records:

| Type | Name | Content | Proxy status |
|------|------|---------|--------------|
| `CNAME` | `@` | `wuriley939-droid.github.io` | **DNS only** (Grey cloud ☁️) |
| `CNAME` | `www` | `wuriley939-droid.github.io` | **DNS only** (Grey cloud ☁️) |

> **Important:** Set the proxy status to **DNS only** (grey cloud icon), not Proxied (orange cloud). GitHub Pages needs to directly verify the domain and issue its SSL certificate.

3. In Cloudflare **SSL/TLS**, set encryption mode to **Full** (or **Full (strict)**).
4. Once the DNS records resolve, go to your GitHub repo **Settings → Pages** and check **Enforce HTTPS**.

---

## Design System Reference

### Colors
| Token | Value | Use |
|-------|-------|-----|
| Background | `#F5F2EE` | Warm off-white |
| Text | `#1A1A1A` | Primary text |
| Text secondary | `#6B6560` | Metadata, captions |
| Text tertiary | `#A39E98` | Subtle UI |
| Border | `#E0DCD7` | Dividers |

### Typography
- **Font:** Inter (Google Fonts)
- **Weights:** 300 (light), 400 (regular), 500 (medium)
- **Navigation/captions:** 13px, uppercase, tracked

### Spacing
Based on 8px increments: 8 → 16 → 32 → 64 → 128px

---

## Accessibility

- Skip-to-content link on every page
- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<figure>`, `<figcaption>`)
- `aria-label` on videos and navigation
- `aria-current="page"` on active nav link
- Alt text support on all images
- Keyboard-accessible focus styles
- `prefers-reduced-motion` support (disables animations, hides autoplay video)
- Sufficient color contrast

---

## License

All photographs, videos, ceramic documentation, and written content  
© Danyang Wu. All rights reserved.
