'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { volunteersApi } from '@/lib/api';
import Link from 'next/link';

const VOLUNTEER_CATEGORIES = [
  'CLEANUP', 'SAFETY_PATROL', 'EVENT_HELP', 'TUTORING', 'FOOD_DRIVE',
  'ELDERLY_CARE', 'ANIMAL_SHELTER', 'GARDENING', 'OTHER'
];

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
  status: string;
  createdAt: string;
  organizer: { id: string; name: string };
}

interface VolunteerStats {
  totalHours: number;
  opportunitiesCompleted: number;
  currentBadge: string;
}

interface LeaderboardEntry {
  userId: string;
  totalHours: number;
  currentBadge: string;
  user: { name: string };
}

export default function VolunteersPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<VolunteerStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'opportunities' | 'my-signups' | 'leaderboard'>('opportunities');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'CLEANUP',
    location: '',
    startDate: '',
    endDate: '',
    volunteersNeeded: 10,
  });

  useEffect(() => {
    if (activeTab === 'opportunities') {
      loadOpportunities();
    } else if (activeTab === 'my-signups') {
      loadMySignups();
    } else if (activeTab === 'leaderboard') {
      loadLeaderboard();
    }
    loadStats();
  }, [filter, activeTab]);

  const loadOpportunities = async () => {
    try {
      const params = filter ? { category: filter } : {};
      const response = await volunteersApi.getOpportunities(params);
      setOpportunities(response.data);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMySignups = async () => {
    try {
      const response = await volunteersApi.getMySignups();
      setOpportunities(response.data.map((s: any) => s.opportunity));
    } catch (error) {
      console.error('Failed to load my signups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await volunteersApi.getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await volunteersApi.getMyStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSignup = async (id: string) => {
    try {
      await volunteersApi.signup(id);
      loadOpportunities();
    } catch (error) {
      console.error('Failed to sign up:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await volunteersApi.createOpportunity(formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'CLEANUP',
        location: '',
        startDate: '',
        endDate: '',
        volunteersNeeded: 10,
      });
      loadOpportunities();
    } catch (error) {
      console.error('Failed to create opportunity:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-200 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Volunteer Hub</h1>
              <div className="flex space-x-4">
                <Button onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Create Opportunity'}
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Card */}
          {stats && (
            <Card className="mb-6">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-8">
                    <div>
                      <p className="text-sm text-gray-500">Total Hours</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalHours}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.opportunitiesCompleted}</p>
                    </div>
                  </div>
                  {stats.currentBadge && (
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getBadgeColor(stats.currentBadge)}`}>
                      {stats.currentBadge} Volunteer
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`pb-2 px-1 ${activeTab === 'opportunities' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              Opportunities
            </button>
            <button
              onClick={() => setActiveTab('my-signups')}
              className={`pb-2 px-1 ${activeTab === 'my-signups' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              My Signups
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-2 px-1 ${activeTab === 'leaderboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              Leaderboard
            </button>
          </div>

          {/* Category Filter */}
          {activeTab === 'opportunities' && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={filter === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('')}
              >
                All
              </Button>
              {VOLUNTEER_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={filter === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(cat)}
                >
                  {getCategoryLabel(cat)}
                </Button>
              ))}
            </div>
          )}

          {/* Create Form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create Volunteer Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      >
                        {VOLUNTEER_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                    <Input
                      label="Volunteers Needed"
                      type="number"
                      value={formData.volunteersNeeded}
                      onChange={(e) => setFormData({ ...formData, volunteersNeeded: parseInt(e.target.value) })}
                      required
                    />
                    <Input
                      label="Start Date & Time"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                    <Input
                      label="End Date & Time"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      rows={3}
                      required
                    />
                  </div>
                  <Button type="submit">Create Opportunity</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              {activeTab === 'leaderboard' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Volunteers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {leaderboard.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No volunteer data yet</p>
                    ) : (
                      <div className="space-y-4">
                        {leaderboard.map((entry, index) => (
                          <div key={entry.userId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0 ? 'bg-yellow-400 text-white' :
                                index === 1 ? 'bg-gray-300 text-gray-800' :
                                index === 2 ? 'bg-orange-400 text-white' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{entry.user?.name}</p>
                                <p className="text-sm text-gray-500">{entry.totalHours} hours</p>
                              </div>
                            </div>
                            {entry.currentBadge && (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(entry.currentBadge)}`}>
                                {entry.currentBadge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                opportunities.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-500">
                        {activeTab === 'my-signups' ? "You haven't signed up for any opportunities" : 'No opportunities available'}
                      </p>
                      {activeTab === 'opportunities' && (
                        <Button className="mt-4" onClick={() => setShowForm(true)}>Create One</Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {opportunities.map((opp) => (
                      <Card key={opp.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {getCategoryLabel(opp.category)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {opp.volunteersSignedUp}/{opp.volunteersNeeded} signed up
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{opp.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{opp.description}</p>
                          <div className="space-y-1 text-sm text-gray-500">
                            <p>📍 {opp.location}</p>
                            <p>📅 {new Date(opp.startDate).toLocaleString()}</p>
                          </div>
                          <p className="mt-2 text-xs text-gray-400">Organized by: {opp.organizer?.name}</p>
                          {activeTab === 'opportunities' && (
                            <Button
                              className="mt-3 w-full"
                              size="sm"
                              onClick={() => handleSignup(opp.id)}
                              disabled={opp.volunteersSignedUp >= opp.volunteersNeeded}
                            >
                              {opp.volunteersSignedUp >= opp.volunteersNeeded ? 'Full' : 'Sign Up'}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
