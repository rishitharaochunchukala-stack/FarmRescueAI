import { X } from 'lucide-react';
import type { Produce } from '@/types';
import { MapPin, Phone, Package, Tag, Calendar, User } from 'lucide-react';
import { formatDate } from '@/utils/format';

interface ProduceDetailModalProps {
  produce: Produce;
  onClose: () => void;
}

export default function ProduceDetailModal({ produce, onClose }: ProduceDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-56">
          <img
            src={produce.image}
            alt={produce.cropName}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-white transition-colors shadow-md"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {produce.category}
          </span>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{produce.cropName}</h2>
          <p className="text-gray-500 mb-4">Listed by {produce.farmerName}</p>

          {produce.description && (
            <p className="text-gray-600 mb-4 leading-relaxed">{produce.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <InfoRow icon={Package} label="Quantity" value={`${produce.quantity} ${produce.unit}`} />
            <InfoRow icon={Tag} label="Price" value={`₹${produce.price.toLocaleString('en-IN')} / ${produce.unit}`} />
            <InfoRow icon={MapPin} label="Location" value={produce.location} />
            <InfoRow icon={Calendar} label="Harvested" value={formatDate(produce.harvestDate)} />
            <InfoRow icon={User} label="Farmer" value={produce.farmerName} />
            <InfoRow icon={Phone} label="Contact" value={produce.contact} />
          </div>

          {produce.urgent && (
            <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-lg p-3 text-sm mb-4">
              This produce needs a buyer quickly — it is highly perishable!
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-700 font-medium">{value}</p>
      </div>
    </div>
  );
}
