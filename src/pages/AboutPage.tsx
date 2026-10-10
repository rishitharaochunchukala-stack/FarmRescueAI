import { Sprout, Target, Users, Leaf, Mail, MapPin, Phone } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
          <Sprout className="w-7 h-7 text-green-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">About FarmRescue AI</h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
          A student hackathon project built to tackle one of the world&rsquo;s biggest
          environmental challenges: agricultural food waste.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Over 1.2 billion tonnes of food is wasted each year, and a significant
              portion happens on the farm &mdash; produce that never reaches a buyer.
              FarmRescue AI connects farmers who have surplus produce with buyers who need it,
              using smart matching and an AI assistant to make the process faster and easier.
            </p>
          </div>
        </div>
      </div>

      {/* Problem & solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <h3 className="font-semibold text-amber-800 mb-2">The Problem</h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li>&bull; Farmers can&rsquo;t always find buyers in time</li>
            <li>&bull; Surplus produce spoils before it can be sold</li>
            <li>&bull; Food waste contributes to greenhouse gas emissions</li>
            <li>&bull; Farmers lose income on unsold crops</li>
          </ul>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-6">
          <h3 className="font-semibold text-green-800 mb-2">Our Solution</h3>
          <ul className="space-y-2 text-sm text-green-700">
            <li>&bull; A simple marketplace for listing surplus produce</li>
            <li>&bull; Search and filter tools for buyers</li>
            <li>&bull; Urgent rescue section for perishable items</li>
            <li>&bull; AI assistant for pricing and waste-reduction tips</li>
          </ul>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <ValueCard icon={Leaf} title="Sustainability" description="Every listing rescued means less waste and a healthier planet." />
        <ValueCard icon={Users} title="Community" description="Connecting local farmers with local buyers strengthens regional food systems." />
        <ValueCard icon={Sprout} title="Innovation" description="Using AI to make smart farming decisions accessible to everyone." />
      </div>

      {/* Demo disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
        <p className="text-sm text-blue-700">
          <strong>Demo project notice:</strong> FarmRescue AI was built for a student
          hackathon. All data is sample data, the AI assistant uses simulated responses,
          and no real transactions or communications take place. No paid services, API keys,
          or databases are required for this initial version.
        </p>
      </div>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Leaf;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
        <Icon className="w-6 h-6 text-green-700" />
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
