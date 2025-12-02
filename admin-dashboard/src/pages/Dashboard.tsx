import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRegistrations, getRegistration, logout, checkAuth, deleteRegistration } from '../services/api';
import RegistrationTable from '../components/RegistrationTable';
import DetailsModal from '../components/DetailsModal';
import LoadingSpinner from '../components/LoadingSpinner';

interface Registration {
  id: number;
  student_name: string;
  student_class: string;
  student_contact: string;
  student_email: string;
  parent_name: string;
  payment_verified: boolean;
  created_at: string;
  [key: string]: any;
}

const Dashboard = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
        setIsAuthenticated(true);
        fetchRegistrations();
      } catch (err) {
        navigate('/login');
      }
    };
    verifyAuth();
  }, [navigate]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getRegistrations();
      setRegistrations(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const registration = await getRegistration(id);
      setSelectedRegistration(registration);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch registration details');
    }
  };

  const handleCloseModal = () => {
    setSelectedRegistration(null);
    fetchRegistrations(); // Refresh list after modal closes
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteRegistration(id);
      setError('');
      // Refresh the list after deletion
      fetchRegistrations();
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to delete registration');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      // Even if logout fails, navigate to login
      navigate('/login');
    }
  };

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">Event Registrations</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No registrations found.</p>
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg border border-white/20 overflow-hidden">
            <RegistrationTable
              registrations={registrations}
              onViewDetails={handleViewDetails}
              onDelete={handleDelete}
            />
          </div>
        )}

        {selectedRegistration && (
          <DetailsModal
            registration={selectedRegistration}
            onClose={handleCloseModal}
            onUpdate={fetchRegistrations}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

