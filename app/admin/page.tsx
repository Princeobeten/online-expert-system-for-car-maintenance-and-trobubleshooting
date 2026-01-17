'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface AdminStats {
  totalUsers: number;
  totalVehicles: number;
  totalConsultations: number;
  totalSymptoms: number;
  totalFaults: number;
  totalSolutions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVehicles: 0,
    totalConsultations: 0,
    totalSymptoms: 0,
    totalFaults: 0,
    totalSolutions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // In a real implementation, you'd have admin-specific API endpoints
      // For now, we'll simulate the data
      setStats({
        totalUsers: 25,
        totalVehicles: 45,
        totalConsultations: 120,
        totalSymptoms: 28,
        totalFaults: 8,
        totalSolutions: 8
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">👥</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">🚗</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Vehicles
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalVehicles}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">🔧</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Consultations
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalConsultations}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">🩺</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Symptoms in Database
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalSymptoms}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">⚠️</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Known Faults
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalFaults}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">💡</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Available Solutions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalSolutions}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                Manage Users
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
                Add New Symptoms
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium">
                Manage Diagnostic Rules
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium">
                System Reports
              </button>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="text-yellow-400 text-xl">⚠️</div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Admin Panel Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This is a basic admin dashboard. In a production environment, you would implement
                    full CRUD operations for managing symptoms, faults, solutions, and diagnostic rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}