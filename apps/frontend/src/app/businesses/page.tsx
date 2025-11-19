'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, Button } from '@/components/ui';
import { businessesApi } from '@/lib/api';
import Link from 'next/link';

interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: any;
  verified: boolean;
  averageRating: number;
  _count: {
    reviews: number;
  };
}

const categories = [
  'All',
  'RESTAURANT',
  'RETAIL',
  'SERVICES',
  'HEALTHCARE',
  'EDUCATION',
  'AUTOMOTIVE',
  'HOME_SERVICES',
  'PROFESSIONAL',
  'OTHER',
];

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await businessesApi.getAll();
      setBusinesses(response.data);
    } catch (err) {
      console.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses =
    selectedCategory === 'All'
      ? businesses
      : businesses.filter((b) => b.category === selectedCategory);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Business Directory
                </h1>
                <p className="text-gray-600 mt-1">
                  Discover and support local businesses
                </p>
              </div>
              <Link href="/businesses/claim">
                <Button variant="primary">Claim Your Business</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.replace('_', ' ')}
              </Button>
            ))}
          </div>

          {/* Businesses Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading businesses...</p>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600">
                  No businesses found in this category
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <Card
                  key={business.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent padding="md">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {business.name}
                          </h3>
                          {business.verified && (
                            <span className="text-blue-600" title="Verified">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                          {business.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {business.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span className="line-clamp-1">{business.address}</span>
                      </div>
                      {business.phone && (
                        <div className="flex items-center">
                          <span className="mr-2">📞</span>
                          <span>{business.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="mr-2">⭐</span>
                        <span>
                          {business.averageRating > 0
                            ? `${business.averageRating.toFixed(1)} (${business._count.reviews} reviews)`
                            : 'No reviews yet'}
                        </span>
                      </div>
                    </div>

                    <Link href={`/businesses/${business.id}`}>
                      <Button variant="primary" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
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
