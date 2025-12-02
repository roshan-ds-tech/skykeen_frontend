import { useState } from 'react';

interface Registration {
  id: number;
  student_name: string;
  student_class: string;
  student_contact: string;
  student_email: string;
  parent_name: string;
  payment_verified: boolean;
  created_at: string;
}

interface RegistrationTableProps {
  registrations: Registration[];
  onViewDetails: (id: number) => void;
  onDelete: (id: number) => void;
}

const RegistrationTable = ({ registrations, onViewDetails, onDelete }: RegistrationTableProps) => {
  const [sortField, setSortField] = useState<keyof Registration | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Registration) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRegistrations = [...registrations].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/20">
        <thead className="bg-white/5">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10"
              onClick={() => handleSort('student_name')}
            >
              Student Name {sortField === 'student_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10"
              onClick={() => handleSort('student_class')}
            >
              Class {sortField === 'student_class' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Parent Name
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10"
              onClick={() => handleSort('payment_verified')}
            >
              Payment Status {sortField === 'payment_verified' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10"
              onClick={() => handleSort('created_at')}
            >
              Timestamp {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/5 divide-y divide-white/20">
          {sortedRegistrations.map((registration) => (
            <tr key={registration.id} className="hover:bg-white/10">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {registration.student_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {registration.student_class}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {registration.student_contact}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {registration.student_email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {registration.parent_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {registration.payment_verified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                    ✔️ Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                    ❌ Not Verified
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(registration.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onViewDetails(registration.id)}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onDelete(registration.id)}
                    className="text-red-400 hover:text-red-300 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationTable;

