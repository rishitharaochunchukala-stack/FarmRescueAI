import type { Produce, Destination } from '@/types';
import { MapPin, Phone, Package, Tag, TriangleAlert as AlertTriangle, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/format';
import ConditionBadge from '@/components/ConditionBadge';
import { getRecommendation } from '@/lib/recommendationEngine';

interface ProduceCardProps {
  produce: Produce;
  onView?: (produce: Produce) => void;
  destinations?: Destination[];
}

export default function ProduceCard({ produce, onView, destinations = [] }: ProduceCardProps) {
  const rec = getRecommendation(produce, destinations);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={produce.image}
          alt={produce.cropName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {produce.urgent && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <AlertTriangle className="w-3.5 h-3.5" /> Rescue Fast
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/95 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
          {produce.category}
        </span>
        {produce.availability === 'surplus' && (
          <span className="absolute bottom-3 right-3 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            Surplus
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-lg">{produce.cropName}</h3>
        <p className="text-sm text-gray-500 mb-2">by {produce.farmerName}</p>

        <div className="mb-2">
          <ConditionBadge condition={produce.condition} />
        </div>

        <div className="space-y-1.5 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-green-600 shrink-0" />
            <span>
              {produce.quantity} {produce.unit}
              {produce.quantity > 1 && produce.unit !== 'tonne' ? 's' : ''} available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-600 shrink-0" />
            <span>
              ₹{produce.price.toLocaleString('en-IN')} per {produce.unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600 shrink-0" />
            <span className="truncate">{produce.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-600 shrink-0" />
            <span className="truncate">{produce.contact}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-600 shrink-0" />
            <span className="text-xs text-gray-400">Harvested: {formatDate(produce.harvestDate)}</span>
          </div>
        </div>

        {produce.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{produce.description}</p>
        )}

        {/* One-line recommendation summary */}
        <div
          className={`text-xs rounded-lg p-2 mb-3 ${
            rec.humanConsumptionBlocked
              ? 'bg-red-50 text-red-700'
              : rec.noDestinationFound
                ? 'bg-amber-50 text-amber-700'
                : 'bg-green-50 text-green-700'
          }`}
        >
          {rec.inspectionRequired
            ? 'Inspection required before routing'
            : rec.humanConsumptionBlocked
              ? 'Route to composting only'
              : rec.noDestinationFound
                ? 'No verified destination in your region'
                : `Recommended: ${rec.destinationTypeLabel}`}
        </div>

        {onView && (
          <button
            onClick={() => onView(produce)}
            className="mt-auto w-full bg-green-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
