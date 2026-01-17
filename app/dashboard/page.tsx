'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface DashboardStats {
  totalVehicles: number;
  totalConsultations: number;
  recentConsultations: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    totalConsultations: 0,
    recentConsultations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [vehiclesRes, consultationsRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/consultations')
      ]);

      if (vehiclesRes.ok && consultationsRes.ok) {
        const vehiclesData = await vehiclesRes.json();
        const consultationsData = await consultationsRes.json();

        setStats({
          totalVehicles: vehiclesData.vehicles.length,
          totalConsultations: consultationsData.consultations.length,
          recentConsultations: consultationsData.consultations.slice(0, 5)
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    <div className="text-3xl">📊</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Success Rate
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        95%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/consultation"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md font-medium"
                >
                  Start New Consultation
                </Link>
                <Link
                  href="/vehicles"
                  className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-md font-medium"
                >
                  Manage Vehicles
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Consultations</h3>
              {stats.recentConsultations.length > 0 ? (
                <div className="space-y-2">
                  {stats.recentConsultations.map((consultation, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {consultation.vehicle?.brand} {consultation.vehicle?.vehicleModel}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(consultation.consult_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        consultation.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {consultation.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No consultations yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}