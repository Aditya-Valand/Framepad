(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/Logo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Logo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
function Logo({ size = "md", href = "/" }) {
    const fontSize = size === "sm" ? 22 : 24;
    const dotSize = size === "sm" ? 7 : 8;
    const dotY = size === "sm" ? -1 : -2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        style: {
            fontFamily: "'Cormorant Garamond', serif",
            fontSize,
            fontWeight: 300,
            color: "var(--text)",
            letterSpacing: ".005em",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "baseline",
            gap: 8,
            lineHeight: 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    display: "inline-block",
                    width: dotSize,
                    height: dotSize,
                    borderRadius: "50%",
                    background: "var(--brown)",
                    transform: `translateY(${dotY}px)`
                }
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Logo.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            "Pola",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                style: {
                    fontStyle: "italic",
                    fontWeight: 300
                },
                children: "muse"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Logo.tsx",
                lineNumber: 40,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/Logo.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = Logo;
var _c;
__turbopack_context__.k.register(_c, "Logo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/order/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrderPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Logo.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const PRICES = {
    single: 79,
    pack5: 349,
    pack10: 590,
    pack20: 999
};
const LABELS = {
    single: "Classic polaroid print",
    pack5: "Pack of 5 polaroids",
    pack10: "Pack of 10 polaroids",
    pack20: "Pack of 20 polaroids"
};
/* Floating-label field */ function Field({ id, label, type = "text", required, value, onChange, style: s, maxLength, inputStyle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            marginBottom: 20,
            ...s
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: id,
                type: type,
                placeholder: " ",
                required: required,
                value: value,
                maxLength: maxLength,
                onChange: (e)=>onChange(e.target.value),
                style: {
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: ".5px solid var(--text-3)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: "var(--text)",
                    padding: "18px 0 8px",
                    outline: "none",
                    transition: "border-color .25s ease",
                    ...inputStyle
                },
                onFocus: (e)=>e.target.style.borderBottomColor = "var(--brown)",
                onBlur: (e)=>e.target.style.borderBottomColor = "var(--text-3)"
            }, void 0, false, {
                fileName: "[project]/src/app/order/page.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                style: {
                    position: "absolute",
                    left: inputStyle?.paddingLeft ? Number(inputStyle.paddingLeft) || 0 : 0,
                    top: value ? 0 : 18,
                    fontSize: value ? 11 : 14,
                    color: value ? "var(--text-2)" : "var(--text-3)",
                    pointerEvents: "none",
                    transition: "top .22s, font-size .22s, color .22s",
                    fontFamily: value ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
                    letterSpacing: value ? ".06em" : "normal",
                    textTransform: value ? "uppercase" : "none"
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/src/app/order/page.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/order/page.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = Field;
function OrderPage() {
    _s();
    /* Order state */ const [format, setFormat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("single");
    const [finish, setFinish] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("glossy");
    const [addMode, setAddMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [bulkQty, setBulkQty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(10);
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("summary");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    /* Checkout fields */ const [fName, setFName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fPhone, setFPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showPrefix, setShowPrefix] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fAddr, setFAddr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fAddr2, setFAddr2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showAddr2, setShowAddr2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fCity, setFCity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fPin, setFPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fState, setFState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [giftOn, setGiftOn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [giftMsg, setGiftMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    /* Calculations */ const calcTotal = ()=>{
        if (addMode === "bulk") {
            let p = bulkQty * 79;
            if (bulkQty >= 10) p = Math.round(p * 0.75);
            return p;
        }
        const unit = PRICES[format];
        const qty = addMode === "duplicate" ? 2 : 1;
        return unit * qty;
    };
    const total = calcTotal();
    const lineLabel = addMode === "bulk" ? `${bulkQty} × Classic polaroid print` : addMode === "duplicate" ? `2 × ${LABELS[format]}` : `1 × ${LABELS[format]}`;
    const badgeCount = addMode === "bulk" ? bulkQty : addMode === "duplicate" ? 2 : 1;
    const PIN_STATE = {
        "4": "Maharashtra",
        "5": "Karnataka",
        "1": "Delhi",
        "7": "West Bengal",
        "6": "Tamil Nadu",
        "3": "Gujarat",
        "2": "Uttar Pradesh",
        "8": "Andhra Pradesh"
    };
    function handlePinChange(v) {
        setFPin(v);
        if (v.length === 6) {
            setFState(PIN_STATE[v[0]] || "India");
        }
    }
    function handleCheckout(e) {
        e.preventDefault();
        setLoading(true);
        setTimeout(()=>{
            setSuccess(true);
            document.body.style.overflow = "hidden";
        }, 1100);
    }
    /* Spotify bars */ const bars = Array.from({
        length: 22
    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
            style: {
                flex: 1,
                background: "#fff",
                borderRadius: 1,
                height: 3 + Math.abs(Math.sin(i * 0.7)) * 11
            }
        }, i, false, {
            fileName: "[project]/src/app/order/page.tsx",
            lineNumber: 127,
            columnNumber: 5
        }, this));
    if (success) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                position: "fixed",
                inset: 0,
                background: "var(--cream)",
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                padding: 40,
                animation: "fadeIn .4s ease",
                fontFamily: "'DM Sans', sans-serif"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                        pointerEvents: "none"
                    },
                    children: Array.from({
                        length: 24
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                position: "absolute",
                                color: "var(--brown-light)",
                                fontSize: 10 + Math.random() * 14,
                                left: `${Math.random() * 100}%`,
                                animation: `fall ${3 + Math.random() * 3}s linear infinite`,
                                animationDelay: `${Math.random() * 3}s`,
                                opacity: 0
                            },
                            children: "✦"
                        }, i, false, {
                            fileName: "[project]/src/app/order/page.tsx",
                            lineNumber: 151,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/order/page.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: 200,
                        background: "#fff",
                        boxShadow: "0 18px 50px rgba(26,23,20,.16), 0 2px 6px rgba(26,23,20,.06)",
                        borderRadius: 3,
                        animation: "drop 1s cubic-bezier(.4,1.4,.5,1) both"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                margin: "10px 10px 0",
                                height: 174,
                                background: "linear-gradient(135deg,#e8d5c0 0%,#c4a882 50%,#8b7060 100%)",
                                borderRadius: 1
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/order/page.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: "10px 12px 6px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontFamily: "'Dancing Script', cursive",
                                        fontSize: 16,
                                        color: "#3a2a1a"
                                    },
                                    children: "always you"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 195,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 8,
                                        color: "#9a8878",
                                        letterSpacing: ".14em",
                                        textTransform: "uppercase"
                                    },
                                    children: "26 · 04 · 2025"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/order/page.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/order/page.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    style: {
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 52,
                        fontWeight: 300,
                        fontStyle: "italic",
                        margin: "36px 0 12px",
                        letterSpacing: "-.005em"
                    },
                    children: "It's on its way."
                }, void 0, false, {
                    fileName: "[project]/src/app/order/page.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: 15,
                        color: "var(--text-2)",
                        fontWeight: 300,
                        maxWidth: 420,
                        marginBottom: 32
                    },
                    children: "We'll send you a tracking link on WhatsApp."
                }, void 0, false, {
                    fileName: "[project]/src/app/order/page.tsx",
                    lineNumber: 222,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    style: {
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 15,
                        fontWeight: 500,
                        background: "var(--brown)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 100,
                        height: 48,
                        maxWidth: 240,
                        width: "100%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        textDecoration: "none",
                        cursor: "pointer"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Back to Polamuse"
                        }, void 0, false, {
                            fileName: "[project]/src/app/order/page.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "→"
                        }, void 0, false, {
                            fileName: "[project]/src/app/order/page.tsx",
                            lineNumber: 247,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/order/page.tsx",
                    lineNumber: 225,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/order/page.tsx",
            lineNumber: 132,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontFamily: "'DM Sans', sans-serif",
            background: "var(--cream)",
            color: "var(--text)",
            minHeight: "100vh"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    background: "rgba(242,237,228,.85)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderBottom: ".5px solid var(--border)",
                    padding: "14px 32px",
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    gap: 24
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        style: {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13,
                            color: "var(--text-2)",
                            textDecoration: "none"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "14",
                                height: "14",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "1.5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M15 18l-6-6 6-6"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 284,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/order/page.tsx",
                                lineNumber: 283,
                                columnNumber: 11
                            }, this),
                            "Back to Editor"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/order/page.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        style: {
                            justifySelf: "center",
                            textDecoration: "none"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/src/app/order/page.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/order/page.tsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            justifySelf: "end"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            style: {
                                position: "relative",
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                border: ".5px solid var(--border)",
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "var(--text)"
                            },
                            "aria-label": "Cart",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "16",
                                    height: "16",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 309,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "3",
                                            y1: "6",
                                            x2: "21",
                                            y2: "6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 310,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M16 10a4 4 0 01-8 0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 311,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 308,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        position: "absolute",
                                        top: -4,
                                        right: -4,
                                        background: "var(--brown)",
                                        color: "#fff",
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 10,
                                        minWidth: 18,
                                        height: 18,
                                        borderRadius: 18,
                                        padding: "0 5px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        letterSpacing: ".02em"
                                    },
                                    children: badgeCount
                                }, void 0, false, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 313,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/order/page.tsx",
                            lineNumber: 292,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/order/page.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/order/page.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    maxWidth: 1180,
                    margin: "0 auto",
                    padding: "36px 32px 80px",
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr",
                    gap: 48,
                    alignItems: "start"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: 38,
                                    fontWeight: 300,
                                    fontStyle: "italic",
                                    lineHeight: 1.1,
                                    marginBottom: 6,
                                    letterSpacing: "-.005em"
                                },
                                children: "Almost yours."
                            }, void 0, false, {
                                fileName: "[project]/src/app/order/page.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 14,
                                    color: "var(--text-2)",
                                    marginBottom: 32,
                                    fontWeight: 300
                                },
                                children: "Review your design — then choose the format that fits the moment."
                            }, void 0, false, {
                                fileName: "[project]/src/app/order/page.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#fff",
                                    border: ".5px solid var(--border)",
                                    borderRadius: 24,
                                    padding: 36,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    boxShadow: "0 4px 24px rgba(26,23,20,.04)",
                                    position: "relative"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: "absolute",
                                            top: 18,
                                            left: 22,
                                            fontFamily: "'DM Mono', monospace",
                                            fontSize: 10,
                                            letterSpacing: ".12em",
                                            color: "var(--text-3)",
                                            textTransform: "uppercase"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    display: "inline-block",
                                                    width: 5,
                                                    height: 5,
                                                    borderRadius: "50%",
                                                    background: "var(--good)",
                                                    marginRight: 6,
                                                    transform: "translateY(-1px)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 394,
                                                columnNumber: 15
                                            }, this),
                                            "Ready to print"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/order/page.tsx",
                                        lineNumber: 382,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        style: {
                                            position: "absolute",
                                            top: 14,
                                            right: 18,
                                            fontFamily: "'DM Mono', monospace",
                                            fontSize: 10,
                                            letterSpacing: ".1em",
                                            color: "var(--text-2)",
                                            textDecoration: "none",
                                            textTransform: "uppercase",
                                            padding: "6px 10px",
                                            border: ".5px solid var(--border)",
                                            borderRadius: 100
                                        },
                                        children: "Edit ↗"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/order/page.tsx",
                                        lineNumber: 407,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 300,
                                            background: "#fff",
                                            boxShadow: "0 18px 50px rgba(26,23,20,.16), 0 2px 6px rgba(26,23,20,.06)",
                                            borderRadius: 3,
                                            transform: "rotate(-2deg)",
                                            transition: "transform .35s ease",
                                            margin: "8px 0"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    margin: "14px 14px 0",
                                                    height: 264,
                                                    background: "linear-gradient(135deg,#e8d5c0 0%,#c4a882 50%,#8b7060 100%)",
                                                    borderRadius: 1,
                                                    position: "relative",
                                                    overflow: "hidden"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        position: "absolute",
                                                        inset: 0,
                                                        background: "radial-gradient(circle at 30% 25%,rgba(255,255,255,.2),transparent 60%)"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 439,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                    margin: "10px 14px 6px",
                                                    padding: "8px 12px",
                                                    background: "#1A1714",
                                                    borderRadius: 6
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "14",
                                                        height: "14",
                                                        viewBox: "0 0 24 24",
                                                        fill: "#fff",
                                                        style: {
                                                            flexShrink: 0
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/order/page.tsx",
                                                            lineNumber: 470,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 469,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            gap: 1.5,
                                                            alignItems: "center",
                                                            flex: 1,
                                                            height: 14
                                                        },
                                                        children: bars
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 472,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 458,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: "14px 16px 8px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    gap: 6
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontFamily: "'Dancing Script', cursive",
                                                            fontSize: 20,
                                                            color: "#3a2a1a",
                                                            lineHeight: 1
                                                        },
                                                        children: "always you"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 484,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontFamily: "'DM Mono', monospace",
                                                            fontSize: 9,
                                                            color: "#9a8878",
                                                            letterSpacing: ".14em",
                                                            textTransform: "uppercase"
                                                        },
                                                        children: "26 · 04 · 2025"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 487,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 475,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/order/page.tsx",
                                        lineNumber: 428,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontFamily: "'DM Mono', monospace",
                                            fontSize: 11,
                                            color: "var(--text-3)",
                                            letterSpacing: ".1em",
                                            textTransform: "uppercase",
                                            marginTop: 18
                                        },
                                        children: "✦ Designed by you"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/order/page.tsx",
                                        lineNumber: 501,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/order/page.tsx",
                                lineNumber: 369,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 36
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            marginBottom: 14,
                                            letterSpacing: ".005em"
                                        },
                                        children: "Add more to your order"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/order/page.tsx",
                                        lineNumber: 517,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "repeat(3, 1fr)",
                                            gap: 10
                                        },
                                        children: [
                                            {
                                                key: "another",
                                                lbl: "Another design",
                                                desc: "A second unique polaroid"
                                            },
                                            {
                                                key: "duplicate",
                                                lbl: "Same design ×2",
                                                desc: "Quick for gifting"
                                            },
                                            {
                                                key: "bulk",
                                                lbl: "Bulk order",
                                                desc: "5, 10, 20 or more"
                                            }
                                        ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setAddMode(addMode === t.key ? null : t.key),
                                                style: {
                                                    background: addMode === t.key ? "rgba(139,99,71,.04)" : "#fff",
                                                    border: addMode === t.key ? ".5px solid var(--brown)" : ".5px solid var(--border)",
                                                    borderRadius: 14,
                                                    padding: "16px 14px",
                                                    fontSize: 13,
                                                    color: "var(--text)",
                                                    cursor: "pointer",
                                                    textAlign: "left",
                                                    transition: "all .15s",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 4,
                                                    fontFamily: "'DM Sans', sans-serif"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontFamily: "'Cormorant Garamond', serif",
                                                            fontSize: 18,
                                                            fontStyle: "italic",
                                                            color: "var(--brown)",
                                                            fontWeight: 300,
                                                            lineHeight: 1
                                                        },
                                                        children: "+"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 545,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontWeight: 500,
                                                            fontSize: 13,
                                                            lineHeight: 1.2
                                                        },
                                                        children: t.lbl
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 548,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 11,
                                                            color: "var(--text-2)",
                                                            fontWeight: 300,
                                                            lineHeight: 1.3
                                                        },
                                                        children: t.desc
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 549,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, t.key, true, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 526,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/order/page.tsx",
                                        lineNumber: 520,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 18,
                                            background: "#fff",
                                            border: addMode === "bulk" ? ".5px solid var(--border)" : "0px solid var(--border)",
                                            borderRadius: 18,
                                            padding: addMode === "bulk" ? "24px 26px" : "0 26px",
                                            overflow: "hidden",
                                            maxHeight: addMode === "bulk" ? 340 : 0,
                                            transition: "all .35s ease"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    fontSize: 24,
                                                    fontWeight: 300,
                                                    fontStyle: "italic",
                                                    marginBottom: 14
                                                },
                                                children: "How many do you need?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 567,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 18,
                                                    padding: "8px 0 14px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setBulkQty(Math.max(2, bulkQty - 1)),
                                                        style: {
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: "50%",
                                                            border: ".5px solid var(--border)",
                                                            background: "#fff",
                                                            fontSize: 18,
                                                            color: "var(--text)",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontFamily: "'DM Sans', sans-serif"
                                                        },
                                                        children: "−"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 579,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontFamily: "'Cormorant Garamond', serif",
                                                            fontSize: 42,
                                                            fontWeight: 300,
                                                            fontStyle: "italic",
                                                            minWidth: 80,
                                                            textAlign: "center",
                                                            color: "var(--text)"
                                                        },
                                                        children: bulkQty
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 598,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setBulkQty(Math.min(200, bulkQty + 1)),
                                                        style: {
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: "50%",
                                                            border: ".5px solid var(--border)",
                                                            background: "#fff",
                                                            fontSize: 18,
                                                            color: "var(--text)",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontFamily: "'DM Sans', sans-serif"
                                                        },
                                                        children: "+"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 611,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 578,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontFamily: "'DM Mono', monospace",
                                                    fontSize: 13,
                                                    color: "var(--brown)",
                                                    textAlign: "center",
                                                    letterSpacing: ".04em"
                                                },
                                                children: [
                                                    bulkQty,
                                                    " prints · ₹",
                                                    bulkQty >= 10 ? Math.round(bulkQty * 79 * 0.75) : bulkQty * 79
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 631,
                                                columnNumber: 15
                                            }, this),
                                            bulkQty >= 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    textAlign: "center"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        display: "inline-block",
                                                        background: "var(--good-bg, #E1F5EE)",
                                                        color: "var(--good)",
                                                        fontFamily: "'DM Mono', monospace",
                                                        fontSize: 10,
                                                        letterSpacing: ".08em",
                                                        padding: "4px 10px",
                                                        borderRadius: 100,
                                                        margin: "12px auto 0",
                                                        textTransform: "uppercase"
                                                    },
                                                    children: "Save 25% on orders of 10+"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 636,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 635,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 14,
                                                    fontFamily: "'DM Mono', monospace",
                                                    fontSize: 10,
                                                    color: "var(--text-3)",
                                                    letterSpacing: ".1em",
                                                    textAlign: "center",
                                                    textTransform: "uppercase"
                                                },
                                                children: "Weddings · Birthdays · Corporate · Events"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 654,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/order/page.tsx",
                                        lineNumber: 555,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/order/page.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/order/page.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        style: {
                            position: "sticky",
                            top: 96
                        },
                        children: view === "summary" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: "#fff",
                                border: ".5px solid var(--border)",
                                borderRadius: 20,
                                padding: 28,
                                boxShadow: "0 4px 24px rgba(26,23,20,.04)",
                                position: "relative",
                                overflow: "hidden"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: 16,
                                        fontWeight: 500,
                                        marginBottom: 18
                                    },
                                    children: "Your order"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 685,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "8px 0",
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 12,
                                        color: "var(--text-2)",
                                        letterSpacing: ".02em"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: lineLabel
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 691,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "var(--text)",
                                                letterSpacing: 0
                                            },
                                            children: [
                                                "₹",
                                                total
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 692,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 690,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "8px 0",
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 12,
                                        color: "var(--text-2)",
                                        letterSpacing: ".02em"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Subtotal"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 695,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "var(--text)",
                                                letterSpacing: 0
                                            },
                                            children: [
                                                "₹",
                                                total
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 696,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 694,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "8px 0",
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 12,
                                        color: "var(--text-2)",
                                        letterSpacing: ".02em"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Shipping"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 699,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "var(--good)",
                                                letterSpacing: 0
                                            },
                                            children: "Free"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 700,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 698,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingTop: 14,
                                        borderTop: ".5px solid var(--border)",
                                        marginTop: 6
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "var(--text)"
                                            },
                                            children: "Total"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 704,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontSize: 24,
                                                fontWeight: 300,
                                                fontStyle: "italic"
                                            },
                                            children: [
                                                "₹",
                                                total
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 705,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 703,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 10,
                                        letterSpacing: ".14em",
                                        color: "var(--text-3)",
                                        textTransform: "uppercase",
                                        margin: "22px 0 10px"
                                    },
                                    children: "Format"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 709,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 6
                                    },
                                    children: [
                                        {
                                            value: "single",
                                            label: "Single print",
                                            price: "₹79"
                                        },
                                        {
                                            value: "pack5",
                                            label: "Pack of 5",
                                            price: "₹349"
                                        },
                                        {
                                            value: "pack10",
                                            label: "Pack of 10",
                                            price: "₹590"
                                        },
                                        {
                                            value: "pack20",
                                            label: "Pack of 20",
                                            price: "₹999"
                                        }
                                    ].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setFormat(p.value);
                                                if (addMode === "bulk") setAddMode(null);
                                            },
                                            style: {
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 12.5,
                                                fontWeight: 400,
                                                color: format === p.value ? "#fff" : "var(--text)",
                                                background: format === p.value ? "var(--brown)" : "#fff",
                                                border: format === p.value ? ".5px solid var(--brown)" : ".5px solid var(--border)",
                                                borderRadius: 100,
                                                padding: "9px 12px",
                                                cursor: "pointer",
                                                textAlign: "center",
                                                transition: "all .15s",
                                                lineHeight: 1.2,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: 1
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: p.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 741,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: "'DM Mono', monospace",
                                                        fontSize: 10,
                                                        color: format === p.value ? "rgba(255,255,255,.7)" : "var(--text-3)",
                                                        letterSpacing: ".04em"
                                                    },
                                                    children: p.price
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 742,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, p.value, true, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 719,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 712,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 10,
                                        letterSpacing: ".14em",
                                        color: "var(--text-3)",
                                        textTransform: "uppercase",
                                        margin: "22px 0 10px"
                                    },
                                    children: "Finish"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 750,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 6
                                    },
                                    children: [
                                        "Glossy",
                                        "Matte"
                                    ].map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setFinish(f.toLowerCase()),
                                            style: {
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 12.5,
                                                fontWeight: 400,
                                                color: finish === f.toLowerCase() ? "#fff" : "var(--text)",
                                                background: finish === f.toLowerCase() ? "var(--brown)" : "#fff",
                                                border: finish === f.toLowerCase() ? ".5px solid var(--brown)" : ".5px solid var(--border)",
                                                borderRadius: 100,
                                                padding: 10,
                                                cursor: "pointer",
                                                textAlign: "center",
                                                transition: "all .15s"
                                            },
                                            children: f
                                        }, f, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 755,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 753,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 11,
                                        color: "var(--text-2)",
                                        letterSpacing: ".04em",
                                        margin: "18px 0",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "1.5",
                                            style: {
                                                flexShrink: 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "2",
                                                    y: "7",
                                                    width: "20",
                                                    height: "13",
                                                    rx: "1"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 780,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M2 7l3-4h14l3 4M12 7v13"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 781,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 779,
                                            columnNumber: 17
                                        }, this),
                                        "Delivered in 3–5 days"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 778,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setView("checkout"),
                                    style: {
                                        width: "100%",
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: 15,
                                        fontWeight: 500,
                                        background: "var(--brown)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 100,
                                        height: 52,
                                        cursor: "pointer",
                                        transition: "all .2s ease",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        letterSpacing: ".005em"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Proceed to checkout"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 808,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 809,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 787,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: "center",
                                        marginTop: 14
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "#",
                                            style: {
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 13,
                                                color: "var(--text-2)",
                                                textDecoration: "underline",
                                                textUnderlineOffset: 3
                                            },
                                            children: "Download PNG instead"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 814,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 10,
                                                color: "var(--text-3)",
                                                letterSpacing: ".06em",
                                                marginTop: 5,
                                                textTransform: "uppercase"
                                            },
                                            children: "Free · High-res · Instant"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 817,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 813,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: 22,
                                        paddingTop: 18,
                                        borderTop: ".5px solid var(--border)",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 10,
                                        color: "var(--text-3)",
                                        letterSpacing: ".04em",
                                        gap: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 5
                                            },
                                            children: "🔒 Secure checkout"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 824,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 5
                                            },
                                            children: "✦ Premium quality"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 825,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 5
                                            },
                                            children: "↩ Easy returns"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 826,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 823,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/order/page.tsx",
                            lineNumber: 674,
                            columnNumber: 13
                        }, this) : /* CHECKOUT */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: "#fff",
                                border: ".5px solid var(--border)",
                                borderRadius: 20,
                                padding: 28,
                                boxShadow: "0 4px 24px rgba(26,23,20,.04)",
                                animation: "slideIn .35s cubic-bezier(.6,.05,.2,1) both"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setView("summary"),
                                    style: {
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: 12,
                                        color: "var(--text-2)",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: 0,
                                        marginBottom: 14
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "12",
                                            height: "12",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "1.5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M15 18l-6-6 6-6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 858,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 857,
                                            columnNumber: 17
                                        }, this),
                                        "Order summary"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 841,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: 28,
                                        fontWeight: 300,
                                        fontStyle: "italic",
                                        lineHeight: 1.1,
                                        marginBottom: 24,
                                        letterSpacing: "-.005em"
                                    },
                                    children: [
                                        "Where should we",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 874,
                                            columnNumber: 17
                                        }, this),
                                        "send it?"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 862,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleCheckout,
                                    noValidate: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                            id: "fName",
                                            label: "Full name",
                                            required: true,
                                            value: fName,
                                            onChange: setFName
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 879,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: "relative",
                                                marginBottom: 20
                                            },
                                            children: [
                                                showPrefix && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        position: "absolute",
                                                        left: 0,
                                                        top: 18,
                                                        fontSize: 14,
                                                        color: "var(--text)"
                                                    },
                                                    children: "+91"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 882,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                    id: "fPhone",
                                                    label: "Phone number",
                                                    type: "tel",
                                                    required: true,
                                                    value: fPhone,
                                                    onChange: setFPhone,
                                                    inputStyle: showPrefix ? {
                                                        paddingLeft: 40
                                                    } : undefined,
                                                    style: {
                                                        marginBottom: 0
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 884,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "hidden",
                                                    onFocus: ()=>setShowPrefix(true)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 894,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 880,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                            id: "fAddr",
                                            label: "Address line 1",
                                            required: true,
                                            value: fAddr,
                                            onChange: setFAddr
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 896,
                                            columnNumber: 17
                                        }, this),
                                        !showAddr2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "#",
                                            onClick: (e)=>{
                                                e.preventDefault();
                                                setShowAddr2(true);
                                            },
                                            style: {
                                                display: "inline-block",
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 11,
                                                color: "var(--brown)",
                                                textDecoration: "none",
                                                letterSpacing: ".06em",
                                                cursor: "pointer",
                                                marginBottom: 14
                                            },
                                            children: "+ Add apartment, floor, etc."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 898,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                            id: "fAddr2",
                                            label: "Address line 2",
                                            value: fAddr2,
                                            onChange: setFAddr2
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 915,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: 16
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                    id: "fCity",
                                                    label: "City",
                                                    required: true,
                                                    value: fCity,
                                                    onChange: setFCity
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 918,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                    id: "fPin",
                                                    label: "Pincode",
                                                    required: true,
                                                    maxLength: 6,
                                                    value: fPin,
                                                    onChange: handlePinChange
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 919,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 917,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                            id: "fState",
                                            label: "State",
                                            required: true,
                                            value: fState,
                                            onChange: setFState
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 921,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                margin: "18px 0",
                                                padding: "14px 0",
                                                borderTop: ".5px solid var(--border)",
                                                borderBottom: ".5px solid var(--border)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        cursor: "pointer"
                                                    },
                                                    onClick: ()=>setGiftOn(!giftOn),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: 13,
                                                                color: "var(--text)"
                                                            },
                                                            children: "Sending this as a gift?"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/order/page.tsx",
                                                            lineNumber: 929,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                width: 36,
                                                                height: 20,
                                                                background: giftOn ? "var(--brown)" : "#e0d8cc",
                                                                borderRadius: 100,
                                                                position: "relative",
                                                                transition: "background .25s"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    position: "absolute",
                                                                    top: 2,
                                                                    left: giftOn ? 18 : 2,
                                                                    width: 16,
                                                                    height: 16,
                                                                    background: "#fff",
                                                                    borderRadius: "50%",
                                                                    transition: "left .25s",
                                                                    boxShadow: "0 1px 3px rgba(0,0,0,.15)"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/order/page.tsx",
                                                                lineNumber: 940,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/order/page.tsx",
                                                            lineNumber: 930,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 925,
                                                    columnNumber: 19
                                                }, this),
                                                giftOn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        marginTop: 14,
                                                        animation: "fadeUp .3s ease"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            value: giftMsg,
                                                            onChange: (e)=>setGiftMsg(e.target.value),
                                                            placeholder: "Add a handwritten-style note (printed on a small card inside the package)",
                                                            rows: 3,
                                                            style: {
                                                                width: "100%",
                                                                background: "transparent",
                                                                border: "none",
                                                                borderBottom: ".5px solid var(--text-3)",
                                                                fontFamily: "'Dancing Script', cursive",
                                                                fontSize: 18,
                                                                lineHeight: 1.4,
                                                                minHeight: 90,
                                                                color: "#3a2a1a",
                                                                padding: "8px 0",
                                                                outline: "none",
                                                                resize: "none"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/order/page.tsx",
                                                            lineNumber: 957,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontFamily: "'DM Mono', monospace",
                                                                fontSize: 10,
                                                                color: "var(--brown)",
                                                                letterSpacing: ".06em",
                                                                marginTop: 6
                                                            },
                                                            children: "✦ We'll add a personal touch."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/order/page.tsx",
                                                            lineNumber: 977,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 956,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 924,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 10,
                                                letterSpacing: ".14em",
                                                color: "var(--text-3)",
                                                textTransform: "uppercase",
                                                marginTop: 0
                                            },
                                            children: "Payment"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 985,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                margin: "18px 0 22px"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        gap: 8,
                                                        alignItems: "center"
                                                    },
                                                    children: [
                                                        "UPI",
                                                        "CARD",
                                                        "NETBANKING"
                                                    ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                height: 24,
                                                                padding: "4px 10px",
                                                                border: ".5px solid var(--border)",
                                                                borderRadius: 6,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                fontFamily: "'DM Mono', monospace",
                                                                fontSize: 9,
                                                                color: "var(--text-2)",
                                                                letterSpacing: ".08em",
                                                                background: "#fff"
                                                            },
                                                            children: m
                                                        }, m, false, {
                                                            fileName: "[project]/src/app/order/page.tsx",
                                                            lineNumber: 991,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 989,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: "'DM Mono', monospace",
                                                        fontSize: 9,
                                                        color: "var(--text-3)",
                                                        letterSpacing: ".08em"
                                                    },
                                                    children: "Powered by Razorpay"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 1011,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 988,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: loading,
                                            style: {
                                                width: "100%",
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 15,
                                                fontWeight: 500,
                                                background: "var(--brown)",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 100,
                                                height: 52,
                                                cursor: "pointer",
                                                transition: "all .2s ease",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 8,
                                                letterSpacing: ".005em",
                                                position: "relative"
                                            },
                                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    width: 18,
                                                    height: 18,
                                                    border: "1.5px solid rgba(255,255,255,.35)",
                                                    borderTopColor: "#fff",
                                                    borderRadius: "50%",
                                                    animation: "spin .8s linear infinite"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/order/page.tsx",
                                                lineNumber: 1040,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Place order · ₹",
                                                            total
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 1052,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/order/page.tsx",
                                                        lineNumber: 1053,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 1016,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 10,
                                                color: "var(--text-3)",
                                                textAlign: "center",
                                                letterSpacing: ".04em",
                                                marginTop: 14,
                                                lineHeight: 1.6
                                            },
                                            children: [
                                                "By placing this order you agree to our",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    style: {
                                                        color: "var(--text-2)",
                                                        textDecoration: "underline",
                                                        textUnderlineOffset: 2
                                                    },
                                                    children: "Terms"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 1060,
                                                    columnNumber: 19
                                                }, this),
                                                " ·",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    style: {
                                                        color: "var(--text-2)",
                                                        textDecoration: "underline",
                                                        textUnderlineOffset: 2
                                                    },
                                                    children: "Privacy Policy"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/order/page.tsx",
                                                    lineNumber: 1061,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/order/page.tsx",
                                            lineNumber: 1058,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/order/page.tsx",
                                    lineNumber: 878,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/order/page.tsx",
                            lineNumber: 831,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/order/page.tsx",
                        lineNumber: 672,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/order/page.tsx",
                lineNumber: 338,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/order/page.tsx",
        lineNumber: 254,
        columnNumber: 5
    }, this);
}
_s(OrderPage, "3gEPgDXP85iejSV9dV+9Sr2Iklg=");
_c1 = OrderPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "Field");
__turbopack_context__.k.register(_c1, "OrderPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0ncrohr._.js.map