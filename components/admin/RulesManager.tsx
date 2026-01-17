'use client';

import { useState, useEffect } from 'react';

interface Rule {
  rule_id: string;
  fault_id: string;
  symptoms: string[];
  condition: string;
  confidence_level: number;
  createdAt: string;
  updatedAt: string;
  fault?: {
    fault_name: string;
    severity: string;
  };
  symptom_details?: Array<{
    symptom_id: string;
    description: string;
  }>;
}

interface Fault {
  fault_id: string;
  fault_name: string;
  severity: string;
}

interface Symptom {
  symptom_id: string;
  description: string;
  category: string;
}

interface RulesManagerProps {
  onUpdate: () => void;
}

export default function RulesManager({ onUpdate }: RulesManagerProps) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [faults, setFaults] = useState<Fault[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [formData, setFormData] = useState({
    fault_id: '',
    symptoms: [] as string[],
    condition: '',
    confidence_level: 80
  });
  const [submitting, setSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(rules.length / itemsPerPage));
  }, [rules, itemsPerPage]);

  const fetchData = async () => {
    try {
      const [rulesRes, faultsRes, symptomsRes] = await Promise.all([
        fetch('/api/admin/rules'),
        fetch('/api/admin/faults'),
        fetch('/api/admin/symptoms')
      ]);

      if (rulesRes.ok) {
        const rulesData = await rulesRes.json();
        setRules(rulesData.rules);
      }

      if (faultsRes.ok) {
        const faultsData = await faultsRes.json();
        setFaults(faultsData.faults);
      }

      if (symptomsRes.ok) {
        const symptomsData = await symptomsRes.json();
        setSymptoms(symptomsData.symptoms);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingRule 
        ? `/api/admin/rules/${editingRule.rule_id}`
        : '/api/admin/rules';
      
      const method = editingRule ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchData();
        onUpdate();
        handleCloseModal();
      } else {
        const error = await response.json();
        alert(error.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('An error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this diagnostic rule?')) return;

    try {
      const response = await fetch(`/api/admin/rules/${ruleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
        onUpdate();
      } else {
        const error = await response.json();
        alert(error.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('An error occurred while deleting');
    }
  };

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    setFormData({
      fault_id: rule.fault_id,
      symptoms: rule.symptoms,
      condition: rule.condition,
      confidence_level: rule.confidence_level
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRule(null);
    setFormData({
      fault_id: '',
      symptoms: [],
      condition: '',
      confidence_level: 80
    });
  };

  const handleSymptomToggle = (symptomId: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(id => id !== symptomId)
        : [...prev.symptoms, symptomId]
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 70) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (confidence >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
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

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRules = rules.slice(startIndex, endIndex);

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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Diagnostic Rules Management</h2>
          <p className="text-sm text-gray-600">Manage diagnostic rules that connect symptoms to faults</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <h3 className="text-lg font-medium text-gray-900">
              All Rules ({rules.length})
            </h3>
            {totalPages > 1 && (
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </div>
        
        {rules.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No diagnostic rules found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first diagnostic rule to connect symptoms with faults.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Add First Rule
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {currentRules.map((rule) => (
                <div key={rule.rule_id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                        <h4 className="text-base font-medium text-gray-900">
                          {rule.fault?.fault_name || 'Unknown Fault'}
                        </h4>
                        {rule.fault?.severity && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border self-start ${getSeverityColor(rule.fault.severity)}`}>
                            {rule.fault.severity}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border self-start ${getConfidenceColor(rule.confidence_level)}`}>
                          {rule.confidence_level}% Confidence
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{rule.condition}</p>
                      
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-gray-500">Required Symptoms:</span>
                        <div className="flex flex-wrap gap-2">
                          {rule.symptom_details?.map((symptom) => (
                            <span
                              key={symptom.symptom_id}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200"
                            >
                              {symptom.description}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        Created: {new Date(rule.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(rule)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(rule.rule_id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, rules.length)} of {rules.length} rules
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
                                ? 'bg-purple-600 text-white shadow-sm'
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
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingRule ? 'Edit Diagnostic Rule' : 'Add New Diagnostic Rule'}
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
                    Fault *
                  </label>
                  <select
                    value={formData.fault_id}
                    onChange={(e) => setFormData({ ...formData, fault_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a fault...</option>
                    {faults.map((fault) => (
                      <option key={fault.fault_id} value={fault.fault_id}>
                        {fault.fault_name} ({fault.severity})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition/Description *
                  </label>
                  <textarea
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe when this rule should apply..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confidence Level (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.confidence_level}
                    onChange={(e) => setFormData({ ...formData, confidence_level: parseInt(e.target.value) || 80 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Symptoms * (Select at least one)
                  </label>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
                    {symptoms.length === 0 ? (
                      <p className="text-sm text-gray-500">No symptoms available. Please add symptoms first.</p>
                    ) : (
                      symptoms.map((symptom) => (
                        <label key={symptom.symptom_id} className="flex items-start space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.symptoms.includes(symptom.symptom_id)}
                            onChange={() => handleSymptomToggle(symptom.symptom_id)}
                            className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-gray-900">{symptom.description}</span>
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {symptom.category}
                            </span>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  {formData.symptoms.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">Please select at least one symptom</p>
                  )}
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
                    disabled={submitting || formData.symptoms.length === 0}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    {submitting ? 'Saving...' : (editingRule ? 'Update' : 'Create')}
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