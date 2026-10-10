/*
# Create produce table for FarmRescue marketplace

## Purpose
Stores farm produce listings (both demo seed data and user-submitted listings)
so they persist across page refreshes and browser sessions.

## New Tables
- `produce`
  - `id` (text, primary key) — client-generated unique ID (e.g. "p1", "p1283746")
  - `farmer_name` (text, not null) — name of the farmer listing the produce
  - `crop_name` (text, not null) — name of the crop
  - `category` (text, not null) — category: Vegetables, Fruits, Root Vegetables, Leafy Greens, Grains
  - `quantity` (numeric, not null) — amount available
  - `unit` (text, not null) — unit of measurement: kg, tonne, crate, sack, bunch
  - `price` (numeric, not null) — price per unit in Indian Rupees
  - `location` (text, not null) — farm location
  - `contact` (text, not null) — email or phone for buyer contact
  - `image` (text, not null) — URL to produce image
  - `urgent` (boolean, default false) — whether the listing needs a quick buyer
  - `harvest_date` (date, not null) — date the produce was harvested (stored as ISO YYYY-MM-DD)
  - `description` (text, nullable) — optional description of the produce
  - `created_at` (timestamptz, default now()) — when the listing was created

## Security
- Row Level Security enabled on `produce`.
- This is a single-tenant demo app with no sign-in screen, so all CRUD
  operations are allowed for both `anon` and `authenticated` roles.
  The data is intentionally public/shared across all visitors.
- Four separate policies: SELECT, INSERT, UPDATE, DELETE.

## Notes
1. The app frontend uses the Supabase anon key, so policies MUST include
   the `anon` role — otherwise the app cannot read its own data.
2. Demo seed data is inserted by the application on first load if the table
   is empty — no seed data is inserted in this migration.
*/

CREATE TABLE IF NOT EXISTS produce (
  id text PRIMARY KEY,
  farmer_name text NOT NULL,
  crop_name text NOT NULL,
  category text NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  price numeric NOT NULL,
  location text NOT NULL,
  contact text NOT NULL,
  image text NOT NULL,
  urgent boolean NOT NULL DEFAULT false,
  harvest_date date NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE produce ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_produce" ON produce;
CREATE POLICY "anon_select_produce"
  ON produce FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_insert_produce" ON produce;
CREATE POLICY "anon_insert_produce"
  ON produce FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_produce" ON produce;
CREATE POLICY "anon_update_produce"
  ON produce FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_produce" ON produce;
CREATE POLICY "anon_delete_produce"
  ON produce FOR DELETE
  TO anon, authenticated
  USING (true);
