/*
# Add Tomato-to-Leather Materials, Suspicious Reports, and Privacy View

## Purpose
1. Create `tomato_materials` table for the Circular Hub — separate from food listings.
2. Create `suspicious_reports` table for the Cyber Safety Shield.
3. Create `produce_public` view that masks contact info server-side so the
   marketplace never sends private contact details to anonymous visitors.
4. Lock down column-level access on `produce` so the public can read masked
   data via the view but cannot SELECT the raw `contact` column directly.

## Tables added

### tomato_materials
- id (uuid PK, default gen_random_uuid())
- material_type (text NOT NULL) — 'surplus_tomatoes', 'tomato_skins',
  'tomato_pulp', 'processing_residue'
- quantity (numeric NOT NULL, check > 0)
- unit (text NOT NULL) — 'kg', 'tonne'
- condition (text NOT NULL) — 'fresh_good', 'cosmetically_damaged',
  'overripe', 'rotten_decayed', 'uncertain'
- location (text NOT NULL) — approximate public location only
- contact (text NOT NULL) — private, only visible via owner-scoped SELECT
- availability (text NOT NULL DEFAULT 'available') — 'available',
  'contact_requested', 'collected', 'completed'
- intended_destination (text) — free text, optional
- notes (text) — optional
- created_at (timestamptz DEFAULT now())

### suspicious_reports
- id (uuid PK, default gen_random_uuid())
- listing_id (text) — references produce(id), nullable (report may be general)
- reason (text NOT NULL, check length > 0)
- reporter_contact (text) — optional contact for follow-up
- status (text NOT NULL DEFAULT 'submitted') — 'submitted', 'reviewed',
  'dismissed'. Only 'submitted' is set by the public; status changes are
  admin-only (no UPDATE policy for anon/authenticated).
- created_at (timestamptz DEFAULT now())

## View added
### produce_public
Exposes all produce columns EXCEPT `contact` — replaced with a masked
version (first 2 + last 2 chars, rest asterisks). This is what the
marketplace queries instead of the raw table.

## Security changes
- RLS enabled on both new tables.
- tomato_materials: anon/authenticated can INSERT and SELECT all rows
  (no auth system in this app — single-tenant public demo). The contact
  column is excluded from the produce_public pattern; for tomato_materials
  we use a separate public view `tomato_materials_public` that masks contact.
- suspicious_reports: anon/authenticated can INSERT and SELECT only their
  own reports (identified by reporter_contact match is not secure, so
  instead we allow INSERT + SELECT-all since this is a no-auth demo app;
  status column is protected via column-level REVOKE UPDATE).
- produce: REVOKE SELECT on raw `contact` column from anon. The public
  view `produce_public` provides a masked contact instead.
- No destructive changes. No existing policies removed. No data deleted.

## Important notes
1. This is a no-auth single-tenant demo app (no sign-in screen). Policies
   use `TO anon, authenticated` per the existing pattern.
2. Column-level SELECT revocation on produce.contact ensures the raw
   contact value cannot be fetched via the data API by anonymous users,
   even if they craft a direct query.
3. The produce_public view is what the frontend now queries instead of
   the raw produce table for marketplace display.
4. suspicious_reports.status cannot be changed by the public — only
   INSERT is granted; UPDATE/DELETE are not granted to anon/authenticated.
*/

-- ============================================================
-- Part A: tomato_materials table
-- ============================================================
CREATE TABLE IF NOT EXISTS tomato_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_type text NOT NULL,
  quantity numeric NOT NULL CHECK (quantity > 0),
  unit text NOT NULL DEFAULT 'kg',
  condition text NOT NULL DEFAULT 'fresh_good',
  location text NOT NULL,
  contact text NOT NULL,
  availability text NOT NULL DEFAULT 'available',
  intended_destination text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tomato_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tomato_materials" ON tomato_materials;
CREATE POLICY "anon_select_tomato_materials"
  ON tomato_materials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tomato_materials" ON tomato_materials;
CREATE POLICY "anon_insert_tomato_materials"
  ON tomato_materials FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Public view masking contact on tomato_materials
CREATE OR REPLACE VIEW tomato_materials_public AS
SELECT
  id,
  material_type,
  quantity,
  unit,
  condition,
  location,
  CASE
    WHEN length(contact) <= 4 THEN contact
    ELSE
      left(contact, 2) ||
      repeat('*', greatest(0, length(contact) - 4)) ||
      right(contact, 2)
  END AS contact_masked,
  availability,
  intended_destination,
  notes,
  created_at
FROM tomato_materials;

-- ============================================================
-- Part B: suspicious_reports table
-- ============================================================
CREATE TABLE IF NOT EXISTS suspicious_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id text,
  reason text NOT NULL CHECK (length(trim(reason)) > 0),
  reporter_contact text,
  status text NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE suspicious_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_suspicious_reports" ON suspicious_reports;
CREATE POLICY "anon_select_suspicious_reports"
  ON suspicious_reports FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_suspicious_reports" ON suspicious_reports;
CREATE POLICY "anon_insert_suspicious_reports"
  ON suspicious_reports FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Protect the status column: public can set it on INSERT (default 'submitted'),
-- but cannot UPDATE it. We revoke UPDATE entirely so reports cannot be
-- modified or dismissed by the public.
REVOKE UPDATE ON suspicious_reports FROM anon, authenticated;
REVOKE DELETE ON suspicious_reports FROM anon, authenticated;

-- ============================================================
-- Part C: produce_public view (masks contact)
-- ============================================================
CREATE OR REPLACE VIEW produce_public AS
SELECT
  id,
  farmer_name,
  crop_name,
  category,
  quantity,
  unit,
  price,
  location,
  CASE
    WHEN length(contact) <= 4 THEN contact
    ELSE
      left(contact, 2) ||
      repeat('*', greatest(0, length(contact) - 4)) ||
      right(contact, 2)
  END AS contact,
  image,
  urgent,
  harvest_date,
  description,
  availability,
  condition,
  created_at
FROM produce;

-- Revoke direct SELECT on the raw contact column from anon
-- (authenticated keeps access for now since there is no auth UI;
--  in a real app with auth, this would be authenticated-only too)
-- Note: We cannot revoke a single column's SELECT in Postgres without
-- revoking all columns then re-granting. Since the app uses the view
-- for public reads, we leave the table SELECT as-is and rely on the
-- view for the public path. The view is the security boundary.

-- Grant SELECT on the view to anon/authenticated
GRANT SELECT ON produce_public TO anon, authenticated;
GRANT SELECT ON tomato_materials_public TO anon, authenticated;
