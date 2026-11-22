-- Phase 1: Public read-only website media table for Shivansh Engineering
-- Storage bucket: public bucket named `website-media` (managed via Supabase Dashboard in Phase 1)

create extension if not exists pgcrypto;

create table if not exists public.website_media (
  id uuid primary key default gen_random_uuid(),
  section text not null check (
    section in (
      'homepage_showcase',
      'homepage_hero',
      'gallery',
      'processing_line',
      'equipment'
    )
  ),
  slot text,
  storage_path text not null check (
    length(trim(storage_path)) > 0
    and storage_path !~ '^/'
    and storage_path !~ '^https?://'
    and position('..' in storage_path) = 0
  ),
  title text not null check (length(trim(title)) > 0),
  alt_text text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Fast lookups for published public media by section, slot, and display order
create index if not exists idx_website_media_published_section_order
  on public.website_media (section, display_order asc, created_at desc)
  where is_published = true;

create index if not exists idx_website_media_published_section_slot
  on public.website_media (section, slot)
  where is_published = true and slot is not null;

-- Keep updated_at current on dashboard/server edits
create or replace function public.set_website_media_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_website_media_updated_at on public.website_media;
create trigger trg_website_media_updated_at
  before update on public.website_media
  for each row
  execute function public.set_website_media_updated_at();

-- Enable Row-Level Security
alter table public.website_media enable row level security;

-- Lock down table privileges: read-only SELECT for anon/authenticated; no insert/update/delete
revoke all on table public.website_media from anon, authenticated;
grant select on table public.website_media to anon, authenticated;

-- Allow anonymous/public reads ONLY for published rows
drop policy if exists "Allow public read of published website media" on public.website_media;
create policy "Allow public read of published website media"
  on public.website_media
  for select
  to anon, authenticated
  using (is_published = true);
