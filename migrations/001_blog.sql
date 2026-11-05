-- Additive migration. No catalogue, authentication or enquiry records are changed.
create table if not exists blog_migrations (version integer primary key, applied_at timestamptz not null default now());
create table if not exists blog_categories (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null, description text not null default ''
);
create table if not exists blog_authors (
  id text primary key, slug text unique not null, name text not null,
  bio text not null default '', is_organization boolean not null default false
);
create table if not exists blog_media (
  id text primary key, url text unique not null, filename text not null, alt text not null default '', caption text not null default '',
  width integer not null check(width > 0), height integer not null check(height > 0),
  provider text not null check(provider in ('bundled','cloudinary','local')), public_id text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists blog_articles (
  id uuid primary key, client_key uuid unique,
  title text not null, slug text unique not null check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  fields jsonb not null check(jsonb_typeof(fields) = 'object'),
  category_slug text references blog_categories(slug) on delete restrict,
  author_id text references blog_authors(id) on delete restrict,
  cover_image_id text references blog_media(id) on delete restrict,
  og_image_id text references blog_media(id) on delete restrict,
  status text not null default 'draft' check(status in ('draft','published','scheduled','archived')),
  live_snapshot jsonb, live_slug text unique, scheduled_snapshot jsonb,
  published_at timestamptz, scheduled_at timestamptz,
  revision integer not null default 1 check(revision > 0), last_mutation_id uuid,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  last_edited_by text not null, deleted_at timestamptz,
  search_document tsvector generated always as (
    to_tsvector('english', coalesce(live_snapshot->>'title','') || ' ' || coalesce(live_snapshot->>'excerpt','') || ' ' || coalesce(live_snapshot->>'searchText','') || ' ' || coalesce(live_snapshot->>'tags',''))
  ) stored,
  check(status <> 'scheduled' or (scheduled_at is not null and scheduled_snapshot is not null))
);
create index if not exists blog_article_search_idx on blog_articles using gin(search_document);
create index if not exists blog_article_public_idx on blog_articles(published_at desc, id) where live_snapshot is not null and deleted_at is null;
create index if not exists blog_article_due_idx on blog_articles(scheduled_at) where status = 'scheduled' and deleted_at is null;
create index if not exists blog_article_category_idx on blog_articles(category_slug);
create index if not exists blog_article_author_idx on blog_articles(author_id);
create index if not exists blog_article_admin_idx on blog_articles(updated_at desc, id);
create table if not exists blog_revisions (
  article_id uuid not null references blog_articles(id) on delete cascade,
  revision integer not null, snapshot jsonb not null,
  created_at timestamptz not null default now(), actor text not null,
  primary key(article_id, revision)
);
create table if not exists blog_redirects (
  slug text primary key, article_id uuid not null references blog_articles(id) on delete cascade
);
create index if not exists blog_redirect_article_idx on blog_redirects(article_id);
create table if not exists blog_media_references (
  article_id uuid not null references blog_articles(id) on delete cascade,
  media_id text not null references blog_media(id) on delete restrict,
  primary key(article_id, media_id)
);
create index if not exists blog_media_reference_media_idx on blog_media_references(media_id);
create table if not exists blog_audit (
  id bigserial primary key, article_id uuid, action text not null, actor text not null, created_at timestamptz not null default now()
);
create table if not exists blog_rate_limits (
  key text primary key, hits integer not null, reset_at timestamptz not null
);
insert into blog_authors(id,slug,name,is_organization) values ('crafting-corner','crafting-corner','Crafting Corner',true) on conflict do nothing;
insert into blog_categories(slug,name,description) values
  ('buying-guides','Furniture Buying Guides','Practical considerations for choosing furniture.'),
  ('living-room-design','Living Room Design','Ideas for seating, layouts and living spaces.'),
  ('bedroom-design','Bedroom Design','Considered bedroom layouts and furniture.'),
  ('dining-room-design','Dining Room Design','Dining spaces, table proportions and seating.'),
  ('custom-furniture','Custom Furniture','Planning a piece around your space.'),
  ('materials-and-craftsmanship','Materials & Craftsmanship','Understanding materials, finishes and construction.'),
  ('furniture-care','Furniture Care','Caring for the pieces you live with.'),
  ('interior-inspiration','Interior Inspiration','Rooms, details and personal expression.'),
  ('mohali-chandigarh','Mohali & Chandigarh Guides','Planning a showroom visit and furnishing locally.')
on conflict do nothing;
insert into blog_migrations(version) values (1) on conflict do nothing;
