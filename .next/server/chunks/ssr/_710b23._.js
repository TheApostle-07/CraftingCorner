module.exports = {

"[project]/src/app/products/[slug]/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: require } = __turbopack_context__;
{
/* --------------------------------------------------------------------------
   Product details page (server component)
--------------------------------------------------------------------------- */ __turbopack_esm__({
    "default": (()=>ProductPage),
    "dynamicParams": (()=>dynamicParams),
    "generateMetadata": (()=>generateMetadata),
    "generateStaticParams": (()=>generateStaticParams)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/ProductView.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$loaders$2e$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/src/lib/loaders.server.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.0.3_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$loaders$2e$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/src/lib/loaders.server.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/categories.ts [app-rsc] (ecmascript)");
;
;
;
;
const dynamicParams = false;
async function generateStaticParams() {
    const params = [];
    for (const cat of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["allCategories"]){
        const products = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$loaders$2e$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["loadProducts"])(cat.slug);
        products.forEach((p)=>params.push({
                slug: p.slug
            }));
    }
    return params;
}
async function generateMetadata({ params }) {
    const product = await findProduct(params.slug);
    if (!product) return {};
    const mainImg = Array.isArray(product.img) ? product.img[0] : product.img;
    return {
        title: `${product.title} | Crafting Corner`,
        description: product.description ?? `Premium ${product.title} crafted for modern Indian homes.`,
        openGraph: {
            images: [
                mainImg
            ]
        }
    };
}
/* ---------- helpers ---------- */ async function findProduct(slug) {
    for (const cat of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["allCategories"]){
        const products = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$loaders$2e$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["loadProducts"])(cat.slug);
        const found = products.find((p)=>p.slug === slug);
        if (found) return found;
    }
    return null;
}
async function ProductPage({ params }) {
    const product = await findProduct(params.slug);
    if (!product) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    const related = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$loaders$2e$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["loadProducts"])(product.category) // product.category holds the cat-slug
    ).filter((p)=>p.slug !== product.slug).slice(0, 3);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$0$2e$3_react$2d$dom$40$18$2e$2$2e$0_react$40$18$2e$2$2e$0_$5f$react$40$18$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        product: product,
        related: related
    }, void 0, false, {
        fileName: "[project]/src/app/products/[slug]/page.tsx",
        lineNumber: 70,
        columnNumber: 10
    }, this);
}
}}),
"[project]/src/app/products/[slug]/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: require } = __turbopack_context__;
{
__turbopack_export_namespace__(__turbopack_import__("[project]/src/app/products/[slug]/page.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/.next-internal/server/app/products/[slug]/page/actions.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: require } = __turbopack_context__;
{
__turbopack_esm__({});
}}),

};

//# sourceMappingURL=_710b23._.js.map