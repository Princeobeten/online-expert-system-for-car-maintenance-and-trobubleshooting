'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Ensure cookies are sent
      });
      console.log('Auth response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('User data:', data.user);
        setUser(data.user);
      } else {
        console.log('Auth failed, redirecting to login');
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Vehicles', href: '/vehicles', icon: '🚗' },
    { name: 'Consultation', href: '/consultation', icon: '🔧' },
    { name: 'History', href: '/history', icon: '📊' },
  ];

  if (user?.role === 'Admin') {
    navigation.push({ name: 'Admin', href: '/admin', icon: '⚙️' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                  <span className="hidden sm:inline">Car Expert System</span>
                  <span className="sm:hidden">CarExpert</span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <span className="text-gray-700 text-sm">
                Welcome, <span className="font-medium">{user?.fullname}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} relative z-30`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 shadow-lg">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={closeMobileMenu}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Mobile User Info and Logout */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="px-3 py-2">
                <div className="text-base font-medium text-gray-800">{user?.fullname}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
                <div className="text-xs text-gray-400 mt-1">Role: {user?.role}</div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-25 md:hidden" 
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}