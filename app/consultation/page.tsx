'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface Vehicle {
  vehicle_id: string;
  brand: string;
  vehicleModel: string;
  year: number;
}

interface Symptom {
  symptom_id: string;
  description: string;
  category: string;
}

interface DiagnosisResult {
  fault: {
    fault_id: string;
    fault_name: string;
    severity: string;
    description?: string;
  };
  solutions: Array<{
    solution_id: string;
    repair_action: string;
    estimated_cost?: number;
    difficulty_level?: string;
    estimated_time?: string;
    tools_required?: string[];
  }>;
  confidence: number;
  matchedSymptoms: string[];
}

export default function Consultation() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [symptoms, setSymptoms] = useState<Record<string, Symptom[]>>({});
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [diagnosing, setDiagnosing] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Vehicle, 2: Select Symptoms, 3: Results

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [vehiclesRes, symptomsRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/symptoms?grouped=true')
      ]);

      if (vehiclesRes.ok && symptomsRes.ok) {
        const vehiclesData = await vehiclesRes.json();
        const symptomsData = await symptomsRes.json();
        
        setVehicles(vehiclesData.vehicles);
        setSymptoms(symptomsData.symptoms);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setStep(2);
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    setDiagnosing(true);
    try {
      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: selectedVehicle,
          symptoms: selectedSymptoms
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiagnosis(data.diagnoses);
        setStep(3);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Diagnosis failed');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setDiagnosing(false);
    }
  };

  const resetConsultation = () => {
    setSelectedVehicle('');
    setSelectedSymptoms([]);
    setDiagnosis([]);
    setStep(1);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
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
      <div className="px-2 sm:px-4 py-4 sm:py-6 text-gray-600">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Car Consultation</h1>
            {step > 1 && (
              <button
                onClick={resetConsultation}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                Start New Consultation
              </button>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                    step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 sm:w-16 h-1 ${
                      step > stepNum ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600 px-2">
              <span>Select Vehicle</span>
              <span>Select Symptoms</span>
              <span>View Results</span>
            </div>
          </div>

          {/* Step 1: Vehicle Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Select Your Vehicle</h2>
              {vehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.vehicle_id}
                      onClick={() => handleVehicleSelect(vehicle.vehicle_id)}
                      className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-500 text-left"
                    >
                      <div className="flex items-center">
                        <div className="text-2xl sm:text-3xl mr-3">🚗</div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            {vehicle.brand} {vehicle.vehicleModel}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600">{vehicle.year}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4">🚗</div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">You need to add a vehicle before starting a consultation.</p>
                  <a
                    href="/vehicles"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-md font-medium inline-block text-sm sm:text-base"
                  >
                    Add Vehicle
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Symptom Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Select Symptoms</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 px-2">
                Choose all symptoms that apply to your vehicle. The more accurate your selection, the better the diagnosis.
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                {Object.entries(symptoms).map(([category, categorySymptoms]) => (
                  <div key={category} className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">{category}</h3>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {categorySymptoms.map((symptom) => (
                        <label
                          key={symptom.symptom_id}
                          className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSymptoms.includes(symptom.symptom_id)}
                            onChange={() => handleSymptomToggle(symptom.symptom_id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm sm:text-base text-gray-700">{symptom.description}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium text-sm sm:text-base order-2 sm:order-1"
                >
                  Back
                </button>
                <button
                  onClick={handleDiagnosis}
                  disabled={diagnosing || selectedSymptoms.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2"
                >
                  {diagnosing ? 'Diagnosing...' : `Diagnose (${selectedSymptoms.length} symptoms)`}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Diagnosis Results</h2>
              
              {diagnosis.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {diagnosis.map((result, index) => (
                    <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            {result.fault.fault_name}
                          </h3>
                          {result.fault.description && (
                            <p className="text-sm sm:text-base text-gray-600 mt-1">{result.fault.description}</p>
                          )}
                        </div>
                        <div className="flex flex-row sm:flex-col items-start sm:items-end space-x-4 sm:space-x-0 sm:space-y-2">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getSeverityColor(result.fault.severity)}`}>
                            {result.fault.severity} Severity
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600">
                            {result.confidence}% Confidence
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Recommended Solutions:</h4>
                        <div className="space-y-3">
                          {result.solutions.map((solution, sIndex) => (
                            <div key={sIndex} className="bg-gray-50 p-3 sm:p-4 rounded-md">
                              <p className="text-sm sm:text-base text-gray-800 mb-2">{solution.repair_action}</p>
                              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                {solution.estimated_cost && (
                                  <span>💰 Est. Cost: ${solution.estimated_cost}</span>
                                )}
                                {solution.difficulty_level && (
                                  <span>🔧 Difficulty: {solution.difficulty_level}</span>
                                )}
                                {solution.estimated_time && (
                                  <span>⏱️ Time: {solution.estimated_time}</span>
                                )}
                              </div>
                              {solution.tools_required && solution.tools_required.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs sm:text-sm text-gray-600">Tools needed: </span>
                                  <span className="text-xs sm:text-sm text-gray-800">
                                    {solution.tools_required.join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4">🤔</div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Diagnosis Found</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
                    We couldn't find a matching diagnosis for the selected symptoms. 
                    Try selecting different or additional symptoms.
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-md font-medium text-sm sm:text-base"
                  >
                    Try Different Symptoms
                  </button>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium text-sm sm:text-base order-2 sm:order-1"
                >
                  Back to Symptoms
                </button>
                <button
                  onClick={resetConsultation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-sm sm:text-base order-1 sm:order-2"
                >
                  New Consultation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}