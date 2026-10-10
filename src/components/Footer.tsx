import { Sprout, Mail, Phone, MapPin } from 'lucide-react';
import type { Page } from '@/types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-green-800 text-green-50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sprout className="w-6 h-6 text-green-300" />
              <span className="font-bold text-lg">FarmRescue AI</span>
            </div>
            <p className="text-green-200 text-sm leading-relaxed">
              Connecting farmers with buyers to reduce food waste. Every kilogram
              rescued is a win for our planet.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-3 text-green-100">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Marketplace', page: 'marketplace' as Page },
                { label: 'List Your Produce', page: 'list-produce' as Page },
                { label: 'Rescue Produce', page: 'rescue' as Page },
                { label: 'AI Assistant', page: 'ai' as Page },
                { label: 'About Us', page: 'about' as Page },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-green-100">Get in Touch</h4>
            <ul className="space-y-2 text-sm text-green-200">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> hello@farmrescue.ai
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> 1800 200 0199
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Nashik, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-6 text-center text-sm text-green-300">
          <p>
            FarmRescue AI &mdash; A student hackathon project. Demo features
            are simulated and not connected to live services.
          </p>
        </div>
      </div>
    </footer>
  );
}
