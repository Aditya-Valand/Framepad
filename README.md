# Framepad

A clean, minimal, fully client-side Polaroid-style photo editor that runs entirely in the browser with zero backend.

## Features

### Phase 1 - MVP (Current)
- ✅ Image upload with drag & drop
- ✅ Polaroid frame customization
- ✅ Text captions (top label & bottom caption)
- ✅ Basic photo editing (brightness, contrast, saturation, warmth)
- ✅ Filter presets
- ✅ PNG export (high resolution)

### Phase 2 - Coming Soon
- Frame shapes & materials
- Gradient borders
- Texture overlays
- Stickers & overlays
- Timestamp labels
- Batch layouts (film strip, grid, scrapbook)

### Phase 3 - Coming Later
- Spotify scan code integration
- QR code generation

## Tech Stack

- **Framework:** React 18 with Vite
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **Canvas:** fabric.js 5.x
- **State:** Zustand
- **QR/Spotify:** qrcode.react

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies (already done if you just set up)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173/`

Hot module replacement (HMR) is enabled for instant updates during development.

## Project Structure

```
framepad/
├── src/
│   ├── components/
│   │   ├── canvas/          # Canvas rendering components
│   │   ├── controls/        # UI controls for editing
│   │   ├── layouts/         # Layout modes (single, filmstrip, grid, scrapbook)
│   │   └── ui/              # Reusable UI components
│   ├── store/               # Zustand state stores
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and helpers
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/
│   └── assets/              # Public assets (textures, stickers)
└── ...config files
```

## Usage

1. **Upload a photo** - Drag & drop or click to browse
2. **Customize frame** - Choose style, color, and border size
3. **Edit photo** - Adjust brightness, contrast, saturation
4. **Add text** - Top label and bottom caption
5. **Apply filters** - Quick presets or manual adjustments
6. **Export** - Download as high-resolution PNG

## Deployment

Built with Vite for optimal performance. Deploy to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting service

```bash
npm run build
# Deploy the `dist` folder
```

## License

MIT

## Credits

Built with ❤️ following the Framepad Master Build Specification
