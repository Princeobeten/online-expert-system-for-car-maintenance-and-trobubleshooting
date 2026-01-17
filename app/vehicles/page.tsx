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
      <div className="px-4 py-6 sm:px-0 text-gray-600">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              {showForm ? 'Cancel' : 'Add Vehicle'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Vehicle</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Brand *
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                    Model *
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="engine_type" className="block text-sm font-medium text-gray-700">
                    Engine Type
                  </label>
                  <input
                    type="text"
                    id="engine_type"
                    name="engine_type"
                    value={formData.engine_type}
                    onChange={handleChange}
                    placeholder="e.g., V6, 2.0L Turbo"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
                  >
                    {submitting ? 'Adding...' : 'Add Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.vehicle_id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">🚗</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.brand} {vehicle.vehicleModel}
                      </h3>
                      <p className="text-gray-600">{vehicle.year}</p>
                    </div>
                  </div>
                  {vehicle.engine_type && (
                    <p className="text-sm text-gray-600 mb-2">
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
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles yet</h3>
              <p className="text-gray-600 mb-4">Add your first vehicle to get started with consultations.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
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