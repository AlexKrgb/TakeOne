# Event Images

This folder contains all event-related images, organized by event in separate subfolders.

## Folder Structure

Each event has its own folder containing the poster and gallery images:

```
public/images/events/
├── event-miro-1/              (Spring Awakening - March 2024)
│   ├── poster.jpg
│   ├── gallery-1.jpg
│   ├── gallery-2.jpg
│   └── gallery-3.jpg
├── event-miro-2/              (Summer Solstice - June 2025)
│   ├── poster.jpg
│   └── ...
├── event-miro-3/              (Mirò Event 3 - TBD)
│   ├── poster.jpg
│   └── ...
├── event-zoona-1/             (Winter Warehouse - Dec 2023)
│   ├── poster.jpg
│   └── ...
├── event-zoona-2/             (Midnight Groove - April 2025)
│   ├── poster.jpg
│   └── ...
├── event-zoona-3/             (Zoona Event 3 - TBD)
│   ├── poster.jpg
│   └── ...
├── event-goethe-haus-1/       (New Year Bass - Jan 2025)
│   ├── poster.jpg
│   └── ...
└── event-castel-roncolo-1/    (Autumn Ritual - Oct 2024)
    ├── poster.jpg
    └── ...
```

## Naming Convention

### Folder Names
`event-{venue}-{chronological-number}/`

Where:
- `{venue}` = venue name in lowercase with hyphens (e.g., `miro`, `zoona`, `goethe-haus`, `castel-roncolo`)
- `{chronological-number}` = order within that venue (1 = oldest, 2 = next, etc.)

### File Names Inside Each Folder

**Poster:**
- Always named `poster.jpg` (or `.png`, `.webp`, etc.)

**Gallery Images:**
- `gallery-1.jpg`
- `gallery-2.jpg`
- `gallery-3.jpg`
- etc.

## Venue Names

- `miro` - Mirò (Miro Club)
- `zoona` - Zoona
- `goethe-haus` - Goethe Haus
- `castel-roncolo` - Castel Roncolo

## How to Reference in Code

Files in the `public/` folder are served at the root path, so you can reference them like:

```typescript
poster: '/images/events/event-miro-1/poster.jpg'
gallery: [
  '/images/events/event-miro-1/gallery-1.jpg',
  '/images/events/event-miro-1/gallery-2.jpg',
  '/images/events/event-miro-1/gallery-3.jpg'
]
```

## Supported Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp` (recommended for better performance)
- `.gif`

## Detailed Mapping

See `EVENT_MAPPING.md` for a complete list of all events and their folder names.
