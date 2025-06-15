(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_edd752._.js", {

"[project]/src/components/Hero.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: require } = __turbopack_context__;
{
/* -------------------------------------------------------------
   Ultra-polished hero section for Crafting Corner
   – Responsive
   – Framer-motion entrance + parallax flair
   – Tailwind utility styling
   ------------------------------------------------------------ */ __turbopack_esm__({
    "default": (()=>Hero)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/framer-motion@12.17.0_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/framer-motion/dist/es/value/use-scroll.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/framer-motion@12.17.0_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/framer-motion@12.17.0_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
function Hero() {
    _s();
    /* Parallax bg offset */ const { scrollY } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScroll"])();
    const yBg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(scrollY, [
        0,
        600
    ], [
        '0%',
        '15%'
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "relative isolate h-[100svh] overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                style: {
                    y: yBg
                },
                className: "absolute inset-0 -z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/assets/img/hero.webp",
                        alt: "",
                        fill: true,
                        priority: true,
                        sizes: "100vw",
                        className: "object-cover object-center"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 23,
                        columnNumber: 12
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-walnut/70 mix-blend-multiply"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 31,
                        columnNumber: 12
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Hero.tsx",
                lineNumber: 22,
                columnNumber: 10
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center text-ivory",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h1, {
                        initial: {
                            opacity: 0,
                            y: 40
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 1
                        },
                        className: "font-display text-4xl leading-tight sm:text-6xl md:text-7xl",
                        children: [
                            "Timeless ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "whitespace-nowrap",
                                children: "Hand-Crafted"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Hero.tsx",
                                lineNumber: 42,
                                columnNumber: 28
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                className: "hidden sm:inline"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Hero.tsx",
                                lineNumber: 43,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-brass",
                                children: "Furniture"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Hero.tsx",
                                lineNumber: 44,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 36,
                        columnNumber: 12
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                        initial: {
                            opacity: 0,
                            y: 30
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: 0.3,
                            duration: 0.8
                        },
                        className: "mt-6 max-w-xl text-lg sm:text-xl",
                        children: "Made to transcend trends, built to last generations."
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 47,
                        columnNumber: 12
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: 0.6,
                            duration: 0.6
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/collections",
                            className: "mt-10 inline-flex items-center gap-2 rounded-brand bg-clay px-8 py-3 font-medium tracking-wide text-ivory shadow-lg transition hover:scale-[1.03] hover:bg-clay/90 active:scale-95",
                            children: [
                                "Browse Collection",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-5 w-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: 2,
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M5 12h14M12 5l7 7M12 19l7-7"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Hero.tsx",
                                        lineNumber: 75,
                                        columnNumber: 18
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Hero.tsx",
                                    lineNumber: 66,
                                    columnNumber: 16
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Hero.tsx",
                            lineNumber: 61,
                            columnNumber: 14
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 56,
                        columnNumber: 12
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Hero.tsx",
                lineNumber: 35,
                columnNumber: 10
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 0.8
                },
                transition: {
                    delay: 1.2,
                    duration: 1
                },
                className: "absolute bottom-12 left-1/2 -translate-x-1/2 text-ivory/80",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "mx-auto h-6 w-6 animate-bounce",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: 2,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M12 5v14M19 12l-7 7-7-7"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Hero.tsx",
                            lineNumber: 95,
                            columnNumber: 14
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 88,
                        columnNumber: 12
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mt-1 block text-xs uppercase tracking-widest",
                        children: "Scroll"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 97,
                        columnNumber: 12
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Hero.tsx",
                lineNumber: 82,
                columnNumber: 10
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Hero.tsx",
        lineNumber: 20,
        columnNumber: 8
    }, this);
}
_s(Hero, "qnXKgZUAhp8aaYe+B8OqfWf51r4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScroll"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"]
    ];
});
_c = Hero;
var _c;
__turbopack_refresh__.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ProductCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: require } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ProductCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/framer-motion@12.17.0_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
function ProductCard({ title, price, img, slug }) {
    // Always show the first image – keeps the calling code simple
    const imgSrc = Array.isArray(img) ? img[0] : img;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].article, {
        whileHover: {
            y: -4,
            boxShadow: '0px 8px 24px rgba(0,0,0,0.15)'
        },
        transition: {
            duration: 0.25,
            ease: 'easeOut'
        },
        className: "group relative rounded-brand bg-ivory shadow-sm transition",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: `/products/${slug}`,
                className: "block",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: imgSrc,
                    alt: title,
                    width: 500,
                    height: 500,
                    sizes: "(min-width: 1024px) 250px, (min-width: 640px) 33vw, 50vw",
                    priority: false,
                    loading: "lazy",
                    className: "aspect-square w-full rounded-t-brand object-cover transition-transform duration-300 group-hover:scale-105"
                }, void 0, false, {
                    fileName: "[project]/src/components/ProductCard.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ProductCard.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-display text-lg text-walnut group-hover:underline",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ProductCard.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-brass",
                        children: [
                            "₹ ",
                            price.toLocaleString('en-IN')
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ProductCard.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ProductCard.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0
                },
                whileHover: {
                    opacity: 1
                },
                transition: {
                    duration: 0.2
                },
                className: "pointer-events-none absolute inset-0 hidden items-center justify-center rounded-brand bg-walnut/70 backdrop-blur-sm sm:flex",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "pointer-events-auto inline-flex items-center gap-2 rounded-brand bg-ivory px-4 py-2 text-sm font-medium text-walnut transition hover:bg-ivory/90",
                    children: [
                        "Quick View",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-4 w-4",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: 2,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M5 12h14M12 5l7 7-7 7"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductCard.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductCard.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ProductCard.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ProductCard.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ProductCard.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = ProductCard;
var _c;
__turbopack_refresh__.register(_c, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/data/categories.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: require } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("[{\"title\":\"Living Room\",\"slug\":\"living-room\",\"icon\":\"sofa\",\"image\":\"/assets/category/living-room.jpg\",\"subs\":[{\"title\":\"Sofas & Sectionals\",\"slug\":\"sofas\",\"image\":\"/assets/category/sofas.jpg\"},{\"title\":\"Recliners\",\"slug\":\"recliners\",\"image\":\"/assets/category/recliners.jpg\"},{\"title\":\"Coffee & Center Tables\",\"slug\":\"coffee-tables\",\"image\":\"/assets/category/coffee-tables.jpg\"},{\"title\":\"TV Units & Media\",\"slug\":\"tv-units\",\"image\":\"/assets/category/tv-units.jpg\"},{\"title\":\"Book Shelves\",\"slug\":\"book-shelves\",\"image\":\"/assets/category/book-shelves.jpg\"},{\"title\":\"Side Tables\",\"slug\":\"side-tables\",\"image\":\"/assets/category/side-tables.jpg\"}]},{\"title\":\"Bedroom\",\"slug\":\"bedroom\",\"icon\":\"bed-double\",\"image\":\"/assets/category/bedroom.jpg\",\"subs\":[{\"title\":\"Beds\",\"slug\":\"beds\",\"image\":\"/assets/category/beds.jpg\"},{\"title\":\"Wardrobes\",\"slug\":\"wardrobes\",\"image\":\"/assets/category/wardrobes.jpg\"},{\"title\":\"Bedside Tables\",\"slug\":\"bedside-tables\",\"image\":\"/assets/category/bedside-tables.jpg\"},{\"title\":\"Dressers & Mirrors\",\"slug\":\"dressers\",\"image\":\"/assets/category/dressers.jpg\"},{\"title\":\"Mattresses\",\"slug\":\"mattresses\",\"image\":\"/assets/category/mattresses.jpg\"}]},{\"title\":\"Dining Room\",\"slug\":\"dining-room\",\"icon\":\"fork-knife\",\"image\":\"/assets/category/dining-room.jpg\",\"subs\":[{\"title\":\"Dining Tables\",\"slug\":\"dining-tables\",\"image\":\"/assets/category/dining-tables.jpg\"},{\"title\":\"Dining Chairs\",\"slug\":\"dining-chairs\",\"image\":\"/assets/category/dining-chairs.jpg\"},{\"title\":\"Dining Sets\",\"slug\":\"dining-sets\",\"image\":\"/assets/category/dining-sets.jpg\"},{\"title\":\"Benches\",\"slug\":\"benches\",\"image\":\"/assets/category/benches.jpg\"},{\"title\":\"Bar Units\",\"slug\":\"bar-units\",\"image\":\"/assets/category/bar-units.jpg\"}]},{\"title\":\"Study & Office\",\"slug\":\"office\",\"icon\":\"briefcase\",\"image\":\"/assets/category/office.jpg\",\"subs\":[{\"title\":\"Office Chairs\",\"slug\":\"office-chairs\",\"image\":\"/assets/category/office-chairs.jpg\"},{\"title\":\"Study Desks\",\"slug\":\"study-desks\",\"image\":\"/assets/category/study-desks.jpg\"},{\"title\":\"Bookcases\",\"slug\":\"bookcases\",\"image\":\"/assets/category/bookcases.jpg\"},{\"title\":\"Filing Cabinets\",\"slug\":\"filing-cabinets\",\"image\":\"/assets/category/filing-cabinets.jpg\"}]},{\"title\":\"Outdoor\",\"slug\":\"outdoor\",\"icon\":\"sun\",\"image\":\"/assets/category/outdoor.jpg\",\"subs\":[{\"title\":\"Patio Sets\",\"slug\":\"patio-sets\",\"image\":\"/assets/category/patio-sets.jpg\"},{\"title\":\"Garden Chairs\",\"slug\":\"garden-chairs\",\"image\":\"/assets/category/garden-chairs.jpg\"},{\"title\":\"Swings\",\"slug\":\"swings\",\"image\":\"/assets/category/swings.jpg\"},{\"title\":\"Loungers\",\"slug\":\"loungers\",\"image\":\"/assets/category/loungers.jpg\"}]},{\"title\":\"Kids Room\",\"slug\":\"kids-room\",\"icon\":\"baby\",\"image\":\"/assets/category/kids-room.jpg\",\"subs\":[{\"title\":\"Kids Beds\",\"slug\":\"kids-beds\",\"image\":\"/assets/category/kids-beds.jpg\"},{\"title\":\"Study Tables\",\"slug\":\"kids-study\",\"image\":\"/assets/category/kids-study.jpg\"},{\"title\":\"Toy Storage\",\"slug\":\"toy-storage\",\"image\":\"/assets/category/toy-storage.jpg\"},{\"title\":\"Kids Seating\",\"slug\":\"kids-seating\",\"image\":\"/assets/category/kids-seating.jpg\"}]},{\"title\":\"Hallway & Storage\",\"slug\":\"storage\",\"icon\":\"archive\",\"image\":\"/assets/category/storage.jpg\",\"subs\":[{\"title\":\"Shoe Racks\",\"slug\":\"shoe-racks\",\"image\":\"/assets/category/shoe-racks.jpg\"},{\"title\":\"Console Tables\",\"slug\":\"console-tables\",\"image\":\"/assets/category/console-tables.jpg\"},{\"title\":\"Cabinets\",\"slug\":\"cabinets\",\"image\":\"/assets/category/cabinets.jpg\"}]},{\"title\":\"Kitchen & Bar\",\"slug\":\"kitchen-bar\",\"icon\":\"wine\",\"image\":\"/assets/category/kitchen-bar.jpg\",\"subs\":[{\"title\":\"Bar Stools\",\"slug\":\"bar-stools\",\"image\":\"/assets/category/bar-stools.jpg\"},{\"title\":\"Kitchen Islands\",\"slug\":\"kitchen-islands\",\"image\":\"/assets/category/kitchen-islands.jpg\"},{\"title\":\"Trolleys\",\"slug\":\"trolleys\",\"image\":\"/assets/category/trolleys.jpg\"}]},{\"title\":\"Décor & Accessories\",\"slug\":\"decor\",\"icon\":\"star\",\"image\":\"/assets/category/decor.jpg\",\"subs\":[{\"title\":\"Mirrors\",\"slug\":\"mirrors\",\"image\":\"/assets/category/mirrors.jpg\"},{\"title\":\"Wall Shelves\",\"slug\":\"wall-shelves\",\"image\":\"/assets/category/wall-shelves.jpg\"},{\"title\":\"Planters\",\"slug\":\"planters\",\"image\":\"/assets/category/planters.jpg\"},{\"title\":\"Pouffes & Stools\",\"slug\":\"pouffes\",\"image\":\"/assets/category/pouffes.jpg\"}]}]"));}}),
"[project]/src/lib/loaders.ts [app-client] (ecmascript)": (() => {{

throw new Error("An error occurred while generating the chunk item [project]/src/lib/loaders.ts [app-client] (ecmascript)\n\nCaused by:\n- the chunking context (unknown) does not support external modules (request: node:fs/promises)\n\nDebug info:\n- An error occurred while generating the chunk item [project]/src/lib/loaders.ts [app-client] (ecmascript)\n- Execution of *EcmascriptChunkItemContent::module_factory failed\n- Execution of *EcmascriptChunkItemContent::new failed\n- Execution of EcmascriptModuleContent::new failed\n- Execution of <EsmAssetReference as CodeGenerateable>::code_generation failed\n- the chunking context (unknown) does not support external modules (request: node:fs/promises)");

}}),
"[project]/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: require } = __turbopack_context__;
{
/* -------------------------------------------------------------
   src/app/page.tsx
   Home-page with hero ▸ animated category carousel ▸ featured
--------------------------------------------------------------*/ __turbopack_esm__({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Hero.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/ProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$loaders$2e$server$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/src/lib/loaders.server.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/categories.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$514$2e$0_react$40$18$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/lucide-react@0.514.0_react@18.2.0/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$514$2e$0_react$40$18$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/lucide-react@0.514.0_react@18.2.0/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/framer-motion@12.17.0_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/framer-motion@12.17.0_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
;
;
const CATS_PER_PAGE = 4; // change to 6 if you prefer
function Home() {
    _s();
    /* --------------------------------------------------------------------
        1.  DATA  – featured products & categories (static JSON)
  ---------------------------------------------------------------------*/ const products = [
        {
            title: 'Oak Dining Table',
            price: 45_000,
            img: '/assets/img/products/oak-table.webp',
            slug: 'oak-dining-table'
        },
        {
            title: 'Walnut Armchair',
            price: 28_000,
            img: '/assets/img/products/walnut-chair.webp',
            slug: 'walnut-armchair'
        }
    ];
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    /** slice categories 4-at-a-time */ const pages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[pages]": ()=>{
            const chunks = [];
            for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allCategories"].length; i += CATS_PER_PAGE){
                chunks.push(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allCategories"].slice(i, i + CATS_PER_PAGE));
            }
            return chunks;
        }
    }["Home.useMemo[pages]"], []);
    const next = ()=>setPage((p)=>(p + 1) % pages.length);
    const prev = ()=>setPage((p)=>(p - 1 + pages.length) % pages.length);
    /* --------------------------------------------------------------------
        2.  RENDER
  ---------------------------------------------------------------------*/ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative mx-auto mt-16 max-w-6xl px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "mb-4 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-display text-2xl font-semibold text-walnut",
                                children: "Browse by Category"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this),
                            pages.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "aria-label": "Previous",
                                        onClick: prev,
                                        className: "rounded-full bg-walnut/10 p-2 transition hover:bg-walnut/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$514$2e$0_react$40$18$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                            className: "h-5 w-5 text-walnut"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 71,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 66,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "aria-label": "Next",
                                        onClick: next,
                                        className: "rounded-full bg-walnut/10 p-2 transition hover:bg-walnut/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$514$2e$0_react$40$18$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "h-5 w-5 text-walnut"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 78,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            initial: false,
                            mode: "wait",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].ul, {
                                initial: {
                                    x: 40,
                                    opacity: 0
                                },
                                animate: {
                                    x: 0,
                                    opacity: 1
                                },
                                exit: {
                                    x: -40,
                                    opacity: 0
                                },
                                transition: {
                                    duration: 0.35,
                                    ease: 'easeOut'
                                },
                                className: "grid grid-cols-2 gap-6 sm:grid-cols-4",
                                children: pages[page].map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "list-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: `/${cat.slug}`,
                                            className: "group relative block overflow-hidden rounded-xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: cat.image,
                                                    alt: cat.title,
                                                    className: "h-40 w-full object-cover transition duration-300 group-hover:scale-105",
                                                    loading: "lazy",
                                                    width: 400,
                                                    height: 160
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute inset-0 bg-black/20 transition group-hover:bg-black/30"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute inset-0 flex items-center justify-center font-display text-lg font-medium text-ivory drop-shadow",
                                                    children: cat.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 97,
                                            columnNumber: 19
                                        }, this)
                                    }, cat.slug, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 96,
                                        columnNumber: 17
                                    }, this))
                            }, page, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto my-16 grid max-w-6xl grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8 px-4",
                children: products.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        ...p
                    }, p.slug, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Home, "zgvU6QSsr40uIwEsRQTqjuJV4/4=");
_c = Home;
var _c;
__turbopack_refresh__.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: require } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_edd752._.js.map