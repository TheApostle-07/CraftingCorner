'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Copy,
  Eye,
  FileText,
  GalleryHorizontal,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MessageCircle,
  Package,
  Plus,
  Save,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tags,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';

import {
  createId,
  createSlug,
  type AdminContent,
  type ContentHealth,
} from '@/lib/adminContent';
import type { Category, Product, ProductImage, ProductType, Testimonial } from '@/lib/types';

type Props = {
  adminConfigured: boolean;
  adminNote: string;
  initialAuthenticated: boolean;
};

type ApiPayload = {
  authenticated?: boolean;
  message?: string;
  content?: AdminContent;
  health?: ContentHealth;
  baseSha?: string;
  storage?: {
    mode: 'database' | 'github' | 'local';
    canUpdate: boolean;
    branch: string;
    note: string;
  };
  commitSha?: string;
};

type TabId =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'types'
  | 'homepage'
  | 'testimonials'
  | 'media'
  | 'seo'
  | 'settings'
  | 'deployments';

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Boxes },
  { id: 'types', label: 'Product Types', icon: Tags },
  { id: 'homepage', label: 'Homepage', icon: Home },
  { id: 'testimonials', label: 'Testimonials', icon: MessageCircle },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'seo', label: 'SEO', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'deployments', label: 'Deployments', icon: UploadCloud },
];

function storageLabel(storage?: ApiPayload['storage']) {
  if (storage?.mode === 'database') return 'Neon database';
  if (storage?.mode === 'github') return `GitHub ${storage.branch}`;
  return 'Local JSON';
}

function saveActionLabel(storage?: ApiPayload['storage']) {
  if (storage?.mode === 'database') return 'Save to Neon';
  if (storage?.mode === 'github') return 'Save to GitHub';
  return 'Save locally';
}

function savePublishCopy(storage?: ApiPayload['storage']) {
  if (storage?.mode === 'database') {
    return 'This removes the item from the Neon-backed content draft. Save to publish the deletion immediately.';
  }

  if (storage?.mode === 'github') {
    return 'This removes the item from the JSON content draft. Save to GitHub to publish the deletion.';
  }

  return 'This removes the item from the local content draft. Save locally to keep the deletion.';
}

const emptyImage: ProductImage = {
  url: '',
  alt: '',
  isPrimary: true,
};

function nowIso() {
  return new Date().toISOString();
}

function formatPrice(value: number) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function productTitle(product: Product) {
  return product.name || product.title || 'Untitled product';
}

function statusBadge(visibility?: string) {
  return visibility === 'draft'
    ? 'border-slate-200 bg-slate-50 text-slate-600'
    : 'border-emerald-200 bg-emerald-50 text-emerald-700';
}

function imageText(images?: ProductImage[]) {
  return (images || [])
    .map((image) => `${image.url}|${image.alt || ''}`)
    .join('\n');
}

function parseImages(value: string, fallbackAlt: string): ProductImage[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [url, alt] = line.split('|');
      return {
        url: url.trim(),
        alt: (alt || fallbackAlt).trim(),
        isPrimary: index === 0,
      };
    });
}

function productImagesToImg(images: ProductImage[]) {
  const urls = images.map((image) => image.url).filter(Boolean);
  return urls.length > 1 ? urls : urls[0] || '';
}

function normaliseProduct(product: Product): Product {
  const name = product.name || product.title || 'Untitled Product';
  const slug = product.slug || createSlug(name);
  const images = product.images?.length ? product.images : [emptyImage];

  return {
    ...product,
    id: product.id || createId('prod', slug),
    slug,
    name,
    title: name,
    category: product.categorySlug || product.category || '',
    categorySlug: product.categorySlug || product.category || '',
    productTypeSlug: product.productTypeSlug || '',
    price: Number(product.price) || 0,
    shortDescription: product.shortDescription || product.description || '',
    description: product.description || product.shortDescription || '',
    images,
    img: productImagesToImg(images),
    tags: product.tags || [],
    sections: product.sections || {},
    visibility: product.visibility || 'published',
    stockStatus: product.stockStatus || 'available',
    seo: product.seo || {
      title: `${name} | Crafting Corner`,
      description: `Buy ${name} from Crafting Corner.`,
    },
    sortOrder: product.sortOrder || 1,
    createdAt: product.createdAt || nowIso(),
    updatedAt: nowIso(),
  };
}

export default function AdminConsole({
  adminConfigured,
  adminNote,
  initialAuthenticated,
}: Props) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [content, setContent] = useState<AdminContent | null>(null);
  const [health, setHealth] = useState<ContentHealth | null>(null);
  const [baseSha, setBaseSha] = useState('');
  const [storage, setStorage] = useState<ApiPayload['storage']>(undefined);
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<null | {
    type: 'product' | 'category' | 'type' | 'testimonial';
    id: string;
    label: string;
  }>(null);

  async function readJson(response: Response) {
    return (await response.json()) as ApiPayload;
  }

  async function loadContent() {
    setIsBusy(true);
    setMessage('');
    const response = await fetch('/api/admin/content', { cache: 'no-store' });
    const data = await readJson(response);

    startTransition(() => {
      if (response.ok && data.content) {
        setContent(data.content);
        setHealth(data.health || null);
        setBaseSha(data.baseSha || '');
        setStorage(data.storage);
        setDirty(false);
        setMessage('Content loaded.');
      } else {
        setMessage(data.message || 'Unable to load content.');
      }
      setIsBusy(false);
    });
  }

  useEffect(() => {
    if (authenticated) {
      loadContent();
    }
  }, [authenticated]);

  useEffect(() => {
    if (!content || !dirty) return;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem('crafting-corner-admin-draft', JSON.stringify(content));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [content, dirty]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function updateContent(updater: (current: AdminContent) => AdminContent) {
    setContent((current) => {
      if (!current) return current;
      setDirty(true);
      return updater(current);
    });
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await readJson(response);

    startTransition(() => {
      if (response.ok) {
        setAuthenticated(true);
        setPassword('');
        setMessage(data.message || 'Signed in.');
      } else {
        setMessage(data.message || 'Unable to sign in.');
      }
      setIsBusy(false);
    });
  }

  async function handleLogout() {
    setIsBusy(true);
    const response = await fetch('/api/admin/logout', { method: 'POST' });
    const data = await readJson(response);

    startTransition(() => {
      if (response.ok) {
        setAuthenticated(false);
        setContent(null);
        setHealth(null);
        setDirty(false);
      }
      setMessage(data.message || 'Signed out.');
      setIsBusy(false);
    });
  }

  async function handleSave() {
    if (!content) return;
    setIsBusy(true);
    setMessage('');

    const response = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        baseSha,
        message: `Update Crafting Corner content (${new Date().toISOString()})`,
      }),
    });
    const data = await readJson(response);

    startTransition(() => {
      if (response.ok) {
        setDirty(false);
        setHealth(data.health || health);
        setBaseSha(data.commitSha || baseSha);
        setMessage(data.message || 'Content saved.');
        window.localStorage.removeItem('crafting-corner-admin-draft');
      } else {
        if (data.health) setHealth(data.health);
        setMessage(data.message || 'Unable to save content.');
      }
      setIsBusy(false);
    });
  }

  function addProduct() {
    const categorySlug = content?.categories[0]?.slug || '';
    const productTypeSlug = content?.productTypes[0]?.slug || '';
    const product: Product = normaliseProduct({
      id: createId('prod', `new-product-${Date.now()}`),
      slug: `new-product-${Date.now()}`,
      name: 'New Product',
      title: 'New Product',
      categorySlug,
      category: categorySlug,
      productTypeSlug,
      price: 0,
      images: [emptyImage],
      sections: {},
      visibility: 'draft',
      stockStatus: 'available',
      tags: [],
      sortOrder: (content?.products.length || 0) + 1,
    });

    updateContent((current) => ({
      ...current,
      products: [product, ...current.products],
    }));
    setEditingProductId(product.id || product.slug);
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    updateContent((current) => ({
      ...current,
      products: current.products.map((product) => {
        if ((product.id || product.slug) !== id) return product;
        return normaliseProduct({ ...product, ...patch });
      }),
    }));
  }

  function duplicateProduct(product: Product) {
    const name = `${productTitle(product)} Copy`;
    const copy = normaliseProduct({
      ...product,
      id: createId('prod', `${product.slug}-copy-${Date.now()}`),
      slug: createSlug(`${product.slug}-copy`),
      name,
      title: name,
      visibility: 'draft',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });

    updateContent((current) => ({
      ...current,
      products: [copy, ...current.products],
    }));
    setEditingProductId(copy.id || copy.slug);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    updateContent((current) => {
      if (deleteTarget.type === 'product') {
        return {
          ...current,
          products: current.products.filter(
            (product) => (product.id || product.slug) !== deleteTarget.id,
          ),
        };
      }
      if (deleteTarget.type === 'category') {
        return {
          ...current,
          categories: current.categories.filter(
            (category) => (category.id || category.slug) !== deleteTarget.id,
          ),
        };
      }
      if (deleteTarget.type === 'type') {
        return {
          ...current,
          productTypes: current.productTypes.filter(
            (type) => (type.id || type.slug) !== deleteTarget.id,
          ),
        };
      }
      return {
        ...current,
        testimonials: current.testimonials.filter(
          (testimonial) => testimonial.id !== deleteTarget.id,
        ),
      };
    });
    setDeleteTarget(null);
  }

  const filteredProducts = useMemo(() => {
    if (!content) return [];
    const query = productSearch.trim().toLowerCase();
    return content.products.filter((product) => {
      const matchesSearch =
        !query ||
        productTitle(product).toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query);
      const matchesCategory =
        categoryFilter === 'all' || product.categorySlug === categoryFilter;
      const matchesVisibility =
        visibilityFilter === 'all' || product.visibility === visibilityFilter;
      const matchesSection =
        sectionFilter === 'all' ||
        Boolean(product.sections?.[sectionFilter as keyof Product['sections']]);
      return matchesSearch && matchesCategory && matchesVisibility && matchesSection;
    });
  }, [content, productSearch, categoryFilter, visibilityFilter, sectionFilter]);

  const dashboard = useMemo(() => {
    if (!content) return null;
    const published = content.products.filter((product) => product.visibility !== 'draft');
    const draft = content.products.length - published.length;
    const issues = health?.issues || [];

    return {
      totalProducts: content.products.length,
      publishedProducts: published.length,
      draftProducts: draft,
      categories: content.categories.length,
      activeHomepageSections: Object.values(content.homepage.sections).filter(
        (section) => section.visible,
      ).length,
      missingImages: content.products.filter((product) => !product.images?.length).length,
      missingPrice: content.products.filter((product) => !Number(product.price)).length,
      missingCategory: content.products.filter((product) => !product.categorySlug).length,
      missingSeo: content.products.filter(
        (product) => !product.seo?.title || !product.seo?.description,
      ).length,
      issues,
      lastUpdated: content.site.updatedAt || content.homepage.updatedAt || '',
    };
  }, [content, health]);

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#F8F3EA] px-4 py-10 text-[#241B14]">
        <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
          <div className="w-full rounded-[2rem] border border-[#E8DCCB] bg-white p-8 shadow-[0_24px_70px_rgba(90,56,37,0.12)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F8F3EA] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#7A6A58]">
              <ShieldAlert className="h-4 w-4 text-[#C89B5A]" />
              Crafting Corner Admin
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold text-[#2B1A12]">
              Content management
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#7A6A58]">{adminNote}</p>

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <Field label="Username">
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  disabled={isBusy || !adminConfigured}
                  className="admin-input"
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  disabled={isBusy || !adminConfigured}
                  className="admin-input"
                />
              </Field>
              <button
                type="submit"
                disabled={isBusy || !adminConfigured}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A3825] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(90,56,37,0.22)] transition hover:bg-[#2B1A12] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Sign in
              </button>
            </form>

            {message ? <Toast message={message} tone="warning" /> : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F3EA] text-[#241B14]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-[#E8DCCB] bg-[#2B1A12] p-5 text-white lg:sticky lg:top-0 lg:h-screen">
          <div className="rounded-2xl border border-white/10 bg-white/6 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C89B5A]">
              Crafting Corner
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold">Admin</h1>
            <p className="mt-3 text-sm leading-6 text-white/64">
              Persistent catalogue and content controls.
            </p>
          </div>

          <nav className="mt-6 grid gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    active
                      ? 'bg-[#C89B5A] text-[#241B14]'
                      : 'text-white/72 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-[#E8DCCB] bg-[#F8F3EA]/92 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7A6A58]">
                  {storageLabel(storage)}
                </p>
                <h2 className="mt-1 font-display text-3xl font-semibold text-[#2B1A12]">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {dirty ? (
                  <span className="rounded-full border border-[#D97706]/25 bg-[#D97706]/10 px-3 py-1 text-xs font-semibold text-[#A15A17]">
                    Unsaved changes
                  </span>
                ) : (
                  <span className="rounded-full border border-[#16A34A]/20 bg-[#16A34A]/10 px-3 py-1 text-xs font-semibold text-[#15803D]">
                    Saved
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isBusy || !content || !dirty || storage?.canUpdate === false}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5A3825] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2B1A12] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saveActionLabel(storage)}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E8DCCB] bg-white px-4 py-2.5 text-sm font-semibold text-[#5A3825] transition hover:border-[#C89B5A]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
            {message ? <Toast message={message} tone={message.includes('Unable') || message.includes('Fix') ? 'warning' : 'success'} /> : null}
          </header>

          <div className="px-4 py-6 md:px-8">
            {!content || !dashboard ? (
              <div className="flex min-h-[50vh] items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-[#5A3825]" />
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' ? (
                  <DashboardView dashboard={dashboard} health={health} storage={storage} />
                ) : null}
                {activeTab === 'products' ? (
                  <ProductsView
                    content={content}
                    products={filteredProducts}
                    productSearch={productSearch}
                    setProductSearch={setProductSearch}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    visibilityFilter={visibilityFilter}
                    setVisibilityFilter={setVisibilityFilter}
                    sectionFilter={sectionFilter}
                    setSectionFilter={setSectionFilter}
                    editingProductId={editingProductId}
                    setEditingProductId={setEditingProductId}
                    addProduct={addProduct}
                    updateProduct={updateProduct}
                    duplicateProduct={duplicateProduct}
                    setDeleteTarget={setDeleteTarget}
                  />
                ) : null}
                {activeTab === 'categories' ? (
                  <SimpleCollectionView
                    title="Categories"
                    items={content.categories}
                    editingId={editingCategoryId}
                    setEditingId={setEditingCategoryId}
                    addLabel="Add category"
                    onAdd={() => {
                      const category: Category = {
                        id: createId('cat', `new-category-${Date.now()}`),
                        slug: `new-category-${Date.now()}`,
                        name: 'New Category',
                        title: 'New Category',
                        subtitle: '',
                        image: '',
                        alt: '',
                        visibility: 'draft',
                        sortOrder: content.categories.length + 1,
                        seo: { title: 'New Category | Crafting Corner', description: '' },
                      };
                      updateContent((current) => ({
                        ...current,
                        categories: [category, ...current.categories],
                      }));
                      setEditingCategoryId(category.id || category.slug);
                    }}
                    renderSummary={(item) => item.subtitle || item.slug}
                    renderEditor={(item) => (
                      <CategoryEditor
                        category={item as Category}
                        onChange={(patch) =>
                          updateContent((current) => ({
                            ...current,
                            categories: current.categories.map((category) =>
                              (category.id || category.slug) === (item.id || item.slug)
                                ? { ...category, ...patch, title: patch.name || patch.title || category.title }
                                : category,
                            ),
                          }))
                        }
                      />
                    )}
                    onDelete={(item) =>
                      setDeleteTarget({
                        type: 'category',
                        id: item.id || item.slug,
                        label: item.name || item.title,
                      })
                    }
                  />
                ) : null}
                {activeTab === 'types' ? (
                  <SimpleCollectionView
                    title="Product Types"
                    items={content.productTypes}
                    editingId={editingTypeId}
                    setEditingId={setEditingTypeId}
                    addLabel="Add product type"
                    onAdd={() => {
                      const type: ProductType = {
                        id: createId('type', `new-type-${Date.now()}`),
                        slug: `new-type-${Date.now()}`,
                        name: 'New Product Type',
                        image: '',
                        visibility: 'draft',
                        sortOrder: content.productTypes.length + 1,
                      };
                      updateContent((current) => ({
                        ...current,
                        productTypes: [type, ...current.productTypes],
                      }));
                      setEditingTypeId(type.id);
                    }}
                    renderSummary={(item) => item.slug}
                    renderEditor={(item) => (
                      <ProductTypeEditor
                        type={item as ProductType}
                        onChange={(patch) =>
                          updateContent((current) => ({
                            ...current,
                            productTypes: current.productTypes.map((type) =>
                              type.id === item.id ? { ...type, ...patch } : type,
                            ),
                          }))
                        }
                      />
                    )}
                    onDelete={(item) =>
                      setDeleteTarget({
                        type: 'type',
                        id: item.id,
                        label: item.name,
                      })
                    }
                  />
                ) : null}
                {activeTab === 'homepage' ? (
                  <HomepageView content={content} updateContent={updateContent} />
                ) : null}
                {activeTab === 'testimonials' ? (
                  <TestimonialsView
                    content={content}
                    editingId={editingTestimonialId}
                    setEditingId={setEditingTestimonialId}
                    updateContent={updateContent}
                    setDeleteTarget={setDeleteTarget}
                  />
                ) : null}
                {activeTab === 'media' ? <MediaView content={content} /> : null}
                {activeTab === 'seo' ? (
                  <SeoView content={content} updateContent={updateContent} />
                ) : null}
                {activeTab === 'settings' ? (
                  <SettingsView content={content} updateContent={updateContent} />
                ) : null}
                {activeTab === 'deployments' ? (
                  <DeploymentsView storage={storage} baseSha={baseSha} health={health} />
                ) : null}
              </>
            )}
          </div>
        </section>
      </div>

      {deleteTarget ? (
        <ConfirmDialog
          title={`Delete ${deleteTarget.label}?`}
          body={savePublishCopy(storage)}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border-radius: 0.85rem;
          border: 1px solid #e8dccb;
          background: #fff;
          padding: 0.75rem 0.9rem;
          color: #241b14;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .admin-input:focus {
          border-color: #c89b5a;
          box-shadow: 0 0 0 3px rgba(200, 155, 90, 0.18);
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#5A3825]">{label}</span>
      {children}
    </label>
  );
}

function Toast({ message, tone }: { message: string; tone: 'success' | 'warning' }) {
  return (
    <div
      className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
        tone === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-amber-200 bg-amber-50 text-amber-800'
      }`}
    >
      {message}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  icon: typeof Package;
  tone?: 'default' | 'success' | 'warning';
}) {
  const color =
    tone === 'success'
      ? 'text-[#16A34A] bg-[#16A34A]/10'
      : tone === 'warning'
        ? 'text-[#D97706] bg-[#D97706]/10'
        : 'text-[#5A3825] bg-[#F8F3EA]';

  return (
    <div className="rounded-2xl border border-[#E8DCCB] bg-white p-5 shadow-[0_14px_40px_rgba(90,56,37,0.07)]">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-5 text-sm font-medium text-[#7A6A58]">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-[#2B1A12]">
        {value}
      </p>
    </div>
  );
}

function DashboardView({
  dashboard,
  health,
  storage,
}: {
  dashboard: any;
  health: ContentHealth | null;
  storage: ApiPayload['storage'];
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Products" value={dashboard.totalProducts} icon={Package} />
        <StatCard label="Published" value={dashboard.publishedProducts} icon={CheckCircle2} tone="success" />
        <StatCard label="Draft Products" value={dashboard.draftProducts} icon={Eye} />
        <StatCard label="Content Health" value={`${health?.score || 0}%`} icon={Sparkles} tone={(health?.errors || 0) > 0 ? 'warning' : 'success'} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-[#E8DCCB] bg-white p-6 shadow-[0_14px_40px_rgba(90,56,37,0.07)]">
          <h3 className="font-display text-2xl font-semibold text-[#2B1A12]">
            Catalogue Health
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <HealthLine label="Products missing images" value={dashboard.missingImages} />
            <HealthLine label="Products missing price" value={dashboard.missingPrice} />
            <HealthLine label="Products missing category" value={dashboard.missingCategory} />
            <HealthLine label="Products missing SEO" value={dashboard.missingSeo} />
            <HealthLine label="Categories" value={dashboard.categories} />
            <HealthLine label="Homepage sections active" value={dashboard.activeHomepageSections} />
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8DCCB] bg-white p-6 shadow-[0_14px_40px_rgba(90,56,37,0.07)]">
          <h3 className="font-display text-2xl font-semibold text-[#2B1A12]">
            Save Status
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#7A6A58]">{storage?.note}</p>
          <div className="mt-5 rounded-xl bg-[#F8F3EA] p-4 text-sm text-[#5A3825]">
            Last content timestamp: {dashboard.lastUpdated || 'Not available'}
          </div>
        </div>
      </div>

      <IssueList health={health} />
    </div>
  );
}

function HealthLine({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#F8F3EA] px-4 py-3">
      <span className="text-sm text-[#7A6A58]">{label}</span>
      <span className="font-semibold text-[#2B1A12]">{value}</span>
    </div>
  );
}

function IssueList({ health }: { health: ContentHealth | null }) {
  const issues = health?.issues || [];
  return (
    <div className="rounded-2xl border border-[#E8DCCB] bg-white p-6 shadow-[0_14px_40px_rgba(90,56,37,0.07)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-2xl font-semibold text-[#2B1A12]">
          Validation Issues
        </h3>
        <span className="rounded-full bg-[#F8F3EA] px-3 py-1 text-xs font-semibold text-[#7A6A58]">
          {health?.errors || 0} errors · {health?.warnings || 0} warnings
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {issues.length === 0 ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            No content issues detected.
          </div>
        ) : (
          issues.slice(0, 12).map((issue) => (
            <div
              key={issue.id}
              className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${
                issue.severity === 'error'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">{issue.area}</p>
                <p className="mt-1">{issue.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ProductsView(props: {
  content: AdminContent;
  products: Product[];
  productSearch: string;
  setProductSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  visibilityFilter: string;
  setVisibilityFilter: (value: string) => void;
  sectionFilter: string;
  setSectionFilter: (value: string) => void;
  editingProductId: string | null;
  setEditingProductId: (value: string | null) => void;
  addProduct: () => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  duplicateProduct: (product: Product) => void;
  setDeleteTarget: (target: any) => void;
}) {
  const editingProduct = props.content.products.find(
    (product) => (product.id || product.slug) === props.editingProductId,
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <div className="rounded-2xl border border-[#E8DCCB] bg-white p-5 shadow-[0_14px_40px_rgba(90,56,37,0.07)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A6A58]" />
            <input
              value={props.productSearch}
              onChange={(event) => props.setProductSearch(event.target.value)}
              placeholder="Search products"
              className="admin-input pl-10"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
            <select value={props.categoryFilter} onChange={(event) => props.setCategoryFilter(event.target.value)} className="admin-input">
              <option value="all">All categories</option>
              {props.content.categories.map((category) => (
                <option key={category.slug} value={category.slug}>{category.name || category.title}</option>
              ))}
            </select>
            <select value={props.visibilityFilter} onChange={(event) => props.setVisibilityFilter(event.target.value)} className="admin-input">
              <option value="all">All visibility</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select value={props.sectionFilter} onChange={(event) => props.setSectionFilter(event.target.value)} className="admin-input">
              <option value="all">All sections</option>
              <option value="bestSeller">Best Seller</option>
              <option value="featured">Featured</option>
              <option value="topPick">Top Pick</option>
              <option value="recommended">Recommended</option>
            </select>
          </div>
          <button onClick={props.addProduct} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5A3825] px-4 py-3 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-[#7A6A58]">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Sections</th>
                <th className="px-3 py-2">Visibility</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {props.products.map((product) => (
                <tr key={product.id || product.slug} className="bg-[#FBF8F2]">
                  <td className="rounded-l-xl px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 overflow-hidden rounded-lg bg-[#E8DCCB]">
                        {product.images?.[0]?.url ? (
                          <img src={product.images[0].url} alt={product.images[0].alt} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-semibold text-[#2B1A12]">{productTitle(product)}</p>
                        <p className="mt-1 text-xs text-[#7A6A58]">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#5A3825]">{product.categorySlug || 'Missing'}</td>
                  <td className="px-3 py-3 font-semibold">{formatPrice(product.price)}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(product.sections || {}).filter(([, value]) => value).map(([key]) => (
                        <span key={key} className="rounded-full bg-[#E8DCCB] px-2 py-1 text-xs text-[#5A3825]">{key}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(product.visibility)}`}>
                      {product.visibility || 'published'}
                    </span>
                  </td>
                  <td className="rounded-r-xl px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => props.setEditingProductId(product.id || product.slug)} className="rounded-lg border border-[#E8DCCB] bg-white p-2 text-[#5A3825]"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => props.duplicateProduct(product)} className="rounded-lg border border-[#E8DCCB] bg-white p-2 text-[#5A3825]"><Copy className="h-4 w-4" /></button>
                      <button onClick={() => props.setDeleteTarget({ type: 'product', id: product.id || product.slug, label: productTitle(product) })} className="rounded-lg border border-red-200 bg-white p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E8DCCB] bg-white p-5 shadow-[0_14px_40px_rgba(90,56,37,0.07)]">
        {editingProduct ? (
          <ProductEditor
            product={editingProduct}
            categories={props.content.categories}
            productTypes={props.content.productTypes}
            onChange={(patch) => props.updateProduct(editingProduct.id || editingProduct.slug, patch)}
          />
        ) : (
          <EmptyState title="Select a product" body="Open a product to edit pricing, images, SEO, visibility, and homepage placement." />
        )}
      </div>
    </div>
  );
}

function ProductEditor({
  product,
  categories,
  productTypes,
  onChange,
}: {
  product: Product;
  categories: Category[];
  productTypes: ProductType[];
  onChange: (patch: Partial<Product>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7A6A58]">
          Product Editor
        </p>
        <h3 className="mt-1 font-display text-2xl font-semibold text-[#2B1A12]">
          {productTitle(product)}
        </h3>
      </div>
      <Field label="Product name">
        <input value={productTitle(product)} onChange={(event) => onChange({ name: event.target.value, title: event.target.value, slug: createSlug(event.target.value) })} className="admin-input" />
      </Field>
      <Field label="Slug">
        <input value={product.slug} onChange={(event) => onChange({ slug: createSlug(event.target.value) })} className="admin-input" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select value={product.categorySlug || ''} onChange={(event) => onChange({ categorySlug: event.target.value, category: event.target.value })} className="admin-input">
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>{category.name || category.title}</option>
            ))}
          </select>
        </Field>
        <Field label="Product type">
          <select value={product.productTypeSlug || ''} onChange={(event) => onChange({ productTypeSlug: event.target.value })} className="admin-input">
            <option value="">None</option>
            {productTypes.map((type) => (
              <option key={type.slug} value={type.slug}>{type.name}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price">
          <input type="number" value={product.price || 0} onChange={(event) => onChange({ price: Number(event.target.value) })} className="admin-input" />
        </Field>
        <Field label="Visibility">
          <select value={product.visibility || 'published'} onChange={(event) => onChange({ visibility: event.target.value as Product['visibility'] })} className="admin-input">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </Field>
      </div>
      <Field label="Short description">
        <textarea value={product.shortDescription || ''} onChange={(event) => onChange({ shortDescription: event.target.value, description: product.description || event.target.value })} className="admin-input min-h-24" />
      </Field>
      <Field label="Full description">
        <textarea value={product.description || ''} onChange={(event) => onChange({ description: event.target.value })} className="admin-input min-h-28" />
      </Field>
      <Field label="Images, one per line: url|alt">
        <textarea
          value={imageText(product.images)}
          onChange={(event) => {
            const images = parseImages(event.target.value, productTitle(product));
            onChange({ images, img: productImagesToImg(images) });
          }}
          className="admin-input min-h-28 font-mono text-xs"
        />
      </Field>
      <Field label="Tags, comma separated">
        <input value={(product.tags || []).join(', ')} onChange={(event) => onChange({ tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })} className="admin-input" />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        {(['bestSeller', 'featured', 'topPick', 'recommended'] as const).map((key) => (
          <label key={key} className="flex items-center justify-between rounded-xl border border-[#E8DCCB] px-4 py-3 text-sm font-semibold text-[#5A3825]">
            {key}
            <input type="checkbox" checked={Boolean(product.sections?.[key])} onChange={(event) => onChange({ sections: { ...product.sections, [key]: event.target.checked } })} />
          </label>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="SEO title">
          <input value={product.seo?.title || ''} onChange={(event) => onChange({ seo: { ...(product.seo || { description: '' }), title: event.target.value } })} className="admin-input" />
        </Field>
        <Field label="SEO description">
          <input value={product.seo?.description || ''} onChange={(event) => onChange({ seo: { ...(product.seo || { title: '' }), description: event.target.value } })} className="admin-input" />
        </Field>
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E8DCCB] bg-[#F8F3EA] p-8 text-center">
      <GalleryHorizontal className="mx-auto h-8 w-8 text-[#C89B5A]" />
      <h3 className="mt-4 font-display text-2xl font-semibold text-[#2B1A12]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#7A6A58]">{body}</p>
    </div>
  );
}

function SimpleCollectionView({
  title,
  items,
  editingId,
  setEditingId,
  addLabel,
  onAdd,
  renderSummary,
  renderEditor,
  onDelete,
}: {
  title: string;
  items: any[];
  editingId: string | null;
  setEditingId: (value: string | null) => void;
  addLabel: string;
  onAdd: () => void;
  renderSummary: (item: any) => string;
  renderEditor: (item: any) => React.ReactNode;
  onDelete: (item: any) => void;
}) {
  const editing = items.find((item) => (item.id || item.slug) === editingId);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <div className="rounded-2xl border border-[#E8DCCB] bg-white p-5 shadow-[0_14px_40px_rgba(90,56,37,0.07)]">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-[#2B1A12]">{title}</h3>
          <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-[#5A3825] px-4 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            {addLabel}
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {items.map((item) => (
            <div key={item.id || item.slug} className="flex items-center justify-between gap-4 rounded-xl bg-[#FBF8F2] p-4">
              <button onClick={() => setEditingId(item.id || item.slug)} className="min-w-0 text-left">
                <p className="font-semibold text-[#2B1A12]">{item.name || item.title}</p>
                <p className="mt-1 truncate text-sm text-[#7A6A58]">{renderSummary(item)}</p>
              </button>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(item.visibility)}`}>{item.visibility || 'published'}</span>
                <button onClick={() => onDelete(item)} className="rounded-lg border border-red-200 bg-white p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-[#E8DCCB] bg-white p-5 shadow-[0_14px_40px_rgba(90,56,37,0.07)]">
        {editing ? renderEditor(editing) : <EmptyState title={`Select ${title.toLowerCase()}`} body="Choose an item to edit its content, SEO, visibility, and order." />}
      </div>
    </div>
  );
}

function CategoryEditor({ category, onChange }: { category: Category; onChange: (patch: Partial<Category>) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl font-semibold text-[#2B1A12]">{category.name || category.title}</h3>
      <Field label="Name"><input value={category.name || category.title} onChange={(event) => onChange({ name: event.target.value, title: event.target.value, slug: createSlug(event.target.value) })} className="admin-input" /></Field>
      <Field label="Slug"><input value={category.slug} onChange={(event) => onChange({ slug: createSlug(event.target.value) })} className="admin-input" /></Field>
      <Field label="Subtitle"><textarea value={category.subtitle || ''} onChange={(event) => onChange({ subtitle: event.target.value })} className="admin-input min-h-24" /></Field>
      <Field label="Image"><input value={category.image || ''} onChange={(event) => onChange({ image: event.target.value })} className="admin-input" /></Field>
      <Field label="Alt text"><input value={category.alt || ''} onChange={(event) => onChange({ alt: event.target.value })} className="admin-input" /></Field>
      <Field label="Visibility"><select value={category.visibility || 'published'} onChange={(event) => onChange({ visibility: event.target.value as Category['visibility'] })} className="admin-input"><option value="published">Published</option><option value="draft">Draft</option></select></Field>
    </div>
  );
}

function ProductTypeEditor({ type, onChange }: { type: ProductType; onChange: (patch: Partial<ProductType>) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl font-semibold text-[#2B1A12]">{type.name}</h3>
      <Field label="Name"><input value={type.name} onChange={(event) => onChange({ name: event.target.value, slug: createSlug(event.target.value) })} className="admin-input" /></Field>
      <Field label="Slug"><input value={type.slug} onChange={(event) => onChange({ slug: createSlug(event.target.value) })} className="admin-input" /></Field>
      <Field label="Image"><input value={type.image || ''} onChange={(event) => onChange({ image: event.target.value })} className="admin-input" /></Field>
      <Field label="Visibility"><select value={type.visibility} onChange={(event) => onChange({ visibility: event.target.value as ProductType['visibility'] })} className="admin-input"><option value="published">Published</option><option value="draft">Draft</option></select></Field>
    </div>
  );
}

function HomepageView({ content, updateContent }: { content: AdminContent; updateContent: (updater: (current: AdminContent) => AdminContent) => void }) {
  const updateHomepage = (patch: Partial<AdminContent['homepage']>) =>
    updateContent((current) => ({
      ...current,
      homepage: { ...current.homepage, ...patch, updatedAt: nowIso() },
    }));

  const updateSection = (key: keyof AdminContent['homepage']['sections'], patch: any) =>
    updateContent((current) => ({
      ...current,
      homepage: {
        ...current.homepage,
        updatedAt: nowIso(),
        sections: {
          ...current.homepage.sections,
          [key]: { ...current.homepage.sections[key], ...patch },
        },
      },
    }));

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Hero Section">
        <Field label="Hero title"><input value={content.homepage.hero.title} onChange={(event) => updateHomepage({ hero: { ...content.homepage.hero, title: event.target.value } })} className="admin-input" /></Field>
        <Field label="Hero subtitle"><input value={content.homepage.hero.subtitle} onChange={(event) => updateHomepage({ hero: { ...content.homepage.hero, subtitle: event.target.value } })} className="admin-input" /></Field>
        <Field label="Background image"><input value={content.homepage.hero.backgroundImage} onChange={(event) => updateHomepage({ hero: { ...content.homepage.hero, backgroundImage: event.target.value } })} className="admin-input" /></Field>
        <Field label="Scroll label"><input value={content.homepage.hero.scrollLabel || ''} onChange={(event) => updateHomepage({ hero: { ...content.homepage.hero, scrollLabel: event.target.value } })} className="admin-input" /></Field>
      </Panel>
      <Panel title="Homepage Sections">
        {Object.entries(content.homepage.sections).map(([key, section]) => (
          <div key={key} className="mb-4 rounded-xl border border-[#E8DCCB] p-4">
            <label className="flex items-center justify-between text-sm font-semibold text-[#5A3825]">
              {key}
              <input type="checkbox" checked={section.visible} onChange={(event) => updateSection(key as keyof AdminContent['homepage']['sections'], { visible: event.target.checked })} />
            </label>
            <input value={(section as any).heading || ''} onChange={(event) => updateSection(key as keyof AdminContent['homepage']['sections'], { heading: event.target.value })} className="admin-input mt-3" />
          </div>
        ))}
      </Panel>
      <Panel title="Product Selections">
        {(['bestSellers', 'featured', 'topPicks', 'recommended'] as const).map((key) => (
          <Field key={key} label={`${content.homepage.sections[key].heading} slugs`}>
            <textarea value={content.homepage.sections[key].productSlugs.join('\n')} onChange={(event) => updateSection(key, { productSlugs: event.target.value.split('\n').map((slug) => slug.trim()).filter(Boolean) })} className="admin-input min-h-28 font-mono text-xs" />
          </Field>
        ))}
      </Panel>
      <Panel title="Ordering">
        <Field label="Category order"><textarea value={content.homepage.sections.browseCategories.categoryOrder.join('\n')} onChange={(event) => updateSection('browseCategories', { categoryOrder: event.target.value.split('\n').map((slug) => slug.trim()).filter(Boolean) })} className="admin-input min-h-28 font-mono text-xs" /></Field>
        <Field label="Product type order"><textarea value={content.homepage.sections.browseProducts.productTypeOrder.join('\n')} onChange={(event) => updateSection('browseProducts', { productTypeOrder: event.target.value.split('\n').map((slug) => slug.trim()).filter(Boolean) })} className="admin-input min-h-28 font-mono text-xs" /></Field>
      </Panel>
    </div>
  );
}

function TestimonialsView({ content, editingId, setEditingId, updateContent, setDeleteTarget }: any) {
  const editing = content.testimonials.find((item: Testimonial) => item.id === editingId);
  const add = () => {
    const testimonial: Testimonial = {
      id: createId('test', `new-testimonial-${Date.now()}`),
      name: 'Client Name',
      role: '',
      projectType: '',
      location: '',
      quote: '',
      visibility: 'draft',
      sortOrder: content.testimonials.length + 1,
    };
    updateContent((current: AdminContent) => ({ ...current, testimonials: [testimonial, ...current.testimonials] }));
    setEditingId(testimonial.id);
  };
  const update = (patch: Partial<Testimonial>) =>
    updateContent((current: AdminContent) => ({
      ...current,
      testimonials: current.testimonials.map((item) => item.id === editingId ? { ...item, ...patch } : item),
    }));
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Panel title="Client Perspectives" action={<button onClick={add} className="inline-flex items-center gap-2 rounded-xl bg-[#5A3825] px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add</button>}>
        <div className="grid gap-3">
          {content.testimonials.map((item: Testimonial) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#FBF8F2] p-4">
              <button onClick={() => setEditingId(item.id)} className="text-left">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-[#7A6A58]">{item.projectType || item.location}</p>
              </button>
              <button onClick={() => setDeleteTarget({ type: 'testimonial', id: item.id, label: item.name })} className="rounded-lg border border-red-200 bg-white p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Edit Testimonial">
        {editing ? (
          <div className="space-y-4">
            <Field label="Name"><input value={editing.name} onChange={(event) => update({ name: event.target.value })} className="admin-input" /></Field>
            <Field label="Role"><input value={editing.role} onChange={(event) => update({ role: event.target.value })} className="admin-input" /></Field>
            <Field label="Project type"><input value={editing.projectType} onChange={(event) => update({ projectType: event.target.value })} className="admin-input" /></Field>
            <Field label="Location"><input value={editing.location} onChange={(event) => update({ location: event.target.value })} className="admin-input" /></Field>
            <Field label="Quote"><textarea value={editing.quote} onChange={(event) => update({ quote: event.target.value })} className="admin-input min-h-32" /></Field>
            <Field label="Visibility"><select value={editing.visibility} onChange={(event) => update({ visibility: event.target.value as Testimonial['visibility'] })} className="admin-input"><option value="published">Published</option><option value="draft">Draft</option></select></Field>
          </div>
        ) : <EmptyState title="Select testimonial" body="Choose a client perspective to edit or add a new one." />}
      </Panel>
    </div>
  );
}

function MediaView({ content }: { content: AdminContent }) {
  const images = [
    ...content.categories.map((category) => ({ area: 'Category', label: category.name || category.title, url: category.image, alt: category.alt })),
    ...content.productTypes.map((type) => ({ area: 'Product Type', label: type.name, url: type.image, alt: type.name })),
    ...content.products.flatMap((product) => (product.images || []).map((image) => ({ area: 'Product', label: productTitle(product), url: image.url, alt: image.alt }))),
  ];
  return (
    <Panel title="Media Audit">
      <div className="grid gap-3">
        {images.map((image, index) => (
          <div key={`${image.url}-${index}`} className="grid gap-4 rounded-xl bg-[#FBF8F2] p-4 md:grid-cols-[80px_1fr_auto] md:items-center">
            <div className="h-16 w-20 overflow-hidden rounded-lg bg-[#E8DCCB]">
              {image.url ? <img src={image.url} alt={image.alt || ''} className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#2B1A12]">{image.label}</p>
              <p className="truncate text-xs text-[#7A6A58]">{image.url || 'Missing URL'}</p>
              <p className="truncate text-xs text-[#7A6A58]">Alt: {image.alt || 'Missing alt text'}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${image.url && image.alt ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
              {image.url && image.alt ? 'Ready' : 'Needs attention'}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SeoView({ content, updateContent }: any) {
  const defaults = (content.seo.defaults || {}) as { title?: string; description?: string };
  return (
    <Panel title="Global SEO">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Default title"><input value={defaults.title || ''} onChange={(event) => updateContent((current: AdminContent) => ({ ...current, seo: { ...current.seo, defaults: { ...(current.seo.defaults as object), title: event.target.value } } }))} className="admin-input" /></Field>
        <Field label="Default description"><input value={defaults.description || ''} onChange={(event) => updateContent((current: AdminContent) => ({ ...current, seo: { ...current.seo, defaults: { ...(current.seo.defaults as object), description: event.target.value } } }))} className="admin-input" /></Field>
      </div>
      <Field label="Raw page SEO JSON">
        <textarea value={JSON.stringify(content.seo.pages || {}, null, 2)} onChange={(event) => {
          try {
            const pages = JSON.parse(event.target.value);
            updateContent((current: AdminContent) => ({ ...current, seo: { ...current.seo, pages } }));
          } catch {
            // Keep typing invalid JSON without committing it into state.
          }
        }} className="admin-input mt-4 min-h-80 font-mono text-xs" />
      </Field>
    </Panel>
  );
}

function SettingsView({ content, updateContent }: any) {
  const updateSite = (patch: Partial<AdminContent['site']>) =>
    updateContent((current: AdminContent) => ({
      ...current,
      site: { ...current.site, ...patch, updatedAt: nowIso() },
    }));
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Brand and Contact">
        <Field label="Brand name"><input value={content.site.brandName} onChange={(event) => updateSite({ brandName: event.target.value })} className="admin-input" /></Field>
        <Field label="Logo image"><input value={content.site.logoImage || ''} onChange={(event) => updateSite({ logoImage: event.target.value })} className="admin-input" /></Field>
        <Field label="Contact email"><input value={content.site.contact.email} onChange={(event) => updateSite({ contact: { ...content.site.contact, email: event.target.value } })} className="admin-input" /></Field>
        <Field label="Contact phone"><input value={content.site.contact.phone} onChange={(event) => updateSite({ contact: { ...content.site.contact, phone: event.target.value } })} className="admin-input" /></Field>
        <Field label="Address"><input value={content.site.contact.address} onChange={(event) => updateSite({ contact: { ...content.site.contact, address: event.target.value } })} className="admin-input" /></Field>
      </Panel>
      <Panel title="WhatsApp and Social">
        <label className="mb-4 flex items-center justify-between rounded-xl border border-[#E8DCCB] px-4 py-3 text-sm font-semibold text-[#5A3825]">
          Floating WhatsApp enabled
          <input type="checkbox" checked={content.site.whatsapp.enabled} onChange={(event) => updateSite({ whatsapp: { ...content.site.whatsapp, enabled: event.target.checked } })} />
        </label>
        <Field label="WhatsApp number"><input value={content.site.whatsapp.number} onChange={(event) => updateSite({ whatsapp: { ...content.site.whatsapp, number: event.target.value } })} className="admin-input" /></Field>
        <Field label="Default message"><input value={content.site.whatsapp.defaultMessage} onChange={(event) => updateSite({ whatsapp: { ...content.site.whatsapp, defaultMessage: event.target.value } })} className="admin-input" /></Field>
        <Field label="Product message template"><textarea value={content.site.whatsapp.productMessageTemplate} onChange={(event) => updateSite({ whatsapp: { ...content.site.whatsapp, productMessageTemplate: event.target.value } })} className="admin-input min-h-24" /></Field>
        <Field label="Instagram"><input value={content.site.social.instagram || ''} onChange={(event) => updateSite({ social: { ...content.site.social, instagram: event.target.value } })} className="admin-input" /></Field>
        <Field label="Facebook"><input value={content.site.social.facebook || ''} onChange={(event) => updateSite({ social: { ...content.site.social, facebook: event.target.value } })} className="admin-input" /></Field>
        <Field label="LinkedIn"><input value={content.site.social.linkedin || ''} onChange={(event) => updateSite({ social: { ...content.site.social, linkedin: event.target.value } })} className="admin-input" /></Field>
      </Panel>
    </div>
  );
}

function DeploymentsView({ storage, baseSha, health }: { storage: ApiPayload['storage']; baseSha: string; health: ContentHealth | null }) {
  const workflow =
    storage?.mode === 'database'
      ? 'Content is saved to Neon and public pages read the updated database content on request. No rebuild is required for catalogue edits.'
      : storage?.mode === 'github'
        ? 'Content is committed to GitHub. Vercel or Hostinger should rebuild from the updated branch.'
        : 'Local development writes JSON files directly. Production should use Neon or GitHub storage.';

  return (
    <Panel title="Deployment / Save Status">
      <div className="grid gap-4 md:grid-cols-3">
        <HealthLine label="Storage mode" value={storageLabel(storage)} />
        <HealthLine label="Validation errors" value={health?.errors || 0} />
        <HealthLine label="Validation warnings" value={health?.warnings || 0} />
      </div>
      <div className="mt-6 rounded-xl bg-[#F8F3EA] p-4 text-sm leading-6 text-[#5A3825]">
        <p>{storage?.note}</p>
        <p className="mt-2 font-mono text-xs">Base SHA: {baseSha || 'not available'}</p>
        <p className="mt-2">{workflow}</p>
      </div>
    </Panel>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E8DCCB] bg-white p-5 shadow-[0_14px_40px_rgba(90,56,37,0.07)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="font-display text-2xl font-semibold text-[#2B1A12]">{title}</h3>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ConfirmDialog({ title, body, onCancel, onConfirm }: { title: string; body: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#2B1A12]/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#E8DCCB] bg-white p-6 shadow-[0_24px_80px_rgba(43,26,18,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-[#2B1A12]">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#7A6A58]">{body}</p>
          </div>
          <button onClick={onCancel} className="rounded-full border border-[#E8DCCB] p-2 text-[#5A3825]"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl border border-[#E8DCCB] px-4 py-2 text-sm font-semibold text-[#5A3825]">Cancel</button>
          <button onClick={onConfirm} className="rounded-xl bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}
