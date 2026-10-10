import { Package, TrendingUp, Wallet, TriangleAlert as AlertTriangle, ShoppingBag, Leaf } from 'lucide-react';
import StatCard from '@/components/StatCard';
import type { Produce } from '@/types';

interface DashboardPageProps {
  produce: Produce[];
}

export default function DashboardPage({ produce }: DashboardPageProps) {
  const activeListings = produce.length;
  const urgentCount = produce.filter((p) => p.urgent).length;
  const recentListings = produce.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Farmer Dashboard</h1>
        <p className="text-gray-500">
          Overview of your farm&rsquo;s activity.
        </p>
        <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
          Listing counts are live from the database; sales and revenue are simulated
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard
          label="Active Listings"
          value={activeListings}
          icon={Package}
          color="green"
          sublabel={`${urgentCount} marked urgent`}
        />
        <StatCard
          label="Produce Sold"
          value="1,240 kg"
          icon={TrendingUp}
          color="blue"
          sublabel="This month — simulated"
        />
        <StatCard
          label="Revenue (simulated)"
          value="₹3,42,000"
          icon={Wallet}
          sublabel="From 9 completed sales — demo data"
        />
        <StatCard
          label="Rescued from Waste"
          value="320 kg"
          icon={Leaf}
          color="green"
          sublabel="~1,100 kg CO2 saved — simulated"
        />
        <StatCard
          label="Pending Orders"
          value={3}
          icon={ShoppingBag}
          color="blue"
          sublabel="Awaiting buyer pickup — simulated"
        />
        <StatCard
          label="Urgent Alerts"
          value={urgentCount}
          icon={AlertTriangle}
          color="amber"
          sublabel="Produce expiring soon"
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent listings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Listings</h2>
          <div className="space-y-3">
            {recentListings.length > 0 ? (
              recentListings.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.cropName}</p>
                    <p className="text-xs text-gray-400">
                      {item.quantity} {item.unit} &middot; ₹{item.price.toLocaleString('en-IN')}/{item.unit}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      item.urgent
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.urgent ? 'Urgent' : 'Active'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 py-4 text-center">
                No listings yet. Create one from the List Produce page.
              </p>
            )}
          </div>
        </div>

        {/* Sales chart (simple bar) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales (Simulated)</h2>
          <div className="flex items-end justify-between gap-3 h-40">
            {[
              { month: 'May', val: 60 },
              { month: 'Jun', val: 75 },
              { month: 'Jul', val: 45 },
              { month: 'Aug', val: 90 },
              { month: 'Sep', val: 70 },
              { month: 'Oct', val: 85 },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-green-500 rounded-t-md hover:bg-green-600 transition-colors"
                  style={{ height: `${bar.val}%` }}
                  title={`₹${(bar.val * 4000).toLocaleString('en-IN')}`}
                />
                <span className="text-xs text-gray-500">{bar.month}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Simulated data &mdash; no sales records exist yet
          </p>
        </div>
      </div>
    </div>
  );
}
