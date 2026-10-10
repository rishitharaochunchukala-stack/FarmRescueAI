import { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

interface ContactErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    const e: ContactErrors = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.message.trim()) e.message = 'Please enter a message';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Contact Us</h1>
        <p className="text-gray-500">
          Questions, feedback, or want to partner with FarmRescue AI? Reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info */}
        <div className="space-y-4">
          <ContactInfo
            icon={Mail}
            title="Email"
            value="hello@farmrescue.ai"
            note="We reply within 24 hours"
          />
          <ContactInfo
            icon={Phone}
            title="Phone"
            value="1800 200 0199"
            note="Mon&ndash;Fri, 9am to 5pm"
          />
          <ContactInfo
            icon={MapPin}
            title="Location"
            value="Nashik, Maharashtra, India"
            note="Serving farms across Maharashtra"
          />

          <div className="bg-green-50 rounded-xl p-5 mt-6">
            <p className="text-sm text-green-700">
              <strong>Note:</strong> This is a demo contact form. Messages are not sent
              to a real email server &mdash; this is for the hackathon presentation only.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {sent && (
            <div className="mb-4 bg-green-50 border-2 border-green-300 rounded-lg p-3 flex items-center gap-2 animate-fade-in-up">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Message sent (demo)! We&rsquo;ll get back to you soon.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g. Priya Sharma"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.name
                    ? 'border-red-400 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setErrors({ ...errors, email: undefined });
                }}
                placeholder="e.g. priya@example.in"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  setErrors({ ...errors, message: undefined });
                }}
                placeholder="Tell us how we can help..."
                rows={5}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors resize-none ${
                  errors.message
                    ? 'border-red-400 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                }`}
              />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({
  icon: Icon,
  title,
  value,
  note,
}: {
  icon: typeof Mail;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className="shrink-0 w-11 h-11 bg-green-100 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-green-700" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{value}</p>
        <p className="text-gray-400 text-xs mt-0.5">{note}</p>
      </div>
    </div>
  );
}
