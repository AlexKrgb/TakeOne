# TakeOne Collective

Official website for **TakeOne Collective** — an electronic music, art, and performance collective based in Bolzano, Italy. The site is a single-page, scroll-driven experience that showcases upcoming events, the collective's story, a browsable event archive, and contact links.

**Live site:** [takeone-collective.it](https://takeone-collective.it)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Page Sections](#page-sections)
- [Key Components](#key-components)
- [Data & Assets](#data--assets)
- [Styling & Design System](#styling--design-system)
- [Getting Started](#getting-started)
- [Build & Deployment](#build--deployment)
- [Common Development Tasks](#common-development-tasks)
- [Attributions](#attributions)

---

## Overview

TakeOne Collective operates at the intersection of **music, art, and performance**. The website serves as the collective's public presence: it promotes the next event, tells the collective's story, archives past nights across Bolzano venues, and provides contact and social links.

The application lives in the `sitev1/` directory. All source code, assets, and build configuration are contained there. The repository root holds deployment configuration and this documentation.

| Property | Value |
|----------|-------|
| Type | Single-page application (SPA) |
| Framework | React 18 + TypeScript |
| Bundler | Vite 6 |
| Routing | None — anchor-based scroll navigation |
| Hosting | GitHub Pages (custom domain) |
| Design origin | [Figma — New Version](https://www.figma.com/design/iGxLffj0nOY2HfAeo0gexw/New-Version) |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 18, TypeScript |
| Build | Vite 6, `@vitejs/plugin-react-swc` |
| Styling | Tailwind CSS v4, custom CSS (`globals.css`, `responsive.css`) |
| Animation | [Motion](https://motion.dev/) (`motion/react`) |
| UI primitives | [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind) |
| Maps | [MapLibre GL](https://maplibre.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Carousel | Embla Carousel (via shadcn carousel component) |

There is no backend, database, or API layer. Event data and content are defined in component source files and served as static assets.

---

## Architecture

```
Browser
   │
   ▼
index.html  →  main.tsx  →  App.tsx  (single root component)
                               │
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    Section components   Shared UI (shadcn)   Static assets
    (Hero, Archive,     (Button, Dialog,     (public/images/)
     Contact, etc.)       Select, Badge…)       external CDN URLs
```

**Navigation model:** The site is one long scrollable page divided into sections, each with a DOM `id`. The fixed `[Menu]` button (`TentMenu`) calls `scrollIntoView({ behavior: 'smooth' })` to jump between sections. There is no client-side router.

**State model:** Almost all state is local React state in `App.tsx` and individual section components. Global concerns handled in `App.tsx`:

- Background color transitions as the user scrolls between sections
- Current/previous section tracking (used to reset expanded UI when leaving a section)
- Hero image cycling tied to the typewriter animation

**Responsive behavior:** Breakpoint logic is implemented inline via `windowWidth` state and supplemented by `src/styles/responsive.css` media queries. Mobile layouts stack vertically; the custom cursor is disabled on touch devices.

---

## Repository Structure

```
TakeOne/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD pipeline
├── sitev1/                     # ← All application code
│   ├── public/
│   │   └── images/
│   │       └── events/         # Event posters & gallery images
│   ├── src/
│   │   ├── App.tsx             # Root layout & all page sections
│   │   ├── main.tsx            # React entry point
│   │   ├── index.css           # Tailwind v4 compiled output
│   │   ├── components/         # Feature & UI components
│   │   │   ├── ui/             # shadcn/ui primitives (~40 components)
│   │   │   └── figma/          # Figma-export helpers
│   │   ├── styles/
│   │   │   ├── globals.css     # CSS variables, MapLibre styles, base rules
│   │   │   └── responsive.css  # Breakpoint overrides
│   │   ├── Attributions.md
│   │   └── guidelines/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md                   # This file
```

---

## Page Sections

The page renders five main sections in scroll order, plus a footer.

| Section ID | Component | Background | Purpose |
|------------|-----------|------------|---------|
| `home` | Inline in `App.tsx` | `#220b04` | Hero with typewriter tagline, rotating background images, vinyl logo |
| `next-event` | `ComingSoonSection` | `#FCD478` | Upcoming event details, expandable lineup with DJ info dialogs |
| `about` | Inline in `App.tsx` | `#2E1510` | "About us" reveal panel — click `+` to slide in logo and description |
| `archive` | `ArchiveCarousel` | `#FCD478` | Past events — carousel/grid views, filters, venue map, event detail modals |
| `contact` | Inline in `App.tsx` | `#220b04` | Email card and social links (Instagram, SoundCloud, WhatsApp) |

Each section (except the hero) is wrapped in `SectionTransition`, which fades and slides content in when it enters the viewport via `IntersectionObserver`.

The page background color animates between section palette values as the user scrolls (`App.tsx` scroll handler).

---

## Key Components

### Global / Layout

| Component | File | Role |
|-----------|------|------|
| `VinylLogo` | `VinylLogo.tsx` | Animated spinning vinyl SVG, fixed top-left |
| `TentMenu` | `TentMenu.tsx` | Fixed `[Menu]` navigation; theme adapts to section background |
| `CustomCursor` | `CustomCursor.tsx` | Red circle cursor with spring physics (desktop only) |
| `SectionTransition` | `SectionTransition.tsx` | Viewport-triggered enter animation wrapper |
| `TypewriterEffect` | `TypewriterEffect.tsx` | Hero typewriter cycling "a concept / a tribute / People" |
| `ImageWithFallback` | `figma/ImageWithFallback.tsx` | Image with error fallback for broken URLs |

### Next Event

| Component | File | Role |
|-----------|------|------|
| `ComingSoonSection` | `ComingSoonSection.tsx` | Event poster, date/location, expandable lineup |
| `DynamicColorText` | `DynamicColorText.tsx` | Text that adapts color against background images |

Event details (`eventDetails`, `djDatabase`) are hardcoded at the top of `ComingSoonSection.tsx`.

### Archive

| Component | File | Role |
|-----------|------|------|
| `ArchiveCarousel` | `ArchiveCarousel.tsx` | **Main archive hub** — events array, filters, carousel/grid, stats |
| `VenueMap` | `VenueMap.tsx` | MapLibre map of Bolzano venues with event popups |
| `ArchiveStats` | `ArchiveStats.tsx` | Aggregate counts (events, sets, venues, DJs) |
| `ArchiveEventList` | `ArchiveEventList.tsx` | List view helper (used in archive flows) |
| `ArchiveMapSection` | `ArchiveMapSection.tsx` | Standalone map section (legacy/alternate) |
| `InteractiveArchiveMap` | `InteractiveArchiveMap.tsx` | Alternate map implementation |
| `DJShowcase` | `DJShowcase.tsx` | DJ highlight cards |

The archive supports two view modes (`carousel` | `grid`), year/month/DJ filters, auto-scrolling carousel, and a full-screen event detail overlay with photo gallery.

### UI Library (`src/components/ui/`)

A full [shadcn/ui](https://ui.shadcn.com/) component set is included. Components actively used in the live site include `Button`, `Badge`, `Dialog`, `Select`, and `Carousel`. The rest are available for future features.

---

## Data & Assets

### Event data

Past events are defined as a typed array in `ArchiveCarousel.tsx`:

```typescript
interface Event {
  id: string;
  title: string;
  month: string;
  year: number;
  date: string;
  sets: number;
  poster: string;        // path under public/
  venue: string;
  venueAddress: string;
  description: string;
  gallery: string[];     // array of gallery image paths
  djs: string[];
  genre: string[];
}
```

Venue coordinates for the map are in the `realVenues` array in the same file. When adding a new venue, update both the `events` array and `realVenues`.

### Event images

Images live under `sitev1/public/images/events/` and are served at `/images/events/...`.

**Folder naming convention:**

```
event-{venue}-{number}/
├── poster.webp          (or .jpg / .png)
├── gallery-1.webp
├── gallery-2.webp
└── ...
```

Examples: `event-miro-1/`, `event-zoona-2/`, `event-castel-roncolo-1/`

See `sitev1/public/images/events/README.md` and `EVENT_MAPPING.md` for the full mapping guide.

### External assets

Hero background images and some logos are loaded from Imgur CDN URLs defined in `App.tsx`. These are not bundled locally.

---

## Styling & Design System

### Brand palette

| Token | Hex | Usage |
|-------|-----|-------|
| Dark brown | `#220b04` | Home & contact backgrounds |
| Gold | `#FCD478` | Accent, headings on dark sections |
| Warm brown | `#2E1510` | About section, archive headings |
| Red | `#ED2800` | Primary accent — cursor, buttons, highlights |

### CSS layers

1. **`index.css`** — Tailwind v4 utility classes (compiled)
2. **`globals.css`** — CSS custom properties (shadcn theme), MapLibre import, global resets
3. **`responsive.css`** — Section-specific media query overrides (hero, about, archive, contact, footer)

Typography uses large lowercase display headings (`4rem`–`12rem` depending on breakpoint) with tight line-height (`0.85`).

### Path alias

Vite resolves `@/` to `src/` (configured in `vite.config.ts`).

---

## Getting Started

### Prerequisites

- **Node.js 20+** (matches the CI workflow)
- **npm** (lockfile: `sitev1/package-lock.json`)

### Install & run

```bash
cd sitev1
npm ci        # or: npm install
npm run dev   # starts Vite dev server on http://localhost:3000
```

The dev server opens the browser automatically (`vite.config.ts` → `server.open: true`).

### Production build

```bash
cd sitev1
npm run build   # outputs to sitev1/dist/
```

Preview the production build locally with any static file server:

```bash
npx serve dist
```

---

## Build & Deployment

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`).

**Trigger:** Push to `main`, or manual `workflow_dispatch`.

**Pipeline steps:**

1. Checkout repository
2. `npm ci` in `sitev1/`
3. `npm run build` → `sitev1/dist/`
4. Copy `index.html` → `404.html` (SPA fallback for GitHub Pages)
5. Write `CNAME` with `takeone-collective.it`
6. Upload artifact and deploy to GitHub Pages

Ensure GitHub Pages is configured to deploy from **GitHub Actions** (not a branch), and that the custom domain DNS points to GitHub Pages.

---

## Common Development Tasks

### Update the next event

Edit the `eventDetails` and `djDatabase` objects at the top of:

```
sitev1/src/components/ComingSoonSection.tsx
```

### Add a past event to the archive

1. Create a folder under `sitev1/public/images/events/` following the naming convention
2. Add `poster.webp` and `gallery-N.webp` files
3. Add a new entry to the `events` array in `sitev1/src/components/ArchiveCarousel.tsx`
4. If the venue is new, add it to `realVenues` with lat/lng coordinates
5. Use `generateGallery('event-folder-name', count)` for gallery paths

### Change contact info or social links

Edit the contact section in `sitev1/src/App.tsx` (email, Instagram, SoundCloud, WhatsApp URLs).

### Change hero typewriter text or images

Edit `heroImages` and the `texts` prop on `TypewriterEffect` in `sitev1/src/App.tsx`.

### Adjust section background colors

Update the `sections` array in the scroll handler in `sitev1/src/App.tsx`, and the corresponding theme map in `TentMenu.tsx`.

### Add a new page section

1. Add a `<section id="your-section">` (wrapped in `SectionTransition`) in `App.tsx`
2. Register the section in the scroll handler's `sections` array (with a background color)
3. Add a menu item in `TentMenu.tsx`'s `menuItems` array

---

## Attributions

- UI components from [shadcn/ui](https://ui.shadcn.com/) (MIT)
- Design exported from Figma Make
- Stock photos from [Unsplash](https://unsplash.com) where applicable

See `sitev1/src/Attributions.md` for details.

---

## License

Private project — © 2025 TakeOne Collective. All rights reserved.
