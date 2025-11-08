# Event Image Mapping Guide

This document shows the folder structure and file naming for event images organized by venue and chronological order.

## Folder Structure

Each event has its own folder containing the poster and gallery images.

## Event Structure (8 events total)

### Mirò (Miro Club) - 3 events
Chronological order:
1. **event-miro-1/** - "Spring Awakening" (March 20, 2024) - Event ID: 5
   - `poster.jpg`
   - `gallery-1.jpg`, `gallery-2.jpg`, etc.
2. **event-miro-2/** - "Summer Solstice" (June 21, 2025) - Event ID: 1
   - `poster.jpg`
   - `gallery-1.jpg`, `gallery-2.jpg`, etc.
3. **event-miro-3/** - "Mirò Event 3" (TBD) - Event ID: 8
   - `poster.jpg`
   - `gallery-1.jpg`, `gallery-2.jpg`, etc.

### Zoona - 3 events
Chronological order:
1. **event-zoona-1/** - "Winter Warehouse" (December 15, 2023) - Event ID: 6
   - `poster.jpg`
   - `gallery-1.jpg`, `gallery-2.jpg`, etc.
2. **event-zoona-2/** - "Midnight Groove" (April 15, 2025) - Event ID: 2
   - `poster.jpg`
   - `gallery-1.jpg`, `gallery-2.jpg`, etc.
3. **event-zoona-3/** - "Zoona Event 3" (TBD) - Event ID: 7
   - `poster.jpg`
   - `gallery-1.jpg`, `gallery-2.jpg`, etc.

### Goethe Haus - 1 event
1. **event-goethe-haus-1/** - "New Year Bass" (January 1, 2025) - Event ID: 3
   - `poster.jpg`
   - `gallery-1.jpg`, `gallery-2.jpg`, etc.

### Castel Roncolo - 1 event
1. **event-castel-roncolo-1/** - "Autumn Ritual" (October 31, 2024) - Event ID: 4
   - `poster.jpg`
   - `gallery-1.jpg`, `gallery-2.jpg`, etc.

## Complete Folder Structure

```
public/images/events/
├── event-miro-1/
│   ├── poster.jpg
│   ├── gallery-1.jpg
│   ├── gallery-2.jpg
│   └── gallery-3.jpg
├── event-miro-2/
│   ├── poster.jpg
│   ├── gallery-1.jpg
│   └── ...
├── event-miro-3/
│   ├── poster.jpg
│   └── ...
├── event-zoona-1/
│   ├── poster.jpg
│   ├── gallery-1.jpg
│   └── ...
├── event-zoona-2/
│   ├── poster.jpg
│   ├── gallery-1.jpg
│   └── ...
├── event-zoona-3/
│   ├── poster.jpg
│   └── ...
├── event-goethe-haus-1/
│   ├── poster.jpg
│   ├── gallery-1.jpg
│   └── ...
└── event-castel-roncolo-1/
    ├── poster.jpg
    ├── gallery-1.jpg
    └── ...
```

## Quick Reference Table

| Folder Name | Venue | Event Name | Date | Event ID | Poster Path | Gallery Path Example |
|------------|-------|------------|------|----------|-------------|---------------------|
| `event-miro-1/` | Mirò | Spring Awakening | March 20, 2024 | 5 | `/images/events/event-miro-1/poster.jpg` | `/images/events/event-miro-1/gallery-1.jpg` |
| `event-miro-2/` | Mirò | Summer Solstice | June 21, 2025 | 1 | `/images/events/event-miro-2/poster.jpg` | `/images/events/event-miro-2/gallery-1.jpg` |
| `event-miro-3/` | Mirò | Mirò Event 3 | TBD | 8 | `/images/events/event-miro-3/poster.jpg` | `/images/events/event-miro-3/gallery-1.jpg` |
| `event-zoona-1/` | Zoona | Winter Warehouse | December 15, 2023 | 6 | `/images/events/event-zoona-1/poster.jpg` | `/images/events/event-zoona-1/gallery-1.jpg` |
| `event-zoona-2/` | Zoona | Midnight Groove | April 15, 2025 | 2 | `/images/events/event-zoona-2/poster.jpg` | `/images/events/event-zoona-2/gallery-1.jpg` |
| `event-zoona-3/` | Zoona | Zoona Event 3 | TBD | 7 | `/images/events/event-zoona-3/poster.jpg` | `/images/events/event-zoona-3/gallery-1.jpg` |
| `event-goethe-haus-1/` | Goethe Haus | New Year Bass | January 1, 2025 | 3 | `/images/events/event-goethe-haus-1/poster.jpg` | `/images/events/event-goethe-haus-1/gallery-1.jpg` |
| `event-castel-roncolo-1/` | Castel Roncolo | Autumn Ritual | October 31, 2024 | 4 | `/images/events/event-castel-roncolo-1/poster.jpg` | `/images/events/event-castel-roncolo-1/gallery-1.jpg` |

## File Naming Inside Each Folder

- **Poster:** Always named `poster.jpg` (or `.png`, `.webp`, etc.)
- **Gallery images:** `gallery-1.jpg`, `gallery-2.jpg`, `gallery-3.jpg`, etc.

## Example Usage in Code

```typescript
// Event: Spring Awakening (event-miro-1)
{
  id: '5',
  poster: '/images/events/event-miro-1/poster.jpg',
  gallery: [
    '/images/events/event-miro-1/gallery-1.jpg',
    '/images/events/event-miro-1/gallery-2.jpg',
    '/images/events/event-miro-1/gallery-3.jpg'
  ]
}
```
