import { create } from 'zustand';

export type FrameStyle = 'classic' | 'thick' | 'square' | 'portrait' | 'vintage';
export type LayoutMode = 'single' | 'filmstrip' | 'grid' | 'scrapbook';
export type SidebarTab = 'frame' | 'edit' | 'text' | 'music';

export type TemplateId =
  | 'instax-mini'
  | 'instax-square'
  | 'instax-wide'
  | 'polaroid-600'
  | 'polaroid-itype'
  | 'polaroid-bw'
  | 'movie-poster'
  | 'polaroid-classic'
  | 'vintage-color'
  | 'dark-minimal'
  | 'tape-border'
  | 'concert-ticket'
  | 'custom';

export interface PolaroidTemplate {
  id: TemplateId;
  name: string;
  description: string;
  frameWidth: number;
  frameHeight: number;
  borderTop: number;
  borderLeft: number;
  borderRight: number;
  borderBottom: number;
  frameColor: string;
  borderRadius: number;
  defaultFilter?: Partial<FilterValues>;
  aspectLabel: string; // e.g. "2:3", "1:1", "3:2"
}

export const POLAROID_TEMPLATES: PolaroidTemplate[] = [
  {
    id: 'instax-mini',
    name: 'Instax Mini',
    description: 'Classic instant mini',
    frameWidth: 900,
    frameHeight: 1260,
    borderTop: 60,
    borderLeft: 54,
    borderRight: 54,
    borderBottom: 180,
    frameColor: '#FFFFFF',
    borderRadius: 8,
    aspectLabel: '2:3',
  },
  {
    id: 'instax-square',
    name: 'Instax Square',
    description: 'Square instant',
    frameWidth: 1080,
    frameHeight: 1260,
    borderTop: 60,
    borderLeft: 60,
    borderRight: 60,
    borderBottom: 200,
    frameColor: '#FFFFFF',
    borderRadius: 8,
    aspectLabel: '1:1',
  },
  {
    id: 'instax-wide',
    name: 'Instax Wide',
    description: 'Wide landscape',
    frameWidth: 1260,
    frameHeight: 900,
    borderTop: 50,
    borderLeft: 50,
    borderRight: 50,
    borderBottom: 160,
    frameColor: '#FFFFFF',
    borderRadius: 8,
    aspectLabel: '3:2',
  },
  {
    id: 'polaroid-600',
    name: 'Polaroid 600',
    description: 'Classic polaroid',
    frameWidth: 1080,
    frameHeight: 1350,
    borderTop: 54,
    borderLeft: 54,
    borderRight: 54,
    borderBottom: 240,
    frameColor: '#FFFFFF',
    borderRadius: 4,
    aspectLabel: '4:5',
  },
  {
    id: 'polaroid-itype',
    name: 'Polaroid i-Type',
    description: 'Modern polaroid',
    frameWidth: 1080,
    frameHeight: 1320,
    borderTop: 60,
    borderLeft: 60,
    borderRight: 60,
    borderBottom: 220,
    frameColor: '#FEFEFE',
    borderRadius: 6,
    aspectLabel: '4:5',
  },
  {
    id: 'polaroid-bw',
    name: 'Polaroid B&W',
    description: 'Classic monochrome',
    frameWidth: 1080,
    frameHeight: 1350,
    borderTop: 54,
    borderLeft: 54,
    borderRight: 54,
    borderBottom: 240,
    frameColor: '#FAFAFA',
    borderRadius: 4,
    defaultFilter: { brightness: 0, contrast: 10, saturation: -100, warmth: 0 },
    aspectLabel: '4:5',
  },
  {
    id: 'movie-poster',
    name: 'Movie Poster',
    description: 'Cinematic poster style',
    frameWidth: 1080,
    frameHeight: 1620,
    borderTop: 40,
    borderLeft: 40,
    borderRight: 40,
    borderBottom: 400,
    frameColor: '#F2EDE8',
    borderRadius: 0,
    aspectLabel: '2:3',
  },
  {
    id: 'polaroid-classic',
    name: 'Classic Polaroid',
    description: 'Timeless white border with thick bottom caption',
    frameWidth: 1080,
    frameHeight: 1440,
    borderTop: 60,
    borderLeft: 60,
    borderRight: 60,
    borderBottom: 300,
    frameColor: '#FFFFFF',
    borderRadius: 3,
    aspectLabel: '3:4',
  },
  {
    id: 'vintage-color',
    name: 'Vintage Color 600',
    description: 'Warm cream-toned border with retro film warmth',
    frameWidth: 1080,
    frameHeight: 1440,
    borderTop: 66,
    borderLeft: 66,
    borderRight: 66,
    borderBottom: 310,
    frameColor: '#F0EBD8',
    borderRadius: 3,
    defaultFilter: { brightness: 10, contrast: -5, saturation: -20, warmth: 35 },
    aspectLabel: '3:4',
  },
  {
    id: 'dark-minimal',
    name: 'Dark Minimal',
    description: 'Editorial dark-bordered frame, high contrast and ultra clean',
    frameWidth: 1080,
    frameHeight: 1440,
    borderTop: 66,
    borderLeft: 66,
    borderRight: 66,
    borderBottom: 300,
    frameColor: '#1A1814',
    borderRadius: 3,
    aspectLabel: '3:4',
  },
  {
    id: 'tape-border',
    name: 'Tape Border',
    description: 'Scrapbook aesthetic with decorative tape strip across the top',
    frameWidth: 1080,
    frameHeight: 1440,
    borderTop: 80,
    borderLeft: 60,
    borderRight: 60,
    borderBottom: 290,
    frameColor: '#FFFFFF',
    borderRadius: 3,
    aspectLabel: '3:4',
  },
  {
    id: 'concert-ticket',
    name: 'Concert Ticket',
    description: 'Vintage stub with artist, venue and date — tear here',
    frameWidth: 1080,
    frameHeight: 1620,
    borderTop: 40,
    borderLeft: 40,
    borderRight: 40,
    borderBottom: 540,
    frameColor: '#FFFEF8',
    borderRadius: 6,
    aspectLabel: '2:3',
  },
];

export interface FilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
}

export interface OverlayPos {
  x: number; // percentage 0-100 of frame width
  y: number; // percentage 0-100 of frame height
  rotation: number; // degrees
  scale: number; // 1 = default
}

export interface FrameData {
  id: string;
  templateId: TemplateId;
  imageDataUrl: string | null;
  frameWidth: number;
  frameHeight: number;
  borderTop: number;
  borderLeft: number;
  borderRight: number;
  borderBottom: number;
  frameColor: string;
  frameStyle: FrameStyle;
  borderRadius: number;
  filters: FilterValues;
  imageRotation: number;
  imagePanX: number; // percentage offset from center
  imagePanY: number;
  imageScale: number; // 1 = cover fit, >1 = zoomed in
  topLabelText: string;
  topLabelFont: string;
  topLabelSize: number;
  topLabelColor: string;
  topLabelPos: OverlayPos;
  bottomCaptionText: string;
  bottomCaptionFont: string;
  bottomCaptionSize: number;
  bottomCaptionColor: string;
  bottomCaptionPos: OverlayPos;
  musicUrl: string;
  musicPos: OverlayPos;
  musicCodeBg: string;
  musicCodeFg: string;
  // Structured metadata for rich templates (movie-poster, concert-ticket, vintage-color)
  movieTitle: string;
  movieYear: string;
  movieDirector: string;
  movieCast: string;
  captionSubtext: string;
}

export interface AppState {
  frames: FrameData[];
  activeFrameId: string;
  activeTab: SidebarTab;
  layoutMode: LayoutMode;

  setActiveTab: (tab: SidebarTab) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  updateFrame: (id: string, patch: Partial<FrameData>) => void;
  applyTemplate: (id: string, templateId: TemplateId) => void;
  addFrame: () => void;
  removeFrame: (id: string) => void;
  setActiveFrame: (id: string) => void;
}

function createFrame(id: string): FrameData {
  return {
    id,
    templateId: 'polaroid-600',
    imageDataUrl: null,
    frameWidth: 1080,
    frameHeight: 1350,
    borderTop: 54,
    borderLeft: 54,
    borderRight: 54,
    borderBottom: 210,
    frameColor: '#FFFFFF',
    frameStyle: 'classic',
    borderRadius: 0,
    filters: { brightness: 0, contrast: 0, saturation: 0, warmth: 0 },
    imageRotation: 0,
    imagePanX: 0,
    imagePanY: 0,
    imageScale: 1,
    topLabelText: '',
    topLabelFont: 'Dancing Script',
    topLabelSize: 48,
    topLabelColor: '#1A1A1A',
    topLabelPos: { x: 8, y: 2, rotation: 0, scale: 1 },
    bottomCaptionText: '',
    bottomCaptionFont: 'Inter',
    bottomCaptionSize: 36,
    bottomCaptionColor: '#1A1A1A',
    bottomCaptionPos: { x: 50, y: 86, rotation: 0, scale: 1 },
    musicUrl: '',
    musicPos: { x: 50, y: 92, rotation: 0, scale: 1 },
    musicCodeBg: '#FFFFFF',
    musicCodeFg: 'black',
    movieTitle: '',
    movieYear: '',
    movieDirector: '',
    movieCast: '',
    captionSubtext: '',
  };
}

export const FRAME_PRESETS: Record<FrameStyle, Partial<FrameData>> = {
  classic: { borderTop: 54, borderLeft: 54, borderRight: 54, borderBottom: 210, frameColor: '#FFFFFF' },
  thick: { borderTop: 100, borderLeft: 100, borderRight: 100, borderBottom: 280, frameColor: '#FFFFFF' },
  square: { borderTop: 54, borderLeft: 54, borderRight: 54, borderBottom: 54, frameColor: '#FFFFFF' },
  portrait: { borderTop: 40, borderLeft: 40, borderRight: 40, borderBottom: 260, frameColor: '#FFFFFF' },
  vintage: { borderTop: 54, borderLeft: 54, borderRight: 54, borderBottom: 210, frameColor: '#F5EDD6' },
};

export const FILTER_PRESETS: Record<string, FilterValues> = {
  none: { brightness: 0, contrast: 0, saturation: 0, warmth: 0 },
  vintage: { brightness: 10, contrast: -5, saturation: -20, warmth: 30 },
  film: { brightness: 5, contrast: 10, saturation: -10, warmth: 10 },
  sepia: { brightness: 0, contrast: 5, saturation: -80, warmth: 40 },
  bw: { brightness: 0, contrast: 10, saturation: -100, warmth: 0 },
  faded: { brightness: 20, contrast: -20, saturation: -30, warmth: 5 },
};

export const useStore = create<AppState>((set) => ({
  frames: [createFrame('frame-1')],
  activeFrameId: 'frame-1',
  activeTab: 'frame',
  layoutMode: 'single',

  setActiveTab: (activeTab) => set({ activeTab }),
  setLayoutMode: (layoutMode) => set({ layoutMode }),

  updateFrame: (id, patch) =>
    set((s) => ({
      frames: s.frames.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })),

  applyTemplate: (id, templateId) =>
    set((s) => {
      const template = POLAROID_TEMPLATES.find((t) => t.id === templateId);
      if (!template) return s;

      // Seed dummy text for rich templates
      const richDefaults: Partial<FrameData> = {};
      if (templateId === 'movie-poster') {
        richDefaults.movieTitle = 'MOVIE TITLE';
        richDefaults.movieYear = '2026';
        richDefaults.movieDirector = 'YOUR NAME';
        richDefaults.movieCast = 'ACTOR ONE · ACTOR TWO';
        richDefaults.captionSubtext = 'PRODUCER NAME';
        richDefaults.bottomCaptionText = '';
      } else if (templateId === 'vintage-color') {
        richDefaults.bottomCaptionText = "summer '24";
        richDefaults.bottomCaptionFont = 'Courier Prime';
        richDefaults.captionSubtext = 'JUNE · 2026';
        richDefaults.movieTitle = '';
        richDefaults.movieYear = '';
        richDefaults.movieDirector = '';
        richDefaults.movieCast = '';
      } else if (templateId === 'concert-ticket') {
        richDefaults.movieTitle = 'ARTIST NAME';
        richDefaults.movieYear = '';
        richDefaults.movieDirector = 'VENUE · CITY';
        richDefaults.movieCast = 'MAY 04 · 2026';
        richDefaults.captionSubtext = 'GA · FLOOR';
        richDefaults.bottomCaptionText = '';
      } else {
        richDefaults.movieTitle = '';
        richDefaults.movieYear = '';
        richDefaults.movieDirector = '';
        richDefaults.movieCast = '';
        richDefaults.captionSubtext = '';
      }

      return {
        frames: s.frames.map((f) =>
          f.id === id
            ? {
                ...f,
                templateId,
                frameWidth: template.frameWidth,
                frameHeight: template.frameHeight,
                borderTop: template.borderTop,
                borderLeft: template.borderLeft,
                borderRight: template.borderRight,
                borderBottom: template.borderBottom,
                frameColor: template.frameColor,
                borderRadius: template.borderRadius,
                ...(template.defaultFilter ? { filters: { ...f.filters, ...template.defaultFilter } } : {}),
                ...richDefaults,
              }
            : f
        ),
      };
    }),

  addFrame: () =>
    set((s) => {
      const newId = `frame-${Date.now()}`;
      return { frames: [...s.frames, createFrame(newId)], activeFrameId: newId };
    }),

  removeFrame: (id) =>
    set((s) => ({
      frames: s.frames.filter((f) => f.id !== id),
      activeFrameId: s.activeFrameId === id ? s.frames[0]?.id || '' : s.activeFrameId,
    })),

  setActiveFrame: (activeFrameId) => set({ activeFrameId }),
}));
