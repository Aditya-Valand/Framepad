module.exports = [
"[project]/src/components/ui/Logo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Logo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
;
;
function Logo({ size = "md", href = "/" }) {
    const fontSize = size === "sm" ? 22 : 24;
    const dotSize = size === "sm" ? 7 : 8;
    const dotY = size === "sm" ? -1 : -2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
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
}),
"[project]/src/app/auth/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Logo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Logo.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function EyeIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/auth/page.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
function GoogleIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "17",
        height: "17",
        viewBox: "0 0 18 18",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#4285F4",
                d: "M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#34A853",
                d: "M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#FBBC05",
                d: "M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#EA4335",
                d: "M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/auth/page.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
/* Floating-label field */ function Field({ id, label, type = "text", autoComplete, required, showEye, strengthDots, errorMsg, value, onChange, error }) {
    const [reveal, setReveal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const inputType = showEye && reveal ? "text" : type;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            marginBottom: 22
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: id,
                type: inputType,
                placeholder: " ",
                autoComplete: autoComplete,
                required: required,
                value: value,
                onChange: (e)=>onChange(e.target.value),
                style: {
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: error ? ".5px solid var(--error)" : ".5px solid var(--text-3)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: "var(--text)",
                    padding: "18px 0 8px",
                    outline: "none",
                    transition: "border-color .25s ease"
                },
                onFocus: (e)=>{
                    if (!error) e.target.style.borderBottomColor = "var(--brown)";
                },
                onBlur: (e)=>{
                    if (!error) e.target.style.borderBottomColor = "var(--text-3)";
                }
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                style: {
                    position: "absolute",
                    left: 0,
                    top: value ? 0 : 18,
                    fontSize: value ? 11 : 14,
                    color: value ? "var(--text-2)" : "var(--text-3)",
                    pointerEvents: "none",
                    transition: "top .22s ease, font-size .22s ease, color .22s ease",
                    letterSpacing: value ? ".06em" : ".005em",
                    fontFamily: value ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
                    textTransform: value ? "uppercase" : "none"
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            showEye && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setReveal(!reveal),
                "aria-label": "Show password",
                style: {
                    position: "absolute",
                    right: 0,
                    top: 18,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: reveal ? "var(--brown)" : "var(--text-3)",
                    padding: 4,
                    transition: "color .15s"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EyeIcon, {}, void 0, false, {
                    fileName: "[project]/src/app/auth/page.tsx",
                    lineNumber: 103,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this),
            strengthDots !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 5,
                    marginTop: 8
                },
                children: [
                    0,
                    1,
                    2
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        style: {
                            height: 3,
                            flex: 1,
                            background: i < strengthDots ? "var(--brown)" : "rgba(26,23,20,.08)",
                            borderRadius: 2,
                            transition: "background .25s ease",
                            fontStyle: "normal"
                        }
                    }, i, false, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 110,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 108,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: "var(--error)",
                    marginTop: 6,
                    letterSpacing: ".04em"
                },
                children: errorMsg
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/auth/page.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
function AuthPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("login");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [animating, setAnimating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const formRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    /* Login fields */ const [liEmail, setLiEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [liPwd, setLiPwd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [liErrors, setLiErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        email: false,
        pwd: false
    });
    /* Signup fields */ const [suName, setSuName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [suEmail, setSuEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [suPwd, setSuPwd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [suErrors, setSuErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: false,
        email: false,
        pwd: false
    });
    const pwdStrength = (()=>{
        let s = 0;
        if (suPwd.length >= 6) s = 1;
        if (suPwd.length >= 8 && /[A-Z]/.test(suPwd) && /[0-9]/.test(suPwd)) s = 2;
        if (suPwd.length >= 10 && /[A-Z]/.test(suPwd) && /[0-9]/.test(suPwd) && /[^A-Za-z0-9]/.test(suPwd)) s = 3;
        return s;
    })();
    function switchMode(target) {
        if (animating || target === mode) return;
        setAnimating(true);
        if (formRef.current) {
            formRef.current.style.animation = "fadeOut .25s ease both";
        }
        setTimeout(()=>{
            setMode(target);
            if (formRef.current) {
                formRef.current.style.animation = "fadeUp .35s ease both";
            }
            setAnimating(false);
        }, 240);
    }
    function handleLoginSubmit(e) {
        e.preventDefault();
        const errors = {
            email: !liEmail.trim() || !/^\S+@\S+\.\S+$/.test(liEmail),
            pwd: liPwd.length < 6
        };
        setLiErrors(errors);
        if (errors.email || errors.pwd) return;
        setLoading(true);
        setTimeout(()=>router.push("/order"), 900);
    }
    function handleSignupSubmit(e) {
        e.preventDefault();
        const errors = {
            name: !suName.trim(),
            email: !suEmail.trim() || !/^\S+@\S+\.\S+$/.test(suEmail),
            pwd: suPwd.length < 6
        };
        setSuErrors(errors);
        if (errors.name || errors.email || errors.pwd) return;
        setLoading(true);
        setTimeout(()=>router.push("/order"), 900);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "grid",
            gridTemplateColumns: "55fr 45fr",
            minHeight: "100vh",
            fontFamily: "'DM Sans', sans-serif",
            background: "var(--cream)",
            color: "var(--text)"
        },
        className: "jsx-82d38d4b188014ee",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "32px 56px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                },
                className: "jsx-82d38d4b188014ee",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        style: {
                            textDecoration: "none"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Logo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/src/app/auth/page.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "40px 0"
                        },
                        className: "jsx-82d38d4b188014ee",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: formRef,
                            style: {
                                width: "100%",
                                maxWidth: 380,
                                animation: "fadeUp .35s ease both"
                            },
                            className: "jsx-82d38d4b188014ee",
                            children: mode === "login" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        style: {
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontSize: 42,
                                            fontWeight: 300,
                                            fontStyle: "italic",
                                            lineHeight: 1.1,
                                            marginBottom: 10,
                                            letterSpacing: "-.01em"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: "Welcome back."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 244,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 14,
                                            fontWeight: 300,
                                            color: "var(--text-2)",
                                            marginBottom: 36,
                                            lineHeight: 1.5
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: "Your polaroids are waiting."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 257,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleLoginSubmit,
                                        noValidate: true,
                                        className: "jsx-82d38d4b188014ee",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                id: "liEmail",
                                                label: "Email",
                                                type: "email",
                                                autoComplete: "email",
                                                required: true,
                                                value: liEmail,
                                                onChange: (v)=>{
                                                    setLiEmail(v);
                                                    setLiErrors((p)=>({
                                                            ...p,
                                                            email: false
                                                        }));
                                                },
                                                error: liErrors.email,
                                                errorMsg: "Enter a valid email."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 262,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                id: "liPwd",
                                                label: "Password",
                                                type: "password",
                                                autoComplete: "current-password",
                                                required: true,
                                                showEye: true,
                                                value: liPwd,
                                                onChange: (v)=>{
                                                    setLiPwd(v);
                                                    setLiErrors((p)=>({
                                                            ...p,
                                                            pwd: false
                                                        }));
                                                },
                                                error: liErrors.pwd,
                                                errorMsg: "At least 6 characters."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 267,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    margin: "-12px 0 28px"
                                                },
                                                className: "jsx-82d38d4b188014ee",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    style: {
                                                        fontFamily: "'DM Mono', monospace",
                                                        fontSize: 11,
                                                        letterSpacing: ".06em",
                                                        color: "var(--text-3)",
                                                        textDecoration: "none"
                                                    },
                                                    className: "jsx-82d38d4b188014ee",
                                                    children: "Forgot password?"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 273,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                    height: 48,
                                                    cursor: "pointer",
                                                    transition: "all .2s ease",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 8,
                                                    letterSpacing: ".005em",
                                                    position: "relative",
                                                    overflow: "hidden"
                                                },
                                                className: "jsx-82d38d4b188014ee",
                                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        width: 18,
                                                        height: 18,
                                                        border: "1.5px solid rgba(255,255,255,.35)",
                                                        borderTopColor: "#fff",
                                                        borderRadius: "50%",
                                                        animation: "spin .8s linear infinite"
                                                    },
                                                    className: "jsx-82d38d4b188014ee"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                    lineNumber: 313,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-82d38d4b188014ee",
                                                            children: "Continue"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/auth/page.tsx",
                                                            lineNumber: 325,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-82d38d4b188014ee",
                                                            children: "→"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/auth/page.tsx",
                                                            lineNumber: 326,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 288,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 14,
                                            margin: "22px 0"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    flex: 1,
                                                    height: ".5px",
                                                    background: "var(--border)"
                                                },
                                                className: "jsx-82d38d4b188014ee"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 334,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: "'DM Mono', monospace",
                                                    fontSize: 11,
                                                    color: "var(--text-3)",
                                                    letterSpacing: ".1em"
                                                },
                                                className: "jsx-82d38d4b188014ee",
                                                children: "or"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 335,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    flex: 1,
                                                    height: ".5px",
                                                    background: "var(--border)"
                                                },
                                                className: "jsx-82d38d4b188014ee"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 333,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        style: {
                                            width: "100%",
                                            background: "#fff",
                                            border: ".5px solid rgba(26,23,20,0.12)",
                                            borderRadius: 100,
                                            height: 48,
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: 14,
                                            fontWeight: 400,
                                            color: "var(--text)",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 10,
                                            transition: "all .18s ease"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GoogleIcon, {}, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 359,
                                                columnNumber: 19
                                            }, this),
                                            " Continue with Google"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 339,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            marginTop: 28,
                                            fontSize: 13,
                                            fontWeight: 300,
                                            color: "var(--text-2)",
                                            textAlign: "center"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: [
                                            "Don't have an account?",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                onClick: (e)=>{
                                                    e.preventDefault();
                                                    switchMode("signup");
                                                },
                                                style: {
                                                    color: "var(--brown)",
                                                    textDecoration: "none",
                                                    fontWeight: 500,
                                                    marginLeft: 4
                                                },
                                                className: "jsx-82d38d4b188014ee",
                                                children: "Create one →"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 364,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 362,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        style: {
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontSize: 42,
                                            fontWeight: 300,
                                            fontStyle: "italic",
                                            lineHeight: 1.1,
                                            marginBottom: 10,
                                            letterSpacing: "-.01em"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: "Make your first Polaroid."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 375,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 14,
                                            fontWeight: 300,
                                            color: "var(--text-2)",
                                            marginBottom: 36,
                                            lineHeight: 1.5
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: "Free to design. No credit card needed."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 388,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSignupSubmit,
                                        noValidate: true,
                                        className: "jsx-82d38d4b188014ee",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                id: "suName",
                                                label: "Full name",
                                                autoComplete: "name",
                                                required: true,
                                                value: suName,
                                                onChange: (v)=>{
                                                    setSuName(v);
                                                    setSuErrors((p)=>({
                                                            ...p,
                                                            name: false
                                                        }));
                                                },
                                                error: suErrors.name,
                                                errorMsg: "Tell us your name."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 393,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                id: "suEmail",
                                                label: "Email",
                                                type: "email",
                                                autoComplete: "email",
                                                required: true,
                                                value: suEmail,
                                                onChange: (v)=>{
                                                    setSuEmail(v);
                                                    setSuErrors((p)=>({
                                                            ...p,
                                                            email: false
                                                        }));
                                                },
                                                error: suErrors.email,
                                                errorMsg: "Enter a valid email."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 398,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                id: "suPwd",
                                                label: "Password",
                                                type: "password",
                                                autoComplete: "new-password",
                                                required: true,
                                                showEye: true,
                                                strengthDots: pwdStrength,
                                                value: suPwd,
                                                onChange: (v)=>{
                                                    setSuPwd(v);
                                                    setSuErrors((p)=>({
                                                            ...p,
                                                            pwd: false
                                                        }));
                                                },
                                                error: suErrors.pwd,
                                                errorMsg: "Use at least 6 characters."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 403,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                    height: 48,
                                                    cursor: "pointer",
                                                    transition: "all .2s ease",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 8,
                                                    letterSpacing: ".005em",
                                                    position: "relative",
                                                    overflow: "hidden",
                                                    marginTop: 8
                                                },
                                                className: "jsx-82d38d4b188014ee",
                                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        width: 18,
                                                        height: 18,
                                                        border: "1.5px solid rgba(255,255,255,.35)",
                                                        borderTopColor: "#fff",
                                                        borderRadius: "50%",
                                                        animation: "spin .8s linear infinite"
                                                    },
                                                    className: "jsx-82d38d4b188014ee"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                    lineNumber: 436,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-82d38d4b188014ee",
                                                            children: "Create account"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/auth/page.tsx",
                                                            lineNumber: 448,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-82d38d4b188014ee",
                                                            children: "→"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/auth/page.tsx",
                                                            lineNumber: 449,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 410,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 392,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 14,
                                            margin: "22px 0"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    flex: 1,
                                                    height: ".5px",
                                                    background: "var(--border)"
                                                },
                                                className: "jsx-82d38d4b188014ee"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 457,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: "'DM Mono', monospace",
                                                    fontSize: 11,
                                                    color: "var(--text-3)",
                                                    letterSpacing: ".1em"
                                                },
                                                className: "jsx-82d38d4b188014ee",
                                                children: "or"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 458,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    flex: 1,
                                                    height: ".5px",
                                                    background: "var(--border)"
                                                },
                                                className: "jsx-82d38d4b188014ee"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 459,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 456,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        style: {
                                            width: "100%",
                                            background: "#fff",
                                            border: ".5px solid rgba(26,23,20,0.12)",
                                            borderRadius: 100,
                                            height: 48,
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: 14,
                                            fontWeight: 400,
                                            color: "var(--text)",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 10,
                                            transition: "all .18s ease"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GoogleIcon, {}, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 482,
                                                columnNumber: 19
                                            }, this),
                                            " Continue with Google"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 462,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            marginTop: 28,
                                            fontSize: 13,
                                            fontWeight: 300,
                                            color: "var(--text-2)",
                                            textAlign: "center"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: [
                                            "Already have an account?",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                onClick: (e)=>{
                                                    e.preventDefault();
                                                    switchMode("login");
                                                },
                                                style: {
                                                    color: "var(--brown)",
                                                    textDecoration: "none",
                                                    fontWeight: 500,
                                                    marginLeft: 4
                                                },
                                                className: "jsx-82d38d4b188014ee",
                                                children: "Sign in →"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 487,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 485,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            marginTop: 18,
                                            fontFamily: "'DM Mono', monospace",
                                            fontSize: 10,
                                            color: "var(--text-3)",
                                            textAlign: "center",
                                            letterSpacing: ".04em",
                                            lineHeight: 1.6
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: [
                                            "By continuing, you agree to our ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                style: {
                                                    color: "var(--text-2)",
                                                    textDecoration: "underline",
                                                    textUnderlineOffset: 2
                                                },
                                                className: "jsx-82d38d4b188014ee",
                                                children: "Terms"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 496,
                                                columnNumber: 51
                                            }, this),
                                            " &",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                style: {
                                                    color: "var(--text-2)",
                                                    textDecoration: "underline",
                                                    textUnderlineOffset: 2
                                                },
                                                className: "jsx-82d38d4b188014ee",
                                                children: "Privacy Policy"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 497,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 495,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/src/app/auth/page.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 232,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10,
                            color: "var(--text-3)",
                            textAlign: "center",
                            letterSpacing: ".06em",
                            paddingTop: 24
                        },
                        className: "jsx-82d38d4b188014ee",
                        children: "✦ Free to use. Physical prints from ₹79."
                    }, void 0, false, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 504,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                style: {
                    background: "var(--cream-deep)",
                    position: "relative",
                    overflow: "hidden",
                    padding: 48,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                },
                className: "jsx-82d38d4b188014ee" + " " + "auth-muse-side",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            inset: 0,
                            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,.4), transparent 60%)",
                            pointerEvents: "none"
                        },
                        className: "jsx-82d38d4b188014ee"
                    }, void 0, false, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 532,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            inset: 0,
                            zIndex: 1,
                            pointerEvents: "none"
                        },
                        className: "jsx-82d38d4b188014ee",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    background: "#fff",
                                    boxShadow: "0 14px 40px rgba(26,23,20,.14)",
                                    borderRadius: 3,
                                    width: 160,
                                    top: "8%",
                                    left: "6%",
                                    animation: "f1 7s ease-in-out infinite"
                                },
                                className: "jsx-82d38d4b188014ee",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 138,
                                            margin: "9px 9px 0",
                                            borderRadius: 1,
                                            background: "linear-gradient(135deg,#e8d5c0,#c4a882)"
                                        },
                                        className: "jsx-82d38d4b188014ee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 556,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 38,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "'Dancing Script', cursive",
                                                fontSize: 15,
                                                color: "#5a4a3a"
                                            },
                                            className: "jsx-82d38d4b188014ee",
                                            children: "always you"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/page.tsx",
                                            lineNumber: 558,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 557,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 544,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    background: "#fff",
                                    boxShadow: "0 14px 40px rgba(26,23,20,.14)",
                                    borderRadius: 3,
                                    width: 148,
                                    top: "14%",
                                    right: "8%",
                                    animation: "f2 8s ease-in-out infinite .6s"
                                },
                                className: "jsx-82d38d4b188014ee",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 128,
                                            margin: "9px 9px 0",
                                            borderRadius: 1,
                                            background: "linear-gradient(135deg,#d4c5b0,#a89080)"
                                        },
                                        className: "jsx-82d38d4b188014ee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 574,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 32,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 10,
                                                color: "#8a7a6a",
                                                letterSpacing: ".08em"
                                            },
                                            className: "jsx-82d38d4b188014ee",
                                            children: "26 · 04 · 2025"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/page.tsx",
                                            lineNumber: 576,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 575,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 562,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    background: "#fff",
                                    boxShadow: "0 14px 40px rgba(26,23,20,.14)",
                                    borderRadius: 3,
                                    width: 142,
                                    bottom: "14%",
                                    left: "10%",
                                    animation: "f3 6.5s ease-in-out infinite 1.2s"
                                },
                                className: "jsx-82d38d4b188014ee",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 122,
                                            margin: "9px 9px 0",
                                            borderRadius: 1,
                                            background: "linear-gradient(160deg,#c8b8a0,#8b7060)",
                                            filter: "saturate(.85)"
                                        },
                                        className: "jsx-82d38d4b188014ee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 592,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 34,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 9,
                                                color: "#9a8878",
                                                letterSpacing: ".1em"
                                            },
                                            className: "jsx-82d38d4b188014ee",
                                            children: "SUMMER · '24"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/page.tsx",
                                            lineNumber: 594,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 593,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 580,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    background: "#fff",
                                    boxShadow: "0 14px 40px rgba(26,23,20,.14)",
                                    borderRadius: 3,
                                    width: 156,
                                    bottom: "9%",
                                    right: "10%",
                                    animation: "f4 7.5s ease-in-out infinite .3s"
                                },
                                className: "jsx-82d38d4b188014ee",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: "absolute",
                                            top: -7,
                                            left: "50%",
                                            transform: "translateX(-50%) rotate(-2deg)",
                                            width: 50,
                                            height: 14,
                                            background: "rgba(255,210,100,.6)",
                                            borderRadius: 2,
                                            zIndex: 2
                                        },
                                        className: "jsx-82d38d4b188014ee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 611,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 134,
                                            margin: "9px 9px 0",
                                            borderRadius: 1,
                                            background: "linear-gradient(135deg,#e0ceb8,#b89878)"
                                        },
                                        className: "jsx-82d38d4b188014ee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 624,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 38,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        },
                                        className: "jsx-82d38d4b188014ee",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: "'Dancing Script', cursive",
                                                fontSize: 14,
                                                color: "#7a5a3a"
                                            },
                                            className: "jsx-82d38d4b188014ee",
                                            children: "besties forever"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/page.tsx",
                                            lineNumber: 626,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 625,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 598,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 542,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "relative",
                            zIndex: 2,
                            maxWidth: 440,
                            margin: "0 auto",
                            textAlign: "center"
                        },
                        className: "jsx-82d38d4b188014ee",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: 44,
                                    fontWeight: 300,
                                    fontStyle: "italic",
                                    lineHeight: 1.18,
                                    color: "var(--text)",
                                    letterSpacing: "-.005em"
                                },
                                className: "jsx-82d38d4b188014ee",
                                children: [
                                    "“Every photo is waiting",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                        className: "jsx-82d38d4b188014ee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 645,
                                        columnNumber: 13
                                    }, this),
                                    "to become a memory.”"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 633,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: 11,
                                    letterSpacing: ".14em",
                                    color: "var(--text-2)",
                                    textTransform: "uppercase",
                                    marginTop: 28,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 10
                                },
                                className: "jsx-82d38d4b188014ee",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            width: 24,
                                            height: ".5px",
                                            background: "var(--text-3)"
                                        },
                                        className: "jsx-82d38d4b188014ee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 662,
                                        columnNumber: 13
                                    }, this),
                                    "— Polamuse",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            width: 24,
                                            height: ".5px",
                                            background: "var(--text-3)"
                                        },
                                        className: "jsx-82d38d4b188014ee"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 664,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 648,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 632,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 519,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "82d38d4b188014ee",
                children: "@keyframes fadeOut{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-8px)}}@media (width<=880px){.auth-muse-side.jsx-82d38d4b188014ee{display:none!important}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/auth/page.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_0s38san._.js.map