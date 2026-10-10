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