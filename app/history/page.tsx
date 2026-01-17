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

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations');
      if (response.ok) {
        const data = await response.json();
        setConsultations(data.consultations);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0 text-gray-600">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Consultation History</h1>

          {consultations.length > 0 ? (
            <div className="space-y-6">
              {consultations.map((consultation) => (
                <div key={consultation.consultation_id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {consultation.vehicle.brand} {consultation.vehicle.vehicleModel} ({consultation.vehicle.year})
                      </h3>
                      <p className="text-gray-600">
                        {new Date(consultation.consult_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </span>
                      {consultation.diagnosis_confidence && (
                        <span className="text-sm text-gray-600">
                          {consultation.diagnosis_confidence}% Confidence
                        </span>
                      )}
                    </div>
                  </div>

                  {consultation.fault && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900">Diagnosed Fault:</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(consultation.fault.severity)}`}>
                          {consultation.fault.severity}
                        </span>
                      </div>
                      <p className="text-gray-800 mt-1">{consultation.fault.fault_name}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Reported Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {consultation.symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {symptom.description}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultation history</h3>
              <p className="text-gray-600 mb-4">
                Start your first consultation to see your history here.
              </p>
              <a
                href="/consultation"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium inline-block"
              >
                Start Consultation
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}