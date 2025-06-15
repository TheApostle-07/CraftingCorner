(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_2c5ddc._.js", {

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
"[project]/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: require } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Hero.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/ProductCard.tsx [app-client] (ecmascript)");
// Static JSON data (bundled at build-time only – no network calls!)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$json__$28$json$29$__ = __turbopack_import__("[project]/src/data/categories.json (json)");
/**
 * Home / Landing page – Crafting Corner
 * – Full animated hero
 * – Responsive Categories showcase (pulled from static JSON)
 * – Featured products carousel style grid
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/framer-motion@12.17.0_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
// Pick a handful of products to feature on the home page (could be replaced by an
// algorithm or a CMS flag later – for now, keep it static for performance / demo).
const featuredProducts = [
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
// ───────────────────────────────────────────────────────────────────────────────
// Tiny helper component for the category tiles
// ───────────────────────────────────────────────────────────────────────────────
function CategoryCard({ title, slug, image }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$17$2e$0_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].article, {
        whileHover: {
            y: -6,
            scale: 1.02
        },
        transition: {
            duration: 0.25,
            ease: 'easeOut'
        },
        className: "group relative overflow-hidden rounded-2xl shadow-lg",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: `/${slug}`,
            className: "block h-full w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: image,
                    alt: title,
                    width: 600,
                    height: 400,
                    className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
                    priority: false
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-black/0 p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-display text-lg font-semibold text-ivory",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c = CategoryCard;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto my-24 max-w-6xl px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-8 text-center font-display text-3xl font-semibold text-walnut md:text-4xl",
                        children: "Browse by Category"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$json__$28$json$29$__["default"].map((cat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryCard, {
                                ...cat
                            }, cat.slug, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto mb-32 max-w-6xl px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-8 text-center font-display text-3xl font-semibold text-walnut md:text-4xl",
                        children: "Hand-picked Favourites"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8",
                        children: featuredProducts.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                ...p
                            }, p.slug, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c1 = Home;
var _c, _c1;
__turbopack_refresh__.register(_c, "CategoryCard");
__turbopack_refresh__.register(_c1, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: require } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_2c5ddc._.js.map