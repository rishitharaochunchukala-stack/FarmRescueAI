import { useState, useEffect, useCallback } from 'react';
import {
  Recycle,
  CircleCheck as CheckCircle2,
  CircleAlert as AlertCircle,
  Package,
  Loader as Loader2,
  Info,
  MapPin,
  Calendar,
  Search,
} from 'lucide-react';
import type { TomatoMaterial, TomatoMaterialType, ProduceCondition } from '@/types';
import { conditionOptions } from '@/data/sampleData';
import { loadTomatoMaterials, saveTomatoMaterial } from '@/lib/produceStorage';
import { formatDate } from '@/utils/format';
import ConditionBadge from '@/components/ConditionBadge';

const MATERIAL_TYPES: { value: TomatoMaterialType; label: string; telugu: string }[] = [
  { value: 'surplus_tomatoes', label: 'Surplus Tomatoes', telugu: 'మిగిలిన టమాటాలు' },
  { value: 'tomato_skins', label: 'Tomato Skins', telugu: 'టమాట తొక్కలు' },
  { value: 'tomato_pulp', label: 'Tomato Pulp', telugu: 'టమాట గుజ్జం' },
  { value: 'processing_residue', label: 'Processing Residue', telugu: 'ప్రాసెసింగ్ వ్యర్థం' },
];

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  available: { label: 'Available', class: 'bg-green-100 text-green-700' },
  contact_requested: { label: 'Contact Requested', class: 'bg-blue-100 text-blue-700' },
  collected: { label: 'Collected', class: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Completed', class: 'bg-gray-200 text-gray-700' },
};

interface FormErrors {
  materialType?: string;
  quantity?: string;
  location?: string;
  contact?: string;
}

interface FormState {
  materialType: TomatoMaterialType;
  quantity: string;
  unit: 'kg' | 'tonne';
  condition: ProduceCondition;
  location: string;
  contact: string;
  intendedDestination: string;
  notes: string;
}

const initialState: FormState = {
  materialType: 'surplus_tomatoes',
  quantity: '',
  unit: 'kg',
  condition: 'fresh_good',
  location: '',
  contact: '',
  intendedDestination: '',
  notes: '',
};

export default function CircularHubPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [materials, setMaterials] = useState<TomatoMaterial[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [materialsError, setMaterialsError] = useState<string | null>(null);

  const refreshMaterials = useCallback(async () => {
    const { items, error } = await loadTomatoMaterials();
    if (error) {
      setMaterialsError(error);
    } else {
      setMaterials(items);
      setMaterialsError(null);
    }
    setIsLoadingMaterials(false);
  }, []);

  useEffect(() => {
    refreshMaterials();
  }, [refreshMaterials]);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.quantity || Number(form.quantity) <= 0)
      e.quantity = 'Enter a quantity greater than 0';
    if (!form.location.trim()) e.location = 'Please enter an approximate location';
    if (!form.contact.trim()) e.contact = 'Please enter a contact email or phone';
    else if (form.contact.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact))
      e.contact = 'Please enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const { success, error } = await saveTomatoMaterial({
      materialType: form.materialType,
      quantity: Number(form.quantity),
      unit: form.unit,
      condition: form.condition,
      location: form.location.trim(),
      contact: form.contact.trim(),
      availability: 'available',
      intendedDestination: form.intendedDestination.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });

    if (!success) {
      setSubmitError(
        error ??
          'Something went wrong while saving your material listing. Please try again.'
      );
      setIsSubmitting(false);
      return;
    }

    setForm(initialState);
    setErrors({});
    setSuccess(true);
    setSubmitError(null);
    setIsSubmitting(false);
    refreshMaterials();

    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-full mb-3">
          <Recycle className="w-7 h-7 text-orange-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Tomato-to-Leather Circular Hub</h1>
        <p className="text-gray-500">
          Record tomato by-products (skins, pulp, surplus) for potential upcycling into bio-materials.
        </p>
      </div>

      {/* Honest disclaimer */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Tomato leather is an emerging research area. Durability,
          commercial viability, and production processes are not yet proven at scale. This hub
          connects material suppliers with potential processors — it does not guarantee any
          outcome, price, or transaction. Recovery-value estimates, if shown, are illustrative only.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div>
          {success && (
            <div className="mb-4 bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <p className="font-semibold text-green-800">Material listed!</p>
                <p className="text-sm text-green-600">
                  Your tomato by-product has been recorded. If a verified processor is available, it will appear below.
                </p>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mb-4 bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Could not save</p>
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
          >
            {/* Material type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Material Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.materialType}
                onChange={(e) => update('materialType', e.target.value)}
                disabled={isSubmitting}
                className={inputClass()}
              >
                {MATERIAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label} ({t.telugu})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity + unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={form.quantity}
                  onChange={(e) => update('quantity', e.target.value)}
                  placeholder="e.g. 100"
                  disabled={isSubmitting}
                  className={inputClass(errors.quantity)}
                />
                {errors.quantity && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.quantity}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
                <select
                  value={form.unit}
                  onChange={(e) => update('unit', e.target.value)}
                  disabled={isSubmitting}
                  className={inputClass()}
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="tonne">Tonnes (t)</option>
                </select>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                value={form.condition}
                onChange={(e) => update('condition', e.target.value)}
                disabled={isSubmitting}
                className={inputClass()}
              >
                {conditionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <ConditionBadge condition={form.condition} />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Approximate Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Nashik, Maharashtra"
                disabled={isSubmitting}
                className={inputClass(errors.location)}
              />
              <p className="mt-1 text-xs text-gray-400">
                Use an approximate public location — do not share exact farm coordinates.
              </p>
              {errors.location && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.location}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contact (email or phone) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => update('contact', e.target.value)}
                placeholder="e.g. farmer@example.in"
                disabled={isSubmitting}
                className={inputClass(errors.contact)}
              />
              <p className="mt-1 text-xs text-gray-400">
                Your contact is masked in public views (e.g. fa****in).
              </p>
              {errors.contact && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.contact}
                </p>
              )}
            </div>

            {/* Intended destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Intended Destination (optional)
              </label>
              <input
                type="text"
                value={form.intendedDestination}
                onChange={(e) => update('intendedDestination', e.target.value)}
                placeholder="e.g. Bio-material research lab"
                disabled={isSubmitting}
                className={inputClass()}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes (optional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Add details about the material..."
                rows={2}
                disabled={isSubmitting}
                className={inputClass() + ' resize-none'}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 text-white font-semibold py-3.5 rounded-xl hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                </>
              ) : (
                'Record Material'
              )}
            </button>
          </form>
        </div>

        {/* Listings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            Recorded Materials
          </h2>

          {isLoadingMaterials ? (
            <div className="text-center py-12">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
              <p className="text-sm text-gray-400 mt-2">Loading materials...</p>
            </div>
          ) : materialsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">Could not load materials: {materialsError}</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <Recycle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No materials recorded yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Submit the form to record your first tomato by-product.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {materials.map((mat) => {
                const statusInfo = STATUS_LABELS[mat.availability] ?? STATUS_LABELS.available;
                const matType = MATERIAL_TYPES.find((t) => t.value === mat.materialType);
                return (
                  <div key={mat.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {matType?.label ?? mat.materialType}
                        </p>
                        <p className="text-xs text-gray-400">
                          {matType?.telugu}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <ConditionBadge condition={mat.condition} />
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-orange-600" />
                        {mat.quantity} {mat.unit}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        {mat.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="text-xs text-gray-400">{formatDate(mat.createdAt.split('T')[0])}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-orange-600" />
                        <span className="text-xs text-gray-500">Contact: {mat.contact}</span>
                      </p>
                    </div>

                    {mat.intendedDestination && (
                      <p className="text-xs text-gray-500 mt-2">
                        <strong>Intended for:</strong> {mat.intendedDestination}
                      </p>
                    )}
                    {mat.notes && (
                      <p className="text-xs text-gray-500 mt-1">{mat.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Verified processors section */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Verified Processors</h3>
            <p className="text-sm text-gray-500">
              No verified processors available yet.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Processor and research-partner listings will appear here only when real verified records exist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
    error
      ? 'border-red-400 focus:ring-red-500 bg-red-50'
      : 'border-gray-300 focus:ring-orange-500 focus:border-transparent'
  }`;
}
