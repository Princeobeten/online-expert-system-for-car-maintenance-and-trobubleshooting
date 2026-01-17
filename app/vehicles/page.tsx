'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface Vehicle {
  vehicle_id: string;
  brand: string;
  vehicleModel: string;
  year: number;
  engine_type?: string;
  createdAt: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    engine_type: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchVehicles();
        setShowForm(false);
        setFormData({
          brand: '',
          model: '',
          year: new Date().getFullYear(),
          engine_type: ''
        });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add vehicle');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Vehicles</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              {showForm ? 'Cancel' : 'Add Vehicle'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Vehicle</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      required
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      required
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="engine_type" className="block text-sm font-medium text-gray-700 mb-1">
                      Engine Type
                    </label>
                    <input
                      type="text"
                      id="engine_type"
                      name="engine_type"
                      value={formData.engine_type}
                      onChange={handleChange}
                      placeholder="e.g., V6, 2.0L Turbo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 text-sm sm:text-base"
                  >
                    {submitting ? 'Adding...' : 'Add Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.vehicle_id} className="bg-white p-4 sm:p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl sm:text-3xl mr-3">🚗</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {vehicle.brand} {vehicle.vehicleModel}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">{vehicle.year}</p>
                    </div>
                  </div>
                  {vehicle.engine_type && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      Engine: {vehicle.engine_type}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Added: {new Date(vehicle.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">🚗</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No vehicles yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">Add your first vehicle to get started with consultations.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-md font-medium text-sm sm:text-base"
              >
                Add Your First Vehicle
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}