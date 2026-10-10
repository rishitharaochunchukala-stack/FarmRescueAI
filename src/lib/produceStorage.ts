import { supabase } from '@/lib/supabase';
import { produceList } from '@/data/sampleData';
import type { Produce } from '@/types';

/**
 * Database row shape — uses snake_case column names.
 * The mapping functions convert between this and the camelCase Produce type.
 */
interface ProduceRow {
  id: string;
  farmer_name: string;
  crop_name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  contact: string;
  image: string;
  urgent: boolean;
  harvest_date: string;
  description: string | null;
}

function rowToProduce(row: ProduceRow): Produce {
  return {
    id: row.id,
    farmerName: row.farmer_name,
    cropName: row.crop_name,
    category: row.category,
    quantity: Number(row.quantity),
    unit: row.unit as Produce['unit'],
    price: Number(row.price),
    location: row.location,
    contact: row.contact,
    image: row.image,
    urgent: row.urgent,
    harvestDate: row.harvest_date,
    description: row.description ?? undefined,
  };
}

function produceToRow(item: Produce): ProduceRow {
  return {
    id: item.id,
    farmer_name: item.farmerName,
    crop_name: item.cropName,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    price: item.price,
    location: item.location,
    contact: item.contact,
    image: item.image,
    urgent: item.urgent,
    harvest_date: item.harvestDate,
    description: item.description ?? null,
  };
}

/**
 * Load all produce listings from the database.
 * If the table is empty, seeds it with the demo sample data and returns that.
 * Returns { items, error } — never throws.
 */
export async function loadProduce(): Promise<{
  items: Produce[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('produce')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { items: [], error: error.message };
  }

  const rows = (data ?? []) as ProduceRow[];

  if (rows.length === 0) {
    const seedResult = await seedDemoProduce();
    if (seedResult.error) {
      return { items: [], error: seedResult.error };
    }
    return { items: seedResult.items, error: null };
  }

  return { items: rows.map(rowToProduce), error: null };
}

/**
 * Insert the demo sample listings into the empty database.
 * Returns { items, error }.
 */
async function seedDemoProduce(): Promise<{
  items: Produce[];
  error: string | null;
}> {
  const rows = produceList.map(produceToRow);

  const { error } = await supabase.from('produce').insert(rows);

  if (error) {
    return { items: [], error: error.message };
  }

  return { items: produceList, error: null };
}

/**
 * Save a single produce listing to the database.
 * Returns { success, error }.
 */
export async function saveProduce(
  item: Produce
): Promise<{ success: boolean; error: string | null }> {
  const row = produceToRow(item);

  const { error } = await supabase.from('produce').insert(row);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
