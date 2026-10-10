import { useState } from 'react';
import { TriangleAlert as AlertTriangle, Clock, Zap } from 'lucide-react';
import type { Produce } from '@/types';
import ProduceCard from '@/components/ProduceCard';
import ProduceDetailModal from '@/components/ProduceDetailModal';

interface RescuePageProps {
  produce: Produce[];
}

export default function RescuePage({ produce }: RescuePageProps) {
  const [selected, setSelected] = useState<Produce | null>(null);
  const urgentItems = produce.filter((p) => p.urgent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-7 h-7 text-amber-500" />
          <h1 className="text-3xl font-bold text-gray-800">Rescue Produce</h1>
        </div>
        <p className="text-gray-500">
          Surplus produce that needs buyers quickly. Act fast &mdash; these items are highly
          perishable and at risk of going to waste.
        </p>
      </div>

      {/* Urgency banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-amber-800">
              {urgentItems.length} urgent {urgentItems.length === 1 ? 'listing' : 'listings'} need attention
            </h2>
            <p className="text-sm text-amber-700 mt-1">
              These crops were harvested recently and won&rsquo;t last long. Buying or
              sharing them prevents food waste and supports local farmers.
            </p>
          </div>
        </div>
      </div>

      {/* Urgent items */}
      {urgentItems.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-800">Expiring Soon</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {urgentItems.map((item) => (
              <ProduceCard key={item.id} produce={item} onView={setSelected} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <CheckCircle />
          <p className="text-gray-600 font-medium">No urgent listings right now</p>
          <p className="text-gray-400 text-sm mt-1">All surplus produce has been rescued!</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-10 bg-green-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Tips for Reducing Farm Waste
        </h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">&bull;</span>
            List surplus produce as soon as it&rsquo;s harvested to give buyers maximum time.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">&bull;</span>
            Mark perishable items as urgent so they appear in the Rescue section.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">&bull;</span>
            Consider bundling smaller quantities to attract more buyers.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">&bull;</span>
            Use the AI Assistant for pricing suggestions and market insights.
          </li>
        </ul>
      </div>

      {selected && (
        <ProduceDetailModal produce={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function CheckCircle() {
  return (
    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
      <Clock className="w-6 h-6 text-green-600" />
    </div>
  );
}
