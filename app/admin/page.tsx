'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

// Import modal components (we'll create these)
import SymptomsManager from '@/components/admin/SymptomsManager';
import FaultsManager from '@/components/admin/FaultsManager';
import SolutionsManager from '@/components/admin/SolutionsManager';
import RulesManager from '@/components/admin/RulesManager';

interface AdminStats {
  totalUsers: number;
  totalVehicles: number;
  totalConsultations: number;
  totalSymptoms: number;
  totalFaults: number;
  totalSolutions: number;
  totalRules: number;
}

type ActiveTab = 'dashboard' | 'symptoms' | 'faults' | 'solutions' | 'rules';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVehicles: 0,
    totalConsultations: 0,
    totalSymptoms: 0,
    totalFaults: 0,
    totalSolutions: 0,
    totalRules: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch real stats from APIs
      const [symptomsRes, faultsRes, solutionsRes, rulesRes] = await Promise.all([
        fetch('/api/admin/symptoms'),
        fetch('/api/admin/faults'),
        fetch('/api/admin/solutions'),
        fetch('/api/admin/rules')
      ]);

      const [symptomsData, faultsData, solutionsData, rulesData] = await Promise.all([
        symptomsRes.json(),
        faultsRes.json(),
        solutionsRes.json(),
        rulesRes.json()
      ]);

      setStats({
        totalUsers: 0, // Remove dummy data - would need user API
        totalVehicles: 0, // Remove dummy data - would need vehicle API
        totalConsultations: 0, // Remove dummy data - would need consultation API
        totalSymptoms: symptomsData.symptoms?.length || 0,
        totalFaults: faultsData.faults?.length || 0,
        totalSolutions: solutionsData.solutions?.length || 0,
        totalRules: rulesData.rules?.length || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Fallback - no dummy data
      setStats({
        totalUsers: 0,
        totalVehicles: 0,
        totalConsultations: 0,
        totalSymptoms: 0,
        totalFaults: 0,
        totalSolutions: 0,
        totalRules: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    fetchAdminStats();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                Manage system components and monitor platform statistics
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {[
                    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
                    { id: 'symptoms', name: 'Symptoms', icon: '🩺' },
                    { id: 'faults', name: 'Faults', icon: '⚠️' },
                    { id: 'solutions', name: 'Solutions', icon: '💡' },
                    { id: 'rules', name: 'Rules', icon: '📋' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ActiveTab)}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {stats.totalUsers > 0 && (
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
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
                  )}

                  {stats.totalVehicles > 0 && (
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
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
                  )}

                  {stats.totalConsultations > 0 && (
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="text-3xl">🔧</div>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Consultations
                              </dt>
                              <dd className="text-lg font-medium text-gray-900">
                                {stats.totalConsultations}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="text-3xl">📋</div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Rules
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.totalRules}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Knowledge Base Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Base Overview</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl mb-2">🩺</div>
                      <div className="text-2xl font-bold text-blue-600">{stats.totalSymptoms}</div>
                      <div className="text-sm text-blue-700">Symptoms</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-2xl mb-2">⚠️</div>
                      <div className="text-2xl font-bold text-red-600">{stats.totalFaults}</div>
                      <div className="text-sm text-red-700">Faults</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl mb-2">💡</div>
                      <div className="text-2xl font-bold text-green-600">{stats.totalSolutions}</div>
                      <div className="text-sm text-green-700">Solutions</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button 
                      onClick={() => setActiveTab('symptoms')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 text-sm"
                    >
                      Manage Symptoms
                    </button>
                    <button 
                      onClick={() => setActiveTab('faults')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 text-sm"
                    >
                      Manage Faults
                    </button>
                    <button 
                      onClick={() => setActiveTab('solutions')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 text-sm"
                    >
                      Manage Solutions
                    </button>
                    <button 
                      onClick={() => setActiveTab('rules')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 text-sm"
                    >
                      Manage Rules
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'symptoms' && <SymptomsManager onUpdate={refreshStats} />}
            {activeTab === 'faults' && <FaultsManager onUpdate={refreshStats} />}
            {activeTab === 'solutions' && <SolutionsManager onUpdate={refreshStats} />}
            {activeTab === 'rules' && <RulesManager onUpdate={refreshStats} />}
          </div>
        </div>
      </div>
    </Layout>
  );
}