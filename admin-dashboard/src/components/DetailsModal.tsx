import { useState } from 'react';
import { verifyPayment } from '../services/api';

interface Registration {
  id: number;
  student_name: string;
  student_class: string;
  school_name: string;
  student_contact: string;
  student_email: string;
  sibling1_name?: string;
  sibling1_school?: string;
  sibling1_class?: string;
  sibling2_name?: string;
  sibling2_school?: string;
  sibling2_class?: string;
  parent_name: string;
  parent_contact: string;
  parent_signature?: string;
  competitions: string[];
  workshops: string[];
  payment_mode: string;
  transaction_id: string;
  payment_screenshot: string;
  payment_verified: boolean;
  notes: string;
  created_at: string;
}

interface DetailsModalProps {
  registration: Registration | null;
  onClose: () => void;
  onUpdate: () => void;
}

const DetailsModal = ({ registration, onClose, onUpdate }: DetailsModalProps) => {
  const [notes, setNotes] = useState(registration?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!registration) return null;

  const handleVerifyPayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      await verifyPayment(registration.id, true, notes);
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const hasSiblings = registration.sibling1_name || registration.sibling2_name;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black/75" aria-hidden="true"></div>

        <div
          className="inline-block align-bottom bg-background-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white/10 px-6 py-4 border-b border-white/20 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">Registration Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="bg-background-dark px-6 py-4 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Student Details */}
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
                Student Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white">{registration.student_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Class</p>
                  <p className="text-white">{registration.student_class}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">School</p>
                  <p className="text-white">{registration.school_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Contact</p>
                  <p className="text-white">{registration.student_contact}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{registration.student_email}</p>
                </div>
              </div>
            </div>

            {/* Sibling Details */}
            {hasSiblings && (
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
                  Sibling Details
                </h4>
                <div className="space-y-4">
                  {registration.sibling1_name && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Name</p>
                        <p className="text-white">{registration.sibling1_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">School</p>
                        <p className="text-white">{registration.sibling1_school}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Class</p>
                        <p className="text-white">{registration.sibling1_class}</p>
                      </div>
                    </div>
                  )}
                  {registration.sibling2_name && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Name</p>
                        <p className="text-white">{registration.sibling2_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">School</p>
                        <p className="text-white">{registration.sibling2_school}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Class</p>
                        <p className="text-white">{registration.sibling2_class}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Parent Details */}
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
                Parent Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white">{registration.parent_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Contact</p>
                  <p className="text-white">{registration.parent_contact}</p>
                </div>
              </div>
              {registration.parent_signature && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Signature</p>
                  <img
                    src={registration.parent_signature}
                    alt="Parent signature"
                    className="max-w-xs border border-white/20 rounded"
                  />
                </div>
              )}
            </div>

            {/* Competitions */}
            {registration.competitions && registration.competitions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
                  Competitions Selected
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {registration.competitions.map((comp, index) => (
                    <li key={index} className="text-white">
                      {comp.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Workshops */}
            {registration.workshops && registration.workshops.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
                  Workshops Selected
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {registration.workshops.map((workshop, index) => (
                    <li key={index} className="text-white">
                      {workshop.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Payment */}
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
                Payment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Payment Mode</p>
                  <p className="text-white">{registration.payment_mode}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Transaction ID</p>
                  <p className="text-white">{registration.transaction_id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Payment Status</p>
                  {registration.payment_verified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                      ✔️ Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                      ❌ Not Verified
                    </span>
                  )}
                </div>
              </div>
              {registration.payment_screenshot && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Payment Screenshot</p>
                  <img
                    src={registration.payment_screenshot}
                    alt="Payment screenshot"
                    className="max-w-full border border-white/20 rounded cursor-pointer hover:opacity-80"
                    onClick={() => window.open(registration.payment_screenshot, '_blank')}
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
                Admin Notes
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                placeholder="Add notes about this registration..."
              />
            </div>
          </div>

          <div className="bg-white/10 px-6 py-4 border-t border-white/20 flex justify-end gap-4">
            {!registration.payment_verified && (
              <button
                onClick={handleVerifyPayment}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Mark Payment as Verified'}
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;

