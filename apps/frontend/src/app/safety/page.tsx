'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, Button } from '@/components/ui';
import { safetyApi } from '@/lib/api';
import Link from 'next/link';

interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'RESOLVED' | 'EXPIRED';
  location: string;
  reporter: {
    name: string;
  };
  isAuthorityVerified: boolean;
  createdAt: string;
  expiresAt?: string;
}

const severityColors = {
  LOW: 'bg-blue-100 text-blue-800 border-blue-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  CRITICAL: 'bg-red-100 text-red-800 border-red-200',
};

const severityIcons = {
  LOW: 'ℹ️',
  MEDIUM: '⚠️',
  HIGH: '🚨',
  CRITICAL: '🆘',
};

export default function SafetyAlertsPage() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    // Poll for new alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await safetyApi.getActive();
      setAlerts(response.data);
    } catch (err) {
      console.error('Failed to load safety alerts');
    } finally {
      setLoading(false);
    }
  };

  const getAlertTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      CRIME: '🚔',
      FIRE: '🔥',
      WEATHER: '⛈️',
      TRAFFIC: '🚦',
      UTILITY: '⚡',
      HEALTH: '🏥',
      GENERAL: '📢',
      OTHER: '⚠️',
    };
    return icons[type] || '📢';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Safety Alerts
                </h1>
                <p className="text-gray-600 mt-1">
                  Stay informed about neighborhood safety
                </p>
              </div>
              <Link href="/safety/create">
                <Button variant="primary">Report Alert</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Active Alerts Count */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔔</span>
                <div>
                  <p className="font-semibold text-blue-900">
                    {alerts.length} Active Alert{alerts.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-blue-700">
                    Automatically refreshes every 30 seconds
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading safety alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <span className="text-6xl mb-4 block">✅</span>
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  All Clear
                </p>
                <p className="text-gray-600">
                  No active safety alerts in your neighborhood
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`border-l-4 ${
                    severityColors[alert.severity]
                  } hover:shadow-lg transition-shadow`}
                >
                  <CardContent padding="md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">
                            {severityIcons[alert.severity]}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900">
                            {alert.title}
                          </h3>
                          {alert.isAuthorityVerified && (
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800"
                              title="Verified by authorities"
                            >
                              ✓ VERIFIED
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {getAlertTypeIcon(alert.type)} {alert.type}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                              severityColors[alert.severity]
                            }`}
                          >
                            {alert.severity}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {alert.status}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4">{alert.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="mr-2">📍</span>
                            <span>{alert.location}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">👤</span>
                            <span>Reported by {alert.reporter.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">🕒</span>
                            <span>
                              {new Date(alert.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {alert.expiresAt && (
                          <div className="mt-3 text-sm text-gray-600">
                            <span className="mr-2">⏰</span>
                            Expires:{' '}
                            {new Date(alert.expiresAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link href={`/safety/${alert.id}`}>
                        <Button variant="primary" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Safety Tips */}
          <Card className="mt-8">
            <CardContent padding="md">
              <h3 className="font-bold text-lg mb-3">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Report suspicious activity immediately through the "Report
                    Alert" button
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    For emergencies, always call 911 first, then post an alert
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Enable push notifications to receive real-time safety alerts
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Verified alerts from authorities are marked with a green
                    checkmark
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
