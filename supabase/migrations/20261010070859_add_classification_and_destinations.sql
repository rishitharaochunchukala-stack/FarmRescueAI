/*
# Add Produce Classification and Destinations

## Purpose
Adds two new columns to the `produce` table to support condition-based
routing, and creates a new `destinations` table for verified destination
data (buyers, NGOs, processors, juice vendors, composting facilities).

## Changes to `produce` table
1. `availability` (text, NOT NULL, DEFAULT 'surplus')
   - Values: 'surplus' | 'not_surplus'
   - Indicates whether the listing is surplus produce or not.
2. `condition` (text, NOT NULL, DEFAULT 'fresh_good')
   - Values: 'fresh_good', 'cosmetically_damaged', 'overripe',
     'rotten_decayed', 'uncertain'
   - Farmer-selected condition of the produce.
Both columns have safe defaults so existing rows are automatically populated.
No existing columns are modified or removed.

## New table: `destinations`
- `id` (text, primary key) — unique identifier
- `name` (text, NOT NULL) — destination name
- `destination_type` (text, NOT NULL) — one of:
  'buyer_retailer', 'food_donation', 'food_processor',
  'juice_vendor', 'composting'
- `accepted_conditions` (text[], NOT NULL) — array of condition values
  this destination accepts
- `location` (text, NOT NULL) — full address/description
- `state` (text, NOT NULL) — Indian state for matching
- `min_quantity` (numeric, nullable) — minimum quantity accepted
- `max_quantity` (numeric, nullable) — maximum quantity accepted
- `unit` (text, nullable) — unit for min/max quantity
- `contact` (text, NOT NULL) — contact email or phone
- `verified` (boolean, NOT NULL, DEFAULT true) — always true for seeded data
- `created_at` (timestamptz, NOT NULL, DEFAULT now())

## Security
- RLS enabled on `destinations`.
- SELECT-only policy for anon + authenticated (destinations are
  admin-managed verified data — public can read but not modify).
- No INSERT/UPDATE/DELETE policies — the table is read-only from the client.

## Seed data
Six verified demo destinations across India covering all destination types:
1. FreshMart Retail Network (buyer_retailer, Maharashtra)
2. Annadata Food Relief NGO (food_donation, Karnataka)
3. AgriProcess Foods (food_processor, Haryana)
4. DailyJuice Co. (juice_vendor, Maharashtra)
5. GreenEarth Composting Facility (composting, Punjab)
6. HarvestHope NGO (food_donation, Madhya Pradesh)

## Important notes
1. This migration is idempotent — uses IF NOT EXISTS and DO $$ blocks.
2. No data is lost — all changes are additive.
3. Existing RLS policies on `produce` are unchanged.
*/

-- Part A: Add columns to produce table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'produce' AND column_name = 'availability'
  ) THEN
    ALTER TABLE produce ADD COLUMN availability text NOT NULL DEFAULT 'surplus';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'produce' AND column_name = 'condition'
  ) THEN
    ALTER TABLE produce ADD COLUMN condition text NOT NULL DEFAULT 'fresh_good';
  END IF;
END $$;

-- Part B: Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id text PRIMARY KEY,
  name text NOT NULL,
  destination_type text NOT NULL,
  accepted_conditions text[] NOT NULL,
  location text NOT NULL,
  state text NOT NULL,
  min_quantity numeric,
  max_quantity numeric,
  unit text,
  contact text NOT NULL,
  verified boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_destinations" ON destinations;
CREATE POLICY "anon_select_destinations"
  ON destinations FOR SELECT
  TO anon, authenticated USING (true);

-- Part C: Seed verified destinations (only if table is empty)
INSERT INTO destinations (id, name, destination_type, accepted_conditions, location, state, min_quantity, max_quantity, unit, contact, verified)
SELECT * FROM (VALUES
  ('d1', 'FreshMart Retail Network', 'buyer_retailer', ARRAY['fresh_good'], 'Plot 14, APMC Market Yard, Vashi, Navi Mumbai', 'Maharashtra', 50, 5000, 'kg', 'procurement@freshmart.example.in', true),
  ('d2', 'Annadata Food Relief NGO', 'food_donation', ARRAY['fresh_good', 'cosmetically_damaged'], '12 Charity Road, Bengaluru', 'Karnataka', 20, 2000, 'kg', 'relief@annadata.example.in', true),
  ('d3', 'AgriProcess Foods', 'food_processor', ARRAY['cosmetically_damaged', 'overripe'], 'Industrial Area, Sector 31, Sonipat', 'Haryana', 100, 10000, 'kg', 'intake@agriprocess.example.in', true),
  ('d4', 'DailyJuice Co.', 'juice_vendor', ARRAY['overripe'], 'Shivaji Market, Pune', 'Maharashtra', 30, 1000, 'kg', 'supply@dailyjuice.example.in', true),
  ('d5', 'GreenEarth Composting Facility', 'composting', ARRAY['rotten_decayed'], 'Village Jandiala, Ludhiana', 'Punjab', 10, 20000, 'kg', 'compost@greenearth.example.in', true),
  ('d6', 'HarvestHope NGO', 'food_donation', ARRAY['fresh_good'], 'MG Road, Indore', 'Madhya Pradesh', 25, 3000, 'kg', 'donate@harvesthope.example.in', true)
) AS t(id, name, destination_type, accepted_conditions, location, state, min_quantity, max_quantity, unit, contact, verified)
WHERE NOT EXISTS (SELECT 1 FROM destinations LIMIT 1);
