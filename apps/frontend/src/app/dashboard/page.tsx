'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FeedList } from '@/components/features/FeedList';
import { UpcomingEvents } from '@/components/features/UpcomingEvents';
import { QuickActions } from '@/components/features/QuickActions';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {user?.neighborhood?.name || 'Your neighborhood community'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/notifications">
                  <button className="relative p-2 text-gray-600 hover:text-gray-900">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  </button>
                </Link>
                <Link href="/profile">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Feed */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Community Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <FeedList />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <QuickActions />
              <UpcomingEvents />

              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Link
                      href="/events"
                      className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <span className="font-medium">📅 Events</span>
                    </Link>
                    <Link
                      href="/marketplace"
                      className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <span className="font-medium">🛒 Marketplace</span>
                    </Link>
                    <Link
                      href="/groups"
                      className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <span className="font-medium">👥 Groups</span>
                    </Link>
                    <Link
                      href="/businesses"
                      className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <span className="font-medium">🏪 Businesses</span>
                    </Link>
                    <Link
                      href="/safety"
                      className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <span className="font-medium">🚨 Safety Alerts</span>
                    </Link>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
