import { supabase } from '@/lib/supabase';
import { produceList } from '@/data/sampleData';
import type { Produce, Destination, ProduceCondition, Availability, DestinationType, TomatoMaterial, TomatoMaterialType, TomatoMaterialStatus, SuspiciousReport } from '@/types';

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
  availability: string;
  condition: string;
}

interface DestinationRow {
  id: string;
  name: string;
  destination_type: string;
  accepted_conditions: string[];
  location: string;
  state: string;
  min_quantity: number | null;
  max_quantity: number | null;
  unit: string | null;
  contact: string;
  verified: boolean;
}

interface TomatoMaterialRow {
  id: string;
  material_type: string;
  quantity: number;
  unit: string;
  condition: string;
  location: string;
  contact: string;
  availability: string;
  intended_destination: string | null;
  notes: string | null;
  created_at: string;
}

interface TomatoMaterialPublicRow {
  id: string;
  material_type: string;
  quantity: number;
  unit: string;
  condition: string;
  location: string;
  contact_masked: string;
  availability: string;
  intended_destination: string | null;
  notes: string | null;
  created_at: string;
}

interface SuspiciousReportRow {
  id: string;
  listing_id: string | null;
  reason: string;
  reporter_contact: string | null;
  status: string;
  created_at: string;
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
    availability: (row.availability ?? 'surplus') as Availability,
    condition: (row.condition ?? 'fresh_good') as ProduceCondition,
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
    availability: item.availability,
    condition: item.condition,
  };
}

function rowToDestination(row: DestinationRow): Destination {
  return {
    id: row.id,
    name: row.name,
    destinationType: row.destination_type as DestinationType,
    acceptedConditions: row.accepted_conditions as ProduceCondition[],
    location: row.location,
    state: row.state,
    minQuantity: row.min_quantity !== null ? Number(row.min_quantity) : null,
    maxQuantity: row.max_quantity !== null ? Number(row.max_quantity) : null,
    unit: row.unit,
    contact: row.contact,
    verified: row.verified,
  };
}

function rowToTomatoMaterialPublic(row: TomatoMaterialPublicRow): TomatoMaterial {
  return {
    id: row.id,
    materialType: row.material_type as TomatoMaterialType,
    quantity: Number(row.quantity),
    unit: row.unit as 'kg' | 'tonne',
    condition: row.condition as ProduceCondition,
    location: row.location,
    contact: row.contact_masked,
    availability: row.availability as TomatoMaterialStatus,
    intendedDestination: row.intended_destination ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

function tomatoMaterialToRow(item: Omit<TomatoMaterial, 'id' | 'createdAt'>): TomatoMaterialRow {
  return {
    id: crypto.randomUUID(),
    material_type: item.materialType,
    quantity: item.quantity,
    unit: item.unit,
    condition: item.condition,
    location: item.location,
    contact: item.contact,
    availability: item.availability,
    intended_destination: item.intendedDestination ?? null,
    notes: item.notes ?? null,
    created_at: new Date().toISOString(),
  };
}

export async function loadProduce(): Promise<{
  items: Produce[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('produce_public')
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

export async function loadDestinations(): Promise<{
  items: Destination[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return { items: [], error: error.message };
  }

  const rows = (data ?? []) as DestinationRow[];
  return { items: rows.map(rowToDestination), error: null };
}

export async function loadTomatoMaterials(): Promise<{
  items: TomatoMaterial[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('tomato_materials_public')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { items: [], error: error.message };
  }

  const rows = (data ?? []) as TomatoMaterialPublicRow[];
  return { items: rows.map(rowToTomatoMaterialPublic), error: null };
}

export async function saveTomatoMaterial(
  item: Omit<TomatoMaterial, 'id' | 'createdAt'>
): Promise<{ success: boolean; error: string | null }> {
  const row = tomatoMaterialToRow(item);

  const { error } = await supabase.from('tomato_materials').insert(row);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function saveSuspiciousReport(
  report: Omit<SuspiciousReport, 'id' | 'status' | 'createdAt'>
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase.from('suspicious_reports').insert({
    listing_id: report.listingId,
    reason: report.reason,
    reporter_contact: report.reporterContact,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
