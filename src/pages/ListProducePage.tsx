import { useState } from 'react';
import {
  CircleCheck as CheckCircle2,
  CircleAlert as AlertCircle,
  Package,
  Loader as Loader2,
  Info,
} from 'lucide-react';
import type { Produce, Unit, Availability, ProduceCondition } from '@/types';
import { unitOptions, conditionOptions } from '@/data/sampleData';
import { todayISO } from '@/utils/format';
import ConditionBadge from '@/components/ConditionBadge';

interface ListProducePageProps {
  onAddProduce: (produce: Produce) => Promise<{ success: boolean; error: string | null }>;
}

interface FormErrors {
  farmerName?: string;
  cropName?: string;
  quantity?: string;
  price?: string;
  location?: string;
  contact?: string;
  condition?: string;
}

type FormState = {
  farmerName: string;
  cropName: string;
  category: string;
  quantity: string;
  unit: Unit;
  price: string;
  location: string;
  contact: string;
  urgent: boolean;
  description: string;
  availability: Availability;
  condition: ProduceCondition;
};

const initialState: FormState = {
  farmerName: '',
  cropName: '',
  category: 'Vegetables',
  quantity: '',
  unit: 'kg',
  price: '',
  location: '',
  contact: '',
  urgent: false,
  description: '',
  availability: 'surplus',
  condition: 'fresh_good',
};

export default function ListProducePage({ onAddProduce }: ListProducePageProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.farmerName.trim()) e.farmerName = 'Please enter your name';
    if (!form.cropName.trim()) e.cropName = 'Please enter the crop name';
    if (!form.quantity || Number(form.quantity) <= 0)
      e.quantity = 'Enter a quantity greater than 0';
    if (!form.price || Number(form.price) <= 0)
      e.price = 'Enter a price greater than 0';
    if (!form.location.trim()) e.location = 'Please enter your location';
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

    const newProduce: Produce = {
      id: `p${Date.now()}`,
      farmerName: form.farmerName.trim(),
      cropName: form.cropName.trim(),
      category: form.category,
      quantity: Number(form.quantity),
      unit: form.unit,
      price: Number(form.price),
      location: form.location.trim(),
      contact: form.contact.trim(),
      image:
        'https://images.pexels.com/photos/5425794/pexels-photo-5425794.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
      urgent: form.urgent,
      harvestDate: todayISO(),
      description: form.description.trim() || undefined,
      availability: form.availability,
      condition: form.condition,
    };

    const { success, error } = await onAddProduce(newProduce);

    if (!success) {
      setSubmitError(
        error ??
          'Something went wrong while saving your listing. Your details are preserved — please try again.'
      );
      setIsSubmitting(false);
      return;
    }

    setForm(initialState);
    setErrors({});
    setSuccess(true);
    setSubmitError(null);
    setIsSubmitting(false);

    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
          <Package className="w-7 h-7 text-green-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">List Your Produce</h1>
        <p className="text-gray-500">
          Share your surplus with buyers. Fill in the details below to create a listing.
        </p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Listing created successfully!</p>
            <p className="text-sm text-green-600">
              Your produce has been added to the marketplace. Buyers can now find it.
            </p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <p className="font-semibold text-red-800">Could not save listing</p>
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-5"
      >
        {/* Farmer name */}
        <Field
          label="Farmer Name"
          error={errors.farmerName}
          required
        >
          <input
            type="text"
            value={form.farmerName}
            onChange={(e) => update('farmerName', e.target.value)}
            placeholder="e.g. Ramesh Patil"
            disabled={isSubmitting}
            className={inputClass(errors.farmerName)}
          />
        </Field>

        {/* Crop name + category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Crop Name" error={errors.cropName} required>
            <input
              type="text"
              value={form.cropName}
              onChange={(e) => update('cropName', e.target.value)}
              placeholder="e.g. Fresh Tomatoes"
              disabled={isSubmitting}
              className={inputClass(errors.cropName)}
            />
          </Field>
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              disabled={isSubmitting}
              className={inputClass()}
            >
              {['Vegetables', 'Fruits', 'Root Vegetables', 'Leafy Greens', 'Grains'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Quantity + unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Quantity" error={errors.quantity} required>
            <input
              type="number"
              min={0}
              step="0.1"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
              placeholder="e.g. 500"
              disabled={isSubmitting}
              className={inputClass(errors.quantity)}
            />
          </Field>
          <Field label="Unit">
            <select
              value={form.unit}
              onChange={(e) => update('unit', e.target.value)}
              disabled={isSubmitting}
              className={inputClass()}
            >
              {unitOptions.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Price */}
        <Field label="Price per unit (₹)" error={errors.price} required>
          <input
            type="number"
            min={0}
            step="1"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            placeholder="e.g. 35"
            disabled={isSubmitting}
            className={inputClass(errors.price)}
          />
        </Field>

        {/* Location */}
        <Field label="Location" error={errors.location} required>
          <input
            type="text"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="e.g. Greenfield Farm, Nashik, Maharashtra"
            disabled={isSubmitting}
            className={inputClass(errors.location)}
          />
        </Field>

        {/* Contact */}
        <Field label="Contact (email or phone)" error={errors.contact} required>
          <input
            type="text"
            value={form.contact}
            onChange={(e) => update('contact', e.target.value)}
            placeholder="e.g. ramesh.patil@example.in"
            disabled={isSubmitting}
            className={inputClass(errors.contact)}
          />
        </Field>

        {/* Description */}
        <Field label="Description (optional)">
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Add details about your produce..."
            rows={3}
            disabled={isSubmitting}
            className={inputClass() + ' resize-none'}
          />
        </Field>

        {/* Availability selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <div className="flex gap-3">
            {(
              [
                { value: 'surplus', label: 'Surplus', desc: 'Excess produce to sell or donate' },
                { value: 'not_surplus', label: 'Not Surplus', desc: 'Regular harvest, not excess' },
              ] as { value: Availability; label: string; desc: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('availability', opt.value)}
                disabled={isSubmitting}
                className={`flex-1 text-left p-3 rounded-lg border-2 transition-all ${
                  form.availability === opt.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Condition selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition <span className="text-red-500">*</span>
          </label>
          <div className="mb-2 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-2.5">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Select the condition that best describes your produce. This determines where it gets
              routed — buyers, processors, juice vendors, composting, or inspection. Be honest:
              misclassifying spoiled produce as fresh is a health risk.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {conditionOptions.map((opt) => {
              const selected = form.condition === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('condition', opt.value)}
                  disabled={isSubmitting}
                  className={`text-left p-3 rounded-lg border-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    selected
                      ? 'border-green-500 bg-green-50 ring-1 ring-green-400'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ConditionBadge condition={opt.value} />
                    {selected && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{opt.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Urgent checkbox */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.urgent}
            onChange={(e) => update('urgent', e.target.checked)}
            disabled={isSubmitting}
            className="w-5 h-5 accent-green-600 rounded"
          />
          <span className="text-sm text-gray-700">
            Mark as <strong className="text-amber-600">urgent</strong> &mdash; this produce needs a buyer quickly
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving...
            </>
          ) : (
            'Publish Listing'
          )}
        </button>
      </form>
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
    error
      ? 'border-red-400 focus:ring-red-500 bg-red-50'
      : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
  }`;
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}
