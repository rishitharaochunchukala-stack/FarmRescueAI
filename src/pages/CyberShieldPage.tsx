import { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  TriangleAlert as AlertTriangle,
  Lock,
  Eye,
  MessageSquareWarning,
  CircleCheck as CheckCircle2,
  CircleAlert as AlertCircle,
  Loader as Loader2,
  Phone,
  KeyRound,
  AppWindow,
  Wallet,
  Info,
} from 'lucide-react';
import type { Produce } from '@/types';
import { saveSuspiciousReport } from '@/lib/produceStorage';

interface CyberShieldPageProps {
  produce?: Produce[];
}

interface ReportFormErrors {
  listingId?: string;
  reason?: string;
}

export default function CyberShieldPage({ produce = [] }: CyberShieldPageProps) {
  const [reportForm, setReportForm] = useState({
    listingId: '',
    reason: '',
    reporterContact: '',
  });
  const [reportErrors, setReportErrors] = useState<ReportFormErrors>({});
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const validateReport = (): boolean => {
    const e: ReportFormErrors = {};
    if (!reportForm.reason.trim() || reportForm.reason.trim().length < 10)
      e.reason = 'Please describe the issue in at least 10 characters';
    setReportErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReportSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (isSubmittingReport) return;
    if (!validateReport()) return;

    setIsSubmittingReport(true);
    setReportError(null);

    const { success, error } = await saveSuspiciousReport({
      listingId: reportForm.listingId || null,
      reason: reportForm.reason.trim(),
      reporterContact: reportForm.reporterContact.trim() || null,
    });

    if (!success) {
      setReportError(
        'Could not submit your report. Please try again.'
      );
      setIsSubmittingReport(false);
      return;
    }

    setReportForm({ listingId: '', reason: '', reporterContact: '' });
    setReportErrors({});
    setReportSuccess(true);
    setReportError(null);
    setIsSubmittingReport(false);

    setTimeout(() => setReportSuccess(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-3">
          <ShieldCheck className="w-7 h-7 text-red-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Farmer Cyber Safety Shield</h1>
        <p className="text-gray-500">
          Stay safe from fraud, phishing, and scams. / మోసం, ఫిషింగ్ నుండి రక్షణ.
        </p>
      </div>

      {/* A. Security Warning — prominent */}
      <div className="mb-6 bg-red-600 text-white rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-7 h-7 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-lg mb-1">WARNING: Never click any link or type your UPI PIN to receive money. Pay in person upon pickup.</h2>
            <p className="text-red-100 text-sm">
              హెచ్చరిక: డబ్బు పొందడానికి ఎలాంటి లింక్ క్లిక్ చేయకండి లేదా UPI PIN టైప్ చేయకండి. ఎల్లప్పుడూ వ్యక్తిగతంగా చెల్లించండి.
            </p>
          </div>
        </div>
      </div>

      {/* B. Phishing Awareness */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-semibold text-gray-800">Phishing Awareness / ఫిషింగ్ అవగాహన</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <WarningCard
            icon={Wallet}
            title="Unexpected Payment Links"
            telugu="ఊహించని చెల్లింపు లింకులు"
            description="Do not click payment or delivery links you did not expect. Scammers send fake links that look real to steal your money."
          />
          <WarningCard
            icon={KeyRound}
            title="OTP, PIN, Password Requests"
            telugu="OTP, PIN, పాస్‌వర్డ్ అభ్యర్థనలు"
            description="Never share OTPs, UPI PINs, passwords, or banking credentials with anyone. No legitimate buyer or platform will ever ask for these."
          />
          <WarningCard
            icon={AppWindow}
            title="Unknown Apps & Screen Sharing"
            telugu="తెలియని యాప్‌లు & స్క్రీన్ షేరింగ్"
            description="Do not install unknown apps or accept screen-sharing requests. These give scammers full access to your phone and bank accounts."
          />
          <WarningCard
            icon={Wallet}
            title="Fees to Release Payment"
            telugu="చెల్లింపు విడుదలకు రుసుము"
            description="No real buyer demands a fee to release your payment. If someone asks for money to unlock your earnings, it is a scam."
          />
        </div>
      </div>

      {/* C. Privacy Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Your Privacy / మీ గోప్యత</h2>
        </div>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Eye className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-700">Contact information is masked</p>
              <p className="text-gray-500">Your phone number and email are hidden in public listings (e.g. 98****01). Full contact is only revealed when appropriate.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Eye className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-700">Only approximate locations are shown</p>
              <p className="text-gray-500">Listings show your city or district — never exact farm coordinates.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-700">Protected at the database level</p>
              <p className="text-gray-500">Privacy is enforced by server-side rules, not just hidden buttons or blur effects.</p>
            </div>
          </li>
        </ul>
      </div>

      {/* D. Report Suspicious Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquareWarning className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-800">Report Suspicious Activity / అనుమానాస్పద కార్యకలాపాన్ని నివేదించండి</h2>
        </div>

        <div className="mb-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Reports are saved and reviewed manually. Submitting a report does not automatically
            remove a listing or verify users. Please provide as much detail as possible.
          </p>
        </div>

        {reportSuccess && (
          <div className="mb-4 bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Report submitted successfully</p>
              <p className="text-sm text-green-600">
                Your report has been saved. Our team will review it manually. No automatic action is taken.
              </p>
            </div>
          </div>
        )}

        {reportError && (
          <div className="mb-4 bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Could not submit report</p>
              <p className="text-sm text-red-600">{reportError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleReportSubmit} className="space-y-4">
          {/* Listing selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Related Listing (optional)
            </label>
            <select
              value={reportForm.listingId}
              onChange={(e) => setReportForm((prev) => ({ ...prev, listingId: e.target.value }))}
              disabled={isSubmittingReport}
              className={reportInputClass()}
            >
              <option value="">— General report (no specific listing) —</option>
              {produce.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.cropName} — {p.farmerName}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What happened? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reportForm.reason}
              onChange={(e) => {
                setReportForm((prev) => ({ ...prev, reason: e.target.value }));
                setReportErrors((prev) => ({ ...prev, reason: undefined }));
              }}
              placeholder="Describe the suspicious activity in detail. e.g. 'Buyer sent a payment link asking for UPI PIN to receive money'"
              rows={4}
              disabled={isSubmittingReport}
              className={reportInputClass(reportErrors.reason) + ' resize-none'}
            />
            {reportErrors.reason && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {reportErrors.reason}
              </p>
            )}
          </div>

          {/* Reporter contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your Contact (optional)
            </label>
            <input
              type="text"
              value={reportForm.reporterContact}
              onChange={(e) => setReportForm((prev) => ({ ...prev, reporterContact: e.target.value }))}
              placeholder="Email or phone — only if you want follow-up"
              disabled={isSubmittingReport}
              className={reportInputClass()}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmittingReport}
            className="w-full bg-red-600 text-white font-semibold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmittingReport ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </form>
      </div>

      {/* E. Quick Safety Tips with icons */}
      <div className="bg-green-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Safety Tips / త్వరిత భద్రతా చిట్కాలు</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Phone className="w-5 h-5 text-green-600 shrink-0" />
            <span>Always meet the buyer in person and collect cash before handing over produce.</span>
          </li>
          <li className="flex items-start gap-2">
            <KeyRound className="w-5 h-5 text-green-600 shrink-0" />
            <span>Never share your UPI PIN, OTP, or bank password — not even with family over the phone.</span>
          </li>
          <li className="flex items-start gap-2">
            <AppWindow className="w-5 h-5 text-green-600 shrink-0" />
            <span>Do not install any app a stranger sends you, even if they say it is for payment.</span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 text-green-600 shrink-0" />
            <span>If something feels wrong, report it using the form above. It is better to be safe.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function WarningCard({
  icon: Icon,
  title,
  telugu,
  description,
}: {
  icon: typeof Phone;
  title: string;
  telugu: string;
  description: string;
}) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <p className="font-semibold text-gray-800 text-sm">{title}</p>
          <p className="text-xs text-amber-700">{telugu}</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function reportInputClass(error?: string) {
  return `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
    error
      ? 'border-red-400 focus:ring-red-500 bg-red-50'
      : 'border-gray-300 focus:ring-red-500 focus:border-transparent'
  }`;
}
