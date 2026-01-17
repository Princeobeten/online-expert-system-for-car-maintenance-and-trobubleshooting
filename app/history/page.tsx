'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface ConsultationHistory {
  consultation_id: string;
  consult_date: string;
  status: string;
  diagnosis_confidence?: number;
  vehicle: {
    brand: string;
    vehicleModel: string;
    year: number;
  };
  fault?: {
    fault_name: string;
    severity: string;
  };
  symptoms: Array<{
    description: string;
  }>;
}

export default function History() {
  const [consultations, setConsultations] = useState<ConsultationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations');
      if (response.ok) {
        const data = await response.json();
        setConsultations(data.consultations);
        setTotalPages(Math.ceil(data.consultations.length / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConsultations = consultations.slice(startIndex, endIndex);

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
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading consultation history...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    Consultation History
                  </h1>
                  <p className="mt-1 text-sm sm:text-base text-gray-600">
                    View your past vehicle consultations and diagnoses
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                  <span className="font-medium">{consultations.length}</span>
                  <span>total consultations</span>
                </div>
              </div>
            </div>

            {consultations.length > 0 ? (
              <>
                {/* Consultation Cards */}
                <div className="space-y-4 sm:space-y-6">
                  {currentConsultations.map((consultation) => (
                    <div key={consultation.consultation_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                      {/* Card Header */}
                      <div className="p-4 sm:p-6 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                              {consultation.vehicle.brand} {consultation.vehicle.vehicleModel}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                              <span className="font-medium">Year: {consultation.vehicle.year}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>
                                {new Date(consultation.consult_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-start sm:items-end space-x-3 sm:space-x-0 sm:space-y-2">
                            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap border ${getStatusColor(consultation.status)}`}>
                              {consultation.status}
                            </span>
                            {consultation.diagnosis_confidence && (
                              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                                {consultation.diagnosis_confidence}% Confidence
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-6 space-y-4">
                        {/* Diagnosed Fault */}
                        {consultation.fault && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Diagnosed Fault</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium self-start border ${getSeverityColor(consultation.fault.severity)}`}>
                                {consultation.fault.severity} Severity
                              </span>
                            </div>
                            <p className="text-gray-800 text-sm sm:text-base font-medium">{consultation.fault.fault_name}</p>
                          </div>
                        )}

                        {/* Symptoms */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Reported Symptoms</h4>
                          <div className="flex flex-wrap gap-2">
                            {consultation.symptoms.map((symptom, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs sm:text-sm rounded-full border border-blue-200 font-medium"
                              >
                                {symptom.description}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile-Friendly Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 space-y-4">
                    {/* Results Info */}
                    <div className="text-center text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, consultations.length)} of {consultations.length} consultations
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                      {/* Previous Button */}
                      <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px] flex items-center justify-center"
                      >
                        ← Previous
                      </button>
                      
                      {/* Page Numbers - Responsive */}
                      <div className="flex items-center space-x-1 overflow-x-auto pb-2 sm:pb-0">
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
                              className={`min-w-[44px] h-[44px] text-sm font-medium rounded-lg transition-colors duration-200 ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Next Button */}
                      <button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px] flex items-center justify-center"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <div className="text-6xl sm:text-7xl mb-4">📊</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">No consultation history</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto">
                  Start your first vehicle consultation to see your diagnostic history and track your car maintenance.
                </p>
                <a
                  href="/consultation"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 min-h-[44px] text-sm sm:text-base"
                >
                  Start Consultation
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}