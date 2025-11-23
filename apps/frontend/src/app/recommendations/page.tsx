'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { recommendationsApi } from '@/lib/api';
import Link from 'next/link';

const SERVICE_CATEGORIES = [
  'PLUMBER', 'ELECTRICIAN', 'HANDYMAN', 'CLEANER', 'LANDSCAPER',
  'PAINTER', 'HVAC', 'PEST_CONTROL', 'LOCKSMITH', 'MOVING', 'OTHER'
];

interface Recommendation {
  id: string;
  providerName: string;
  category: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  priceRange?: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  recommender: { name: string };
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    providerName: '',
    category: 'PLUMBER',
    description: '',
    phone: '',
    email: '',
    website: '',
    priceRange: '$$',
  });

  useEffect(() => {
    loadRecommendations();
  }, [filter]);

  const loadRecommendations = async () => {
    try {
      const params = filter ? { category: filter } : {};
      const response = await recommendationsApi.getAll(params);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadRecommendations();
      return;
    }
    try {
      const response = await recommendationsApi.search(searchQuery);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to search:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recommendationsApi.create(formData);
      setShowForm(false);
      setFormData({
        providerName: '',
        category: 'PLUMBER',
        description: '',
        phone: '',
        email: '',
        website: '',
        priceRange: '$$',
      });
      loadRecommendations();
    } catch (error) {
      console.error('Failed to create recommendation:', error);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const getCategoryLabel = (category: string) => {
    return category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Recommendations</h1>
              <div className="flex space-x-4">
                <Button onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Add Recommendation'}
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Search service providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('')}
            >
              All
            </Button>
            {SERVICE_CATEGORIES.map((cat) => (
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

          {/* Create Form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recommend a Service Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Provider Name"
                      value={formData.providerName}
                      onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      >
                        {SERVICE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                      label="Website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                      <select
                        value={formData.priceRange}
                        onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      >
                        <option value="$">$ - Budget</option>
                        <option value="$$">$$ - Moderate</option>
                        <option value="$$$">$$$ - Premium</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description & Why You Recommend</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      rows={3}
                      required
                    />
                  </div>
                  <Button type="submit">Submit Recommendation</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Recommendations Grid */}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : recommendations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No recommendations found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {getCategoryLabel(rec.category)}
                      </span>
                      <span className="text-sm font-medium text-gray-600">{rec.priceRange}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{rec.providerName}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-yellow-500">{renderStars(rec.averageRating)}</span>
                      <span className="text-sm text-gray-500">({rec.totalReviews} reviews)</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">{rec.description}</p>
                    <div className="space-y-1 text-sm">
                      {rec.phone && <p className="text-gray-600 dark:text-gray-400">Phone: {rec.phone}</p>}
                      {rec.email && <p className="text-gray-600 dark:text-gray-400">Email: {rec.email}</p>}
                      {rec.website && (
                        <a href={rec.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Visit Website
                        </a>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-gray-400">Recommended by: {rec.recommender?.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
