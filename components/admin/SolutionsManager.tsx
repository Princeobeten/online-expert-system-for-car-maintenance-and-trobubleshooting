'use client';

import { useState, useEffect } from 'react';

interface Solution {
  solution_id: string;
  fault_id: string;
  repair_action: string;
  estimated_cost?: number;
  difficulty_level?: 'Easy' | 'Medium' | 'Hard' | 'Professional';
  estimated_time?: string;
  tools_required?: string[];
  createdAt: string;
  updatedAt: string;
  fault?: {
    fault_name: string;
    severity: string;
  };
}

interface Fault {
  fault_id: string;
  fault_name: string;
  severity: string;
}

interface SolutionsManagerProps {
  onUpdate: () => void;
}

export default function SolutionsManager({ onUpdate }: SolutionsManagerProps) {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [faults, setFaults] = useState<Fault[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [formData, setFormData] = useState({
    fault_id: '',
    repair_action: '',
    estimated_cost: '',
    difficulty_level: 'Medium' as 'Easy' | 'Medium' | 'Hard' | 'Professional',
    estimated_time: '',
    tools_required: [] as string[]
  });
  const [submitting, setSubmitting] = useState(false);
  const [toolInput, setToolInput] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const difficultyLevels: ('Easy' | 'Medium' | 'Hard' | 'Professional')[] = ['Easy', 'Medium', 'Hard', 'Professional'];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(solutions.length / itemsPerPage));
  }, [solutions, itemsPerPage]);

  const fetchData = async () => {
    try {
      const [solutionsRes, faultsRes] = await Promise.all([
        fetch('/api/admin/solutions'),
        fetch('/api/admin/faults')
      ]);

      if (solutionsRes.ok) {
        const solutionsData = await solutionsRes.json();
        setSolutions(solutionsData.solutions);
      }

      if (faultsRes.ok) {
        const faultsData = await faultsRes.json();
        setFaults(faultsData.faults);
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
      const submitData = {
        ...formData,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : undefined
      };

      const url = editingSolution 
        ? `/api/admin/solutions/${editingSolution.solution_id}`
        : '/api/admin/solutions';
      
      const method = editingSolution ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
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
      console.error('Error saving solution:', error);
      alert('An error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (solutionId: string) => {
    if (!confirm('Are you sure you want to delete this solution?')) return;

    try {
      const response = await fetch(`/api/admin/solutions/${solutionId}`, {
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
      console.error('Error deleting solution:', error);
      alert('An error occurred while deleting');
    }
  };

  const handleEdit = (solution: Solution) => {
    setEditingSolution(solution);
    setFormData({
      fault_id: solution.fault_id,
      repair_action: solution.repair_action,
      estimated_cost: solution.estimated_cost?.toString() || '',
      difficulty_level: solution.difficulty_level || 'Medium',
      estimated_time: solution.estimated_time || '',
      tools_required: solution.tools_required || []
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSolution(null);
    setFormData({
      fault_id: '',
      repair_action: '',
      estimated_cost: '',
      difficulty_level: 'Medium',
      estimated_time: '',
      tools_required: []
    });
    setToolInput('');
  };

  const addTool = () => {
    if (toolInput.trim() && !formData.tools_required.includes(toolInput.trim())) {
      setFormData({
        ...formData,
        tools_required: [...formData.tools_required, toolInput.trim()]
      });
      setToolInput('');
    }
  };

  const removeTool = (index: number) => {
    setFormData({
      ...formData,
      tools_required: formData.tools_required.filter((_, i) => i !== index)
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Easy: 'bg-green-100 text-green-800 border-green-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Hard: 'bg-orange-100 text-orange-800 border-orange-200',
      Professional: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[difficulty as keyof typeof colors] || colors.Medium;
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSolutions = solutions.slice(startIndex, endIndex);

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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Solutions Management</h2>
          <p className="text-sm text-gray-600">Manage repair solutions in the knowledge base</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Solution</span>
        </button>
      </div>

      {/* Solutions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <h3 className="text-lg font-medium text-gray-900">
              All Solutions ({solutions.length})
            </h3>
            {totalPages > 1 && (
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </div>
        
        {solutions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No solutions found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first solution to the knowledge base.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Add First Solution
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {currentSolutions.map((solution) => (
                <div key={solution.solution_id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                        <h4 className="text-base font-medium text-gray-900">
                          {solution.fault?.fault_name || 'Unknown Fault'}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border self-start ${getDifficultyColor(solution.difficulty_level || 'Medium')}`}>
                          {solution.difficulty_level || 'Medium'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{solution.repair_action}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                        {solution.estimated_cost && (
                          <span>Cost: ${solution.estimated_cost}</span>
                        )}
                        {solution.estimated_time && (
                          <span>Time: {solution.estimated_time}</span>
                        )}
                        <span>Created: {new Date(solution.createdAt).toLocaleDateString()}</span>
                      </div>
                      {solution.tools_required && solution.tools_required.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Tools: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {solution.tools_required.map((tool, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(solution)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(solution.solution_id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, solutions.length)} of {solutions.length} solutions
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
                                ? 'bg-green-600 text-white shadow-sm'
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
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingSolution ? 'Edit Solution' : 'Add New Solution'}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    Repair Action *
                  </label>
                  <textarea
                    value={formData.repair_action}
                    onChange={(e) => setFormData({ ...formData, repair_action: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the repair action..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Cost ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.estimated_cost}
                      onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty_level}
                      onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {difficultyLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={formData.estimated_time}
                    onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 2-3 hours, 30 minutes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tools Required
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={toolInput}
                      onChange={(e) => setToolInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter tool name..."
                    />
                    <button
                      type="button"
                      onClick={addTool}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tools_required.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tools_required.map((tool, index) => (
                        <span key={index} className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                          <span>{tool}</span>
                          <button
                            type="button"
                            onClick={() => removeTool(index)}
                            className="text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
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
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    {submitting ? 'Saving...' : (editingSolution ? 'Update' : 'Create')}
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