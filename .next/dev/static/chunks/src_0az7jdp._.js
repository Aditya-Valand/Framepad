(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/store/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FILTER_PRESETS",
    ()=>FILTER_PRESETS,
    "FRAME_PRESETS",
    ()=>FRAME_PRESETS,
    "POLAROID_TEMPLATES",
    ()=>POLAROID_TEMPLATES,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const POLAROID_TEMPLATES = [
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
        aspectLabel: '2:3'
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
        aspectLabel: '1:1'
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
        aspectLabel: '3:2'
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
        aspectLabel: '4:5'
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
        aspectLabel: '4:5'
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
        defaultFilter: {
            brightness: 0,
            contrast: 10,
            saturation: -100,
            warmth: 0
        },
        aspectLabel: '4:5'
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
        aspectLabel: '2:3'
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
        aspectLabel: '3:4'
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
        defaultFilter: {
            brightness: 10,
            contrast: -5,
            saturation: -20,
            warmth: 35
        },
        aspectLabel: '3:4'
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
        aspectLabel: '3:4'
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
        aspectLabel: '3:4'
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
        aspectLabel: '2:3'
    }
];
function createFrame(id) {
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
        filters: {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            warmth: 0
        },
        imageRotation: 0,
        imagePanX: 0,
        imagePanY: 0,
        imageScale: 1,
        topLabelText: '',
        topLabelFont: 'Dancing Script',
        topLabelSize: 48,
        topLabelColor: '#1A1A1A',
        topLabelPos: {
            x: 8,
            y: 2,
            rotation: 0,
            scale: 1
        },
        bottomCaptionText: '',
        bottomCaptionFont: 'Inter',
        bottomCaptionSize: 36,
        bottomCaptionColor: '#1A1A1A',
        bottomCaptionPos: {
            x: 50,
            y: 86,
            rotation: 0,
            scale: 1
        },
        musicUrl: '',
        musicPos: {
            x: 50,
            y: 92,
            rotation: 0,
            scale: 1
        },
        musicCodeBg: 'transparent',
        musicCodeFg: 'black',
        movieTitle: '',
        movieYear: '',
        movieDirector: '',
        movieCast: '',
        captionSubtext: ''
    };
}
const FRAME_PRESETS = {
    classic: {
        borderTop: 54,
        borderLeft: 54,
        borderRight: 54,
        borderBottom: 210,
        frameColor: '#FFFFFF'
    },
    thick: {
        borderTop: 100,
        borderLeft: 100,
        borderRight: 100,
        borderBottom: 280,
        frameColor: '#FFFFFF'
    },
    square: {
        borderTop: 54,
        borderLeft: 54,
        borderRight: 54,
        borderBottom: 54,
        frameColor: '#FFFFFF'
    },
    portrait: {
        borderTop: 40,
        borderLeft: 40,
        borderRight: 40,
        borderBottom: 260,
        frameColor: '#FFFFFF'
    },
    vintage: {
        borderTop: 54,
        borderLeft: 54,
        borderRight: 54,
        borderBottom: 210,
        frameColor: '#F5EDD6'
    }
};
const FILTER_PRESETS = {
    none: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        warmth: 0
    },
    vintage: {
        brightness: 10,
        contrast: -5,
        saturation: -20,
        warmth: 30
    },
    film: {
        brightness: 5,
        contrast: 10,
        saturation: -10,
        warmth: 10
    },
    sepia: {
        brightness: 0,
        contrast: 5,
        saturation: -80,
        warmth: 40
    },
    bw: {
        brightness: 0,
        contrast: 10,
        saturation: -100,
        warmth: 0
    },
    faded: {
        brightness: 20,
        contrast: -20,
        saturation: -30,
        warmth: 5
    }
};
const useStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        frames: [
            createFrame('frame-1')
        ],
        activeFrameId: 'frame-1',
        activeTab: 'frame',
        layoutMode: 'single',
        setActiveTab: (activeTab)=>set({
                activeTab
            }),
        setLayoutMode: (layoutMode)=>set({
                layoutMode
            }),
        updateFrame: (id, patch)=>set((s)=>({
                    frames: s.frames.map((f)=>f.id === id ? {
                            ...f,
                            ...patch
                        } : f)
                })),
        applyTemplate: (id, templateId)=>set((s)=>{
                const template = POLAROID_TEMPLATES.find((t)=>t.id === templateId);
                if (!template) return s;
                // Seed dummy text for rich templates
                const richDefaults = {};
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
                    frames: s.frames.map((f)=>f.id === id ? {
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
                            ...template.defaultFilter ? {
                                filters: {
                                    ...f.filters,
                                    ...template.defaultFilter
                                }
                            } : {},
                            ...richDefaults
                        } : f)
                };
            }),
        addFrame: ()=>set((s)=>{
                const newId = `frame-${Date.now()}`;
                return {
                    frames: [
                        ...s.frames,
                        createFrame(newId)
                    ],
                    activeFrameId: newId
                };
            }),
        removeFrame: (id)=>set((s)=>({
                    frames: s.frames.filter((f)=>f.id !== id),
                    activeFrameId: s.activeFrameId === id ? s.frames[0]?.id || '' : s.activeFrameId
                })),
        setActiveFrame: (activeFrameId)=>set({
                activeFrameId
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useTransparentSpotifyCode.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTransparentSpotifyCode",
    ()=>getTransparentSpotifyCode,
    "useTransparentSpotifyCode",
    ()=>useTransparentSpotifyCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useTransparentSpotifyCode(spotifyUrl, bgColor, fgColor) {
    _s();
    const [transparentUrl, setTransparentUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTransparentSpotifyCode.useEffect": ()=>{
            if (!spotifyUrl) {
                setTransparentUrl(null);
                return;
            }
            const spotifyMatch = spotifyUrl.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
            if (!spotifyMatch) {
                setTransparentUrl(null);
                return;
            }
            // Fetch with a neutral background that we'll remove
            // Use the bgColor so we know exactly what to make transparent
            const cleanBg = bgColor.replace('#', '');
            const codeUrl = `https://scannables.scdn.co/uri/plain/png/${cleanBg}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = ({
                "useTransparentSpotifyCode.useEffect": ()=>{
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d', {
                        willReadFrequently: true
                    });
                    if (!ctx) return;
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    // Parse the background color to RGB
                    const bgRgb = hexToRgb(bgColor);
                    if (!bgRgb) return;
                    // Tolerance for color matching (some anti-aliasing may cause slight variations)
                    const tolerance = 30;
                    // Process each pixel
                    for(let i = 0; i < data.length; i += 4){
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        // Check if this pixel matches the background color (within tolerance)
                        if (Math.abs(r - bgRgb.r) <= tolerance && Math.abs(g - bgRgb.g) <= tolerance && Math.abs(b - bgRgb.b) <= tolerance) {
                            // Make it transparent
                            data[i + 3] = 0;
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);
                    setTransparentUrl(canvas.toDataURL('image/png'));
                }
            })["useTransparentSpotifyCode.useEffect"];
            img.onerror = ({
                "useTransparentSpotifyCode.useEffect": ()=>{
                    setTransparentUrl(null);
                }
            })["useTransparentSpotifyCode.useEffect"];
            img.src = codeUrl;
            return ({
                "useTransparentSpotifyCode.useEffect": ()=>{
                // Cleanup: revoke any object URLs if we used them
                }
            })["useTransparentSpotifyCode.useEffect"];
        }
    }["useTransparentSpotifyCode.useEffect"], [
        spotifyUrl,
        bgColor,
        fgColor
    ]);
    return transparentUrl;
}
_s(useTransparentSpotifyCode, "+svw96YZdOOybnCKvaG6lFSFixE=");
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
async function getTransparentSpotifyCode(spotifyUrl, bgColor, fgColor) {
    const spotifyMatch = spotifyUrl.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
    if (!spotifyMatch) return null;
    const cleanBg = bgColor.replace('#', '');
    const codeUrl = `https://scannables.scdn.co/uri/plain/png/${cleanBg}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`;
    return new Promise((resolve)=>{
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = ()=>{
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d', {
                willReadFrequently: true
            });
            if (!ctx) {
                resolve(null);
                return;
            }
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const bgRgb = hexToRgb(bgColor);
            if (!bgRgb) {
                resolve(null);
                return;
            }
            const tolerance = 30;
            for(let i = 0; i < data.length; i += 4){
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                if (Math.abs(r - bgRgb.r) <= tolerance && Math.abs(g - bgRgb.g) <= tolerance && Math.abs(b - bgRgb.b) <= tolerance) {
                    data[i + 3] = 0;
                }
            }
            ctx.putImageData(imageData, 0, 0);
            // Create a new image from the processed canvas
            const resultImg = new Image();
            resultImg.onload = ()=>resolve(resultImg);
            resultImg.onerror = ()=>resolve(null);
            resultImg.src = canvas.toDataURL('image/png');
        };
        img.onerror = ()=>resolve(null);
        img.src = codeUrl;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/usePolaroidCanvas.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePolaroidCanvas",
    ()=>usePolaroidCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTransparentSpotifyCode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useTransparentSpotifyCode.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function usePolaroidCanvas() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const renderIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const activeFrameId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "usePolaroidCanvas.useStore[activeFrameId]": (s)=>s.activeFrameId
    }["usePolaroidCanvas.useStore[activeFrameId]"]);
    const frames = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "usePolaroidCanvas.useStore[frames]": (s)=>s.frames
    }["usePolaroidCanvas.useStore[frames]"]);
    const frame = frames.find((f)=>f.id === activeFrameId);
    const render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePolaroidCanvas.useCallback[render]": (frameData, canvas)=>{
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const W = frameData.frameWidth;
            const H = frameData.frameHeight;
            canvas.width = W;
            canvas.height = H;
            // Clear with frame color (no transparency)
            ctx.fillStyle = frameData.frameColor;
            if (frameData.borderRadius > 0) {
                roundRect(ctx, 0, 0, W, H, frameData.borderRadius);
                ctx.fill();
            } else {
                ctx.fillRect(0, 0, W, H);
            }
            const imgX = frameData.borderLeft;
            const imgY = frameData.borderTop;
            const imgW = W - frameData.borderLeft - frameData.borderRight;
            const imgH = H - frameData.borderTop - frameData.borderBottom;
            if (!frameData.imageDataUrl) {
                // Placeholder
                ctx.fillStyle = '#F3F4F6';
                ctx.fillRect(imgX, imgY, imgW, imgH);
                ctx.setLineDash([
                    12,
                    8
                ]);
                ctx.strokeStyle = '#D1D5DB';
                ctx.lineWidth = 2;
                ctx.strokeRect(imgX, imgY, imgW, imgH);
                ctx.setLineDash([]);
                ctx.fillStyle = '#9CA3AF';
                ctx.font = '36px Inter, system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Tap to upload photo', W / 2, imgY + imgH / 2);
                if (frameData.templateId === 'tape-border') drawTapeOnCanvas(ctx, W, H);
                drawRichTemplateMeta(ctx, frameData);
            } else {
                // Load and draw image only (text/music are HTML overlays in preview)
                const renderImg = new Image();
                renderImg.crossOrigin = 'anonymous';
                const currentRenderIdAtStart = renderIdRef.current;
                renderImg.onload = ({
                    "usePolaroidCanvas.useCallback[render]": ()=>{
                        if (renderIdRef.current !== currentRenderIdAtStart) return;
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(imgX, imgY, imgW, imgH);
                        ctx.clip();
                        const filterStr = buildCSSFilter(frameData.filters);
                        if (filterStr) ctx.filter = filterStr;
                        const natW = renderImg.naturalWidth;
                        const natH = renderImg.naturalHeight;
                        const cx = imgX + imgW / 2;
                        const cy = imgY + imgH / 2;
                        // Base scale so image covers the frame area exactly (CSS object-fit: cover)
                        const baseScale = Math.max(imgW / natW, imgH / natH);
                        const finalScale = baseScale * frameData.imageScale;
                        const panOffsetX = frameData.imagePanX / 100 * imgW;
                        const panOffsetY = frameData.imagePanY / 100 * imgH;
                        ctx.translate(cx + panOffsetX, cy + panOffsetY);
                        if (frameData.imageRotation !== 0) {
                            ctx.rotate(frameData.imageRotation * Math.PI / 180);
                        }
                        ctx.scale(finalScale, finalScale);
                        ctx.drawImage(renderImg, -natW / 2, -natH / 2, natW, natH);
                        ctx.filter = 'none';
                        ctx.restore();
                        if (frameData.templateId === 'tape-border') drawTapeOnCanvas(ctx, W, H);
                        drawRichTemplateMeta(ctx, frameData);
                    }
                })["usePolaroidCanvas.useCallback[render]"];
                renderImg.src = frameData.imageDataUrl;
            }
        }
    }["usePolaroidCanvas.useCallback[render]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePolaroidCanvas.useEffect": ()=>{
            if (frame && canvasRef.current) {
                renderIdRef.current++;
                render(frame, canvasRef.current);
            }
        }
    }["usePolaroidCanvas.useEffect"], [
        frame,
        render
    ]);
    const exportPNG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePolaroidCanvas.useCallback[exportPNG]": ()=>{
            if (!frame) return;
            // 3× resolution for crisp output on retina / print
            const EXPORT_SCALE = 3;
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = frame.frameWidth * EXPORT_SCALE;
            exportCanvas.height = frame.frameHeight * EXPORT_SCALE;
            const currentFrame = frame;
            const ctx = exportCanvas.getContext('2d', {
                colorSpace: 'srgb'
            });
            if (!ctx) return;
            // Scale everything up uniformly
            ctx.scale(EXPORT_SCALE, EXPORT_SCALE);
            // Draw frame background
            ctx.fillStyle = currentFrame.frameColor;
            if (currentFrame.borderRadius > 0) {
                roundRect(ctx, 0, 0, currentFrame.frameWidth, currentFrame.frameHeight, currentFrame.borderRadius);
                ctx.fill();
            } else {
                ctx.fillRect(0, 0, currentFrame.frameWidth, currentFrame.frameHeight);
            }
            const imgX = currentFrame.borderLeft;
            const imgY = currentFrame.borderTop;
            const imgW = currentFrame.frameWidth - currentFrame.borderLeft - currentFrame.borderRight;
            const imgH = currentFrame.frameHeight - currentFrame.borderTop - currentFrame.borderBottom;
            if (currentFrame.imageDataUrl) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = ({
                    "usePolaroidCanvas.useCallback[exportPNG]": ()=>{
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(imgX, imgY, imgW, imgH);
                        ctx.clip();
                        const filterStr = buildCSSFilter(currentFrame.filters);
                        if (filterStr) ctx.filter = filterStr;
                        const natW = img.naturalWidth;
                        const natH = img.naturalHeight;
                        const cx = imgX + imgW / 2;
                        const cy = imgY + imgH / 2;
                        const baseScale = Math.max(imgW / natW, imgH / natH);
                        const finalScale = baseScale * currentFrame.imageScale;
                        const panOffsetX = currentFrame.imagePanX / 100 * imgW;
                        const panOffsetY = currentFrame.imagePanY / 100 * imgH;
                        ctx.translate(cx + panOffsetX, cy + panOffsetY);
                        if (currentFrame.imageRotation !== 0) {
                            ctx.rotate(currentFrame.imageRotation * Math.PI / 180);
                        }
                        ctx.scale(finalScale, finalScale);
                        ctx.drawImage(img, -natW / 2, -natH / 2, natW, natH);
                        ctx.filter = 'none';
                        ctx.restore();
                        drawOverlaysSync(ctx, currentFrame, imgX, imgY, imgW, imgH, {
                            "usePolaroidCanvas.useCallback[exportPNG]": ()=>{
                                triggerDownload(exportCanvas);
                            }
                        }["usePolaroidCanvas.useCallback[exportPNG]"]);
                    }
                })["usePolaroidCanvas.useCallback[exportPNG]"];
                img.src = currentFrame.imageDataUrl;
            } else {
                ctx.fillStyle = '#F3F4F6';
                ctx.fillRect(imgX, imgY, imgW, imgH);
                drawOverlaysSync(ctx, currentFrame, imgX, imgY, imgW, imgH, {
                    "usePolaroidCanvas.useCallback[exportPNG]": ()=>{
                        triggerDownload(exportCanvas);
                    }
                }["usePolaroidCanvas.useCallback[exportPNG]"]);
            }
        }
    }["usePolaroidCanvas.useCallback[exportPNG]"], [
        frame
    ]);
    return {
        canvasRef,
        exportPNG
    };
}
_s(usePolaroidCanvas, "jrjZweXGvPhGO3+NA4nVLyI3y70=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
function drawOverlaysSync(ctx, frameData, _imgX, _imgY, _imgW, _imgH, onDone) {
    const W = frameData.frameWidth;
    const H = frameData.frameHeight;
    // Tape border decoration
    if (frameData.templateId === 'tape-border') {
        drawTapeOnCanvas(ctx, W, H);
    }
    // Rich template metadata (movie-poster, vintage-color, concert-ticket)
    drawRichTemplateMeta(ctx, frameData);
    // Top label at stored position with scale
    if (frameData.topLabelText) {
        ctx.save();
        const px = frameData.topLabelPos.x / 100 * W;
        const py = frameData.topLabelPos.y / 100 * H;
        ctx.translate(px, py);
        if (frameData.topLabelPos.rotation !== 0) {
            ctx.rotate(frameData.topLabelPos.rotation * Math.PI / 180);
        }
        if (frameData.topLabelPos.scale !== 1) {
            ctx.scale(frameData.topLabelPos.scale, frameData.topLabelPos.scale);
        }
        ctx.font = `${frameData.topLabelSize}px "${frameData.topLabelFont}", cursive`;
        ctx.fillStyle = frameData.topLabelColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(frameData.topLabelText, 0, 0);
        ctx.restore();
    }
    // Bottom caption — skip for rich templates (their canvas draw functions handle it)
    const RICH_TEMPLATES = [
        'movie-poster',
        'concert-ticket',
        'vintage-color'
    ];
    if (frameData.bottomCaptionText && !RICH_TEMPLATES.includes(frameData.templateId)) {
        ctx.save();
        const px = frameData.bottomCaptionPos.x / 100 * W;
        const py = frameData.bottomCaptionPos.y / 100 * H;
        ctx.translate(px, py);
        if (frameData.bottomCaptionPos.rotation !== 0) {
            ctx.rotate(frameData.bottomCaptionPos.rotation * Math.PI / 180);
        }
        if (frameData.bottomCaptionPos.scale !== 1) {
            ctx.scale(frameData.bottomCaptionPos.scale, frameData.bottomCaptionPos.scale);
        }
        ctx.font = `${frameData.bottomCaptionSize}px "${frameData.bottomCaptionFont}", sans-serif`;
        ctx.fillStyle = frameData.bottomCaptionColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(frameData.bottomCaptionText, 0, 0);
        ctx.restore();
    }
    // Spotify code at stored position with scale and custom colors
    if (frameData.musicUrl) {
        const spotifyMatch = frameData.musicUrl.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
        if (spotifyMatch) {
            const fgColor = frameData.musicCodeFg === '#FFFFFF' ? 'white' : 'black';
            const isTransparent = frameData.musicCodeBg === 'transparent';
            const drawCodeImage = (codeImg)=>{
                ctx.save();
                const px = frameData.musicPos.x / 100 * W;
                const py = frameData.musicPos.y / 100 * H;
                ctx.translate(px, py);
                if (frameData.musicPos.rotation !== 0) {
                    ctx.rotate(frameData.musicPos.rotation * Math.PI / 180);
                }
                const overlayScale = frameData.musicPos.scale;
                ctx.scale(overlayScale, overlayScale);
                const codeH = Math.min(H * 0.055, 80);
                const codeW = codeImg.naturalWidth / codeImg.naturalHeight * codeH;
                ctx.drawImage(codeImg, -codeW / 2, -codeH / 2, codeW, codeH);
                ctx.restore();
                onDone();
            };
            if (isTransparent) {
                // Use transparent code with background removed
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTransparentSpotifyCode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTransparentSpotifyCode"])(frameData.musicUrl, '#FFFFFF', fgColor).then((img)=>{
                    if (img) {
                        drawCodeImage(img);
                    } else {
                        onDone();
                    }
                }).catch(()=>onDone());
            } else {
                // Use regular code with solid background
                const effectiveBg = frameData.musicCodeBg;
                const codeUrl = `https://scannables.scdn.co/uri/plain/png/${effectiveBg.replace('#', '')}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`;
                const codeImg = new Image();
                codeImg.crossOrigin = 'anonymous';
                codeImg.onload = ()=>drawCodeImage(codeImg);
                codeImg.onerror = ()=>onDone();
                codeImg.src = codeUrl;
            }
        } else {
            onDone();
        }
    } else {
        onDone();
    }
}
/** Dispatcher — calls the right draw function for each rich template */ function drawRichTemplateMeta(ctx, frame) {
    if (frame.templateId === 'movie-poster') drawMoviePosterMeta(ctx, frame);
    else if (frame.templateId === 'vintage-color') drawVintageCaption(ctx, frame);
    else if (frame.templateId === 'concert-ticket') drawConcertTicketMeta(ctx, frame);
}
/** Movie Poster: Bebas Neue title + Courier Prime metadata grid in caption area */ function drawMoviePosterMeta(ctx, frame) {
    const W = frame.frameWidth;
    const H = frame.frameHeight;
    const capY = H - frame.borderBottom; // y where caption area starts
    const L = frame.borderLeft + 10; // left margin
    const valueX = L + 210; // x for values column
    ctx.save();
    ctx.textBaseline = 'alphabetic';
    // Title (Bebas Neue, large)
    const title = frame.movieTitle || 'MOVIE TITLE';
    ctx.font = `70px "Bebas Neue", sans-serif`;
    ctx.fillStyle = '#1a1814';
    ctx.textAlign = 'left';
    ctx.fillText(title, L, capY + 70);
    // Year next to title
    const titleW = ctx.measureText(title).width;
    ctx.font = `26px Inter, sans-serif`;
    ctx.fillStyle = '#888888';
    ctx.fillText(frame.movieYear || '2026', L + titleW + 14, capY + 64);
    // Separator line
    ctx.beginPath();
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.moveTo(L, capY + 102);
    ctx.lineTo(W - frame.borderRight - 10, capY + 102);
    ctx.stroke();
    // Metadata rows
    const rows = [
        {
            label: 'directed by',
            value: frame.movieDirector || 'YOUR NAME',
            color: '#333333'
        },
        {
            label: 'starring',
            value: frame.movieCast || 'ACTOR ONE · ACTOR TWO',
            color: '#C0392B'
        },
        {
            label: 'produced by',
            value: frame.captionSubtext || 'PRODUCER NAME',
            color: '#333333'
        }
    ];
    rows.forEach((row, i)=>{
        const ry = capY + 152 + i * 52;
        ctx.font = `22px "Courier Prime", monospace`;
        ctx.fillStyle = '#AAAAAA';
        ctx.textAlign = 'left';
        ctx.fillText(row.label, L, ry);
        ctx.fillStyle = row.color;
        ctx.fillText(row.value, valueX, ry);
    });
    ctx.restore();
}
/** Vintage Color 600: Courier Prime caption + smaller date subtext */ function drawVintageCaption(ctx, frame) {
    const W = frame.frameWidth;
    const H = frame.frameHeight;
    const capY = H - frame.borderBottom;
    const caption = frame.bottomCaptionText;
    const subtext = frame.captionSubtext;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    if (caption) {
        ctx.font = `50px "Courier Prime", monospace`;
        ctx.fillStyle = '#5a4a2a';
        ctx.fillText(caption, W / 2, capY + 100);
    }
    if (subtext) {
        ctx.font = `26px "Courier Prime", monospace`;
        ctx.fillStyle = '#9a8a6a';
        ctx.letterSpacing = '4px';
        ctx.fillText(subtext, W / 2, capY + 158);
        ctx.letterSpacing = '0px';
    }
    ctx.restore();
}
/** Concert Ticket: dashed perforation + Bebas Neue artist + Courier Prime venue/date */ function drawConcertTicketMeta(ctx, frame) {
    const W = frame.frameWidth;
    const H = frame.frameHeight;
    const capY = H - frame.borderBottom; // = 1080
    const CX = W / 2;
    ctx.save();
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';
    // Dashed perforation line
    ctx.setLineDash([
        10,
        10
    ]);
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(frame.borderLeft, capY + 16);
    ctx.lineTo(W - frame.borderRight, capY + 16);
    ctx.stroke();
    ctx.setLineDash([]);
    // Artist name
    ctx.font = `86px "Bebas Neue", sans-serif`;
    ctx.fillStyle = '#1a1814';
    ctx.fillText(frame.movieTitle || 'ARTIST NAME', CX, capY + 138);
    // Venue
    ctx.font = `28px "Courier Prime", monospace`;
    ctx.fillStyle = '#666666';
    ctx.fillText(frame.movieDirector || 'VENUE · CITY', CX, capY + 198);
    // Date / Show info
    ctx.fillText(frame.movieCast || 'MAY 04 · 2026', CX, capY + 248);
    // Separator
    ctx.beginPath();
    ctx.strokeStyle = '#E0DDD5';
    ctx.lineWidth = 1;
    ctx.moveTo(frame.borderLeft + 60, capY + 292);
    ctx.lineTo(W - frame.borderRight - 60, capY + 292);
    ctx.stroke();
    // Section / Row
    ctx.font = `38px "Bebas Neue", sans-serif`;
    ctx.fillStyle = '#AAAAAA';
    ctx.letterSpacing = '5px';
    ctx.fillText(frame.captionSubtext || 'GA · FLOOR', CX, capY + 372);
    ctx.letterSpacing = '0px';
    // Admit one
    ctx.font = `20px "Courier Prime", monospace`;
    ctx.fillStyle = '#C8C8C8';
    ctx.fillText('ADMIT ONE', CX, capY + 420);
    ctx.restore();
}
/** Draws a semi-transparent tape strip at the top of the canvas */ function drawTapeOnCanvas(ctx, W, H) {
    const tapeW = W * 0.44;
    const tapeH = H * 0.025;
    const tapeX = W / 2;
    const tapeY = tapeH / 2 + 4;
    ctx.save();
    ctx.translate(tapeX, tapeY);
    ctx.rotate(-2 * Math.PI / 180);
    ctx.fillStyle = 'rgba(255,220,120,0.60)';
    const rx = 4;
    const x = -tapeW / 2;
    const y = -tapeH / 2;
    ctx.beginPath();
    ctx.moveTo(x + rx, y);
    ctx.lineTo(x + tapeW - rx, y);
    ctx.quadraticCurveTo(x + tapeW, y, x + tapeW, y + rx);
    ctx.lineTo(x + tapeW, y + tapeH - rx);
    ctx.quadraticCurveTo(x + tapeW, y + tapeH, x + tapeW - rx, y + tapeH);
    ctx.lineTo(x + rx, y + tapeH);
    ctx.quadraticCurveTo(x, y + tapeH, x, y + tapeH - rx);
    ctx.lineTo(x, y + rx);
    ctx.quadraticCurveTo(x, y, x + rx, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
function triggerDownload(canvas) {
    canvas.toBlob((blob)=>{
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `framepad-${Date.now()}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 'image/png');
}
function buildCSSFilter(filters) {
    const parts = [];
    if (filters.brightness !== 0) parts.push(`brightness(${1 + filters.brightness / 100})`);
    if (filters.contrast !== 0) parts.push(`contrast(${1 + filters.contrast / 100})`);
    if (filters.saturation !== 0) parts.push(`saturate(${1 + filters.saturation / 100})`);
    // Warmth approximated via sepia + hue rotation
    if (filters.warmth > 0) {
        parts.push(`sepia(${filters.warmth / 200})`);
    } else if (filters.warmth < 0) {
        parts.push(`hue-rotate(${filters.warmth / 3}deg)`);
    }
    return parts.join(' ');
}
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useImageUpload.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useImageUpload",
    ()=>useImageUpload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const COMPRESS_THRESHOLD = 3 * 1024 * 1024;
const VALID_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp'
];
function useImageUpload() {
    _s();
    const activeFrameId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "useImageUpload.useStore[activeFrameId]": (s)=>s.activeFrameId
    }["useImageUpload.useStore[activeFrameId]"]);
    const updateFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "useImageUpload.useStore[updateFrame]": (s)=>s.updateFrame
    }["useImageUpload.useStore[updateFrame]"]);
    const processFile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useImageUpload.useCallback[processFile]": async (file)=>{
            if (!VALID_TYPES.includes(file.type)) {
                alert('Please upload a JPG, PNG, or WEBP image');
                return null;
            }
            if (file.size > MAX_SIZE_BYTES) {
                alert('Image too large. Max size is 10MB');
                return null;
            }
            return new Promise({
                "useImageUpload.useCallback[processFile]": (resolve)=>{
                    const reader = new FileReader();
                    reader.onload = ({
                        "useImageUpload.useCallback[processFile]": (e)=>{
                            const dataUrl = e.target?.result;
                            if (file.size <= COMPRESS_THRESHOLD) {
                                resolve(dataUrl);
                                return;
                            }
                            // Compress large images
                            const img = new Image();
                            img.onload = ({
                                "useImageUpload.useCallback[processFile]": ()=>{
                                    const canvas = document.createElement('canvas');
                                    let { width, height } = img;
                                    const maxDim = 2048;
                                    if (width > maxDim || height > maxDim) {
                                        if (width > height) {
                                            height = height / width * maxDim;
                                            width = maxDim;
                                        } else {
                                            width = width / height * maxDim;
                                            height = maxDim;
                                        }
                                    }
                                    canvas.width = width;
                                    canvas.height = height;
                                    const ctx = canvas.getContext('2d');
                                    ctx.drawImage(img, 0, 0, width, height);
                                    resolve(canvas.toDataURL('image/jpeg', 0.85));
                                }
                            })["useImageUpload.useCallback[processFile]"];
                            img.src = dataUrl;
                        }
                    })["useImageUpload.useCallback[processFile]"];
                    reader.readAsDataURL(file);
                }
            }["useImageUpload.useCallback[processFile]"]);
        }
    }["useImageUpload.useCallback[processFile]"], []);
    const uploadFile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useImageUpload.useCallback[uploadFile]": async (file)=>{
            const dataUrl = await processFile(file);
            if (dataUrl) {
                // Reset pan/scale so new image always starts centered and covering the frame
                updateFrame(activeFrameId, {
                    imageDataUrl: dataUrl,
                    imagePanX: 0,
                    imagePanY: 0,
                    imageScale: 1
                });
            }
        }
    }["useImageUpload.useCallback[uploadFile]"], [
        processFile,
        activeFrameId,
        updateFrame
    ]);
    return {
        uploadFile
    };
}
_s(useImageUpload, "ICgQOozVKBdQ3u3sWn3ewbNPpDg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/DraggableOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DraggableOverlay",
    ()=>DraggableOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function DraggableOverlay({ children, x, y, rotation, scale, containerW, containerH, onMove, onRotate, onScale, onDragStart, onDragEnd, onDragMove, overTrash = false, onDelete }) {
    _s();
    const elRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Always-fresh props for event handlers (no stale closure)
    const stateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x,
        y,
        rotation,
        scale,
        containerW,
        containerH
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraggableOverlay.useEffect": ()=>{
            stateRef.current = {
                x,
                y,
                rotation,
                scale,
                containerW,
                containerH
            };
        }
    }["DraggableOverlay.useEffect"]);
    const cbRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        onMove,
        onRotate,
        onScale,
        onDragStart,
        onDragEnd,
        onDragMove
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraggableOverlay.useEffect": ()=>{
            cbRef.current = {
                onMove,
                onRotate,
                onScale,
                onDragStart,
                onDragEnd,
                onDragMove
            };
        }
    }["DraggableOverlay.useEffect"]);
    // Refs for delete logic (must survive inside event handlers without re-registering)
    const overTrashRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(overTrash);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraggableOverlay.useEffect": ()=>{
            overTrashRef.current = overTrash;
        }
    }["DraggableOverlay.useEffect"], [
        overTrash
    ]);
    const onDeleteRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onDelete);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraggableOverlay.useEffect": ()=>{
            onDeleteRef.current = onDelete;
        }
    }["DraggableOverlay.useEffect"], [
        onDelete
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraggableOverlay.useEffect": ()=>{
            const el = elRef.current;
            if (!el) return;
            // Live pointer map — keyed by pointerId
            const ptrs = new Map();
            // Gesture baseline (captured at gesture-start, never mutated during the gesture)
            const base = {
                // drag
                dragging: false,
                dragId: -1,
                startCX: 0,
                startCY: 0,
                origX: 0,
                origY: 0,
                // pinch
                pinching: false,
                pinchId0: -1,
                pinchId1: -1,
                initP0: {
                    x: 0,
                    y: 0
                },
                initP1: {
                    x: 0,
                    y: 0
                },
                initDist: 0,
                initAngle: 0,
                origScale: 1,
                origRot: 0
            };
            const getDist = {
                "DraggableOverlay.useEffect.getDist": (a, b)=>Math.hypot(b.x - a.x, b.y - a.y)
            }["DraggableOverlay.useEffect.getDist"];
            const getAngle = {
                "DraggableOverlay.useEffect.getAngle": (a, b)=>Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI)
            }["DraggableOverlay.useEffect.getAngle"];
            const startPinch = {
                "DraggableOverlay.useEffect.startPinch": ()=>{
                    const ids = [
                        ...ptrs.keys()
                    ];
                    if (ids.length < 2) return;
                    const s = stateRef.current;
                    const p0 = ptrs.get(ids[0]);
                    const p1 = ptrs.get(ids[1]);
                    base.pinching = true;
                    base.dragging = false;
                    base.pinchId0 = ids[0];
                    base.pinchId1 = ids[1];
                    base.initP0 = {
                        ...p0
                    };
                    base.initP1 = {
                        ...p1
                    };
                    base.initDist = getDist(p0, p1);
                    base.initAngle = getAngle(p0, p1);
                    base.origScale = s.scale;
                    base.origRot = s.rotation;
                }
            }["DraggableOverlay.useEffect.startPinch"];
            const onDown = {
                "DraggableOverlay.useEffect.onDown": (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    el.setPointerCapture(e.pointerId);
                    ptrs.set(e.pointerId, {
                        x: e.clientX,
                        y: e.clientY
                    });
                    setActive(true);
                    if (ptrs.size === 1) {
                        const s = stateRef.current;
                        base.dragging = true;
                        base.pinching = false;
                        base.dragId = e.pointerId;
                        base.startCX = e.clientX;
                        base.startCY = e.clientY;
                        base.origX = s.x;
                        base.origY = s.y;
                        cbRef.current.onDragStart?.();
                    } else if (ptrs.size === 2) {
                        startPinch();
                    }
                }
            }["DraggableOverlay.useEffect.onDown"];
            const onMove = {
                "DraggableOverlay.useEffect.onMove": (e)=>{
                    if (!ptrs.has(e.pointerId)) return;
                    e.preventDefault();
                    ptrs.set(e.pointerId, {
                        x: e.clientX,
                        y: e.clientY
                    });
                    const s = stateRef.current;
                    if (base.dragging && e.pointerId === base.dragId) {
                        const dx = e.clientX - base.startCX;
                        const dy = e.clientY - base.startCY;
                        cbRef.current.onMove(Math.max(-10, Math.min(110, base.origX + dx / s.containerW * 100)), Math.max(-10, Math.min(110, base.origY + dy / s.containerH * 100)));
                        // Report live pointer position so parent can hit-test trash zone
                        cbRef.current.onDragMove?.(e.clientX, e.clientY);
                    }
                    if (base.pinching) {
                        const p0 = ptrs.get(base.pinchId0);
                        const p1 = ptrs.get(base.pinchId1);
                        if (!p0 || !p1) return;
                        const nowDist = getDist(p0, p1);
                        const nowAngle = getAngle(p0, p1);
                        if (base.initDist > 2) {
                            cbRef.current.onScale(Math.max(0.15, Math.min(6, base.origScale * (nowDist / base.initDist))));
                        }
                        cbRef.current.onRotate(base.origRot + (nowAngle - base.initAngle));
                    }
                }
            }["DraggableOverlay.useEffect.onMove"];
            const onUp = {
                "DraggableOverlay.useEffect.onUp": (e)=>{
                    ptrs.delete(e.pointerId);
                    if (e.pointerId === base.dragId) base.dragging = false;
                    if (ptrs.size < 2) {
                        base.pinching = false;
                        // If one finger remains, restart drag from current position
                        if (ptrs.size === 1) {
                            const [id, pos] = [
                                ...ptrs.entries()
                            ][0];
                            const s = stateRef.current;
                            base.dragging = true;
                            base.dragId = id;
                            base.startCX = pos.x;
                            base.startCY = pos.y;
                            base.origX = s.x;
                            base.origY = s.y;
                        }
                    }
                    if (ptrs.size === 0) {
                        setActive(false);
                        // Delete if released over trash
                        if (overTrashRef.current && onDeleteRef.current) {
                            onDeleteRef.current();
                        }
                        cbRef.current.onDragEnd?.();
                    }
                }
            }["DraggableOverlay.useEffect.onUp"];
            el.addEventListener('pointerdown', onDown, {
                passive: false
            });
            el.addEventListener('pointermove', onMove, {
                passive: false
            });
            el.addEventListener('pointerup', onUp);
            el.addEventListener('pointercancel', onUp);
            return ({
                "DraggableOverlay.useEffect": ()=>{
                    el.removeEventListener('pointerdown', onDown);
                    el.removeEventListener('pointermove', onMove);
                    el.removeEventListener('pointerup', onUp);
                    el.removeEventListener('pointercancel', onUp);
                }
            })["DraggableOverlay.useEffect"];
        }
    }["DraggableOverlay.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: elRef,
        className: "absolute touch-none select-none",
        style: {
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${overTrash ? scale * 0.65 : scale})`,
            transformOrigin: 'center center',
            zIndex: 10,
            cursor: active ? 'grabbing' : 'grab',
            willChange: 'transform',
            opacity: overTrash ? 0.6 : 1,
            filter: overTrash ? 'brightness(0.7) saturate(0.5)' : 'none',
            transition: overTrash ? 'transform 0.15s ease, opacity 0.15s ease, filter 0.15s ease' : 'none'
        },
        children: [
            active && !overTrash && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 rounded pointer-events-none",
                style: {
                    outline: '1.5px dashed rgba(255,255,255,0.85)',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
                    margin: '-4px'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/DraggableOverlay.tsx",
                lineNumber: 209,
                columnNumber: 9
            }, this),
            overTrash && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 rounded pointer-events-none",
                style: {
                    outline: '1.5px solid rgba(239,68,68,0.8)',
                    boxShadow: '0 0 0 1px rgba(239,68,68,0.3)',
                    margin: '-4px'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/DraggableOverlay.tsx",
                lineNumber: 219,
                columnNumber: 9
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DraggableOverlay.tsx",
        lineNumber: 190,
        columnNumber: 5
    }, this);
}
_s(DraggableOverlay, "pxgP3nzyto7cA/iEYys8I/RkIvc=");
_c = DraggableOverlay;
var _c;
__turbopack_context__.k.register(_c, "DraggableOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CropModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CropModal",
    ()=>CropModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function CropModal({ imageDataUrl, aspectW, aspectH, initialPanX = 0, initialPanY = 0, initialScale = 1, onConfirm, onClose }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const imgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [imgNatural, setImgNatural] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        w: 1,
        h: 1
    });
    // Keep a ref so gesture event handlers (stale closures) always see the latest values
    const natRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(imgNatural);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CropModal.useEffect": ()=>{
            natRef.current = imgNatural;
        }
    }["CropModal.useEffect"], [
        imgNatural
    ]);
    // Current position state (% of crop window)
    const [panX, setPanX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialPanX);
    const [panY, setPanY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialPanY);
    // Clamp to minimum 1 so image always covers the frame on open
    const [imgScale, setImgScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Math.max(1, initialScale));
    // Gesture baseline refs
    const gesture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        dragging: false,
        dragId: -1,
        startCX: 0,
        startCY: 0,
        origPX: 0,
        origPY: 0,
        pinching: false,
        pid0: -1,
        pid1: -1,
        initP0: {
            x: 0,
            y: 0
        },
        initP1: {
            x: 0,
            y: 0
        },
        initDist: 0,
        origScale: 1
    });
    const ptrs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // fresh-value refs so event handlers don't go stale
    const panRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        panX,
        panY,
        imgScale
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CropModal.useEffect": ()=>{
            panRef.current = {
                panX,
                panY,
                imgScale
            };
        }
    }["CropModal.useEffect"], [
        panX,
        panY,
        imgScale
    ]);
    // Compute the crop window size that fits in the screen
    const [cropSize, setCropSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        w: 300,
        h: 400
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CropModal.useEffect": ()=>{
            const update = {
                "CropModal.useEffect.update": ()=>{
                    const vw = window.innerWidth - 32;
                    const vh = window.innerHeight - 180; // leave room for header/buttons
                    const scaleX = vw / aspectW;
                    const scaleY = vh / aspectH;
                    const s = Math.min(scaleX, scaleY);
                    setCropSize({
                        w: aspectW * s,
                        h: aspectH * s
                    });
                }
            }["CropModal.useEffect.update"];
            update();
            window.addEventListener('resize', update);
            return ({
                "CropModal.useEffect": ()=>window.removeEventListener('resize', update)
            })["CropModal.useEffect"];
        }
    }["CropModal.useEffect"], [
        aspectW,
        aspectH
    ]);
    const setupGesture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CropModal.useCallback[setupGesture]": ()=>{
            const el = containerRef.current;
            if (!el) return;
            const onDown = {
                "CropModal.useCallback[setupGesture].onDown": (e)=>{
                    e.preventDefault();
                    el.setPointerCapture(e.pointerId);
                    ptrs.current.set(e.pointerId, {
                        x: e.clientX,
                        y: e.clientY
                    });
                    const g = gesture.current;
                    const p = panRef.current;
                    if (ptrs.current.size === 1) {
                        g.dragging = true;
                        g.pinching = false;
                        g.dragId = e.pointerId;
                        g.startCX = e.clientX;
                        g.startCY = e.clientY;
                        g.origPX = p.panX;
                        g.origPY = p.panY;
                    } else if (ptrs.current.size === 2) {
                        g.dragging = false;
                        g.pinching = true;
                        const ids = [
                            ...ptrs.current.keys()
                        ];
                        g.pid0 = ids[0];
                        g.pid1 = ids[1];
                        g.initP0 = {
                            ...ptrs.current.get(ids[0])
                        };
                        g.initP1 = {
                            ...ptrs.current.get(ids[1])
                        };
                        g.initDist = Math.hypot(g.initP1.x - g.initP0.x, g.initP1.y - g.initP0.y);
                        g.origScale = p.imgScale;
                        g.origPX = p.panX;
                        g.origPY = p.panY;
                    }
                }
            }["CropModal.useCallback[setupGesture].onDown"];
            const onMove = {
                "CropModal.useCallback[setupGesture].onMove": (e)=>{
                    if (!ptrs.current.has(e.pointerId)) return;
                    e.preventDefault();
                    ptrs.current.set(e.pointerId, {
                        x: e.clientX,
                        y: e.clientY
                    });
                    const g = gesture.current;
                    const p = panRef.current;
                    // Max pan so the image edge never exposes the void behind it
                    const { w: cw, h: ch } = cropSize;
                    const nat = natRef.current;
                    const baseScaleNow = Math.max(cw / nat.w, ch / nat.h);
                    const dispW = nat.w * baseScaleNow * p.imgScale;
                    const dispH = nat.h * baseScaleNow * p.imgScale;
                    const maxPX = Math.max(0, (dispW - cw) / cw * 50);
                    const maxPY = Math.max(0, (dispH - ch) / ch * 50);
                    if (g.dragging && e.pointerId === g.dragId) {
                        const dx = e.clientX - g.startCX;
                        const dy = e.clientY - g.startCY;
                        setPanX(Math.max(-maxPX, Math.min(maxPX, g.origPX + dx / cw * 100)));
                        setPanY(Math.max(-maxPY, Math.min(maxPY, g.origPY + dy / ch * 100)));
                    }
                    if (g.pinching) {
                        const p0 = ptrs.current.get(g.pid0);
                        const p1 = ptrs.current.get(g.pid1);
                        if (!p0 || !p1) return;
                        const nowDist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
                        if (g.initDist > 2) {
                            const scaleFactor = nowDist / g.initDist;
                            // Minimum 1 = image always covers the frame (no white border behind image)
                            const next = Math.max(1, Math.min(4, g.origScale * scaleFactor));
                            setImgScale(next);
                            // Keep the finger midpoint fixed (zoom-to-cursor)
                            const initMidX = (g.initP0.x + g.initP1.x) / 2;
                            const initMidY = (g.initP0.y + g.initP1.y) / 2;
                            const el = containerRef.current;
                            if (el) {
                                const rect = el.getBoundingClientRect();
                                const relMidX = initMidX - rect.left - cw / 2;
                                const relMidY = initMidY - rect.top - ch / 2;
                                const curPanOffX = g.origPX / 100 * cw;
                                const curPanOffY = g.origPY / 100 * ch;
                                const newPanOffX = relMidX - (relMidX - curPanOffX) * scaleFactor;
                                const newPanOffY = relMidY - (relMidY - curPanOffY) * scaleFactor;
                                // Recompute max pan with new scale
                                const dispWNext = nat.w * baseScaleNow * next;
                                const dispHNext = nat.h * baseScaleNow * next;
                                const mxNext = Math.max(0, (dispWNext - cw) / cw * 50);
                                const myNext = Math.max(0, (dispHNext - ch) / ch * 50);
                                setPanX(Math.max(-mxNext, Math.min(mxNext, newPanOffX / cw * 100)));
                                setPanY(Math.max(-myNext, Math.min(myNext, newPanOffY / ch * 100)));
                            }
                        }
                    }
                }
            }["CropModal.useCallback[setupGesture].onMove"];
            const onUp = {
                "CropModal.useCallback[setupGesture].onUp": (e)=>{
                    ptrs.current.delete(e.pointerId);
                    const g = gesture.current;
                    if (e.pointerId === g.dragId) g.dragging = false;
                    if (ptrs.current.size < 2) {
                        g.pinching = false;
                        if (ptrs.current.size === 1) {
                            const [id, pos] = [
                                ...ptrs.current.entries()
                            ][0];
                            const p = panRef.current;
                            g.dragging = true;
                            g.dragId = id;
                            g.startCX = pos.x;
                            g.startCY = pos.y;
                            g.origPX = p.panX;
                            g.origPY = p.panY;
                        }
                    }
                }
            }["CropModal.useCallback[setupGesture].onUp"];
            el.addEventListener('pointerdown', onDown, {
                passive: false
            });
            el.addEventListener('pointermove', onMove, {
                passive: false
            });
            el.addEventListener('pointerup', onUp);
            el.addEventListener('pointercancel', onUp);
            return ({
                "CropModal.useCallback[setupGesture]": ()=>{
                    el.removeEventListener('pointerdown', onDown);
                    el.removeEventListener('pointermove', onMove);
                    el.removeEventListener('pointerup', onUp);
                    el.removeEventListener('pointercancel', onUp);
                }
            })["CropModal.useCallback[setupGesture]"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["CropModal.useCallback[setupGesture]"], [
        cropSize.w,
        cropSize.h
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(setupGesture, [
        setupGesture
    ]);
    const handleConfirm = ()=>{
        onConfirm(panX, panY, imgScale);
    };
    // Image display dimensions to fill crop window at scale 1
    const { w: cw, h: ch } = cropSize;
    const nat = imgNatural;
    // Fit natural image into cropSize maintaining aspect, then allow user to scale/pan
    const baseScale = Math.max(cw / nat.w, ch / nat.h);
    const displayW = nat.w * baseScale * imgScale;
    const displayH = nat.h * baseScale * imgScale;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full flex items-center justify-between px-4 py-3",
                style: {
                    color: '#fff'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "text-sm font-medium px-3 py-1.5 rounded-full",
                        style: {
                            background: 'rgba(255,255,255,0.15)'
                        },
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CropModal.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium",
                        style: {
                            fontFamily: 'Inter, sans-serif',
                            letterSpacing: '0.05em'
                        },
                        children: "CROP"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CropModal.tsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleConfirm,
                        className: "text-sm font-semibold px-3 py-1.5 rounded-full",
                        style: {
                            background: '#8B6F5C',
                            color: '#fff'
                        },
                        children: "Done"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CropModal.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CropModal.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: cw,
                    height: ch,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    touchAction: 'none',
                    userSelect: 'none',
                    cursor: 'move'
                },
                ref: containerRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 pointer-events-none",
                        style: {
                            zIndex: 2
                        },
                        children: [
                            [
                                1,
                                2
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        top: 0,
                                        bottom: 0,
                                        left: `${i / 3 * 100}%`,
                                        width: 1,
                                        background: 'rgba(255,255,255,0.35)'
                                    }
                                }, `v${i}`, false, {
                                    fileName: "[project]/src/components/CropModal.tsx",
                                    lineNumber: 237,
                                    columnNumber: 13
                                }, this)),
                            [
                                1,
                                2
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        top: `${i / 3 * 100}%`,
                                        height: 1,
                                        background: 'rgba(255,255,255,0.35)'
                                    }
                                }, `h${i}`, false, {
                                    fileName: "[project]/src/components/CropModal.tsx",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    inset: 0,
                                    border: '2px solid rgba(255,255,255,0.8)',
                                    borderRadius: 4,
                                    boxSizing: 'border-box'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/CropModal.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/CropModal.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        ref: imgRef,
                        src: imageDataUrl,
                        alt: "crop",
                        draggable: false,
                        onLoad: (e)=>{
                            const img = e.currentTarget;
                            setImgNatural({
                                w: img.naturalWidth,
                                h: img.naturalHeight
                            });
                        },
                        style: {
                            position: 'absolute',
                            width: displayW,
                            height: displayH,
                            left: cw / 2 + panX / 100 * cw - displayW / 2,
                            top: ch / 2 + panY / 100 * ch - displayH / 2,
                            pointerEvents: 'none',
                            userSelect: 'none',
                            draggable: false
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/CropModal.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CropModal.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 text-xs",
                style: {
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'Inter, sans-serif'
                },
                children: "Drag to reposition · Pinch to zoom"
            }, void 0, false, {
                fileName: "[project]/src/components/CropModal.tsx",
                lineNumber: 282,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CropModal.tsx",
        lineNumber: 197,
        columnNumber: 5
    }, this);
}
_s(CropModal, "m1JNVsy0ijqQDsssk0prweXm8AY=");
_c = CropModal;
var _c;
__turbopack_context__.k.register(_c, "CropModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/TrashZone.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrashZone",
    ()=>TrashZone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function TrashZone({ visible, targeted, trashRef }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: trashRef,
        style: {
            position: 'fixed',
            bottom: 104,
            left: '50%',
            transform: `translateX(-50%) scale(${visible ? 1 : 0.6})`,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.34,1.4,0.64,1)',
            pointerEvents: 'none',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            willChange: 'transform, opacity'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: targeted ? 'rgba(239,68,68,0.92)' : 'rgba(20,20,20,0.72)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.18s ease, box-shadow 0.18s ease',
                    boxShadow: targeted ? '0 0 0 4px rgba(239,68,68,0.25), 0 8px 24px rgba(239,68,68,0.3)' : '0 4px 20px rgba(0,0,0,0.35)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "28",
                    height: "28",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    style: {
                        overflow: 'visible'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            style: {
                                transformOrigin: '12px 6px',
                                transform: targeted ? 'rotate(-38deg)' : 'rotate(0deg)',
                                transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "3",
                                    y1: "6",
                                    x2: "21",
                                    y2: "6"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/TrashZone.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M8 6V4h8v2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/TrashZone.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/TrashZone.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M19 6l-1 14H6L5 6"
                        }, void 0, false, {
                            fileName: "[project]/src/components/TrashZone.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "10",
                            y1: "11",
                            x2: "10",
                            y2: "17"
                        }, void 0, false, {
                            fileName: "[project]/src/components/TrashZone.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "14",
                            y1: "11",
                            x2: "14",
                            y2: "17"
                        }, void 0, false, {
                            fileName: "[project]/src/components/TrashZone.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/TrashZone.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/TrashZone.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 11,
                    fontWeight: 600,
                    color: targeted ? '#ef4444' : 'rgba(255,255,255,0.85)',
                    transition: 'color 0.18s ease',
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                    letterSpacing: '0.02em',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    whiteSpace: 'nowrap',
                    userSelect: 'none'
                },
                children: targeted ? 'Release to delete' : 'Drag here to delete'
            }, void 0, false, {
                fileName: "[project]/src/components/TrashZone.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/TrashZone.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = TrashZone;
var _c;
__turbopack_context__.k.register(_c, "TrashZone");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PolaroidView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PolaroidView",
    ()=>PolaroidView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePolaroidCanvas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePolaroidCanvas.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageUpload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useImageUpload.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DraggableOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DraggableOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CropModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CropModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTransparentSpotifyCode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useTransparentSpotifyCode.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TrashZone$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TrashZone.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
function PolaroidView() {
    _s();
    const { canvasRef, exportPNG } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePolaroidCanvas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePolaroidCanvas"])();
    const { uploadFile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageUpload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageUpload"])();
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "PolaroidView.useStore[frame]": (s)=>s.frames.find({
                "PolaroidView.useStore[frame]": (f)=>f.id === s.activeFrameId
            }["PolaroidView.useStore[frame]"])
    }["PolaroidView.useStore[frame]"]);
    const activeFrameId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "PolaroidView.useStore[activeFrameId]": (s)=>s.activeFrameId
    }["PolaroidView.useStore[activeFrameId]"]);
    const updateFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "PolaroidView.useStore[updateFrame]": (s)=>s.updateFrame
    }["PolaroidView.useStore[updateFrame]"]);
    const [displaySize, setDisplaySize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        w: 300,
        h: 400
    });
    const [showCrop, setShowCrop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ── Drag-to-trash state ──
    const [dragActive, setDragActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [overTrash, setOverTrash] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const trashZoneRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Calculate scale to fit canvas in container
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PolaroidView.useEffect": ()=>{
            if (!containerRef.current || !frame) return;
            const updateScale = {
                "PolaroidView.useEffect.updateScale": ()=>{
                    const container = containerRef.current;
                    if (!container) return;
                    const availW = container.clientWidth - 32;
                    const availH = container.clientHeight - 32;
                    const scaleX = availW / frame.frameWidth;
                    const scaleY = availH / frame.frameHeight;
                    const scale = Math.min(scaleX, scaleY, 1);
                    setDisplaySize({
                        w: frame.frameWidth * scale,
                        h: frame.frameHeight * scale
                    });
                }
            }["PolaroidView.useEffect.updateScale"];
            updateScale();
            const obs = new ResizeObserver(updateScale);
            obs.observe(containerRef.current);
            return ({
                "PolaroidView.useEffect": ()=>obs.disconnect()
            })["PolaroidView.useEffect"];
        }
    }["PolaroidView.useEffect"], [
        frame?.frameWidth,
        frame?.frameHeight
    ]);
    const handleTap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PolaroidView.useCallback[handleTap]": ()=>{
            if (frame?.imageDataUrl) {
                setShowCrop(true);
            } else {
                fileInputRef.current?.click();
            }
        }
    }["PolaroidView.useCallback[handleTap]"], [
        frame?.imageDataUrl
    ]);
    const handleFile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PolaroidView.useCallback[handleFile]": (e)=>{
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = '';
        }
    }["PolaroidView.useCallback[handleFile]"], [
        uploadFile
    ]);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PolaroidView.useCallback[handleDrop]": (e)=>{
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) uploadFile(file);
        }
    }["PolaroidView.useCallback[handleDrop]"], [
        uploadFile
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PolaroidView.useEffect": ()=>{
            const exportBtn = document.getElementById('export-btn-inner');
            if (exportBtn) exportBtn.onclick = exportPNG;
        }
    }["PolaroidView.useEffect"], [
        exportPNG
    ]);
    // ── Image multi-touch: drag + pinch-zoom (frame stays fixed, only image moves) ──
    const imgGesture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        pointers: new Map(),
        // single drag
        dragging: false,
        dragId: -1,
        startX: 0,
        startY: 0,
        origPanX: 0,
        origPanY: 0,
        // pinch
        pinching: false,
        p0: {
            x: 0,
            y: 0
        },
        p1: {
            x: 0,
            y: 0
        },
        origScale: 1,
        origPanXp: 0,
        origPanYp: 0
    });
    // keep latest frame values accessible inside event handlers
    const frameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(frame);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PolaroidView.useEffect": ()=>{
            frameRef.current = frame;
        }
    }["PolaroidView.useEffect"]);
    const displayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(displaySize);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PolaroidView.useEffect": ()=>{
            displayRef.current = displaySize;
        }
    }["PolaroidView.useEffect"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PolaroidView.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const imgAreaW = {
                "PolaroidView.useEffect.imgAreaW": ()=>{
                    const f = frameRef.current;
                    const d = displayRef.current;
                    if (!f) return 1;
                    return d.w * (f.frameWidth - f.borderLeft - f.borderRight) / f.frameWidth;
                }
            }["PolaroidView.useEffect.imgAreaW"];
            const imgAreaH = {
                "PolaroidView.useEffect.imgAreaH": ()=>{
                    const f = frameRef.current;
                    const d = displayRef.current;
                    if (!f) return 1;
                    return d.h * (f.frameHeight - f.borderTop - f.borderBottom) / f.frameHeight;
                }
            }["PolaroidView.useEffect.imgAreaH"];
            const dist = {
                "PolaroidView.useEffect.dist": (a, b)=>Math.hypot(b.x - a.x, b.y - a.y)
            }["PolaroidView.useEffect.dist"];
            const g = imgGesture.current;
            const onDown = {
                "PolaroidView.useEffect.onDown": (e)=>{
                    const f = frameRef.current;
                    if (!f?.imageDataUrl) return;
                    e.preventDefault();
                    e.stopPropagation();
                    canvas.setPointerCapture(e.pointerId);
                    g.pointers.set(e.pointerId, {
                        x: e.clientX,
                        y: e.clientY
                    });
                    if (g.pointers.size === 1) {
                        g.dragging = true;
                        g.pinching = false;
                        g.dragId = e.pointerId;
                        g.startX = e.clientX;
                        g.startY = e.clientY;
                        g.origPanX = f.imagePanX;
                        g.origPanY = f.imagePanY;
                    } else if (g.pointers.size === 2) {
                        g.dragging = false;
                        g.pinching = true;
                        const pts = [
                            ...g.pointers.values()
                        ];
                        g.p0 = {
                            ...pts[0]
                        };
                        g.p1 = {
                            ...pts[1]
                        };
                        g.origScale = f.imageScale;
                        g.origPanXp = f.imagePanX;
                        g.origPanYp = f.imagePanY;
                    }
                }
            }["PolaroidView.useEffect.onDown"];
            const onMove = {
                "PolaroidView.useEffect.onMove": (e)=>{
                    if (!g.pointers.has(e.pointerId)) return;
                    e.preventDefault();
                    g.pointers.set(e.pointerId, {
                        x: e.clientX,
                        y: e.clientY
                    });
                    if (g.dragging && e.pointerId === g.dragId) {
                        const dx = e.clientX - g.startX;
                        const dy = e.clientY - g.startY;
                        const newPanX = g.origPanX + dx / imgAreaW() * 100;
                        const newPanY = g.origPanY + dy / imgAreaH() * 100;
                        updateFrame(activeFrameId, {
                            imagePanX: Math.max(-300, Math.min(300, newPanX)),
                            imagePanY: Math.max(-300, Math.min(300, newPanY))
                        });
                    }
                    if (g.pinching && g.pointers.size >= 2) {
                        const pts = [
                            ...g.pointers.values()
                        ];
                        const now0 = pts[0], now1 = pts[1];
                        const initDist = dist(g.p0, g.p1);
                        const nowDist = dist(now0, now1);
                        if (initDist > 1) {
                            const scaleFactor = nowDist / initDist;
                            const newScale = Math.max(1, Math.min(4, g.origScale * scaleFactor));
                            // Keep the finger midpoint fixed on the image (zoom-to-cursor like Canva)
                            const areaW = imgAreaW();
                            const areaH = imgAreaH();
                            const f = frameRef.current;
                            const d = displayRef.current;
                            if (f && areaW > 0 && areaH > 0) {
                                const canvasRect = canvas.getBoundingClientRect();
                                // Initial pinch midpoint relative to canvas element
                                const initMidX = (g.p0.x + g.p1.x) / 2 - canvasRect.left;
                                const initMidY = (g.p0.y + g.p1.y) / 2 - canvasRect.top;
                                // Image area top-left in display coords
                                const areaLeft = d.w * f.borderLeft / f.frameWidth;
                                const areaTop = d.h * f.borderTop / f.frameHeight;
                                // Midpoint relative to image area center
                                const relMidX = initMidX - (areaLeft + areaW / 2);
                                const relMidY = initMidY - (areaTop + areaH / 2);
                                // Adjust pan so the same image point stays under the midpoint
                                const curPanOffX = g.origPanXp / 100 * areaW;
                                const curPanOffY = g.origPanYp / 100 * areaH;
                                const newPanOffX = relMidX - (relMidX - curPanOffX) * scaleFactor;
                                const newPanOffY = relMidY - (relMidY - curPanOffY) * scaleFactor;
                                updateFrame(activeFrameId, {
                                    imageScale: newScale,
                                    imagePanX: Math.max(-300, Math.min(300, newPanOffX / areaW * 100)),
                                    imagePanY: Math.max(-300, Math.min(300, newPanOffY / areaH * 100))
                                });
                            } else {
                                updateFrame(activeFrameId, {
                                    imageScale: newScale
                                });
                            }
                        }
                    }
                }
            }["PolaroidView.useEffect.onMove"];
            const onUp = {
                "PolaroidView.useEffect.onUp": (e)=>{
                    g.pointers.delete(e.pointerId);
                    if (e.pointerId === g.dragId) g.dragging = false;
                    if (g.pointers.size < 2) g.pinching = false;
                }
            }["PolaroidView.useEffect.onUp"];
            canvas.addEventListener('pointerdown', onDown, {
                passive: false
            });
            canvas.addEventListener('pointermove', onMove, {
                passive: false
            });
            canvas.addEventListener('pointerup', onUp);
            canvas.addEventListener('pointercancel', onUp);
            return ({
                "PolaroidView.useEffect": ()=>{
                    canvas.removeEventListener('pointerdown', onDown);
                    canvas.removeEventListener('pointermove', onMove);
                    canvas.removeEventListener('pointerup', onUp);
                    canvas.removeEventListener('pointercancel', onUp);
                }
            })["PolaroidView.useEffect"];
        }
    }["PolaroidView.useEffect"], [
        activeFrameId,
        updateFrame,
        canvasRef
    ]);
    // ── Drag-to-trash helpers ──
    const handleDragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PolaroidView.useCallback[handleDragStart]": ()=>{
            setDragActive(true);
            setOverTrash(false);
        }
    }["PolaroidView.useCallback[handleDragStart]"], []);
    const handleDragEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PolaroidView.useCallback[handleDragEnd]": ()=>{
            setDragActive(false);
            setOverTrash(false);
        }
    }["PolaroidView.useCallback[handleDragEnd]"], []);
    const handleDragMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PolaroidView.useCallback[handleDragMove]": (cx, cy)=>{
            const el = trashZoneRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const hit = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
            setOverTrash(hit);
        }
    }["PolaroidView.useCallback[handleDragMove]"], []);
    // Spotify barcode URL
    const spotifyMatch = frame?.musicUrl?.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
    const isTransparentBg = frame?.musicCodeBg === 'transparent';
    const effectiveSpotifyBg = isTransparentBg ? '#FFFFFF' : frame?.musicCodeBg; // Use white as base for removal
    const fgColorStr = frame?.musicCodeFg === '#FFFFFF' ? 'white' : 'black';
    // Get transparent version when needed
    const transparentCodeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTransparentSpotifyCode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransparentSpotifyCode"])(isTransparentBg ? frame?.musicUrl ?? null : null, '#FFFFFF', fgColorStr);
    // Use transparent URL if available, otherwise regular URL
    const spotifyCodeUrl = isTransparentBg ? transparentCodeUrl : spotifyMatch && frame && effectiveSpotifyBg ? `https://scannables.scdn.co/uri/plain/png/${effectiveSpotifyBg.replace('#', '')}/${fgColorStr}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}` : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "w-full h-full flex items-center justify-center p-4 overflow-hidden",
        onDrop: handleDrop,
        onDragOver: (e)=>e.preventDefault(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                style: {
                    width: displaySize.w,
                    height: displaySize.h,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.08)',
                    borderRadius: frame?.borderRadius ? `${frame.borderRadius / frame.frameWidth * displaySize.w}px` : 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: canvasRef,
                        onClick: handleTap,
                        className: "block touch-none",
                        style: {
                            width: '100%',
                            height: '100%',
                            borderRadius: 'inherit',
                            cursor: frame?.imageDataUrl ? 'crosshair' : 'pointer',
                            willChange: 'transform'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/PolaroidView.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this),
                    frame?.topLabelText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DraggableOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DraggableOverlay"], {
                        x: frame.topLabelPos.x,
                        y: frame.topLabelPos.y,
                        rotation: frame.topLabelPos.rotation,
                        scale: frame.topLabelPos.scale,
                        containerW: displaySize.w,
                        containerH: displaySize.h,
                        onMove: (nx, ny)=>updateFrame(activeFrameId, {
                                topLabelPos: {
                                    ...frame.topLabelPos,
                                    x: nx,
                                    y: ny
                                }
                            }),
                        onRotate: (deg)=>updateFrame(activeFrameId, {
                                topLabelPos: {
                                    ...frame.topLabelPos,
                                    rotation: deg
                                }
                            }),
                        onScale: (s)=>updateFrame(activeFrameId, {
                                topLabelPos: {
                                    ...frame.topLabelPos,
                                    scale: s
                                }
                            }),
                        onDragStart: handleDragStart,
                        onDragEnd: handleDragEnd,
                        onDragMove: handleDragMove,
                        overTrash: overTrash,
                        onDelete: ()=>updateFrame(activeFrameId, {
                                topLabelText: ''
                            }),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "whitespace-nowrap pointer-events-none",
                            style: {
                                fontFamily: `"${frame.topLabelFont}", cursive`,
                                fontSize: `${frame.topLabelSize / frame.frameHeight * displaySize.h}px`,
                                color: frame.topLabelColor,
                                lineHeight: 1.2,
                                textShadow: frame.frameColor === '#FFFFFF' ? 'none' : '0 1px 3px rgba(0,0,0,0.2)'
                            },
                            children: frame.topLabelText
                        }, void 0, false, {
                            fileName: "[project]/src/components/PolaroidView.tsx",
                            lineNumber: 304,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/PolaroidView.tsx",
                        lineNumber: 288,
                        columnNumber: 11
                    }, this),
                    frame?.bottomCaptionText && frame.templateId !== 'movie-poster' && frame.templateId !== 'concert-ticket' && frame.templateId !== 'vintage-color' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DraggableOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DraggableOverlay"], {
                        x: frame.bottomCaptionPos.x,
                        y: frame.bottomCaptionPos.y,
                        rotation: frame.bottomCaptionPos.rotation,
                        scale: frame.bottomCaptionPos.scale,
                        containerW: displaySize.w,
                        containerH: displaySize.h,
                        onMove: (nx, ny)=>updateFrame(activeFrameId, {
                                bottomCaptionPos: {
                                    ...frame.bottomCaptionPos,
                                    x: nx,
                                    y: ny
                                }
                            }),
                        onRotate: (deg)=>updateFrame(activeFrameId, {
                                bottomCaptionPos: {
                                    ...frame.bottomCaptionPos,
                                    rotation: deg
                                }
                            }),
                        onScale: (s)=>updateFrame(activeFrameId, {
                                bottomCaptionPos: {
                                    ...frame.bottomCaptionPos,
                                    scale: s
                                }
                            }),
                        onDragStart: handleDragStart,
                        onDragEnd: handleDragEnd,
                        onDragMove: handleDragMove,
                        overTrash: overTrash,
                        onDelete: ()=>updateFrame(activeFrameId, {
                                bottomCaptionText: ''
                            }),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "whitespace-nowrap pointer-events-none",
                            style: {
                                fontFamily: `"${frame.bottomCaptionFont}", sans-serif`,
                                fontSize: `${frame.bottomCaptionSize / frame.frameHeight * displaySize.h}px`,
                                color: frame.bottomCaptionColor,
                                lineHeight: 1.2
                            },
                            children: frame.bottomCaptionText
                        }, void 0, false, {
                            fileName: "[project]/src/components/PolaroidView.tsx",
                            lineNumber: 340,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/PolaroidView.tsx",
                        lineNumber: 324,
                        columnNumber: 13
                    }, this),
                    spotifyCodeUrl && frame && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DraggableOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DraggableOverlay"], {
                        x: frame.musicPos.x,
                        y: frame.musicPos.y,
                        rotation: frame.musicPos.rotation,
                        scale: frame.musicPos.scale,
                        containerW: displaySize.w,
                        containerH: displaySize.h,
                        onMove: (nx, ny)=>updateFrame(activeFrameId, {
                                musicPos: {
                                    ...frame.musicPos,
                                    x: nx,
                                    y: ny
                                }
                            }),
                        onRotate: (deg)=>updateFrame(activeFrameId, {
                                musicPos: {
                                    ...frame.musicPos,
                                    rotation: deg
                                }
                            }),
                        onScale: (s)=>updateFrame(activeFrameId, {
                                musicPos: {
                                    ...frame.musicPos,
                                    scale: s
                                }
                            }),
                        onDragStart: handleDragStart,
                        onDragEnd: handleDragEnd,
                        onDragMove: handleDragMove,
                        overTrash: overTrash,
                        onDelete: ()=>updateFrame(activeFrameId, {
                                musicUrl: ''
                            }),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: spotifyCodeUrl,
                            alt: "Spotify code",
                            crossOrigin: "anonymous",
                            draggable: false,
                            className: "pointer-events-none block",
                            style: {
                                height: `${displaySize.h * 0.065}px`,
                                maxWidth: 'none'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/PolaroidView.tsx",
                            lineNumber: 372,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/PolaroidView.tsx",
                        lineNumber: 356,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PolaroidView.tsx",
                lineNumber: 263,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TrashZone$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrashZone"], {
                visible: dragActive,
                targeted: overTrash,
                trashRef: trashZoneRef
            }, void 0, false, {
                fileName: "[project]/src/components/PolaroidView.tsx",
                lineNumber: 385,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: fileInputRef,
                type: "file",
                accept: "image/jpeg,image/png,image/webp",
                className: "hidden",
                onChange: handleFile
            }, void 0, false, {
                fileName: "[project]/src/components/PolaroidView.tsx",
                lineNumber: 391,
                columnNumber: 7
            }, this),
            showCrop && frame?.imageDataUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CropModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CropModal"], {
                imageDataUrl: frame.imageDataUrl,
                aspectW: frame.frameWidth - frame.borderLeft - frame.borderRight,
                aspectH: frame.frameHeight - frame.borderTop - frame.borderBottom,
                initialPanX: frame.imagePanX,
                initialPanY: frame.imagePanY,
                initialScale: frame.imageScale,
                onClose: ()=>setShowCrop(false),
                onConfirm: (px, py, sc)=>{
                    updateFrame(activeFrameId, {
                        imagePanX: px,
                        imagePanY: py,
                        imageScale: sc
                    });
                    setShowCrop(false);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/PolaroidView.tsx",
                lineNumber: 401,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/PolaroidView.tsx",
        lineNumber: 257,
        columnNumber: 5
    }, this);
}
_s(PolaroidView, "C63/GEZ9YMwO1ZFfeHnM6lYPeMI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePolaroidCanvas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePolaroidCanvas"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageUpload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageUpload"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTransparentSpotifyCode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransparentSpotifyCode"]
    ];
});
_c = PolaroidView;
var _c;
__turbopack_context__.k.register(_c, "PolaroidView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BottomSheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BottomSheet",
    ()=>BottomSheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function BottomSheet({ open, onClose, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `fixed inset-0 bottom-[52px] z-25 bg-[#5C4A3A]/20 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`,
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/src/components/BottomSheet.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `fixed inset-x-0 bottom-[52px] z-30 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#FFFCF8] rounded-t-2xl shadow-[0_-4px_30px_rgba(92,74,58,0.08)] border-t border-[#F0E6DA] max-h-[50vh] flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center pt-2.5 pb-1.5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "w-9 h-1 bg-[#E0D5C9] rounded-full active:bg-[#D4C5B5] transition-colors",
                                "aria-label": "Close panel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BottomSheet.tsx",
                                lineNumber: 29,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/BottomSheet.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto px-5 pb-5 overscroll-contain text-[#5C4A3A]",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/components/BottomSheet.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/BottomSheet.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/BottomSheet.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = BottomSheet;
var _c;
__turbopack_context__.k.register(_c, "BottomSheet");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useImageColors.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useImageColors",
    ()=>useImageColors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useImageColors(imageDataUrl, count = 6) {
    _s();
    const [colors, setColors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useImageColors.useEffect": ()=>{
            if (!imageDataUrl) {
                setColors([]);
                return;
            }
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = ({
                "useImageColors.useEffect": ()=>{
                    // Down-scale to a small canvas for fast sampling
                    const SIZE = 80;
                    const canvas = document.createElement('canvas');
                    canvas.width = SIZE;
                    canvas.height = SIZE;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    ctx.drawImage(img, 0, 0, SIZE, SIZE);
                    const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
                    // Collect all pixels, skip near-white and near-black edge pixels
                    const pixels = [];
                    for(let i = 0; i < data.length; i += 4){
                        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                        if (a < 128) continue;
                        pixels.push([
                            r,
                            g,
                            b
                        ]);
                    }
                    // Simple k-means with k=count, 8 iterations
                    const palette = kMeans(pixels, count, 8);
                    setColors(palette.map(toHex));
                }
            })["useImageColors.useEffect"];
            img.src = imageDataUrl;
        }
    }["useImageColors.useEffect"], [
        imageDataUrl,
        count
    ]);
    return colors;
}
_s(useImageColors, "sxDRJfNxPuNYCG1YL013QtgNLrU=");
// ── helpers ───────────────────────────────────────────────────────────────────
function toHex([r, g, b]) {
    return '#' + [
        r,
        g,
        b
    ].map((v)=>Math.round(v).toString(16).padStart(2, '0')).join('');
}
function colorDist(a, b) {
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}
function kMeans(pixels, k, iterations) {
    if (pixels.length === 0) return [];
    // Init centroids by sampling evenly spaced pixels
    const step = Math.max(1, Math.floor(pixels.length / k));
    let centroids = Array.from({
        length: k
    }, (_, i)=>[
            ...pixels[Math.min(i * step, pixels.length - 1)]
        ]);
    for(let iter = 0; iter < iterations; iter++){
        // Assign each pixel to nearest centroid
        const buckets = Array.from({
            length: k
        }, ()=>[]);
        for (const px of pixels){
            let best = 0, bestDist = Infinity;
            for(let c = 0; c < k; c++){
                const d = colorDist(px, centroids[c]);
                if (d < bestDist) {
                    bestDist = d;
                    best = c;
                }
            }
            buckets[best].push(px);
        }
        // Recalculate centroids
        centroids = centroids.map((prev, c)=>{
            if (buckets[c].length === 0) return prev;
            const n = buckets[c].length;
            return [
                buckets[c].reduce((s, p)=>s + p[0], 0) / n,
                buckets[c].reduce((s, p)=>s + p[1], 0) / n,
                buckets[c].reduce((s, p)=>s + p[2], 0) / n
            ];
        });
    }
    // Sort by perceived brightness (dark → light) for a tidy swatch row
    return centroids.sort((a, b)=>0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2] - (0.299 * b[0] + 0.587 * b[1] + 0.114 * b[2]));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/panels/FramePanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FramePanel",
    ()=>FramePanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageUpload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useImageUpload.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageColors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useImageColors.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function FramePanel() {
    _s();
    const activeFrameId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "FramePanel.useStore[activeFrameId]": (s)=>s.activeFrameId
    }["FramePanel.useStore[activeFrameId]"]);
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "FramePanel.useStore[frame]": (s)=>s.frames.find({
                "FramePanel.useStore[frame]": (f)=>f.id === s.activeFrameId
            }["FramePanel.useStore[frame]"])
    }["FramePanel.useStore[frame]"]);
    const updateFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "FramePanel.useStore[updateFrame]": (s)=>s.updateFrame
    }["FramePanel.useStore[updateFrame]"]);
    const applyTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "FramePanel.useStore[applyTemplate]": (s)=>s.applyTemplate
    }["FramePanel.useStore[applyTemplate]"]);
    const { uploadFile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageUpload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageUpload"])();
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const photoColors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageColors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageColors"])(frame?.imageDataUrl ?? null);
    const handleFile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FramePanel.useCallback[handleFile]": (e)=>{
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = '';
        }
    }["FramePanel.useCallback[handleFile]"], [
        uploadFile
    ]);
    if (!frame) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2",
                        children: "Photo"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>fileInputRef.current?.click(),
                        className: "w-full py-3 rounded-xl border-2 border-dashed border-[#E0D5C9] text-sm text-[#8B7B6B] font-medium hover:border-[#C4B5A6] active:bg-[#F8F3EE] transition-colors",
                        children: frame.imageDataUrl ? 'Change Photo' : 'Upload Photo'
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: fileInputRef,
                        type: "file",
                        accept: "image/jpeg,image/png,image/webp",
                        className: "hidden",
                        onChange: handleFile
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/FramePanel.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-3",
                        children: "Template"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-4 gap-2",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["POLAROID_TEMPLATES"].map((tmpl)=>{
                            const isActive = frame.templateId === tmpl.id;
                            // Mini preview proportions
                            const maxH = 56;
                            const scale = maxH / tmpl.frameHeight;
                            const w = tmpl.frameWidth * scale;
                            const h = tmpl.frameHeight * scale;
                            const bt = tmpl.borderTop * scale;
                            const bl = tmpl.borderLeft * scale;
                            const br = tmpl.borderRight * scale;
                            const bb = tmpl.borderBottom * scale;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>applyTemplate(activeFrameId, tmpl.id),
                                className: `flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${isActive ? 'bg-[#8B6F5C]/10 ring-2 ring-[#8B6F5C] shadow-sm' : 'bg-[#F8F3EE] hover:bg-[#F3EBE3] active:scale-95'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative rounded-[2px] shadow-sm",
                                        style: {
                                            width: w,
                                            height: h,
                                            backgroundColor: tmpl.frameColor,
                                            border: '1px solid #E8DFD6'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute",
                                            style: {
                                                top: bt,
                                                left: bl,
                                                right: br,
                                                bottom: bb,
                                                width: w - bl - br,
                                                height: h - bt - bb,
                                                backgroundColor: '#D4C5B5'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/panels/FramePanel.tsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                                        lineNumber: 71,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-[9px] font-medium leading-tight text-center ${isActive ? 'text-[#5C4A3A]' : 'text-[#A39080]'}`,
                                        children: tmpl.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                                        lineNumber: 93,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, tmpl.id, true, {
                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                lineNumber: 61,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/FramePanel.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2",
                        children: "Color"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 items-center",
                        children: [
                            [
                                '#FFFFFF',
                                '#F5EDD6',
                                '#1A1A1A',
                                '#F0E4D7',
                                '#F2EDE8',
                                '#E4E8F0'
                            ].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>updateFrame(activeFrameId, {
                                            frameColor: color
                                        }),
                                    className: `w-8 h-8 rounded-full border-2 transition-all ${frame.frameColor === color ? 'border-[#8B6F5C] scale-110 ring-2 ring-[#8B6F5C]/20' : 'border-[#E8DFD6]'}`,
                                    style: {
                                        backgroundColor: color
                                    }
                                }, color, false, {
                                    fileName: "[project]/src/components/panels/FramePanel.tsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: frame.frameColor,
                                onChange: (e)=>updateFrame(activeFrameId, {
                                        frameColor: e.target.value
                                    }),
                                className: "w-8 h-8 rounded-full cursor-pointer border-0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    photoColors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-3 h-3 text-[#A39080]",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M2 22l4-4m0 0L14.5 9.5M6 18l8.5-8.5m0 0l2-2a2.828 2.828 0 1 1 4 4l-2 2L6 18z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                                lineNumber: 134,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M19.5 6.5l-2-2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                                lineNumber: 135,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] font-medium text-[#A39080] uppercase tracking-widest",
                                        children: "From photo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 flex-wrap",
                                children: photoColors.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        title: color,
                                        onClick: ()=>updateFrame(activeFrameId, {
                                                frameColor: color
                                            }),
                                        className: `w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${frame.frameColor === color ? 'border-[#8B6F5C] scale-110 ring-2 ring-[#8B6F5C]/20' : 'border-[#E8DFD6]'}`,
                                        style: {
                                            backgroundColor: color
                                        }
                                    }, color, false, {
                                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/FramePanel.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest",
                                children: "Caption Area"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] text-[#C4B5A6]",
                                children: [
                                    frame.borderBottom,
                                    "px"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0",
                        max: "450",
                        value: frame.borderBottom,
                        onChange: (e)=>updateFrame(activeFrameId, {
                                borderBottom: Number(e.target.value),
                                templateId: 'custom'
                            }),
                        className: "w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/FramePanel.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest",
                                children: "Borders"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] text-[#C4B5A6]",
                                children: [
                                    frame.borderLeft,
                                    "px"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0",
                        max: "150",
                        value: frame.borderLeft,
                        onChange: (e)=>{
                            const v = Number(e.target.value);
                            updateFrame(activeFrameId, {
                                borderLeft: v,
                                borderRight: v,
                                borderTop: v,
                                templateId: 'custom'
                            });
                        },
                        className: "w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/FramePanel.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest",
                                children: "Rounded Corners"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] text-[#C4B5A6]",
                                children: [
                                    frame.borderRadius,
                                    "px"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/FramePanel.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0",
                        max: "30",
                        value: frame.borderRadius,
                        onChange: (e)=>updateFrame(activeFrameId, {
                                borderRadius: Number(e.target.value)
                            }),
                        className: "w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FramePanel.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/FramePanel.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/panels/FramePanel.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(FramePanel, "6q1GpfupIluqdokoMZ21e6tTo8g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageUpload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageUpload"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageColors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageColors"]
    ];
});
_c = FramePanel;
var _c;
__turbopack_context__.k.register(_c, "FramePanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/panels/EditPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EditPanel",
    ()=>EditPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function EditPanel() {
    _s();
    const activeFrameId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "EditPanel.useStore[activeFrameId]": (s)=>s.activeFrameId
    }["EditPanel.useStore[activeFrameId]"]);
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "EditPanel.useStore[frame]": (s)=>s.frames.find({
                "EditPanel.useStore[frame]": (f)=>f.id === s.activeFrameId
            }["EditPanel.useStore[frame]"])
    }["EditPanel.useStore[frame]"]);
    const updateFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "EditPanel.useStore[updateFrame]": (s)=>s.updateFrame
    }["EditPanel.useStore[updateFrame]"]);
    if (!frame) return null;
    const setFilter = (key, value)=>{
        updateFrame(activeFrameId, {
            filters: {
                ...frame.filters,
                [key]: value
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2",
                        children: "Presets"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/EditPanel.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 overflow-x-auto pb-1 scrollbar-hide",
                        children: Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILTER_PRESETS"]).map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>updateFrame(activeFrameId, {
                                        filters: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILTER_PRESETS"][name]
                                    }),
                                className: `flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium capitalize transition-all ${JSON.stringify(frame.filters) === JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILTER_PRESETS"][name]) ? 'bg-[#8B6F5C] text-white shadow-sm' : 'bg-[#F5EDE5] text-[#8B7B6B] active:bg-[#EDE3D9]'}`,
                                children: name
                            }, name, false, {
                                fileName: "[project]/src/components/panels/EditPanel.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/EditPanel.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/EditPanel.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Slider, {
                label: "Brightness",
                value: frame.filters.brightness,
                onChange: (v)=>setFilter('brightness', v)
            }, void 0, false, {
                fileName: "[project]/src/components/panels/EditPanel.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Slider, {
                label: "Contrast",
                value: frame.filters.contrast,
                onChange: (v)=>setFilter('contrast', v)
            }, void 0, false, {
                fileName: "[project]/src/components/panels/EditPanel.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Slider, {
                label: "Saturation",
                value: frame.filters.saturation,
                onChange: (v)=>setFilter('saturation', v)
            }, void 0, false, {
                fileName: "[project]/src/components/panels/EditPanel.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Slider, {
                label: "Warmth",
                value: frame.filters.warmth,
                onChange: (v)=>setFilter('warmth', v)
            }, void 0, false, {
                fileName: "[project]/src/components/panels/EditPanel.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest",
                                children: "Rotation"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/EditPanel.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] text-[#C4B5A6]",
                                children: [
                                    frame.imageRotation,
                                    "°"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/EditPanel.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/EditPanel.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "-180",
                        max: "180",
                        value: frame.imageRotation,
                        onChange: (e)=>updateFrame(activeFrameId, {
                                imageRotation: Number(e.target.value)
                            }),
                        className: "w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/EditPanel.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/EditPanel.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest",
                                children: "Zoom"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/EditPanel.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] text-[#C4B5A6]",
                                children: [
                                    Math.round(frame.imageScale * 100),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/EditPanel.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/EditPanel.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "100",
                        max: "300",
                        value: Math.round(frame.imageScale * 100),
                        onChange: (e)=>updateFrame(activeFrameId, {
                                imageScale: Number(e.target.value) / 100
                            }),
                        className: "w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/EditPanel.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/EditPanel.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            frame.imageDataUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>updateFrame(activeFrameId, {
                        imageDataUrl: null,
                        imagePanX: 0,
                        imagePanY: 0,
                        imageScale: 1,
                        imageRotation: 0
                    }),
                className: "w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "14",
                        height: "14",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                points: "3 6 5 6 21 6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/EditPanel.tsx",
                                lineNumber: 80,
                                columnNumber: 154
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M19 6l-1 14H6L5 6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/EditPanel.tsx",
                                lineNumber: 80,
                                columnNumber: 187
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M10 11v6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/EditPanel.tsx",
                                lineNumber: 80,
                                columnNumber: 216
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M14 11v6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/EditPanel.tsx",
                                lineNumber: 80,
                                columnNumber: 236
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M9 6V4h6v2"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/EditPanel.tsx",
                                lineNumber: 80,
                                columnNumber: 256
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/EditPanel.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    "Remove Photo"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/EditPanel.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/panels/EditPanel.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_s(EditPanel, "GpWurxtsnxRu8Di0mYnEKoIyFvQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
_c = EditPanel;
function Slider({ label, value, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/EditPanel.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-[#C4B5A6]",
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/EditPanel.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/EditPanel.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "range",
                min: "-100",
                max: "100",
                value: value,
                onChange: (e)=>onChange(Number(e.target.value)),
                className: "w-full"
            }, void 0, false, {
                fileName: "[project]/src/components/panels/EditPanel.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/panels/EditPanel.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_c1 = Slider;
var _c, _c1;
__turbopack_context__.k.register(_c, "EditPanel");
__turbopack_context__.k.register(_c1, "Slider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/panels/TextPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextPanel",
    ()=>TextPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const FONTS = [
    {
        id: 'Dancing Script',
        label: 'Script',
        category: 'cursive'
    },
    {
        id: 'Great Vibes',
        label: 'Elegant',
        category: 'cursive'
    },
    {
        id: 'Satisfy',
        label: 'Flow',
        category: 'cursive'
    },
    {
        id: 'Sacramento',
        label: 'Signature',
        category: 'cursive'
    },
    {
        id: 'Parisienne',
        label: 'Paris',
        category: 'cursive'
    },
    {
        id: 'Playfair Display',
        label: 'Editorial',
        category: 'serif'
    },
    {
        id: 'Cormorant Garamond',
        label: 'Classic',
        category: 'serif'
    },
    {
        id: 'Lora',
        label: 'Book',
        category: 'serif'
    },
    {
        id: 'Inter',
        label: 'Clean',
        category: 'sans-serif'
    },
    {
        id: 'Montserrat',
        label: 'Modern',
        category: 'sans-serif'
    },
    {
        id: 'Bebas Neue',
        label: 'Bold',
        category: 'sans-serif'
    },
    {
        id: 'Courier Prime',
        label: 'Type',
        category: 'monospace'
    },
    {
        id: 'Special Elite',
        label: 'Vintage',
        category: 'monospace'
    }
];
function FieldInput({ label, value, onChange, placeholder, hint }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-baseline mb-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[9px] text-[#C4B5A6]",
                        children: hint
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 36,
                        columnNumber: 18
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/TextPanel.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                value: value,
                onChange: (e)=>onChange(e.target.value),
                placeholder: placeholder,
                className: "w-full px-3 py-2 rounded-xl border border-[#E8DFD6] text-sm text-[#5C4A3A] focus:outline-none focus:border-[#C4B5A6] transition-colors bg-[#F8F3EE] placeholder:text-[#C4B5A6]"
            }, void 0, false, {
                fileName: "[project]/src/components/panels/TextPanel.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/panels/TextPanel.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c = FieldInput;
function TextPanel() {
    _s();
    const activeFrameId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "TextPanel.useStore[activeFrameId]": (s)=>s.activeFrameId
    }["TextPanel.useStore[activeFrameId]"]);
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "TextPanel.useStore[frame]": (s)=>s.frames.find({
                "TextPanel.useStore[frame]": (f)=>f.id === s.activeFrameId
            }["TextPanel.useStore[frame]"])
    }["TextPanel.useStore[frame]"]);
    const updateFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "TextPanel.useStore[updateFrame]": (s)=>s.updateFrame
    }["TextPanel.useStore[updateFrame]"]);
    if (!frame) return null;
    const isMoviePoster = frame.templateId === 'movie-poster';
    const isVintage = frame.templateId === 'vintage-color';
    const isConcertTicket = frame.templateId === 'concert-ticket';
    const isRich = isMoviePoster || isVintage || isConcertTicket;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            isMoviePoster && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest border-b border-[#EDE5DC] pb-1.5",
                        children: "Movie Poster"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Title",
                                value: frame.movieTitle,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        movieTitle: v
                                    }),
                                placeholder: "MOVIE TITLE",
                                hint: "Bebas Neue"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Year",
                                value: frame.movieYear,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        movieYear: v
                                    }),
                                placeholder: "2026"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Directed by",
                                value: frame.movieDirector,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        movieDirector: v
                                    }),
                                placeholder: "Your Name",
                                hint: "Courier Prime"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Starring",
                                value: frame.movieCast,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        movieCast: v
                                    }),
                                placeholder: "Actor One · Actor Two",
                                hint: "red accent"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Produced by",
                                value: frame.captionSubtext,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        captionSubtext: v
                                    }),
                                placeholder: "Producer Name"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[9px] text-[#C4B5A6] pt-1",
                        children: "Layout is fixed. Fonts: Bebas Neue + Courier Prime."
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/TextPanel.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this),
            isConcertTicket && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest border-b border-[#EDE5DC] pb-1.5",
                        children: "Concert Ticket"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Artist",
                                value: frame.movieTitle,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        movieTitle: v
                                    }),
                                placeholder: "ARTIST NAME",
                                hint: "Bebas Neue"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 88,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Venue",
                                value: frame.movieDirector,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        movieDirector: v
                                    }),
                                placeholder: "VENUE · CITY",
                                hint: "Courier Prime"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Date / Show",
                                value: frame.movieCast,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        movieCast: v
                                    }),
                                placeholder: "MAY 04 · 2026"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Section / Row",
                                value: frame.captionSubtext,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        captionSubtext: v
                                    }),
                                placeholder: "GA · FLOOR",
                                hint: "Bebas Neue"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[9px] text-[#C4B5A6] pt-1",
                        children: "Ticket stub layout — fixed positions."
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/TextPanel.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this),
            isVintage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest border-b border-[#EDE5DC] pb-1.5",
                        children: "Vintage Caption"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Caption",
                                value: frame.bottomCaptionText,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        bottomCaptionText: v
                                    }),
                                placeholder: "summer '24",
                                hint: "Courier Prime"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldInput, {
                                label: "Date line",
                                value: frame.captionSubtext,
                                onChange: (v)=>updateFrame(activeFrameId, {
                                        captionSubtext: v
                                    }),
                                placeholder: "JUNE · 2026",
                                hint: "smaller"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/TextPanel.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest",
                                children: "Top Label"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            frame.topLabelText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>updateFrame(activeFrameId, {
                                        topLabelText: ''
                                    }),
                                className: "flex items-center gap-1 text-[10px] text-[#C07A5A] hover:text-[#A0523A] transition-colors",
                                title: "Clear top label",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "10",
                                        height: "10",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "3 6 5 6 21 6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 120,
                                                columnNumber: 160
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M19 6l-1 14H6L5 6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 120,
                                                columnNumber: 193
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M10 11v6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 120,
                                                columnNumber: 222
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M14 11v6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 120,
                                                columnNumber: 242
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 6V4h6v2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 120,
                                                columnNumber: 262
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, this),
                                    "Clear"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: frame.topLabelText,
                        onChange: (e)=>updateFrame(activeFrameId, {
                                topLabelText: e.target.value
                            }),
                        placeholder: "e.g. Your name, location, date",
                        className: "w-full px-3 py-2.5 rounded-xl border border-[#E8DFD6] text-sm text-[#5C4A3A] focus:outline-none focus:border-[#C4B5A6] transition-colors bg-[#F8F3EE] placeholder:text-[#C4B5A6]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide",
                        children: FONTS.map((font)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>updateFrame(activeFrameId, {
                                        topLabelFont: font.id
                                    }),
                                className: `flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${frame.topLabelFont === font.id ? 'bg-[#8B6F5C] text-white shadow-sm' : 'bg-[#F5EDE5] text-[#8B7B6B] active:bg-[#EDE3D9]'}`,
                                style: {
                                    fontFamily: `"${font.id}", ${font.category}`
                                },
                                children: font.label
                            }, font.id, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 mt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between mb-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-[#C4B5A6]",
                                                children: "Size"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 151,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-[#C4B5A6]",
                                                children: [
                                                    frame.topLabelSize,
                                                    "px"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 152,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: "24",
                                        max: "96",
                                        value: frame.topLabelSize,
                                        onChange: (e)=>updateFrame(activeFrameId, {
                                                topLabelSize: Number(e.target.value)
                                            }),
                                        className: "w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                                        lineNumber: 154,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: frame.topLabelColor,
                                onChange: (e)=>updateFrame(activeFrameId, {
                                        topLabelColor: e.target.value
                                    }),
                                className: "w-8 h-8 rounded-full border-2 border-[#E8DFD6] cursor-pointer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/TextPanel.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            !isRich && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest",
                                children: "Bottom Caption"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this),
                            frame.bottomCaptionText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>updateFrame(activeFrameId, {
                                        bottomCaptionText: ''
                                    }),
                                className: "flex items-center gap-1 text-[10px] text-[#C07A5A] hover:text-[#A0523A] transition-colors",
                                title: "Clear bottom caption",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "10",
                                        height: "10",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "3 6 5 6 21 6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 183,
                                                columnNumber: 162
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M19 6l-1 14H6L5 6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 183,
                                                columnNumber: 195
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M10 11v6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 183,
                                                columnNumber: 224
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M14 11v6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 183,
                                                columnNumber: 244
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 6V4h6v2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 183,
                                                columnNumber: 264
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                                        lineNumber: 183,
                                        columnNumber: 17
                                    }, this),
                                    "Clear"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 178,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: frame.bottomCaptionText,
                        onChange: (e)=>updateFrame(activeFrameId, {
                                bottomCaptionText: e.target.value
                            }),
                        placeholder: "e.g. Song title, quote, memory",
                        className: "w-full px-3 py-2.5 rounded-xl border border-[#E8DFD6] text-sm text-[#5C4A3A] focus:outline-none focus:border-[#C4B5A6] transition-colors bg-[#F8F3EE] placeholder:text-[#C4B5A6]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide",
                        children: FONTS.map((font)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>updateFrame(activeFrameId, {
                                        bottomCaptionFont: font.id
                                    }),
                                className: `flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${frame.bottomCaptionFont === font.id ? 'bg-[#8B6F5C] text-white shadow-sm' : 'bg-[#F5EDE5] text-[#8B7B6B] active:bg-[#EDE3D9]'}`,
                                style: {
                                    fontFamily: `"${font.id}", ${font.category}`
                                },
                                children: font.label
                            }, font.id, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 197,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 mt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between mb-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-[#C4B5A6]",
                                                children: "Size"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 214,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] text-[#C4B5A6]",
                                                children: [
                                                    frame.bottomCaptionSize,
                                                    "px"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                                lineNumber: 215,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                                        lineNumber: 213,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: "20",
                                        max: "72",
                                        value: frame.bottomCaptionSize,
                                        onChange: (e)=>updateFrame(activeFrameId, {
                                                bottomCaptionSize: Number(e.target.value)
                                            }),
                                        className: "w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                                        lineNumber: 217,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: frame.bottomCaptionColor,
                                onChange: (e)=>updateFrame(activeFrameId, {
                                        bottomCaptionColor: e.target.value
                                    }),
                                className: "w-8 h-8 rounded-full border-2 border-[#E8DFD6] cursor-pointer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/TextPanel.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/TextPanel.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/TextPanel.tsx",
                lineNumber: 174,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] text-[#C4B5A6] text-center pt-1",
                children: isRich ? 'Tap the text fields above to edit. Top label is draggable on the canvas.' : 'Drag text on the polaroid to reposition. Pinch with two fingers to rotate & resize.'
            }, void 0, false, {
                fileName: "[project]/src/components/panels/TextPanel.tsx",
                lineNumber: 237,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/panels/TextPanel.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(TextPanel, "GpWurxtsnxRu8Di0mYnEKoIyFvQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
_c1 = TextPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "FieldInput");
__turbopack_context__.k.register(_c1, "TextPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/panels/MusicPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MusicPanel",
    ()=>MusicPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageColors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useImageColors.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTransparentSpotifyCode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useTransparentSpotifyCode.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const CODE_BG_COLORS = [
    {
        id: 'transparent',
        label: 'Transparent'
    },
    {
        id: '#FFFFFF',
        label: 'White'
    },
    {
        id: '#000000',
        label: 'Black'
    },
    {
        id: '#1DB954',
        label: 'Green'
    },
    {
        id: '#F5EDD6',
        label: 'Cream'
    },
    {
        id: '#191414',
        label: 'Dark'
    },
    {
        id: '#282828',
        label: 'Gray'
    }
];
function MusicPanel() {
    _s();
    const activeFrameId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "MusicPanel.useStore[activeFrameId]": (s)=>s.activeFrameId
    }["MusicPanel.useStore[activeFrameId]"]);
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "MusicPanel.useStore[frame]": (s)=>s.frames.find({
                "MusicPanel.useStore[frame]": (f)=>f.id === s.activeFrameId
            }["MusicPanel.useStore[frame]"])
    }["MusicPanel.useStore[frame]"]);
    const updateFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "MusicPanel.useStore[updateFrame]": (s)=>s.updateFrame
    }["MusicPanel.useStore[updateFrame]"]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(frame?.musicUrl || '');
    const photoColors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageColors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageColors"])(frame?.imageDataUrl ?? null);
    if (!frame) return null;
    const handleApply = ()=>{
        updateFrame(activeFrameId, {
            musicUrl: input
        });
    };
    const spotifyMatch = input.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
    const fgColor = frame.musicCodeFg === '#FFFFFF' ? 'white' : 'black';
    const isTransparentBg = frame.musicCodeBg === 'transparent';
    // Use white as base for transparent (we'll remove it)
    const effectiveBg = isTransparentBg ? '#FFFFFF' : frame.musicCodeBg;
    // Get transparent version when needed
    const transparentCodeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTransparentSpotifyCode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransparentSpotifyCode"])(isTransparentBg && spotifyMatch ? input : null, '#FFFFFF', fgColor);
    const previewUrl = isTransparentBg ? transparentCodeUrl : spotifyMatch ? `https://scannables.scdn.co/uri/plain/png/${effectiveBg.replace('#', '')}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}` : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2",
                        children: "Spotify Link"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "url",
                        value: input,
                        onChange: (e)=>setInput(e.target.value),
                        placeholder: "Paste Spotify track/album/playlist URL",
                        className: "w-full px-3 py-2.5 rounded-xl border border-[#E8DFD6] text-sm text-[#5C4A3A] focus:outline-none focus:border-[#C4B5A6] transition-colors bg-[#F8F3EE] placeholder:text-[#C4B5A6]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            previewUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2",
                        children: "Preview"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl p-4 flex justify-center border border-[#E8DFD6]",
                        style: {
                            backgroundColor: isTransparentBg ? frame.frameColor : effectiveBg,
                            backgroundImage: isTransparentBg ? 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)' : undefined,
                            backgroundSize: isTransparentBg ? '16px 16px' : undefined,
                            backgroundPosition: isTransparentBg ? '0 0, 0 8px, 8px -8px, -8px 0px' : undefined
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: previewUrl,
                            alt: "Spotify scan code",
                            className: "h-10 object-contain",
                            crossOrigin: "anonymous"
                        }, void 0, false, {
                            fileName: "[project]/src/components/panels/MusicPanel.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleApply,
                disabled: !input.trim(),
                className: "w-full py-3 rounded-xl bg-[#8B6F5C] text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm",
                children: frame.musicUrl ? 'Update Code' : 'Add to Polaroid'
            }, void 0, false, {
                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            frame.musicUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2",
                                children: "Code Background"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 flex-wrap",
                                children: [
                                    CODE_BG_COLORS.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>updateFrame(activeFrameId, {
                                                    musicCodeBg: c.id
                                                }),
                                            className: `w-8 h-8 rounded-full border-2 transition-all ${frame.musicCodeBg === c.id ? 'border-[#8B6F5C] scale-110 ring-2 ring-[#8B6F5C]/20' : 'border-[#E8DFD6]'}`,
                                            style: {
                                                backgroundColor: c.id === 'transparent' ? frame.frameColor : c.id,
                                                backgroundImage: c.id === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : undefined,
                                                backgroundSize: c.id === 'transparent' ? '8px 8px' : undefined,
                                                backgroundPosition: c.id === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : undefined
                                            },
                                            title: c.label
                                        }, c.id, false, {
                                            fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                            lineNumber: 98,
                                            columnNumber: 17
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "color",
                                        value: frame.musicCodeBg === 'transparent' ? effectiveBg : frame.musicCodeBg,
                                        onChange: (e)=>updateFrame(activeFrameId, {
                                                musicCodeBg: e.target.value
                                            }),
                                        className: "w-8 h-8 rounded-full cursor-pointer border-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 113,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this),
                            photoColors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5 mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-3 h-3 text-[#A39080]",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M2 22l4-4m0 0L14.5 9.5M6 18l8.5-8.5m0 0l2-2a2.828 2.828 0 1 1 4 4l-2 2L6 18z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M19.5 6.5l-2-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                                        lineNumber: 127,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                                lineNumber: 125,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] font-medium text-[#A39080] uppercase tracking-widest",
                                                children: "From photo"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                                lineNumber: 129,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 124,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 flex-wrap",
                                        children: photoColors.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                title: color,
                                                onClick: ()=>updateFrame(activeFrameId, {
                                                        musicCodeBg: color
                                                    }),
                                                className: `w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${frame.musicCodeBg === color ? 'border-[#8B6F5C] scale-110 ring-2 ring-[#8B6F5C]/20' : 'border-[#E8DFD6]'}`,
                                                style: {
                                                    backgroundColor: color
                                                }
                                            }, color, false, {
                                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                                lineNumber: 133,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                lineNumber: 123,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2",
                                children: "Code Color"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>updateFrame(activeFrameId, {
                                                musicCodeFg: 'black'
                                            }),
                                        className: `px-4 py-2 rounded-full text-xs font-medium transition-all ${frame.musicCodeFg !== '#FFFFFF' ? 'bg-[#8B6F5C] text-white' : 'bg-[#F5EDE5] text-[#8B7B6B]'}`,
                                        children: "Black"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>updateFrame(activeFrameId, {
                                                musicCodeFg: '#FFFFFF'
                                            }),
                                        className: `px-4 py-2 rounded-full text-xs font-medium transition-all ${frame.musicCodeFg === '#FFFFFF' ? 'bg-[#8B6F5C] text-white' : 'bg-[#F5EDE5] text-[#8B7B6B]'}`,
                                        children: "White"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-[10px] font-semibold text-[#A39080] uppercase tracking-widest",
                                        children: "Size"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 174,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-[#C4B5A6]",
                                        children: [
                                            Math.round(frame.musicPos.scale * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 175,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: "50",
                                max: "250",
                                value: Math.round(frame.musicPos.scale * 100),
                                onChange: (e)=>updateFrame(activeFrameId, {
                                        musicPos: {
                                            ...frame.musicPos,
                                            scale: Number(e.target.value) / 100
                                        }
                                    }),
                                className: "w-full"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                        lineNumber: 172,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            updateFrame(activeFrameId, {
                                musicUrl: ''
                            });
                            setInput('');
                        },
                        className: "w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "14",
                                height: "14",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "3 6 5 6 21 6"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 191,
                                        columnNumber: 156
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M19 6l-1 14H6L5 6"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 191,
                                        columnNumber: 189
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M10 11v6"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 191,
                                        columnNumber: 218
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M14 11v6"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 191,
                                        columnNumber: 238
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M9 6V4h6v2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                        lineNumber: 191,
                                        columnNumber: 258
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/MusicPanel.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            "Remove Spotify Code"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/MusicPanel.tsx",
                        lineNumber: 187,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/panels/MusicPanel.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(MusicPanel, "3jvXWncAGFhnkW8YJfdtinYfAzU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useImageColors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageColors"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTransparentSpotifyCode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransparentSpotifyCode"]
    ];
});
_c = MusicPanel;
var _c;
__turbopack_context__.k.register(_c, "MusicPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AdBanner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdBanner",
    ()=>AdBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function AdBanner({ slot, format = 'auto', className = '' }) {
    _s();
    const pushed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdBanner.useEffect": ()=>{
            if (pushed.current) return;
            pushed.current = true;
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch  {
            // AdSense not loaded (dev / blocked by ad blocker) — fail silently
            }
        }
    }["AdBanner.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ins", {
            className: "adsbygoogle",
            style: {
                display: 'block'
            },
            "data-ad-client": "ca-pub-XXXXXXXXXXXXXXXX",
            "data-ad-slot": slot,
            "data-ad-format": format,
            "data-full-width-responsive": "true"
        }, void 0, false, {
            fileName: "[project]/src/components/AdBanner.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/AdBanner.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(AdBanner, "GZuJL4RXmfcu0YS6tz2VXf4dZI4=");
_c = AdBanner;
var _c;
__turbopack_context__.k.register(_c, "AdBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ExportSuccessModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExportSuccessModal",
    ()=>ExportSuccessModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AdBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AdBanner.tsx [app-client] (ecmascript)");
;
;
function ExportSuccessModal({ open, onClose }) {
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-end justify-center",
        onClick: onClose,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/40 backdrop-blur-sm"
            }, void 0, false, {
                fileName: "[project]/src/components/ExportSuccessModal.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-md bg-[#FFFCF8] rounded-t-2xl px-5 pt-5 pb-8 shadow-2xl",
                onClick: (e)=>e.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-10 h-1 bg-[#E0D5C9] rounded-full mx-auto mb-5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ExportSuccessModal.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 mb-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 rounded-full bg-[#8B6F5C]/10 flex items-center justify-center flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-5 h-5 text-[#8B6F5C]",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: "2",
                                        d: "M5 13l4 4L19 7"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ExportSuccessModal.tsx",
                                        lineNumber: 36,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ExportSuccessModal.tsx",
                                    lineNumber: 35,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ExportSuccessModal.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-[#1A1814]",
                                        children: "Saved to your device"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ExportSuccessModal.tsx",
                                        lineNumber: 40,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#A39080] mt-0.5",
                                        children: "Your polaroid is ready to share"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ExportSuccessModal.tsx",
                                        lineNumber: 41,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ExportSuccessModal.tsx",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ExportSuccessModal.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AdBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdBanner"], {
                        slot: "XXXXXXXXXX",
                        format: "rectangle",
                        className: "w-full min-h-[100px] rounded-xl overflow-hidden bg-[#F5EDE5]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ExportSuccessModal.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "mt-4 w-full py-3 rounded-xl border border-[#E8DFD6] text-sm text-[#8B7B6B] font-medium active:bg-[#F5EDE5] transition-colors",
                        children: "Done"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ExportSuccessModal.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ExportSuccessModal.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ExportSuccessModal.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = ExportSuccessModal;
var _c;
__turbopack_context__.k.register(_c, "ExportSuccessModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PrivacyPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PrivacyPage",
    ()=>PrivacyPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function PrivacyPage({ onBack }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-dvh flex flex-col bg-[#FBF8F4] overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex-shrink-0 bg-[#FFFCF8] border-b border-[#F0E6DA] px-5 py-3 flex items-center gap-3 z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0E6DA] transition-colors",
                        "aria-label": "Back",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-4 h-4 text-[#5C4A3A]",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: "2",
                                d: "M15 19l-7-7 7-7"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PrivacyPage.tsx",
                                lineNumber: 16,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/PrivacyPage.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/PrivacyPage.tsx",
                        lineNumber: 10,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "tracking-wide",
                        style: {
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: '1.35rem',
                            lineHeight: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 500,
                                    fontStyle: 'normal',
                                    color: '#1A1814',
                                    letterSpacing: '0.04em'
                                },
                                children: "Pola"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PrivacyPage.tsx",
                                lineNumber: 23,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 400,
                                    fontStyle: 'italic',
                                    color: '#8B6F5C',
                                    letterSpacing: '0.01em'
                                },
                                children: "muse"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PrivacyPage.tsx",
                                lineNumber: 23,
                                columnNumber: 120
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PrivacyPage.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PrivacyPage.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 overflow-y-auto px-5 py-6 max-w-2xl mx-auto w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-[#1A1814] mb-1",
                        style: {
                            fontFamily: '"Cormorant Garamond", serif'
                        },
                        children: "Privacy Policy"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PrivacyPage.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-[#A39080] mb-6",
                        children: "Last updated: May 4, 2026"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PrivacyPage.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    [
                        {
                            title: '1. Overview',
                            body: 'Polamuse ("we", "our", "us") is a free web-based polaroid photo editor. We are committed to protecting your privacy. This policy explains what information we collect and how it is used.'
                        },
                        {
                            title: '2. Information We Collect',
                            body: 'Polamuse processes all photos entirely in your browser. No images you upload are ever sent to our servers. We do not collect, store, or share your photos.\n\nWe may collect anonymous usage analytics (page views, feature interactions) to improve the product. This data contains no personally identifiable information.'
                        },
                        {
                            title: '3. Google AdSense',
                            body: 'We use Google AdSense to display advertisements. Google may use cookies and similar technologies to show you relevant ads based on your browsing activity across websites. Google\'s use of advertising cookies enables it and its partners to serve ads based on your visit to Polamuse and other sites on the internet.\n\nYou may opt out of personalised advertising by visiting https://www.google.com/settings/ads.'
                        },
                        {
                            title: '4. Cookies',
                            body: 'We do not set first-party cookies. Third-party services (Google AdSense) may set cookies on your device. You can control cookies through your browser settings.'
                        },
                        {
                            title: '5. Third-Party Services',
                            body: 'Polamuse integrates with the Spotify Scannables API to generate Spotify codes. Your Spotify URL is sent directly to Spotify\'s servers to fetch the barcode image. Please refer to Spotify\'s privacy policy for details on how they handle this data.'
                        },
                        {
                            title: '6. Children\'s Privacy',
                            body: 'Polamuse is not directed at children under the age of 13. We do not knowingly collect personal information from children.'
                        },
                        {
                            title: '7. Changes to This Policy',
                            body: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.'
                        },
                        {
                            title: '8. Contact',
                            body: 'If you have questions about this Privacy Policy, please contact us at: privacy@polamuse.app'
                        }
                    ].map(({ title, body })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-[#5C4A3A] mb-2",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PrivacyPage.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-[#7A6A5A] leading-relaxed whitespace-pre-line",
                                    children: body
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PrivacyPage.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, title, true, {
                            fileName: "[project]/src/components/PrivacyPage.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PrivacyPage.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/PrivacyPage.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = PrivacyPage;
var _c;
__turbopack_context__.k.register(_c, "PrivacyPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/editor/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EditorPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PolaroidView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PolaroidView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BottomSheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BottomSheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$FramePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/panels/FramePanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$EditPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/panels/EditPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$TextPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/panels/TextPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$MusicPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/panels/MusicPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ExportSuccessModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ExportSuccessModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PrivacyPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PrivacyPage.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const TABS = [
    "frame",
    "edit",
    "text",
    "music"
];
const TAB_META = {
    frame: {
        label: "Frame",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            style: {
                width: 20,
                height: 20,
                display: 'block',
                margin: '0 auto'
            },
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "3",
                    y: "3",
                    width: "18",
                    height: "18",
                    rx: "2",
                    strokeWidth: "1.8"
                }, void 0, false, {
                    fileName: "[project]/src/app/editor/page.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "6",
                    y: "6",
                    width: "12",
                    height: "9",
                    rx: "1",
                    strokeWidth: "1.5"
                }, void 0, false, {
                    fileName: "[project]/src/app/editor/page.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/editor/page.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    edit: {
        label: "Edit",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            style: {
                width: 20,
                height: 20,
                display: 'block',
                margin: '0 auto'
            },
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "1.8",
                d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            }, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/editor/page.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    text: {
        label: "Text",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            style: {
                width: 20,
                height: 20,
                display: 'block',
                margin: '0 auto'
            },
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "1.8",
                d: "M4 6h16M4 12h8m-8 6h16"
            }, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 40,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/editor/page.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    music: {
        label: "Music",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            style: {
                width: 20,
                height: 20,
                display: 'block',
                margin: '0 auto'
            },
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "1.8",
                d: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
            }, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/editor/page.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }
};
/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */ function Logo() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
        className: "tracking-wide",
        style: {
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: "1.35rem",
            lineHeight: 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontWeight: 500,
                    fontStyle: "normal",
                    color: "#1A1814",
                    letterSpacing: "0.04em"
                },
                children: "Pola"
            }, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "#8B6F5C",
                    letterSpacing: "0.01em"
                },
                children: "muse"
            }, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/editor/page.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_c = Logo;
function SeoHint() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "aria-hidden": "true",
        style: {
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0
        },
        children: "Polamuse is a free online polaroid photo frame maker. Create beautiful instant film frames, add Spotify barcodes, vintage filters, captions, and download high-quality PNG images. Supports Polaroid 600, Instax Mini, Instax Square, Instax Wide, concert ticket, and movie poster templates."
    }, void 0, false, {
        fileName: "[project]/src/app/editor/page.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_c1 = SeoHint;
function ExportButton({ onSuccess }) {
    const handleClick = ()=>{
        const btn = document.getElementById("export-btn-inner");
        btn?.click();
        setTimeout(onSuccess, 600);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleClick,
        className: "px-4 py-1.5 bg-[#8B6F5C] text-white text-xs font-semibold rounded-full hover:bg-[#7A6050] active:scale-95 transition-all shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                id: "export-btn-inner",
                className: "hidden"
            }, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            "Export"
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/editor/page.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_c2 = ExportButton;
function EditorPage() {
    _s();
    const activeTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "EditorPage.useStore[activeTab]": (s)=>s.activeTab
    }["EditorPage.useStore[activeTab]"]);
    const setActiveTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "EditorPage.useStore[setActiveTab]": (s)=>s.setActiveTab
    }["EditorPage.useStore[setActiveTab]"]);
    const [sheetOpen, setSheetOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [exportSuccess, setExportSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPrivacy, setShowPrivacy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (showPrivacy) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PrivacyPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrivacyPage"], {
            onBack: ()=>setShowPrivacy(false)
        }, void 0, false, {
            fileName: "[project]/src/app/editor/page.tsx",
            lineNumber: 121,
            columnNumber: 12
        }, this);
    }
    const handleMobileTabClick = (tab)=>{
        if (activeTab === tab && sheetOpen) {
            setSheetOpen(false);
        } else {
            setActiveTab(tab);
            setSheetOpen(true);
        }
    };
    const handleDesktopTabClick = (tab)=>{
        setActiveTab(tab);
    };
    const panelContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            activeTab === "frame" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$FramePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FramePanel"], {}, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 139,
                columnNumber: 33
            }, this),
            activeTab === "edit" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$EditPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditPanel"], {}, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 140,
                columnNumber: 32
            }, this),
            activeTab === "text" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$TextPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextPanel"], {}, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 141,
                columnNumber: 32
            }, this),
            activeTab === "music" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$MusicPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MusicPanel"], {}, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 142,
                columnNumber: 33
            }, this)
        ]
    }, void 0, true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "editor-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden h-dvh flex flex-col bg-[#FBF8F4] overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "shrink-0 bg-[#FFFCF8] border-b border-[#F0E6DA] px-5 py-3 flex items-center justify-between z-10",
                        role: "banner",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Logo, {}, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExportButton, {
                                onSuccess: ()=>setExportSuccess(true)
                            }, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/editor/page.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-hidden relative",
                        "aria-label": "Polaroid frame editor",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SeoHint, {}, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PolaroidView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PolaroidView"], {}, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/editor/page.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BottomSheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BottomSheet"], {
                        open: sheetOpen,
                        onClose: ()=>setSheetOpen(false),
                        children: panelContent
                    }, void 0, false, {
                        fileName: "[project]/src/app/editor/page.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "shrink-0 bg-[#FFFCF8] border-t border-[#F0E6DA] flex z-20 relative",
                        "aria-label": "Editor tools",
                        children: TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleMobileTabClick(tab),
                                className: `flex-1 py-3 text-[10px] font-medium capitalize transition-all duration-200 ${activeTab === tab && sheetOpen ? "text-[#5C4A3A]" : "text-[#C4B5A6]"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `block transition-transform duration-200 ${activeTab === tab && sheetOpen ? "scale-110" : "scale-100"}`,
                                        children: TAB_META[tab].icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/editor/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block mt-0.5",
                                        children: TAB_META[tab].label.toLowerCase()
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/editor/page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, tab, true, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/editor/page.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shrink-0 bg-[#FFFCF8] pb-safe flex justify-center py-1 border-t border-[#F0E6DA]/50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowPrivacy(true),
                            className: "text-[9px] text-[#C4B5A6] hover:text-[#A39080] transition-colors",
                            children: "Privacy Policy"
                        }, void 0, false, {
                            fileName: "[project]/src/app/editor/page.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/editor/page.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden lg:flex h-screen bg-[#F0EBE4] overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "shrink-0 flex flex-col items-center py-5 gap-1 z-20 w-[68px] bg-[#FFFCF8] border-r border-[#EDE5DC]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-5 flex flex-col items-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[1.1rem] leading-none font-medium italic text-[#8B6F5C] tracking-[0.02em]",
                                    style: {
                                        fontFamily: '"Cormorant Garamond", serif'
                                    },
                                    children: "P"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/editor/page.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this),
                            TABS.map((tab)=>{
                                const active = activeTab === tab;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleDesktopTabClick(tab),
                                            "aria-label": TAB_META[tab].label,
                                            className: `flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-150 active:scale-95 ${active ? "bg-[#F0E8E0] text-[#6B4F3A] border border-[#DDD0C4]" : "bg-transparent text-[#B5A396] border border-transparent hover:bg-[#F7F3EF]"}`,
                                            children: TAB_META[tab].icon
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/editor/page.tsx",
                                            lineNumber: 211,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 bg-[#1A1814] text-[#F5F0EB] tracking-[0.04em]",
                                            children: TAB_META[tab].label
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/editor/page.tsx",
                                            lineNumber: 223,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, tab, true, {
                                    fileName: "[project]/src/app/editor/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 15
                                }, this);
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1"
                            }, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            document.getElementById("export-btn-inner")?.click();
                                            setTimeout(()=>setExportSuccess(true), 600);
                                        },
                                        "aria-label": "Export image",
                                        className: "flex items-center justify-center w-11 h-11 rounded-xl bg-[#8B6F5C] text-[#FFFCF8] transition-all duration-150 active:scale-95 hover:bg-[#7A6050]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            style: {
                                                width: 20,
                                                height: 20
                                            },
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "1.8",
                                                d: "M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/editor/page.tsx",
                                                lineNumber: 243,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/editor/page.tsx",
                                            lineNumber: 242,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/editor/page.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 bg-[#1A1814] text-[#F5F0EB] tracking-[0.04em]",
                                        children: "Export PNG"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/editor/page.tsx",
                                        lineNumber: 246,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 233,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group mt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowPrivacy(true),
                                        "aria-label": "Privacy Policy",
                                        className: "flex items-center justify-center w-11 h-11 rounded-xl text-[#D4C5B8] transition-all duration-150 hover:text-[#A39080]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            style: {
                                                width: 16,
                                                height: 16
                                            },
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "1.8",
                                                d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/editor/page.tsx",
                                                lineNumber: 259,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/editor/page.tsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/editor/page.tsx",
                                        lineNumber: 253,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 bg-[#1A1814] text-[#F5F0EB] tracking-[0.04em]",
                                        children: "Privacy Policy"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/editor/page.tsx",
                                        lineNumber: 262,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/editor/page.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-hidden relative flex items-center justify-center",
                        "aria-label": "Polaroid frame editor",
                        style: {
                            background: "linear-gradient(135deg, #F5F0EA 0%, #EDE5DA 100%)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SeoHint, {}, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 274,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 pointer-events-none",
                                style: {
                                    backgroundImage: "radial-gradient(circle, #C8B9AC44 1px, transparent 1px)",
                                    backgroundSize: "28px 28px"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-full h-full",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PolaroidView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PolaroidView"], {}, void 0, false, {
                                    fileName: "[project]/src/app/editor/page.tsx",
                                    lineNumber: 286,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-4 right-5 pointer-events-none select-none text-xs italic text-[#8B6F5C]/35 tracking-[0.06em]",
                                style: {
                                    fontFamily: '"Cormorant Garamond", serif'
                                },
                                children: "polamuse"
                            }, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/editor/page.tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "shrink-0 flex flex-col overflow-hidden w-80 bg-[#FFFCF8] border-l border-[#EDE5DC]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 flex items-center gap-2.5 px-5 py-4 border-b border-[#F0E8E0]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[#8B6F5C]",
                                        children: TAB_META[activeTab].icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/editor/page.tsx",
                                        lineNumber: 302,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[1.05rem] font-medium text-[#1A1814] tracking-[0.04em]",
                                        style: {
                                            fontFamily: '"Cormorant Garamond", serif'
                                        },
                                        children: TAB_META[activeTab].label
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/editor/page.tsx",
                                        lineNumber: 303,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 301,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto px-5 py-4 text-[#5C4A3A] overscroll-contain",
                                children: panelContent
                            }, void 0, false, {
                                fileName: "[project]/src/app/editor/page.tsx",
                                lineNumber: 312,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/editor/page.tsx",
                        lineNumber: 299,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ExportSuccessModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExportSuccessModal"], {
                open: exportSuccess,
                onClose: ()=>setExportSuccess(false)
            }, void 0, false, {
                fileName: "[project]/src/app/editor/page.tsx",
                lineNumber: 319,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/editor/page.tsx",
        lineNumber: 147,
        columnNumber: 5
    }, this);
}
_s(EditorPage, "ZOlERoVDyimHjCH8WuXkBK14WmA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
_c3 = EditorPage;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Logo");
__turbopack_context__.k.register(_c1, "SeoHint");
__turbopack_context__.k.register(_c2, "ExportButton");
__turbopack_context__.k.register(_c3, "EditorPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0az7jdp._.js.map