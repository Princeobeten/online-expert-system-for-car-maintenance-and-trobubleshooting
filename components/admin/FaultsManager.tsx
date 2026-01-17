'use client';

import { useState, useEffect } from 'react';

interface Fault {
  fault_id: string;
  fault_name: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface FaultsManagerProps {
  onUpdate: () => void;
}

export default function FaultsManager({ onUpdate }: FaultsManagerProps) {
  const [faults, setFaults] = useState<Fault[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFault, setEditingFault] = useState<Fault | null>(null);
  const [formData, setFormData] = useState({
    fault_name: '',
    severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    description: '',
    category: 'Other'
  });
  const [submitting, setSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const severities: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
  const categories = ['Engine', 'Transmission', 'Brakes', 'Electrical', 'Cooling', 'Fuel', 'Suspension', 'Other'];

  useEffect(() => {
    fetchFaults();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(faults.length / itemsPerPage));
  }, [faults, itemsPerPage]);

  const fetchFaults = async () => {
    try {
      const response = await fetch('/api/admin/faults');
      if (response.ok) {
        const data = await response.json();
        setFaults(data.faults);
      }
    } catch (error) {
      console.error('Error fetching faults:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingFault 
        ? `/api/admin/faults/${editingFault.fault_id}`
        : '/api/admin/faults';
      
      const method = editingFault ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchFaults();
        onUpdate();
        handleCloseModal();
      } else {
        const error = await response.json();
        alert(error.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error saving fault:', error);
      alert('An error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (faultId: string) => {
    if (!confirm('Are you sure you want to delete this fault? This will also affect related solutions and rules.')) return;

    try {
      const response = await fetch(`/api/admin/faults/${faultId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchFaults();
        onUpdate();
      } else {
        const error = await response.json();
        alert(error.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error deleting fault:', error);
      alert('An error occurred while deleting');
    }
  };

  const handleEdit = (fault: Fault) => {
    setEditingFault(fault);
    setFormData({
      fault_name: fault.fault_name,
      severity: fault.severity,
      description: fault.description || '',
      category: fault.category || 'Other'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFault(null);
    setFormData({
      fault_name: '',
      severity: 'Medium',
      description: '',
      category: 'Other'
    });
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      Low: 'bg-green-100 text-green-800 border-green-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      High: 'bg-orange-100 text-orange-800 border-orange-200',
      Critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity as keyof typeof colors] || colors.Medium;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Engine: 'bg-red-100 text-red-800 border-red-200',
      Transmission: 'bg-blue-100 text-blue-800 border-blue-200',
      Brakes: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Electrical: 'bg-purple-100 text-purple-800 border-purple-200',
      Cooling: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      Fuel: 'bg-orange-100 text-orange-800 border-orange-200',
      Suspension: 'bg-green-100 text-green-800 border-green-200',
      Other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFaults = faults.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Faults Management</h2>
          <p className="text-sm text-gray-600">Manage vehicle faults in the knowledge base</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Fault</span>
        </button>
      </div>

      {/* Faults List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <h3 className="text-lg font-medium text-gray-900">
              All Faults ({faults.length})
            </h3>
            {totalPages > 1 && (
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </div>
        
        {faults.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No faults found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first fault to the knowledge base.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Add First Fault
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {currentFaults.map((fault) => (
                <div key={fault.fault_id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-medium text-gray-900 mb-2">
                        {fault.fault_name}
                      </h4>
                      {fault.description && (
                        <p className="text-sm text-gray-600 mb-2">{fault.description}</p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border self-start ${getSeverityColor(fault.severity)}`}>
                          {fault.severity} Severity
                        </span>
                        {fault.category && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border self-start ${getCategoryColor(fault.category)}`}>
                            {fault.category}
                          </span>
                        )}
                        <span>Created: {new Date(fault.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(fault)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(fault.fault_id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, faults.length)} of {faults.length} faults
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={goToPrevious}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px]"
                    >
                      Previous
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`min-w-[40px] h-[40px] text-sm font-medium rounded-md transition-colors duration-200 ${
                              currentPage === page
                                ? 'bg-red-600 text-white shadow-sm'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={goToNext}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingFault ? 'Edit Fault' : 'Add New Fault'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fault Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fault_name}
                    onChange={(e) => setFormData({ ...formData, fault_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter fault name..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity *
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    {severities.map((severity) => (
                      <option key={severity} value={severity}>
                        {severity}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter fault description..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    {submitting ? 'Saving...' : (editingFault ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}