import { X, MapPin, Phone, Package, Tag, Calendar, User, Compass, ArrowRight, ShieldCheck, ShieldAlert, MapPinOff } from 'lucide-react';
import type { Produce, Destination } from '@/types';
import { formatDate } from '@/utils/format';
import ConditionBadge from '@/components/ConditionBadge';
import { getRecommendation, getDestinationTypeLabel } from '@/lib/recommendationEngine';

interface ProduceDetailModalProps {
  produce: Produce;
  onClose: () => void;
  destinations?: Destination[];
}

export default function ProduceDetailModal({ produce, onClose, destinations = [] }: ProduceDetailModalProps) {
  const rec = getRecommendation(produce, destinations);

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
          {produce.availability === 'surplus' && (
            <span className="absolute bottom-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Surplus
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {produce.category}
          </span>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{produce.cropName}</h2>
          <p className="text-gray-500 mb-3">Listed by {produce.farmerName}</p>

          <div className="mb-4">
            <ConditionBadge condition={produce.condition} size="md" />
          </div>

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

          {/* Classification & Routing section */}
          <div className={`rounded-xl border-2 p-4 mb-4 ${
            rec.humanConsumptionBlocked
              ? 'border-red-200 bg-red-50'
              : rec.noDestinationFound
                ? 'border-amber-200 bg-amber-50'
                : 'border-green-200 bg-green-50'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Compass className={`w-5 h-5 ${
                rec.humanConsumptionBlocked ? 'text-red-600' : rec.noDestinationFound ? 'text-amber-600' : 'text-green-600'
              }`} />
              <h3 className="font-semibold text-gray-800">Classification & Routing</h3>
            </div>

            {/* Classification */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-0.5">Classification</p>
              <p className="text-sm font-semibold text-gray-800">{rec.classification}</p>
            </div>

            {/* Reason */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-0.5">Why this routing</p>
              <p className="text-sm text-gray-700 leading-relaxed">{rec.reason}</p>
            </div>

            {/* Recommended destination type */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-0.5">Recommended destination type</p>
              <p className="text-sm font-semibold text-gray-800">
                {rec.inspectionRequired ? (
                  'None — inspection required before any routing'
                ) : (
                  rec.destinationTypeLabel
                )}
              </p>
            </div>

            {/* Next action */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-0.5">Next action</p>
              <div className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">{rec.nextAction}</p>
              </div>
            </div>

            {/* Safety badges */}
            {rec.humanConsumptionBlocked && !rec.inspectionRequired && (
              <div className="flex items-center gap-2 bg-red-100 rounded-lg p-2.5 mb-3">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-xs font-medium text-red-700">
                  Human consumption destinations blocked — health hazard
                </p>
              </div>
            )}
            {rec.inspectionRequired && (
              <div className="flex items-center gap-2 bg-gray-200 rounded-lg p-2.5 mb-3">
                <ShieldAlert className="w-4 h-4 text-gray-700 shrink-0" />
                <p className="text-xs font-medium text-gray-700">
                  Inspection required — no automatic routing to consumption or donation
                </p>
              </div>
            )}

            {/* Matched verified destinations */}
            {rec.inspectionRequired ? (
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2.5">
                <MapPinOff className="w-4 h-4 text-gray-500 shrink-0" />
                <p className="text-xs text-gray-600">
                  No destinations recommended until the produce is inspected and its condition confirmed.
                </p>
              </div>
            ) : rec.noDestinationFound ? (
              <div className="flex items-center gap-2 bg-amber-100 rounded-lg p-2.5">
                <MapPinOff className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">
                  No verified destination found for this condition in your region. Try broadening your location or contacting local organisations directly.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  {rec.matchedDestinations.length} verified {rec.matchedDestinations.length === 1 ? 'destination' : 'destinations'} found
                </p>
                <div className="space-y-2">
                  {rec.matchedDestinations.map((dest) => (
                    <div key={dest.id} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-800">{dest.name}</p>
                        <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full shrink-0">
                          {getDestinationTypeLabel(dest.destinationType)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {dest.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {dest.contact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
