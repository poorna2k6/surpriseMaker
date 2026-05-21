# Anniversary Surprise Studio

A polished, emotionally rich, installable Progressive Web App for creating cinematic anniversary surprises — built with React, Vite, Tailwind CSS, Framer Motion, and Zustand.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Build optimised production bundle |
| `npm run preview` | Preview the production build locally |

---

## PWA Installation

### Testing PWA Install on Desktop (Chrome/Edge)
1. Run `npm run build && npm run preview`
2. Open the preview URL in Chrome
3. Look for the install icon (⊕) in the address bar, or click "Install App" on the landing page
4. Install and launch from your desktop

### Android (Chrome)
1. Open the hosted URL in Chrome for Android
2. Chrome shows "Add to Home screen" banner automatically, or tap ⋮ → "Add to Home Screen"
3. The app launches in standalone mode (no browser chrome)

### iPhone / iPad (Safari)
1. Open the hosted URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button (rectangle with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** in the top right
5. The app icon appears on your home screen and opens fullscreen

> The in-app iOS Install modal guides users through these exact steps.

---

## Integrating Google Photos

The app has clearly marked placeholder hooks throughout the codebase:

### Google OAuth
```
// GOOGLE OAUTH: sign in and consent flow here
// File: src/store/useStore.js → addConnectedAccount action
// File: src/pages/ConnectPhotos.jsx → handleGoogleConnect function
```

Steps to integrate:
1. Create a Google Cloud project and enable the **Google Photos Library API**
2. Configure OAuth 2.0 credentials (Web Application type)
3. Add your domain to authorised JavaScript origins
4. Replace the demo flow in `ConnectPhotos.jsx` with real `gapi.auth2` or Google Identity Services

### Google Photos Album Fetch
```
// GOOGLE PHOTOS ALBUM FETCH: load albums here
// File: src/pages/ConnectPhotos.jsx → loadAlbums function
```

Use `GET https://photoslibrary.googleapis.com/v1/albums` with the user's OAuth token.

### Google Photos Picker API
```
// GOOGLE PHOTOS PICKER API: launch picker here
// File: src/store/useStore.js → addMediaItems action
```

Integrate the [Google Photos Picker API](https://developers.google.com/photos/picker) for scoped media selection without full library access.

### Shared Albums
```
// SHARED ALBUM IMPORT: integrate shared source picker here
```

Use `GET https://photoslibrary.googleapis.com/v1/sharedAlbums` to list shared albums the user has joined.

---

## Integrating AI Features

### AI Message Generation
```
// AI MESSAGE GENERATION: generate text here
// File: src/pages/Messages.jsx → handleGenerate function
```

Suggested: Claude API (`claude-sonnet-4-6`) with a system prompt using the user's `userProfile` (names, tone, language, years together).

```js
// Example prompt structure:
const prompt = `Write a ${tone} anniversary message for ${spouseName} 
from ${name}. They have been married for ${years} years. 
Language: ${language}. Length: ${length}.`;
```

### AI Narration Generation
```
// AI NARRATION GENERATION: generate spoken script here
// File: src/pages/VideoBuilder.jsx → handleGenerateNarration function
```

Generate a narration script, then pass to a TTS service (ElevenLabs, Google TTS, etc.).

---

## Integrating Video Rendering

```
// VIDEO GENERATION / EXPORT: connect rendering service here
// File: src/pages/VideoBuilder.jsx → handleGenerateVideo function
// File: src/pages/Output.jsx → download buttons
```

Suggested approach:
- **Remotion** (React-based video rendering, can run server-side)
- **FFmpeg.wasm** for client-side rendering of simple slideshows
- **Cloudinary** video generation API
- Custom Lambda/Cloud Run video render service

---

## Face / People Tagging

```
// FACE GROUP ASSIST: integrate people grouping if available here
// File: src/pages/ConnectPhotos.jsx → photo tagging section
```

The Google Photos API's `contentFilters` can filter by `PEOPLE`. For face grouping in app, consider the Google Vision API or AWS Rekognition for tagged face detection.

---

## App Structure

```
src/
├── App.jsx                    # Routes + layout shell
├── main.jsx                   # Entry point + SW registration
├── index.css                  # Global styles + Tailwind
├── store/
│   └── useStore.js            # Zustand state (userProfile, media, timeline, etc.)
├── hooks/
│   ├── usePWAInstall.js       # PWA install prompt detection + iOS detection
│   └── useCountdown.js        # Live countdown to next anniversary
├── utils/
│   └── dateUtils.js           # Anniversary date calculations
├── components/
│   ├── layout/
│   │   └── AppLayout.jsx      # Sidebar (desktop) + bottom nav (mobile)
│   ├── pwa/
│   │   ├── InstallBanner.jsx  # Top install prompt banner
│   │   ├── InstallButton.jsx  # Compact install CTA
│   │   └── IOSInstallModal.jsx # iOS "Add to Home Screen" instructions
│   └── ui/
│       ├── Button.jsx         # Reusable button (primary/secondary/ghost/danger)
│       ├── Card.jsx           # Glass morphism card
│       ├── CountdownTimer.jsx # Anniversary countdown
│       └── StarsBackground.jsx # Ambient starfield background
└── pages/
    ├── Landing.jsx            # Full-screen hero landing
    ├── CreateWizard.jsx       # 7-step setup wizard
    ├── ConnectPhotos.jsx      # Google Photos connection + album selection
    ├── Memories.jsx           # Memory gallery + curation
    ├── Timeline.jsx           # Anniversary timeline builder
    ├── Messages.jsx           # Message Inspiration Studio
    ├── VideoBuilder.jsx       # Cinematic video builder
    ├── AlbumBuilder.jsx       # Digital album builder
    ├── Preview.jsx            # Final preview (video + album)
    └── Output.jsx             # Download + share

public/
├── manifest.json              # PWA manifest
├── sw.js                      # Service worker
└── icons/
    ├── icon-192.png           # PWA icon (192×192)
    └── icon-512.png           # PWA icon (512×512)
```

---

## Data Model

All state lives in Zustand (`src/store/useStore.js`). No localStorage is used in the MVP — all data is session-only. The store includes:

- `userProfile` — couple names, wedding date, tone, style preferences
- `connectedAccounts` — Google accounts connected
- `selectedAlbums` — albums chosen for import
- `mediaItems` — all imported/uploaded media
- `taggedMedia` — per-item tags, status, notes
- `timelineChapters` — ordered anniversary story chapters
- `savedMessages` — curated message collection
- `videoProject` — video scenes, style, narration
- `albumProject` — album pages and cover config
- `pwaInstall` — install prompt state

For persistence across sessions, replace in-memory Zustand with `zustand/middleware` `persist` backed by `indexedDB` (via `idb-keyval`).

---

## MVP Limitations

- **Google Photos**: Demo mode uses mock data. Real integration requires Google API credentials and OAuth consent screen approval.
- **AI generation**: Shows simulated output after a delay. Real integration needs an API key (Claude, OpenAI, etc.).
- **Video rendering**: Shows a progress simulation. Real video requires a server-side rendering pipeline.
- **Album PDF export**: Placeholder only. Real implementation needs `jsPDF` or a server-side renderer.
- **Voice notes**: UI toggle present but recording is not implemented.
- **Persistence**: All state is session-only. Refreshing the page resets the app.
- **Face grouping**: Manual tagging flow only; no automatic face detection.

---

## Design System

- **Typography**: Cormorant Garamond (display/serif) + Inter (body/UI)
- **Palette**: Deep space purples (#0d0618 → #3d2663) with rose/violet/gold accents
- **Motion**: Framer Motion throughout — page transitions, hover effects, animated countdowns
- **Glass morphism**: Backdrop blur cards for elevated content
- **Mobile-first**: Bottom navigation on mobile, elegant sidebar on desktop

---

*Built with care for your anniversary.*
