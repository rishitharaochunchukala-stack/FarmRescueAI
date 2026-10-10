import { Search, Package, Leaf, TrendingDown, Sprout, ArrowRight } from 'lucide-react';
import type { Page } from '@/types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3663478/pexels-photo-3663478.jpeg?auto=compress&cs=tinysrgb&h=800&w=1600"
            alt="Green farmland at sunrise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-900/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center text-white">
          <div className="flex justify-center mb-4">
            <Sprout className="w-12 h-12 text-green-300" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            FarmRescue AI
          </h1>
          <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Help farmers sell surplus produce, connect with buyers, and reduce
            agricultural food waste &mdash; one harvest at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('marketplace')}
              className="bg-white text-green-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-green-50 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <Search className="w-5 h-5" /> Find Produce
            </button>
            <button
              onClick={() => onNavigate('list-produce')}
              className="bg-green-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-green-500 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg border border-green-400"
            >
              <Package className="w-5 h-5" /> List Produce
            </button>
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-green-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat value="1.2B" label="Tonnes wasted yearly" />
          <Stat value="40%" label="Produce never sold" />
          <Stat value="500+" label="Demo farmers connected" />
          <Stat value="₹300Cr" label="Potential savings" />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">How It Works</h2>
        <p className="text-center text-gray-500 mb-10">Three simple steps from surplus to sale</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Step
            icon={Package}
            step="1"
            title="Farmers List Surplus"
            description="Farmers post their excess produce with quantity, price, and location in minutes."
          />
          <Step
            icon={Search}
            step="2"
            title="Buyers Search & Filter"
            description="Buyers browse the marketplace, filter by crop or region, and find exactly what they need."
          />
          <Step
            icon={Leaf}
            step="3"
            title="Produce Gets Rescued"
            description="Surplus finds a home instead of a landfill — less waste, more value for everyone."
          />
        </div>
      </section>

      {/* Feature highlights */}
      <section className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">What You Can Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Search}
              title="Browse Marketplace"
              description="Search and filter real-time listings of fresh produce from local farms."
              onClick={() => onNavigate('marketplace')}
            />
            <FeatureCard
              icon={TrendingDown}
              title="Rescue Urgent Produce"
              description="Quickly find surplus that needs a buyer before it spoils. Time-sensitive deals."
              onClick={() => onNavigate('rescue')}
            />
            <FeatureCard
              icon={Sprout}
              title="AI Assistant"
              description="Get smart suggestions on pricing, crop matching, and waste reduction (demo)."
              onClick={() => onNavigate('ai')}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to rescue some produce?
        </h2>
        <p className="text-gray-500 mb-8">
          Join the movement against food waste. Browse listings or list your own surplus today.
        </p>
        <button
          onClick={() => onNavigate('marketplace')}
          className="bg-green-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-green-700 transition-all hover:scale-105 inline-flex items-center gap-2 shadow-lg"
        >
          Explore Marketplace <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-bold text-green-200">{value}</p>
      <p className="text-sm text-green-100 mt-1">{label}</p>
    </div>
  );
}

function Step({
  icon: Icon,
  step,
  title,
  description,
}: {
  icon: typeof Package;
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center relative">
      <div className="relative inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <Icon className="w-8 h-8 text-green-700" />
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
          {step}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof Package;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-6 text-left shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all group"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 group-hover:bg-green-200 transition-colors">
        <Icon className="w-6 h-6 text-green-700" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium mt-3 group-hover:gap-2 transition-all">
        Learn more <ArrowRight className="w-4 h-4" />
      </span>
    </button>
  );
}
